import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";

export default function PlanCard({ plan }) {
  return (
    <Link
      to={`/plan/${plan.id}`}
      className="group block rounded-2xl border border-[#e8ddc7] bg-white/70 hover:bg-white hover:border-[#b08d3c]/50 transition-all p-5 shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-2xl text-[#2b2620] capitalize truncate">{plan.topic}</h3>
          <p className="text-xs text-[#8a7f6f] mt-1">
            {new Date(plan.created_date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-[#b08d3c] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <span className="text-sm text-[#5b5142]">
          {plan.status === "researching" ? (
            <span className="inline-flex items-center gap-1.5 text-[#b08d3c]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Researching…
            </span>
          ) : plan.status === "failed" ? (
            <span className="text-[#7a2e2e]">Research failed</span>
          ) : (
            <span>{plan.verse_count} passage{plan.verse_count === 1 ? "" : "s"}</span>
          )}
        </span>
      </div>
    </Link>
  );
}