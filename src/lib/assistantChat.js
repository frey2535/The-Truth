import { questionKind } from "./assistantAnswer.js";
import { lemmaOf } from "./wordFamilies.js";
import { topicTermsFrom } from "./questionTopics.js";

const FOLLOW_UP_RE =
  /^(and|also|what about|how about|why|more|continue|yes|no|again|same|that|those)\b/i;
const PRONOUN_RE = /\b(he|she|they|it|this|that|those|him|his|them|their)\b/i;
const SALVATION_STEMS = ["sav", "salv", "baptis", "baptiz", "repent", "grace", "gospel", "forgiv", "remiss"];

function topicsOf(question) {
  return topicTermsFrom(question).map((word) => lemmaOf(word)).filter(Boolean);
}

function salvationCluster(question, topics, kind) {
  if (kind === "salvation-duty" || kind === "baptism-salvation") return true;
  const hay = [question, ...topics].join(" ").toLowerCase();
  return SALVATION_STEMS.some((stem) => hay.includes(stem));
}

export function shouldStartNewChat(question, messages) {
  const q = String(question || "").trim();
  if (!q) return false;
  const lastUser = [...(messages || [])]
    .reverse()
    .find((row) => row?.role === "user" && String(row.content || "").trim());
  if (!lastUser) return false;
  if (FOLLOW_UP_RE.test(q)) return false;
  const nextTopics = topicsOf(q);
  if (!nextTopics.length) return false;
  if (PRONOUN_RE.test(q) && nextTopics.length <= 2) return false;

  const priorText = String(lastUser.content || "");
  const priorTopics = topicsOf(priorText);
  const nextKind = questionKind(q, nextTopics);
  const priorKind = questionKind(priorText, priorTopics);
  if (salvationCluster(q, nextTopics, nextKind) && salvationCluster(priorText, priorTopics, priorKind)) {
    return false;
  }
  const priorSet = new Set(priorTopics);
  if (nextTopics.some((topic) => priorSet.has(topic))) return false;
  return true;
}
