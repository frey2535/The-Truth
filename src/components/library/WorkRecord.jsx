import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CATALOG_FIELDS, TEXT_STATUS, libraryReadHref } from "@/data/textCatalog";
import { loadCatalogWorkText } from "@/lib/catalogText";
import { catalogTextEntry } from "@/data/catalogTextMap";
import { scrollReadingToTop } from "@/lib/scrollReading";
import { textToNumberedVerses } from "@/lib/readingVerses";
import ClassificationBadge from "./ClassificationBadge";
import ReadingVerseList from "./ReadingVerseList";

export default function WorkRecord({ work, onBack }) {
  const href = libraryReadHref(work);
  const status = TEXT_STATUS[work.textStatus] || work.textStatus;
  const hasLocal = Boolean(catalogTextEntry(work));
  const opensSamePage = href && href.includes(`work=${encodeURIComponent(work.id)}`);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(hasLocal);
  const [missing, setMissing] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const verses = useMemo(() => (text ? textToNumberedVerses(text) : []), [text]);

  useEffect(() => {
    scrollReadingToTop();
  }, [work.id]);

  useEffect(() => {
    if (!hasLocal) {
      setText("");
      setLoading(false);
      setMissing(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadCatalogWorkText(work)
      .then((result) => {
        if (cancelled) return;
        setText(result.text || "");
        setMissing(result.missing || !result.text);
        setTruncated(Boolean(result.truncated));
        setLoading(false);
        scrollReadingToTop();
      })
      .catch(() => {
        if (cancelled) return;
        setText("");
        setMissing(true);
        setTruncated(false);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [work, hasLocal]);

  return (
    <div className="max-w-3xl mx-auto">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Master library
      </button>
      <h1 className="font-display text-3xl text-[#2b2620] mb-2">{work.title}</h1>
      <p className="text-sm text-[#7a2e2e] mb-3">{status}</p>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {work.labels.map((label) => (
          <ClassificationBadge key={label} label={label} />
        ))}
      </div>
      {href && !opensSamePage ? (
        <Link
          to={href}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#2b2620] text-[#f3e9c8] text-sm hover:bg-[#3a3328]"
        >
          <BookOpenText className="w-4 h-4" /> Read stored text
        </Link>
      ) : null}

      <section className="mb-8">
        <h2 className="font-display text-2xl text-[#2b2620] mb-3">Text</h2>
        {loading && <p className="text-sm text-[#8a7f6f]">Loading stored wording…</p>}
        {!loading && text ? (
          <>
            {truncated ? (
              <p className="text-sm text-[#5b5142] border border-[#e8ddc7] rounded-xl p-3 bg-white/70 mb-4">
                Showing the first stored portion of this volume so the page stays usable. The rest of the file is on disk and was not invented.
              </p>
            ) : null}
            <ReadingVerseList book={work.title} chapter={1} verses={verses} />
          </>
        ) : null}
        {!loading && !text ? (
          <p className="text-sm text-[#5b5142] border border-[#e8ddc7] rounded-xl p-3 bg-white/70">
            {missing
              ? "The complete wording is not stored in this app yet. Nothing was invented to fill the gap. Catalog notes are below."
              : "Open this work to read the stored wording."}
          </p>
        ) : null}
      </section>

      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="record">
          <AccordionTrigger className="font-display text-xl text-[#2b2620]">Catalog record</AccordionTrigger>
          <AccordionContent>
            <dl className="space-y-4">
              {CATALOG_FIELDS.map((field) => (
                <div key={field.key} className="border-b border-[#e8ddc7] pb-3">
                  <dt className="text-xs uppercase tracking-wide text-[#8a7f6f] mb-1">{field.label}</dt>
                  <dd className="text-[#2b2620] leading-relaxed whitespace-pre-wrap">
                    {field.key === "title" ? work.title : work[field.key] || "UNKNOWN"}
                  </dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
