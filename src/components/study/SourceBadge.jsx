import React from "react";

const styles = {
  canon: { label: "Canonical Scripture", cls: "bg-[#7a2e2e]/10 text-[#7a2e2e] border-[#7a2e2e]/25" },
  apocrypha: { label: "Apocrypha / Deuterocanon", cls: "bg-[#b08d3c]/15 text-[#8a6a1f] border-[#b08d3c]/30" },
  dead_sea_scrolls: { label: "Dead Sea Scrolls", cls: "bg-[#5b4a3a]/10 text-[#5b4a3a] border-[#5b4a3a]/25" },
  enoch: { label: "Book of Enoch", cls: "bg-[#2f5d52]/10 text-[#2f5d52] border-[#2f5d52]/25" },
  other: { label: "Extracanonical", cls: "bg-[#8a7f6f]/10 text-[#5b5142] border-[#8a7f6f]/25" },
};

export default function SourceBadge({ source }) {
  const s = styles[source] || styles.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}