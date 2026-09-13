import { APOCRYPHA_BOOKS, CANON_BOOKS, bibleBookUrl, manuscriptUrl } from "@/components/library/corpusData";
import { DSS_LOCAL_TEXT } from "@/components/library/dssLocalTexts";
import { ALL_ARCHIVE } from "@/data/inAppArchive";
import { fetchStoredText, looksLikeHtmlDocument } from "@/lib/fetchStoredText";
import { expandWithLearning } from "./assistantLearn.js";
import {
  clipAroundMatch,
  foldMarks,
  INDEXED_PLAIN_TEXTS,
  rankSource,
  rowsFromStoredText,
  scorePassage,
  uniqueMatches,
} from "./corpusPassages.js";
import { familyHitsText, familyOf } from "./wordFamilies.js";
import { loadUserDocumentRows } from "./userDocuments.js";

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "for", "it", "with", "as",
  "be", "by", "this", "are", "or", "from", "not", "but", "his", "her", "they", "them",
  "you", "your", "were", "have", "had", "has", "will", "shall", "unto", "which",
  "what", "when", "who", "how", "did", "does", "been", "their", "there", "then", "than",
  "into", "upon", "also", "all", "any", "can", "may", "our", "out", "about",
  "must", "need", "needs",
]);

/** Question filler that pulls the wrong verses if used as search keys. */
const QUESTION_WEAK = new Set([
  "say", "said", "saith", "saying", "says", "ask", "asked", "asking", "tell", "told",
  "mean", "means", "meaning", "please", "explain", "describe", "define", "defined",
  "definition", "difference", "between", "versus", "compare", "related", "verse",
  "verses", "passage", "passages", "bible", "scripture", "scriptures", "text", "texts",
  "word", "words", "teach", "teaches", "taught", "teaching", "show", "shows", "shown",
  "please", "really", "just", "like", "thing", "things", "someone", "something",
  "should", "would", "could", "yes", "very", "always", "still", "even", "because",
  "whether", "thanks", "thank", "everyone", "anybody", "somebody",
  "must", "need", "needs", "wanted", "want", "information", "question", "answer",
  "find", "looking", "know", "think",
]);

/** Modern question words that are rare or absent in the King James wording. */
export const KJV_TOPIC_ALIASES = {
  sunday: ["first day of the week"],
  saturday: ["seventh day", "sabbath"],
  christmas: ["bethlehem"],
  easter: ["passover"],
  murder: ["kill"],
  rapture: ["caught up"],
  "holy spirit": ["holy ghost"],
  spirit: ["holy ghost"],
  forgive: ["forgiveness", "remission"],
  forgiveness: ["remission"],
  baptize: ["baptism", "baptist", "baptise", "baptised"],
  baptism: ["baptize", "baptized", "baptist", "baptise", "baptised"],
  baptise: ["baptize", "baptism", "baptist"],
  repent: ["repentance"],
  repentance: ["repent"],
  sabbath: ["seventh day"],
  sheol: ["grave", "hell"],
  hell: ["sheol", "grave"],
};

const bookCache = new Map();

const MANUSCRIPT_SLUGS = [
  "1-enoch",
  "2-enoch",
  "3-enoch",
  "psalms-of-solomon",
  "lives-of-the-prophets",
  "testament-of-zebulun",
  "ladder-of-jacob",
  "2-hermas",
  "2-baruch",
  "3-baruch",
  "4-baruch",
  "assumption-of-moses",
  "ascension-of-isaiah",
  "odes-of-solomon",
  "sibylline-oracles",
  "joseph-and-aseneth",
  "testament-of-job",
  "pseudo-philo",
  "apocalypse-of-abraham",
  "cave-of-treasures",
  "sinodos",
  "book-of-the-covenant-eth",
  "ethiopic-didascalia",
];

const LOCAL_MARKDOWN = [
  "/dss/community-rule.md",
  "/dss/damascus-document.md",
  "/dss/genesis-apocryphon.md",
  "/dss/hodayot.md",
  "/dss/pesher-habakkuk.md",
  "/dss/temple-scroll.md",
  "/dss/war-scroll.md",
  "/corpus/manuscripts/jubilees.md",
];

const LOCAL_PLAIN = INDEXED_PLAIN_TEXTS;

const WEB_BOOKS = [
  { id: "additions_esther", title: "Additions to Esther", chapters: 10 },
  { id: "psalm_151", title: "Psalm 151", chapters: 1 },
  { id: "3_maccabees", title: "3 Maccabees", chapters: 7 },
  { id: "4_maccabees", title: "4 Maccabees", chapters: 18 },
];

