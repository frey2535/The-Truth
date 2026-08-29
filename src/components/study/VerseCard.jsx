import React from "react";
import SourceBadge from "./SourceBadge";
import EvidenceModal from "./EvidenceModal";
import CrossReferenceModal from "./CrossReferenceModal";
import ModernFulfillmentModal from "./ModernFulfillmentModal";

export default function VerseCard({ verse, index, topic }) {
  return (
    <article className="relative pl-14 pr-2 py-5 border-b border-[#ece2cc] last:border-0">
      <div className="absolute left-0 top-5 w-10 h-10 rounded-full bg-[#2b2620] text-[#f3e9c8] grid place-items-center font-display text-lg">
        {index + 1}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-display text-xl text-[#2b2620]">{verse.reference}</h3>
        <SourceBadge source={verse.source} />
        {verse.era && <span className="text-xs text-[#8a7f6f] italic">{verse.era}</span>}
      </div>
      <p className="font-display text-[1.35rem] leading-relaxed text-[#3a3328] mb-3">{verse.text}</p>
      {verse.context_note && (
        <p className="text-sm text-[#6b6155] leading-relaxed border-l-2 border-[#d8c9a8] pl-3 mb-2">
          {verse.context_note}
        </p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
        <EvidenceModal reference={verse.reference} topic={topic} />
        <CrossReferenceModal reference={verse.reference} topic={topic} />
        <ModernFulfillmentModal reference={verse.reference} topic={topic} />
      </div>
    </article>
  );
}