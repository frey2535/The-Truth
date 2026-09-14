import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  ScrollText,
  Sparkles,
  BookOpenText,
  Microscope,
  GraduationCap,
  ArrowRight,
  Download,
  Moon,
  CalendarDays,
} from "lucide-react";
import PlanCard from "@/components/study/PlanCard";
import { loadReadingPosition, readingHref, readingLabel } from "@/lib/readingSession";

const ACTIONS = [
  { to: "/library", label: "Read", desc: "Open the wording stored in this published app — the same library for every reader", icon: BookOpenText },
  { to: "/search", label: "Search a text", desc: "Find every matching verse in every stored text and record", icon: Search },
  { to: "/map", label: "Biblical map", desc: "Places named in the texts on today's globe — journeys and kingdom outlines for study", icon: Sparkles },
  { to: "/calendar", label: "Calendar", desc: "See the appointed times — and the civil names that covered them", icon: CalendarDays },
  { to: "/notebook", label: "Notebook", desc: "Your plans, notes, highlights, and favorites", icon: GraduationCap },
  { to: "/word-study", label: "Word study", desc: "Strong's definition and etymology, plus the verses", icon: Microscope },
  { to: "/customs", label: "Pagan traditions and symbols", desc: "Christmas, Easter, Halloween, worn signs, and names Scripture gives the adversary", icon: Moon },
  { to: "/prophecy", label: "Prophecy", desc: "Dated records, in-process signs, and end-time setup stored beside the verses", icon: Sparkles },
  { to: "/evidence", label: "Evidence", desc: "Empirical finds only — inscriptions, excavations, and measured science", icon: ScrollText },
  { to: "/investigate", label: "Investigate", desc: "Quote every stored text and record for a claim", icon: Search },
  { to: "/assistant", label: "Ask", desc: "Answers quote only what is stored in this app", icon: Sparkles },
];

export default function Home() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);
  const [lastReading, setLastReading] = useState(loadReadingPosition);
  const continueHref = lastReading ? readingHref(lastReading) : "/library";
  const continueLabel = lastReading ? readingLabel(lastReading) : "";

  useEffect(() => {
    setLastReading(loadReadingPosition());
  }, []);

  async function loadPlans() {
    try {
      const r = await base44.entities.StudyPlan.list("-created_date", 6);
      setPlans(r || []);
    } catch {}
  }
  useEffect(() => {
    loadPlans();
  }, []);

  async function handleResearch(e) {
    e.preventDefault();
    const t = topic.trim();
    if (!t || busy) return;
    setBusy(true);
    setError("");
    try {
      const created = await base44.entities.StudyPlan.create({ topic: t, status: "researching" });
      navigate(`/plan/${created.id}`);
      base44.functions.invoke("research_topic", { topic: t, plan_id: created.id }).catch(() => {});
    } catch (err) {
      setError(err.message || "Could not start research. Please try again.");
      setBusy(false);
      loadPlans();
    }
  }

  return (
    <div>
      <div className="home-heaven-stage">
        <div className="home-heaven-clear" aria-hidden="true" />
        <h1 className="home-heaven-title">The Truth</h1>
      </div>
      <div className="home-below-heaven">
      <section className="text-center pb-6">
        <form onSubmit={handleResearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search Scripture and stored evidence — no internet"
            className="flex-1 h-10 bg-white/90 border-[#e8ddc7] text-[#2b2620] text-sm shadow-md"
            disabled={busy}
          />
          <Button type="submit" disabled={busy} className="h-10 px-4 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]">
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Researching…
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" /> Research
              </>
            )}
          </Button>
        </form>
        {error && <p className="text-[#7a2e2e] text-sm mt-3">{error}</p>}
        <div className="mt-3 flex flex-col items-center gap-2">
          {continueLabel ? (
            <Link
              to={continueHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e9c8] text-[#2b2620] px-3.5 py-1.5 text-xs font-medium shadow hover:bg-white"
            >
              <BookOpenText className="w-3.5 h-3.5" />
              Continue reading {continueLabel}
            </Link>
          ) : (
            <Link
              to="/library?corpus=bible&book=John&chapter=8"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e9c8] text-[#2b2620] px-3.5 py-1.5 text-xs font-medium shadow hover:bg-white"
            >
              <BookOpenText className="w-3.5 h-3.5" />
              Open John 8
            </Link>
          )}
          <Link
            to="/install"
            className="inline-flex items-center gap-1.5 text-xs text-[#5b5142] hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            Install on a phone or computer
          </Link>
        </div>
        {busy && (
          <p className="text-[#8a7f6f] text-xs mt-3">
            Searching every text and published record stored in this app. First search may take a moment while the books load.
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 mb-8">
        {ACTIONS.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to === "/library" && continueLabel ? continueHref : to}
            className="group text-left p-3 rounded-xl border border-[#e8ddc7] bg-white/90 hover:border-[#b08d3c]/60 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#f3e9c8]/70 text-[#b08d3c]">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-display text-base text-[#2b2620] flex items-center gap-1 leading-tight">
                {label}
                <ArrowRight className="w-3 h-3 text-[#b08d3c] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
            <p className="text-[11px] text-[#6b6155] leading-snug">{desc}</p>
          </Link>
        ))}
      </section>

      {plans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-[#2b2620] flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-[#b08d3c]" /> Continue your studies
            </h2>
            <Link to="/learn" className="text-sm text-[#7a2e2e] hover:underline">
              Browse study paths →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}