import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  aliasesForSearchWord,
  foldMarks,
  INDEXED_PLAIN_TEXTS,
  rowsFromStoredText,
  scorePassage,
  SEARCH_TOPIC_ALIASES,
} from "../src/lib/corpusPassages.js";

assert.equal(foldMarks("Nâphîlîm").toLowerCase(), "naphilim");
assert.ok(SEARCH_TOPIC_ALIASES.nephilim.includes("giants"));
assert.ok(SEARCH_TOPIC_ALIASES.nephilim.includes("watchers"));
assert.ok(aliasesForSearchWord("Nephilim").includes("giant"));
assert.ok(!aliasesForSearchWord("nephilim").includes("watch"));

const nephilimForms = {
  phrase: "nephilim",
  forms: ["nephilim", ...aliasesForSearchWord("nephilim")],
};

assert.ok(
  scorePassage("And they begat sons the Nâphîlîm, and they were all unlike", nephilimForms) > 0,
  "accented Jubilees spelling must match a Nephilim search"
);
assert.ok(scorePassage("There were giants in the earth in those days", nephilimForms) > 0);
assert.ok(scorePassage("And the Watchers shall quake", nephilimForms) > 0);
assert.equal(scorePassage("Abraham sojourned in the land of Canaan", nephilimForms), 0);

const enoch = readFileSync("public/corpus/manuscripts/1-enoch.md", "utf8");
const enochRows = rowsFromStoredText("1 Enoch", enoch, "enoch");
assert.ok(enochRows.length > 200, `1 Enoch should split into verses, got ${enochRows.length}`);
const enochHits = enochRows.filter((row) => scorePassage(row.text, nephilimForms) > 0);
assert.ok(enochHits.length >= 20, `expected many 1 Enoch hits, got ${enochHits.length}`);
assert.ok(
  enochHits.some((row) => row.reference === "1 Enoch 7:2"),
  "1 Enoch 7:2 (great giants) must be a separate hit"
);
assert.ok(enochHits.some((row) => row.reference === "1 Enoch 15:3"));

const jubilees = readFileSync("public/corpus/manuscripts/jubilees.md", "utf8");
const jubHits = rowsFromStoredText("Jubilees", jubilees, "other").filter(
  (row) => scorePassage(row.text, nephilimForms) > 0
);
assert.ok(
  jubHits.some((row) => row.reference === "Jubilees 7:27"),
  "Jubilees 7:27 Nâphîlîm must be found"
);
assert.ok(jubHits.some((row) => row.reference === "Jubilees 5:2"));
assert.ok(jubHits.length >= 6, `expected several Jubilees hits, got ${jubHits.length}`);

function verseText(json, chapter, verse) {
  const ch = json.chapters.find((c) => String(c.chapter) === String(chapter));
  const v = ch?.verses.find((item) => String(item.verse) === String(verse));
  return v?.text || "";
}

const genesis = JSON.parse(readFileSync("public/corpus/bible/Genesis.json", "utf8"));
const numbers = JSON.parse(readFileSync("public/corpus/bible/Numbers.json", "utf8"));
assert.match(verseText(genesis, 6, 4), /giants/i);
assert.match(verseText(numbers, 13, 33), /giants/i);
assert.ok(scorePassage(verseText(genesis, 6, 4), nephilimForms) > 0);
assert.ok(scorePassage(verseText(numbers, 13, 33), nephilimForms) > 0);

let kjvGiantVerses = 0;
for (const name of ["Genesis", "Numbers", "Deuteronomy", "Joshua", "2Samuel", "1Chronicles"]) {
  const book = JSON.parse(readFileSync(`public/corpus/bible/${name}.json`, "utf8"));
  for (const ch of book.chapters) {
    for (const v of ch.verses || []) {
      if (scorePassage(v.text, nephilimForms) > 0) kjvGiantVerses += 1;
    }
  }
}
assert.ok(kjvGiantVerses >= 8, `expected multiple KJV giant verses, got ${kjvGiantVerses}`);

const vol2 = readFileSync("public/corpus/fathers/ante-nicene-vol2.txt", "utf8");
const fatherHits = rowsFromStoredText("Ante-Nicene Fathers, Volume 2", vol2, "fathers").filter(
  (row) => scorePassage(row.text, nephilimForms) > 0
);
assert.ok(fatherHits.length >= 2, `volume 2 Nephilim/giant paragraphs missing, got ${fatherHits.length}`);

const indexed = INDEXED_PLAIN_TEXTS.map((item) => item.file);
for (const file of [
  "/corpus/fathers/ante-nicene-vol2.txt",
  "/corpus/fathers/ante-nicene-vol9.txt",
  "/corpus/fathers/npnf102.txt",
  "/corpus/fathers/josephus-apion.txt",
  "/corpus/catalog/forgotten-books-of-eden.txt",
]) {
  assert.ok(indexed.includes(file), `search index missing ${file}`);
}

const searchFn = readFileSync("src/api/localFunctions.js", "utf8");
assert.match(searchFn, /limit:\s*Infinity/);
assert.doesNotMatch(searchFn, /limit:\s*80/);

const searchPage = readFileSync("src/pages/Search.jsx", "utf8");
assert.match(searchPage, /params.get\("corpus"\) \|\| "all"/);

console.log(
  `search all verses ok — Enoch ${enochHits.length}, Jubilees ${jubHits.length}, KJV sample ${kjvGiantVerses}, ANF2 ${fatherHits.length}`
);
