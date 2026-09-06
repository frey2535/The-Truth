import React, { useState } from "react";
import EvidencePlate from "./EvidencePlate";

function overlayLine(item) {
  const ref = String(item.scripture_reference || item.prophecy_reference || "").split(";")[0].trim();
  const block = String(item.full_text || "");
  const quoted = block.match(/[“"]([^”"]{12,220})[”"]/);
  if (ref && quoted) return `${ref}: ${quoted[1]}`;
  if (quoted) return quoted[1];
  return ref;
}

function PhotoFigure({ src, caption, overlay, onBroken, tall, contain }) {
  const height = tall ? "max-h-80" : "max-h-56";
  const fit = contain ? "object-contain bg-[#1a1713]" : "object-cover";
  return (
    <figure className="mb-3 overflow-hidden rounded-2xl border border-[#d8c9a8] bg-[#2b2620]">
      <div className="relative">
        <img
          src={src}
          alt={caption || ""}
          className={`w-full ${fit} ${height}`}
          onError={onBroken}
        />
        {overlay ? (
          <p className="absolute bottom-0 inset-x-0 m-0 px-3 py-2 text-[11px] leading-snug text-[#f3e9c8] bg-[#2b2620]/80">
            {overlay}
          </p>
        ) : null}
      </div>
      <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[#f3e9c8]/80">
        {caption ||
          "Public-domain photograph stored in this app, shown with the published wording below. This is not a fabricated picture of an unpublished object."}
      </figcaption>
    </figure>
  );
}

export default function EvidenceVisual({ item }) {
  const extras = Array.isArray(item.extra_images) ? item.extra_images : [];
  const src = item.local_image || item.image_url;
  const [broken, setBroken] = useState(false);
  const [brokenExtras, setBrokenExtras] = useState({});
  if (!src || broken) return <EvidencePlate item={item} />;
  const line = overlayLine(item);
  return (
    <div className="mb-4">
      <PhotoFigure
        src={src}
        caption={item.image_caption}
        overlay={item.image_fit === "contain" ? "" : line}
        tall
        contain={item.image_fit === "contain"}
        onBroken={() => setBroken(true)}
      />
      {extras.length > 0 ? (
        <div className={extras.length > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
          {extras.map((photo, index) => {
            const extraSrc = photo.local_image || photo.image_url;
            if (!extraSrc || brokenExtras[index]) return null;
            return (
              <PhotoFigure
                key={`${extraSrc}-${index}`}
                src={extraSrc}
                caption={photo.image_caption}
                contain={photo.image_fit === "contain"}
                onBroken={() => setBrokenExtras((prev) => ({ ...prev, [index]: true }))}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
