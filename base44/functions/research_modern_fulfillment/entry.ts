import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildModernFulfillmentPrompt } from '../../shared/truthMandate.ts';
import { dedupeAndCreate } from '../../shared/research.ts';

function normalizeFulfillmentType(s: string): string {
  const v = (s || '').toLowerCase();
  if (v.includes('prophec')) return 'prophecy_fulfillment';
  if (v.includes('archaeolog') || v.includes('discover') || v.includes('excavat') || v.includes('manuscript') || v.includes('scroll') || v.includes('artifact') || v.includes('inscription')) return 'archaeological_modern';
  if (v.includes('scientif') || v.includes('science')) return 'scientific';
  if (v.includes('histor') || v.includes('event') || v.includes('geopolit') || v.includes('war') || v.includes('founding') || v.includes('state') || v.includes('treaty') || v.includes('migration') || v.includes('return')) return 'historical_event';
  return 'other';
}

const FOCUSES = [
  'GEOPOLITICAL developments: the founding of the State of Israel (1948), wars, treaties, migrations, the return of the Jewish people (aliyah) from many nations, and related state events.',
  'MODERN ARCHAEOLOGICAL DISCOVERIES that confirm biblical events, places, or people (e.g. Dead Sea Scrolls, Pilate Stone, Tel Dan Stele, Caiaphas ossuary, Pool of Siloam, Magdala, Khirbet Qeiyafa).',
  'SCIENTIFIC or HISTORICAL findings from modern times that corroborate the text (e.g. agriculture in the desert, language revival, demographic returns).',
  'DOCUMENTED MODERN EVENTS matching specific prophetic details of the passage — be exhaustive; include every verifiable modern event that could be a fulfillment, and note honestly where it is disputed.'
];

const SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          fulfillment_type: { type: 'string' },
          prophecy_reference: { type: 'string' },
          modern_date: { type: 'string' },
          location: { type: 'string' },
          source_url: { type: 'string' },
          image_url: { type: 'string' },
          verification_note: { type: 'string' },
          chronological_order: { type: 'number' }
        },
        required: ['title', 'description', 'fulfillment_type', 'prophecy_reference']
      }
    }
  },
  required: ['items']
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const reference = (body?.reference || '').trim();
    const topic = (body?.topic || '').trim();
    if (!reference && !topic) return Response.json({ error: 'A prophecy reference or topic is required.' }, { status: 400 });

    const basePrompt = buildModernFulfillmentPrompt(reference, topic);

    const results = await Promise.all(
      FOCUSES.map((focus) =>
        base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: basePrompt + '\n\nFOCUS THIS PASS ONLY ON: ' + focus + '\nReturn ONLY items within this focus area. Be EXHAUSTIVE within it — list every verifiable modern event you can find. If none apply, return an empty items array.',
          add_context_from_internet: true,
          model: 'gemini_3_flash',
          response_json_schema: SCHEMA
        }).catch(() => ({}))
      )
    );

    const seen = new Set<string>();
    const records: any[] = [];
    for (const result of results) {
      const items = Array.isArray(result?.items) ? result.items : [];
      for (const e of items) {
        const title = String(e.title || '').trim();
        if (!title) continue;
        const key = title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        records.push({
          title,
          description: String(e.description || '').trim(),
          fulfillment_type: normalizeFulfillmentType(e.fulfillment_type),
          prophecy_reference: String(e.prophecy_reference || reference || '').trim(),
          modern_date: String(e.modern_date || '').trim(),
          location: String(e.location || '').trim(),
          source_url: String(e.source_url || '').trim(),
          image_url: String(e.image_url || '').trim(),
          verification_note: String(e.verification_note || '').trim(),
          chronological_order: Number(e.chronological_order) || 0
        });
      }
    }
    const valid = records.filter((e) => e.title && e.description);

    const created = await dedupeAndCreate(base44, {
      entityName: 'ModernFulfillment',
      refField: 'prophecy_reference',
      reference: reference || topic,
      records: valid
    });

    return Response.json({ items: valid, created, passes: FOCUSES.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}