import { foldMarks } from "./corpusPassages.js";

function escapeRe(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightTerms(query, forms = [], { exact = false } = {}) {
  const terms = new Set();
  const add = (value) => {
    const folded = foldMarks(value).toLowerCase().trim();
    if (folded) terms.add(folded);
  };
  add(query);
  for (const form of forms || []) add(form);
  if (exact) {
    const phrase = foldMarks(query)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (phrase) add(phrase);
    for (const word of phrase.split(" ").filter(Boolean)) add(word);
  }
  return [...terms].sort((a, b) => b.length - a.length);
}

export function splitHighlightedText(text, terms = []) {
  const raw = String(text || "");
  const needles = (terms || []).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!raw || !needles.length) return [{ text: raw, hit: false }];

  const singles = needles.filter((term) => !term.includes(" "));
  const phrases = needles.filter((term) => term.includes(" "));
  const hitRanges = [];

  if (phrases.length) {
    const folded = foldMarks(raw).toLowerCase();
    for (const phrase of phrases) {
      let from = 0;
      while (from < folded.length) {
        const at = folded.indexOf(phrase, from);
        if (at < 0) break;
        hitRanges.push([at, at + phrase.length]);
        from = at + phrase.length;
      }
    }
  }

  const tokenRe = /[\p{L}\p{N}']+/gu;
  const folded = foldMarks(raw).toLowerCase();
  const singleSet = new Set(singles);
  let token;
  while ((token = tokenRe.exec(folded))) {
    if (singleSet.has(token[0])) {
      hitRanges.push([token.index, token.index + token[0].length]);
    }
  }

  if (!hitRanges.length) return [{ text: raw, hit: false }];
  hitRanges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged = [];
  for (const range of hitRanges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }

  const map = foldedToOriginalMap(raw, folded);
  const parts = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    const origStart = map[start] ?? raw.length;
    const origEnd = map[Math.max(0, end - 1)] != null ? map[end - 1] + 1 : raw.length;
    if (origStart > cursor) parts.push({ text: raw.slice(cursor, origStart), hit: false });
    if (origEnd > origStart) parts.push({ text: raw.slice(origStart, origEnd), hit: true });
    cursor = Math.max(cursor, origEnd);
  }
  if (cursor < raw.length) parts.push({ text: raw.slice(cursor), hit: false });
  return parts.filter((part) => part.text);
}

function foldedToOriginalMap(raw, folded) {
  const map = [];
  let fi = 0;
  for (let i = 0; i < raw.length && fi < folded.length; i += 1) {
    const piece = foldMarks(raw[i]).toLowerCase();
    for (let k = 0; k < piece.length; k += 1) {
      if (folded[fi] === piece[k]) {
        map[fi] = i;
        fi += 1;
      }
    }
  }
  return map;
}
