import { APOCRYPHA_BOOKS, CANON_BOOKS, bibleBookUrl, manuscriptUrl } from "@/components/library/corpusData";
import { DSS_LOCAL_TEXT } from "@/components/library/dssLocalTexts";
import { ALL_ARCHIVE } from "@/data/inAppArchive";
import { fetchStoredText, looksLikeHtmlDocument } from "@/lib/fetchStoredText";
import { expandWithLearning } from "./assistantLearn.js";
import {
  aliasesForSearchWord,
  clipAroundMatch,
  documentRow,
  foldMarks,
  INDEXED_PLAIN_TEXTS,
  passageHitsQuery,
  rankSource,
  rowsFromVerseMarks,
  rowsFromStoredText,
  scorePassage,
  uniqueMatches,
} from "./corpusPassages.js";
import { familyHitsText, familyOf } from "./wordFamilies.js";

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
  nephilim: ["naphilim", "naphil", "giants", "giant", "watchers", "watcher", "grigori"],
  nephil: ["nephilim", "naphilim", "giants", "watchers"],
  naphilim: ["nephilim", "naphil", "giants", "watchers"],
  naphil: ["nephilim", "naphilim", "giants"],
};

const bookCache = new Map();

const MANUSCRIPT_SLUGS = [
  "1-enoch",
  "2-enoch",
  "psalms-of-solomon",
  "lives-of-the-prophets",
  "testament-of-zebulun",
  "ladder-of-jacob",
  "2-hermas",
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
  for (const alias of [...(KJV_TOPIC_ALIASES[folded] || []), ...aliasesForSearchWord(folded)]) {
    const aliasFolded = foldMarks(alias).toLowerCase();
    if (aliasFolded) forms.add(aliasFolded);
  }
}

export function expandSearchForms(topic) {
  const phrase = foldMarks(topic)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = phrase.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
  const forms = new Set();
  if (phrase) forms.add(phrase);
  for (const w of words) addFormsForWord(forms, w);
  return { phrase, words, forms: [...forms].filter((f) => f.length >= 3) };
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
  const marked = rowsFromVerseMarks(title, text, source);
  if (marked.length >= 2) return marked;
  return documentRow(title, text, source);
}

function explodeDocumentHits(row, queryForms) {
  if (!passageHitsQuery(row.text, queryForms)) return [];
  return rowsFromStoredText(row.book, row.text, row.source)
    .map((unit) => {
      const score = scoreText(unit.text, queryForms);
      if (score <= 0) return null;
      const text = unit.text.length > 900 ? clipAroundMatch(unit.text, queryForms.forms) : unit.text;
      return { ...unit, text, score };
    })
    .filter(Boolean);
}

function hitsFromRow(row, queryForms) {
  if (row.atomic === false) return explodeDocumentHits(row, queryForms);
  const score = scoreText(row.text, queryForms);
  return score > 0 ? [{ ...row, score }] : [];
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
      const source = slug === "1-enoch" || slug === "2-enoch" ? "enoch" : "other";
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
      return documentRow(item.title, txt, item.source);
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
          chapters.push({
            book: book.title,
            chapter: n,
            verse: 1,
            reference: `${book.title} ${n}`,
            text,
            source: "apocrypha",
            atomic: false,
          });
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
      return [...scripture, ...manuscripts, ...loadDssInlineRows(), ...loadArchiveRows()];
    })().catch((error) => {
      corpusPromise = null;
      throw error;
    });
  }
  return corpusPromise;
}

export const SEARCH_CORPORA = [
  { id: "all", label: "All texts and records", sources: null },
  { id: "canon", label: "Holy Bible (King James)", sources: ["canon"] },
  { id: "apocrypha", label: "Apocrypha", sources: ["apocrypha"] },
  { id: "enoch", label: "Book of Enoch", sources: ["enoch"] },
  { id: "dead_sea_scrolls", label: "Dead Sea Scrolls", sources: ["dead_sea_scrolls"] },
  { id: "fathers", label: "Early Christian writings", sources: ["fathers"] },
  { id: "josephus", label: "Josephus", sources: ["josephus"] },
  { id: "other", label: "Other manuscripts & codices", sources: ["other"] },
  { id: "archaeology", label: "Archaeological records", sources: ["archaeology"] },
  { id: "science", label: "Scientific records", sources: ["science"] },
  { id: "government", label: "Dated public records", sources: ["government", "vatican", "modern"] },
];

const JESUS_NAMES = new Set(["jesus", "christ", "messiah", "yeshua"]);
const GOSPEL_BOOKS = new Set(["Matthew", "Mark", "Luke", "John"]);

export async function searchCorpus(topic, { limit = 180, sources, contentWords, boostWords, preferSpeech, preferCanon, requirePhrase, mustHitAll } = {}) {
  const q = String(topic || "").trim();
  if (!q) return { query: q, forms: [], matches: [] };
  const forms = expandSearchForms(q);
  if (!forms.forms.length && !forms.phrase) return { query: q, forms: [], matches: [] };
  const must = (contentWords || []).filter(Boolean);
  const boost = (boostWords || []).filter(Boolean);
  const foldedPhrase = foldMarks(forms.phrase).toLowerCase();

  const corpus = await loadCorpus();
  const allow = Array.isArray(sources) && sources.length ? new Set(sources) : null;
  const scored = [];
  for (const row of corpus) {
    if (allow && !allow.has(row.source)) continue;
    if (requirePhrase && foldedPhrase && !foldMarks(row.text).toLowerCase().includes(foldedPhrase)) continue;
    const units = hitsFromRow(row, forms);
    for (const unit of units) {
      if (requirePhrase && foldedPhrase && !foldMarks(unit.text).toLowerCase().includes(foldedPhrase)) continue;
      let score = unit.score;
      if (must.length) {
        const hits = must.filter((w) => wordHitsText(unit.text, w)).length;
        if (mustHitAll) {
          if (hits < must.length) continue;
        } else if (hits < 1 && score < 10) {
          continue;
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
      scored.push({ ...unit, score });
    }
  }
  const unique = uniqueMatches(scored);
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
  return {
    query: q,
    forms: forms.forms,
    total: unique.length,
    matches: Number.isFinite(limit) && limit > 0 ? unique.slice(0, limit) : unique,
  };
}

export async function findReferencedPassages(question) {
  const refs = extractReferencesFromQuestion(question);
  if (!refs.length) return [];
  const corpus = await loadCorpus();
  const found = [];
  for (const ref of refs) {
    for (const row of corpus) {
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
  other: "early manuscript stored in this app",
  archaeology: "archaeological record stored in this app",
  science: "scientific / government science record stored in this app",
  government: "government document stored in this app",
  vatican: "catalogued manuscript stored in this app",
  modern: "dated public record stored in this app",
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
    ["canon", "apocrypha", "enoch", "dead_sea_scrolls", "fathers", "josephus", "other"].includes(m.source)
  );
  return {
    scripture,
    archaeology: matches.filter((m) => m.source === "archaeology"),
    science: matches.filter((m) => m.source === "science"),
    government: matches.filter((m) => m.source === "government" || m.source === "vatican"),
    modern: matches.filter((m) => m.source === "modern"),
  };
}
