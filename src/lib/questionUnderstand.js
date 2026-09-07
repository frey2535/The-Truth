import { extraSearchesForKind, isYesNoQuestion, questionKind } from "./assistantAnswer.js";
import { expandWithLearning } from "./assistantLearn.js";
import { extractReferencesFromQuestion, KJV_TOPIC_ALIASES, SEARCH_CORPORA } from "./localCorpusSearch.js";
import { familyOf } from "./wordFamilies.js";
import { topicTermsFrom } from "./questionTopics.js";

export { isYesNoQuestion, questionKind };

export { topicTermsFrom };

const FOLLOW_UP_RE =
  /^(and|also|what about|how about|why|more|continue|yes|no|again|same|that|those)\b/i;
const PRONOUN_RE = /\b(he|she|they|it|this|that|those|him|his|them|their)\b/i;
const ONLY_SOURCE_RE =
  /\b(?:only|just|solely)\s+(?:in|from|using)\s+(?:the\s+)?(.+?)(?:\s|$)/i;

const SOURCE_PATTERNS = [
  { source: "canon", re: /\b(?:king james|kjv|holy bible|old testament|new testament|gospels?)\b/i },
  { source: "josephus", re: /\b(?:josephus|antiquities of the jews)\b/i },
  { source: "fathers", re: /\b(?:(?:church|early|ante-?nicene)\s+fathers?|ante-?nicene)\b/i },
  { source: "dead_sea_scrolls", re: /\b(?:dead sea scrolls?|qumran scrolls?)\b/i },
  { source: "enoch", re: /\b(?:(?:1|2|book of)\s+enoch|(?:in|from)\s+enoch|enoch says)\b/i },
  { source: "apocrypha", re: /\b(?:apocrypha|deuterocanon(?:ical)?)\b/i },
];

function leadSourceFromQuestion(question) {
  const q = String(question || "");
  if (/\b(?:bible|scripture|king james|kjv|holy bible|old testament|new testament|gospels?)\b/i.test(q)) {
    return "canon";
  }
  for (const { source, re } of SOURCE_PATTERNS) {
    if (re.test(q)) return source;
  }
  return "canon";
}

function restrictFromQuestion(question) {
  const q = String(question || "");
  const only = q.match(ONLY_SOURCE_RE);
  const hay = only ? only[1] : "";
  if (!hay) return null;
  for (const { source, re } of SOURCE_PATTERNS) {
    if (re.test(hay) || re.test(q)) return [source];
  }
  for (const corpus of SEARCH_CORPORA) {
    if (corpus.id === "all") continue;
    if (hay.includes(String(corpus.label || "").toLowerCase().split(" ")[0])) return corpus.sources || [corpus.id];
  }
  return null;
}

function restrictFromCorpusId(corpus) {
  if (!corpus || corpus === "all") return null;
  const chosen = SEARCH_CORPORA.find((c) => c.id === corpus);
  return chosen?.sources || [corpus];
}

function isComparisonQuestion(question, topics) {
  const q = String(question || "");
  if (!/^\s*(?:is|are|was|were)\s+.+\s+the\s+.+/i.test(q) && !/\b(?:same as|instead of|rather than)\b/i.test(q)) {
    return false;
  }
  return topics.some((w) => KJV_TOPIC_ALIASES[String(w).toLowerCase()]);
}

