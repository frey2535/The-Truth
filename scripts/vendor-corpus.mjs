/**
 * Download public-domain Christian texts into public/corpus so the app
 * can be read and searched without live internet fetches.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", "corpus");

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

const APOCRYPHA = [
  "1 Esdras", "2 Esdras", "Tobit", "Judith", "Wisdom of Solomon", "Ecclesiasticus",
  "Baruch", "Letter of Jeremiah", "Prayer of Azariah", "Susanna", "Bel and the Dragon",
  "Prayer of Manasseh", "1 Maccabees", "2 Maccabees",
];

const MANUSCRIPTS = [
  "1-enoch",
  "2-enoch",
  "psalms-of-solomon",
  "lives-of-the-prophets",
  "testament-of-zebulun",
  "ladder-of-jacob",
  "2-hermas",
];

const EXTRA = [
  {
    file: "manuscripts/jubilees.md",
    url: "https://raw.githubusercontent.com/zackseyun/peoples-open-bible/main/JUBILEES.md",
  },
  {
    file: "fathers/ante-nicene-vol1.txt",
    url: "https://ccel.org/ccel/s/schaff/anf01/cache/anf01.txt",
  },
  {
    file: "fathers/josephus-antiquities.txt",
    url: "https://www.gutenberg.org/files/2848/2848-0.txt",
  },
  {
    file: "fathers/josephus-wars.txt",
    url: "https://www.gutenberg.org/files/2850/2850.txt",
  },
];

const WEB_BOOKS = [
  { id: "ESG", chapters: 16, file: "web/additions_esther" },
  { id: "PS2", chapters: 1, file: "web/psalm_151" },
  { id: "3MA", chapters: 7, file: "web/3_maccabees" },
  { id: "4MA", chapters: 18, file: "web/4_maccabees" },
];

const KJV = "https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv/";
const KJV1611 = "https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv-1611/";
const MD = "https://cdn.jsdelivr.net/gh/scrollmapper/bible_databases_deuterocanonical/sources/en/";

async function save(rel, bytes) {
  const path = join(dest, rel);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
  console.log("saved", rel, bytes.length);
}

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function one(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.error("FAIL", label, err.message);
  }
}

async function main() {
  for (const book of CANON) {
    const name = book.replace(/ /g, "") + ".json";
    await one(name, async () => save(`bible/${name}`, await get(`${KJV}${name}`)));
  }
  for (const book of APOCRYPHA) {
    const name = `${book.replace(/ /g, "_")}.json`;
    await one(name, async () =>
      save(`apocrypha/${name}`, await get(`${KJV1611}${encodeURIComponent(book)}.json`))
    );
  }
  for (const slug of MANUSCRIPTS) {
    await one(slug, async () =>
      save(`manuscripts/${slug}.md`, await get(`${MD}${slug}/${slug}.md`))
    );
  }
  for (const item of EXTRA) {
    await one(item.file, async () => save(item.file, await get(item.url)));
  }
  for (const book of WEB_BOOKS) {
    for (let n = 1; n <= book.chapters; n += 1) {
      const ch = String(n).padStart(2, "0");
      const rel = `${book.file}/${ch}.htm`;
      await one(rel, async () =>
        save(rel, await get(`https://ebible.org/engwebu/${book.id}${ch}.htm`))
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
