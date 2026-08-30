import React from "react";
import { Link } from "react-router-dom";
import SymbolPhoto from "@/components/library/SymbolPhoto";

export default function HolidayEvidenceCard({ title, description, to, photoId }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-stretch text-left whitespace-normal p-4 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
    >
      <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg">
        <SymbolPhoto id={photoId} title={title} />
      </div>
      <span className="font-display text-lg text-[#2b2620] mb-1">{title}</span>
      {description ? <span className="text-sm text-[#6b6155] leading-relaxed">{description}</span> : null}
    </Link>
  );
}
