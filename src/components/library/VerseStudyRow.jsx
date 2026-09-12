import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Highlighter, Star, StickyNote, Link2, Languages, ChevronDown, Volume2 } from "lucide-react";
import { speakText } from "@/lib/audibleReader";
import VerseEvidenceBadge from "./VerseEvidenceBadge";
import { chapterCrossRefs, significantWords } from "@/lib/crossRefs";
import { findRelatedVerses } from "@/lib/localCorpusSearch";
import { libraryHref } from "@/lib/libraryLinks";
import { speechSegments } from "@/lib/jesusWords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function WordParts({ text, jesus, refLabel }) {
  return text.split(/(\b)/).map((part, i) => {
    const word = /^[A-Za-z']{3,}$/.test(part);
    const color = jesus ? "jesus-speech" : undefined;
    if (word) {
      return (
        <Link
          key={`${refLabel}-${i}`}
          to={`/word-study?word=${encodeURIComponent(part)}&ref=${encodeURIComponent(refLabel)}`}
          className={`${color || "hover:text-[#7a2e2e]"} hover:underline underline-offset-2`}
        >
          {part}
        </Link>
      );
    }
    return (
      <span key={`${refLabel}-${i}`} className={color}>
        {part}
      </span>
    );
  });
}

export default function VerseStudyRow({
  book,
  chapter,
  verse,
  text,
  verses,
  evidenceItems,
  highlights,
  favorites,
  onChanged,
}) {
  const ref = `${book} ${chapter}:${verse.verse}`;
  const [note, setNote] = useState("");
  const [topic, setTopic] = useState("");
  const [open, setOpen] = useState("");
  const [busy, setBusy] = useState(false);
  const [moreLinks, setMoreLinks] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const highlighted = highlights.some((h) => h.reference === ref);
  const favored = favorites.some((f) => f.reference === ref);
  const links = useMemo(() => chapterCrossRefs(verses, verse, book, chapter), [verses, verse, book, chapter]);
  const words = significantWords(text);
  const segments = useMemo(
    () => speechSegments(book, chapter, verse.verse, text),
    [book, chapter, verse.verse, text]
  );

  async function toggleHighlight() {
    setBusy(true);
    try {
      const existing = highlights.find((h) => h.reference === ref);
      if (existing) await base44.entities.Highlight.delete(existing.id);
      else await base44.entities.Highlight.create({ reference: ref, text, book, chapter, verse: verse.verse, color: "gold" });
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function toggleFavorite() {
    setBusy(true);
    try {
      const existing = favorites.find((f) => f.reference === ref);
      if (existing) await base44.entities.Favorite.delete(existing.id);
      else {
        await base44.entities.Favorite.create({
          reference: ref,
          text,
          book,
          chapter,
          verse: verse.verse,
          topic: topic.trim() || book,
        });
      }
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function saveNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      await base44.entities.Note.create({
        reference: ref,
        body: note.trim(),
        topic: topic.trim() || book,
        book,
        chapter,
        verse: verse.verse,
      });
      setNote("");
      setOpen("");
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function openMatching() {
    const next = open === "links" ? "" : "links";
    setOpen(next);
    if (next === "links" && moreLinks.length === 0) {
      setLoadingMore(true);
      try {
        setMoreLinks(await findRelatedVerses(text, ref, { limit: 10 }));
      } finally {
        setLoadingMore(false);
      }
    }
  }

  return (
    <div className={`mb-6 last:mb-0 ${highlighted ? "-mx-3 px-3 py-2 rounded-lg bg-[#f3e9c8]/90 border border-[#b08d3c]/30" : ""}`}>
      <p className="text-[#2b2620] leading-[1.85] text-[17px] sm:text-lg">
        <sup className="text-[#b08d3c] font-semibold mr-1.5 select-none">{verse.verse}</sup>
        {segments.map((seg, i) => (
          <WordParts key={`${ref}-seg-${i}`} text={seg.text} jesus={seg.jesus} refLabel={ref} />
        ))}
        {evidenceItems?.length > 0 && <VerseEvidenceBadge verse={ref} items={evidenceItems} />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-2 align-middle text-xs font-medium text-[#7a2e2e] hover:underline underline-offset-2"
            >
              Options
              <ChevronDown className="inline w-3 h-3 ml-0.5 align-[-1px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Verse {verse.verse}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={busy} onSelect={() => void toggleHighlight()}>
              <Highlighter />
              {highlighted ? "Remove highlight" : "Highlight"}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={busy} onSelect={() => void toggleFavorite()}>
              <Star className={favored ? "fill-[#b08d3c] text-[#b08d3c]" : ""} />
              {favored ? "Remove favorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => speakText(`${ref}. ${text}`, { id: `verse:${ref}`, title: ref })}
            >
              <Volume2 />
              Listen
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpen(open === "note" ? "" : "note")}>
              <StickyNote />
              Note
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void openMatching()}>
              <Link2 />
              Matching texts
            </DropdownMenuItem>
            {words.length > 0 ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Languages />
                  Define
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {words.slice(0, 8).map((word) => (
                    <DropdownMenuItem key={word} asChild>
                      <Link to={`/word-study?word=${encodeURIComponent(word)}&ref=${encodeURIComponent(ref)}`}>
                        {word}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </p>
      {open === "note" && (
        <form onSubmit={saveNote} className="mt-3 space-y-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            className="w-full h-9 rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Note on ${ref}`}
            className="w-full min-h-[72px] rounded-lg border border-[#e8ddc7] bg-white px-3 py-2 text-sm"
          />
          <button type="submit" disabled={busy} className="truth-btn-sm">
            Save note
          </button>
        </form>
      )}
      {open === "links" && (
        <div className="mt-3 rounded-xl border border-[#e8ddc7] bg-white/80 p-3 space-y-2">
          <p className="text-xs text-[#8a7f6f]">
            Other stored verses that share wording — this chapter first, then other books.
          </p>
          {loadingMore && <p className="text-sm text-[#8a7f6f]">Searching the stored texts…</p>}
          {[...links, ...moreLinks].length === 0 && !loadingMore && (
            <p className="text-sm text-[#8a7f6f]">No matching wording found yet.</p>
          )}
          {[...links, ...moreLinks].map((l) => (
            <p key={`${l.reference}-${l.source || ""}`} className="text-sm text-[#3a3328]">
              <Link
                to={libraryHref({
                  book: l.book,
                  chapter: l.chapter,
                  source: l.source || "canon",
                  reference: l.reference,
                })}
                className="font-medium text-[#7a2e2e] hover:underline"
              >
                {l.reference}
              </Link>{" "}
              {l.source && <span className="text-[10px] uppercase text-[#8a7f6f]">{l.source} </span>}
              {String(l.text || "").slice(0, 180)}
              {String(l.text || "").length > 180 ? "…" : ""}
            </p>
          ))}
          <Link
            to={`/search?q=${encodeURIComponent(words.slice(0, 3).join(" "))}&corpus=canon`}
            className="inline-block text-sm text-[#7a2e2e] hover:underline"
          >
            Search other books for this wording →
          </Link>
        </div>
      )}
    </div>
  );
}
