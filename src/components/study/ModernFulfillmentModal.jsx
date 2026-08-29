import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarCheck, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ModernFulfillmentCard from "./ModernFulfillmentCard";

export default function ModernFulfillmentModal({ reference, topic }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    if (items) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("research_modern_fulfillment", { reference, topic });
      if (res.data?.error) throw new Error(res.data.error);
      setItems(res.data?.items || []);
    } catch (e) {
      setError(e.message || "Failed to research modern fulfillment.");
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
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6a4a7a] hover:underline mt-1"
      >
        <CalendarCheck className="w-3.5 h-3.5" /> Modern fulfillment & evidence
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#faf6ef]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#2b2620]">
              Modern Fulfillment & Evidence — {reference}
            </DialogTitle>
            <p className="text-sm text-[#8a7f6f]">
              Dated public records stored in this app. No prophetic verdict is added.
            </p>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-[#8a7f6f]">
              <Loader2 className="w-5 h-5 animate-spin" /> Researching modern evidence…
            </div>
          )}
          {error && <p className="text-sm text-[#7a2e2e] py-6 text-center">{error}</p>}
          {!loading && !error && items && items.length === 0 && (
            <p className="text-sm text-[#8a7f6f] py-6 text-center">
              No modern empirical evidence was found for this passage.
            </p>
          )}
          {!loading && !error && items && items.length > 0 && (
            <div className="space-y-4 pt-2">
              {items.map((it, i) => (
                <ModernFulfillmentCard key={i} item={it} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}