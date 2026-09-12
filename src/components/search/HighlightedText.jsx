import React, { useMemo } from "react";
import { highlightTerms, splitHighlightedText } from "@/lib/searchHighlight";

export default function HighlightedText({ text, query, forms, exact = false, className = "" }) {
  const parts = useMemo(() => {
    const terms = exact ? highlightTerms(query, [], { exact: true }) : highlightTerms(query, forms);
    return splitHighlightedText(text, terms);
  }, [text, query, forms, exact]);

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.hit ? (
          <mark key={i} className="search-hit">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}
