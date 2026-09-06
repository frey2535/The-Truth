import { localEntities } from "./localEntities";
import { requireAdmin, requireUser } from "./localAuth";
import { LOCAL_ASSISTANT_ATTESTATION, normalizeSource } from "@/lib/truthMandate";
import {
  contentWordsForQuestion,
  corpusCoverage,
  extractReferencesFromQuestion,
  findReferencedPassages,
  KJV_TOPIC_ALIASES,
  matchesToResearchVerses,
  partitionMatches,
  searchCorpus,
  SEARCH_CORPORA,
  SOURCE_LABEL,
  wordHitsText,
} from "@/lib/localCorpusSearch";
import { ARCHIVE_NOTICE, searchArchive } from "@/data/inAppArchive";
import { lookupLexicon } from "@/data/strongsLexicon";
import { looksLikeAppShell } from "@/lib/fetchStoredText";
import { publicUrl } from "@/lib/publicUrl";

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

const ASK_SCRIPTURE_SOURCES = [
  "canon",
  "apocrypha",
  "enoch",
  "dead_sea_scrolls",
  "fathers",
  "josephus",
  "other",
];

const FOLLOW_UP_RE =
  /^(and|also|what about|how about|why|more|continue|yes|no|again|same|that|those)\b/i;
const PRONOUN_RE = /\b(he|she|they|it|this|that|those|him|his|them|their)\b/i;
const BIBLE_REQUEST_RE =
  /\b(?:bible|scripture|king james|kjv|holy bible|old testament|new testament|gospels?)\b/i;
const LEAD_SOURCE_PATTERNS = [
  { source: "josephus", re: /\b(?:josephus|antiquities of the jews)\b/i },
  { source: "fathers", re: /\b(?:(?:church|early|ante-?nicene)\s+fathers?|ante-?nicene)\b/i },
  { source: "dead_sea_scrolls", re: /\b(?:dead sea scrolls?|qumran scrolls?)\b/i },
  { source: "enoch", re: /\b(?:(?:1|2|book of)\s+enoch|(?:in|from)\s+enoch|enoch says)\b/i },
  { source: "apocrypha", re: /\b(?:apocrypha|deuterocanon(?:ical)?)\b/i },
];
const SOURCE_ORDER = [
  "canon",
  "apocrypha",
  "enoch",
  "dead_sea_scrolls",
  "fathers",
  "josephus",
  "other",
  "archaeology",
  "science",
  "government",
  "vatican",
  "modern",
];

function leadSourceFromQuestion(question) {
  const q = String(question || "");
  if (BIBLE_REQUEST_RE.test(q)) return "canon";
  for (const { source, re } of LEAD_SOURCE_PATTERNS) {
    if (re.test(q)) return source;
  }
  return "canon";
}

function sourceRank(source, lead) {
  if (lead && lead !== "canon" && source === lead) return -1;
  const i = SOURCE_ORDER.indexOf(source);
  return i < 0 ? SOURCE_ORDER.length : i;
}

