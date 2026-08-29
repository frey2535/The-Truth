import React from "react";
import { ScrollText } from "lucide-react";

export default function BookCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-stretch text-left whitespace-normal p-5 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
    >
      <span className="flex items-center gap-2 mb-1">
        <ScrollText className="w-4 h-4 text-[#b08d3c] shrink-0" />
        <span className="font-display text-xl text-[#2b2620]">{title}</span>
      </span>
      {description ? (
        <span className="block text-sm text-[#6b6155] leading-relaxed font-normal">{description}</span>
      ) : null}
    </button>
  );
}
