import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FlaskConical, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EvidenceCard from "./EvidenceCard";

export default function EvidenceModal({ reference, topic }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    if (evidence) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("research_evidence", { reference, topic });
      if (res.data?.error) throw new Error(res.data.error);
      setEvidence(res.data?.evidence || []);
    } catch (e) {
      setError(e.message || "Failed to research evidence.");
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
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7a2e2e] hover:underline mt-1"
      >
        <FlaskConical className="w-3.5 h-3.5" /> Empirical evidence for this passage
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#faf6ef]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#2b2620]">
              Empirical Evidence — {reference}
            </DialogTitle>
            <p className="text-sm text-[#8a7f6f]">
              Empirical holdings linked to this passage — excavated objects, inscriptions, and measured records.
            </p>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-[#8a7f6f]">
              <Loader2 className="w-5 h-5 animate-spin" /> Researching evidence…
            </div>
          )}
          {error && <p className="text-sm text-[#7a2e2e] py-6 text-center">{error}</p>}
          {!loading && !error && evidence && evidence.length === 0 && (
            <p className="text-sm text-[#8a7f6f] py-6 text-center">
              No empirical evidence is currently known for this passage.
            </p>
          )}
          {!loading && !error && evidence && evidence.length > 0 && (
            <div className="space-y-4 pt-2">
              {evidence.map((e, i) => (
                <EvidenceCard key={i} item={e} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}