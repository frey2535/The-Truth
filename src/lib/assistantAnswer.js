import { familyHitsText } from "./wordFamilies.js";
import {
  baptismTiedToSalvation,
  hasBaptism,
  writeDetailedAnswer,
  writeUnderstanding,
  yesNoOpening,
} from "./literatureMeaning.js";

export { baptismTiedToSalvation, hasBaptism, yesNoOpening };

export const SALVATION_RELATED_SEARCHES = [
  "saved",
  "salvation",
  "believe",
  "repent",
  "baptize",
  "baptism",
  "confess",
  "call on the name",
  "call upon the name",
  "born again",
  "born of water",
  "everlasting life",
  "eternal life",
  "shall be saved",
  "remission of sins",
  "doeth the will of my Father",
  "enter into the kingdom of heaven",
  "obey not the gospel",
  "obey the gospel",
  "baptized into",
  "wash away thy sins",
  "by grace are ye saved",
  "confess with thy mouth",
  "washing of regeneration",
  "put on Christ",
];

const SOURCE_LABEL = {
  canon: "King James",
  apocrypha: "1611 Apocrypha / deuterocanon",
  enoch: "1 Enoch / 2 Enoch",
  dead_sea_scrolls: "Dead Sea Scrolls",
  fathers: "early Christian writings stored in this app",
  josephus: "Josephus",
  other: "early manuscript stored in this app",
  archaeology: "archaeological record stored in this app",
  science: "scientific / government science record stored in this app",
  government: "government document stored in this app",
  vatican: "catalogued manuscript stored in this app",
  modern: "dated public record stored in this app",
};

export function isYesNoQuestion(question) {
  const q = String(question || "").trim();
  if (!q) return false;
  if (/^\s*(what|who|where|when|why|how|which|list|explain|tell|describe|name)\b/i.test(q)) {
    return false;
  }
  return /^\s*(is|are|am|was|were|do|does|did|can|could|should|must|will|shall|has|have|had)\b/i.test(q);
}

export function questionKind(question, topics = []) {
  const q = String(question || "").toLowerCase();
  const words = [q, ...(topics || []).map((t) => String(t).toLowerCase())].join(" ");
  const baptism = /\bbaptis/i.test(words);
  const salvation = /\b(saved|salvation|be saved|eternal life|everlasting life)\b/i.test(words);
  if (baptism && salvation) return "baptism-salvation";
  if (salvation) return "salvation-duty";
  return "topic-family";
}

export function extraSearchesForKind(kind) {
  if (kind === "salvation-duty" || kind === "baptism-salvation") return [...SALVATION_RELATED_SEARCHES];
  return [];
}

export function looksMilitaryDeliverance(text) {
  return /\b(philistine|philistines|slew|smote|battle|war against|the army|enemies|host of|great deliverance)\b/i.test(
    String(text || "")
  );
}

function salvationDutyHit(text) {
  const t = String(text || "");
  if (looksMilitaryDeliverance(t)) return false;
  if (/\b(shall be saved|might be saved|may be saved|to be saved|unto salvation|everlasting life|eternal life)\b/i.test(t)) {
    return true;
  }
  if (/\b(call(?:ed|eth)? (?:upon|on) the name|born again|born of water|doeth the will of my father|obey not the gospel|obey the gospel|remission of sins|enter(?:eth)? into the kingdom)\b/i.test(t)) {
    return true;
  }
  if (/\b(saved|salvation)\b/i.test(t) && (familyHitsText(t, "believe") || familyHitsText(t, "repent") || familyHitsText(t, "confess") || familyHitsText(t, "grace"))) {
    return true;
  }
  return baptismTiedToSalvation(t);
}

export function verseRelatedToQuestion(row, asked) {
  const text = String(row?.text || "").trim();
  if (!text) return false;
  const kind = asked?.kind || "topic-family";
  if (kind === "salvation-duty" || kind === "baptism-salvation") {
    return salvationDutyHit(text);
  }
  const topic = asked?.topics || asked?.words || [];
  if (row.askedReference && !topic.length) return true;
  if (!topic.length) return false;
  return topic.some((w) => familyHitsText(text, w));
}

