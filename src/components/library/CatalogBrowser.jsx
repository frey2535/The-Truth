import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  CATALOG_SECTIONS,
  CATALOG_WORKS,
  TEXT_STATUS,
  searchCatalog,
  worksInSection,
} from "@/data/textCatalog";
import ClassificationBadge from "./ClassificationBadge";

export default function CatalogBrowser({ onOpenWork }) {
  const [query, setQuery] = useState("");
  const [sectionId, setSectionId] = useState(null);
  const [storedOnly, setStoredOnly] = useState(false);

  const works = useMemo(() => {
    const base = query.trim() ? searchCatalog(query) : sectionId ? worksInSection(sectionId) : CATALOG_WORKS;
    return storedOnly ? base.filter((w) => w.stored) : base;
  }, [query, sectionId, storedOnly]);

  const section = CATALOG_SECTIONS.find((s) => s.id === sectionId);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Master Christian Text Library</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Every work on the master list is named here so you know it exists. A church’s rejection, a disputed author,
          or a “heretical” label does not remove a title. Noncanonical is not the same as false. Complete stored
          wording is marked. Missing wording is not invented.
        </p>
      </header>

      <div className="max-w-xl mx-auto mb-4">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setSectionId(null);
          }}
          placeholder="Search titles, alternate names, or labels"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setStoredOnly((v) => !v)}
          className={`px-3 py-1 rounded-full text-xs border ${
            storedOnly ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]" : "bg-white/60 text-[#5b5142] border-[#e8ddc7]"
          }`}
        >
          {storedOnly ? "Showing stored text only" : "Show stored text only"}
        </button>
        <span className="text-xs text-[#8a7f6f] self-center">{works.length} works</span>
      </div>

      {!query.trim() && !sectionId ? (
        <div className="space-y-3">
          {CATALOG_SECTIONS.map((s) => {
            const n = worksInSection(s.id).length;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSectionId(s.id)}
                className="w-full text-left p-4 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60"
              >
                <div className="flex justify-between gap-3">
                  <h2 className="font-display text-xl text-[#2b2620]">
                    {s.id}. {s.title}
                  </h2>
                  <span className="text-xs text-[#8a7f6f] shrink-0">{n}</span>
                </div>
                <p className="text-sm text-[#6b6155] mt-1">{s.blurb}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => {
              setSectionId(null);
              setQuery("");
            }}
            className="text-sm text-[#7a2e2e] hover:underline mb-4"
          >
            All sections
          </button>
          {section ? (
            <div className="mb-6">
              <h2 className="font-display text-2xl text-[#2b2620]">
                {section.id}. {section.title}
              </h2>
              <p className="text-sm text-[#5b5142] mt-1">{section.blurb}</p>
            </div>
          ) : null}
          <div className="grid sm:grid-cols-2 gap-3">
            {works.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onOpenWork(w.id)}
                className="text-left p-4 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60"
              >
                <h3 className="font-display text-lg text-[#2b2620]">{w.title}</h3>
                <p className="text-xs text-[#7a2e2e] mt-1">{TEXT_STATUS[w.textStatus]}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {w.labels.slice(0, 4).map((label) => (
                    <ClassificationBadge key={label} label={label} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
