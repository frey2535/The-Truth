import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const file = "public/corpus/manuscripts/epic-of-gilgamesh.md";
assert.ok(existsSync(file), "Epic of Gilgamesh is not stored");
const text = readFileSync(file, "utf8");
assert.match(text, /Gilgamesh|Gilgamish/i);
assert.match(text, /not Scripture/i);
assert.match(text, /1920/);
assert.doesNotMatch(text, /\bNIV\b/);
assert.ok(text.length > 8000, `Gilgamesh text too short: ${text.length}`);

const extras = readFileSync("src/data/textCatalogExtras.js", "utf8");
assert.match(extras, /epic-of-gilgamesh/);
const corpus = readFileSync("src/components/library/corpusData.js", "utf8");
assert.match(corpus, /epic-of-gilgamesh/);
assert.match(corpus, /Ancient Near East/);
const search = readFileSync("src/lib/localCorpusSearch.js", "utf8");
assert.match(search, /epic-of-gilgamesh/);

console.log(`gilgamesh ok — ${text.length} characters stored`);
