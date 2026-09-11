/** Deep links into the Library for a stored book and chapter. */

const CORPUS_FROM_SOURCE = {
  canon: "bible",
  apocrypha: "apocrypha",
  enoch: "enoch",
  dead_sea_scrolls: "dss",
  fathers: "fathers",
  josephus: "josephus",
  philo: "philo",
  other: "other",
};

export function parseReference(reference) {
  const ref = String(reference || "").trim();
  const m = ref.match(
    /^((?:\d+\s+)?[A-Za-z][A-Za-z'.]+(?:\s+(?:of\s+)?[A-Za-z][A-Za-z'.]+){0,3})\s+(\d+)(?::(\d+))?/
  );
  if (!m) return null;
  return { book: m[1].trim(), chapter: m[2], verse: m[3] || "" };
}

export function libraryHref({ book, chapter, source, reference } = {}) {
  const parsed = book ? { book, chapter } : parseReference(reference);
  const corpus = CORPUS_FROM_SOURCE[source] || "bible";
  if (!parsed?.book) {
    return corpus === "bible" ? "/library" : `/library?corpus=${corpus}`;
  }
  if (corpus === "bible" || corpus === "apocrypha") {
    const q = new URLSearchParams({
      corpus,
      book: parsed.book,
      chapter: String(parsed.chapter || 1),
    });
    return `/library?${q.toString()}`;
  }
  return `/library?corpus=${corpus}`;
}
