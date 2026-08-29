import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildInvestigatePrompt } from '../../shared/truthMandate.ts';

const SCHEMA = {
  type: 'object',
  properties: {
    query: { type: 'string' },
    verdict: { type: 'string' },
    biblical_record: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          reference: { type: 'string' },
          source: { type: 'string' },
          text: { type: 'string' },
          relevance: { type: 'string' }
        }
      }
    },
    manuscript_evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          date: { type: 'string' },
          description: { type: 'string' },
          source_url: { type: 'string' }
        }
      }
    },
    archaeological_evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          era: { type: 'string' },
          location: { type: 'string' },
          description: { type: 'string' },
          source_url: { type: 'string' }
        }
      }
    },
    historical_evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          date: { type: 'string' },
          description: { type: 'string' },
          source_url: { type: 'string' }
        }
      }
    },
    scientific_evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          field: { type: 'string' },
          description: { type: 'string' },
          source_url: { type: 'string' }
        }
      }
    },
    prophecy_evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          reference: { type: 'string' },
          description: { type: 'string' },
          source_url: { type: 'string' }
        }
      }
    },
    supporting_evidence: { type: 'array', items: { type: 'string' } },
    challenging_evidence: { type: 'array', items: { type: 'string' } },
    alternative_interpretations: { type: 'array', items: { type: 'string' } },
    scholarly_positions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: { type: 'string' },
          summary: { type: 'string' }
        }
      }
    },
    primary_sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          type: { type: 'string' },
          tier: { type: 'string' }
        }
      }
    },
    conclusion: {
      type: 'object',
      properties: {
        established: { type: 'array', items: { type: 'string' } },
        strongly_supported: { type: 'array', items: { type: 'string' } },
        disputed: { type: 'array', items: { type: 'string' } },
        cannot_demonstrate: { type: 'array', items: { type: 'string' } },
        summary: { type: 'string' }
      }
    }
  },
  required: ['query', 'verdict', 'conclusion']
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const query = (body?.query || '').trim();
    if (!query) return Response.json({ error: 'A claim or question is required.' }, { status: 400 });

    const dossier = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: buildInvestigatePrompt(query),
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: SCHEMA
    });

    return Response.json({ dossier });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}