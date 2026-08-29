import { localEntities } from "./localEntities";
import { requireAdmin, requireUser } from "./localAuth";
import { normalizeSource } from "@/lib/truthMandate";
import { matchesToResearchVerses, partitionMatches, searchCorpus, SEARCH_CORPORA } from "@/lib/localCorpusSearch";
import { ARCHIVE_NOTICE, searchArchive } from "@/data/inAppArchive";
import { lookupLexicon } from "@/data/strongsLexicon";

function wrapResult(result) {
  if (result && typeof result === "object") {
    return { data: result, ...result };
  }
  return { data: result };
}

function fail(message) {
  return { error: message };
}

async function research_topic({ topic, plan_id }) {
  const planId = String(plan_id || "").trim();
  const t = String(topic || "").trim();
  if (!t) return fail("A topic is required.");
  if (!planId) return fail("A study plan id is required.");

  const plan = await localEntities.StudyPlan.get(planId);
  const ownerId = plan?.created_by_id || "";

  let found;
  try {
    found = await searchCorpus(t);
  } catch (error) {
    await localEntities.StudyPlan.update(planId, {
      status: "failed",
      description: error.message,
    });
    return fail(error.message);
  }

  const verses = matchesToResearchVerses(found.matches);
  const derivatives = found.forms;

  if (!verses.length) {
    await localEntities.StudyPlan.update(planId, {
      status: "failed",
      description: `No verse in the King James, Apocrypha, Dead Sea Scrolls, or 1 Enoch contains “${t}”. Try a different word or spelling.`,
    });
    return fail("No matching passages were found in the texts.");
  }

  await localEntities.StudyVerse.bulkCreate(
    verses
      .map((v) => ({
        plan_id: planId,
        owner_id: ownerId,
        reference: String(v.reference || "").trim(),
        source: normalizeSource(v.source),
        text: String(v.text || "").trim(),
        chronological_order: Number(v.chronological_order) || 0,
        era: String(v.era || "").trim(),
        context_note: String(v.context_note || "").trim(),
      }))
      .filter((v) => v.reference && v.text)
  );

  const summary = `${verses.length} passage${verses.length === 1 ? "" : "s"} quoted from the texts and records stored in this app. No internet search and no paid AI. Read the wording yourself.`;

  await localEntities.StudyPlan.update(planId, {
    status: "complete",
    verse_count: verses.length,
    description: summary,
    derivatives: derivatives.join(", "),
  });

  return { verses, summary, derivatives };
}

async function investigate_claim({ query }) {
  requireUser();
  const q = String(query || "").trim();
  if (!q) return fail("A claim or question is required.");
  try {
    const found = await searchCorpus(q, { limit: 120 });
    const parts = partitionMatches(found.matches);
    const toItems = (rows) =>
      rows.slice(0, 40).map((m) => ({
        title: m.reference,
        reference: m.reference,
        description: m.text,
      }));
    const canon = parts.scripture.filter((m) => m.source === "canon");
    const manuscripts = parts.scripture.filter((m) => m.source !== "canon");
    return {
      dossier: {
        query: q,
        verdict:
          found.matches.length === 0
            ? "No matching wording was found in this app. Nothing was invented to fill the gap."
            : "These are the actual words stored in this app — Scripture, early writings, and published records. No AI verdict is given.",
        biblical_record: toItems(canon),
        manuscript_evidence: toItems(manuscripts),
        archaeological_evidence: toItems(parts.archaeology),
        historical_evidence: toItems(parts.government),
        scientific_evidence: toItems(parts.science),
        prophecy_evidence: toItems(parts.modern),
        supporting_evidence: found.matches.slice(0, 12).map((m) => m.reference),
        challenging_evidence: [],
        alternative_interpretations: [
          "This search quotes wording stored in the app only. It does not decide history, science, or doctrine.",
        ],
        scholarly_positions: [],
        primary_sources: found.matches.slice(0, 20).map((m) => ({
          title: m.reference,
          type: m.source,
          url: "",
          tier: m.source === "canon" ? "A" : "B",
        })),
        conclusion: {
          established: found.matches.length
            ? [`${found.matches.length} record(s) in this app contain that wording.`]
            : [],
          strongly_supported: [],
          disputed: [],
          cannot_demonstrate: [
            "A word search cannot prove or disprove a historical claim. It can only show what the stored texts say.",
          ],
          summary: ARCHIVE_NOTICE,
        },
      },
    };
  } catch (error) {
    return fail(error.message);
  }
}

