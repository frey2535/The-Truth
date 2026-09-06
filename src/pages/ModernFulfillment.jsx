import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import ModernFulfillmentCard from "@/components/study/ModernFulfillmentCard";
import { ARCHIVE_NOTICE, MODERN, searchArchive } from "@/data/inAppArchive";

const STAGES = [
  { id: "all", label: "All records" },
  { id: "dated_event", label: "Dated events" },
  { id: "in_process", label: "In process" },
  { id: "setup", label: "End-time setup" },
];

const SECTIONS = [
  {
    id: "dated_event",
    title: "Dated events",
    lead: "These already happened as published state papers or dated public acts. They are shown beside the gathering and scattering texts. The app does not declare that the prophecy is closed.",
  },
  {
    id: "in_process",
    title: "In process",
    lead: "Measurable conditions that have not finished: return still under statute, Jerusalem still a UN quarrel, the gospel still going out. Jesus said of wars and rumours, “the end is not yet.”",
  },
  {
    id: "setup",
    title: "End-time setup",
    lead: "Present places, machines, and papers that later passages describe. Capability is not fulfillment. No date is set. No brand is named as the mark.",
  },
];

export default function ModernFulfillment() {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const items = useMemo(() => (query.trim() ? searchArchive(query, "modern") : MODERN), [query]);
  const filtered =
    stageFilter === "all" ? items : items.filter((i) => i.watch_stage === stageFilter);

  const sections = SECTIONS.map((section) => ({
    ...section,
    items: filtered.filter((i) => i.watch_stage === section.id),
  })).filter((section) => section.items.length > 0);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Prophecy watch</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Dated public records, ongoing measurements, and present conditions stored beside the King James
          wording. Each card is an article you can read and, where a catalogued picture exists, a photograph
          you can see. This app does not declare fulfillment.
        </p>
        <p className="text-[#8a7f6f] text-sm max-w-2xl mx-auto mt-3">{ARCHIVE_NOTICE}</p>
      </header>

      <div className="max-w-xl mx-auto mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stored records (e.g. Israel, Jerusalem, Ezekiel, Balfour)"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {STAGES.map((t) => (
          <button
            key={t.id}
            onClick={() => setStageFilter(t.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              stageFilter === t.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-10 h-10 text-[#d8c9a8] mx-auto mb-3" />
          <p className="text-[#8a7f6f]">No stored dated record matches that wording.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id}>
              <h2 className="font-display text-2xl text-[#2b2620] mb-2">{section.title}</h2>
              <p className="text-sm text-[#5b5142] max-w-3xl mb-5">{section.lead}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.items.map((i) => (
                  <ModernFulfillmentCard key={i.id} item={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
