import { readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_TEXT_MAP } from "../src/data/catalogTextMap.js";
import { extractCatalogSection } from "../src/lib/catalogExtract.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();

async function loadPublic(file) {
  const rel = file.replace(/^\//, "");
  const path = join(root, "public", rel);
  if (cache.has(path)) return cache.get(path);
  try {
    await access(path);
  } catch {
    cache.set(path, { missingFile: true, text: "" });
    return cache.get(path);
  }
  const text = await readFile(path, "utf8");
  const html = /^<!doctype html/i.test(text.trimStart()) || /^<html[\s>]/i.test(text.trimStart());
  cache.set(path, { missingFile: false, html, text, bytes: text.length });
  return cache.get(path);
}

function looksLikeCommentary(id, slice) {
  const head = slice.slice(0, 900).toLowerCase();
  const notes = [
    "introductory note",
    "elucidation",
    "translated by",
    "the following work is",
    "this treatise",
  ];
  const hasWorkStart = /chapter i|book i|chapter 1|\n\s*1\.\s+[A-Z]/.test(slice.slice(0, 2500));
  return notes.some((n) => head.includes(n)) && !hasWorkStart && slice.length < 4000;
}

const results = [];
for (const [id, entry] of Object.entries(CATALOG_TEXT_MAP)) {
  const file = await loadPublic(entry.file);
  if (file.missingFile) {
    results.push({ id, status: "missing_file", file: entry.file });
    continue;
  }
  if (file.html) {
    results.push({ id, status: "html_shell", file: entry.file });
    continue;
  }
  const extracted = extractCatalogSection(file.text, entry.start, entry.next);
  if (!extracted.found || !extracted.text) {
    results.push({
      id,
      status: "heading_miss",
      file: entry.file,
      start: entry.start,
    });
    continue;
  }
  results.push({
    id,
    status: extracted.truncated ? "ok_truncated" : "ok",
    file: entry.file,
    chars: extracted.text.length,
    preview: extracted.text.slice(0, 80).replace(/\s+/g, " "),
    commentary: looksLikeCommentary(id, extracted.text),
  });
}

const groups = {};
for (const row of results) {
  groups[row.status] = (groups[row.status] || 0) + 1;
}
console.log(JSON.stringify({ counts: groups, total: results.length }, null, 2));
for (const row of results.filter((r) => r.status !== "ok" && r.status !== "ok_truncated")) {
  console.log(`${row.status}\t${row.id}\t${row.file}\t${row.start || ""}`);
}
const commentary = results.filter((r) => r.commentary);
if (commentary.length) {
  console.log("\npossible_editor_notes");
  for (const row of commentary) console.log(`  ${row.id} ${row.chars} ${row.preview}`);
}