function uniqueWords(list) {
  const seen = new Set();
  const out = [];
  for (const w of list || []) {
    const key = String(w || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(String(w));
  }
  return out;
}

function isComparisonQuestion(question) {
  const q = String(question || "");
  if (!/^\s*(?:is|are|was|were)\s+.+\s+the\s+.+/i.test(q) && !/\b(?:same as|instead of|rather than)\b/i.test(q)) {
    return false;
  }
  return contentWordsForQuestion(q).some((w) => KJV_TOPIC_ALIASES[String(w).toLowerCase()]);
}

function topicWordsWithoutRefs(question, refs) {
  const skip = new Set();
  for (const ref of refs || []) {
    String(ref.book || "")
      .toLowerCase()
      .split(/\s+/)
      .forEach((w) => {
        if (w.length > 1) skip.add(w);
      });
  }
  return contentWordsForQuestion(question).filter((w) => !skip.has(w) && !/^\d+$/.test(w));
}

function parseAskShape(question) {
  const q = String(question || "").trim();
  const leadSource = leadSourceFromQuestion(q);
  const comparison = isComparisonQuestion(q);
  const refs = extractReferencesFromQuestion(q);
  const about = q.match(
    /\b(?:what|how|where)\s+do(?:es)?\s+(.+?)\s+(?:say|teach|tell|speak|command)\s+(?:about|of|concerning)\s+(.+)/i
  );
  if (about) {
    return {
      question: q,
      search: contentWordsForQuestion(about[2]).join(" ") || q,
      words: contentWordsForQuestion(about[2]),
      boostWords: contentWordsForQuestion(about[1]),
      refs,
      preferSpeech: true,
      leadSource,
      comparison,
    };
  }
  const bibleSay = q.match(
    /\bdoes\s+(?:the\s+)?(?:bible|scripture|word|lord|god|jesus|messiah|moses|paul)\s+(?:say|teach|mention|speak|command)\s+(?:that\s+|about\s+|of\s+)?(.+)/i
  );
  if (bibleSay) {
    const words = contentWordsForQuestion(bibleSay[1]);
    return { question: q, search: words.join(" ") || q, words, boostWords: [], refs, preferSpeech: false, leadSource, comparison };
  }
  const tellAbout = q.match(/\b(?:tell me about|explain|define)\s+(.+)/i);
  if (tellAbout) {
    const words = contentWordsForQuestion(tellAbout[1]);
    return { question: q, search: words.join(" ") || q, words, boostWords: [], refs, preferSpeech: false, leadSource, comparison };
  }
  const who = q.match(/^\s*who\s+(?:is|are|was|were)\s+(.+)/i);
  if (who) {
    const words = contentWordsForQuestion(who[1]);
    return { question: q, search: words.join(" ") || q, words, boostWords: [], refs, preferSpeech: false, leadSource, comparison };
  }
  const what = q.match(/^\s*what\s+(?:is|are|was|were)\s+(.+)/i);
  if (what) {
    const words = contentWordsForQuestion(what[1]);
    return { question: q, search: words.join(" ") || q, words, boostWords: [], refs, preferSpeech: false, leadSource, comparison };
  }
  const why = q.match(/^\s*why\s+(?:did|does|do|is|was|were)\s+(.+)/i);
  if (why) {
    const words = contentWordsForQuestion(why[1]);
    return { question: q, search: words.join(" ") || q, words, boostWords: [], refs, preferSpeech: false, leadSource, comparison };
  }
  const words = topicWordsWithoutRefs(q, refs);
  return {
    question: q,
    search: words.join(" ") || q,
    words,
    boostWords: [],
    refs,
    preferSpeech: false,
    leadSource,
    comparison,
  };
}

function resolveAskQuestion(question, history) {
  const q = String(question || "").trim();
  const hist = Array.isArray(history) ? history : [];
  const lastUser = [...hist].reverse().find((m) => m.role === "user" && String(m.content || "").trim());
  const asked = parseAskShape(q);
  const thin = !asked.words.length && !asked.refs.length;
  const follow =
    lastUser &&
    (thin || FOLLOW_UP_RE.test(q) || (PRONOUN_RE.test(q) && asked.words.length <= 2));
  if (!follow) return asked;
  const prior = parseAskShape(String(lastUser.content).trim());
  return {
    question: `${prior.question}\n\nFollow-up: ${q}`,
    search: uniqueWords([...asked.words, ...prior.words]).join(" ") || prior.search,
    words: uniqueWords([...asked.words, ...prior.words]),
    boostWords: uniqueWords([...asked.boostWords, ...prior.boostWords, ...prior.words]),
    refs: asked.refs.length ? asked.refs : prior.refs,
    preferSpeech: asked.preferSpeech || prior.preferSpeech,
    leadSource: asked.leadSource !== "canon" ? asked.leadSource : prior.leadSource || "canon",
    comparison: asked.comparison || prior.comparison,
  };
}

function uniquePassages(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const key = `${row.source}|${row.reference}|${String(row.text || "").slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

const JESUS_NAMES = new Set(["jesus", "christ", "messiah", "yeshua"]);
const GOSPEL_BOOKS = new Set(["Matthew", "Mark", "Luke", "John"]);
const SPEAKER_IGNORE = new Set(["bible", "scripture", "scriptures", "word", "texts", "text"]);

function escapeAskRe(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hitsTopicTerm(text, word) {
  const hay = String(text || "");
  if (wordHitsText(hay, word)) return true;
  return (KJV_TOPIC_ALIASES[String(word).toLowerCase()] || []).some((alias) =>
    hay.toLowerCase().includes(String(alias).toLowerCase())
  );
}

function termPosition(text, word) {
  const hay = String(text || "");
  if (wordHitsText(hay, word)) {
    const m = hay.match(new RegExp(`\\b${escapeAskRe(word)}`, "i"));
    return m ? m.index : -1;
  }
  for (const alias of KJV_TOPIC_ALIASES[String(word).toLowerCase()] || []) {
    const i = hay.toLowerCase().indexOf(String(alias).toLowerCase());
    if (i >= 0) return i;
  }
  return -1;
}

function termsNearEachOther(text, words, window = 240) {
  const positions = words.map((w) => termPosition(text, w)).filter((i) => i >= 0);
  if (positions.length < 2) return positions.length === words.length;
  return Math.max(...positions) - Math.min(...positions) <= window;
}

function speakersForQuestion(asked) {
  return (asked.boostWords || []).filter((w) => !SPEAKER_IGNORE.has(String(w).toLowerCase()));
}

function verseAppliesToQuestion(row, asked) {
  const text = String(row.text || "").trim();
  if (!text) return false;
  const topic = asked.words || [];
  if (row.askedReference && !topic.length) return true;
  if (!topic.length) return false;

  const hitCount = topic.filter((w) => hitsTopicTerm(text, w)).length;
  if (asked.comparison) {
    if (!hitCount) return false;
  } else if (hitCount < topic.length) {
    return false;
  }

  if (text.length > 800 && topic.length >= 2 && !asked.comparison && !termsNearEachOther(text, topic)) {
    return false;
  }

  const speakers = speakersForQuestion(asked);
  if (asked.preferSpeech && speakers.length) {
    const jesusAsk = speakers.some((w) => JESUS_NAMES.has(String(w).toLowerCase()));
    const speakerHit = speakers.some((w) => hitsTopicTerm(text, w));
    const gospelSpeech = jesusAsk && GOSPEL_BOOKS.has(row.book);
    if (!speakerHit && !gospelSpeech) return false;
  }

  return true;
}

function askSearchQueries(asked) {
  const out = [];
  const add = (value, requirePhrase = false) => {
    const q = String(value || "").trim();
    if (!q || out.some((item) => item.q === q)) return;
    out.push({ q, requirePhrase });
  };
  if (asked.comparison) {
    for (const w of asked.words || []) {
      add(w);
      for (const alias of KJV_TOPIC_ALIASES[String(w).toLowerCase()] || []) add(alias, true);
    }
    return out.length ? out : [{ q: asked.question, requirePhrase: false }];
  }
  add(asked.search);
  for (const w of asked.words || []) {
    for (const alias of KJV_TOPIC_ALIASES[String(w).toLowerCase()] || []) add(alias, true);
  }
  return out.length ? out : [{ q: asked.question, requirePhrase: false }];
}

function sourceLabel(source) {
  return SOURCE_LABEL[source] || source || "stored text";
}

function sortAskPassages(rows, asked) {
  const lead = asked?.leadSource || "canon";
  return [...rows].sort((a, b) => {
    const rank = sourceRank(a.source, lead) - sourceRank(b.source, lead);
    if (rank) return rank;
    const cited = (b.askedReference ? 1 : 0) - (a.askedReference ? 1 : 0);
    if (cited) return cited;
    return (b.score || 0) - (a.score || 0);
  });
}

function selectRelevantPassages(passages, asked) {
  return uniquePassages((passages || []).filter((p) => verseAppliesToQuestion(p, asked)));
}

function understoodAs(asked) {
  const q = String(asked.question || "").split("\n")[0].trim();
  const topic = (asked.words || []).join(", ");
  const speakers = speakersForQuestion(asked);
  if (asked.refs.length && topic) {
    return `Does **${asked.refs[0].label}** address ${topic}?`;
  }
  if (asked.preferSpeech && speakers.length && topic) {
    return `What does ${speakers.join(", ")} say about ${topic}?`;
  }
  if (topic) return `${q} Topic words used to search the stored texts: ${topic}.`;
  return q;
}

function yesNoLine(primary) {
  const n = primary.length;
  if (!n) {
    return "**No.** The question is understood, but no stored verse directly answers it. Other stored wording is listed below when any was found. Nothing was invented.";
  }
  return `**Yes.** The question is understood. The first section quotes the stored texts that answer it. Conflicting stored wording, if any, is quoted in the second section.`;
}

function passageKey(row) {
  return `${row.source}|${row.reference}|${String(row.text || "").slice(0, 80)}`;
}

function hasNegation(text) {
  return /\b(not|neither|never|no more|cannot|shall not|shalt not|ye shall not|thou shalt not)\b/i.test(
    String(text || "")
  );
}

function writePassageBlock(lines, rows, asked) {
  const body = sortAskPassages(rows, asked);
  let lastGroup = "";
  for (const p of body) {
    const group = sourceLabel(p.source);
    if (group !== lastGroup) {
      lines.push(`#### ${group}`);
      lines.push("");
      lastGroup = group;
    }
    lines.push(`**${escapeMd(p.reference)}**`);
    lines.push(`> ${escapeMd(p.text)}`);
    lines.push("");
  }
}

