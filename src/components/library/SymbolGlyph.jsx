import React from "react";

const stroke = "#7a2e2e";
const ink = "#2b2620";
const gold = "#b08d3c";
const cream = "#f3e9c8";

function Frame({ children }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <rect x="1.5" y="1.5" width="97" height="97" rx="8" fill={cream} stroke="#e8ddc7" strokeWidth="1.5" />
      {children}
    </svg>
  );
}

function pentagramPoints(cx, cy, r, rotDeg) {
  const rot = (rotDeg * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i < 5; i += 1) {
    const a = rot + (i * 4 * Math.PI) / 5 - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts.map((p) => p.join(",")).join(" ");
}

export default function SymbolGlyph({ type }) {
  switch (type) {
    case "sun-disk":
      return (
        <Frame>
          <circle cx="50" cy="50" r="14" fill={gold} stroke={stroke} strokeWidth="1.5" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            const x1 = 50 + Math.cos(a) * 20;
            const y1 = 50 + Math.sin(a) * 20;
            const x2 = 50 + Math.cos(a) * 32;
            const y2 = 50 + Math.sin(a) * 32;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="2" strokeLinecap="round" />;
          })}
        </Frame>
      );
    case "sun-cross":
      return (
        <Frame>
          <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth="2.5" />
          <line x1="50" y1="22" x2="50" y2="78" stroke={stroke} strokeWidth="2.5" />
          <line x1="22" y1="50" x2="78" y2="50" stroke={stroke} strokeWidth="2.5" />
        </Frame>
      );
    case "radiate-crown":
      return (
        <Frame>
          <circle cx="50" cy="58" r="16" fill="none" stroke={ink} strokeWidth="2" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (i * Math.PI) / 8;
            const x = 50 + Math.cos(a) * 26;
            const y = 58 + Math.sin(a) * 26;
            return <line key={i} x1="50" y1="58" x2={x} y2={y} stroke={gold} strokeWidth="2" />;
          })}
        </Frame>
      );
    case "halo-nimbus":
      return (
        <Frame>
          <circle cx="50" cy="42" r="18" fill="none" stroke={gold} strokeWidth="4" />
          <circle cx="50" cy="62" r="10" fill="none" stroke={ink} strokeWidth="2" />
          <line x1="50" y1="72" x2="50" y2="86" stroke={ink} strokeWidth="2" />
        </Frame>
      );
    case "winged-sun":
      return (
        <Frame>
          <ellipse cx="28" cy="50" rx="16" ry="8" fill="none" stroke={stroke} strokeWidth="2" />
          <ellipse cx="72" cy="50" rx="16" ry="8" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill={gold} stroke={stroke} strokeWidth="1.5" />
        </Frame>
      );
    case "crescent-moon":
      return (
        <Frame>
          <path
            d="M58 22a28 28 0 1 0 0 56 22 22 0 1 1 0-56z"
            fill={gold}
            stroke={stroke}
            strokeWidth="1.5"
          />
        </Frame>
      );
    case "evergreen":
      return (
        <Frame>
          <polygon points="50,16 68,40 58,40 74,62 26,62 42,40 32,40" fill="#2e6b3a" stroke={ink} strokeWidth="1.2" />
          <rect x="46" y="62" width="8" height="18" fill="#6b4a2a" />
        </Frame>
      );
    case "oak-mistletoe":
      return (
        <Frame>
          <path d="M50 86 V28" stroke="#6b4a2a" strokeWidth="5" />
          <circle cx="50" cy="24" r="10" fill="none" stroke="#2e6b3a" strokeWidth="3" />
          <circle cx="42" cy="22" r="5" fill="#c9d97c" stroke={ink} strokeWidth="0.8" />
          <circle cx="58" cy="26" r="5" fill="#c9d97c" stroke={ink} strokeWidth="0.8" />
          <circle cx="50" cy="16" r="4" fill="#c9d97c" stroke={ink} strokeWidth="0.8" />
        </Frame>
      );
    case "zodiac-wheel":
      return (
        <Frame>
          <circle cx="50" cy="50" r="30" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="50" r="12" fill="none" stroke={gold} strokeWidth="1.5" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 12}
                y1={50 + Math.sin(a) * 12}
                x2={50 + Math.cos(a) * 30}
                y2={50 + Math.sin(a) * 30}
                stroke={stroke}
                strokeWidth="1.2"
              />
            );
          })}
        </Frame>
      );
    case "pentagram-up":
      return (
        <Frame>
          <polygon
            points={pentagramPoints(50, 52, 30, 0)}
            fill="none"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinejoin="miter"
          />
        </Frame>
      );
    case "pentagram-down":
      return (
        <Frame>
          <polygon
            points={pentagramPoints(50, 48, 30, 180)}
            fill="none"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinejoin="miter"
          />
        </Frame>
      );
    case "pentacle":
      return (
        <Frame>
          <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="2" />
          <polygon
            points={pentagramPoints(50, 52, 26, 0)}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </Frame>
      );
    case "hexagram":
      return (
        <Frame>
          <polygon points="50,18 72,78 28,78" fill="none" stroke={stroke} strokeWidth="2" />
          <polygon points="50,82 28,22 72,22" fill="none" stroke={stroke} strokeWidth="2" />
        </Frame>
      );
    case "unicursal-hexagram":
      return (
        <Frame>
          <polygon
            points="50,16 62,42 88,42 68,58 76,84 50,68 24,84 32,58 12,42 38,42"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </Frame>
      );
    case "chaos-star":
      return (
        <Frame>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            const x = 50 + Math.cos(a) * 32;
            const y = 50 + Math.sin(a) * 32;
            const bx = 50 + Math.cos(a) * 8;
            const by = 50 + Math.sin(a) * 8;
            const px = x + Math.cos(a) * 6;
            const py = y + Math.sin(a) * 6;
            const left = a + Math.PI / 2;
            return (
              <g key={i}>
                <line x1={bx} y1={by} x2={x} y2={y} stroke={stroke} strokeWidth="2.2" />
                <polygon
                  points={`${px},${py} ${x + Math.cos(left) * 4},${y + Math.sin(left) * 4} ${x - Math.cos(left) * 4},${y - Math.sin(left) * 4}`}
                  fill={stroke}
                />
              </g>
            );
          })}
        </Frame>
      );
    case "latin-cross":
      return (
        <Frame>
          <rect x="44" y="18" width="12" height="64" fill={stroke} />
          <rect x="26" y="34" width="48" height="12" fill={stroke} />
        </Frame>
      );
    case "inverted-cross":
      return (
        <Frame>
          <rect x="44" y="18" width="12" height="64" fill={stroke} />
          <rect x="26" y="58" width="48" height="12" fill={stroke} />
        </Frame>
      );
    case "leviathan-cross":
      return (
        <Frame>
          <rect x="46" y="14" width="8" height="52" fill={stroke} />
          <rect x="30" y="22" width="40" height="7" fill={stroke} />
          <rect x="30" y="36" width="40" height="7" fill={stroke} />
          <path d="M32 70c0-10 36-10 36 0 0 10-36 10-36 0z" fill="none" stroke={stroke} strokeWidth="4" />
        </Frame>
      );
    case "ankh":
      return (
        <Frame>
          <circle cx="50" cy="32" r="12" fill="none" stroke={stroke} strokeWidth="4" />
          <rect x="46" y="44" width="8" height="38" fill={stroke} />
          <rect x="30" y="46" width="40" height="8" fill={stroke} />
        </Frame>
      );
    case "all-seeing-eye":
      return (
        <Frame>
          <polygon points="50,16 86,82 14,82" fill="none" stroke={stroke} strokeWidth="2.2" />
          <ellipse cx="50" cy="58" rx="16" ry="9" fill="none" stroke={ink} strokeWidth="2" />
          <circle cx="50" cy="58" r="4.5" fill={ink} />
        </Frame>
      );
    case "eye-of-horus":
      return (
        <Frame>
          <path d="M18 50 Q50 28 82 50 Q50 62 18 50" fill="none" stroke={ink} strokeWidth="2.4" />
          <circle cx="50" cy="50" r="8" fill="none" stroke={ink} strokeWidth="2" />
          <circle cx="50" cy="50" r="3.5" fill={ink} />
          <path d="M58 54 Q62 68 50 78" fill="none" stroke={ink} strokeWidth="2" />
          <path d="M62 56 L78 70" fill="none" stroke={ink} strokeWidth="2" />
        </Frame>
      );
    case "nazar-eye":
      return (
        <Frame>
          <circle cx="50" cy="50" r="30" fill="#1d4e89" />
          <circle cx="50" cy="50" r="20" fill="#f4f1ea" />
          <circle cx="50" cy="50" r="12" fill="#3d8fd1" />
          <circle cx="50" cy="50" r="5" fill={ink} />
        </Frame>
      );
    case "hamsa":
      return (
        <Frame>
          <path
            d="M50 18c4 0 6 8 6 14v8h6c2 0 4 2 4 5v10c0 16-8 28-16 32-8-4-16-16-16-32V45c0-3 2-5 4-5h6V32c0-6 2-14 6-14z"
            fill="#faf6ef"
            stroke={stroke}
            strokeWidth="2"
          />
          <circle cx="50" cy="52" r="6" fill="none" stroke={stroke} strokeWidth="1.6" />
          <circle cx="50" cy="52" r="2.2" fill={ink} />
        </Frame>
      );
    case "ouroboros":
      return (
        <Frame>
          <circle cx="50" cy="52" r="26" fill="none" stroke={stroke} strokeWidth="5" />
          <polygon points="50,20 58,32 42,32" fill={stroke} />
          <circle cx="46" cy="24" r="1.4" fill={cream} />
        </Frame>
      );
    case "caduceus":
      return (
        <Frame>
          <line x1="50" y1="18" x2="50" y2="86" stroke={ink} strokeWidth="3" />
          <path d="M50 34c-14 8-14 20 0 28 14-8 14-20 0-28z" fill="none" stroke={stroke} strokeWidth="2.2" />
          <path d="M50 42c-14 8-14 20 0 28 14-8 14-20 0-28z" fill="none" stroke={stroke} strokeWidth="2.2" />
          <path d="M42 18h16l-8 10z" fill={gold} />
        </Frame>
      );
    case "baphomet-pentagram":
      return (
        <Frame>
          <polygon
            points={pentagramPoints(50, 56, 28, 180)}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
          <ellipse cx="50" cy="48" rx="10" ry="12" fill="none" stroke={ink} strokeWidth="1.8" />
          <polygon points="38,40 32,22 42,36" fill="none" stroke={ink} strokeWidth="1.8" />
          <polygon points="62,40 68,22 58,36" fill="none" stroke={ink} strokeWidth="1.8" />
        </Frame>
      );
    case "thor-hammer":
      return (
        <Frame>
          <rect x="28" y="28" width="44" height="22" rx="2" fill={stroke} />
          <rect x="46" y="48" width="8" height="36" fill="#6b4a2a" />
        </Frame>
      );
    case "valknut":
      return (
        <Frame>
          <polygon points="50,20 68,52 32,52" fill="none" stroke={stroke} strokeWidth="3.2" />
          <polygon points="38,32 70,32 54,60" fill="none" stroke={stroke} strokeWidth="3.2" />
          <polygon points="30,44 62,44 46,76" fill="none" stroke={stroke} strokeWidth="3.2" />
        </Frame>
      );
    case "triple-moon":
      return (
        <Frame>
          <path d="M28 50a12 12 0 1 1 0 0.1" fill={gold} stroke={stroke} />
          <path d="M22 38a14 14 0 1 0 0 24 11 11 0 1 1 0-24z" fill={gold} stroke={stroke} />
          <path d="M78 38a14 14 0 1 1 0 24 11 11 0 1 0 0-24z" fill={gold} stroke={stroke} />
          <circle cx="50" cy="50" r="12" fill={gold} stroke={stroke} />
        </Frame>
      );
    case "skull":
      return (
        <Frame>
          <ellipse cx="50" cy="46" rx="22" ry="20" fill="#faf6ef" stroke={ink} strokeWidth="2" />
          <circle cx="42" cy="46" r="4" fill={ink} />
          <circle cx="58" cy="46" r="4" fill={ink} />
          <path d="M50 52v8" stroke={ink} strokeWidth="2" />
          <path d="M38 70h24M42 74h16M46 78h8" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </Frame>
      );
    case "circle-ring":
      return (
        <Frame>
          <circle cx="50" cy="50" r="22" fill="none" stroke={gold} strokeWidth="8" />
          <circle cx="50" cy="50" r="22" fill="none" stroke={stroke} strokeWidth="1.2" />
        </Frame>
      );
    case "pyramid-eye":
      return (
        <Frame>
          <polygon points="50,18 86,82 14,82" fill="none" stroke={stroke} strokeWidth="2" />
          <line x1="28" y1="62" x2="72" y2="62" stroke={stroke} strokeWidth="1.4" />
          <ellipse cx="50" cy="48" rx="10" ry="6" fill="none" stroke={ink} strokeWidth="1.6" />
          <circle cx="50" cy="48" r="2.4" fill={ink} />
        </Frame>
      );
    case "masonic-square":
      return (
        <Frame>
          <path d="M28 28v40h12V40h28V28H28z" fill="none" stroke={stroke} strokeWidth="3.2" strokeLinejoin="round" />
          <path d="M36 72 L72 28" fill="none" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="58" cy="52" r="6" fill="none" stroke={gold} strokeWidth="2" />
        </Frame>
      );
    case "obelisk":
      return (
        <Frame>
          <polygon points="50,12 62,28 62,86 38,86 38,28" fill="#d8c9a8" stroke={ink} strokeWidth="1.5" />
          <polygon points="50,12 62,28 38,28" fill={gold} stroke={ink} strokeWidth="1.2" />
        </Frame>
      );
    case "number-666":
      return (
        <Frame>
          <text x="50" y="58" textAnchor="middle" fontSize="22" fontFamily="Georgia, serif" fill={stroke} fontWeight="700">
            666
          </text>
        </Frame>
      );
    case "egg-hare":
      return (
        <Frame>
          <ellipse cx="42" cy="58" rx="14" ry="20" fill="#faf6ef" stroke={stroke} strokeWidth="2" />
          <ellipse cx="64" cy="62" rx="10" ry="8" fill="#e8ddc7" stroke={ink} strokeWidth="1.4" />
          <ellipse cx="60" cy="40" rx="3" ry="10" fill="#e8ddc7" stroke={ink} strokeWidth="1.2" />
          <ellipse cx="70" cy="40" rx="3" ry="10" fill="#e8ddc7" stroke={ink} strokeWidth="1.2" />
        </Frame>
      );
    case "janus-door":
      return (
        <Frame>
          <rect x="30" y="20" width="40" height="60" rx="2" fill="none" stroke={stroke} strokeWidth="2.5" />
          <line x1="50" y1="20" x2="50" y2="80" stroke={stroke} strokeWidth="2" />
          <circle cx="40" cy="50" r="7" fill="none" stroke={ink} strokeWidth="1.6" />
          <circle cx="60" cy="50" r="7" fill="none" stroke={ink} strokeWidth="1.6" />
        </Frame>
      );
    case "cupid-heart":
      return (
        <Frame>
          <path
            d="M50 78 C20 58 18 34 32 26c8-5 14-2 18 6 4-8 10-11 18-6 14 8 12 32-18 52z"
            fill={stroke}
          />
          <line x1="22" y1="22" x2="78" y2="78" stroke={gold} strokeWidth="2.2" />
          <polygon points="78,78 68,70 74,64" fill={gold} />
        </Frame>
      );
    case "maypole":
      return (
        <Frame>
          <line x1="50" y1="16" x2="50" y2="84" stroke="#6b4a2a" strokeWidth="4" />
          <circle cx="50" cy="18" r="6" fill={gold} />
          <path d="M50 22 Q28 50 22 84" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M50 22 Q72 50 78 84" fill="none" stroke={stroke} strokeWidth="2" />
        </Frame>
      );
    default:
      return (
        <Frame>
          <circle cx="50" cy="50" r="12" fill="none" stroke={stroke} strokeWidth="2" />
        </Frame>
      );
  }
}
