import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { SEARCH_CORPORA } from "@/lib/localCorpusSearch";
import { libraryHref } from "@/lib/libraryLinks";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [corpus, setCorpus] = useState(params.get("corpus") || "canon");
  const [matches, setMatches] = useState([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastKey = useRef("");
  const chosen = useMemo(() => SEARCH_CORPORA.find((c) => c.id === corpus), [corpus]);

  async function run(e, preset, presetCorpus) {
    e?.preventDefault();
    const q = (preset || query).trim();
    const nextCorpus = presetCorpus || corpus;
    if (presetCorpus) setCorpus(presetCorpus);
    if (!q || loading) return;
    const key = `${nextCorpus}|${q}`;
    lastKey.current = key;
    setParams({ q, corpus: nextCorpus });
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("search_texts", { query: q, corpus: nextCorpus });
      if (res.data?.error) throw new Error(res.data.error);
      setMatches(res.data?.matches || []);
      setLabel(res.data?.label || chosen?.label || "");
    } catch (err) {
      setError(err.message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = params.get("q") || "";
    const c = params.get("corpus") || "canon";
    setQuery(q);
    setCorpus(c);
    if (q && lastKey.current !== `${c}|${q}`) run(null, q, c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Search a text</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Search inside one corpus at a time — the Holy Bible, the Apocrypha, Enoch, the Scrolls, the
          fathers, Josephus, or the stored records. Results quote only what is in this app.
        </p>
      </header>

      <form onSubmit={run} className="max-w-3xl mx-auto space-y-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {SEARCH_CORPORA.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCorpus(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                corpus === c.id
                  ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                  : "bg-white/70 text-[#5b5142] border-[#e8ddc7]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search inside ${chosen?.label || "this text"}`}
            className="flex-1 h-12 bg-white border-[#e8ddc7]"
          />
          <Button type="submit" disabled={loading} className="h-12 px-6 bg-[#2b2620] text-[#f3e9c8]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><SearchIcon className="w-4 h-4 mr-2" /> Search</>}
          </Button>
        </div>
      </form>
      {error && <p className="text-center text-[#7a2e2e] mb-4">{error}</p>}
      {!loading && matches.length > 0 && (
        <p className="text-center text-sm text-[#8a7f6f] mb-4">
          {matches.length} match{matches.length === 1 ? "" : "es"} in {label}
        </p>
      )}
      <div className="space-y-3 max-w-3xl mx-auto">
        {matches.map((m) => (
          <article key={`${m.reference}-${m.source}-${m.chapter}`} className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
            <p className="text-sm font-medium text-[#7a2e2e]">
              <Link
                to={libraryHref({ book: m.book, chapter: m.chapter, source: m.source, reference: m.reference })}
                className="hover:underline"
              >
                {m.reference}
              </Link>{" "}
              <span className="text-[10px] uppercase tracking-wide text-[#8a7f6f]">{m.source}</span>
            </p>
            <p className="text-[#2b2620] leading-relaxed mt-1">{m.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
