import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { manuscriptUrl, bibleBookUrl } from "./corpusData";

const mdComponents = {
  h1: ({ node, ...p }) => <h1 className="font-display text-2xl text-[#2b2620] mt-6 mb-3" {...p} />,
  h2: ({ node, ...p }) => <h2 className="font-display text-xl text-[#2b2620] mt-5 mb-2" {...p} />,
  h3: ({ node, ...p }) => <h3 className="font-display text-lg text-[#2b2620] mt-4 mb-2" {...p} />,
  p: ({ node, ...p }) => <p className="text-[#2b2620] leading-relaxed mb-3" {...p} />,
  strong: ({ node, ...p }) => <strong className="text-[#7a2e2e] font-semibold" {...p} />,
  a: ({ node, ...p }) => <a className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer" {...p} />,
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...p} />,
};

function MarkdownBook({ book, onBack }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = book.url || manuscriptUrl(book.slug);
    setLoading(true);
    setError("");
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load this text.");
        return r.text();
      })
      .then((t) => setText(t))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [book.id]);

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Apocrypha
      </button>
      <h1 className="font-display text-3xl text-[#2b2620] mb-4">{book.title}</h1>
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && (
        <article className="max-w-none">
          <ReactMarkdown components={mdComponents}>{text}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}

function WebBook({ book, onBack }) {
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setData(null);
    base44.functions
      .invoke("fetch_apocrypha_text", { bookId: book.bookId, chapter })
      .then((r) => {
        if (r?.error) throw new Error(r.error);
        setData(r);
      })
      .catch((e) => setError(e.message || "Could not load this chapter."))
      .finally(() => setLoading(false));
  }, [book.id, chapter]);

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Apocrypha
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="font-display text-2xl sm:text-3xl text-[#2b2620]">
          {book.title} <span className="text-[#b08d3c]">·</span> Chapter {chapter}
        </h1>
        <div className="flex items-center gap-2">
          <button
            disabled={chapter <= 1 || loading}
            onClick={() => setChapter((c) => Math.max(1, c - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            disabled={!data?.hasNext || loading}
            onClick={() => setChapter((c) => c + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-[#8a7f6f] italic mb-4">Text from the World English Bible (public domain), via eBible.org.</p>
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && data?.text && (
        <article className="max-w-none whitespace-pre-wrap text-[#2b2620] leading-relaxed">{data.text}</article>
      )}
    </div>
  );
}

function InfoBook({ book, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Apocrypha
      </button>
      <h1 className="font-display text-3xl text-[#2b2620] mb-4">{book.title}</h1>
      <p className="text-[#5b5142] leading-relaxed max-w-2xl mb-6">{book.desc}</p>
      {book.sourceUrl && (
        <a
          href={book.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2b2620] text-[#f3e9c8] text-sm hover:bg-[#3a3328]"
        >
          <ExternalLink className="w-4 h-4" /> Read on CCEL (Brenton Septuagint)
        </a>
      )}
    </div>
  );
}

function KjvBook({ book, onBack }) {
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setData(null);
    fetch(bibleBookUrl(book.bookName, true))
      .then((r) => {
        if (!r.ok) throw new Error("Could not load " + book.bookName + ".");
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [book.id]);

  const chapterCount = data?.chapters?.length || 0;
  const current = data?.chapters?.find((c) => String(c.chapter) === String(chapter));
  const verses = current?.verses || [];

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Apocrypha
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="font-display text-2xl sm:text-3xl text-[#2b2620]">
          {book.title} <span className="text-[#b08d3c]">·</span> Chapter {chapter}
        </h1>
        <div className="flex items-center gap-2">
          <button
            disabled={chapter <= 1 || loading}
            onClick={() => setChapter((c) => Math.max(1, c - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            disabled={chapter >= chapterCount || loading}
            onClick={() => setChapter((c) => Math.min(chapterCount, c + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-[#8a7f6f] italic mb-4">Text from the 1611 King James Version; spelling preserves the original.</p>
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && verses.length > 0 && (
        <article className="max-w-none text-[#2b2620] leading-relaxed">
          {verses.map((v) => (
            <React.Fragment key={v.verse}>
              <sup className="text-[#b08d3c] font-medium mr-1">{v.verse}</sup>
              {v.text}{" "}
            </React.Fragment>
          ))}
        </article>
      )}
    </div>
  );
}

export default function ExtraBookReader({ book, onBack }) {
  if (book.type === "kjv") return <KjvBook book={book} onBack={onBack} />;
  if (book.type === "markdown") return <MarkdownBook book={book} onBack={onBack} />;
  if (book.type === "web") return <WebBook book={book} onBack={onBack} />;
  return <InfoBook book={book} onBack={onBack} />;
}