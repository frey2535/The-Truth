import React from "react";

const styles = {
  artifact: { label: "Artifact", cls: "bg-[#b08d3c]/15 text-[#8a6a1f] border-[#b08d3c]/30" },
  scroll: { label: "Scroll", cls: "bg-[#2f5d52]/10 text-[#2f5d52] border-[#2f5d52]/25" },
  inscription: { label: "Inscription", cls: "bg-[#7a2e2e]/10 text-[#7a2e2e] border-[#7a2e2e]/25" },
  archaeological_site: { label: "Archaeological Site", cls: "bg-[#5b4a3a]/10 text-[#5b4a3a] border-[#5b4a3a]/25" },
  manuscript: { label: "Manuscript", cls: "bg-[#3a5a7a]/10 text-[#3a5a7a] border-[#3a5a7a]/25" },
  historical_record: { label: "Historical Record", cls: "bg-[#6a4a7a]/10 text-[#6a4a7a] border-[#6a4a7a]/25" },
  geological_record: { label: "Land and minerals", cls: "bg-[#3a5a3a]/10 text-[#2f5d52] border-[#2f5d52]/25" },
  other: { label: "Other", cls: "bg-[#8a7f6f]/10 text-[#5b5142] border-[#8a7f6f]/25" },
};

export default function EvidenceTypeBadge({ type }) {
  const s = styles[type] || styles.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}