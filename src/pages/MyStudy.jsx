import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ListenControl from "@/components/ListenControl";
import NotebookItemActions from "@/components/NotebookItemActions";
import PlanCard from "@/components/study/PlanCard";
import { BookMarked, Highlighter, Star, StickyNote } from "lucide-react";
import { libraryHref } from "@/lib/libraryLinks";
import { downloadText, notebookItemText, printText } from "@/lib/notebookExport";

const TABS = [
  { id: "plans", label: "Study plans", icon: BookMarked },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "highlights", label: "Highlights", icon: Highlighter },
  { id: "favorites", label: "Favorites", icon: Star },
];

export default function MyStudy() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [topicFilter, setTopicFilter] = useState("all");
  const [newTopic, setNewTopic] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  async function load() {
    const [p, n, h, f] = await Promise.all([
      base44.entities.StudyPlan.list("-created_date", 50).catch(() => []),
      base44.entities.Note.list("-created_date", 200).catch(() => []),
      base44.entities.Highlight.list("-created_date", 200).catch(() => []),
      base44.entities.Favorite.list("-created_date", 200).catch(() => []),
    ]);
    setPlans(p || []);
    setNotes(n || []);
    setHighlights(h || []);
    setFavorites(f || []);
  }

  useEffect(() => {
    load();
  }, []);

  const topics = useMemo(() => {
    const set = new Set();
    [...notes, ...favorites].forEach((row) => {
      if (row.topic) set.add(row.topic);
    });
    return [...set].sort();
  }, [notes, favorites]);

  async function remove(entity, id) {
    await base44.entities[entity].delete(id);
    await load();
  }

  async function removePlan(id) {
    const verses = await base44.entities.StudyVerse.filter({ plan_id: id }).catch(() => []);
    await Promise.all((verses || []).map((verse) => base44.entities.StudyVerse.delete(verse.id)));
    await base44.entities.StudyPlan.delete(id);
    await load();
  }

  function exportTab() {
    const rows =
      tab === "plans"
        ? plans.map((p) => notebookItemText("Study plan", p))
        : tab === "notes"
          ? shownNotes.map((n) => notebookItemText("Note", n))
          : tab === "highlights"
            ? highlights.map((h) => notebookItemText("Highlight", h))
            : shownFavs.map((f) => notebookItemText("Favorite", f));
    const text = rows.join("\n---\n\n") || "No items.\n";
    const label = TABS.find((entry) => entry.id === tab)?.label || "Notebook";
    return { text, label };
  }

  const shownNotes = topicFilter === "all" ? notes : notes.filter((n) => n.topic === topicFilter);
  const shownFavs = topicFilter === "all" ? favorites : favorites.filter((n) => n.topic === topicFilter);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Notebook</h1>
        <p className="text-[#5b5142] max-w-2xl">
          Plans, notes, highlights, and favorites stay on this device. Delete, download, or print any
          item. They are not sent to the internet.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${
              tab === id ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]" : "bg-white border-[#e8ddc7] text-[#5b5142]"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          className="text-xs px-3 py-1.5 rounded-full border border-[#e8ddc7] bg-white"
          onClick={() => {
            const { text, label } = exportTab();
            downloadText(`${label.toLowerCase().replace(/\s+/g, "-")}.txt`, text);
          }}
        >
          Download this list
        </button>
        <button
          type="button"
          className="text-xs px-3 py-1.5 rounded-full border border-[#e8ddc7] bg-white"
          onClick={() => {
            const { text, label } = exportTab();
            printText(label, text);
          }}
        >
          Print this list
        </button>
        <ListenControl
          variant="chapter"
          id={`notebook-list:${tab}`}
          title={TABS.find((entry) => entry.id === tab)?.label || "Notebook"}
          label="Listen to this list"
          text={() => exportTab().text}
        />
      </div>

      {(tab === "notes" || tab === "favorites") && topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button type="button" onClick={() => setTopicFilter("all")} className="text-xs px-3 py-1 rounded-full border border-[#e8ddc7]">
            All topics
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopicFilter(t)}
              className={`text-xs px-3 py-1 rounded-full border ${
                topicFilter === t ? "bg-[#f3e9c8] border-[#b08d3c]" : "border-[#e8ddc7]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {tab === "plans" && (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const topic = newTopic.trim();
              if (!topic || savingPlan) return;
              setSavingPlan(true);
              try {
                const created = await base44.entities.StudyPlan.create({ topic, status: "researching" });
                setNewTopic("");
                navigate(`/plan/${created.id}`);
                base44.functions.invoke("research_topic", { topic, plan_id: created.id }).catch(() => {});
              } finally {
                setSavingPlan(false);
              }
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Start a study plan (topic or question)"
              className="flex-1 h-10 rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
            />
            <button type="submit" disabled={savingPlan} className="truth-btn-sm h-10 px-4">
              Save plan
            </button>
          </form>
          {plans.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  actions={
                    <NotebookItemActions
                      kind="Study plan"
                      item={p}
                      onDelete={() => removePlan(p.id)}
                    />
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-[#8a7f6f]">No study plans yet. Save one above, or start from the home search.</p>
          )}
        </div>
      )}

      {tab === "notes" && (
        <div className="space-y-3">
          {shownNotes.length === 0 && <p className="text-[#8a7f6f]">No notes yet. Open a verse and write one.</p>}
          {shownNotes.map((n) => (
            <article key={n.id} className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
              <div className="flex justify-between gap-3">
                <p className="text-sm font-medium text-[#7a2e2e]">
                  <Link to={libraryHref({ reference: n.reference })} className="hover:underline">{n.reference}</Link>
                  {n.topic ? ` · ${n.topic}` : ""}
                </p>
                <NotebookItemActions kind="Note" item={n} onDelete={() => remove("Note", n.id)} />
              </div>
              <p className="text-sm text-[#6b6155] mt-1">{n.text}</p>
              <p className="text-[#2b2620] mt-2 whitespace-pre-wrap">{n.body}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "highlights" && (
        <div className="space-y-3">
          {highlights.length === 0 && <p className="text-[#8a7f6f]">No highlights yet.</p>}
          {highlights.map((h) => (
            <article key={h.id} className="rounded-2xl border border-[#e8ddc7] bg-[#fff6d8] p-4">
              <div className="flex justify-between gap-3">
                <p className="text-sm font-medium text-[#7a2e2e]">
                  <Link to={libraryHref({ reference: h.reference })} className="hover:underline">{h.reference}</Link>
                </p>
                <NotebookItemActions kind="Highlight" item={h} onDelete={() => remove("Highlight", h.id)} />
              </div>
              <p className="text-[#2b2620] mt-1 leading-relaxed">{h.text}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "favorites" && (
        <div className="space-y-3">
          {shownFavs.length === 0 && <p className="text-[#8a7f6f]">No favorites yet.</p>}
          {shownFavs.map((f) => (
            <article key={f.id} className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
              <div className="flex justify-between gap-3">
                <p className="text-sm font-medium text-[#7a2e2e]">
                  <Link to={libraryHref({ reference: f.reference })} className="hover:underline">{f.reference}</Link>
                  {f.topic ? ` · ${f.topic}` : ""}
                </p>
                <NotebookItemActions kind="Favorite" item={f} onDelete={() => remove("Favorite", f.id)} />
              </div>
              <p className="text-[#2b2620] mt-1 leading-relaxed">{f.text}</p>
            </article>
          ))}
        </div>
      )}

      <p className="text-sm text-[#8a7f6f] mt-10">
        Sign in if you want a named account on this device. <Link to="/login" className="text-[#7a2e2e] underline">Sign in</Link>
      </p>
    </div>
  );
}
