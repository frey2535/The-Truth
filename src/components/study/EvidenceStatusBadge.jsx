import React from "react";

const styles = {
  established: { label: "Established", cls: "bg-[#2f5d52]/10 text-[#2f5d52] border-[#2f5d52]/25" },
  established_contextual: {
    label: "Established / contextual",
    cls: "bg-[#3a5a7a]/10 text-[#3a5a7a] border-[#3a5a7a]/25",
  },
  likely: { label: "Likely identification", cls: "bg-[#8a6a1f]/10 text-[#8a6a1f] border-[#b08d3c]/30" },
  disputed_identification: {
    label: "Identification disputed",
    cls: "bg-[#7a2e2e]/10 text-[#7a2e2e] border-[#7a2e2e]/25",
  },
  reported: { label: "Reported / unverified", cls: "bg-[#7a2e2e]/12 text-[#7a2e2e] border-[#7a2e2e]/35" },
};

export default function EvidenceStatusBadge({ status }) {
  if (!status) return null;
  const s = styles[status] || styles.established;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}
