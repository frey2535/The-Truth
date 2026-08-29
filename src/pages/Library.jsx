import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpenText, ScrollText, Sparkles, BookOpen, Landmark, BookMarked, Moon } from "lucide-react";
import {
  CANON_BOOK_ENTRIES,
  MANUSCRIPT_GROUPS,
} from "@/components/library/corpusData";
import BibleReader from "@/components/library/BibleReader";
import ManuscriptReader from "@/components/library/ManuscriptReader";
import ApocryphaLibrary from "@/components/library/ApocryphaLibrary";

const CORPORA = [
  {
    key: "bible",
    title: "Holy Bible",
    desc: "The 66 canonical books of the Old and New Testaments (King James Version).",
    icon: BookOpenText,
    kind: "bible",
    books: CANON_BOOK_ENTRIES,
    apocrypha: false,
  },
  {
    key: "apocrypha",
    title: "The Apocrypha",
    desc: "22 deuterocanonical and ancient books — the 1611 KJV Apocrypha plus 1 Enoch, Jubilees, Psalms of Solomon, 3 & 4 Maccabees, Psalm 151, the Odes, and the Additions to Esther.",
    icon: Landmark,
    kind: "apocrypha_unified",
  },
  {
    key: "enoch",
    title: "Book of Enoch",
    desc: "The Book of Enoch, quoted in Jude and treasured in the Ethiopic tradition.",
    icon: Sparkles,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.enoch,
  },
  {
    key: "dss",
    title: "Dead Sea Scrolls",
    desc: "Read every book found at Qumran in English — scripture chapter by chapter, plus the Yahad's own writings. Photographs: Leon Levy Digital Library.",
    icon: ScrollText,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.dss,
  },
  {
    key: "other",
    title: "Other Early Manuscripts",
    desc: "Extra-biblical Christian and Jewish writings stored in this app.",
    icon: BookOpen,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.other,
  },
  {
    key: "fathers",
    title: "Early Christian Writings",
    desc: "Clement, Ignatius, Polycarp, Barnabas, Justin, and Irenaeus — the 1885 Ante-Nicene Fathers, Volume 1, stored here.",
    icon: BookMarked,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.fathers,
  },
  {
    key: "josephus",
    title: "Josephus",
    desc: "Antiquities of the Jews (Whiston). A first-century Jewish history stored in this app, not Scripture.",
    icon: ScrollText,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.josephus,
  },
  {
    key: "codices",
    title: "Great Bible Codices",
    desc: "Codex Vaticanus and Codex Sinaiticus — the oldest complete Greek manuscripts of the Bible (4th century).",
    icon: BookMarked,
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.codices,
  },
  {
    key: "customs",
    title: "The Way of the Nations",
    desc: "Traditions still kept, signs still worn, and names Scripture gives the adversary — with intention, what participation means today, and identification drawings (not a rite manual).",
    icon: Moon,
    kind: "link",
    to: "/customs",
  },
];

function corpusFromParam(param) {
  if (!param) return null;
  if (param === "canon" || param === "bible") return CORPORA.find((c) => c.key === "bible") || null;
  return CORPORA.find((c) => c.key === param) || null;
}

export default function Library() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requested = useMemo(() => corpusFromParam(params.get("corpus")), [params]);
  const [active, setActive] = useState(requested);

  useEffect(() => {
    setActive(requested);
  }, [requested]);

  if (active?.kind === "bible") {
    return (
      <BibleReader
        books={active.books}
        apocrypha={active.apocrypha}
        title={active.title}
        subtitle={active.desc}
        initialBook={params.get("book") || undefined}
        initialChapter={params.get("chapter") || undefined}
        onBack={() => {
          setActive(null);
          navigate("/library");
        }}
      />
    );
  }
  if (active?.kind === "manuscript") {
    return (
      <ManuscriptReader
        group={active.group}
        onBack={() => {
          setActive(null);
          navigate("/library");
        }}
      />
    );
  }
  if (active?.kind === "apocrypha_unified") {
    return (
      <ApocryphaLibrary
        onBack={() => {
          setActive(null);
          navigate("/library");
        }}
      />
    );
  }

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">The Library</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Read the texts stored in this app — King James Scripture, the Apocrypha, Enoch, the Dead Sea Scrolls,
          early Christian writings, Josephus, and the great codices. Tap a word to define it. Search one corpus at a time.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          <Link to="/search?corpus=canon" className="text-[#7a2e2e] hover:underline">Search the Bible</Link>
          <Link to="/search?corpus=apocrypha" className="text-[#7a2e2e] hover:underline">Search the Apocrypha</Link>
          <Link to="/search?corpus=dead_sea_scrolls" className="text-[#7a2e2e] hover:underline">Search the Scrolls</Link>
          <Link to="/search?corpus=other" className="text-[#7a2e2e] hover:underline">Search the codices</Link>
        </div>
      </header>
      <div className="grid sm:grid-cols-2 gap-5">
        {CORPORA.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.key}
              onClick={() => (c.kind === "link" ? navigate(c.to) : setActive(c))}
              className="text-left p-6 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f3e9c8]/50 text-[#b08d3c]">
                  <Icon className="w-5 h-5" />
                </span>
                <h2 className="font-display text-2xl text-[#2b2620]">{c.title}</h2>
              </div>
              <p className="text-sm text-[#6b6155] leading-relaxed">{c.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}