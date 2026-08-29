import React from "react";

export default function EvidencePlate({ item }) {
  const text = String(item.full_text || item.description || "").trim();
  const excerpt = text.split("\n").filter(Boolean).slice(0, 8).join("\n").slice(0, 420);
  return (
    <figure className="mb-4 rounded-2xl overflow-hidden border border-[#c9b48a] shadow-sm">
      <div className="relative bg-[radial-gradient(circle_at_20%_10%,#f7edcf,transparent_45%),radial-gradient(circle_at_80%_90%,#e8d3a4,transparent_40%),#f0e0b8] px-5 py-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 11px, #c9b48a33 12px)" }} />
        <p className="relative text-[10px] uppercase tracking-[0.22em] text-[#7a5e1a] mb-2">Authentic record plate</p>
        <h4 className="relative font-display text-xl text-[#2b2620] leading-tight mb-2">{item.title}</h4>
        <pre className="relative whitespace-pre-wrap font-display text-[13px] leading-relaxed text-[#3a3328] max-h-40 overflow-hidden">
          {excerpt}
        </pre>
        <p className="relative mt-3 text-[11px] text-[#6b6155]">
          {item.holding || item.agency || item.publication || "Stored wording of the published record."}
        </p>
      </div>
      <figcaption className="px-4 py-2 bg-[#2b2620] text-[#f3e9c8] text-[11px] leading-relaxed">
        This plate shows the published wording stored in the app, not a later drawing of a rite and not an invented photograph.
      </figcaption>
    </figure>
  );
}
