import {
  APOCRYPHA_BOOKS,
  APOCRYPHA_BOOK_INFO,
  CANON_BOOKS,
  CANON_BOOK_INFO,
  EXTRA_APOCRYPHA_BOOKS,
  MANUSCRIPT_GROUPS,
} from "@/components/library/corpusData";
import { DSS_GROUP } from "@/components/library/dssWorks";
import { EXTRA_DEFS } from "@/data/textCatalogExtras";
import {
  CATALOG_FIELDS,
  CATALOG_SECTIONS,
  DISPUTED,
  TEXT_STATUS,
  UNKNOWN,
} from "@/data/textCatalogMeta";
import { CATALOG_TEXT_MAP } from "@/data/catalogTextMap";

export { CATALOG_FIELDS, CATALOG_SECTIONS, CLASSIFICATION_LABELS, TEXT_STATUS } from "@/data/textCatalogMeta";

const OT_BOOKS = CANON_BOOKS.slice(0, 39);
const NT_BOOKS = CANON_BOOKS.slice(39);

function slugify(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function expand(def) {
  const stored = def.stored || null;
  const status = def.textStatus || (stored ? "complete_stored" : "not_stored");
  const alt = def.alt || [];
  return {
    id: def.id,
    title: def.title,
    alt,
    altDisplay: alt.length ? alt.join("; ") : "None recorded in this catalog entry.",
    sections: def.sections || [def.section].filter(Boolean),
    labels: def.labels || [],
    lang: def.lang || UNKNOWN,
    surviving: def.surviving || def.lang || UNKNOWN,
    date: def.date || DISPUTED,
    earliest: def.earliest || UNKNOWN,
    claimed: def.claimed || UNKNOWN,
    probable: def.probable || UNKNOWN,
    canon: def.canon || "Noncanonical unless a label says otherwise.",
    accepted: def.accepted || "See labels and church notes. Absence from a canon is not hidden.",
    rejected: def.rejected || "See labels. Rejection by a church is recorded, not used to remove the work.",
    textStatus: status,
    completeNote:
      def.completeNote ||
      (status === "complete_stored"
        ? "A complete stored English text (or the stored portion of a collected volume) is in this app."
        : status === "quoted_only"
          ? "No complete book manuscript is claimed here. What survives is quotations or testimonia."
          : status === "reconstructed"
            ? "What circulates is a reconstruction. It is not the original manuscript."
            : status === "manuscript_witness"
              ? "A manuscript or papyrus is catalogued. This app does not store a page-by-page transcription."
              : status === "fragment_stored"
                ? "Only a stored fragment or extract is in this app."
                : "The title is catalogued so the reader knows it exists. The complete wording is not stored in this app yet. Nothing was invented to fill the gap."),
    fragments: def.fragments || (status === "quoted_only" || status === "fragment_stored" ? "Survives in fragments or quotations. See background." : "See earliest manuscript note."),
    variants: def.variants || "A full critical apparatus is not stored verse-by-verse in this app.",
    translation: def.translation || (stored ? "Public-domain English stored in this app. Other versions are not invented." : UNKNOWN),
    discovery: def.discovery || UNKNOWN,
    location: def.location || UNKNOWN,
    background: def.background || def.desc || "",
    relatedBible: def.relatedBible || "Compare the stored King James and other stored texts yourself.",
    archaeology: def.archaeology || "No archaeological claim is invented for this entry.",
    etymology: def.etymology || "Word study is available for stored English words. Original-language etymology is not guessed here.",
    parallels: def.parallels || "Open related stored texts. Parallels are not invented.",
    contradictions: def.contradictions || "Tensions with other texts are not hidden. Read the wording in each work.",
    disputes: def.disputes || DISPUTED,
    provenance: def.provenance || "See earliest manuscript, location, and scholarly disputes.",
    images: def.images || "No manuscript photograph is stored unless an evidence record or an outside holding link is given.",
    sources: def.sources || "Catalogued from the master library list. Academic citations are added when a stored edition names them.",
    openConclusion:
      "This app does not hide a theological conclusion. Canonical status, rejection, disputed authorship, and forgery labels are shown. Noncanonical is not the same as false. Ancient is not the same as historically accurate. Canonical is not the same as archaeologically verified.",
    stored,
    desc: def.desc || "",
  };
}

function canonWork(title, testament) {
  const nt = testament === "nt";
  return expand({
    id: slugify(title),
    title,
    alt: title === "Song of Solomon" ? ["Song of Songs", "Canticles"] : title === "Revelation" ? ["Apocalypse of John"] : title === "Acts" ? ["Acts of the Apostles"] : [],
    sections: nt ? [2] : [1, 8],
    labels: nt ? ["NEW TESTAMENT CANON"] : ["HEBREW BIBLE"],
    lang: nt ? "Greek" : "Hebrew (portions of Daniel and Ezra in Aramaic)",
    surviving: nt
      ? "Greek papyri and uncials; Latin, Syriac, Coptic, and later versions"
      : "Hebrew medieval codices; Dead Sea Scroll fragments for most books; Greek LXX; other versions",
    date: nt ? "First century AD (range by book is disputed)." : "Final literary form often placed in the first millennium BC. Exact dating is disputed.",
    earliest: nt ? "Second- and third-century papyri for many books; fourth-century codices for the collection." : "Judean Desert fragments for most books; Esther has not been identified at Qumran.",
    claimed: nt ? "The name in the title or early tradition." : "Moses for the Torah in Jewish and Christian tradition; prophets and other traditional names elsewhere.",
    probable: DISPUTED,
    canon: "Canonical in the churches that receive the Protestant 66-book Bible; also in Catholic and Orthodox Bibles.",
    accepted: "Jewish (Old Testament books), Catholic, Orthodox, Protestant, Ethiopian (as part of a larger canon).",
    rejected: "—",
    textStatus: "complete_stored",
    stored: { kind: nt ? "canon" : "canon", book: title },
    translation: "King James Version (public domain), stored in this app.",
    background: CANON_BOOK_INFO[title] || "",
    relatedBible: title,
  });
}

function apocryphaWork(title) {
  const orthodoxExtra = ["1 Esdras", "2 Esdras", "Prayer of Manasseh", "3 Maccabees", "4 Maccabees", "Psalm 151"].includes(title);
  return expand({
    id: slugify(title),
    title,
    alt: title === "Ecclesiasticus" ? ["Sirach", "Wisdom of Ben Sira"] : title === "2 Esdras" ? ["4 Ezra"] : title === "Prayer of Azariah" ? ["Song of the Three Holy Children"] : [],
    sections: orthodoxExtra ? [3, 4] : [3],
    labels: orthodoxExtra ? ["DEUTEROCANONICAL", "EASTERN ORTHODOX CANON"] : ["DEUTEROCANONICAL"],
    lang: "Greek (some with Hebrew or Aramaic originals)",
    canon: "Deuterocanonical or apocryphal depending on the church. Not removed from this library because a church rejects it.",
    accepted: "Catholic and/or Orthodox canons for most titles; Ethiopian for some.",
    rejected: "Most Protestant canons treat these as Apocrypha, not as Protestant Scripture.",
    textStatus: "complete_stored",
    stored: { kind: "apocrypha", book: title },
    translation: "1611 King James Apocrypha (public domain), stored in this app.",
    background: APOCRYPHA_BOOK_INFO[title] || "",
  });
}

function extraApocryphaWork(book) {
  const stored =
    book.type === "markdown" && book.slug
      ? { kind: "md", slug: book.slug }
      : book.type === "markdown" && book.url
        ? { kind: "url", url: book.url }
        : book.type === "web"
          ? { kind: "web", bookId: book.bookId }
          : null;
  return expand({
    id: book.id || slugify(book.title),
    title: book.title,
    sections: book.id?.includes("enoch") ? [5, 6] : book.id === "jubilees" ? [5, 7] : [4],
    labels: ["DEUTEROCANONICAL", "EASTERN ORTHODOX CANON"],
    textStatus: stored ? "complete_stored" : "not_stored",
    stored,
    background: book.desc || "",
    canon: "Received in some Eastern and Ethiopian canons. Not Protestant Scripture.",
  });
}

function dssWork(item, section) {
  const stored = item.kjvBook || item.kjvSet || item.kjv1611 || item.webBookId || item.slug || item.local || item.url
    ? { kind: "dss", id: item.id }
    : null;
  return expand({
    id: `dss-${item.id}`,
    title: item.title,
    sections: [section],
    labels: ["DEAD SEA SCROLL", section === 8 ? "MANUSCRIPT" : "DEAD SEA SCROLL"],
    lang: "Hebrew, Aramaic, or Greek (by copy)",
    discovery: "Qumran and other Judean Desert sites",
    location: "Israel Antiquities Authority and related holdings; photographs via the Leon Levy Digital Library.",
    textStatus: stored ? "complete_stored" : "manuscript_witness",
    stored,
    background: item.desc || "",
    images: "Photographs: Leon Levy Dead Sea Scrolls Digital Library (outside this app).",
    fragments: item.catalog ? `Catalog: ${item.catalog}` : "Fragmentary cave copies unless a nearly complete scroll is named.",
  });
}

function manuscriptItem(item, section, labels) {
  const stored = item.file
    ? { kind: "plain", file: item.file }
    : item.content
      ? { kind: "inline", slug: item.slug }
      : item.slug
        ? { kind: "md", slug: item.slug }
        : null;
  return expand({
    id: item.slug || slugify(item.title),
    title: item.title,
    sections: [section],
    labels,
    textStatus: stored ? (item.content ? "manuscript_witness" : "complete_stored") : "not_stored",
    stored,
    background: item.desc || "",
  });
}

function fromExtraDef(def) {
  return expand({
    ...def,
    id: def.id || slugify(def.title),
    sections: def.sections || [def.section],
  });
}

function mergeWorks(list) {
  const map = new Map();
  for (const work of list) {
    const prev = map.get(work.id);
    if (!prev) {
      map.set(work.id, work);
      continue;
    }
    map.set(work.id, {
      ...prev,
      ...work,
      alt: [...new Set([...(prev.alt || []), ...(work.alt || [])])],
      altDisplay: [...new Set([...(prev.alt || []), ...(work.alt || [])])].join("; ") || prev.altDisplay,
      sections: [...new Set([...prev.sections, ...work.sections])].sort((a, b) => a - b),
      labels: [...new Set([...prev.labels, ...work.labels])],
      stored: work.stored || prev.stored,
      textStatus: work.stored || prev.stored ? work.textStatus || prev.textStatus : prev.textStatus,
    });
  }
  return [...map.values()];
}

const AUTO = [
  ...OT_BOOKS.map((t) => canonWork(t, "ot")),
  ...NT_BOOKS.map((t) => canonWork(t, "nt")),
  ...APOCRYPHA_BOOKS.map(apocryphaWork),
  ...EXTRA_APOCRYPHA_BOOKS.map(extraApocryphaWork),
  ...((DSS_GROUP.sections || []).flatMap((sec, i) =>
    (sec.items || []).map((item) => dssWork(item, i === 0 ? 8 : 9))
  )),
  ...MANUSCRIPT_GROUPS.enoch.items.map((item) => manuscriptItem(item, 6, ["ETHIOPIAN CANON", "OLD TESTAMENT PSEUDEPIGRAPHA"])),
  ...MANUSCRIPT_GROUPS.other.items.map((item) => manuscriptItem(item, 7, ["OLD TESTAMENT PSEUDEPIGRAPHA"])),
  ...MANUSCRIPT_GROUPS.fathers.items.map((item) => manuscriptItem(item, 10, ["APOSTOLIC FATHER", "PATRISTIC"])),
  ...MANUSCRIPT_GROUPS.josephus.items.map((item) => manuscriptItem(item, 52, ["GRECO-ROMAN HISTORICAL SOURCE", "COMPARATIVE (NOT CHRISTIAN SCRIPTURE)"])),
  ...MANUSCRIPT_GROUPS.codices.items.map((item) => manuscriptItem(item, 47, ["MANUSCRIPT"])),
  ...EXTRA_DEFS.map(fromExtraDef),
];

export const CATALOG_WORKS = mergeWorks(AUTO).map((work) => {
  if (!CATALOG_TEXT_MAP[work.id] || work.stored) return work;
  return {
    ...work,
    stored: { kind: "catalog", id: work.id },
    textStatus: "complete_stored",
    completeNote: "Public-domain English is stored in this app.",
    translation: "Public-domain English stored in this app.",
  };
});

export function getCatalogWork(id) {
  return CATALOG_WORKS.find((w) => w.id === id) || null;
}

export function isStoredWork(work) {
  return Boolean(work?.stored);
}

export function storedCatalogWorks() {
  return CATALOG_WORKS.filter(isStoredWork);
}

export function worksInSection(sectionId) {
  return storedCatalogWorks().filter((w) => w.sections.includes(sectionId));
}

export function searchCatalog(query) {
  const q = String(query || "").trim().toLowerCase();
  const pool = storedCatalogWorks();
  if (!q) return pool;
  return pool.filter((w) => {
    const hay = `${w.title} ${w.altDisplay} ${w.labels.join(" ")} ${w.background}`.toLowerCase();
    return hay.includes(q);
  });
}

export function libraryReadHref(work) {
  const s = work?.stored;
  if (!s) return null;
  if (s.kind === "canon") {
    const q = new URLSearchParams({ corpus: "bible", book: s.book, chapter: "1" });
    return `/library?${q}`;
  }
  if (s.kind === "apocrypha") {
    const q = new URLSearchParams({ corpus: "apocrypha", book: s.book, chapter: "1" });
    return `/library?${q}`;
  }
  if (s.kind === "dss") return `/library?corpus=dss&work=${encodeURIComponent(s.id)}`;
  if (s.kind === "md" || s.kind === "inline") {
    const group = work.sections.includes(6) ? "enoch" : work.sections.includes(10) ? "fathers" : work.sections.includes(52) ? "josephus" : work.sections.includes(47) ? "codices" : "other";
    return `/library?corpus=${group}`;
  }
  if (s.kind === "plain") {
    if (String(s.file || "").includes("josephus")) return "/library?corpus=josephus";
    return "/library?corpus=fathers";
  }
  if (s.kind === "web" || s.kind === "url") return "/library?corpus=apocrypha";
  if (s.kind === "catalog") return `/library?work=${encodeURIComponent(work.id)}`;
  return null;
}
