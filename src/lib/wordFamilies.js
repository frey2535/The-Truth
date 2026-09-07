import { STRONGS } from "../data/strongsLexicon.js";

const SUFFIXES = [
  "ising",
  "izing",
  "ation",
  "ition",
  "ment",
  "ness",
  "ance",
  "ence",
  "tion",
  "sion",
  "ised",
  "ized",
  "ises",
  "izes",
  "ying",
  "ies",
  "ied",
  "ing",
  "eth",
  "est",
  "ism",
  "ist",
  "ers",
  "ful",
  "ous",
  "ed",
  "es",
  "er",
  "ly",
  "s",
];

const EXTRA_FAMILIES = [
  ["baptism", "baptisms", "baptize", "baptized", "baptizing", "baptizeth", "baptise", "baptised", "baptising", "baptist", "baptists"],
  ["forgive", "forgiven", "forgiveness", "forgave", "forgiveth", "forgiving", "pardon", "pardoned", "remission"],
  ["repent", "repented", "repenteth", "repenting", "repentance"],
  ["save", "saved", "saveth", "saving", "salvation", "saviour", "savior"],
  ["believe", "believed", "believeth", "believing", "belief", "faith"],
  ["pray", "prayed", "prayeth", "praying", "prayer", "prayers"],
  ["love", "loved", "loveth", "lovest", "loving", "beloved"],
  ["command", "commanded", "commandeth", "commandment", "commandments", "commands"],
  ["sin", "sins", "sinned", "sinneth", "sinning", "sinner", "sinners", "sinful"],
  ["holy", "holiness", "holiest", "sanctify", "sanctified", "sanctification"],
  ["spirit", "spirits", "spiritual", "ghost"],
  ["resurrection", "resurrected", "rise", "risen", "rose", "raised"],
  ["crucify", "crucified", "cross"],
  ["kingdom", "kingdoms", "reign", "reigneth", "reigned"],
  ["sabbath", "sabbaths"],
];

function clean(word) {
  return String(word || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'-]/gu, "")
    .trim();
}

function spellingTwins(word) {
  const w = clean(word);
  const out = new Set([w]);
  const pairs = [
    [/ize$/, "ise"],
    [/ise$/, "ize"],
    [/ized$/, "ised"],
    [/ised$/, "ized"],
    [/izing$/, "ising"],
    [/ising$/, "izing"],
    [/ization$/, "isation"],
    [/isation$/, "ization"],
    [/or$/, "our"],
    [/our$/, "or"],
  ];
  for (const [re, repl] of pairs) {
    if (re.test(w) && w.length >= 5) out.add(w.replace(re, repl));
  }
  return [...out];
}

function stripOneSuffix(word) {
  const w = clean(word);
  for (const suf of SUFFIXES) {
    if (w.length - suf.length >= 3 && w.endsWith(suf)) return w.slice(0, -suf.length);
  }
  return w;
}

export function lemmaOf(word) {
  let stem = clean(word);
  for (let i = 0; i < 2; i += 1) {
    const next = stripOneSuffix(stem);
    if (next === stem) break;
    stem = next;
  }
  return stem || clean(word);
}

function inflect(stem) {
  const s = clean(stem);
  if (s.length < 3) return [s];
  const out = new Set([s]);
  for (const suf of ["", "s", "es", "ed", "ing", "eth", "est", "er", "ers", "ly", "ied", "ies"]) {
    out.add(s + suf);
  }
  if (s.endsWith("i")) out.add(`${s.slice(0, -1)}y`);
  if (s.endsWith("y")) {
    out.add(`${s.slice(0, -1)}ies`);
    out.add(`${s.slice(0, -1)}ied`);
  }
  if (s.endsWith("e")) {
    out.add(`${s}d`);
    out.add(`${s.slice(0, -1)}ing`);
  }
  if (s.endsWith("ism")) {
    const root = s.slice(0, -3);
    out.add(`${root}ize`);
    out.add(`${root}ise`);
    out.add(`${root}ized`);
    out.add(`${root}ised`);
    out.add(`${root}izing`);
    out.add(`${root}ising`);
    out.add(`${root}ist`);
    out.add(`${root}ists`);
  }
  if (s.endsWith("iz") || s.endsWith("is")) {
    out.add(`${s}e`);
    out.add(`${s}ed`);
    out.add(`${s}ing`);
    out.add(`${s}m`);
    out.add(`${s}t`);
  }
  return [...out];
}

const strongsIndex = (() => {
  const map = new Map();
  const add = (form, members) => {
    const key = clean(form);
    if (!key) return;
    if (!map.has(key)) map.set(key, new Set());
    const bucket = map.get(key);
    for (const m of members) if (clean(m)) bucket.add(clean(m));
  };
  for (const [key, entry] of Object.entries(STRONGS)) {
    const members = [key, ...(entry.forms || [])];
    for (const m of members) add(m, members);
  }
  for (const family of EXTRA_FAMILIES) {
    for (const m of family) add(m, family);
  }
  return map;
})();

export function familyOf(word) {
  const seed = clean(word);
  if (!seed) return [];
  const out = new Set();
  const queue = [seed, lemmaOf(seed), ...spellingTwins(seed)];
  for (const item of queue) {
    out.add(item);
    for (const form of inflect(item)) out.add(form);
    for (const form of inflect(lemmaOf(item))) out.add(form);
    const linked = strongsIndex.get(item) || strongsIndex.get(lemmaOf(item));
    if (linked) {
      for (const m of linked) {
        out.add(m);
        for (const form of inflect(m)) out.add(form);
        for (const twin of spellingTwins(m)) out.add(twin);
      }
    }
  }
  return [...out].filter((w) => w.length >= 3);
}

function escapeRe(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function foldMarks(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function familyHitsText(text, word) {
  const hay = foldMarks(text);
  if (!hay || !word) return false;
  const members = familyOf(word);
  for (const form of members) {
    if (new RegExp(`\\b${escapeRe(form)}\\b`, "i").test(hay)) return true;
  }
  const stem = lemmaOf(word);
  if (stem.length >= 4 && new RegExp(`\\b${escapeRe(stem)}`, "i").test(hay)) return true;
  return false;
}

export function observedFamilyMembers(text, word) {
  const hay = foldMarks(text);
  return familyOf(word).filter((form) => new RegExp(`\\b${escapeRe(form)}\\b`, "i").test(hay));
}
