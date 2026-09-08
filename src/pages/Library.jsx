import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { scrollReadingToTop } from "@/lib/scrollReading";
import {
  CANON_BOOK_ENTRIES,
  MANUSCRIPT_GROUPS,
} from "@/components/library/corpusData";
import BibleReader from "@/components/library/BibleReader";
import ManuscriptReader from "@/components/library/ManuscriptReader";
import ApocryphaLibrary from "@/components/library/ApocryphaLibrary";
import CatalogBrowser from "@/components/library/CatalogBrowser";
import YourDocuments from "@/components/library/YourDocuments";
import WorkRecord from "@/components/library/WorkRecord";
import { getCatalogWork, libraryReadHref } from "@/data/textCatalog";

const CORPORA = [
  {
    key: "bible",
    title: "Holy Bible",
    desc: "The 66 canonical books of the Old and New Testaments (King James Version).",
    kind: "bible",
    books: CANON_BOOK_ENTRIES,
    apocrypha: false,
  },
  {
    key: "apocrypha",
    title: "The Apocrypha",
    desc: "22 deuterocanonical and ancient books — the 1611 KJV Apocrypha plus 1 Enoch, Jubilees, Psalms of Solomon, 3 & 4 Maccabees, Psalm 151, the Odes, and the Additions to Esther.",
    kind: "apocrypha_unified",
  },
  {
    key: "enoch",
    title: "Book of Enoch",
    desc: "The Book of Enoch, quoted in Jude and treasured in the Ethiopic tradition.",
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.enoch,
  },
  {
    key: "dss",
    title: "Dead Sea Scrolls",
    desc: "Read every book found at Qumran in English — scripture chapter by chapter, plus the Yahad's own writings. Photographs: Leon Levy Digital Library.",
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.dss,
  },
  {
    key: "other",
    title: "Other Early Manuscripts",
    desc: "Extra-biblical Christian and Jewish writings stored in this app.",
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.other,
  },
  {
    key: "fathers",
    title: "Early Christian Writings",
    desc: "Ante-Nicene Fathers volumes 1–9 (1885 public-domain English), stored here.",
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.fathers,
  },
  {
    key: "josephus",
    title: "Josephus",
    desc: "Antiquities of the Jews (Whiston). A first-century Jewish history stored in this app, not Scripture.",
    kind: "manuscript",
    group: MANUSCRIPT_GROUPS.josephus,
  },
  {
    key: "codices",
    title: "Great Bible Codices",
    desc: "Codex Vaticanus and Codex Sinaiticus — the oldest complete Greek manuscripts of the Bible (4th century).",
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
    scrollReadingToTop();
  }, [requested, work, params]);

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
      <YourDocuments />
      <CatalogBrowser
        onOpenWork={(id) => {
          const record = getCatalogWork(id);
          const href = libraryReadHref(record);
          if (href && !href.includes(`work=${encodeURIComponent(id)}`)) {
            navigate(href);
            return;
          }
          navigate(`/library?work=${encodeURIComponent(id)}`);
        }}
      />
    </div>
  );
}