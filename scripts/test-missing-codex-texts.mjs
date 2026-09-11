import assert from "node:assert/strict";
import { readFileSync, accessSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_TEXT_MAP } from "../src/data/catalogTextMap.js";
import { EXTRA_DEFS } from "../src/data/textCatalogExtras.js";
import { rowsFromStoredText } from "../src/lib/corpusPassages.js";
import { extractCatalogSection } from "../src/lib/catalogExtract.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SLUGS = [
  "2-baruch",
  "3-baruch",
  "4-baruch",
  "assumption-of-moses",
  "ascension-of-isaiah",
  "odes-of-solomon",
  "sibylline-oracles",
  "joseph-and-aseneth",
  "testament-of-job",
  "pseudo-philo",
  "apocalypse-of-abraham",
  "cave-of-treasures",
  "3-enoch",
  "sinodos",
  "book-of-the-covenant-eth",
  "ethiopic-didascalia",
];

const CATALOG_IDS = [
  "2-baruch",
  "3-baruch",
  "4-baruch",
  "assumption-of-moses",
  "testament-moses",
  "ascension-of-isaiah",
  "martyrdom-ascension-isaiah",
  "odes-of-solomon",
  "sibylline-oracles",
  "joseph-and-aseneth",
  "testament-job",
  "pseudo-philo",
  "apocalypse-of-abraham",
  "cave-of-treasures",
  "3-enoch",
  "sinodos",
  "book-of-the-covenant-eth",
  "ethiopic-clement",
  "ethiopic-didascalia",
];

for (const slug of SLUGS) {
  const rel = join("public/corpus/manuscripts", `${slug}.md`);
  accessSync(join(root, rel));
  const text = readFileSync(join(root, rel), "utf8");
  assert.ok(text.length > 4000, `${slug} too small`);
  assert.ok(!/^<!doctype html/i.test(text), `${slug} is HTML`);
  assert.match(text, /^# /m, `${slug} missing title`);
  const rows = rowsFromStoredText(slug.replace(/-/g, " "), text, "other");
  assert.ok(rows.length >= 1, `${slug} produced no search rows`);
  assert.ok(rows.some((row) => row.text.length > 80), `${slug} search rows have no body`);
}

for (const id of CATALOG_IDS) {
  assert.ok(CATALOG_TEXT_MAP[id], `missing catalog map ${id}`);
  const file = CATALOG_TEXT_MAP[id].file;
  accessSync(join(root, "public", file.replace(/^\//, "")));
}

const byId = Object.fromEntries(EXTRA_DEFS.map((d) => [d.id, d]));
for (const id of [
  "2-baruch",
  "3-baruch",
  "4-baruch",
  "odes-of-solomon",
  "sibylline-oracles",
  "sinodos",
  "3-enoch",
  "ethiopic-didascalia",
]) {
  assert.equal(byId[id]?.textStatus, "complete_stored", `${id} should be stored`);
  assert.ok(byId[id]?.stored?.slug || byId[id]?.stored?.kind, `${id} missing stored`);
}

assert.notEqual(byId["1-meqabyan"]?.textStatus, "complete_stored");
assert.notEqual(byId["2-meqabyan"]?.textStatus, "complete_stored");
assert.notEqual(byId["3-meqabyan"]?.textStatus, "complete_stored");

const odes = readFileSync(join(root, "public/corpus/manuscripts/odes-of-solomon.md"), "utf8");
assert.match(odes, /The Lord is upon my head like a crown/i);
assert.match(odes, /not the Septuagint canticle list/i);
assert.doesNotMatch(odes, /Song of Moses.*Magnificat/s);
const odesView = extractCatalogSection(odes, null, null).text;
assert.match(odesView.slice(0, 800), /The Lord is upon my head like a crown/i);

const twoBaruch = readFileSync(join(root, "public/corpus/manuscripts/2-baruch.md"), "utf8");
assert.match(twoBaruch, /Jeconiah/i);
assert.match(twoBaruch, /Baruch, the son of Neriah/i);
const twoView = extractCatalogSection(twoBaruch, null, null).text;
assert.match(twoView.slice(0, 500), /twenty-fifth year of Jeconiah/i);
assert.doesNotMatch(twoView.slice(0, 500), /Testaments of the Twelve Patriarchs/i);

const sinodos = readFileSync(join(root, "public/corpus/manuscripts/sinodos.md"), "utf8");
assert.match(sinodos, /This is the Sinodos of/i);

console.log(
  JSON.stringify(
    {
      ok: true,
      manuscripts: SLUGS.length,
      catalogIds: CATALOG_IDS.length,
    },
    null,
    2
  )
);
