import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { BIBLE_VERSIONS } from "@/data/bibleVersions";
import {
  CATALOG_SECTIONS,
  TEXT_STATUS,
  searchCatalog,
  worksInSection,
} from "@/data/textCatalog";
import ClassificationBadge from "./ClassificationBadge";

export default function CatalogBrowser({ onOpenWork }) {
  const [query, setQuery] = useState("");
  const [sectionId, setSectionId] = useState(null);

  const works = useMemo(() => {
    return query.trim() ? searchCatalog(query) : sectionId ? worksInSection(sectionId) : searchCatalog("");
  }, [query, sectionId]);

  const section = CATALOG_SECTIONS.find((s) => s.id === sectionId);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Stored Christian Text Library</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Every work listed here has English stored in this published app. Anyone who opens the site reads the
          same wording from the app, not from one person’s computer. Titles without stored wording are not shown.
          A church’s rejection does not remove a stored text. Nothing is invented to fill a gap.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
          <h2 className="font-display text-xl text-[#2b2620] mb-1">Holy Bible versions</h2>
          <p className="text-sm text-[#6b6155] mb-3">
            Older complete English only. Download or read. NIV and other modern shortened Bibles are not here.
          </p>
          <div className="flex flex-col gap-2">
            {BIBLE_VERSIONS.map((version) => (
              <Link
                key={version.id}
                to={version.id === "kjv" ? "/library?corpus=bible" : `/library?corpus=bible&version=${version.id}`}
                className="text-sm text-[#7a2e2e] hover:underline"
              >
                {version.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          to="/library?corpus=ane"
          className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4 hover:border-[#b08d3c]/60"
        >
          <h2 className="font-display text-xl text-[#2b2620] mb-1">Epic of Gilgamesh</h2>
          <p className="text-sm text-[#6b6155]">
            Old Babylonian version, Jastrow and Clay, 1920. Mesopotamian poem stored for comparison — not Scripture.
          </p>
        </Link>
      </div>

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
        <span className="text-xs text-[#8a7f6f] self-center">{works.length} stored works</span>
      </div>

      {!query.trim() && !sectionId ? (
        <div className="space-y-3">
          {CATALOG_SECTIONS.map((s) => {
            const n = worksInSection(s.id).length;
            if (!n) return null;
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
                <p className="text-sm text-[#5b5142] mt-2 leading-relaxed">
                  Open to read the stored wording from the start of the work.
                </p>
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
