import React from "react";
import { Link, useLocation } from "react-router-dom";

export const EVIDENCE_SECTIONS = [
  { to: "/evidence", label: "Archaeology" },
  { to: "/evidence/holidays", label: "Pagan traditions" },
  { to: "/science", label: "Science" },
  { to: "/government", label: "State papers" },
];

export function isEvidencePath(pathname) {
  return EVIDENCE_SECTIONS.some((s) => isSectionActive(pathname, s.to));
}

export function isSectionActive(pathname, to) {
  if (to === "/evidence") return pathname === "/evidence" || pathname === "/evidence/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function EvidenceSectionNav() {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {EVIDENCE_SECTIONS.map(({ to, label }) => {
        const active = isSectionActive(pathname, to);
        return (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/70 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
