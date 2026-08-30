import React from "react";

const TONE = {
  "HEBREW BIBLE": "bg-[#2b2620] text-[#f3e9c8]",
  "NEW TESTAMENT CANON": "bg-[#2b2620] text-[#f3e9c8]",
  DEUTEROCANONICAL: "bg-[#5e2222] text-[#f3e9c8]",
  "EASTERN ORTHODOX CANON": "bg-[#5e2222] text-[#f3e9c8]",
  "ETHIOPIAN CANON": "bg-[#5e2222] text-[#f3e9c8]",
  "MODERN FORGERY": "bg-[#7a2e2e] text-[#f3e9c8]",
  "KNOWN FORGERY": "bg-[#7a2e2e] text-[#f3e9c8]",
  "COMPARATIVE (NOT CHRISTIAN SCRIPTURE)": "bg-[#5b5142] text-[#f3e9c8]",
  "JEWISH COMPARATIVE SOURCE": "bg-[#5b5142] text-[#f3e9c8]",
  "GRECO-ROMAN HISTORICAL SOURCE": "bg-[#5b5142] text-[#f3e9c8]",
};

export default function ClassificationBadge({ label }) {
  const tone = TONE[label] || "bg-[#f3e9c8] text-[#5b5142] border border-[#e8ddc7]";
  return (
    <span className={`inline-block text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded ${tone}`}>
      {label}
    </span>
  );
}
