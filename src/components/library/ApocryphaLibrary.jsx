import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { APOCRYPHA_BOOKS, APOCRYPHA_BOOK_INFO, EXTRA_APOCRYPHA_BOOKS } from "./corpusData";
import ExtraBookReader from "./ExtraBookReader";
import BookCard from "./BookCard";

function bookMatches(book, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const title = typeof book === "string" ? book : book.title;
  const desc = typeof book === "string" ? APOCRYPHA_BOOK_INFO[book] || "" : book.desc || "";
  return `${title} ${desc}`.toLowerCase().includes(q);
}

export default function ApocryphaLibrary({ onBack, initialBook, initialChapter, initialVerse }) {
  const [view, setView] = useState(() => {
    if (initialBook && APOCRYPHA_BOOKS.includes(initialBook)) return { type: "kjv", book: initialBook };
    const extra = EXTRA_APOCRYPHA_BOOKS.find((book) =>
      [book.id, book.slug, book.title].some((value) => String(value || "").toLowerCase() === String(initialBook || "").toLowerCase())
    );
    return extra ? { type: "extra", book: extra } : null;
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!initialBook) return;
    if (APOCRYPHA_BOOKS.includes(initialBook)) {
      setView({ type: "kjv", book: initialBook });
      return;
    }
    const extra = EXTRA_APOCRYPHA_BOOKS.find((book) =>
      [book.id, book.slug, book.title].some((value) => String(value || "").toLowerCase() === String(initialBook || "").toLowerCase())
    );
    if (extra) setView({ type: "extra", book: extra });
  }, [initialBook]);

  if (view?.type === "kjv") {
    return (
      <ExtraBookReader
        book={{ id: view.book, title: view.book, type: "kjv", bookName: view.book }}
        initialChapter={initialChapter}
        initialVerse={initialVerse}
        onBack={() => setView(null)}
      />
    );
  }
  if (view?.type === "extra") {
    return (
      <ExtraBookReader
        book={view.book}
        initialChapter={initialChapter}
        initialVerse={initialVerse}
        onBack={() => setView(null)}
      />
    );
  }

  const q = query.trim();
  const kjvBooks = APOCRYPHA_BOOKS.filter((book) => bookMatches(book, q));
  const extraBooks = EXTRA_APOCRYPHA_BOOKS.filter((book) => bookMatches(book, q));

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> All corpora
      </button>
      <h1 className="font-display text-3xl text-[#2b2620] mb-1">The Apocrypha</h1>
      <p className="text-[#8a7f6f] mb-8 max-w-2xl">
        1611 KJV Apocrypha plus 1 Enoch, Jubilees, the Odes of Solomon, 2–4 Baruch, and other stored
        deuterocanonical and pseudepigraphal books. The Septuagint Odes remain the biblical canticles already in the
        King James text.
      </p>
      <div className="max-w-xl mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an apocrypha book, document, or fragment"
          className="h-11 w-full rounded-xl border border-[#e8ddc7] bg-white px-4 text-sm"
        />
        {q ? (
          <p className="mt-2 text-xs text-[#8a7f6f]">
            {kjvBooks.length + extraBooks.length} matching text{kjvBooks.length + extraBooks.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {kjvBooks.length ? (
        <>
          <h2 className="font-display text-xl text-[#2b2620] mb-3">1611 KJV Apocrypha</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {kjvBooks.map((b) => (
              <BookCard
                key={b}
                title={b}
                description={APOCRYPHA_BOOK_INFO[b]}
                onClick={() => setView({ type: "kjv", book: b })}
              />
            ))}
          </div>
        </>
      ) : null}

      {extraBooks.length ? (
        <>
          <h2 className="font-display text-xl text-[#2b2620] mb-3">Additional Deuterocanonical Books</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraBooks.map((b) => (
              <BookCard
                key={b.id}
                title={b.title}
                description={b.desc}
                onClick={() => setView({ type: "extra", book: b })}
              />
            ))}
          </div>
        </>
      ) : null}
      {q && !kjvBooks.length && !extraBooks.length ? (
        <p className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-4 text-sm text-[#8a7f6f]">
          No stored Apocrypha text matches that search.
        </p>
      ) : null}
    </div>
  );
}