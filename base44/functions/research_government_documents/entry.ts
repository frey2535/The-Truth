import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildGovernmentPrompt } from '../../shared/truthMandate.ts';
import { dedupeAndCreate } from '../../shared/research.ts';
import { cleanDirectUrl } from '../../shared/urls.ts';

function normalizeDocType(s: string): string {
  const v = (s || '').toLowerCase();
  if (v.includes('email') || v.includes('correspondence')) return 'email';
  if (v.includes('foia') && (v.includes('repl') || v.includes('response') || v.includes('answer'))) return 'foia_reply';
  if (v.includes('foia') || v.includes('freedom of information')) return 'foia_request';
  if (v.includes('vatican') || v.includes('archiv') || v.includes('papal') || v.includes('apostolic')) return 'vatican_archive';
  if (v.includes('article')) return 'article';
  if (v.includes('publish') || v.includes('document') || v.includes('report') || v.includes('record') || v.includes('official')) return 'published_document';
  return 'other';
}

const FOCUSES = [
  'RELEASED EMAIL ARCHIVES: publicly released government email collections and FOIA email releases (e.g. the State Department release of Hillary Clinton emails, congressional email releases, agency email releases worldwide). Find EVERY released email referencing the topic — including references to Gilgamesh and his tomb, Moloch / Molech and sacrifice, Baal, Asherah, Nimrod, the Nephilim, the Dead Sea Scrolls, the Temple Mount, and biblical archaeology. Quote the actual released text and give the real public source URL. Do NOT omit any matching email; do NOT self-censor.',
  'PUBLISHED GOVERNMENT DOCUMENTS, REPORTS, and OFFICIAL RECORDS from ALL countries and agencies across the globe (treaties, mandates, declarations, official reports, state archives) that pertain to the topic.',
  'FOIA REQUESTS and their REPLIES from any country or agency that pertain to the topic.',
  'VATICAN ARCHIVE DOCUMENTS, papal records, and related Church documents where publicly available (e.g. Nostra Aetate, opened Pius XII archives, Codex Vaticanus digitization, Vatican Apostolic Archive access rules).'
];

const SCHEMA = {
  type: 'object',
  properties: {
    documents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          document_type: { type: 'string' },
          agency: { type: 'string' },
          country: { type: 'string' },
          scripture_reference: { type: 'string' },
          topic: { type: 'string' },
          source_url: { type: 'string' },
          document_url: { type: 'string' },
          date: { type: 'string' },
          confirms_scripture: { type: 'boolean' },
          verification_note: { type: 'string' },
          chronological_order: { type: 'number' }
        },
        required: ['title', 'document_type']
      }
    }
  },
  required: ['documents']
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const topic = (body?.topic || '').trim();
    const reference = (body?.reference || '').trim();
    if (!topic && !reference) return Response.json({ error: 'A topic or scripture reference is required.' }, { status: 400 });

    const basePrompt = buildGovernmentPrompt(topic, reference);

    const results = await Promise.all(
      FOCUSES.map((focus) =>
        base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: basePrompt + '\n\nFOCUS THIS PASS ONLY ON: ' + focus + '\nReturn ONLY items within this focus area. Be EXHAUSTIVE within it — list every verifiable document you can find. If none apply, return an empty documents array.',
          add_context_from_internet: true,
          model: 'gemini_3_flash',
          response_json_schema: SCHEMA
        }).catch(() => ({}))
      )
    );

    const dedupeRef = topic || reference;
    const seen = new Set<string>();
    const records: any[] = [];
    for (const result of results) {
      const items = Array.isArray(result?.documents) ? result.documents : [];
      for (const d of items) {
        const title = String(d.title || '').trim();
        if (!title) continue;
        const key = title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        records.push({
          title,
          description: String(d.description || '').trim(),
          document_type: normalizeDocType(d.document_type),
          agency: String(d.agency || '').trim(),
          country: String(d.country || '').trim(),
          scripture_reference: String(d.scripture_reference || reference || '').trim(),
          topic: String(d.topic || topic || '').trim(),
          source_url: cleanDirectUrl(d.source_url),
          document_url: cleanDirectUrl(d.document_url),
          date: String(d.date || '').trim(),
          confirms_scripture: !!d.confirms_scripture,
          verification_note: String(d.verification_note || '').trim(),
          chronological_order: Number(d.chronological_order) || 0
        });
      }
    }
    const FACT_CHECK_RE = /(fact[\s-]?check|debunk|debunked|misinformation|disinformation|false\s+claim|false\s+story|not\s+true|conspiracy\s+theory|viral\s+claim|myth|hoax|snopes|politifact|factcheck\.org|lead\s+stories|reuters\s+fact|ap\s+fact)/i;
    const valid = records
      .filter((d) => d.title)
      .filter((d) => !FACT_CHECK_RE.test(d.title) && !FACT_CHECK_RE.test(d.description) && !FACT_CHECK_RE.test(d.verification_note || ''));

    const created = await dedupeAndCreate(base44, {
      entityName: 'GovernmentDocument',
      refField: 'topic',
      reference: dedupeRef,
      records: valid
    });

    return Response.json({ documents: valid, created, passes: FOCUSES.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}