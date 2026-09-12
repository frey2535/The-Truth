import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  consonantKey,
  foldMarks,
  INDEXED_PLAIN_TEXTS,
  rowsFromStoredText,
  scorePassage,
} from "../src/lib/corpusPassages.js";
import { highlightTerms, splitHighlightedText } from "../src/lib/searchHighlight.js";
import { familyOf } from "../src/lib/wordFamilies.js";

function formsFor(word) {
  const phrase = foldMarks(word).toLowerCase();
  return { phrase, forms: [phrase, ...familyOf(phrase)] };
}

function hitsInRows(rows, word) {
  const q = formsFor(word);
  return rows.filter((row) => scorePassage(row.text, q) > 0);
}

function versesWithWord(rows, word) {
  const foldedWord = foldMarks(word).toLowerCase();
  const re = new RegExp(`\\b${foldedWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return rows.filter((row) => re.test(foldMarks(row.text)));
}

function assertFindsEveryOccurrence(label, rows, word) {
  const expected = versesWithWord(rows, word);
  const found = hitsInRows(rows, word);
  const missing = expected.filter((row) => !found.includes(row));
  assert.equal(
    missing.length,
    0,
    `${label}: search for “${word}” dropped ${missing.length} of ${expected.length} verses (e.g. ${missing[0]?.reference || ""})`
  );
  assert.ok(found.length >= expected.length);
}

assert.equal(foldMarks("Nâphîlîm").toLowerCase(), "naphilim");
assert.equal(consonantKey("nephilim"), consonantKey("Nâphîlîm"));
assert.ok(scorePassage("And they begat sons the Nâphîlîm", formsFor("Nephilim")) > 0);
assert.ok(scorePassage("There were giants in the earth in those days", formsFor("giants")) > 0);
assert.ok(scorePassage("And the Watchers shall quake", formsFor("watchers")) > 0);
assert.equal(scorePassage("There were giants in the earth in those days", formsFor("Nephilim")), 0);
assert.equal(scorePassage("Abraham sojourned in the land of Canaan", formsFor("covenant")), 0);

const enoch = rowsFromStoredText(
  "1 Enoch",
  readFileSync("public/corpus/manuscripts/1-enoch.md", "utf8"),
  "enoch"
);
assert.ok(enoch.length > 200, `1 Enoch should split into verses, got ${enoch.length}`);
for (const word of ["watchers", "giants", "heaven", "righteous"]) {
  assertFindsEveryOccurrence(`1 Enoch ${word}`, enoch, word);
  assert.ok(hitsInRows(enoch, word).length >= 3, `1 Enoch should have several “${word}” verses`);
}
assert.ok(hitsInRows(enoch, "giants").some((row) => row.reference === "1 Enoch 7:2"));

const jubilees = rowsFromStoredText(
  "Jubilees",
  readFileSync("public/corpus/manuscripts/jubilees.md", "utf8"),
  "other"
);
for (const word of ["watchers", "giants", "covenant"]) {
  assertFindsEveryOccurrence(`Jubilees ${word}`, jubilees, word);
}
assert.ok(hitsInRows(jubilees, "Nephilim").some((row) => row.reference === "Jubilees 7:27"));

function loadCanonBook(name) {
  const json = JSON.parse(readFileSync(`public/corpus/bible/${name}.json`, "utf8"));
  const rows = [];
  for (const ch of json.chapters || []) {
    for (const v of ch.verses || []) {
      rows.push({
        reference: `${json.book || name} ${ch.chapter}:${v.verse}`,
        text: v.text,
      });
    }
  }
  return rows;
}

const genesis = loadCanonBook("Genesis");
const psalms = loadCanonBook("Psalms");
const john = loadCanonBook("John");
for (const word of ["covenant", "giants", "begat"]) {
  assertFindsEveryOccurrence(`Genesis ${word}`, genesis, word);
}
assertFindsEveryOccurrence("Psalms mercy", psalms, "mercy");
assertFindsEveryOccurrence("John believe", john, "believe");
assert.ok(hitsInRows(genesis, "giants").some((row) => /6:4/.test(row.reference)));
assert.ok(hitsInRows(psalms, "mercy").length > 20);

const vol2 = rowsFromStoredText(
  "Ante-Nicene Fathers, Volume 2",
  readFileSync("public/corpus/fathers/ante-nicene-vol2.txt", "utf8"),
  "fathers"
);
for (const word of ["nephilim", "covenant", "giants"]) {
  assertFindsEveryOccurrence(`ANF2 ${word}`, vol2, word);
}
assert.ok(hitsInRows(vol2, "nephilim").length >= 2);

const fatherFiles = readdirSync("public/corpus/fathers").filter((name) => name.endsWith(".txt"));
const indexedFiles = new Set(INDEXED_PLAIN_TEXTS.map((item) => item.file.replace("/corpus/fathers/", "")));
for (const file of fatherFiles) {
  assert.ok(indexedFiles.has(file), `search index omitted stored father file ${file}`);
}

const searchFn = readFileSync("src/api/localFunctions.js", "utf8");
assert.match(searchFn, /limit:\s*Infinity/);
assert.doesNotMatch(searchFn, /limit:\s*80/);
assert.doesNotMatch(searchFn, /limit:\s*120/);

const searchLib = readFileSync("src/lib/localCorpusSearch.js", "utf8");
assert.match(searchLib, /limit = Infinity/);
assert.match(searchLib, /exact = false/);
assert.match(searchFn, /exact: onlyWord/);
assert.doesNotMatch(searchLib, /nephilim:\s*\[/);
assert.doesNotMatch(searchLib, /SEARCH_TOPIC_ALIASES/);

const passages = readFileSync("src/lib/corpusPassages.js", "utf8");
assert.doesNotMatch(passages, /NEPHILIM_/);
assert.doesNotMatch(passages, /SEARCH_TOPIC_ALIASES/);

const searchPage = readFileSync("src/pages/Search.jsx", "utf8");
assert.match(searchPage, /params.get\("corpus"\) \|\| "all"/);
assert.match(searchPage, /This word only/);
assert.match(searchPage, /This word and its forms/);
assert.match(searchPage, /HighlightedText/);

const familyLove = { phrase: "love", forms: familyOf("love") };
const exactLove = { phrase: "love", forms: ["love"], exact: true };
assert.ok(familyLove.forms.includes("loved") || familyLove.forms.includes("loveth"));
assert.ok(scorePassage("For God so loved the world", familyLove) > 0);
assert.equal(scorePassage("For God so loved the world", exactLove), 0);
assert.ok(scorePassage("God is love", exactLove) > 0);

const parts = splitHighlightedText("And ye shall know the truth, and the truth shall make you free.", highlightTerms("truth"));
assert.ok(parts.some((part) => part.hit && /truth/i.test(part.text)));
assert.equal(parts.filter((part) => part.hit).length, 2);
const exactParts = splitHighlightedText("For God so loved the world", highlightTerms("love", [], { exact: true }));
assert.ok(!exactParts.some((part) => part.hit));
const familyParts = splitHighlightedText("For God so loved the world", highlightTerms("love", familyLove.forms));
assert.ok(familyParts.some((part) => part.hit && /loved/i.test(part.text)));

console.log(
  `search all verses ok — Enoch watchers ${hitsInRows(enoch, "watchers").length}, Genesis covenant ${hitsInRows(genesis, "covenant").length}, Psalms mercy ${hitsInRows(psalms, "mercy").length}, ANF2 nephilim ${hitsInRows(vol2, "nephilim").length}`
);
