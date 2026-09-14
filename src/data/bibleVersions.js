/**
 * Older complete English Bibles stored for reading and download.
 * Modern versions that omit verses or rewrite the wording (NIV, ESV, NASB,
 * NLT, NRSV, CSB, The Message, NKJV) are not offered.
 */
export const BIBLE_VERSIONS = [
  {
    id: "kjv",
    label: "King James (Authorized, 1769)",
    year: 1769,
    stored: true,
    path: "/corpus/bible",
    note: "The English of the Textus Receptus and the 1769 Authorized Version. Already stored in this app.",
  },
  {
    id: "geneva",
    label: "Geneva Bible (1599)",
    year: 1599,
    stored: true,
    path: "/corpus/bibles/geneva",
    note: "Reformation English, complete. Public domain. Stored from the eBible.org 1599 Geneva text.",
  },
  {
    id: "douay",
    label: "Douay-Rheims (Challoner)",
    year: 1752,
    stored: true,
    path: "/corpus/bibles/douay",
    extraBooks: [
      "Tobit",
      "Judith",
      "Wisdom",
      "Sirach",
      "Baruch",
      "1 Maccabees",
      "2 Maccabees",
    ],
    note: "English of the Latin Vulgate, complete, including the deuterocanon. Public domain Challoner revision.",
  },
  {
    id: "ylt",
    label: "Young's Literal Translation (1898)",
    year: 1898,
    stored: true,
    path: "/corpus/bibles/ylt",
    note: "Word-for-word English of the Hebrew and Greek, complete. Public domain.",
  },
  {
    id: "webster",
    label: "Webster's Bible (1833)",
    year: 1833,
    stored: true,
    path: "/corpus/bibles/webster",
    note: "Noah Webster's revision of the King James wording, complete. Public domain.",
  },
];

export const REFUSED_BIBLE_VERSIONS = [
  "NIV",
  "ESV",
  "NASB",
  "NLT",
  "NRSV",
  "CSB",
  "The Message",
  "NKJV",
  "WEB",
  "ASV",
];

export function bibleVersionById(id) {
  return BIBLE_VERSIONS.find((v) => v.id === String(id || "").trim()) || BIBLE_VERSIONS[0];
}

export function bibleBookFileName(book) {
  return `${String(book || "").replace(/ /g, "")}.json`;
}
