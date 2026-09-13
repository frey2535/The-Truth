import React from "react";
import { romanNumeral } from "@/lib/romanNumeral";

export default function ManuscriptPage({ book, chapter, children }) {
  const heading = [book, chapter ? romanNumeral(chapter) : ""].filter(Boolean).join("  ·  ");
  return (
    <article className="manuscript-leaf" aria-label={heading || "Manuscript page"}>
      <div className="manuscript-leaf-wear" aria-hidden="true" />
      <div className="manuscript-leaf-frame">
        {heading ? (
          <header className="manuscript-leaf-head">
            <p className="manuscript-leaf-running">{heading}</p>
          </header>
        ) : null}
        <div className="manuscript-leaf-body">{children}</div>
      </div>
    </article>
  );
}
