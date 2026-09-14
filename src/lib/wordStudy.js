import { lookupLexicon } from "../data/strongsLexicon.js";
import { foldMarks } from "./corpusPassages.js";

function escapeRe(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function cleanStudyWord(word) {
  return String(word || "")
    .normalize("NFC")
    .replace(/^[^A-Za-z\u00C0-\u024F']+|[^A-Za-z\u00C0-\u024F']+$/g, "")
    .trim();
}

export function verseContainsWord(text, word) {
  const foldedWord = foldMarks(cleanStudyWord(word)).toLowerCase();
  if (!foldedWord) return false;
  return new RegExp(`\\b${escapeRe(foldedWord)}\\b`, "i").test(foldMarks(text));
}

export function hasStoredLexicon(word) {
  return Boolean(lookupLexicon(cleanStudyWord(word)));
}

export function studyCardFromLexicon(word) {
  const w = cleanStudyWord(word);
  const lex = lookupLexicon(w);
  if (lex) {
    return {
      definition: lex.meaning,
      original_language: `${lex.language} · ${lex.strongs}`,
      original_word: `${lex.original} (${lex.translit})`,
      original_meaning: lex.meaning,
      etymology: lex.etymology,
      era_context: lex.source,
    };
  }
  return {
    definition: "No Strong's entry is stored for this English spelling. The verses below are the wording in this app.",
    original_language: "No lexicon entry stored",
    original_word: w,
    original_meaning: "",
    etymology: "Etymology is not guessed when Strong's does not list this spelling.",
    era_context: "Read each book in its own setting. This app does not invent a later meaning.",
  };
}

export function versesFromMatches(matches, word) {
  const list = (matches || []).filter((row) => verseContainsWord(row.text, word));
  return {
    verse_list: list.map((row) => ({
      reference: row.reference,
      text: row.text,
      source: row.source || "",
    })),
    verses: list.map((row) => `${row.reference}: ${row.text}`).join("\n\n"),
    verse_count: list.length,
  };
}
