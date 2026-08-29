import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildResearchPrompt, normalizeSource } from '../../shared/truthMandate.ts';

export default async function(req: Request): Promise<Response> {
  let base44: any = null;
  let planId = '';
  try {
    base44 = createClientFromRequest(req);

    const body = await req.json();
    const topic = (body?.topic || '').trim();
    planId = (body?.plan_id || '').trim();
    if (!topic) return Response.json({ error: 'A topic is required.' }, { status: 400 });
    if (!planId) return Response.json({ error: 'A study plan id is required.' }, { status: 400 });

    const plan = await base44.asServiceRole.entities.StudyPlan.get(planId);
    const ownerId = plan?.created_by_id || '';

    const prompt = buildResearchPrompt(topic);

    const schema = {
      type: 'object',
      properties: {
        verses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              reference: { type: 'string' },
              source: { type: 'string' },
              text: { type: 'string' },
              era: { type: 'string' },
              chronological_order: { type: 'number' },
              context_note: { type: 'string' }
            },
            required: ['reference', 'source', 'text', 'chronological_order']
          }
        },
        summary: { type: 'string' },
        derivatives: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['verses']
    };

    let result: any = null;
    try {
      result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: schema
      });
    } catch {}

    let verses = Array.isArray(result?.verses) ? result.verses : [];

    // The web-enabled call can occasionally return no passages; retry once without web search
    // (the model knows the corpus natively, so this is fast and usually succeeds).
    if (!verses.length) {
      try {
        result = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: false,
          model: 'gemini_3_flash',
          response_json_schema: schema
        });
        verses = Array.isArray(result?.verses) ? result.verses : [];
      } catch {}
    }

    const derivatives = Array.isArray(result?.derivatives)
      ? result.derivatives.map((d: any) => String(d).trim()).filter(Boolean)
      : [];

    if (!verses.length) {
      await base44.asServiceRole.entities.StudyPlan.update(planId, { status: 'failed' });
      return Response.json(
        { error: 'The research model returned no passages for this topic. Please try again.' },
        { status: 500 }
      );
    }

    if (verses.length) {
      await base44.asServiceRole.entities.StudyVerse.bulkCreate(
        verses.map((v: any) => ({
          plan_id: planId,
          owner_id: ownerId,
          reference: String(v.reference || '').trim(),
          source: normalizeSource(v.source),
          text: String(v.text || '').trim(),
          chronological_order: Number(v.chronological_order) || 0,
          era: String(v.era || '').trim(),
          context_note: String(v.context_note || '').trim()
        })).filter((v: any) => v.reference && v.text)
      );
    }

    await base44.asServiceRole.entities.StudyPlan.update(planId, {
      status: 'complete',
      verse_count: verses.length,
      description: String(result?.summary || '').trim(),
      derivatives: derivatives.join(', ')
    });

    return Response.json({ verses, summary: result?.summary || '', derivatives });
  } catch (error) {
    if (planId && base44) {
      try { await base44.asServiceRole.entities.StudyPlan.update(planId, { status: 'failed' }); } catch {}
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}