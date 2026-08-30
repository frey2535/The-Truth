import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Landmark } from "lucide-react";
import EvidenceCard from "@/components/study/EvidenceCard";
import EvidenceSectionNav from "@/components/evidence/EvidenceSectionNav";
import { ARCHIVE_NOTICE, ARCHAEOLOGY, searchArchive } from "@/data/inAppArchive";

const TYPES = [
  "all",
  "artifact",
  "scroll",
  "inscription",
  "archaeological_site",
  "manuscript",
  "historical_record",
  "geological_record",
  "other",
];

const STATUSES = [
  { id: "all", label: "All status" },
  { id: "established", label: "Established" },
  { id: "established_contextual", label: "Contextual" },
  { id: "likely", label: "Likely" },
  { id: "disputed_identification", label: "Disputed ID" },
  { id: "reported", label: "Reported" },
];

export default function Evidence() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const evidence = useMemo(
    () => (query.trim() ? searchArchive(query, "archaeology") : ARCHAEOLOGY),
    [query]
  );
  const filtered = evidence.filter((e) => {
    if (typeFilter !== "all" && e.evidence_type !== typeFilter) return false;
    if (statusFilter !== "all" && e.evidence_status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Empirical Evidence</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Photographs are of the named artifact, inscription, manuscript, or excavated site when a catalogued
          picture is stored. Status is labeled on each card. Reported claims are kept and marked unverified —
          they are not stored as established fact.
        </p>
        <p className="text-[#8a7f6f] text-sm max-w-2xl mx-auto mt-3">{ARCHIVE_NOTICE}</p>
      </header>
      <EvidenceSectionNav />

      <div className="max-w-xl mx-auto mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stored records (e.g. Lot, Red Sea, brimstone, Pilate, fossils)"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
              typeFilter === t
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {t === "all" ? "All evidence" : t.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === s.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Landmark className="w-10 h-10 text-[#d8c9a8] mx-auto mb-3" />
          <p className="text-[#8a7f6f]">No stored record matches that wording.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((e) => (
            <EvidenceCard key={e.id} item={e} />
          ))}
        </div>
      )}
    </div>
  );
}
