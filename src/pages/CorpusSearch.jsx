import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { SEARCH_CORPORA } from "@/lib/localCorpusSearch";

export default function CorpusSearch() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [corpus, setCorpus] = useState(params.get("corpus") || "canon");
  const [matches, setMatches] = useState([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(e, nextQ = query, nextC = corpus) {
    e?.preventDefault();
    const q = String(nextQ || "").trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setParams({ q, corpus: nextC });
    try {
      const res = await base44.functions.invoke("search_texts", { query: q, corpus: nextC });
      if (res.data?.error) throw new Error(res.data.error);
      setMatches(res.data?.matches || []);
      setLabel(res.data?.label || nextC);
    } catch (err) {
      setError(err.message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = params.get("q");
    if (q) run(null, q, params.get("corpus") || "canon");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Search a text</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Choose a corpus, then search only that text. Results are quoted from what is stored in this app.
        </p>
      </header>

      <form onSubmit={run} className="max-w-3xl mx-auto space-y-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
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
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Word or phrase"
            className="flex-1 h-12 bg-white border-[#e8ddc7]"
          />
          <Button type="submit" disabled={loading} className="h-12 px-6 bg-[#2b2620] text-[#f3e9c8]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Search</>}
          </Button>
        </div>
      </form>

      {error && <p className="text-center text-[#7a2e2e] mb-4">{error}</p>}
      {label && !loading && (
        <p className="text-center text-sm text-[#8a7f6f] mb-6">
          {matches.length} match{matches.length === 1 ? "" : "es"} in {label}
        </p>
      )}
      <div className="max-w-3xl mx-auto space-y-3">
        {matches.map((m, i) => (
          <article key={`${m.reference}-${i}`} className="truth-card p-4">
            <p className="text-xs uppercase tracking-wide text-[#b08d3c] mb-1">
              {m.source} · {m.reference}
            </p>
            <p className="text-[#2b2620] leading-relaxed">{m.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
