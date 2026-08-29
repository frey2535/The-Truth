import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { manuscriptUrl, bibleBookUrl } from "./corpusData";
import BookCard from "./BookCard";
import { DSS_LOCAL_TEXT } from "./dssLocalTexts";
import { LEON_LEVY_URL } from "./dssWorks";

const mdComponents = {
  h1: ({ node, ...p }) => <h1 className="font-display text-2xl text-[#2b2620] mt-6 mb-3" {...p} />,
  h2: ({ node, ...p }) => <h2 className="font-display text-xl text-[#2b2620] mt-5 mb-2" {...p} />,
  h3: ({ node, ...p }) => <h3 className="font-display text-lg text-[#2b2620] mt-4 mb-2" {...p} />,
  p: ({ node, ...p }) => <p className="text-[#2b2620] leading-relaxed mb-3" {...p} />,
  strong: ({ node, ...p }) => <strong className="text-[#7a2e2e] font-semibold" {...p} />,
  blockquote: ({ node, ...p }) => (
    <blockquote className="border-l-2 border-[#d8c9a8] pl-4 italic text-[#6b6155] my-3" {...p} />
  ),
  hr: ({ node, ...p }) => <hr className="border-[#e8ddc7] my-6" {...p} />,
  a: ({ node, ...p }) => (
    <a className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer" {...p} />
  ),
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...p} />,
};

function itemKey(item) {
  return item.id || item.slug || item.title;
}

function overviewMarkdown(item) {
  const lines = [`## ${item.title}`, "", item.desc || ""];
  if (item.catalog) lines.push("", `**Qumran catalog:** ${item.catalog}`);
  if (item.sourceUrl) {
    lines.push("", `[Leon Levy Dead Sea Scrolls Digital Library](${item.sourceUrl})`);
  }
  return lines.join("\n");
}

function isLeonLevyGroup(group, item) {
  const href = item?.sourceUrl || group?.sourceUrl;
  return typeof href === "string" && href.includes("deadseascrolls.org.il");
}

function leonLevyHref(group, item) {
  return item?.sourceUrl || group?.sourceUrl || LEON_LEVY_URL;
}

function LeonLevyButton({ href, compact }) {
  return (
    <a
      href={href || LEON_LEVY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        compact
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#d8c9a8] bg-white text-sm text-[#2b2620] hover:bg-[#f3e9c8]/50"
          : "inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2b2620] text-[#f3e9c8] text-sm hover:bg-[#3a3328]"
      }
    >
      <ExternalLink className="w-4 h-4" />
      Leon Levy Digital Library
    </a>
  );
}

function WorkHeader({ item, group, groupTitle, onBack, extra }) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> {groupTitle}
      </button>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <h1 className="font-display text-2xl sm:text-3xl text-[#2b2620]">
          {item.title}
          {extra}
        </h1>
        {isLeonLevyGroup(group, item) && <LeonLevyButton href={leonLevyHref(group, item)} compact />}
      </div>
      {item.catalog && <p className="text-sm text-[#8a7f6f] mb-2 font-mono">{item.catalog}</p>}
      {item.missingAtQumran && (
        <p className="text-sm text-[#7a2e2e] mb-3">
          No copy of this book has been identified among the Qumran finds. The English below is the later biblical text, for reading.
        </p>
      )}
      {item.textNote && <p className="text-xs text-[#8a7f6f] italic mb-4">{item.textNote}</p>}
    </>
  );
}

