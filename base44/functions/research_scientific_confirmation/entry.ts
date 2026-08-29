import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildScientificPrompt } from '../../shared/truthMandate.ts';
import { dedupeAndCreate } from '../../shared/research.ts';

const FOCUSES = [
  'OCEANOGRAPHY, HYDROLOGY, and METEOROLOGY: ocean currents, springs of the sea, the water cycle, atmospheric circulation, weather, and related findings.',
  'ASTRONOMY, COSMOLOGY, and PHYSICS: the spherical earth, the expansion of the universe, the number of stars, light, entropy, the weight of air, and related findings.',
  'BIOLOGY, GENETICS, and MEDICINE: reproduction after its kind, DNA, blood as life, circumcision, quarantine, hygiene, health and emotion, and related findings.',
  'GEOLOGY, EARTH SCIENCES, and ARCHAEOLOGY-CONFIRMING SCIENCE: earth structure, mountains under the sea, valley springs, and scientific findings that corroborate biblical geography or history.'
];

const SCHEMA = {
  type: 'object',
  properties: {
    confirmations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          scripture_reference: { type: 'string' },
          scientific_field: { type: 'string' },
          source_url: { type: 'string' },
          article_url: { type: 'string' },
          publication: { type: 'string' },
          date: { type: 'string' },
          verification_note: { type: 'string' },
          chronological_order: { type: 'number' }
        },
        required: ['title', 'description', 'scripture_reference']
      }
    }
  },
  required: ['confirmations']
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const reference = (body?.reference || '').trim();
    const topic = (body?.topic || '').trim();
    if (!reference && !topic) return Response.json({ error: 'A scripture reference or topic is required.' }, { status: 400 });

    const basePrompt = buildScientificPrompt(reference, topic);

    const results = await Promise.all(
      FOCUSES.map((focus) =>
        base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: basePrompt + '\n\nFOCUS THIS PASS ONLY ON: ' + focus + '\nReturn ONLY items within this focus area. Be EXHAUSTIVE within it — list every verifiable scientific finding you can find that confirms the text. If none apply, return an empty confirmations array.',
          add_context_from_internet: true,
          model: 'gemini_3_flash',
          response_json_schema: SCHEMA
        }).catch(() => ({}))
      )
    );

    const seen = new Set<string>();
    const records: any[] = [];
    for (const result of results) {
      const items = Array.isArray(result?.confirmations) ? result.confirmations : [];
      for (const c of items) {
        const title = String(c.title || '').trim();
        if (!title) continue;
        const key = title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        records.push({
          title,
          description: String(c.description || '').trim(),
          scripture_reference: String(c.scripture_reference || reference || '').trim(),
          scientific_field: String(c.scientific_field || '').trim(),
          source_url: String(c.source_url || '').trim(),
          article_url: String(c.article_url || '').trim(),
          publication: String(c.publication || '').trim(),
          date: String(c.date || '').trim(),
          verification_note: String(c.verification_note || '').trim(),
          chronological_order: Number(c.chronological_order) || 0
        });
      }
    }
    const valid = records.filter((c) => c.title && c.description);

    const created = await dedupeAndCreate(base44, {
      entityName: 'ScientificConfirmation',
      refField: 'scripture_reference',
      reference: reference || topic,
      records: valid
    });

    return Response.json({ confirmations: valid, created, passes: FOCUSES.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}