import assert from "node:assert/strict";
import { readFileSync, accessSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_TEXT_MAP } from "../src/data/catalogTextMap.js";
import { EXTRA_DEFS } from "../src/data/textCatalogExtras.js";
import { PHILO_FILE, PHILO_WORKS } from "../src/data/philoWorks.js";
import { extractCatalogSection } from "../src/lib/catalogExtract.js";
import { rowsFromStoredText } from "../src/lib/corpusPassages.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rel = join("public", PHILO_FILE.replace(/^\//, ""));
accessSync(join(root, rel));
const text = readFileSync(join(root, rel), "utf8");

assert.match(text, /^# The Works of Philo Judaeus/m);
assert.match(text, /Public-domain English stored/i);
assert.match(text, /ON THE CREATION/);
assert.match(text, /ALLEGORICAL INTERPRETATION, II/);
assert.doesNotMatch(text, /ALLGORICAL INTERPRETATION/);
assert.match(text, /FLACCUS/);
assert.match(text, /ON THE EMBASSY TO GAIUS/);
assert.doesNotMatch(text, /file:\/\/\/ccel/);
assert.ok(text.length > 400_000, "Philo file too small");

const creation = extractCatalogSection(text, "ON THE CREATION", "ALLEGORICAL INTERPRETATION, I");
assert.equal(creation.found, true);
assert.match(creation.text, /Of other lawgivers/);
assert.doesNotMatch(creation.text, /ALLEGORICAL INTERPRETATION, I/);

const embassy = extractCatalogSection(text, "ON THE EMBASSY TO GAIUS", "QUESTIONS AND ANSWERS ON GENESIS, I");
assert.equal(embassy.found, true);
assert.match(embassy.text, /Gaius|Caligula|embassy/i);

const contemplative = extractCatalogSection(
  text,
  "ON THE CONTEMPLATIVE LIFE OR SUPPLIANTS",
  "ON THE ETERNITY OF THE WORLD"
);
assert.equal(contemplative.found, true);
assert.match(contemplative.text, /Therapeut/i);

for (const work of PHILO_WORKS) {
  const extracted = extractCatalogSection(text, work.start, work.next);
  assert.equal(extracted.found, true, `${work.id} extract missing`);
  assert.ok(extracted.text.length > 800, `${work.id} extract too small (${extracted.text.length})`);
  assert.ok(CATALOG_TEXT_MAP[work.id], `missing catalog map ${work.id}`);
  assert.equal(CATALOG_TEXT_MAP[work.id].file, PHILO_FILE);
}

assert.match(readFileSync(join(root, "src/pages/Library.jsx"), "utf8"), /key: "philo"/);
assert.match(readFileSync(join(root, "src/components/library/corpusData.js"), "utf8"), /philo:/);
const extras = Object.fromEntries(EXTRA_DEFS.map((d) => [d.id, d]));
assert.ok(extras.philo?.stored);
assert.ok(extras["philo-on-the-creation"]?.stored);

const rows = rowsFromStoredText("Philo of Alexandria", text, "philo");
assert.ok(rows.length >= PHILO_WORKS.length, `expected a search row per treatise, got ${rows.length}`);
assert.ok(rows.some((row) => /moses/i.test(row.text)));

console.log("philo library ok", {
  bytes: text.length,
  treatises: PHILO_WORKS.length,
  searchRows: rows.length,
  creationChars: creation.text.length,
});
