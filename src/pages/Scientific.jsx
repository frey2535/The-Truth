import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { FlaskConical } from "lucide-react";
import ScientificCard from "@/components/study/ScientificCard";
import { ARCHIVE_NOTICE, SCIENCE, searchArchive } from "@/data/inAppArchive";

export default function Scientific() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => (query.trim() ? searchArchive(query, "science") : SCIENCE), [query]);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Scientific Records</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Measured government science (USGS, NOAA, NASA, NIH, CDC) and published excavation measurements,
          stored in this app. No verdict is added.
        </p>
        <p className="text-[#8a7f6f] text-sm max-w-2xl mx-auto mt-3">{ARCHIVE_NOTICE}</p>
      </header>

      <div className="max-w-xl mx-auto mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stored science (e.g. fossils, sulfur, water cycle, Jericho)"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <FlaskConical className="w-10 h-10 text-[#d8c9a8] mx-auto mb-3" />
          <p className="text-[#8a7f6f]">No stored scientific record matches that wording.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <ScientificCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
