import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { foldMarks } from "../src/lib/corpusPassages.js";
import {
  cleanStudyWord,
  hasStoredLexicon,
  studyCardFromLexicon,
  verseContainsWord,
  versesFromMatches,
} from "../src/lib/wordStudy.js";

function loadCanonBook(name) {
  const json = JSON.parse(readFileSync(`public/corpus/bible/${name}.json`, "utf8"));
  const rows = [];
  for (const ch of json.chapters || []) {
    for (const v of ch.verses || []) {
      rows.push({
        reference: `${json.book || name} ${ch.chapter}:${v.verse}`,
        text: v.text,
        source: "canon",
      });
    }
  }
  return rows;
}

function expectedExactHits(rows, word) {
  return rows.filter((row) => verseContainsWord(row.text, word));
}

assert.equal(cleanStudyWord("  grace, "), "grace");
assert.equal(cleanStudyWord("(Believe.)"), "Believe");
assert.equal(verseContainsWord("For God so loved the world", "loved"), true);
assert.equal(verseContainsWord("For God so loved the world", "love"), false);
assert.equal(verseContainsWord("that whosoever believeth in him", "believe"), false);
assert.equal(verseContainsWord("Ye believe in God, believe also in me.", "believe"), true);

const grace = studyCardFromLexicon("grace");
assert.ok(grace.etymology, "Strong's etymology must be available without scanning the corpus");
assert.ok(grace.original_language.includes("G5485") || /Greek/i.test(grace.original_language));
assert.ok(grace.definition.length > 20);
assert.equal(hasStoredLexicon("grace"), true);
assert.equal(hasStoredLexicon("xyzzyword"), false);

const unknown = studyCardFromLexicon("xyzzyword");
assert.match(unknown.etymology, /not guessed/i);

const genesis = loadCanonBook("Genesis");
const john = loadCanonBook("John");
const genesisCovenant = expectedExactHits(genesis, "covenant");
const johnBelieve = expectedExactHits(john, "believe");
assert.ok(genesisCovenant.length > 20, `Genesis covenant should have many verses, got ${genesisCovenant.length}`);
assert.ok(johnBelieve.length > 20, `John believe should have many verses, got ${johnBelieve.length}`);

const fromGenesis = versesFromMatches(genesis, "covenant");
assert.equal(fromGenesis.verse_count, genesisCovenant.length);
assert.equal(fromGenesis.verse_list.length, genesisCovenant.length);
assert.ok(fromGenesis.verse_list.every((row) => verseContainsWord(row.text, "covenant")));
assert.ok(!fromGenesis.verse_list.some((row) => /John /i.test(row.reference)));

const fromJohn = versesFromMatches(john, "believe");
assert.equal(fromJohn.verse_count, johnBelieve.length);
assert.equal(fromJohn.verse_list.length, johnBelieve.length);
assert.ok(fromJohn.verse_list.some((row) => /3:12/.test(row.reference) || /1:7/.test(row.reference)));

const mixed = versesFromMatches(
  [
    { reference: "John 3:16", text: "For God so loved the world", source: "canon" },
    { reference: "1 John 4:8", text: "God is love", source: "canon" },
  ],
  "love"
);
assert.equal(mixed.verse_count, 1);
assert.equal(mixed.verse_list[0].reference, "1 John 4:8");

const defineSrc = readFileSync("src/api/localFunctions.js", "utf8");
assert.match(defineSrc, /async function define_word/);
assert.match(defineSrc, /searchCorpus\(w, \{ limit: Infinity, exact: true, clipLong: false \}\)/);
assert.doesNotMatch(defineSrc, /searchCorpus\(`\$\{w\} \$\{ref\}`/);
assert.doesNotMatch(defineSrc, /slice\(0,\s*10\)/);
assert.doesNotMatch(defineSrc, /limit:\s*24/);

const page = readFileSync("src/pages/WordStudy.jsx", "utf8");
assert.match(page, /studyCardFromLexicon\(w\)/);
assert.match(page, /setResult\(\{ \.\.\.card, verse_list: \[\], verse_count: 0/);
assert.match(page, /exact:\s*true/);
assert.match(page, /sources:\s*\["canon", "apocrypha"\]/);
assert.match(page, /clipLong:\s*false/);
assert.match(page, /Finding every stored verse/);
assert.match(page, /Searching remaining stored texts/);
assert.doesNotMatch(page, /slice\(0,\s*10\)/);

const helpers = readFileSync("src/lib/wordStudy.js", "utf8");
assert.doesNotMatch(helpers, /async function studyCardFromLexicon/);
assert.doesNotMatch(helpers, /await lookupLexicon/);

const folded = foldMarks("Nâphîlîm").toLowerCase();
assert.equal(verseContainsWord("the Nâphîlîm were on the earth", folded), true);

console.log(
  `word study ok — Strong's grace is sync, Genesis covenant ${fromGenesis.verse_count}, John believe ${fromJohn.verse_count}`
);
