import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import EvidenceSectionNav from "@/components/evidence/EvidenceSectionNav";
import HolidayEvidenceCard from "@/components/evidence/HolidayEvidenceCard";
import { CUSTOMS, CUSTOM_SECTIONS } from "@/data/inheritedCustoms";
import { OCCULT_SYMBOLS, SYMBOL_SECTIONS } from "@/data/occultSymbols";
import { ADVERSARY_NAMES, NAME_SECTIONS } from "@/data/adversaryNames";
import { photoIdForHolidayItem } from "@/data/holidayEvidencePhotos";

const KINDS = [
  { id: "all", label: "All categories" },
  { id: "custom", label: "Traditions" },
  { id: "symbol", label: "Symbols" },
  { id: "name", label: "Names" },
];

const GROUPS = [
  {
    kind: "custom",
    heading: "Traditions",
    sections: CUSTOM_SECTIONS,
    items: CUSTOMS,
    href: (id) => `/customs/${id}`,
  },
  {
    kind: "symbol",
    heading: "Symbols",
    sections: SYMBOL_SECTIONS,
    items: OCCULT_SYMBOLS,
    href: (id) => `/customs/symbol/${id}`,
  },
  {
    kind: "name",
    heading: "Names",
    sections: NAME_SECTIONS,
    items: ADVERSARY_NAMES,
    href: (id) => `/customs/name/${id}`,
  },
];

function matchesQuery(item, query) {
  if (!query) return true;
  const hay = `${item.title} ${item.card || ""}`.toLowerCase();
  return hay.includes(query);
}

export default function EvidenceHolidays() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      GROUPS.filter((g) => kindFilter === "all" || g.kind === kindFilter).map((g) => ({
        ...g,
        sections: g.sections
          .map((section) => ({
            ...section,
            items: g.items.filter((item) => item.section === section.id && matchesQuery(item, q)),
          }))
          .filter((section) => section.items.length > 0),
      })),
    [kindFilter, q]
  );

  const total = groups.reduce(
    (n, g) => n + g.sections.reduce((m, s) => m + s.items.length, 0),
    0
  );

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Holidays, symbols, and names</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Every tradition, sign, and name stored in Holidays, listed by category. Photographs are catalogued
          museum objects only. Where no matching object is stored, that fact is shown. Seals and invented
          portraits are not drawn.
        </p>
      </header>
      <EvidenceSectionNav />

      <div className="max-w-xl mx-auto mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traditions, symbols, or names"
          className="h-11 bg-white border-[#e8ddc7]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKindFilter(k.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              kindFilter === k.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <p className="text-center text-[#8a7f6f] py-16">Nothing matches that search.</p>
      ) : (
        groups.map((group) =>
          group.sections.length ? (
            <div key={group.kind} className="mb-12">
              <h2 className="font-display text-2xl text-[#2b2620] mb-6">{group.heading}</h2>
              {group.sections.map((section) => (
                <section key={section.id} className="mb-10">
                  <h3 className="font-display text-xl text-[#2b2620] mb-1">{section.title}</h3>
                  <p className="text-sm text-[#8a7f6f] mb-4 max-w-3xl">{section.blurb}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items.map((item) => (
                      <HolidayEvidenceCard
                        key={item.id}
                        title={item.title}
                        description={item.card}
                        to={group.href(item.id)}
                        photoId={photoIdForHolidayItem(group.kind, item)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null
        )
      )}
    </div>
  );
}
