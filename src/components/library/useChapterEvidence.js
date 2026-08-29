import { useEffect, useState } from "react";
import { ALL_ARCHIVE } from "@/data/inAppArchive";

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchCandidates(book) {
  const cands = [book];
  if (book.endsWith("s")) cands.push(book.slice(0, -1));
  const m = book.match(/^(\d)\s+(.+)$/);
  if (m) {
    const roman = { 1: "I", 2: "II", 3: "III" }[m[1]] || m[1];
    cands.push(`${roman} ${m[2]}`);
  }
  return cands;
}

export function referenceMatchesChapter(ref, book, chapter) {
  if (!ref) return false;
  return matchCandidates(book).some((c) =>
    new RegExp(`${escapeRegex(c)}\\s+${chapter}\\b`, "i").test(ref)
  );
}

function coversVerse(ref, book, chapter, verse) {
  if (!ref) return false;
  return matchCandidates(book).some((c) => {
    const re = new RegExp(`${escapeRegex(c)}\\s+${chapter}\\b(.*)`, "i");
    const m = ref.match(re);
    if (!m) return false;
    const rest = m[1];
    const vm = rest.match(/[:.]\s*(\d+)\s*(?:[-\u2013]\s*(\d+))?/);
    if (!vm) return true;
    const start = parseInt(vm[1], 10);
    const end = vm[2] ? parseInt(vm[2], 10) : start;
    return verse >= start && verse <= end;
  });
}

export function itemsForVerse(items, refField, book, chapter, verse) {
  return items.filter((item) => coversVerse(item[refField], book, chapter, verse));
}

export function useChapterEvidence(book, chapter) {
  const [evidence, setEvidence] = useState([]);
  const [modern, setModern] = useState([]);
  const [scientific, setScientific] = useState([]);
  const [government, setGovernment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book || !chapter) return;
    setLoading(true);
    const pool = ALL_ARCHIVE.filter((x) =>
      referenceMatchesChapter(x.scripture_reference || x.prophecy_reference, book, chapter)
    );
    setEvidence(pool.filter((x) => x.archive === "archaeology"));
    setModern(pool.filter((x) => x.archive === "modern"));
    setScientific(pool.filter((x) => x.archive === "science"));
    setGovernment(pool.filter((x) => x.archive === "government" || x.archive === "vatican"));
    setLoading(false);
  }, [book, chapter]);

  return { evidence, modern, scientific, government, loading };
}
