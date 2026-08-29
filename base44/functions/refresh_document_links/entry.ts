import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { cleanDirectUrl } from '../../shared/urls.ts';
import { TRUTH_MANDATE } from '../../shared/truthMandate.ts';

const SCHEMA = {
  type: 'object',
  properties: {
    links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          source_url: { type: 'string' },
          document_url: { type: 'string' }
        },
        required: ['id']
      }
    }
  },
  required: ['links']
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const all = await base44.asServiceRole.entities.GovernmentDocument.list('-created_date', 500);
    const missing = (all || []).filter((d: any) => !d.source_url && !d.document_url);
    if (!missing.length) {
      return Response.json({ refreshed: 0, message: 'No documents missing direct links.' });
    }

    const items = missing.map((d: any) => ({
      id: d.id,
      title: d.title,
      topic: d.topic || '',
      agency: d.agency || '',
      country: d.country || '',
      scripture_reference: d.scripture_reference || '',
      date: d.date || ''
    }));

    const prompt = `${TRUTH_MANDATE}

TASK: Find the DIRECT document link for each of the following government / archival documents. For each item, search online and return the most specific, direct URL to the actual document, article, or PDF — NOT a homepage, portal, search page, or reading-room query form.

For released email archives and FOIA requests/replies, link to the SPECIFIC document: the individual email PDF, the specific FOIA request/response page, or the specific document record on a recognized repository that hosts the actual released primary document (National Archives catalog page, archive.org item page, MuckRock request page, an agency reading-room direct PDF, or a Vatican archive direct document page).

REPOSITORY GUIDANCE — search these specific repositories for each category and return the direct document URL you verify:
- Released Hillary Clinton emails: the specific email at https://wikileaks.org/clinton-emails/emailid/<id> OR the specific released PDF at https://foia.state.gov/DOCUMENTS/.../C<docno>.pdf. For an email known by a phrase (e.g. "sacrificing a chicken to Moloch"), find its specific email id.
- U.S. State Department FOIA log entries / log line items: the direct log PDF at https://foia.state.gov/FOIALIBRARY/Logs/StateLog<year>.pdf (e.g. StateLog2018.pdf, StateLog2019.pdf). Use the year matching the request.
- Specific State Dept FOIA case/document numbers (e.g. F-2014-20439, Doc C06166438): the specific released PDF under https://foia.state.gov/DOCUMENTS/... matching that case and document number.
- British Mandate for Palestine (1922), San Remo Resolution (1920): the direct text page at the Yale Avalon Project (avalon.law.yale.edu/20th_century/...) or the League of Nations / treaty-series page.
- U.S. recognition of Israel (1948): the direct document at the Truman Library (trumanlibrary.gov) or history.state.gov.
- Vatican archive openings (e.g. Pius XII archives 2020): the direct press release / page at vatican.va or archivioapostolicovaticano.va.
- Israel Antiquities Authority — Dead Sea Scrolls: the direct archive page at deadseascrolls.org.il.
- FBI FOIA files: the direct file page at vault.fbi.gov/<slug>.
- UK National Archives records: the direct catalog page at discovery.nationalarchives.gov.uk/details/r/<id>.
- DOJ press releases / forfeiture actions: the direct press-release page or PDF at justice.gov.

For each item return its id and the best direct source_url and document_url you verify. Prefer setting BOTH source_url and document_url to the same direct link when only one direct link exists. If you genuinely cannot verify a direct link for an item after searching, return empty strings for that item — do NOT return a homepage, search page, portal, or search-engine URL.

Items:
${JSON.stringify(items)}

Return only the JSON object matching the schema.`;

    const result: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: SCHEMA
    });

    const links = Array.isArray(result?.links) ? result.links : [];
    const updates: any[] = [];
    for (const l of links) {
      const id = String(l.id || '').trim();
      if (!id) continue;
      const su = cleanDirectUrl(l.source_url);
      const du = cleanDirectUrl(l.document_url);
      if (!su && !du) continue;
      const upd: any = { id };
      if (su) upd.source_url = su;
      if (du) upd.document_url = du;
      updates.push(upd);
    }

    if (updates.length) await base44.asServiceRole.entities.GovernmentDocument.bulkUpdate(updates);

    return Response.json({ refreshed: updates.length, attempted: missing.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}