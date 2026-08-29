import React from "react";
import { ExternalLink, MapPin, Clock, BookMarked } from "lucide-react";
import EvidenceTypeBadge from "./EvidenceTypeBadge";
import EvidenceVisual from "./EvidenceVisual";

export default function EvidenceCard({ item }) {
  return (
    <article className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 shadow-sm flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-display text-xl text-[#2b2620] leading-tight">{item.title}</h3>
        <EvidenceTypeBadge type={item.evidence_type} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8a7f6f] mb-3">
        {item.scripture_reference && (
          <span className="inline-flex items-center gap-1">
            <BookMarked className="w-3 h-3" /> Related <span className="text-[#5b5142] font-medium">{item.scripture_reference}</span>
          </span>
        )}
        {item.era && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.era}</span>}
        {item.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
      </div>
      <EvidenceVisual item={item} />
      <p className="text-sm text-[#3a3328] leading-relaxed mb-2 whitespace-pre-wrap">{item.full_text || item.description}</p>
      {item.holding && <p className="text-xs text-[#8a7f6f] mb-2">{item.holding}</p>}
      {item.verification_note && (
        <p className="text-sm text-[#6b6155] leading-relaxed border-l-2 border-[#d8c9a8] pl-3 mb-2">{item.verification_note}</p>
      )}
      {item.source_url && (
        <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#7a2e2e] hover:underline mt-auto">
          <ExternalLink className="w-3.5 h-3.5" /> View source
        </a>
      )}
    </article>
  );
}