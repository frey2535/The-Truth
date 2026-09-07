import { lemmaOf } from "./wordFamilies.js";

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "for", "it", "with", "as",
  "be", "by", "this", "are", "or", "from", "not", "but", "his", "her", "they", "them",
  "you", "your", "were", "have", "had", "has", "will", "shall", "unto", "which",
  "what", "when", "who", "how", "did", "does", "been", "their", "there", "then", "than",
  "into", "upon", "also", "all", "any", "can", "may", "our", "out", "about",
  "i", "me", "my", "we", "us", "he", "she", "him", "its", "if", "an", "on", "at",
]);

const WEAK = new Set([
  "say", "said", "saith", "saying", "says", "ask", "asked", "asking", "tell", "told",
  "mean", "means", "meaning", "please", "explain", "describe", "define", "defined",
  "definition", "difference", "between", "versus", "compare", "related", "verse",
  "verses", "passage", "passages", "bible", "scripture", "scriptures", "text", "texts",
  "word", "words", "teach", "teaches", "taught", "teaching", "show", "shows", "shown",
  "really", "just", "like", "thing", "things", "someone", "something", "anything",
  "should", "would", "could", "must", "need", "needs", "needed", "want", "wanted",
  "yes", "very", "always", "still", "even", "because", "whether", "thanks", "thank",
  "everyone", "anybody", "somebody", "information", "answer", "question", "find",
  "finding", "looking", "know", "knew", "knows", "think", "thought", "people",
  "person", "give", "gives", "given", "make", "makes", "made", "come", "came",
  "going", "gone", "done", "doing", "true", "truth", "help", "helping",
]);

export function topicTermsFrom(text) {
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  const focused = words.filter((w) => !WEAK.has(w));
  const picked = focused.length ? focused : words.filter((w) => !WEAK.has(w) || w.length > 5);
  const seen = new Set();
  const out = [];
  for (const w of picked) {
    const key = lemmaOf(w);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }
  return out;
}