const CLUSTERS = [
  {
    id: "believe",
    heading: "Believe",
    test: (t) =>
      /\bbeliev/i.test(t) ||
      (/\bfaith\b/i.test(t) && /\b(saved|salvation|justif|eternal|everlasting)\b/i.test(t)),
  },
  { id: "repent", heading: "Repent", test: (t) => familyHitsText(t, "repent") },
  { id: "baptize", heading: "Be baptized", test: (t) => hasBaptism(t) },
  {
    id: "confess",
    heading: "Confess",
    test: (t) => familyHitsText(t, "confess") && /\b(lord|jesus|saved|salvation|mouth)\b/i.test(t),
  },
  {
    id: "call",
    heading: "Call on the name of the Lord",
    test: (t) => /\bcall(?:ed|eth|ing)? (?:upon|on) the name\b/i.test(t),
  },
  {
    id: "born",
    heading: "Be born again",
    test: (t) => /\bborn (again|of water|of the spirit)\b/i.test(t),
  },
  {
    id: "grace",
    heading: "Grace",
    test: (t) => familyHitsText(t, "grace") && /\b(saved|salvation)\b/i.test(t),
  },
  {
    id: "obey",
    heading: "Obey / do the will of the Father",
    test: (t) =>
      /\b(doeth the will of my father|obey not the gospel|obey the gospel|them that obey)\b/i.test(t),
  },
  {
    id: "kingdom",
    heading: "Enter the kingdom",
    test: (t) => /\benter(?:eth)? into the kingdom\b/i.test(t),
  },
  { id: "remission", heading: "Remission of sins", test: (t) => /\bremission of sins\b/i.test(t) },
];

export function clusterPassages(passages) {
  const used = new Set();
  const groups = [];
  for (const cluster of CLUSTERS) {
    const rows = (passages || []).filter((row) => cluster.test(String(row.text || "")));
    if (!rows.length) continue;
    rows.forEach((row) => used.add(passageKey(row)));
    groups.push({
      id: cluster.id,
      heading: cluster.heading,
      references: uniqueRefs(rows),
      passages: rows,
    });
  }
  const leftover = (passages || []).filter((row) => !used.has(passageKey(row)));
  if (leftover.length) {
    groups.push({
      id: "other",
      heading: "Other stored wording on this question",
      references: uniqueRefs(leftover),
      passages: leftover,
    });
  }
  return groups;
}

function uniqueRefs(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows || []) {
    const ref = String(row.reference || "").trim();
    if (!ref || seen.has(ref)) continue;
    seen.add(ref);
    out.push(ref);
  }
  return out;
}

function passageKey(row) {
  return `${row.source}|${row.reference}|${String(row.text || "").slice(0, 80)}`;
}

function sourceLabel(source) {
  return SOURCE_LABEL[source] || source || "stored text";
}

function escapeMd(s) {
  return String(s || "").trim();
}

function sortPassages(rows) {
  const rank = [
    "canon",
    "apocrypha",
    "enoch",
    "dead_sea_scrolls",
    "fathers",
    "josephus",
    "other",
  ];
  return [...(rows || [])].sort((a, b) => {
    const src = rank.indexOf(a.source) - rank.indexOf(b.source);
    if (src) return src;
    return (
      String(a.book || "").localeCompare(String(b.book || "")) ||
      Number(a.chapter) - Number(b.chapter) ||
      Number(a.verse) - Number(b.verse)
    );
  });
}

function writePassageBlock(lines, rows) {
  let lastGroup = "";
  for (const p of sortPassages(rows)) {
    const group = sourceLabel(p.source);
    if (group !== lastGroup) {
      lines.push(`#### ${group}`);
      lines.push("");
      lastGroup = group;
    }
    lines.push(`**${escapeMd(p.reference)}**`);
    lines.push(`> ${escapeMd(p.text)}`);
    lines.push("");
  }
}

export function writeAssistantAnswer(question, passages, asked) {
  const related = sortPassages((passages || []).filter((row) => verseRelatedToQuestion(row, asked)));
  const lines = [];
  lines.push("### Your question");
  lines.push(String(question || asked?.question || "").split("\n")[0]);
  lines.push("");
  const opening = yesNoOpening(asked, related);
  if (opening) {
    lines.push(opening);
    lines.push("");
  }
  if (!related.length) {
    lines.push("### Answer");
    lines.push("");
    lines.push("No stored passage in this app uses wording that belongs to this question.");
    lines.push("");
    return lines.join("\n");
  }
  writeUnderstanding(lines, related, asked);
  lines.push("### Answer");
  lines.push("");
  writeDetailedAnswer(lines, related, asked);
  lines.push("### All stored wording");
  lines.push("");
  lines.push(
    `${related.length} stored passage${related.length === 1 ? "" : "s"} were read for this understanding. Their wording is below.`
  );
  lines.push("");
  writePassageBlock(lines, related);
  return lines.join("\n");
}