function addFormsForWord(forms, word) {
  const folded = foldMarks(word).toLowerCase();
  if (!folded) return;
  forms.add(folded);
  for (const form of familyOf(folded)) forms.add(foldMarks(form).toLowerCase());
  for (const form of expandWithLearning(folded)) forms.add(foldMarks(form).toLowerCase());
  for (const alias of KJV_TOPIC_ALIASES[folded] || []) {
    const aliasFolded = foldMarks(alias).toLowerCase();
    if (aliasFolded) forms.add(aliasFolded);
  }
}

export function expandSearchForms(topic, { exact = false } = {}) {
  const phrase = foldMarks(topic)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const rawWords = phrase.split(" ").filter(Boolean);
  const words = exact ? rawWords : rawWords.filter((w) => w.length > 2 && !STOP.has(w));
  const forms = new Set();
  if (phrase) forms.add(phrase);
  if (exact) {
    for (const w of words) forms.add(w);
    return { phrase, words, forms: [...forms].filter(Boolean), exact: true };
  }
  for (const w of words) addFormsForWord(forms, w);
  return { phrase, words, forms: [...forms].filter((f) => f.length >= 3), exact: false };
}

export function contentWordsForQuestion(topic) {
  const { words } = expandSearchForms(topic);
  const focused = words.filter((w) => !QUESTION_WEAK.has(w));
  return focused.length ? focused : words;
}

export function extractReferencesFromQuestion(question) {
  const q = String(question || "");
  const out = [];
  const re =
    /((?:\d+\s+)?[A-Za-z][A-Za-z'.]+(?:\s+(?:of\s+)?[A-Za-z][A-Za-z'.]+){0,2})\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/g;
  let m;
  while ((m = re.exec(q))) {
    const parts = m[1].trim().split(/\s+/);
    while (
      parts.length > 1 &&
      (STOP.has(parts[0].toLowerCase()) || QUESTION_WEAK.has(parts[0].toLowerCase()))
    ) {
      parts.shift();
    }
    if (!parts.length) continue;
    const book = parts.join(" ");
    out.push({
      book,
      chapter: m[2],
      verse: m[3],
      endVerse: m[4] || "",
      label: `${book} ${m[2]}:${m[3]}${m[4] ? `-${m[4]}` : ""}`,
    });
  }
  return out;
}

