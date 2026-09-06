import React, { useState } from "react";
import { Landmark, Globe, FlaskConical, Building2, X, ExternalLink, ScrollText } from "lucide-react";

const KIND_ICON = {
  evidence: Landmark,
  modern: Globe,
  scientific: FlaskConical,
  government: Building2,
};

function Row({ item, kind }) {
  const isModern = kind === "modern";
  const isGov = kind === "government";
  const isSci = kind === "scientific";
  const ref = isModern ? item.prophecy_reference : item.scripture_reference;
  const meta = isModern
    ? item.modern_date
    : isGov
    ? item.date
    : isSci
    ? item.publication || item.date
    : item.era;
  const link = isGov
    ? item.document_url || item.source_url
    : isSci
    ? item.article_url || item.source_url
    : item.source_url;
  const Icon = KIND_ICON[kind] || Landmark;
  return (
    <a
      href={link || "#"}
      target={link ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
    >
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 text-[#b08d3c] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display text-base text-[#2b2620] leading-snug">{item.title}</h4>
            {link && <ExternalLink className="w-3.5 h-3.5 text-[#b08d3c] shrink-0 mt-1" />}
          </div>
          {ref && <p className="text-xs text-[#7a2e2e] mt-1">{ref}</p>}
          {meta && (
            <p className="text-xs text-[#8a7f6f] mt-0.5">
              {meta}
              {item.location ? ` · ${item.location}` : ""}
              {item.agency ? ` · ${item.agency}` : ""}
              {item.country ? ` · ${item.country}` : ""}
            </p>
          )}
          {item.description && (
            <p className="text-xs text-[#6b6155] mt-1.5 leading-relaxed line-clamp-3">{item.description}</p>
          )}
          {isGov && item.confirms_scripture && (
            <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#7a2e2e]/10 text-[#7a2e2e]">
              Confirms Scripture
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function Section({ icon: Icon, title, items, kind }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#8a7f6f] mb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h4>
      <div className="space-y-2.5">
        {items.map((it) => (
          <Row key={`${kind}-${it.id}`} item={it} kind={kind} />
        ))}
      </div>
    </section>
  );
}

export default function ChapterEvidencePanel({
  book,
  chapter,
  evidence = [],
  modern = [],
  scientific = [],
  government = [],
}) {
  const [open, setOpen] = useState(false);
  const count = evidence.length + modern.length + scientific.length + government.length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm text-[#5b5142] hover:bg-[#f3e9c8]/40 transition-colors"
      >
        <Landmark className="w-4 h-4" />
        Evidence
        {count > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#7a2e2e] text-[#f3e9c8] text-[10px] font-medium">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-[#faf6ef] border-l border-[#e8ddc7] shadow-xl flex flex-col">
            <header className="flex items-center justify-between px-4 py-3 border-b border-[#e8ddc7]">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#b08d3c]" />
                <h3 className="font-display text-lg text-[#2b2620]">
                  {book} {chapter}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-[#5b5142] hover:bg-[#f0e6d2]"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {count === 0 && (
                <div className="text-center py-10 px-2">
                  <p className="font-display text-lg text-[#2b2620] mb-1">No linked evidence yet</p>
                  <p className="text-sm text-[#8a7f6f] leading-relaxed">
                    No saved records reference {book} {chapter}. Use the Evidence, Modern, Science, and Gov
                    tabs to research this passage — once saved, results appear here automatically.
                  </p>
                </div>
              )}

              <Section icon={Landmark} title="Archaeological Evidence" items={evidence} kind="evidence" />
              <Section icon={Globe} title="Prophecy watch" items={modern} kind="modern" />
              <Section icon={FlaskConical} title="Scientific measurements" items={scientific} kind="scientific" />
              <Section icon={Building2} title="State and imperial records" items={government} kind="government" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}