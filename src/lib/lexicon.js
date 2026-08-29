import { STRONGS } from "@/data/strongsLexicon";

function key(word) {
  return String(word || "")
    .toLowerCase()
    .replace(/[^a-z'-]/g, "")
    .replace(/(eth|est|ing|ied|ies|ed|es|s|ly)$/i, (m, s, offset, str) =>
      str.length - m.length >= 3 ? "" : m
    );
}

export function lookupWord(word) {
  const raw = String(word || "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/[^a-z'-]/g, "");
  if (STRONGS[lower]) return { query: raw, ...STRONGS[lower] };
  const stemmed = key(raw);
  if (STRONGS[stemmed]) return { query: raw, ...STRONGS[stemmed] };
  for (const [k, entry] of Object.entries(STRONGS)) {
    if (entry.forms?.includes(lower) || entry.forms?.includes(stemmed)) {
      return { query: raw, ...entry, matchedForm: k };
    }
  }
  return null;
}

export function lexiconNotice() {
  return "Definitions and etymologies are from Strong's Exhaustive Concordance (1890), public domain, stored in this app. They are not a modern denominational gloss.";
}
