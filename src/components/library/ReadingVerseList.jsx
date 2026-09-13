import React, { useEffect, useState } from "react";
import ListenControl from "@/components/ListenControl";
import ListenSettings from "@/components/ListenSettings";
import VerseStudyRow from "./VerseStudyRow";
import ReadingTypeSize from "./ReadingTypeSize";
import { useStudyMarks } from "@/hooks/useStudyMarks";
import useAudibleReader from "@/hooks/useAudibleReader";
import { chapterReadingText, stopAudible } from "@/lib/audibleReader";
import { itemsForVerse, useChapterEvidence } from "./useChapterEvidence";
import {
  listeningVerseId,
  loadFontScale,
  saveFontScale,
  saveReadingPosition,
  verseDomId,
} from "@/lib/readingSession";

const PAGE_SIZE = 80;

export default function ReadingVerseList({
  book,
  chapter = 1,
  verses,
  showEvidence = true,
  highlights: highlightsProp,
  favorites: favoritesProp,
  onChanged,
  corpus = "bible",
  focusVerse = "",
}) {
  const marks = useStudyMarks();
  const highlights = highlightsProp ?? marks.highlights;
  const favorites = favoritesProp ?? marks.favorites;
  const reload = onChanged ?? marks.reload;
  const { evidence, modern, scientific, government } = useChapterEvidence(
    showEvidence ? book : "",
    showEvidence ? chapter : ""
  );
  const { status, id: activeId, currentVerse } = useAudibleReader();
  const listeningVerse = status === "idle" ? "" : listeningVerseId(activeId, currentVerse, book, chapter);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [fontScale, setFontScale] = useState(loadFontScale);

  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [book, chapter, verses]);

  useEffect(() => {
    stopAudible();
  }, [book, chapter]);

  useEffect(() => {
    const target = String(listeningVerse || focusVerse || "");
    if (!target) return;
    const idx = verses.findIndex((row) => String(row.verse) === target);
    if (idx >= 0 && idx + 1 > shown) setShown(Math.max(PAGE_SIZE, idx + 12));
  }, [listeningVerse, focusVerse, verses, shown]);

  useEffect(() => {
    const target = String(listeningVerse || focusVerse || "");
    if (!target || !book) return;
    const el = document.getElementById(verseDomId(book, chapter, target));
    if (el) el.scrollIntoView({ block: "center", behavior: listeningVerse ? "smooth" : "auto" });
  }, [listeningVerse, focusVerse, book, chapter, shown]);

  useEffect(() => {
    if (!book) return;
    saveReadingPosition({
      corpus,
      book,
      chapter,
      verse: listeningVerse || focusVerse || verses[0]?.verse || "",
      title: `${book}${chapter ? ` ${chapter}` : ""}`,
    });
  }, [book, chapter, corpus, listeningVerse, focusVerse, verses]);

  const visible = verses.length > shown ? verses.slice(0, shown) : verses;

  return (
    <div className="py-1" style={{ "--reading-size": `${1.0625 * fontScale}rem` }}>
      {verses.length ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ListenControl
            variant="chapter"
            id={`chapter:${book}:${chapter}`}
            title={`${book}${chapter ? ` ${chapter}` : ""}`}
            label="Listen to this chapter"
            text={() => chapterReadingText(book, chapter, verses)}
            verses={verses}
            book={book}
            chapter={chapter}
          />
          <ListenSettings compact />
          <ReadingTypeSize
            scale={fontScale}
            onChange={(next) => {
              setFontScale(next);
              saveFontScale(next);
            }}
          />
        </div>
      ) : null}
      {visible.map((v) => {
        const verseItems = showEvidence
          ? [
              ...itemsForVerse(evidence, "scripture_reference", book, chapter, v.verse).map((i) => ({
                ...i,
                _kind: "evidence",
              })),
              ...itemsForVerse(modern, "prophecy_reference", book, chapter, v.verse).map((i) => ({
                ...i,
                _kind: "modern",
              })),
              ...itemsForVerse(scientific, "scripture_reference", book, chapter, v.verse).map((i) => ({
                ...i,
                _kind: "scientific",
              })),
              ...itemsForVerse(government, "scripture_reference", book, chapter, v.verse).map((i) => ({
                ...i,
                _kind: "government",
              })),
            ]
          : [];
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
            listening={String(v.verse) === String(listeningVerse)}
          />
        );
      })}
      {shown < verses.length ? (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE_SIZE)}
          className="mt-4 text-sm text-[#7a2e2e] hover:underline"
        >
          Show next {Math.min(PAGE_SIZE, verses.length - shown)} of {verses.length - shown} remaining verses
        </button>
      ) : null}
    </div>
  );
}
