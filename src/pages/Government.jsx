import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import GovernmentCard from "@/components/study/GovernmentCard";
import EvidenceSectionNav from "@/components/evidence/EvidenceSectionNav";
import { ARCHIVE_NOTICE, archiveByKind, searchArchive } from "@/data/inAppArchive";

const TYPES = [
  "all",
  "published_document",
  "historical_record",
  "manuscript",
  "other",
];

const TYPE_LABELS = {
  all: "All documents",
  published_document: "Published docs",
  historical_record: "Historical records",
  manuscript: "Manuscripts",
  other: "Other",
};

export default function Government() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const items = useMemo(
    () => (query.trim() ? searchArchive(query, "government") : archiveByKind("government")),
    [query]
  );
  const filtered = typeFilter === "all" ? items : items.filter((e) => e.document_type === typeFilter);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Dated public records</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Contemporaneous letters, chronicles, and state papers stored in this app. Doctrine and unpublished
          archives are not held as evidence.
        </p>
        <p className="text-[#8a7f6f] text-sm max-w-2xl mx-auto mt-3">{ARCHIVE_NOTICE}</p>
      </header>
      <EvidenceSectionNav />

      <div className="max-w-xl mx-auto mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stored documents (e.g. Pilate, Balfour, Trent, Trajan)"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              typeFilter === t
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {TYPE_LABELS[t] || t.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-10 h-10 text-[#d8c9a8] mx-auto mb-3" />
          <p className="text-[#8a7f6f]">No stored document matches that wording.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((it) => (
            <GovernmentCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
