import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FlaskConical } from "lucide-react";
import NotebookItemActions from "@/components/NotebookItemActions";
import VerseCard from "@/components/study/VerseCard";
import { SOURCE_LABEL } from "@/lib/localCorpusSearch";

export default function StudyPlanView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [retrying, setRetrying] = useState(false);

  async function loadAll() {
    try {
      const p = await base44.entities.StudyPlan.get(id);
      if (!p) {
        setNotFound(true);
        return;
      }
      setPlan(p);
      const v = await base44.entities.StudyVerse.filter({ plan_id: id }, "chronological_order");
      setVerses(v || []);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    if (!plan) return;
    setRetrying(true);
    try {
      await base44.entities.StudyPlan.update(id, { status: "researching" });
      setPlan({ ...plan, status: "researching" });
      base44.functions.invoke("research_topic", { topic: plan.topic, plan_id: id }).catch(() => {});
    } finally {
      setRetrying(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  useEffect(() => {
    if (plan?.status !== "researching") return;
    const t = setInterval(loadAll, 5000);
    return () => clearInterval(t);
  }, [plan?.status]);

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#b08d3c]" />
      </div>
    );

  if (notFound)
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl text-[#2b2620] mb-4">Study plan not found.</p>
        <Link to="/">
          <Button>Back to study plans</Button>
        </Link>
      </div>
    );

  const sourceCounts = verses.reduce((counts, verse) => {
    const label = SOURCE_LABEL[verse.source] || verse.source || "stored text";
    counts[label] = (counts[label] || 0) + 1;
    return counts;
  }, {});

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#8a7f6f] hover:text-[#2b2620] mb-4">
        <ArrowLeft className="w-4 h-4" /> All study plans
      </Link>
      <header className="mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] capitalize mb-2">{plan.topic}</h1>
        {plan.description && (
          <p className="text-[#5b5142] max-w-3xl leading-relaxed">{plan.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#8a7f6f]">
          <span>
            {verses.length} passage{verses.length === 1 ? "" : "s"}
          </span>
          <span>·</span>
          <span>Bible passages first, then other stored texts and records</span>
          <NotebookItemActions
            kind="Study plan"
            item={{
              ...plan,
              body: [plan.description, ...verses.map((v) => `${v.reference || ""}\n${v.text || ""}`)].filter(Boolean).join("\n\n"),
            }}
            onDelete={async () => {
              await Promise.all(verses.map((verse) => base44.entities.StudyVerse.delete(verse.id)));
              await base44.entities.StudyPlan.delete(id);
              navigate("/notebook");
            }}
          />
        </div>
        {plan.derivatives && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-[#b08d3c] mb-2">Word forms searched</p>
            <div className="flex flex-wrap gap-2">
              {plan.derivatives
                .split(",")
                .map((d) => d.trim())
                .filter(Boolean)
                .map((d, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-[#f3e9c8]/60 border border-[#e8ddc7] text-sm text-[#5b5142] font-display"
                  >
                    {d}
                  </span>
                ))}
            </div>
          </div>
        )}
      </header>

      {verses.length > 0 && (
        <section className="mb-6 rounded-2xl border border-[#e8ddc7] bg-white/70 p-4">
          <h2 className="font-display text-xl text-[#2b2620] mb-2">How to study this topic</h2>
          <ol className="list-decimal pl-5 text-sm text-[#5b5142] space-y-1">
            <li>Read every passage below, not only the first few matches.</li>
            <li>Open “Read in context” on any verse or document before making a doctrine or history conclusion.</li>
            <li>Keep Holy Bible scripture first; then compare Apocrypha, manuscripts, historians, and public records as witnesses.</li>
          </ol>
          <p className="mt-3 text-xs text-[#8a7f6f]">
            Sources in this plan: {Object.entries(sourceCounts).map(([source, count]) => `${count} ${source}`).join(" · ")}
          </p>
        </section>
      )}

      {plan.status === "researching" && (
        <div className="flex items-center gap-2 text-[#b08d3c] mb-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Searching the texts… first search may take a moment while the books load.
        </div>
      )}
      {plan.status === "complete" && verses.length === 0 && (
        <p className="text-[#8a7f6f] py-12 text-center">No passages were found for this topic.</p>
      )}
      {plan.status === "failed" && (
        <div className="text-center py-12">
          <p className="text-[#7a2e2e] mb-4">
            {plan.description || "Research could not finish. Please try again."}
          </p>
          <Button onClick={handleRetry} disabled={retrying}>
            {retrying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Try again
          </Button>
        </div>
      )}

      <div className="bg-white/60 rounded-2xl border border-[#e8ddc7] px-5 sm:px-8">
        {verses.map((v, i) => (
          <VerseCard key={v.id || i} verse={v} index={i} topic={plan.topic} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/evidence">
          <Button variant="outline" className="border-[#b08d3c]/40 text-[#7a2e2e]">
            <FlaskConical className="w-4 h-4 mr-2" /> Browse all empirical evidence
          </Button>
        </Link>
      </div>
    </div>
  );
}