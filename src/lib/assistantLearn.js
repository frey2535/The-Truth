import { familyOf, lemmaOf, observedFamilyMembers } from "./wordFamilies.js";

const KEY = "the_truth_assistant_learn_v1";
const MAX_LEMMAS = 400;
const MAX_LINKS = 16;

function emptyStore() {
  return { associations: {}, seen: 0 };
}

function readStore() {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return {
      associations: parsed.associations && typeof parsed.associations === "object" ? parsed.associations : {},
      seen: Number(parsed.seen) || 0,
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

function bump(map, from, to, amount = 1) {
  const a = lemmaOf(from);
  const b = lemmaOf(to);
  if (!a || !b || a === b) return;
  if (!map[a]) map[a] = {};
  map[a][b] = (map[a][b] || 0) + amount;
}

/** Learning may only add search forms. It never hides, rewrites, or ranks theology. */
export function learnedForms(word) {
  const store = readStore();
  const lemma = lemmaOf(word);
  const links = store.associations[lemma] || {};
  return Object.entries(links)
    .filter(([, weight]) => weight >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_LINKS)
    .map(([form]) => form);
}

export function expandWithLearning(word) {
  const base = new Set(familyOf(word));
  for (const extra of learnedForms(word)) {
    for (const form of familyOf(extra)) base.add(form);
  }
  return [...base];
}

/**
 * Record which stored word-forms actually appeared. This only grows recall.
 * It cannot drop a passage, change a quote, or pick a preferred verdict.
 */
export function recordAssistantLearning({ topics, passages }) {
  const topicList = (topics || []).map((t) => String(t || "").trim()).filter(Boolean);
  const rows = Array.isArray(passages) ? passages : [];
  if (!topicList.length || !rows.length) return { recorded: false, learnedOnlyExpandsRecall: true };

  const store = readStore();
  for (const topic of topicList) {
    const seen = new Set();
    for (const row of rows) {
      for (const form of observedFamilyMembers(row.text, topic)) {
        if (seen.has(form)) continue;
        seen.add(form);
        bump(store.associations, topic, form, 1);
      }
    }
  }

  const lemmas = Object.keys(store.associations);
  if (lemmas.length > MAX_LEMMAS) {
    const keep = lemmas.slice(-MAX_LEMMAS);
    const next = {};
    for (const key of keep) next[key] = store.associations[key];
    store.associations = next;
  }
  store.seen += 1;
  writeStore(store);
  return { recorded: true, learnedOnlyExpandsRecall: true };
}

export function learningCannotManipulate() {
  return {
    mayHidePassages: false,
    mayRewriteQuotes: false,
    maySteerVerdict: false,
    mayAddSearchForms: true,
  };
}
