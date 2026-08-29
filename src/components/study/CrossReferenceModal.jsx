import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SourceBadge from "./SourceBadge";

export default function CrossReferenceModal({ reference, topic }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refs, setRefs] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    if (refs) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("research_cross_references", { reference, topic });
      if (res.data?.error) throw new Error(res.data.error);
      setRefs(res.data?.references || []);
    } catch (e) {
      setError(e.message || "Failed to load cross-references.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          load();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5d52] hover:underline mt-1"
      >
        <Link2 className="w-3.5 h-3.5" /> Cross-references — also seen in other books
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#faf6ef]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#2b2620]">
              Cross-references — {reference}
            </DialogTitle>
            <p className="text-sm text-[#8a7f6f]">
              Parallel accounts, quotations, and allusions across the full corpus. Read and compare them side by side.
            </p>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-[#8a7f6f]">
              <Loader2 className="w-5 h-5 animate-spin" /> Finding cross-references…
            </div>
          )}
          {error && <p className="text-sm text-[#7a2e2e] py-6 text-center">{error}</p>}
          {!loading && !error && refs && refs.length === 0 && (
            <p className="text-sm text-[#8a7f6f] py-6 text-center">
              No cross-references were found for this passage.
            </p>
          )}
          {!loading && !error && refs && refs.length > 0 && (
            <div className="space-y-4 pt-2">
              {refs.map((r, i) => (
                <article key={i} className="rounded-xl border border-[#e8ddc7] bg-white/70 p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display text-lg text-[#2b2620]">{r.reference}</h3>
                    <SourceBadge source={r.source} />
                    {r.relationship && (
                      <span className="text-xs text-[#8a7f6f] italic">{r.relationship}</span>
                    )}
                  </div>
                  <p className="font-display text-lg leading-relaxed text-[#3a3328]">{r.text}</p>
                </article>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}