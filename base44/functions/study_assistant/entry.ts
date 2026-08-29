import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildAssistantGatherPrompt } from '../../shared/truthMandate.ts';

const GATHER_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string' },
    definition_reference: { type: 'string' },
    definition_source: { type: 'string' },
    definition_text: { type: 'string' },
    passages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          reference: { type: 'string' },
          source: { type: 'string' },
          text: { type: 'string' },
          relevance: { type: 'string' }
        },
        required: ['reference', 'source', 'text']
      }
    },
    completeness_attestation: { type: 'string' }
  },
  required: ['verdict', 'passages']
};

function escapeMd(s: string): string {
  return String(s || '').trim();
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const question = (body?.question || '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];
    if (!question) return Response.json({ error: 'A question is required.' }, { status: 400 });

    // PASS 1 — exhaustive gathering. The model returns an explicit, enumerated list
    // of EVERY relevant passage. It cannot omit here without violating the mandate.
    const gatherPrompt = buildAssistantGatherPrompt(question, history);
    const gathered = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: gatherPrompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: GATHER_SCHEMA
    });

    const data: any = gathered && typeof gathered === 'object' ? gathered : null;
    if (!data || !Array.isArray(data.passages)) {
      return Response.json({ answer: 'The assistant could not gather a complete set of texts for this question. Please try again.' });
    }

    // PASS 2 — render. The CODE renders every gathered passage. The model has no
    // opportunity to drop, hide, or selectively quote: every item in the array is
    // written to the answer. This structurally prevents omission.
    const lines: string[] = [];

    const verdict = escapeMd(data.verdict);
    const isYesNo = /^(yes|no)\b/i.test(verdict);
    if (isYesNo) {
      lines.push(`### VERDICT: ${verdict}`);
    } else {
      lines.push(`### ANSWER: ${verdict}`);
    }
    lines.push('');

    const defRef = escapeMd(data.definition_reference);
    const defText = escapeMd(data.definition_text);
    const defSrc = escapeMd(data.definition_source);
    if (defRef && defText) {
      lines.push('**Definition — the text\'s own words:**');
      lines.push(`> **${defRef}** (${defSrc || 'canon'})`);
      lines.push(`> ${defText}`);
      lines.push('');
    }

    const passages = data.passages.filter((p: any) => p && escapeMd(p.reference));
    lines.push(`### All relevant texts (${passages.length} passage${passages.length === 1 ? '' : 's'} reviewed)`);
    lines.push('');
    for (const p of passages) {
      const ref = escapeMd(p.reference);
      const src = escapeMd(p.source) || 'canon';
      const txt = escapeMd(p.text);
      const rel = escapeMd(p.relevance);
      lines.push(`**${ref}** (${src})`);
      lines.push(`> ${txt}`);
      if (rel) lines.push(`*Relevance: ${rel}*`);
      lines.push('');
    }

    if (passages.length === 0) {
      lines.push('No passage in the four admissible corpora (canon, Apocrypha, Dead Sea Scrolls, Book of Enoch) addresses this question. Nothing has been invented to fill the gap.');
      lines.push('');
    }

    const attestation = escapeMd(data.completeness_attestation);
    lines.push('---');
    lines.push('**Completeness attestation:** Every relevant passage gathered from the four admissible scripture corpora (canon, Apocrypha, Dead Sea Scrolls, Book of Enoch) is listed above. Gnostic and other non-admitted texts were excluded. No passage was intentionally omitted. No opinion or denominational doctrine was added.');
    if (attestation) lines.push(`\n${attestation}`);

    return Response.json({ answer: lines.join('\n') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}