function sameBookName(a, b) {
  const na = String(a || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const nb = String(b || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return na === nb || na === `${nb}s` || nb === `${na}s`;
}

export function wordHitsText(text, word) {
  return familyHitsText(text, word);
}

function scoreText(text, queryForms) {
  return scorePassage(text, queryForms);
}

async function loadBook(book, apocrypha) {
  const key = `${apocrypha ? "a" : "c"}:${book}`;
  if (bookCache.has(key)) return bookCache.get(key);
  const res = await fetch(bibleBookUrl(book, apocrypha));
  if (!res.ok) throw new Error(`Could not load ${book}`);
  const raw = await res.text();
  if (looksLikeHtmlDocument(raw, res.headers.get("content-type") || "")) {
    throw new Error(`Could not load ${book}`);
  }
  const json = JSON.parse(raw);
  bookCache.set(key, json);
  return json;
}

async function mapPool(items, limit, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

function versesFromBook(json, bookTitle, source) {
  const chapters = Array.isArray(json?.chapters) ? json.chapters : [];
  const rows = [];
  for (const ch of chapters) {
    const chapter = ch.chapter ?? ch.Chapter;
    for (const v of ch.verses || []) {
      const verse = v.verse ?? v.Verse;
      const text = String(v.text || v.Text || "").trim();
      if (!text) continue;
      rows.push({
        book: bookTitle,
        chapter,
        verse,
        reference: `${bookTitle} ${chapter}:${verse}`,
        text,
        source,
      });
    }
  }
  return rows;
}

async function loadScriptureRows() {
  const canon = await mapPool(CANON_BOOKS, 8, async (book) => {
    try {
      return versesFromBook(await loadBook(book, false), book, "canon");
    } catch {
      return [];
    }
  });
  const apoc = await mapPool(APOCRYPHA_BOOKS, 6, async (book) => {
    try {
      return versesFromBook(await loadBook(book, true), book, "apocrypha");
    } catch {
      return [];
    }
  });
  return [...canon.flat(), ...apoc.flat()];
}

function rowsForLoadedText(title, text, source) {
  return rowsFromStoredText(title, text, source);
}

function hitsFromRow(row, queryForms) {
  const score = scoreText(row.text, queryForms);
  if (score <= 0) return [];
  const text = row.text.length > 900 ? clipAroundMatch(row.text, queryForms.forms) : row.text;
  return [{ ...row, text, score }];
}

async function fetchText(url) {
  const fetched = await fetchStoredText(url);
  return fetched.ok ? fetched.text : "";
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadManuscriptRows() {
  const remote = await mapPool(MANUSCRIPT_SLUGS, 4, async (slug) => {
    try {
      const md = await fetchText(manuscriptUrl(slug));
      const source = slug === "1-enoch" || slug === "2-enoch" || slug === "3-enoch" ? "enoch" : "other";
      return rowsForLoadedText(slug.replace(/-/g, " "), md, source);
    } catch {
      return [];
    }
  });
  const localMd = await mapPool(LOCAL_MARKDOWN, 4, async (url) => {
    try {
      const md = await fetchText(url);
      const name = url.split("/").pop().replace(/\.md$/, "").replace(/-/g, " ");
      const source = url.includes("jubilees") ? "other" : "dead_sea_scrolls";
      return rowsForLoadedText(name, md, source);
    } catch {
      return [];
    }
  });
  const plain = await mapPool(LOCAL_PLAIN, 4, async (item) => {
    try {
      const txt = await fetchText(item.file);
      if (!txt) return [];
      return rowsForLoadedText(item.title, txt, item.source);
    } catch {
      return [];
    }
  });
  const web = await mapPool(WEB_BOOKS, 2, async (book) => {
    const chapters = [];
    for (let n = 1; n <= book.chapters; n += 1) {
      const ch = String(n).padStart(2, "0");
      try {
        const html = await fetchText(`/corpus/web/${book.id}/${ch}.htm`);
        const text = stripHtml(html);
        if (text.length > 40) {
          chapters.push(...rowsForLoadedText(`${book.title} ${n}`, text, "apocrypha"));
        }
      } catch {
        /* skip missing chapter */
      }
    }
    return chapters;
  });
  return [...remote.flat(), ...localMd.flat(), ...plain.flat(), ...web.flat()];
}

function loadDssInlineRows() {
  return Object.entries(DSS_LOCAL_TEXT).flatMap(([id, md]) =>
    rowsForLoadedText(id.replace(/-/g, " "), md, "dead_sea_scrolls")
  );
}

function loadArchiveRows() {
  return ALL_ARCHIVE.map((item, i) => ({
    book: item.title,
    chapter: 1,
    verse: 1,
    reference: item.title,
    text: `${item.title}. ${item.full_text}`,
    source: item.archive,
    archiveItem: item,
  }));
}

let corpusPromise = null;
async function loadCorpus() {
  if (!corpusPromise) {
    corpusPromise = (async () => {
      let scripture = [];
      try {
        scripture = await loadScriptureRows();
      } catch {
        scripture = [];
      }
      if (!scripture.length) corpusPromise = null;
      let manuscripts = [];
      try {
        manuscripts = await loadManuscriptRows();
      } catch {
        manuscripts = [];
      }
      let uploaded = [];
      try {
        uploaded = await loadUserDocumentRows();
      } catch {
        uploaded = [];
      }
      return [...scripture, ...manuscripts, ...loadDssInlineRows(), ...loadArchiveRows(), ...uploaded];
    })().catch((error) => {
      corpusPromise = null;
      throw error;
    });
  }
  return corpusPromise;
}

export function resetCorpusCache() {
  corpusPromise = null;
}

export const SEARCH_CORPORA = [
  { id: "all", label: "All texts and records", sources: null },
  { id: "canon", label: "Holy Bible (King James)", sources: ["canon"] },
  { id: "apocrypha", label: "Apocrypha", sources: ["apocrypha"] },
  { id: "enoch", label: "Book of Enoch", sources: ["enoch"] },
  { id: "dead_sea_scrolls", label: "Dead Sea Scrolls", sources: ["dead_sea_scrolls"] },
  { id: "fathers", label: "Early Christian writings", sources: ["fathers"] },
  { id: "josephus", label: "Josephus", sources: ["josephus"] },
  { id: "philo", label: "Philo", sources: ["philo"] },
  { id: "other", label: "Other manuscripts & codices", sources: ["other"] },
  { id: "archaeology", label: "Archaeological records", sources: ["archaeology"] },
  { id: "science", label: "Scientific records", sources: ["science"] },
  { id: "government", label: "Dated public records", sources: ["government", "vatican", "modern"] },
];

const JESUS_NAMES = new Set(["jesus", "christ", "messiah", "yeshua"]);
const GOSPEL_BOOKS = new Set(["Matthew", "Mark", "Luke", "John"]);
const SCAN_YIELD_EVERY = 200;

/** Let the browser paint and take clicks so a long stored-text scan cannot freeze the page. */
export function yieldToBrowser() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function prepareQuery(item) {
  const q = String(item?.q || item || "").trim();
  if (!q) return null;
  const exact = Boolean(item?.exact);
  const forms = expandSearchForms(q, { exact });
  if (!forms.forms.length && !forms.phrase) return null;
  const minLen = exact ? 1 : 3;
  return {
    q,
    forms,
    exact,
    requirePhrase: Boolean(item?.requirePhrase),
    foldedPhrase: foldMarks(forms.phrase).toLowerCase(),
    needles: (forms.forms || []).map((f) => foldMarks(f).toLowerCase()).filter((f) => f.length >= minLen),
  };
}

function cheapRowHit(folded, pq) {
  if (!folded) return false;
  if (pq.requirePhrase) {
    return Boolean(pq.foldedPhrase && folded.includes(pq.foldedPhrase));
  }
  if (pq.exact) {
    return pq.needles.some((n) => {
      if (n.includes(" ")) return folded.includes(n);
      return new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(folded);
    });
  }
  return pq.needles.some((n) => folded.includes(n));
}

function decorateHit(unit, { must, mustHitAll, boost, preferSpeech, preferCanon }) {
  let score = unit.score;
  if (must.length) {
    const hits = must.filter((w) => wordHitsText(unit.text, w)).length;
    if (mustHitAll) {
      if (hits < must.length) return null;
    } else if (hits < 1 && score < 10) {
      return null;
    }
    score += hits * 4;
  }
  if (boost.length) {
    score += boost.filter((w) => wordHitsText(unit.text, w)).length * 6;
    if (boost.some((w) => JESUS_NAMES.has(w)) && GOSPEL_BOOKS.has(unit.book)) score += 8;
  }
  if (preferSpeech) {
    if (/\b(saith|said|verily|commandment|command)\b/i.test(unit.text)) score += 5;
    if (/\b(thou shalt|ye shall|love one another|love thy|love your)\b/i.test(unit.text)) score += 8;
  }
  if (preferCanon && unit.source === "canon") score += 3;
  return { ...unit, score };
}

function sortScored(unique, preferCanon) {
  unique.sort((a, b) => {
    if (preferCanon) {
      const ac = a.source === "canon" ? 0 : 1;
      const bc = b.source === "canon" ? 0 : 1;
      if (ac !== bc) return ac - bc;
    }
    const src = rankSource(a.source) - rankSource(b.source);
    if (src) return src;
    return (
      String(a.book || "").localeCompare(String(b.book || "")) ||
      Number(a.chapter) - Number(b.chapter) ||
      Number(a.verse) - Number(b.verse) ||
      b.score - a.score
    );
  });
  return unique;
}

/**
 * One pass over the stored corpus for many queries. Used by Assistant so it does not
 * freeze the page by scanning every book once per related word.
 */
export async function searchCorpusMany(queries, { limit = Infinity, sources, contentWords, boostWords, preferSpeech, preferCanon, mustHitAll, clipLong = true } = {}) {
  const prepared = [];
  const seenQ = new Set();
  for (const item of queries || []) {
    const pq = prepareQuery(item);
    if (!pq || seenQ.has(pq.q)) continue;
    seenQ.add(pq.q);
    prepared.push(pq);
  }
  if (!prepared.length) return { query: "", forms: [], matches: [], total: 0 };

  const must = (contentWords || []).filter(Boolean);
  const boost = (boostWords || []).filter(Boolean);
  const extras = { must, mustHitAll, boost, preferSpeech, preferCanon };
  const corpus = await loadCorpus();
  const allow = Array.isArray(sources) && sources.length ? new Set(sources) : null;
  const scored = [];
  let n = 0;
  for (const row of corpus) {
    n += 1;
    if (n % SCAN_YIELD_EVERY === 0) await yieldToBrowser();
    if (allow && !allow.has(row.source)) continue;
    const folded = foldMarks(row.text).toLowerCase();
    for (const pq of prepared) {
      if (!cheapRowHit(folded, pq)) continue;
      const units = clipLong
        ? hitsFromRow(row, pq.forms)
        : (() => {
            const score = scoreText(row.text, pq.forms);
            return score > 0 ? [{ ...row, score }] : [];
          })();
      if (!units.length) continue;
      let added = false;
      for (const unit of units) {
        if (pq.requirePhrase && pq.foldedPhrase && !foldMarks(unit.text).toLowerCase().includes(pq.foldedPhrase)) {
          continue;
        }
        const decorated = decorateHit(unit, extras);
        if (decorated) {
          scored.push(decorated);
          added = true;
        }
      }
      if (added) break;
    }
  }
  const unique = sortScored(uniqueMatches(scored), preferCanon);
  const forms = [...new Set(prepared.flatMap((pq) => pq.forms.forms))];
  return {
    query: prepared.map((pq) => pq.q).join(" | "),
    forms,
    total: unique.length,
    matches: Number.isFinite(limit) && limit > 0 ? unique.slice(0, limit) : unique,
  };
}

export async function searchCorpus(topic, { limit = Infinity, sources, contentWords, boostWords, preferSpeech, preferCanon, requirePhrase, mustHitAll, exact } = {}) {
  return searchCorpusMany([{ q: topic, requirePhrase, exact }], {
    limit,
    sources,
    contentWords,
    boostWords,
    preferSpeech,
    preferCanon,
    mustHitAll,
  });
}

export async function findReferencedPassages(question) {
  const refs = extractReferencesFromQuestion(question);
  if (!refs.length) return [];
  const corpus = await loadCorpus();
  const found = [];
  let n = 0;
  for (const ref of refs) {
    for (const row of corpus) {
      n += 1;
      if (n % SCAN_YIELD_EVERY === 0) await yieldToBrowser();
      const parsed = String(row.reference || "").match(
        /^((?:\d+\s+)?[A-Za-z][A-Za-z'.]+(?:\s+(?:of\s+)?[A-Za-z][A-Za-z'.]+){0,3})\s+(\d+)(?::(\d+))?/
      );
      if (!parsed) continue;
      if (!sameBookName(parsed[1], ref.book)) continue;
      if (String(parsed[2]) !== String(ref.chapter)) continue;
      const verse = Number(parsed[3] || 0);
      const start = Number(ref.verse);
      const end = Number(ref.endVerse || ref.verse);
      if (verse && (verse < start || verse > end)) continue;
      found.push({ ...row, score: 100, askedReference: ref.label });
    }
  }
  return found;
}

export const SOURCE_LABEL = {
  canon: "King James",
  apocrypha: "1611 Apocrypha / deuterocanon",
  enoch: "1 Enoch / 2 Enoch",
  dead_sea_scrolls: "Dead Sea Scrolls",
  fathers: "early Christian writings stored in this app",
  josephus: "Josephus",
  philo: "Philo of Alexandria",
  other: "early manuscript stored in this app",
  archaeology: "archaeological record stored in this app",
  science: "scientific / government science record stored in this app",
  government: "government document stored in this app",
  vatican: "catalogued manuscript stored in this app",
  modern: "dated public record stored in this app",
  user: "document you stored in this app",
};

export function matchesToResearchVerses(matches) {
  return matches.map((m, i) => ({
    reference: m.reference,
    source: m.source,
    text: m.text,
    era: m.archiveItem?.era || "",
    chronological_order: i + 1,
    context_note: `Exact wording from this app's ${SOURCE_LABEL[m.source] || m.source}. Ordered by how closely it matches the search, not by event date.`,
  }));
}

export async function findRelatedVerses(text, currentRef, { limit = 10 } = {}) {
  const forms = expandSearchForms(text);
  const words = forms.words.slice(0, 5);
  if (!words.length) return [];
  const found = await searchCorpus(words.join(" "), { limit: 40, sources: ["canon", "apocrypha", "enoch", "dead_sea_scrolls"] });
  const self = String(currentRef || "").toLowerCase();
  return found.matches.filter((m) => String(m.reference || "").toLowerCase() !== self).slice(0, limit);
}

export async function corpusCoverage() {
  const corpus = await loadCorpus();
  const bySource = {};
  for (const row of corpus) {
    bySource[row.source] = (bySource[row.source] || 0) + 1;
  }
  return {
    total: corpus.length,
    canonVerses: bySource.canon || 0,
    bySource,
  };
}

export function partitionMatches(matches) {
  const scripture = matches.filter((m) =>
    ["canon", "apocrypha", "enoch", "dead_sea_scrolls", "fathers", "josephus", "philo", "other"].includes(m.source)
  );
  return {
    scripture,
    archaeology: matches.filter((m) => m.source === "archaeology"),
    science: matches.filter((m) => m.source === "science"),
    government: matches.filter((m) => m.source === "government" || m.source === "vatican"),
    modern: matches.filter((m) => m.source === "modern"),
  };
}
