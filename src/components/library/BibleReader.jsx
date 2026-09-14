import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Search } from "lucide-react";
import { bibleBookUrl, CANON_BOOK_INFO } from "./corpusData";
import { BIBLE_VERSIONS, REFUSED_BIBLE_VERSIONS, bibleVersionById } from "@/data/bibleVersions";
import { bibleDownloadFilename, booksForVersion, buildBiblePlainText, downloadBibleText } from "@/lib/bibleDownload";
import BookCard from "./BookCard";
import ChapterEvidencePanel from "./ChapterEvidencePanel";
import { useChapterEvidence } from "./useChapterEvidence";
import ReadingVerseList from "./ReadingVerseList";
import { useStudyMarks } from "@/hooks/useStudyMarks";
import { scrollReadingToTop } from "@/lib/scrollReading";
import { saveReadingPosition } from "@/lib/readingSession";

export default function BibleReader({
  books,
  apocrypha,
  title,
  subtitle,
  onBack,
  initialBook,
  initialChapter,
  initialVerse,
  initialVersion,
  corpus = "bible",
}) {
  const navigate = useNavigate();
  const [book, setBook] = useState(initialBook || null);
  const [chapter, setChapter] = useState(Number(initialChapter) || 1);
  const [versionId, setVersionId] = useState(() => bibleVersionById(initialVersion).id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const cache = useRef({});
  const { evidence, modern, scientific, government } = useChapterEvidence(book, chapter);
  const { highlights, favorites, reload } = useStudyMarks();
  const [bookQuery, setBookQuery] = useState("");
  const version = bibleVersionById(versionId);
  const versionBooks = apocrypha
    ? books
    : booksForVersion(versionId).map((title) => ({
        title,
        desc: CANON_BOOK_INFO[title] || `${title} from ${version.label}.`,
      }));

  async function loadBook(b) {
    const key = `${versionId}:${b}`;
    if (cache.current[key]) {
      setData(cache.current[key]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(bibleBookUrl(b, apocrypha, versionId));
      if (!res.ok) throw new Error("Could not load " + b + ".");
      const raw = await res.text();
      if (raw.trimStart().startsWith("<")) throw new Error("Could not load " + b + ".");
      const json = JSON.parse(raw);
      cache.current[key] = json;
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
  }, [book, versionId]);

  useEffect(() => {
    if (initialBook) setBook(initialBook);
    if (initialChapter) setChapter(Number(initialChapter) || 1);
  }, [initialBook, initialChapter]);

  useEffect(() => {
    scrollReadingToTop();
  }, [book, chapter]);

  function openChapter(nextBook, nextChapter) {
    const next = Number(nextChapter) || 1;
    setBook(nextBook);
    setChapter(next);
    const q = new URLSearchParams({
      corpus: apocrypha ? "apocrypha" : corpus,
      book: nextBook,
      chapter: String(next),
    });
    if (!apocrypha && versionId !== "kjv") q.set("version", versionId);
    navigate(`/library?${q.toString()}`, { replace: true });
    saveReadingPosition({
      corpus: apocrypha ? "apocrypha" : corpus,
      book: nextBook,
      chapter: next,
      title: `${nextBook} ${next}`,
      version: apocrypha ? "" : versionId,
    });
  }

  function changeVersion(nextId) {
    const next = bibleVersionById(nextId).id;
    const stillHasBook = book && booksForVersion(next).includes(book);
    setVersionId(next);
    setData(null);
    if (!stillHasBook) setBook(null);
    const q = new URLSearchParams({
      corpus: apocrypha ? "apocrypha" : corpus,
    });
    if (next !== "kjv") q.set("version", next);
    if (stillHasBook) {
      q.set("book", book);
      q.set("chapter", String(chapter || 1));
    }
    navigate(`/library?${q.toString()}`, { replace: true });
  }

  async function handleDownload() {
    if (downloading || apocrypha) return;
    setDownloading(true);
    setError("");
    try {
      const text = await buildBiblePlainText(versionId);
      downloadBibleText(bibleDownloadFilename(versionId), text);
    } catch (err) {
      setError(err.message || "Could not download this Bible.");
    } finally {
      setDownloading(false);
    }
  }

  const versionControls = !apocrypha ? (
    <div className="mb-6 rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm text-[#5b5142] shrink-0" htmlFor="bible-version">
          Bible version
        </label>
        <select
          id="bible-version"
          value={versionId}
          onChange={(e) => changeVersion(e.target.value)}
          className="h-10 flex-1 rounded-md border border-[#e8ddc7] bg-white text-sm px-2"
        >
          {BIBLE_VERSIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-md bg-[#2b2620] text-[#f3e9c8] text-sm disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download this Bible
        </button>
      </div>
      <p className="text-xs text-[#6b6155] mt-2 leading-relaxed">{version.note}</p>
      <p className="text-xs text-[#8a7f6f] mt-1">
        Not offered: {REFUSED_BIBLE_VERSIONS.join(", ")}. Those either leave verses out or are modern copyrighted rewrites.
      </p>
    </div>
  ) : null;

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
        {versionControls}
        <Link
          to={`/search?corpus=${apocrypha ? "apocrypha" : "canon"}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-8"
        >
          <Search className="w-4 h-4" /> Search inside {title}
        </Link>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(apocrypha ? books : versionBooks).map((b) => {
            const bookTitle = typeof b === "string" ? b : b.title;
            const description =
              (typeof b === "object" && b.desc) || CANON_BOOK_INFO[bookTitle] || "";
            return (
              <BookCard
                key={bookTitle}
                title={bookTitle}
                description={description}
                onClick={() => openChapter(bookTitle, 1)}
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
        onClick={() => {
          setBook(null);
          const q = new URLSearchParams({ corpus: apocrypha ? "apocrypha" : corpus });
          if (!apocrypha && versionId !== "kjv") q.set("version", versionId);
          navigate(`/library?${q.toString()}`, { replace: true });
        }}
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
          onClick={() => openChapter(book, Math.max(1, chapter - 1))}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
          <select
            value={chapter}
            onChange={(e) => openChapter(book, Number(e.target.value))}
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
            onClick={() => openChapter(book, Math.min(chapterCount, chapter + 1))}
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
      {apocrypha ? (
        <p className="text-xs text-[#8a7f6f] italic mb-4">
          Text from the 1611 King James Version; spelling preserves the original.
        </p>
      ) : (
        <p className="text-xs text-[#8a7f6f] italic mb-4">{version.label}. {version.note}</p>
      )}
      {!apocrypha && versionControls}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && (
        <ReadingVerseList
          book={book}
          chapter={chapter}
          corpus={apocrypha ? "apocrypha" : corpus}
          focusVerse={initialVerse || ""}
          verses={verses.filter((v) => {
            if (!bookQuery.trim()) return true;
            return `${v.verse} ${v.text}`.toLowerCase().includes(bookQuery.toLowerCase());
          })}
          highlights={highlights}
          favorites={favorites}
          onChanged={reload}
        />
      )}
    </div>
  );
}