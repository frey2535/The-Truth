import React from "react";
import { stepFontScale } from "@/lib/readingSession";

export default function ReadingTypeSize({ scale, onChange }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#e8ddc7] bg-white text-sm" data-no-listen>
      <button
        type="button"
        className="px-2.5 py-1.5 hover:bg-[#f3e9c8]/40 disabled:opacity-40"
        disabled={scale <= 0.9}
        onClick={() => onChange(stepFontScale(scale, -1))}
        title="Smaller type"
      >
        A−
      </button>
      <span className="px-1 text-[#8a7f6f] select-none">Type</span>
      <button
        type="button"
        className="px-2.5 py-1.5 hover:bg-[#f3e9c8]/40 disabled:opacity-40"
        disabled={scale >= 1.5}
        onClick={() => onChange(stepFontScale(scale, 1))}
        title="Larger type"
      >
        A+
      </button>
    </span>
  );
}
