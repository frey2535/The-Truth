import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { Loader2, ArrowLeft, GraduationCap, BookOpen, ScrollText, Languages } from "lucide-react";

const LEVEL_COLOR = {
  beginner: "bg-[#2e6b3a]/10 text-[#2e6b3a]",
  intermediate: "bg-[#2b5a8a]/10 text-[#2b5a8a]",
  advanced: "bg-[#b08d3c]/15 text-[#7a5e1a]",
  scholar: "bg-[#7a2e2e]/10 text-[#7a2e2e]",
};

const mdComponents = {
  h1: ({ node, ...p }) => <h1 className="font-display text-2xl text-[#2b2620] mt-6 mb-3" {...p} />,
  h2: ({ node, ...p }) => <h2 className="font-display text-xl text-[#2b2620] mt-5 mb-2" {...p} />,
  h3: ({ node, ...p }) => <h3 className="font-display text-lg text-[#2b2620] mt-4 mb-2" {...p} />,
  p: ({ node, ...p }) => <p className="text-[#2b2620] leading-relaxed mb-3" {...p} />,
  strong: ({ node, ...p }) => <strong className="text-[#7a2e2e] font-semibold" {...p} />,
  a: ({ node, ...p }) => <a className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer" {...p} />,
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...p} />,
};

export default function Learn() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    base44.entities.StudyPath
      .list("order", 100)
      .then((r) => setPaths(r || []))
      .catch(() => setPaths([]))
      .finally(() => setLoading(false));
  }, []);

  async function openPath(p) {
    setSelected(p);
    setLesson(null);
    setLoadingLessons(true);
    try {
      const r = await base44.entities.Lesson.filter({ path_id: p.id }, "order", 50);
      setLessons(r || []);
    } catch {
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  }

  if (lesson) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setLesson(null)}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {selected.title}
        </button>
        <h1 className="font-display text-3xl text-[#2b2620] mb-4">{lesson.title}</h1>
        {lesson.scripture_references?.length > 0 && (
          <p className="text-sm text-[#7a2e2e] mb-4">Scripture: {lesson.scripture_references.join(" · ")}</p>
        )}
        <article className="max-w-none">
          <ReactMarkdown components={mdComponents}>{lesson.content || lesson.summary || ""}</ReactMarkdown>
        </article>
        {lesson.evidence_links?.length > 0 && (
          <div className="mt-6 p-4 rounded-xl border border-[#e8ddc7] bg-[#f3e9c8]/30">
            <p className="text-xs uppercase tracking-wide text-[#8a7f6f] mb-2">Related evidence</p>
            <ul className="space-y-1">
              {lesson.evidence_links.map((l, i) => (
                <li key={i} className="text-sm text-[#5b5142]">· {l}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All study paths
        </button>
        <div className="flex items-start gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f3e9c8]/50 text-[#b08d3c] shrink-0">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl text-[#2b2620]">{selected.title}</h1>
            {selected.level && (
              <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${LEVEL_COLOR[selected.level] || ""}`}>
                {selected.level}
              </span>
            )}
          </div>
        </div>
        {selected.description && <p className="text-[#5b5142] mb-6 max-w-2xl">{selected.description}</p>}

        {loadingLessons ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-[#8a7f6f] italic">Lessons for this path are coming soon.</p>
        ) : (
          <div className="space-y-3">
            {lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setLesson(l)}
                className="block w-full text-left p-4 rounded-xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-[#b08d3c] w-7">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg text-[#2b2620]">{l.title}</h3>
                    {l.summary && <p className="text-sm text-[#6b6155]">{l.summary}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Learn</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Guided study paths that link directly to the texts and evidence stored in the app — from beginner to
          scholar level.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Link
          to="/word-study"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8ddc7] bg-white/70 text-sm text-[#5b5142] hover:border-[#b08d3c]/60"
        >
          <Languages className="w-4 h-4 text-[#b08d3c]" /> Word Study
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#b08d3c]" />
        </div>
      ) : paths.length === 0 ? (
        <p className="text-center text-[#8a7f6f] italic py-10">Study paths are being prepared. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => openPath(p)}
              className="text-left p-5 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#b08d3c]" />
                {p.level && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LEVEL_COLOR[p.level] || ""}`}>
                    {p.level}
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl text-[#2b2620] mb-1">{p.title}</h3>
              <p className="text-sm text-[#6b6155] leading-relaxed">{p.description || ""}</p>
              {p.lesson_count > 0 && (
                <p className="text-xs text-[#8a7f6f] mt-2 flex items-center gap-1">
                  <ScrollText className="w-3 h-3" /> {p.lesson_count} lessons
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}