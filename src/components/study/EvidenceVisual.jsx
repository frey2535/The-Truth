import React from "react";
import EvidencePlate from "./EvidencePlate";

function overlayLine(item) {
  const ref = String(item.scripture_reference || item.prophecy_reference || "").split(";")[0].trim();
  const block = String(item.full_text || "");
  const quoted = block.match(/[“"]([^”"]{12,220})[”"]/);
  if (ref && quoted) return `${ref}: ${quoted[1]}`;
  if (quoted) return quoted[1];
  return ref;
}

export default function EvidenceVisual({ item }) {
  const src = item.local_image || item.image_url;
  if (!src) return <EvidencePlate item={item} />;
  const line = overlayLine(item);
  return (
    <figure className="mb-4 overflow-hidden rounded-2xl border border-[#d8c9a8] bg-[#2b2620]">
      <div className="relative">
        <img
          src={src}
          alt={item.image_caption || item.title}
          className="w-full max-h-72 object-cover"
        />
        {line && (
          <p className="absolute bottom-0 inset-x-0 m-0 px-3 py-2 text-[11px] leading-snug text-[#f3e9c8] bg-[#2b2620]/80">
            {line}
          </p>
        )}
      </div>
      <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[#f3e9c8]/80">
        {item.image_caption ||
          "Public-domain photograph stored in this app, shown with the published wording below. This is not a fabricated picture of an unpublished object."}
      </figcaption>
    </figure>
  );
}
