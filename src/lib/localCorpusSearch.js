import { APOCRYPHA_BOOKS, CANON_BOOKS, bibleBookUrl, manuscriptUrl } from "@/components/library/corpusData";
import { DSS_LOCAL_TEXT } from "@/components/library/dssLocalTexts";
import { ALL_ARCHIVE } from "@/data/inAppArchive";

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "for", "it", "with", "as",
  "be", "by", "this", "are", "or", "from", "not", "but", "his", "her", "they", "them",
  "you", "your", "were", "have", "had", "has", "will", "shall", "unto", "which",
  "what", "when", "who", "how", "did", "does", "been", "their", "there", "then", "than",
  "into", "upon", "also", "all", "any", "can", "may", "our", "out", "about",
]);

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

const LOCAL_PLAIN = [
  { title: "Ante-Nicene Fathers, Volume 1", file: "/corpus/fathers/ante-nicene-vol1.txt", source: "fathers" },
  { title: "Josephus, Antiquities of the Jews", file: "/corpus/fathers/josephus-antiquities.txt", source: "josephus" },
];

const WEB_BOOKS = [
  { id: "additions_esther", title: "Additions to Esther", chapters: 10 },
  { id: "psalm_151", title: "Psalm 151", chapters: 1 },
  { id: "3_maccabees", title: "3 Maccabees", chapters: 7 },
  { id: "4_maccabees", title: "4 Maccabees", chapters: 18 },
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function expandSearchForms(topic) {
  const phrase = String(topic || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = phrase.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
  const forms = new Set();
  if (phrase) forms.add(phrase);
  for (const w of words) {
    forms.add(w);
    const stem = w.replace(/(eth|est|ing|ied|ies|ed|es|s|ly|er)$/i, "");
    if (stem.length >= 3) {
      ["", "s", "es", "ed", "ing", "eth", "est", "er", "ied"].forEach((suf) => forms.add(stem + suf));
      forms.add(stem);
    }
  }
  return { phrase, words, forms: [...forms].filter((f) => f.length >= 3) };
}

function scoreText(text, { phrase, forms }) {
  const lower = String(text || "").toLowerCase();
  if (!lower) return 0;
  if (phrase.length > 3 && lower.includes(phrase)) return 10 + (phrase.split(" ").length > 1 ? 6 : 0);
  let hits = 0;
  for (const f of forms) {
    if (f === phrase) continue;
    if (new RegExp(`\\b${escapeRe(f)}\\b`, "i").test(text)) hits += 1;
  }
  return hits;
}

async function loadBook(book, apocrypha) {
  const key = `${apocrypha ? "a" : "c"}:${book}`;
  if (bookCache.has(key)) return bookCache.get(key);
  const res = await fetch(bibleBookUrl(book, apocrypha));
  if (!res.ok) throw new Error(`Could not load ${book}`);
  const json = await res.json();
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

function stripGutenberg(text) {
  const start = text.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG/i);
  const end = text.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i);
  let body = text;
  if (start >= 0) body = body.slice(text.indexOf("\n", start) + 1);
  if (end >= 0) {
    const cut = body.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i);
    if (cut >= 0) body = body.slice(0, cut);
  }
  return body.trim();
}

function rowsFromChunks(title, text, source, maxChunk = 1600) {
  const clean = stripGutenberg(String(text || ""));
  const parts = clean.split(/\n(?=## |BOOK |Book |CHAPTER |Chapter |\*\*\*)/);
  const rows = [];
  let n = 0;
  for (const part of parts) {
    const body = part.trim();
    if (body.length < 40) continue;
    const heading = body.match(/^(## |BOOK |Book |CHAPTER |Chapter )(.+)/);
    const slices = [];
    for (let i = 0; i < body.length; i += maxChunk) slices.push(body.slice(i, i + maxChunk));
    for (const slice of slices) {
      n += 1;
      rows.push({
        book: title,
        chapter: n,
        verse: 1,
        reference: heading ? `${title} — ${heading[2].trim().slice(0, 80)}` : `${title} §${n}`,
        text: slice,
        source,
      });
    }
  }
  if (!rows.length && clean) {
    rows.push({
      book: title,
      chapter: 1,
      verse: 1,
      reference: title,
      text: clean.slice(0, maxChunk),
      source,
    });
  }
  return rows;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) return "";
  return res.text();
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
      return rowsFromChunks(slug.replace(/-/g, " "), md, slug === "1-enoch" || slug === "2-enoch" ? "enoch" : "other");
    } catch {
      return [];
    }
  });
  const localMd = await mapPool(LOCAL_MARKDOWN, 4, async (url) => {
    try {
      const md = await fetchText(url);
      const name = url.split("/").pop().replace(/\.md$/, "").replace(/-/g, " ");
      return rowsFromChunks(name, md, "dead_sea_scrolls");
    } catch {
      return [];
    }
  });
  const plain = await mapPool(LOCAL_PLAIN, 2, async (item) => {
    try {
      const txt = await fetchText(item.file);
      return rowsFromChunks(item.title, txt, item.source);
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
            text: text.slice(0, 2000),
            source: "apocrypha",
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
    rowsFromChunks(id.replace(/-/g, " "), md, "dead_sea_scrolls")
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
    corpusPromise = Promise.all([loadScriptureRows(), loadManuscriptRows()]).then(([scripture, manuscripts]) => [
      ...scripture,
      ...manuscripts,
      ...loadDssInlineRows(),
      ...loadArchiveRows(),
    ]);
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

export async function searchCorpus(topic, { limit = 180, sources } = {}) {
  const q = String(topic || "").trim();
  if (!q) return { query: q, forms: [], matches: [] };
  const forms = expandSearchForms(q);
  if (!forms.forms.length && !forms.phrase) return { query: q, forms: [], matches: [] };

  const corpus = await loadCorpus();
  const allow = Array.isArray(sources) && sources.length ? new Set(sources) : null;
  const scored = [];
  for (const row of corpus) {
    if (allow && !allow.has(row.source)) continue;
    const score = scoreText(row.text, forms);
    if (score <= 0) continue;
    scored.push({ ...row, score });
  }
  scored.sort(
    (a, b) => b.score - a.score || a.book.localeCompare(b.book) || Number(a.chapter) - Number(b.chapter)
  );
  return {
    query: q,
    forms: forms.forms,
    matches: scored.slice(0, limit),
  };
}

const SOURCE_LABEL = {
  canon: "King James",
  apocrypha: "1611 Apocrypha / deuterocanon",
  enoch: "1 Enoch / 2 Enoch",
  dead_sea_scrolls: "Dead Sea Scrolls",
  fathers: "Ante-Nicene Fathers",
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