function splitRelatedPassages(primary, leftover, asked) {
  const canonPrimary = primary.filter((p) => p.source === "canon");
  const sample = canonPrimary.length ? canonPrimary : primary;
  const negCount = sample.filter((p) => hasNegation(p.text)).length;
  const majorityNeg = sample.length ? negCount > sample.length / 2 : null;
  const conflicting = [];
  const related = [];
  for (const row of leftover) {
    const disputed = String(row.archiveItem?.evidence_status || "").toLowerCase() === "disputed";
    const differs =
      majorityNeg !== null &&
      sample.length &&
      hasNegation(row.text) !== majorityNeg &&
      (asked.words || []).some((w) => hitsTopicTerm(row.text, w));
    if (disputed || differs) conflicting.push(row);
    else related.push(row);
  }
  return { conflicting, related };
}

function quoteOnlyAnswer(question, passages, asked) {
  const all = uniquePassages(passages || []);
  const primary = selectRelevantPassages(all, asked);
  const primaryKeys = new Set(primary.map(passageKey));
  const leftover = all.filter((row) => !primaryKeys.has(passageKey(row)));
  const { conflicting, related } = splitRelatedPassages(primary, leftover, asked);
  const bySource = {};
  for (const p of primary) {
    const label = sourceLabel(p.source);
    bySource[label] = (bySource[label] || 0) + 1;
  }
  const abundance = Object.entries(bySource)
    .map(([label, n]) => `${n} from ${label}`)
    .join("; ");

  const lines = [];
  lines.push(`### Your question`);
  lines.push(String(question).split("\n")[0]);
  lines.push("");
  lines.push(`Understood as: ${understoodAs(asked)}`);
  lines.push("");
  lines.push(yesNoLine(primary));
  lines.push("");
  if (primary.length) {
    lines.push("### Answer from the stored texts");
    lines.push("");
    if (abundance) {
      lines.push(
        `These passages answer the question. Count by stored source: ${abundance}. The reader weighs abundance and agreement. No opinion is added.`
      );
      lines.push("");
    }
    writePassageBlock(lines, primary, asked);
  }
  if (conflicting.length) {
    lines.push("### Conflicting stored wording");
    lines.push("");
    lines.push(
      "These stored texts also address the topic but differ from the wording above. They are not omitted. The reader decides."
    );
    lines.push("");
    writePassageBlock(lines, conflicting, asked);
  }
  if (related.length) {
    lines.push("### Other stored wording on this topic");
    lines.push("");
    lines.push(
      "These stored passages were found while searching the same topic. They did not pass the direct-answer test, so they are listed here rather than treated as the answer."
    );
    lines.push("");
    writePassageBlock(lines, related, asked);
  }
  if (!primary.length && !conflicting.length && !related.length) {
    lines.push("No stored passage in this app uses wording that matches the question.");
    lines.push("");
  }
  lines.push("---");
  lines.push(`**Completeness attestation:** ${LOCAL_ASSISTANT_ATTESTATION} ${ARCHIVE_NOTICE}`);
  return lines.join("\n");
}

