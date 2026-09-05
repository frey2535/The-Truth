import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_TEXT_MAP } from "../src/data/catalogTextMap.js";
import { extractCatalogSection } from "../src/lib/catalogExtract.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();

async function load(file) {
  const path = join(root, "public", file.replace(/^\//, ""));
  if (!cache.has(path)) cache.set(path, await readFile(path, "utf8"));
  return cache.get(path);
}

const noteHints = /tischendorf|introductory|this work|the original language|the following|translated by|mss\.|manuscripts of this|edited by|first published|it is not very clear|the majority of the/i;

for (const [id, entry] of Object.entries(CATALOG_TEXT_MAP)) {
  if (!entry.start) continue;
  const raw = await load(entry.file);
  const extracted = extractCatalogSection(raw, entry.start, entry.next);
  const head = extracted.text.slice(0, 350).replace(/\s+/g, " ");
  const suspicious = noteHints.test(head) || extracted.text.length < 1200;
  if (suspicious) {
    console.log(`${id}\t${extracted.text.length}\t${head.slice(0, 180)}`);
  }
}
