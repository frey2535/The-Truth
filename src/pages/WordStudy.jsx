import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Languages, Loader2, Save, Check } from "lucide-react";

export default function WordStudy() {
  const [params] = useSearchParams();
  const [word, setWord] = useState(params.get("word") || "");
  const [reference, setReference] = useState(params.get("ref") || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState([]);
  const [justSaved, setJustSaved] = useState(false);

  async function loadSaved() {
    try {
      const r = await base44.entities.WordStudy.list("-created_date", 20);
      setSaved(r || []);
    } catch {
      /* ignore */
    }
  }
  useEffect(() => {
    loadSaved();
  }, []);

  async function handleDefine(e, preset) {
    e?.preventDefault();
    const w = (preset || word).trim();
    if (!w || loading) return;
    setWord(w);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await base44.functions.invoke("define_word", {
        word: w,
        reference: reference.trim(),
      });
      if (res.data?.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = params.get("word");
    if (initial) handleDefine(null, initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!result) return;
    try {
      await base44.entities.WordStudy.create({
        word: word.trim(),
        reference: reference.trim(),
        ...result,
      });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      loadSaved();
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Word Study</h1>
        <p className="text-[#5b5142]">
          Definition and etymology from Strong's (1890), stored in this app, plus every loaded verse that uses the word.
        </p>
      </header>

      <form onSubmit={handleDefine} className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Word (e.g. grace, repent, soul)"
          className="flex-1 h-11 bg-white border-[#e8ddc7]"
          disabled={loading}
        />
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Reference (optional)"
          className="sm:w-48 h-11 bg-white border-[#e8ddc7]"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="h-11 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Languages className="w-4 h-4 mr-2" /> Look up</>}
        </Button>
      </form>

      {error && <p className="text-[#7a2e2e] text-sm mb-4">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-3xl text-[#2b2620] capitalize">{word}</h2>
            <Button onClick={handleSave} variant="outline" className="border-[#b08d3c]/40 text-[#7a2e2e]">
              {justSaved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : <><Save className="w-4 h-4 mr-2" /> Save study</>}
            </Button>
          </div>
          <dl className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Language and Strong's</dt>
                <dd className="text-[#3a3328] mt-1">{result.original_language}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Original form</dt>
                <dd className="font-display text-xl text-[#2b2620] mt-1">{result.original_word || "—"}</dd>
              </div>
            </div>
            {result.etymology && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Etymology</dt>
                <dd className="text-[#3a3328] mt-1 leading-relaxed">{result.etymology}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Strong's meaning</dt>
              <dd className="text-[#3a3328] mt-1 leading-relaxed">{result.definition}</dd>
            </div>
            {result.verses && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Verses in this app</dt>
                <dd className="text-[#3a3328] mt-1 whitespace-pre-wrap leading-relaxed">{result.verses}</dd>
              </div>
            )}
            {result.era_context && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Source</dt>
                <dd className="text-[#6b6155] mt-1 text-sm">{result.era_context}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {saved.length > 0 && (
        <section>
          <h3 className="font-display text-2xl text-[#2b2620] mb-4">Saved word studies</h3>
          <div className="space-y-2">
            {saved.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-[#e8ddc7] bg-white/60 px-4 py-3"
              >
                <div>
                  <span className="font-display text-lg text-[#2b2620] capitalize">{s.word}</span>
                  {s.reference && <span className="text-sm text-[#8a7f6f] ml-2">· {s.reference}</span>}
                </div>
                <span className="text-xs text-[#8a7f6f]">{s.original_language}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
