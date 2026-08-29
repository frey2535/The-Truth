import React, { useState } from "react";
import { Landmark, Globe, FlaskConical, Building2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const KIND_META = {
  evidence: { icon: Landmark, label: "archaeological" },
  modern: { icon: Globe, label: "modern fulfillment" },
  scientific: { icon: FlaskConical, label: "scientific" },
  government: { icon: Building2, label: "government" },
};

function Row({ item }) {
  const kind = item._kind;
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
  const Icon = KIND_META[kind]?.icon || Landmark;
  return (
    <a
      href={link || "#"}
      target={link ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 transition-colors"
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
            <p className="text-xs text-[#6b6155] mt-1.5 leading-relaxed">{item.description}</p>
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

export default function VerseEvidenceBadge({ verse, items }) {
  const [open, setOpen] = useState(false);
  if (!items || items.length === 0) return null;
  const counts = {};
  items.forEach((i) => {
    counts[i._kind] = (counts[i._kind] || 0) + 1;
  });
  const summary = Object.keys(counts)
    .map((k) => `${counts[k]} ${KIND_META[k]?.label || k}`)
    .join(" · ");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={summary}
        className="inline-flex items-center justify-center align-middle ml-1.5 px-1.5 py-0.5 rounded-full bg-[#f3e9c8]/60 border border-[#b08d3c]/40 text-[#7a5e1a] hover:bg-[#f3e9c8] transition-colors"
      >
        <Landmark className="w-3 h-3" />
        <span className="text-[10px] font-medium ml-0.5">{items.length}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#2b2620]">
              Evidence for {verse}
            </DialogTitle>
            <DialogDescription className="text-[#8a7f6f]">{summary}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
            {items.map((item) => (
              <Row key={`${item._kind}-${item.id}`} item={item} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}