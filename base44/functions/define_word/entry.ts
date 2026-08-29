import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildWordPrompt } from '../../shared/truthMandate.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const word = (body?.word || '').trim();
    const reference = (body?.reference || '').trim();
    if (!word) return Response.json({ error: 'A word is required.' }, { status: 400 });

    const prompt = buildWordPrompt(word, reference);

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          definition: { type: 'string' },
          original_language: { type: 'string' },
          original_word: { type: 'string' },
          original_meaning: { type: 'string' },
          era_context: { type: 'string' }
        },
        required: ['definition', 'original_language', 'original_meaning']
      }
    });

    return Response.json({
      definition: result?.definition || '',
      original_language: result?.original_language || '',
      original_word: result?.original_word || '',
      original_meaning: result?.original_meaning || '',
      era_context: result?.era_context || ''
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}