import React, { useEffect, useState } from "react";
import ListenControl from "@/components/ListenControl";
import VerseStudyRow from "./VerseStudyRow";
import { useStudyMarks } from "@/hooks/useStudyMarks";
import { chapterReadingText, stopAudible } from "@/lib/audibleReader";
import { itemsForVerse, useChapterEvidence } from "./useChapterEvidence";

const PAGE_SIZE = 80;

export default function ReadingVerseList({
  book,
  chapter = 1,
  verses,
  showEvidence = true,
  highlights: highlightsProp,
  favorites: favoritesProp,
  onChanged,
}) {
  const marks = useStudyMarks();
  const highlights = highlightsProp ?? marks.highlights;
  const favorites = favoritesProp ?? marks.favorites;
  const reload = onChanged ?? marks.reload;
  const { evidence, modern, scientific, government } = useChapterEvidence(
    showEvidence ? book : "",
    showEvidence ? chapter : ""
  );
  const [shown, setShown] = useState(PAGE_SIZE);

  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [book, chapter, verses]);

  useEffect(() => {
    stopAudible();
  }, [book, chapter]);

  const visible = verses.length > shown ? verses.slice(0, shown) : verses;

  return (
    <div className="py-1">
      {verses.length ? (
        <div className="mb-4">
          <ListenControl
            variant="chapter"
            id={`chapter:${book}:${chapter}`}
            title={`${book}${chapter ? ` ${chapter}` : ""}`}
            label="Listen to this chapter"
            text={() => chapterReadingText(book, chapter, verses)}
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
