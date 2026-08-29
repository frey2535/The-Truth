import React from "react";
import { ExternalLink, BookMarked, FlaskConical, Calendar, FileText } from "lucide-react";
import EvidenceVisual from "./EvidenceVisual";

export default function ScientificCard({ item }) {
  return (
    <article className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 shadow-sm flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-display text-xl text-[#2b2620] leading-tight">{item.title}</h3>
        {item.scientific_field && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f3e9c8]/60 text-[#7a5e1a] border border-[#b08d3c]/30">
            <FlaskConical className="w-3 h-3" />
            {item.scientific_field}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8a7f6f] mb-3">
        {item.scripture_reference && (
          <span className="inline-flex items-center gap-1">
            <BookMarked className="w-3 h-3" />
            Related <span className="text-[#5b5142] font-medium">{item.scripture_reference}</span>
          </span>
        )}
        {item.publication && (
          <span className="inline-flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {item.publication}
          </span>
        )}
        {item.date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.date}
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
      <div className="mt-auto flex flex-wrap gap-3">
        {item.article_url && (
          <a
            href={item.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#7a2e2e] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Read full article
          </a>
        )}
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#5b5142] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Source
          </a>
        )}
      </div>
    </article>
  );
}