function LeonLevyFooter({ group, item }) {
  if (!isLeonLevyGroup(group, item)) return null;
  return (
    <p className="mt-8 pt-4 border-t border-[#e8ddc7] text-sm">
      <a
        href={leonLevyHref(group, item)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#7a2e2e] underline"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View photographs in the Leon Levy Digital Library →
      </a>
    </p>
  );
}

function VerseArticle({ verses }) {
  return (
    <article className="max-w-none space-y-3">
      {verses.map((v) => (
        <p key={v.verse} className="text-[#2b2620] leading-relaxed">
          <sup className="text-[#b08d3c] font-medium mr-1.5">{v.verse}</sup>
          {v.text}
        </p>
      ))}
    </article>
  );
}

function ChapterNav({ chapter, chapterCount, onChange, loading }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={chapter <= 1 || loading}
        onClick={() => onChange(Math.max(1, chapter - 1))}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <select
        value={chapter}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 rounded-md border border-[#e8ddc7] bg-white text-sm px-2"
      >
        {Array.from({ length: Math.max(chapterCount, 1) }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Chapter {i + 1}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={chapter >= chapterCount || loading}
        onClick={() => onChange(Math.min(chapterCount, chapter + 1))}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm disabled:opacity-40 hover:bg-[#f3e9c8]/40"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ScriptureReader({ item, group, groupTitle, onBack }) {
  const bookList = item.kjvSet || [item.kjv || item.kjv1611];
  const apocrypha = Boolean(item.kjv1611);
  const [book, setBook] = useState(bookList[0]);
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setChapter(1);
  }, [book]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(bibleBookUrl(book, apocrypha))
      .then((r) => {
        if (!r.ok) throw new Error("Could not load " + book + ".");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [book, apocrypha]);

  const chapterCount = data?.chapters?.length || 0;
  const current = data?.chapters?.find((c) => String(c.chapter) === String(chapter));
  const verses = current?.verses || [];

  return (
    <div>
      <WorkHeader
        item={item}
        group={group}
        groupTitle={groupTitle}
        onBack={onBack}
        extra={
          <>
            {" "}
            <span className="text-[#b08d3c]">·</span> {bookList.length > 1 ? `${book} ` : ""}
            Chapter {chapter}
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {bookList.length > 1 && (
          <select
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className="h-8 rounded-md border border-[#e8ddc7] bg-white text-sm px-2"
          >
            {bookList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}
        <ChapterNav chapter={chapter} chapterCount={chapterCount} onChange={setChapter} loading={loading} />
      </div>
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && <VerseArticle verses={verses} />}
      <LeonLevyFooter group={group} item={item} />
    </div>
  );
}

function WebReader({ item, group, groupTitle, onBack }) {
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setData(null);
    base44.functions
      .invoke("fetch_apocrypha_text", { bookId: item.webBookId, chapter })
      .then((r) => {
        if (r?.error) throw new Error(r.error);
        setData(r);
      })
      .catch((e) => setError(e.message || "Could not load this chapter."))
      .finally(() => setLoading(false));
  }, [item.webBookId, chapter]);

  return (
    <div>
      <WorkHeader
        item={item}
        group={group}
        groupTitle={groupTitle}
        onBack={onBack}
        extra={
          <>
            {" "}
            <span className="text-[#b08d3c]">·</span> Chapter {chapter}
          </>
        }
      />
      <div className="mb-4">
        <ChapterNav
          chapter={chapter}
          chapterCount={data?.hasNext ? chapter + 1 : chapter}
          onChange={setChapter}
          loading={loading}
        />
      </div>
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && data?.text && (
        <article className="max-w-none whitespace-pre-wrap text-[#2b2620] leading-relaxed">{data.text}</article>
      )}
      <LeonLevyFooter group={group} item={item} />
    </div>
  );
}

function MarkdownReader({ item, group, groupTitle, onBack }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const inline = item.content || DSS_LOCAL_TEXT[item.id];
    if (inline) {
      setText(inline);
      setError("");
      setLoading(false);
      return;
    }
    const fetchUrl = item.file
      ? item.file
      : item.local
        ? `/dss/${item.local}.md`
        : item.url || (item.slug ? manuscriptUrl(item.slug) : null);
    if (!fetchUrl) {
      setText(overviewMarkdown(item));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetch(fetchUrl)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load this text.");
        return r.text();
      })
      .then(setText)
      .catch(() => {
        const fallback = DSS_LOCAL_TEXT[item.id] || overviewMarkdown(item);
        setText(fallback);
        setError("");
      })
      .finally(() => setLoading(false));
  }, [item]);

  return (
    <div>
      <WorkHeader item={item} group={group} groupTitle={groupTitle} onBack={onBack} />
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      )}
      {error && <p className="text-[#7a2e2e] text-center py-10">{error}</p>}
      {!loading && !error && (item.plain || (item.file || "").endsWith(".txt")) ? (
        <article className="max-w-none whitespace-pre-wrap text-[#2b2620] leading-relaxed text-sm">
          {text}
        </article>
      ) : (
        !loading && !error && (
          <article className="max-w-none">
            <ReactMarkdown components={mdComponents}>{text}</ReactMarkdown>
          </article>
        )
      )}
      <LeonLevyFooter group={group} item={item} />
    </div>
  );
}

export default function ManuscriptReader({ group, onBack }) {
  const [selected, setSelected] = useState(null);
  const sections = group.sections?.length
    ? group.sections
    : [{ heading: null, intro: null, items: group.items || [] }];

  if (!selected) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All corpora
        </button>
        <h1 className="font-display text-3xl text-[#2b2620] mb-1">{group.title}</h1>
        <p className="text-[#8a7f6f] mb-4 max-w-3xl">{group.desc}</p>
        {isLeonLevyGroup(group) && (
          <div className="mb-8">
            <LeonLevyButton href={group.sourceUrl} />
          </div>
        )}
        {sections.map((section) => (
          <section key={section.heading || "main"} className="mb-10">
            {section.heading && (
              <h2 className="font-display text-xl text-[#2b2620] mb-2">{section.heading}</h2>
            )}
            {section.intro && <p className="text-sm text-[#6b6155] mb-4 max-w-3xl">{section.intro}</p>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(section.items || []).map((m) => (
                <BookCard
                  key={itemKey(m)}
                  title={m.title}
                  description={m.desc}
                  onClick={() => setSelected(m)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  const back = () => setSelected(null);
  if (selected.kjv || selected.kjv1611 || selected.kjvSet) {
    return <ScriptureReader item={selected} group={group} groupTitle={group.title} onBack={back} />;
  }
  if (selected.webBookId) {
    return <WebReader item={selected} group={group} groupTitle={group.title} onBack={back} />;
  }
  return <MarkdownReader item={selected} group={group} groupTitle={group.title} onBack={back} />;
}
