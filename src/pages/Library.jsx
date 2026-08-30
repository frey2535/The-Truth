import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpenText, ScrollText, Sparkles, BookOpen, Landmark, BookMarked } from "lucide-react";
import {
  CANON_BOOK_ENTRIES,
  MANUSCRIPT_GROUPS,
} from "@/components/library/corpusData";
import BibleReader from "@/components/library/BibleReader";
import ManuscriptReader from "@/components/library/ManuscriptReader";
import ApocryphaLibrary from "@/components/library/ApocryphaLibrary";
import CatalogBrowser from "@/components/library/CatalogBrowser";
import WorkRecord from "@/components/library/WorkRecord";
import { getCatalogWork } from "@/data/textCatalog";

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
  const work = useMemo(() => getCatalogWork(params.get("work")), [params]);
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

  if (work) {
    return (
      <WorkRecord
        work={work}
        onBack={() => navigate("/library")}
      />
    );
  }

  return (
    <div>
      <CatalogBrowser onOpenWork={(id) => navigate(`/library?work=${encodeURIComponent(id)}`)} />
      <section className="mt-12">
        <h2 className="font-display text-2xl text-[#2b2620] mb-2">Stored collections</h2>
        <p className="text-sm text-[#5b5142] mb-4">
          Open a collection that already has English stored in this app. Search inside one corpus at a time.
        </p>
        <div className="flex flex-wrap gap-3 text-sm mb-4">
          <Link to="/search?corpus=canon" className="text-[#7a2e2e] hover:underline">Search the Bible</Link>
          <Link to="/search?corpus=apocrypha" className="text-[#7a2e2e] hover:underline">Search the Apocrypha</Link>
          <Link to="/search?corpus=dead_sea_scrolls" className="text-[#7a2e2e] hover:underline">Search the Scrolls</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {CORPORA.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                onClick={() => (c.kind === "link" ? navigate(c.to) : setActive(c))}
                className="text-left p-5 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#f3e9c8]/50 text-[#b08d3c]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-display text-xl text-[#2b2620]">{c.title}</h3>
                </div>
                <p className="text-sm text-[#6b6155] leading-relaxed">{c.desc}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}