function escapeMd(s) {
  return String(s || "").trim();
}

async function study_assistant({ question }) {
  requireUser();
  const q = String(question || "").trim();
  if (!q) return fail("A question is required.");
  let found;
  try {
    found = await searchCorpus(q, { limit: 80 });
  } catch (error) {
    return fail(error.message);
  }

  const lines = [];
  lines.push(
    found.matches.length
      ? `### ANSWER: ${found.matches.length} record${found.matches.length === 1 ? "" : "s"} stored in this app contain that wording. Scripture, early writings, and published evidence are searched together. No outside opinion is added.`
      : "### ANSWER: No record stored in this app contains that wording. Nothing was invented to fill the gap. The closed Vatican Apostolic Archive and paywalled journals are not copied here."
  );
  lines.push("");

  const passages = found.matches.map((m) => ({
    reference: m.reference,
    source: m.source,
    text: m.text,
    relevance: "",
  }));
  lines.push(`### All relevant texts (${passages.length} passage${passages.length === 1 ? "" : "s"} reviewed)`);
  lines.push("");
  for (const p of passages) {
    const ref = escapeMd(p.reference);
    const src = escapeMd(p.source) || "canon";
    const txt = escapeMd(p.text);
    const rel = escapeMd(p.relevance);
    lines.push(`**${ref}** (${src})`);
    lines.push(`> ${txt}`);
    if (rel) lines.push(`*Relevance: ${rel}*`);
    lines.push("");
  }

  if (passages.length === 0) {
    lines.push(
      "No passage in the four admissible corpora (canon, Apocrypha, Dead Sea Scrolls, Book of Enoch) addresses this question. Nothing has been invented to fill the gap."
    );
    lines.push("");
  }

  lines.push("---");
  lines.push(
    `**Completeness attestation:** ${ARCHIVE_NOTICE}`
  );

  return { answer: lines.join("\n") };
}

async function define_word({ word, reference }) {
  requireUser();
  const w = String(word || "").trim();
  if (!w) return fail("A word is required.");
  const ref = String(reference || "").trim();
  const lex = lookupLexicon(w);
  try {
    const found = await searchCorpus(ref ? `${w} ${ref}` : w, { limit: 24 });
    const quotes = found.matches
      .filter((m) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(m.text))
      .slice(0, 10);
    if (!lex && !quotes.length) {
      return fail(`No Strong's entry and no verse stored in this app uses “${w}”. Nothing was invented.`);
    }
    return {
      definition: lex
        ? lex.meaning
        : "No Strong's entry is stored for this English spelling. The verses below are the wording in this app.",
      original_language: lex ? `${lex.language} · ${lex.strongs}` : "No lexicon entry stored",
      original_word: lex ? `${lex.original} (${lex.translit})` : w,
      original_meaning: lex ? lex.meaning : quotes[0]?.text || "",
      etymology: lex ? lex.etymology : "Etymology is not guessed when Strong's does not list this spelling.",
      era_context: lex
        ? lex.source
        : "Read each book in its own setting. This app does not invent a later meaning.",
      verses: quotes.map((m) => `${m.reference}: ${m.text}`).join("\n\n"),
    };
  } catch (error) {
    return fail(error.message);
  }
}

async function search_texts({ query, corpus }) {
  requireUser();
  const q = String(query || "").trim();
  if (!q) return fail("A search word is required.");
  const chosen = SEARCH_CORPORA.find((c) => c.id === corpus) || SEARCH_CORPORA[0];
  try {
    const found = await searchCorpus(q, { limit: 80, sources: chosen.sources || undefined });
    return {
      query: q,
      corpus: chosen.id,
      label: chosen.label,
      matches: found.matches,
    };
  } catch (error) {
    return fail(error.message);
  }
}

function stripHtml(html) {
  let s = html.replace(/<head[\s\S]*?<\/head>/gi, " ");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<a[\s\S]*?<\/a>/gi, " ");
  s = s.replace(/<hr[^>]*>/gi, "\n");
  s = s.replace(/<br[^>]*>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n[ \t]+/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  const cut = s.search(/This is the updated World English Bible|HTML generated with/i);
  if (cut > 0) s = s.slice(0, cut);
  return s.trim();
}

