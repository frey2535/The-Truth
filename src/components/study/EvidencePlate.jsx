import React from "react";

function inscriptionLines(text) {
  const block = String(text || "");
  const quoted = [...block.matchAll(/[“"]([^”"]{8,280})[”"]/g)].map((m) => m[1].trim());
  if (quoted.length) return quoted.slice(0, 6);
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 8 && !l.startsWith("Published") && !l.startsWith("This app"))
    .slice(0, 5);
}

export default function EvidencePlate({ item }) {
  const lines = inscriptionLines(item.full_text || item.description);
  const kind = item.evidence_type || item.document_type || item.archive || "record";
  const stone = /inscription|artifact|scroll/.test(kind);
  const gid = `plate-${item.id || item.title || "x"}`.replace(/\s+/g, "-");
  return (
    <figure className="mb-4 overflow-hidden rounded-2xl border border-[#d8c9a8] bg-[#3a3328] shadow-inner">
      <svg viewBox="0 0 640 360" className="w-full h-auto" role="img" aria-label={item.title}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b49a" />
            <stop offset="100%" stopColor="#8a7a62" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="#2b2620" />
        <rect x="28" y="24" width="584" height="312" rx="8" fill={stone ? `url(#${gid})` : "#f3e9c8"} />
        <rect x="40" y="36" width="560" height="288" rx="4" fill="none" stroke="#5b5142" strokeWidth="2" />
        <text x="320" y="70" textAnchor="middle" fill="#2b2620" fontFamily="Georgia, serif" fontSize="20">
          {String(item.title || "").slice(0, 52)}
        </text>
        <text x="320" y="94" textAnchor="middle" fill="#7a5e1a" fontFamily="Inter, sans-serif" fontSize="11">
          {item.holding ? String(item.holding).slice(0, 80) : "Published record stored in this app"}
        </text>
        {lines.slice(0, 6).map((line, i) => (
          <text
            key={i}
            x="320"
            y={140 + i * 28}
            textAnchor="middle"
            fill="#2b2620"
            fontFamily="Georgia, serif"
            fontSize="13"
          >
            {line.slice(0, 72)}
          </text>
        ))}
      </svg>
      <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[#f3e9c8]/80 bg-[#2b2620]">
        Line plate of the published wording stored in this app. This is not a modern photograph of the object.
        {item.holding ? ` Holding: ${item.holding}` : ""}
      </figcaption>
    </figure>
  );
}
