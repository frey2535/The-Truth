import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BookMarked, Highlighter, Star, StickyNote } from "lucide-react";

const TABS = [
  { id: "plans", label: "Study plans", icon: BookMarked },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "highlights", label: "Highlights", icon: Highlighter },
  { id: "favorites", label: "Favorites", icon: Star },
];

export default function Notebook() {
  const [tab, setTab] = useState("plans");
  const [topic, setTopic] = useState("");
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.StudyPlan.list("-created_date", 100).catch(() => []),
      base44.entities.Note.list("-created_date", 200).catch(() => []),
      base44.entities.Highlight.list("-created_date", 200).catch(() => []),
      base44.entities.Favorite.list("-created_date", 200).catch(() => []),
    ]).then(([p, n, h, f]) => {
      setPlans(p || []);
      setNotes(n || []);
      setHighlights(h || []);
      setFavorites(f || []);
    });
  }, []);

  const matchTopic = (item) => {
    if (!topic.trim()) return true;
    const hay = `${item.topic || ""} ${item.reference || ""} ${item.body || ""} ${item.text || ""}`.toLowerCase();
    return hay.includes(topic.toLowerCase());
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Your notebook</h1>
        <p className="text-[#5b5142] max-w-xl mx-auto">
          Study plans, notes, highlights, and favorites stay on this device, under your session. Filter by topic.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${
              tab === id ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]" : "bg-white/70 text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>
      <div className="max-w-md mx-auto mb-8">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Filter by topic"
          className="w-full h-11 rounded-xl border border-[#e8ddc7] bg-white px-4 text-sm"
        />
      </div>

      {tab === "plans" && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {plans.filter(matchTopic).map((p) => (
            <Link key={p.id} to={`/plan/${p.id}`} className="truth-card block p-4 hover:border-[#b08d3c]/50">
              <h2 className="font-display text-xl capitalize">{p.topic}</h2>
              <p className="text-sm text-[#8a7f6f]">{p.status} · {p.verse_count || 0} passages</p>
            </Link>
          ))}
          {plans.filter(matchTopic).length === 0 && <p className="text-center text-[#8a7f6f]">No study plans yet. Start one from Home.</p>}
        </div>
      )}
      {tab === "notes" && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {notes.filter(matchTopic).map((n) => (
            <article key={n.id} className="truth-card p-4">
              <p className="text-xs text-[#b08d3c]">{n.reference} {n.topic ? `· ${n.topic}` : ""}</p>
              <p className="mt-1 text-[#2b2620] whitespace-pre-wrap">{n.body}</p>
            </article>
          ))}
          {notes.filter(matchTopic).length === 0 && <p className="text-center text-[#8a7f6f]">No notes yet. Add one beside a verse while reading.</p>}
        </div>
      )}
      {tab === "highlights" && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {highlights.filter(matchTopic).map((h) => (
            <article key={h.id} className="truth-card p-4 bg-[#f3e9c8]/70">
              <p className="text-xs text-[#b08d3c]">{h.reference}</p>
              <p className="mt-1 text-[#2b2620]">{h.text}</p>
            </article>
          ))}
          {highlights.filter(matchTopic).length === 0 && <p className="text-center text-[#8a7f6f]">No highlights yet.</p>}
        </div>
      )}
      {tab === "favorites" && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {favorites.filter(matchTopic).map((f) => (
            <article key={f.id} className="truth-card p-4">
              <p className="text-xs text-[#b08d3c]">{f.reference} {f.topic ? `· ${f.topic}` : ""}</p>
              <p className="mt-1 text-[#2b2620]">{f.text}</p>
            </article>
          ))}
          {favorites.filter(matchTopic).length === 0 && <p className="text-center text-[#8a7f6f]">No favorites yet.</p>}
        </div>
      )}
    </div>
  );
}
