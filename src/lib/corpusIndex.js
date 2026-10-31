import { foldMarks } from "./corpusPassages.js";

function tokensOf(folded) {
  return String(folded || "").match(/[\p{L}\p{N}']+/gu) || [];
}

/** Attach folded text and build an inverted token index for fast study/search lookups. */
export function indexCorpusRows(rows = []) {
  const index = new Map();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const folded = row.folded || foldMarks(row.text).toLowerCase();
    row.folded = folded;
    const seen = new Set();
    for (const token of tokensOf(folded)) {
      if (token.length < 3 || seen.has(token)) continue;
      seen.add(token);
      const list = index.get(token);
      if (list) list.push(i);
      else index.set(token, [i]);
    }
  }
  return { rows, index };
}

function intersectSorted(a, b) {
  if (!a?.length || !b?.length) return [];
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push(a[i]);
      i += 1;
      j += 1;
    } else if (a[i] < b[j]) i += 1;
    else j += 1;
  }
  return out;
}

function listsForNeedle(index, needle) {
  const n = String(needle || "").toLowerCase().trim();
  if (!n) return null;
  if (!n.includes(" ")) return index.get(n) || [];
  const parts = n.split(/\s+/).filter((w) => w.length >= 3);
  if (!parts.length) return null;
  let acc = index.get(parts[0]) || [];
  for (let i = 1; i < parts.length; i += 1) {
    acc = intersectSorted(acc, index.get(parts[i]) || []);
    if (!acc.length) return [];
  }
  return acc;
}

/**
 * Candidate row indexes for OR-of-queries search.
 * Returns null when the index cannot safely narrow the scan (caller should full-scan).
 */
export function candidateIndexes(index, prepared = []) {
  if (!index || !prepared.length) return null;
  const out = new Set();
  let any = false;
  for (const pq of prepared) {
    if (pq.exact) return null;
    const needles = pq.requirePhrase && pq.foldedPhrase ? [pq.foldedPhrase] : pq.needles || [];
    if (!needles.length) return null;
    for (const needle of needles) {
      const list = listsForNeedle(index, needle);
      if (list == null) return null;
      any = true;
      for (const idx of list) out.add(idx);
    }
  }
  return any ? out : null;
}
