import React, { useState } from "react";
import SymbolGlyph from "./SymbolGlyph";

export default function SymbolPhoto({ id, glyph, title, className = "" }) {
  const [failed, setFailed] = useState(false);
  const type = glyph || id;

  if (failed) {
    return (
      <div className={className}>
        <SymbolGlyph type={type} />
      </div>
    );
  }

  return (
    <img
      src={`/symbols/${id}.png`}
      alt={title || ""}
      className={`w-full h-full object-cover rounded-xl ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
