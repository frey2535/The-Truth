import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Highlighter, Star, StickyNote, Link2, Languages, Loader2, X } from "lucide-react";
import ListenControl from "@/components/ListenControl";
import { findRelatedVerses } from "@/lib/localCorpusSearch";
import { lookupLexicon } from "@/data/strongsLexicon";

export default function VerseTools({ reference, text, book }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [note, setNote] = useState("");
  const [topic, setTopic] = useState("");
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [saved, setSaved] = useState("");
  const [lex, setLex] = useState(null);

  useEffect(() => {
    setOpen(null);
    setSaved("");
    setRelated([]);
    setLex(null);
  }, [reference]);

  async function saveNote() {
    const body = note.trim();
    if (!body) return;
    await base44.entities.Note.create({ reference, text, body, topic: topic.trim(), book: book || "" });
    setSaved("Note saved on this device.");
    setNote("");
  }

  async function highlight() {
    await base44.entities.Highlight.create({ reference, text, color: "gold", book: book || "" });
    setSaved("Highlighted on this device.");
  }

  async function favorite() {
    await base44.entities.Favorite.create({
      reference,
      text,
      topic: topic.trim() || "Favorites",
      kind: "verse",
      book: book || "",
    });
    if (topic.trim()) {
      await base44.entities.Topic.create({ title: topic.trim(), reference });
    }
    setSaved("Saved as a favorite on this device.");
  }

  async function loadRelated() {
    setOpen("related");
    setLoadingRelated(true);
    try {
      setRelated(await findRelatedVerses(text, reference, { limit: 10 }));
    } finally {
      setLoadingRelated(false);
    }
  }

  function defineSelection() {
    const picked = (window.getSelection?.()?.toString() || "").trim();
    const word = picked.split(/\s+/)[0] || text.split(/\s+/).find((w) => lookupLexicon(w)) || "";
    if (!word) {
      navigate(`/word-study?word=${encodeURIComponent(text.split(/\s+/)[0] || "")}&ref=${encodeURIComponent(reference)}`);
      return;
    }
    const hit = lookupLexicon(word);
    setLex({ word, hit });
    setOpen("define");
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1.5">
        <ListenControl
          variant="verse"
          id={`verse:${reference}`}
          title={reference}
          label="Listen"
          text={`${reference}. ${text}`}
        />
        <button type="button" onClick={highlight} className="verse-tool" title="Highlight">
          <Highlighter className="w-3.5 h-3.5" /> Highlight
        </button>
        <button type="button" onClick={favorite} className="verse-tool" title="Favorite">
          <Star className="w-3.5 h-3.5" /> Favorite
        </button>
        <button type="button" onClick={() => setOpen(open === "note" ? null : "note")} className="verse-tool">
          <StickyNote className="w-3.5 h-3.5" /> Note
        </button>
        <button type="button" onClick={loadRelated} className="verse-tool">
          <Link2 className="w-3.5 h-3.5" /> Matching texts
        </button>
        <button type="button" onClick={defineSelection} className="verse-tool">
          <Languages className="w-3.5 h-3.5" /> Define
        </button>
      </div>
      {saved && <p className="text-[11px] text-[#2e6b3a] mt-1">{saved}</p>}
      {open === "note" && (
        <div className="mt-2 rounded-xl border border-[#e8ddc7] bg-white p-3 space-y-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            className="w-full h-9 rounded-md border border-[#e8ddc7] px-2 text-sm"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Note on ${reference}`}
            className="w-full min-h-[80px] rounded-md border border-[#e8ddc7] px-2 py-1.5 text-sm"
          />
          <button type="button" onClick={saveNote} className="text-sm px-3 py-1.5 rounded-md bg-[#2b2620] text-[#f3e9c8]">
            Save note
          </button>
        </div>
      )}
      {open === "related" && (
        <div className="mt-2 rounded-xl border border-[#e8ddc7] bg-[#fffdf8] p-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs uppercase tracking-wide text-[#b08d3c] font-semibold">Other stored texts with matching wording</p>
            <button type="button" onClick={() => setOpen(null)}><X className="w-4 h-4 text-[#8a7f6f]" /></button>
          </div>
          {loadingRelated && <Loader2 className="w-4 h-4 animate-spin text-[#b08d3c]" />}
          {!loadingRelated && related.length === 0 && (
            <p className="text-sm text-[#8a7f6f]">No other stored passage shares enough of this wording.</p>
          )}
          <ul className="space-y-2">
            {related.map((m) => (
              <li key={`${m.reference}-${m.source}`} className="text-sm">
                <span className="font-medium text-[#7a2e2e]">{m.reference}</span>
                <span className="text-[10px] uppercase tracking-wide text-[#8a7f6f] ml-2">{m.source}</span>
                <p className="text-[#3a3328] leading-relaxed">{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {open === "define" && lex && (
        <div className="mt-2 rounded-xl border border-[#e8ddc7] bg-white p-3">
          <p className="font-display text-xl text-[#2b2620] capitalize">{lex.word}</p>
          {lex.hit ? (
            <>
              <p className="text-xs text-[#8a7f6f] mt-1">{lex.hit.language} · {lex.hit.strongs}</p>
              <p className="font-display text-lg text-[#7a2e2e] mt-1">{lex.hit.original}</p>
              <p className="text-sm text-[#3a3328] mt-2"><span className="text-[#b08d3c] font-medium">Etymology. </span>{lex.hit.etymology}</p>
              <p className="text-sm text-[#3a3328] mt-2"><span className="text-[#b08d3c] font-medium">Strong's. </span>{lex.hit.meaning}</p>
              <p className="text-[11px] text-[#8a7f6f] mt-2">{lex.hit.source}</p>
            </>
          ) : (
            <p className="text-sm text-[#5b5142] mt-1">
              This spelling is not in the Strong's list stored here. Open Word Study to see every verse that uses it.
            </p>
          )}
          <button
            type="button"
            className="mt-3 text-sm text-[#7a2e2e] underline"
            onClick={() => navigate(`/word-study?word=${encodeURIComponent(lex.word)}&ref=${encodeURIComponent(reference)}`)}
          >
            Full word study
          </button>
        </div>
      )}
    </div>
  );
}
