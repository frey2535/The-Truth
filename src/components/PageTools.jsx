import React from "react";
import { Printer } from "lucide-react";
import ReportIssue from "@/components/ReportIssue";
import { printCurrentPage } from "@/lib/notebookExport";

export default function PageTools({ dark = false, pageTitle }) {
  const tone = dark
    ? "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#f3e9c8]/85 hover:underline"
    : "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#7a2e2e] hover:underline";
  return (
    <div className="page-tools flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      <button type="button" onClick={printCurrentPage} className={tone} title="Print this page">
        <Printer className="w-3.5 h-3.5" />
        Print
      </button>
      <ReportIssue className={tone} compact pageTitle={pageTitle} />
    </div>
  );
}
