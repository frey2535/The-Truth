import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Scroll,
  Landmark,
  Globe,
  FlaskConical,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  X,
} from "lucide-react";

const EXAMPLES = [
  "resurrection",
  "covenant",
  "Messiah",
  "repent",
  "Pontius Pilate",
  "Exodus",
];

const TIER_COLOR = {
  A: "bg-[#2e6b3a]/10 text-[#2e6b3a]",
  B: "bg-[#2b5a8a]/10 text-[#2b5a8a]",
  C: "bg-[#b08d3c]/15 text-[#7a5e1a]",
  D: "bg-[#8a7f6f]/15 text-[#5b5142]",
  E: "bg-[#7a2e2e]/10 text-[#7a2e2e]",
};

function SourceRow({ s }) {
  const tier = (s.tier || "E").charAt(0);
  return (
    <a
      href={s.url || "#"}
      target={s.url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h5 className="font-display text-base text-[#2b2620] leading-snug">{s.title || "Untitled source"}</h5>
        <div className="flex items-center gap-1.5 shrink-0">
          {s.url && <ExternalLink className="w-3.5 h-3.5 text-[#b08d3c]" />}
          {tier && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${TIER_COLOR[tier] || TIER_COLOR.E}`}>
              {tier}
            </span>
          )}
        </div>
      </div>
      {s.type && <p className="text-xs text-[#8a7f6f] mt-1">{s.type}</p>}
    </a>
  );
}

function EvidenceSection({ icon: Icon, title, items, refKey }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h3 className="flex items-center gap-2 font-display text-xl text-[#2b2620] mb-3">
        <Icon className="w-5 h-5 text-[#b08d3c]" /> {title}
      </h3>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="p-4 rounded-xl border border-[#e8ddc7] bg-white/70">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-lg text-[#2b2620]">{it.title || "Untitled"}</h4>
              {it[refKey] && <span className="text-xs text-[#7a2e2e] shrink-0">{it[refKey]}</span>}
            </div>
            {(it.author || it.date || it.era || it.field || it.location) && (
              <p className="text-xs text-[#8a7f6f] mt-1">
                {[it.author, it.date || it.era, it.field, it.location].filter(Boolean).join(" · ")}
              </p>
            )}
            {it.description && (
              <p className="text-sm text-[#6b6155] mt-2 leading-relaxed">{it.description}</p>
            )}
            {it.source_url && (
              <a
                href={it.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#7a2e2e] hover:underline mt-2"
              >
                <ExternalLink className="w-3 h-3" /> View primary source
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ListSection({ icon: Icon, title, items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h3 className="flex items-center gap-2 font-display text-xl text-[#2b2620] mb-3">
        <Icon className="w-5 h-5" style={{ color }} /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-[#3a3328] leading-relaxed">
            <span className="shrink-0 mt-1">
              <Icon className="w-4 h-4" style={{ color }} />
            </span>
            <span>{typeof it === "string" ? it : it.position ? `${it.position}: ${it.summary}` : JSON.stringify(it)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Investigate() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);

  async function run(q) {
    const term = (q || query).trim();
    if (!term || loading) return;
    setQuery(term);
    setLoading(true);
    setError("");
    setDossier(null);
    setCancelled(false);
    try {
      const res = await base44.functions.invoke("investigate_claim", { query: term });
      if (cancelled) return;
      if (res?.error) throw new Error(res.error);
      setDossier(res.dossier || res);
    } catch (err) {
      if (!cancelled) setError(err.message || "Could not build the dossier. Please try again.");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  function stop() {
    setCancelled(true);
    setLoading(false);
  }

  const c = dossier?.conclusion || {};

  return (
    <div>
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7a2e2e]/10 text-[#7a2e2e] text-xs font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Free search of the texts in this app
        </div>
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Investigate a Claim</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Enter a person, place, word, or topic. The app quotes matching wording from every Christian
          text and published record stored here. It does not search the internet or give a verdict.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-6"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. resurrection · covenant · Pontius Pilate"
          className="flex-1 h-12 bg-white border-[#e8ddc7] text-[#2b2620]"
          disabled={loading}
        />
        {loading ? (
          <Button type="button" onClick={stop} className="h-12 px-6 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]">
            <X className="w-4 h-4 mr-2" /> Stop
          </Button>
        ) : (
          <Button type="submit" className="h-12 px-6 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]">
            <Search className="w-4 h-4 mr-2" /> Investigate
          </Button>
        )}
      </form>

      {!dossier && !loading && !error && (
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wide text-[#8a7f6f] mb-3 text-center">Try an example</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => run(ex)}
                className="px-3 py-1.5 rounded-full border border-[#e8ddc7] bg-white/70 text-sm text-[#5b5142] hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#b08d3c] mx-auto mb-3" />
          <p className="text-[#5b5142]">Searching the texts and quoting what they say…</p>
          <p className="text-[#8a7f6f] text-sm mt-1">Searching the texts in this app. First search may take a moment to load the books.</p>
        </div>
      )}

      {error && <p className="text-center text-[#7a2e2e] py-10">{error}</p>}

      {dossier && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="p-5 rounded-2xl border border-[#b08d3c]/40 bg-[#f3e9c8]/40">
            <p className="text-xs uppercase tracking-wide text-[#7a5e1a] mb-1">Verdict</p>
            <p className="font-display text-xl text-[#2b2620]">{dossier.verdict || "—"}</p>
          </div>

          <EvidenceSection icon={BookOpen} title="Biblical Record" items={dossier.biblical_record} refKey="reference" />
          <EvidenceSection icon={Scroll} title="Manuscript Evidence" items={dossier.manuscript_evidence} refKey="date" />
          <EvidenceSection icon={Landmark} title="Archaeological Evidence" items={dossier.archaeological_evidence} refKey="era" />
          <EvidenceSection icon={Globe} title="Historical Evidence" items={dossier.historical_evidence} refKey="date" />
          <EvidenceSection icon={FlaskConical} title="Scientific Evidence" items={dossier.scientific_evidence} refKey="field" />
          <EvidenceSection icon={Building2} title="Prophecy Evidence" items={dossier.prophecy_evidence} refKey="reference" />

          <div className="grid sm:grid-cols-2 gap-6">
            <ListSection icon={CheckCircle2} title="Supporting Evidence" items={dossier.supporting_evidence} color="#2e6b3a" />
            <ListSection icon={XCircle} title="Challenging Evidence" items={dossier.challenging_evidence} color="#7a2e2e" />
          </div>
          <ListSection icon={AlertTriangle} title="Alternative Interpretations" items={dossier.alternative_interpretations} color="#b08d3c" />
          <ListSection icon={FileText} title="Scholarly Positions" items={dossier.scholarly_positions} color="#5b5142" />

          {dossier.primary_sources && dossier.primary_sources.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 font-display text-xl text-[#2b2620] mb-3">
                <FileText className="w-5 h-5 text-[#b08d3c]" /> Primary Sources
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {dossier.primary_sources.map((s, i) => (
                  <SourceRow key={i} s={s} />
                ))}
              </div>
            </section>
          )}

          <section className="p-5 rounded-2xl border border-[#2b2620] bg-[#2b2620] text-[#f3e9c8]">
            <h3 className="font-display text-xl mb-4">Conclusion</h3>
            <div className="space-y-3 text-sm">
              {c.established?.length > 0 && (
                <p><span className="font-semibold text-[#9bd9a6]">Established:</span> {c.established.join(" · ")}</p>
              )}
              {c.strongly_supported?.length > 0 && (
                <p><span className="font-semibold text-[#c9d99b]">Strongly supported:</span> {c.strongly_supported.join(" · ")}</p>
              )}
              {c.disputed?.length > 0 && (
                <p><span className="font-semibold text-[#e9c98a]">Disputed:</span> {c.disputed.join(" · ")}</p>
              )}
              {c.cannot_demonstrate?.length > 0 && (
                <p><span className="font-semibold text-[#e9a9a9]">Cannot demonstrate:</span> {c.cannot_demonstrate.join(" · ")}</p>
              )}
              {c.summary && <p className="pt-2 border-t border-[#f3e9c8]/20 italic">{c.summary}</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}