function topicFromClauses(question) {
  const q = String(question || "").trim();
  const patterns = [
    /\b(?:what|how|where)\s+do(?:es)?\s+(.+?)\s+(?:say|teach|tell|speak|command)\s+(?:about|of|concerning)\s+(.+)/i,
    /\bdoes\s+(?:the\s+)?(?:bible|scripture|word|lord|god|jesus|messiah|moses|paul)\s+(?:say|teach|mention|speak|command)\s+(?:that\s+|about\s+|of\s+)?(.+)/i,
    /\b(?:tell me about|explain|define)\s+(.+)/i,
    /^\s*who\s+(?:is|are|was|were)\s+(.+)/i,
    /^\s*what\s+(?:is|are|was|were|must|should|do|does|did)\s+(?:i|we|one|a person|a man)?\s*(?:do\s+(?:to|for)\s+(?:be|have|get)\s+)?(.+)/i,
    /^\s*what\s+must\s+i\s+do(?:\s+to\s+(?:be|have|get))?\s+(.+)/i,
    /^\s*how\s+(?:do|does|can|should|did)\s+(?:i|we|one)?\s*(.+)/i,
    /^\s*why\s+(?:did|does|do|is|was|were)\s+(.+)/i,
    /\b(?:where|when)\s+(?:is|are|was|were|did|does)\s+(.+)/i,
  ];
  const about = q.match(patterns[0]);
  if (about) {
    return {
      topics: topicTermsFrom(about[2]),
      boost: topicTermsFrom(about[1]),
      preferSpeech: true,
    };
  }
  for (let i = 1; i < patterns.length; i += 1) {
    const m = q.match(patterns[i]);
    if (m) return { topics: topicTermsFrom(m[1]), boost: [], preferSpeech: false };
  }
  return null;
}

export function understandQuestion(question, { history = [], corpus = "all" } = {}) {
  const q = String(question || "").trim();
  const refs = extractReferencesFromQuestion(q);
  const parsed = topicFromClauses(q);
  const skipBooks = new Set();
  for (const ref of refs) {
    String(ref.book || "")
      .toLowerCase()
      .split(/\s+/)
      .forEach((w) => {
        if (w.length > 1) skipBooks.add(w);
      });
  }
  const fallback = topicTermsFrom(q).filter((w) => !skipBooks.has(w));
  const topics = parsed?.topics?.length ? parsed.topics : fallback;
  const boost = parsed?.boost || [];
  const kind = questionKind(q, topics);
  const asked = {
    question: q,
    topics,
    words: topics,
    boostWords: boost,
    search: topics.join(" ") || q,
    refs,
    yesNo: isYesNoQuestion(q),
    kind,
    extraSearches: extraSearchesForKind(kind),
    preferSpeech: Boolean(parsed?.preferSpeech),
    leadSource: leadSourceFromQuestion(q),
    comparison: isComparisonQuestion(q, topics),
    restrictSources: restrictFromCorpusId(corpus) || restrictFromQuestion(q),
    families: Object.fromEntries(topics.map((t) => [t, expandWithLearning(t)])),
  };

  const hist = Array.isArray(history) ? history : [];
  const lastUser = [...hist].reverse().find((m) => m.role === "user" && String(m.content || "").trim());
  const thin = !asked.topics.length && !asked.refs.length;
  const follow =
    lastUser && (thin || FOLLOW_UP_RE.test(q) || (PRONOUN_RE.test(q) && asked.topics.length <= 2));
  if (!follow) return asked;
  const prior = understandQuestion(String(lastUser.content).trim(), { corpus });
  const mergedTopics = unique(asked.topics.concat(prior.topics));
  const mergedKind = asked.kind !== "topic-family" ? asked.kind : prior.kind || "topic-family";
  return {
    question: `${prior.question}\n\nFollow-up: ${q}`,
    topics: mergedTopics,
    words: mergedTopics,
    boostWords: unique(asked.boostWords.concat(prior.boostWords, prior.topics)),
    search: mergedTopics.join(" ") || prior.search,
    refs: asked.refs.length ? asked.refs : prior.refs,
    yesNo: asked.yesNo,
    kind: mergedKind,
    extraSearches: extraSearchesForKind(mergedKind),
    preferSpeech: asked.preferSpeech || prior.preferSpeech,
    leadSource: asked.leadSource !== "canon" ? asked.leadSource : prior.leadSource || "canon",
    comparison: asked.comparison || prior.comparison,
    restrictSources: asked.restrictSources || prior.restrictSources,
    families: Object.fromEntries(mergedTopics.map((t) => [t, expandWithLearning(t)])),
  };
}

function unique(list) {
  const seen = new Set();
  const out = [];
  for (const item of list || []) {
    const key = String(item || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function searchFormsForTopic(word) {
  const forms = new Set(expandWithLearning(word));
  for (const alias of KJV_TOPIC_ALIASES[String(word).toLowerCase()] || []) {
    forms.add(alias);
    for (const extra of familyOf(alias)) forms.add(extra);
  }
  return [...forms];
}
