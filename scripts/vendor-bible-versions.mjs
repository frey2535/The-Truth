/**
 * Store older complete public-domain English Bibles as the same per-book JSON
 * the King James reader already uses. Modern shortened versions are not fetched.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const destRoot = join(root, "public", "corpus", "bibles");

const CANON = [
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

const NAME_MAP = {
  "Song of Songs": "Song of Solomon",
  Canticles: "Song of Solomon",
  "Canticle of Canticles": "Song of Solomon",
  "Canticle of Canticles (Song of Solomon)": "Song of Solomon",
  Sirach: "Sirach",
  Wisdom: "Wisdom",
  "Wisdom of Solomon": "Wisdom",
  Ecclesiasticus: "Sirach",
  "Ecclesiasticus (Sirach)": "Sirach",
  "1 Machabees": "1 Maccabees",
  "2 Machabees": "2 Maccabees",
  "I Machabees": "1 Maccabees",
  "II Machabees": "2 Maccabees",
  Apocalypse: "Revelation",
  "The Apocalypse": "Revelation",
  "The Apocalypse of St. John": "Revelation",
};

const EXTRA_BOOKS = new Set([
  "Tobit",
  "Judith",
  "Wisdom",
  "Sirach",
  "Baruch",
  "1 Maccabees",
  "2 Maccabees",
]);

const SKIP_BOOKS = new Set([
  "3 Maccabees",
  "4 Maccabees",
  "Prayer of Manasseh",
  "Psalm 151",
  "1 Esdras",
  "2 Esdras",
  "Additions to Esther",
  "Letter of Jeremiah",
  "Prayer of Azariah",
  "Susanna",
  "Bel and the Dragon",
]);

const USFM_TO_BOOK = {
  GEN: "Genesis", EXO: "Exodus", LEV: "Leviticus", NUM: "Numbers", DEU: "Deuteronomy",
  JOS: "Joshua", JDG: "Judges", RUT: "Ruth", "1SA": "1 Samuel", "2SA": "2 Samuel",
  "1KI": "1 Kings", "2KI": "2 Kings", "1CH": "1 Chronicles", "2CH": "2 Chronicles",
  EZR: "Ezra", NEH: "Nehemiah", EST: "Esther", JOB: "Job", PSA: "Psalms", PRO: "Proverbs",
  ECC: "Ecclesiastes", SNG: "Song of Solomon", ISA: "Isaiah", JER: "Jeremiah",
  LAM: "Lamentations", EZK: "Ezekiel", DAN: "Daniel", HOS: "Hosea", JOL: "Joel",
  AMO: "Amos", OBA: "Obadiah", JON: "Jonah", MIC: "Micah", NAM: "Nahum", HAB: "Habakkuk",
  ZEP: "Zephaniah", HAG: "Haggai", ZEC: "Zechariah", MAL: "Malachi", MAT: "Matthew",
  MRK: "Mark", LUK: "Luke", JHN: "John", ACT: "Acts", ROM: "Romans", "1CO": "1 Corinthians",
  "2CO": "2 Corinthians", GAL: "Galatians", EPH: "Ephesians", PHP: "Philippians",
  COL: "Colossians", "1TH": "1 Thessalonians", "2TH": "2 Thessalonians", "1TI": "1 Timothy",
  "2TI": "2 Timothy", TIT: "Titus", PHM: "Philemon", HEB: "Hebrews", JAS: "James",
  "1PE": "1 Peter", "2PE": "2 Peter", "1JN": "1 John", "2JN": "2 John", "3JN": "3 John",
  JUD: "Jude", REV: "Revelation", TOB: "Tobit", JDT: "Judith", WIS: "Wisdom",
  SIR: "Sirach", BAR: "Baruch", "1MA": "1 Maccabees", "2MA": "2 Maccabees",
};

function fileName(book) {
  return `${book.replace(/ /g, "")}.json`;
}

function cleanVerse(text) {
  return String(text || "")
    .replace(/<FI>|<Fi>|<fi>/g, "")
    .replace(/<\/FI>|<\/Fi>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeBookName(name) {
  const raw = String(name || "").trim();
  return NAME_MAP[raw] || raw;
}

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "TheTruthCorpusVendor/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function writeBook(versionId, book, chapters) {
  const mapped = normalizeBookName(book);
  const known = CANON.includes(mapped) || EXTRA_BOOKS.has(mapped);
  if (!known) {
    if (!SKIP_BOOKS.has(mapped)) {
      console.warn("skip unknown book", book, "->", mapped, versionId);
    }
    return 0;
  }
  const cleaned = chapters
    .filter((ch) => ch.verses?.length)
    .map((ch) => ({
      chapter: Number(ch.chapter),
      verses: ch.verses.map((v) => ({
        verse: String(v.verse),
        text: cleanVerse(v.text),
      })),
    }));
  if (!cleaned.length) return 0;
  const rel = join(versionId, fileName(mapped));
  const path = join(destRoot, rel);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify({ book: mapped, chapters: cleaned }, null, 2)}\n`);
  const verses = cleaned.reduce((n, ch) => n + ch.verses.length, 0);
  console.log("saved", rel, verses, "verses");
  return verses;
}

function chaptersFromBookJson(book) {
  return (book.chapters || []).map((ch) => ({
    chapter: ch.chapter ?? ch.chapter_nr,
    verses: (ch.verses || []).map((v) => ({ verse: v.verse, text: v.text })),
  }));
}

async function vendorGetbible(versionId, slug) {
  const books = await getJson(`https://api.getbible.net/v2/${slug}/books.json`);
  const entries = Object.values(books);
  let total = 0;
  const pool = 4;
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const meta = entries[i++];
      const book = await getJson(`https://api.getbible.net/v2/${slug}/${meta.nr}.json`);
      const verses = await writeBook(versionId, book.name || meta.name, chaptersFromBookJson(book));
      total += verses;
    }
  }
  await Promise.all(Array.from({ length: pool }, () => worker()));
  return total;
}

function parseUsfm(text) {
  const idMatch = text.match(/\\id\s+([A-Z0-9]{3})/);
  const code = idMatch?.[1] || "";
  const book = USFM_TO_BOOK[code];
  if (!book) return null;
  const chapters = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const ch = line.match(/^\\c\s+(\d+)/);
    if (ch) {
      current = { chapter: Number(ch[1]), verses: [] };
      chapters.push(current);
      continue;
    }
    const vs = line.match(/^\\v\s+(\d+)\s+(.*)$/);
    if (vs && current) {
      current.verses.push({ verse: vs[1], text: vs[2].replace(/\\[a-zA-Z]+\*?(\s|$)/g, " ").replace(/\{[^}]+\}/g, "") });
    }
  }
  return { book, chapters };
}

async function vendorEbibleUsfm(versionId, ebibleId) {
  const zip = join(tmpdir(), `${ebibleId}_usfm.zip`);
  const dir = join(tmpdir(), `${ebibleId}_usfm`);
  if (!existsSync(zip)) {
    execFileSync("curl", ["-fsSL", "-o", zip, `https://ebible.org/Scriptures/${ebibleId}_usfm.zip`], { stdio: "inherit" });
  }
  execFileSync("rm", ["-rf", dir]);
  execFileSync("mkdir", ["-p", dir]);
  execFileSync("unzip", ["-qo", zip, "-d", dir]);
  const files = readdirSync(dir, { recursive: true })
    .filter((name) => String(name).toLowerCase().endsWith(".usfm"))
    .map((name) => join(dir, name));
  let total = 0;
  for (const file of files) {
    const parsed = parseUsfm(readFileSync(file, "utf8"));
    if (!parsed) continue;
    total += await writeBook(versionId, parsed.book, parsed.chapters);
  }
  return total;
}

async function main() {
  await mkdir(destRoot, { recursive: true });
  const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const jobs = [
    ["geneva", () => vendorEbibleUsfm("geneva", "enggnv")],
    ["douay", () => vendorGetbible("douay", "douayrheims")],
    ["ylt", () => vendorGetbible("ylt", "ylt")],
    ["webster", () => vendorGetbible("webster", "wb")],
  ].filter(([id]) => !only.length || only.includes(id));
  for (const [id, fn] of jobs) {
    console.log("vendoring", id);
    const verses = await fn();
    console.log(id, "total verses", verses);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
