import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, reportMailto } from "@/lib/contact";

export default function ReportIssue({ className = "", compact = false, pageTitle }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(event) {
    event.preventDefault();
    window.location.href = reportMailto({
      path: pathname,
      title: pageTitle || document.title || "The Truth",
      message,
    });
    setOpen(false);
    setMessage("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 ${className}`.trim()}
        title={`Report a problem to ${CONTACT_EMAIL}`}
      >
        <Flag className="w-3.5 h-3.5" />
        {compact ? "Report" : "Report a problem"}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-[#120c08]/50 p-4">
          <form
            onSubmit={send}
            className="w-full max-w-md rounded-2xl border border-[#e8ddc7] bg-[#faf6ef] p-5 shadow-xl"
            role="dialog"
            aria-labelledby="report-title"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 id="report-title" className="font-display text-2xl text-[#2b2620]">
                  Report a problem
                </h2>
                <p className="text-sm text-[#5b5142] mt-1">
                  Opens your email to {CONTACT_EMAIL}. The page address is included.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-[#8a7f6f]" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-sm text-[#2b2620]">
              What went wrong
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-[#e8ddc7] bg-white px-3 py-2 text-sm"
                placeholder="A short note is enough."
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2b2620] text-[#f3e9c8] hover:bg-[#3a3328]">
                Email report
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
