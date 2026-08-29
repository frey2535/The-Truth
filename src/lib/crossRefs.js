const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "for", "it", "with", "as",
  "be", "by", "this", "are", "or", "from", "not", "but", "his", "her", "they", "them",
  "you", "your", "were", "have", "had", "has", "will", "shall", "unto", "which",
  "what", "when", "who", "how", "did", "said", "came", "went", "also", "all",
]);

export function significantWords(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z'\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

export function chapterCrossRefs(verses, current, book, chapter) {
  const words = significantWords(current.text);
  if (!words.length) return [];
  return verses
    .filter((v) => String(v.verse) !== String(current.verse))
    .map((v) => {
      const hits = words.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(v.text));
      return {
        reference: `${book} ${chapter}:${v.verse}`,
        book,
        chapter,
        verse: v.verse,
        text: v.text,
        hits,
      };
    })
    .filter((v) => v.hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length)
    .slice(0, 10);
}
