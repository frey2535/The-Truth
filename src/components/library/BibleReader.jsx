import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, ArrowLeft, Search } from "lucide-react";
import { bibleBookUrl, CANON_BOOK_ENTRIES, CANON_BOOK_INFO } from "./corpusData";
import BookCard from "./BookCard";
import ChapterEvidencePanel from "./ChapterEvidencePanel";
import { useChapterEvidence, itemsForVerse } from "./useChapterEvidence";
import VerseStudyRow from "./VerseStudyRow";
import { useStudyMarks } from "@/hooks/useStudyMarks";

export default function BibleReader({ books, apocrypha, title, subtitle, onBack, initialBook, initialChapter }) {
  const [book, setBook] = useState(initialBook || null);
  const [chapter, setChapter] = useState(Number(initialChapter) || 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cache = useRef({});
  const { evidence, modern, scientific, government } = useChapterEvidence(book, chapter);
  const { highlights, favorites, reload } = useStudyMarks();
  const [bookQuery, setBookQuery] = useState("");

  async function loadBook(b) {
    if (cache.current[b]) {
      setData(cache.current[b]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(bibleBookUrl(b, apocrypha));
      if (!res.ok) throw new Error("Could not load " + b + ".");
      const json = await res.json();
      cache.current[b] = json;
      setData(json);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (book) loadBook(book);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  const chapterCount = data?.chapters?.length || 0;
  const current = data?.chapters?.find((c) => String(c.chapter) === String(chapter));
  const verses = current?.verses || [];

  if (!book) {
    return (
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All corpora
        </button>
        <h1 className="font-display text-3xl text-[#2b2620] mb-1">{title}</h1>
        <p className="text-[#8a7f6f] mb-4 max-w-2xl">{subtitle}</p>
        <Link
          to={`/search?corpus=${apocrypha ? "apocrypha" : "canon"}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-8"
        >
          <Search className="w-4 h-4" /> Search inside {title}
        </Link>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(apocrypha ? books : CANON_BOOK_ENTRIES).map((b) => {
            const bookTitle = typeof b === "string" ? b : b.title;
            const description =
              (typeof b === "object" && b.desc) || CANON_BOOK_INFO[bookTitle] || "";
            return (
              <BookCard
                key={bookTitle}
                title={bookTitle}
                description={description}
                onClick={() => {
                  setChapter(1);
                  setBook(bookTitle);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => (initialBook ? onBack() : setBook(null))}
        className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> {title}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="font-display text-2xl sm:text-3xl text-[#2b2620]">
          {book} <span className="text-[#b08d3c]">·</span> Chapter {chapter}
        </h1>
        <div className="flex items-center gap-2">
        <ChapterEvidencePanel
          book={book}
          chapter={chapter}
          evidence={evidence}
          modern={modern}
          scientific={scientific}
          government={government}
        />
        <button
          disabled={chapter <= 1 || loading}
          onClick={() => setChapter((c) => Math.max(1, c - 1))}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
          <select
            value={chapter}
            onChange={(e) => setChapter(Number(e.target.value))}
            className="h-8 rounded-md border border-[#e8ddc7] bg-white text-sm px-2"
          >
            {Array.from({ length: chapterCount }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Chapter {i + 1}
              </option>
            ))}
          </select>
          <button
            disabled={chapter >= chapterCount || loading}
            onClick={() => setChapter((c) => Math.min(chapterCount, c + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={bookQuery}
          onChange={(e) => setBookQuery(e.target.value)}
          placeholder={`Search this chapter of ${book}`}
          className="h-9 flex-1 min-w-[200px] rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
        />
        <Link
          to={`/search?q=${encodeURIComponent(bookQuery || book)}&corpus=${apocrypha ? "apocrypha" : "canon"}`}
          className="text-sm text-[#7a2e2e] hover:underline"
        >
          Search all {apocrypha ? "Apocrypha" : "Bible"} →
        </Link>
      </div>
      {apocrypha && (
        <p className="text-xs text-[#8a7f6f] italic mb-4">
          Text from the 1611 King James Version; spelling preserves the original.
        </p>
      )}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && (
        <div className="space-y-1 rounded-2xl border border-[#e8ddc7] bg-[#fffdf8]/80 p-3 sm:p-5">
          {verses
            .filter((v) => {
              if (!bookQuery.trim()) return true;
              return `${v.verse} ${v.text}`.toLowerCase().includes(bookQuery.toLowerCase());
            })
            .map((v) => {
              const evItems = itemsForVerse(evidence, "scripture_reference", book, chapter, v.verse)
                .map((i) => ({ ...i, _kind: "evidence" }));
              const moItems = itemsForVerse(modern, "prophecy_reference", book, chapter, v.verse)
                .map((i) => ({ ...i, _kind: "modern" }));
              const scItems = itemsForVerse(scientific, "scripture_reference", book, chapter, v.verse)
                .map((i) => ({ ...i, _kind: "scientific" }));
              const goItems = itemsForVerse(government, "scripture_reference", book, chapter, v.verse)
                .map((i) => ({ ...i, _kind: "government" }));
              const verseItems = [...evItems, ...moItems, ...scItems, ...goItems];
              return (
                <VerseStudyRow
                  key={v.verse}
                  book={book}
                  chapter={chapter}
                  verse={v}
                  text={v.text}
                  verses={verses}
                  evidenceItems={verseItems}
                  highlights={highlights}
                  favorites={favorites}
                  onChanged={reload}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}