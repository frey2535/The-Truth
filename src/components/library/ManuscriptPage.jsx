import React, { useId } from "react";
import { romanNumeral } from "@/lib/romanNumeral";

export default function ManuscriptPage({ book, chapter, children }) {
  const tearId = `manuscript-tear-${useId().replace(/:/g, "")}`;
  const heading = [book, chapter ? romanNumeral(chapter) : ""].filter(Boolean).join("  ·  ");
  return (
    <article className="manuscript-leaf" aria-label={heading || "Manuscript page"}>
      <svg className="manuscript-clip" width="0" height="0" aria-hidden="true" focusable="false">
        <clipPath id={tearId} clipPathUnits="objectBoundingBox">
          <path d="M0.055 0.028 C0.12 0.004 0.2 0.02 0.28 0.012 C0.4 0.002 0.52 0.022 0.64 0.01 C0.74 0.002 0.84 0.018 0.91 0.03 C0.97 0.042 0.992 0.1 0.984 0.18 C0.996 0.3 0.97 0.42 0.988 0.54 C0.998 0.66 0.968 0.76 0.98 0.86 C0.99 0.93 0.94 0.985 0.86 0.99 C0.74 1 0.62 0.978 0.5 0.992 C0.38 1 0.26 0.976 0.16 0.988 C0.08 0.996 0.012 0.94 0.016 0.86 C0.002 0.74 0.028 0.62 0.01 0.5 C0.002 0.38 0.03 0.26 0.014 0.16 C0.006 0.1 0.02 0.046 0.055 0.028 Z" />
        </clipPath>
      </svg>
      <div className="manuscript-leaf-skin" style={{ clipPath: `url(#${tearId})` }}>
        <div className="manuscript-leaf-wear" aria-hidden="true" />
        <div className="manuscript-leaf-frame">
          {heading ? (
            <header className="manuscript-leaf-head">
              <p className="manuscript-leaf-running">{heading}</p>
            </header>
          ) : null}
          <div className="manuscript-leaf-body">{children}</div>
        </div>
      </div>
    </article>
  );
}
