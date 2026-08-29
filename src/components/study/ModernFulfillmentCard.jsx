import React from "react";
import { ExternalLink, MapPin, Calendar, BookMarked } from "lucide-react";
import EvidenceVisual from "./EvidenceVisual";

const typeStyles = {
  prophecy_fulfillment: { label: "Prophecy Fulfillment", cls: "bg-[#6a4a7a]/10 text-[#6a4a7a] border-[#6a4a7a]/25" },
  historical_event: { label: "Historical Event", cls: "bg-[#7a2e2e]/10 text-[#7a2e2e] border-[#7a2e2e]/25" },
  archaeological_modern: { label: "Modern Archaeology", cls: "bg-[#b08d3c]/15 text-[#8a6a1f] border-[#b08d3c]/30" },
  scientific: { label: "Scientific", cls: "bg-[#3a5a7a]/10 text-[#3a5a7a] border-[#3a5a7a]/25" },
  other: { label: "Other", cls: "bg-[#8a7f6f]/10 text-[#5b5142] border-[#8a7f6f]/25" },
};

export default function ModernFulfillmentCard({ item }) {
  const t = typeStyles[item.fulfillment_type] || typeStyles.other;
  return (
    <article className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 shadow-sm flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-display text-xl text-[#2b2620] leading-tight">{item.title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${t.cls}`}>
          {t.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8a7f6f] mb-3">
        {item.prophecy_reference && (
          <span className="inline-flex items-center gap-1">
            <BookMarked className="w-3 h-3" /> {item.prophecy_reference}
          </span>
        )}
        {item.modern_date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {item.modern_date}
          </span>
        )}
        {item.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {item.location}
          </span>
        )}
      </div>
      <EvidenceVisual item={item} />
      <p className="text-sm text-[#3a3328] leading-relaxed mb-2 whitespace-pre-wrap">{item.full_text || item.description}</p>
      {item.verification_note && (
        <p className="text-sm text-[#6b6155] leading-relaxed border-l-2 border-[#d8c9a8] pl-3 mb-2">
          {item.verification_note}
        </p>
      )}
      {item.source_url && (
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#7a2e2e] hover:underline mt-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View source
        </a>
      )}
    </article>
  );
}