async function fetch_apocrypha_text({ bookId, chapter }) {
  requireUser();
  const BOOKS = {
    additions_esther: { code: "ESG", title: "Additions to Esther (Greek Esther)", chapters: 10 },
    psalm_151: { code: "PS2", title: "Psalm 151", chapters: 1 },
    "3_maccabees": { code: "3MA", title: "3 Maccabees", chapters: 7 },
    "4_maccabees": { code: "4MA", title: "4 Maccabees", chapters: 18 },
  };
  const meta = BOOKS[String(bookId || "")];
  if (!meta) return fail("Unknown book.");
  const chNum = Math.max(1, parseInt(chapter, 10) || 1);
  const ch = String(chNum).padStart(2, "0");
  const localUrl = `/corpus/web/${bookId}/${ch}.htm`;
  let html = "";
  try {
    const res = await fetch(localUrl);
    if (res.ok) html = await res.text();
  } catch {
    /* missing local chapter */
  }
  if (!html) return fail("This chapter is not stored in the app.");
  const text = stripHtml(html);
  return { title: meta.title, chapter: chNum, text, hasNext: chNum < meta.chapters, sourceUrl: "" };
}

async function research_evidence({ reference, topic }) {
  requireUser();
  const q = String(reference || topic || "").trim();
  if (!q) return fail("A scripture reference or topic is required.");
  const evidence = searchArchive(q, "archaeology");
  if (!evidence.length) return fail(`No archaeological record stored in this app matches “${q}”.`);
  return { evidence, created: 0, notice: ARCHIVE_NOTICE };
}

async function research_modern_fulfillment({ reference, topic }) {
  requireUser();
  const q = String(reference || topic || "").trim();
  if (!q) return fail("A prophecy reference or topic is required.");
  const items = searchArchive(q, "modern");
  if (!items.length) return fail(`No dated public record stored in this app matches “${q}”.`);
  return { items, created: 0, notice: ARCHIVE_NOTICE };
}

async function research_scientific_confirmation({ reference, topic }) {
  requireUser();
  const q = String(reference || topic || "").trim();
  if (!q) return fail("A scripture reference or topic is required.");
  const confirmations = searchArchive(q, "science");
  if (!confirmations.length) return fail(`No scientific record stored in this app matches “${q}”.`);
  return { confirmations, created: 0, notice: ARCHIVE_NOTICE };
}

async function research_government_documents({ topic, reference }) {
  requireUser();
  const q = String(topic || reference || "").trim();
  if (!q) return fail("A topic or scripture reference is required.");
  const documents = searchArchive(q, "government");
  if (!documents.length) return fail(`No dated public record stored in this app matches “${q}”.`);
  return { documents, created: 0, notice: ARCHIVE_NOTICE };
}

async function research_cross_references({ reference, topic }) {
  requireUser();
  const q = String(topic || reference || "").trim();
  if (!q) return fail("A scripture reference is required.");
  try {
    const found = await searchCorpus(q, { limit: 40 });
    const references = found.matches.map((m) => ({
      reference: m.reference,
      source: normalizeSource(m.source),
      text: m.text,
      relationship: "Matching wording stored in this app",
      direction: "",
    }));
    return { references };
  } catch (error) {
    return fail(error.message);
  }
}

async function refresh_document_links() {
  requireAdmin();
  return { refreshed: 0, message: "Documents are stored in this app. Outside links are not used." };
}

const HANDLERS = {
  research_topic,
  investigate_claim,
  study_assistant,
  define_word,
  search_texts,
  fetch_apocrypha_text,
  research_evidence,
  research_modern_fulfillment,
  research_scientific_confirmation,
  research_government_documents,
  research_cross_references,
  refresh_document_links,
};

export async function invokeFunction(name, payload = {}) {
  const handler = HANDLERS[name];
  if (!handler) throw new Error(`Unknown function: ${name}`);
  try {
    const result = await handler(payload);
    return wrapResult(result);
  } catch (error) {
    return wrapResult({ error: error.message || "Function failed" });
  }
}