async function searchAskSources(asked, sources) {
  const matches = [];
  for (const { q, requirePhrase } of askSearchQueries(asked)) {
    const found = await searchCorpus(q, {
      limit: Infinity,
      sources,
      contentWords: requirePhrase ? [] : asked.words,
      boostWords: asked.boostWords,
      preferSpeech: asked.preferSpeech,
      preferCanon: sources.includes("canon"),
      requirePhrase,
      mustHitAll: !asked.comparison && !requirePhrase && (asked.words || []).length > 1,
    });
    matches.push(...found.matches);
  }
  return matches;
}

const ASK_ALL_SOURCES = ASK_SCRIPTURE_SOURCES.concat([
  "archaeology",
  "science",
  "government",
  "vatican",
  "modern",
]);

async function gatherAskPassages(asked) {
  const cited = await findReferencedPassages(asked.question);
  const canon = await searchAskSources(asked, ["canon"]);
  const extra = await searchAskSources(
    asked,
    ASK_ALL_SOURCES.filter((s) => s !== "canon")
  );
  return uniquePassages([...cited, ...sortAskPassages([...canon, ...extra], asked)]);
}

async function study_assistant({ question, history }) {
  requireUser();
  const q = String(question || "").trim();
  if (!q) return fail("A question is required.");
  const asked = resolveAskQuestion(q, history);
  let coverage;
  try {
    coverage = await corpusCoverage();
  } catch (error) {
    return fail(error.message);
  }
  if (!coverage.canonVerses) {
    return fail(
      "The King James text is not loaded in this browser session. Open Library and read a book once, or run npm run vendor-corpus, then ask again. Nothing was invented."
    );
  }
  let passages = [];
  try {
    passages = await gatherAskPassages(asked);
  } catch (error) {
    return fail(error.message);
  }

  return { answer: quoteOnlyAnswer(asked.question, passages, asked) };
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
  const localUrl = publicUrl(`/corpus/web/${bookId}/${ch}.htm`);
  let html = "";
  try {
    const res = await fetch(localUrl);
    if (res.ok) {
      const body = await res.text();
      if (!looksLikeAppShell(body)) html = body;
    }
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
