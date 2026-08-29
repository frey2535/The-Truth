import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildCrossReferencePrompt, normalizeSource } from '../../shared/truthMandate.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const reference = (body?.reference || '').trim();
    const topic = (body?.topic || '').trim();
    if (!reference) return Response.json({ error: 'A scripture reference is required.' }, { status: 400 });

    const prompt = buildCrossReferencePrompt(reference, topic);

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          references: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                reference: { type: 'string' },
                source: { type: 'string' },
                text: { type: 'string' },
                relationship: { type: 'string' },
                direction: { type: 'string' }
              },
              required: ['reference', 'source', 'text']
            }
          }
        },
        required: ['references']
      }
    });

    const references = Array.isArray(result?.references)
      ? result.references.map((r: any) => ({
          reference: String(r.reference || '').trim(),
          source: normalizeSource(r.source),
          text: String(r.text || '').trim(),
          relationship: String(r.relationship || '').trim(),
          direction: String(r.direction || '').trim()
        })).filter((r: any) => r.reference && r.text)
      : [];

    return Response.json({ references });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}