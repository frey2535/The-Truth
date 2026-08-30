import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { CATALOG_FIELDS, TEXT_STATUS, libraryReadHref } from "@/data/textCatalog";
import ClassificationBadge from "./ClassificationBadge";

export default function WorkRecord({ work, onBack }) {
  const href = libraryReadHref(work);
  const status = TEXT_STATUS[work.textStatus] || work.textStatus;

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
      {href ? (
        <Link
          to={href}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#2b2620] text-[#f3e9c8] text-sm hover:bg-[#3a3328]"
        >
          <BookOpenText className="w-4 h-4" /> Read stored text
        </Link>
      ) : (
        <p className="text-sm text-[#5b5142] mb-6 border border-[#e8ddc7] rounded-xl p-3 bg-white/70">
          The complete wording is not stored in this app yet. The record below is so you know the work exists.
          Nothing was invented to fill the gap.
        </p>
      )}
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
    </div>
  );
}
