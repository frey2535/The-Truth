import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { BIBLE_VERSIONS, REFUSED_BIBLE_VERSIONS, bibleVersionById } from "../src/data/bibleVersions.js";

assert.ok(REFUSED_BIBLE_VERSIONS.includes("NIV"));
assert.ok(REFUSED_BIBLE_VERSIONS.includes("ESV"));
assert.ok(REFUSED_BIBLE_VERSIONS.includes("The Message"));
assert.equal(
  BIBLE_VERSIONS.some((v) => /niv|esv|nasb|nlt|message/i.test(v.label)),
  false,
  "Modern shortened Bibles must not be offered"
);
assert.ok(BIBLE_VERSIONS.every((v) => v.year <= 1900 || v.id === "kjv"));
assert.equal(bibleVersionById("geneva").year, 1599);

const reader = readFileSync("src/components/library/BibleReader.jsx", "utf8");
assert.match(reader, /Download this Bible/);
assert.match(reader, /REFUSED_BIBLE_VERSIONS/);
assert.match(reader, /bibleBookUrl\(b, apocrypha, versionId\)/);

const catalog = readFileSync("src/components/library/CatalogBrowser.jsx", "utf8");
assert.match(catalog, /Holy Bible versions/);
assert.match(catalog, /Epic of Gilgamesh/);

function loadBook(versionId, book) {
  const version = bibleVersionById(versionId);
  const file = `${book.replace(/ /g, "")}.json`;
  const path = `public${version.path}/${file}`;
  assert.ok(existsSync(path), `missing ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function verseText(data, chapter, verse) {
  const ch = (data.chapters || []).find((row) => String(row.chapter) === String(chapter));
  const hit = (ch?.verses || []).find((row) => String(row.verse) === String(verse));
  return hit?.text || "";
}

for (const version of BIBLE_VERSIONS.filter((v) => v.id !== "kjv")) {
  const files = existsSync(`public${version.path}`)
    ? readdirSync(`public${version.path}`).filter((name) => name.endsWith(".json"))
    : [];
  assert.ok(files.length >= 66, `${version.id} should store every canon book, got ${files.length}`);
  const john = loadBook(version.id, "1 John");
  const acts = loadBook(version.id, "Acts");
  assert.match(verseText(john, 5, 7), /Father|Word|Spirit|Ghost/i, `${version.id} dropped 1 John 5:7`);
  assert.match(
    verseText(acts, 8, 37),
    /believe|beleeue|beleevest/i,
    `${version.id} dropped Acts 8:37`
  );
}

console.log(
  `bible versions ok — ${BIBLE_VERSIONS.map((v) => v.id).join(", ")}; refused ${REFUSED_BIBLE_VERSIONS.length}`
);
