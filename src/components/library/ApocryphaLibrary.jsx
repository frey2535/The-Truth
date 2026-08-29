import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { APOCRYPHA_BOOKS, APOCRYPHA_BOOK_INFO, EXTRA_APOCRYPHA_BOOKS } from "./corpusData";
import ExtraBookReader from "./ExtraBookReader";
import BookCard from "./BookCard";

export default function ApocryphaLibrary({ onBack }) {
  const [view, setView] = useState(null);

  if (view?.type === "kjv") {
    return (
      <ExtraBookReader
        book={{ id: view.book, title: view.book, type: "kjv", bookName: view.book }}
        onBack={() => setView(null)}
      />
    );
  }
  if (view?.type === "extra") {
    return <ExtraBookReader book={view.book} onBack={() => setView(null)} />;
  }

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> All corpora
      </button>
      <h1 className="font-display text-3xl text-[#2b2620] mb-1">The Apocrypha</h1>
      <p className="text-[#8a7f6f] mb-8 max-w-2xl">
        22 deuterocanonical and ancient books — the 1611 KJV Apocrypha plus 1 Enoch, Jubilees, the Psalms of Solomon,
        3 &amp; 4 Maccabees, Psalm 151, the Odes, and the Additions to Esther.
      </p>

      <h2 className="font-display text-xl text-[#2b2620] mb-3">1611 KJV Apocrypha</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {APOCRYPHA_BOOKS.map((b) => (
          <BookCard
            key={b}
            title={b}
            description={APOCRYPHA_BOOK_INFO[b]}
            onClick={() => setView({ type: "kjv", book: b })}
          />
        ))}
      </div>

      <h2 className="font-display text-xl text-[#2b2620] mb-3">Additional Deuterocanonical Books</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXTRA_APOCRYPHA_BOOKS.map((b) => (
          <BookCard
            key={b.id}
            title={b.title}
            description={b.desc}
            onClick={() => setView({ type: "extra", book: b })}
          />
        ))}
      </div>
    </div>
  );
}