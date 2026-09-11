/**
 * Audit: catalog maps vs files on disk vs extract headings.
 */
import { readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_TEXT_MAP } from "../src/data/catalogTextMap.js";
import { extractCatalogSection, headingPattern } from "../src/lib/catalogExtract.js";
import { looksLikeHtmlDocument, looksLikeAppShell } from "../src/lib/fetchStoredText.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function exists(rel) {
  try {
    await access(join(root, rel));
    return true;
  } catch {
    return false;
  }
}

const fileCache = new Map();
async function loadPublic(urlPath) {
  const rel = join("public", urlPath.replace(/^\//, ""));
  if (fileCache.has(rel)) return fileCache.get(rel);
  const full = join(root, rel);
  try {
    const text = await readFile(full, "utf8");
    const rec = { ok: true, text, html: looksLikeHtmlDocument(text) || looksLikeAppShell(text), rel };
    fileCache.set(rel, rec);
    return rec;
  } catch {
    const rec = { ok: false, text: "", html: false, rel };
    fileCache.set(rel, rec);
    return rec;
  }
}

const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation",
];
const apoc = [
  "1 Esdras", "2 Esdras", "Tobit", "Judith", "Wisdom of Solomon", "Ecclesiasticus",
  "Baruch", "Letter of Jeremiah", "Prayer of Azariah", "Susanna", "Bel and the Dragon",
  "Prayer of Manasseh", "1 Maccabees", "2 Maccabees",
];
const mss = [
  "1-enoch", "2-enoch", "3-enoch", "psalms-of-solomon", "lives-of-the-prophets",
  "testament-of-zebulun", "ladder-of-jacob", "2-hermas", "jubilees",
  "2-baruch", "3-baruch", "4-baruch", "assumption-of-moses", "ascension-of-isaiah",
  "odes-of-solomon", "sibylline-oracles", "joseph-and-aseneth", "testament-of-job",
  "pseudo-philo", "apocalypse-of-abraham", "cave-of-treasures", "sinodos",
  "book-of-the-covenant-eth", "ethiopic-didascalia",
];

const missingFiles = [];
const htmlFiles = [];
const headingMiss = [];
const headingOk = [];
const tinyExtract = [];

for (const [id, entry] of Object.entries(CATALOG_TEXT_MAP)) {
  const rec = await loadPublic(entry.file);
  if (!rec.ok) {
    missingFiles.push({ id, file: entry.file });
    continue;
  }
  if (rec.html) {
    htmlFiles.push({ id, file: entry.file });
    continue;
  }
  const extracted = extractCatalogSection(rec.text, entry.start, entry.next);
  if (!extracted.found || !extracted.text) {
    headingMiss.push({ id, file: entry.file, start: entry.start, next: entry.next });
    continue;
  }
  if (extracted.text.length < 400) {
    tinyExtract.push({ id, file: entry.file, start: entry.start, chars: extracted.text.length, preview: extracted.text.slice(0, 180).replace(/\s+/g, " ") });
  }
  headingOk.push({ id, chars: extracted.text.length, truncated: extracted.truncated });
}

const bibleMiss = [];
for (const book of bibleBooks) {
  const rel = `public/corpus/bible/${book.replace(/ /g, "")}.json`;
  if (!(await exists(rel))) bibleMiss.push(rel);
}
const apocMiss = [];
for (const book of apoc) {
  const rel = `public/corpus/apocrypha/${book.replace(/ /g, "_")}.json`;
  if (!(await exists(rel))) apocMiss.push(rel);
}
const mssMiss = [];
for (const slug of mss) {
  const rel = `public/corpus/manuscripts/${slug}.md`;
  if (!(await exists(rel))) mssMiss.push(rel);
}

if (!headingPattern("SMYRNAEANS").test("The Epistle of Ignatius to the Smyrnæans")) {
  throw new Error("ligature heading match failed");
}

console.log(JSON.stringify({
  catalogMap: Object.keys(CATALOG_TEXT_MAP).length,
  headingOk: headingOk.length,
  headingMiss,
  tinyExtract,
  missingFiles,
  htmlFiles,
  bibleMiss,
  apocMiss,
  mssMiss,
  truncated: headingOk.filter((x) => x.truncated).map((x) => ({ id: x.id, chars: x.chars })),
  sampleOk: headingOk.slice(0, 8),
}, null, 2));
