import React from "react";
import { evidencePhotoFor } from "@/data/holidayEvidencePhotos";

export default function SymbolPhoto({ id, title, className = "", showCaption = false }) {
  const photo = evidencePhotoFor(id);

  if (!photo) {
    return (
      <div
        className={`flex h-full min-h-[8rem] w-full items-center justify-center rounded-xl border border-[#d8c9a8] bg-[#f3e9c8]/70 px-3 text-center ${className}`}
      >
        <p className="text-[11px] leading-relaxed text-[#5b5142]">
          No photograph of a catalogued object is stored for this entry. The museum and official links are on the page.
        </p>
      </div>
    );
  }

  return (
    <figure className={`m-0 w-full ${className}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f3e9c8]">
        <img
          src={photo.src}
          alt={photo.caption || title || ""}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      {showCaption ? (
        <figcaption className="mt-2 text-[11px] leading-relaxed text-[#5b5142]">
          {photo.caption} {photo.credit}.{" "}
          <a href={photo.page} className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer">
            Open the catalog record
          </a>
          .
        </figcaption>
      ) : null}
    </figure>
  );
}
