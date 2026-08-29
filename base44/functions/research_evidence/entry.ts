import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildEvidencePrompt } from '../../shared/truthMandate.ts';
import { dedupeAndCreate } from '../../shared/research.ts';

function normalizeType(s: string): string {
  const v = (s || '').toLowerCase();
  if (v.includes('artifact') || v.includes('seal') || v.includes('bulla') || v.includes('coin') || v.includes('pottery') || v.includes('monument') || v.includes('jewel') || v.includes('object') || v.includes('relic')) return 'artifact';
  if (v.includes('scroll')) return 'scroll';
  if (v.includes('inscription') || v.includes('stele') || v.includes('stela') || v.includes('epigraph') || v.includes('ostracon')) return 'inscription';
  if (v.includes('site') || v.includes('excavat') || v.includes('ruin') || v.includes('tomb') || v.includes('church') || v.includes('basilica') || v.includes('catacomb') || v.includes('city') || v.includes('temple') || v.includes('synagogue')) return 'archaeological_site';
  if (v.includes('manuscript') || v.includes('codex') || v.includes('papyrus') || v.includes('fragment') || v.includes('papyri')) return 'manuscript';
  if (v.includes('histor') || v.includes('record') || v.includes('chronicle') || v.includes('annal') || v.includes('letter') || v.includes('writing')) return 'historical_record';
  return 'other';
}

// Each pass focuses the search on a distinct category of empirical evidence so
// that nothing is missed. All passes run in parallel and their results merged.
const FOCUSES = [
  'Archaeological SITES, EXCAVATIONS, BUILDINGS, STRUCTURES, CITIES, TOMBS, and GEOGRAPHICAL LOCATIONS that corroborate the text or its historical setting (e.g. Temple Mount, Pool of Bethesda, Capernaum, Church of the Holy Sepulchre, Qumran, Masada, Seven Churches of Revelation sites).',
  'Portable ARTIFACTS: seals, bullae, coins, pottery, jewelry, tools, sarcophagi, lamps, amulets, and objects that support the text or the people/places it names (e.g. Pilate coinage, Herodian coinage, LMLK jar handles, Water Newton treasure, Monza ampullae).',
  'INSCRIPTIONS, STELAE, OSTRACA, and EPIGRAPHIC records that corroborate the text (e.g. Pilate Stone, Tel Dan Stele, Mesha Stele, Gallio/Delphi inscription, Erastus inscription, Siloam inscription, Abercius inscription, Megiddo Akeptous inscription).',
  'MANUSCRIPTS, SCROLLS, CODICES, and PAPYRI that bear on the transmission and setting of the text — including biblical manuscripts (Dead Sea Scrolls, NT papyri P1-P137, great Greek codices, Leningrad/Aleppo Codex) and extrabiblical ancient texts.',
  'HISTORICAL RECORDS and EXTRABIBLICAL TEXTUAL REFERENCES that corroborate the people, places, or events (e.g. Josephus, Tacitus Annals 15.44, Pliny the Younger, Suetonius, Mara bar Serapion, Babylonian Chronicles, Cyrus Cylinder, royal annals).',
  'EARLY CHRISTIAN and JEWISH MATERIAL EVIDENCE: churches, catacombs, Christian inscriptions, early Christian writings (Didache, Ignatius, Polycarp, Irenaeus), liturgical objects, baptisteries, mosaics, and related Christian archaeology.'
];

const SCHEMA = {
  type: 'object',
  properties: {
    evidence: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          evidence_type: { type: 'string' },
          scripture_reference: { type: 'string' },
          era: { type: 'string' },
          location: { type: 'string' },
          source_url: { type: 'string' },
          image_url: { type: 'string' },
          verification_note: { type: 'string' },
          chronological_order: { type: 'number' }
        },
        required: ['title', 'description', 'evidence_type', 'scripture_reference']
      }
    }
  },
  required: ['evidence']
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

    const basePrompt = buildEvidencePrompt(reference, topic);

    // Run every category pass in parallel for exhaustive coverage.
    const results = await Promise.all(
      FOCUSES.map((focus) =>
        base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: basePrompt + '\n\nFOCUS THIS PASS ONLY ON: ' + focus + '\nReturn ONLY items within this focus area. Be EXHAUSTIVE within it — list every relevant item you can verify, not just the most famous. If none apply to this focus, return an empty evidence array.',
          add_context_from_internet: true,
          model: 'gemini_3_flash',
          response_json_schema: SCHEMA
        }).catch(() => ({}))
      )
    );

    // Merge all passes, deduping by title (case-insensitive).
    const seen = new Set<string>();
    const records: any[] = [];
    for (const result of results) {
      const items = Array.isArray(result?.evidence) ? result.evidence : [];
      for (const e of items) {
        const title = String(e.title || '').trim();
        if (!title) continue;
        const key = title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        records.push({
          title,
          description: String(e.description || '').trim(),
          evidence_type: normalizeType(e.evidence_type),
          scripture_reference: String(e.scripture_reference || reference || '').trim(),
          era: String(e.era || '').trim(),
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
      entityName: 'Evidence',
      refField: 'scripture_reference',
      reference: reference || topic,
      records: valid
    });

    return Response.json({ evidence: valid, created, passes: FOCUSES.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}