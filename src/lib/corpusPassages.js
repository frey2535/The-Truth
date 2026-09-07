/** Split stored books into verse/paragraph rows and match accented spellings. */

export function foldMarks(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[ʼʻʽ`´]/g, "'");
}

function escapeRe(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const NEPHILIM_NAMES = ["nephilim", "nephil", "nephillim", "naphilim", "naphil", "naphilims"];
const NEPHILIM_STORED = [
  ...NEPHILIM_NAMES,
  "giants",
  "giant",
  "watchers",
  "watcher",
  "grigori",
  "anakim",
  "anakims",
  "rephaim",
  "rephaims",
  "emim",
  "emims",
];

/** One-way: a Nephilim search also finds the English those books actually print. */
export const SEARCH_TOPIC_ALIASES = Object.fromEntries(
  NEPHILIM_NAMES.map((name) => [name, NEPHILIM_STORED.filter((w) => w !== name)])
);

export const INDEXED_PLAIN_TEXTS = [
  { title: "Ante-Nicene Fathers, Volume 1", file: "/corpus/fathers/ante-nicene-vol1.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 2", file: "/corpus/fathers/ante-nicene-vol2.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 3", file: "/corpus/fathers/ante-nicene-vol3.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 4", file: "/corpus/fathers/ante-nicene-vol4.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 5", file: "/corpus/fathers/ante-nicene-vol5.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 6", file: "/corpus/fathers/ante-nicene-vol6.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 7", file: "/corpus/fathers/ante-nicene-vol7.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 8", file: "/corpus/fathers/ante-nicene-vol8.txt", source: "fathers" },
  { title: "Ante-Nicene Fathers, Volume 9", file: "/corpus/fathers/ante-nicene-vol9.txt", source: "fathers" },
  { title: "Nicene and Post-Nicene Fathers, Series 1, Volume 1", file: "/corpus/fathers/npnf101.txt", source: "fathers" },
  { title: "Nicene and Post-Nicene Fathers, Series 1, Volume 2", file: "/corpus/fathers/npnf102.txt", source: "fathers" },
  { title: "Nicene and Post-Nicene Fathers, Series 2, Volume 1", file: "/corpus/fathers/npnf201.txt", source: "fathers" },
  { title: "Nicene and Post-Nicene Fathers, Series 2, Volume 4", file: "/corpus/fathers/npnf204.txt", source: "fathers" },
  { title: "Nicene and Post-Nicene Fathers, Series 2, Volume 14", file: "/corpus/fathers/npnf214.txt", source: "fathers" },
  { title: "Josephus, Antiquities of the Jews", file: "/corpus/fathers/josephus-antiquities.txt", source: "josephus" },
  { title: "Josephus, The Jewish War", file: "/corpus/fathers/josephus-wars.txt", source: "josephus" },
  { title: "Josephus, Against Apion", file: "/corpus/fathers/josephus-apion.txt", source: "josephus" },
  { title: "Pliny the Younger, Letters", file: "/corpus/catalog/pliny-letters.txt", source: "government" },
  { title: "Pistis Sophia", file: "/corpus/catalog/pistis-sophia.txt", source: "other" },
  { title: "The Imitation of Christ", file: "/corpus/catalog/imitation-of-christ.txt", source: "other" },
  { title: "Historic Creeds", file: "/corpus/catalog/creeds.txt", source: "fathers" },
  { title: "Forgotten Books of Eden", file: "/corpus/catalog/forgotten-books-of-eden.txt", source: "other" },
];

const TITLE_FIX = {
  "1 enoch": "1 Enoch",
  "2 enoch": "2 Enoch",
  jubilees: "Jubilees",
  "psalms of solomon": "Psalms of Solomon",
  "lives of the prophets": "Lives of the Prophets",
  "testament of zebulun": "Testament of Zebulun",
  "ladder of jacob": "Ladder of Jacob",
  "2 hermas": "Shepherd of Hermas",
  "book of giants": "Book of Giants",
  "community rule": "Community Rule",
  "damascus document": "Damascus Document",
  "genesis apocryphon": "Genesis Apocryphon",
  hodayot: "Hodayot",
  "pesher habakkuk": "Pesher Habakkuk",
  "temple scroll": "Temple Scroll",
  "war scroll": "War Scroll",
};

export function prettyBookTitle(title) {
  const raw = String(title || "").trim();
  const key = raw.toLowerCase();
  if (TITLE_FIX[key]) return TITLE_FIX[key];
  return raw.replace(/\b([a-z])/g, (ch) => ch.toUpperCase());
}

export function aliasesForSearchWord(word) {
  const folded = foldMarks(word).toLowerCase();
  return SEARCH_TOPIC_ALIASES[folded] || [];
}

export function scorePassage(text, { phrase, forms }) {
  const folded = foldMarks(text).toLowerCase();
  if (!folded) return 0;
  const foldedPhrase = foldMarks(phrase || "").toLowerCase();
  if (foldedPhrase.length > 3 && folded.includes(foldedPhrase)) {
    return 10 + (foldedPhrase.split(" ").length > 1 ? 6 : 0);
  }
  let hits = 0;
  for (const form of forms || []) {
    const ff = foldMarks(form).toLowerCase();
    if (!ff || ff === foldedPhrase || ff.length < 3) continue;
    if (new RegExp(`\\b${escapeRe(ff)}\\b`, "i").test(folded)) hits += 1;
  }
  return hits;
}

export function passageHitsQuery(text, queryForms) {
  return scorePassage(text, queryForms) > 0;
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

const VERSE_MARK = /(?:\*\*)?\[(\d+):(\d+[a-z]*)\](?:\*\*)?/g;

export function rowsFromVerseMarks(title, text, source) {
  const clean = stripGutenberg(String(text || ""));
  const marks = [...clean.matchAll(new RegExp(VERSE_MARK.source, "g"))];
  if (!marks.length) return [];
  const book = prettyBookTitle(title);
  const rows = [];
  for (let i = 0; i < marks.length; i += 1) {
    const start = marks[i].index + marks[i][0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : clean.length;
    const verseText = clean.slice(start, end).replace(/\s+/g, " ").trim();
    if (verseText.length < 2) continue;
    const chapter = Number(marks[i][1]);
    const verseLabel = marks[i][2];
    const verse = Number(String(verseLabel).replace(/\D/g, "")) || 1;
    rows.push({
      book,
      chapter,
      verse,
      reference: `${book} ${chapter}:${verseLabel}`,
      text: verseText,
      source,
      atomic: true,
    });
  }
  return rows;
}

function unwrapPlain(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]*\n[ \t]*(?!\n)/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

export function rowsFromParagraphs(title, text, source) {
  const body = unwrapPlain(stripGutenberg(String(text || "")));
  const parts = body.split(/\n\s*\n|(?=## |BOOK |Book \d|CHAPTER |Chapter \d)/);
  const book = prettyBookTitle(title);
  const rows = [];
  let n = 0;
  for (const part of parts) {
    const verseText = part.replace(/\s+/g, " ").trim();
    if (verseText.length < 30) continue;
    n += 1;
    const heading = part.match(/^(## |BOOK |Book |CHAPTER |Chapter )(.+)/);
    rows.push({
      book,
      chapter: n,
      verse: 1,
      reference: heading ? `${book} — ${String(heading[2]).trim().slice(0, 80)}` : `${book} §${n}`,
      text: verseText,
      source,
      atomic: true,
    });
  }
  if (!rows.length && body.trim()) {
    rows.push({
      book,
      chapter: 1,
      verse: 1,
      reference: book,
      text: body.replace(/\s+/g, " ").trim(),
      source,
      atomic: true,
    });
  }
  return rows;
}

export function rowsFromStoredText(title, text, source) {
  const marked = rowsFromVerseMarks(title, text, source);
  if (marked.length >= 2) return marked;
  return rowsFromParagraphs(title, text, source);
}

export function documentRow(title, text, source) {
  const clean = stripGutenberg(String(text || ""));
  if (clean.length < 40) return [];
  return [
    {
      book: prettyBookTitle(title),
      chapter: 1,
      verse: 1,
      reference: prettyBookTitle(title),
      text: clean,
      source,
      atomic: false,
    },
  ];
}

export function clipAroundMatch(text, forms, windowSize = 720) {
  const raw = String(text || "");
  if (raw.length <= windowSize) return raw;
  const folded = foldMarks(raw).toLowerCase();
  let idx = -1;
  for (const form of forms || []) {
    const ff = foldMarks(form).toLowerCase();
    if (!ff) continue;
    const at = folded.search(new RegExp(`\\b${escapeRe(ff)}\\b`, "i"));
    if (at >= 0 && (idx < 0 || at < idx)) idx = at;
  }
  if (idx < 0) return `${raw.slice(0, windowSize).trim()}…`;
  const start = Math.max(0, idx - Math.floor(windowSize / 3));
  const end = Math.min(raw.length, start + windowSize);
  return `${start > 0 ? "…" : ""}${raw.slice(start, end).trim()}${end < raw.length ? "…" : ""}`;
}

export function uniqueMatches(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows || []) {
    const key = `${row.source}|${row.reference}|${String(row.text || "").slice(0, 140)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

const SOURCE_RANK = [
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

export function rankSource(source) {
  const i = SOURCE_RANK.indexOf(source);
  return i < 0 ? SOURCE_RANK.length : i;
}
