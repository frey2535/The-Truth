import { familyHitsText } from "./wordFamilies.js";

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
  "everlasting life",
  "eternal life",
  "shall be saved",
  "remission of sins",
  "doeth the will of my Father",
  "enter into the kingdom of heaven",
  "obey not the gospel",
  "obey the gospel",
  "baptized into",
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

function hasBaptism(text) {
  return familyHitsText(text, "baptism") || familyHitsText(text, "baptize");
}

function baptismTiedToSalvation(text) {
  const t = String(text || "");
  if (!hasBaptism(t)) return false;
  return /\b(save[dth]*|salvation|remission|justif|eternal|everlasting|into jesus|into christ|into his death|born of water|wash away thy sins)\b/i.test(
    t
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

export function yesNoOpening(asked, passages) {
  if (!asked?.yesNo) return "";
  const rows = passages || [];
  if (!rows.length) {
    return "**No.** After searching the stored texts, no wording that belongs to this question was found. Nothing was invented.";
  }
  if (asked.kind === "baptism-salvation") {
    const withBaptism = rows.filter((row) => baptismTiedToSalvation(row.text));
    const without = rows.filter((row) => !hasBaptism(row.text) && salvationDutyHit(row.text));
    if (withBaptism.length && without.length) {
      return "**The stored texts do not speak with one wording.** After reading every stored passage that belongs to this question, some name baptism with being saved, and some name believing, calling on the Lord, or doing the Father’s will without naming baptism in that verse. The list below is taken from those texts.";
    }
    if (withBaptism.length) {
      return "**Yes.** Stored texts name baptism together with being saved. Those texts, and every other stored passage that belongs to this question, are listed below.";
    }
    return "**No.** Stored texts that speak of being saved in this set do not name baptism in those verses. Every stored passage that belongs to this question is listed below.";
  }
  return "**Yes.** Stored texts that belong to this question were found. The list below is taken from them.";
}

function writeDetailedList(lines, passages, asked) {
  const groups = clusterPassages(passages);
  if (!groups.length) return;
  if (asked?.kind === "salvation-duty" || asked?.kind === "baptism-salvation") {
    lines.push("The stored texts that belong to this question name the following. The wording is theirs, not an added rule.");
    lines.push("");
  } else {
    lines.push("The stored texts that belong to this question say:");
    lines.push("");
  }
  let n = 1;
  for (const group of groups) {
    if (group.id === "other" && groups.length > 1) continue;
    lines.push(`${n}. **${group.heading}** — ${group.references.join("; ")}`);
    n += 1;
  }
  const other = groups.find((g) => g.id === "other");
  if (other && groups.length > 1) {
    lines.push(`${n}. **${other.heading}** — ${other.references.join("; ")}`);
  }
  lines.push("");
  lines.push("Every stored passage used for this answer is quoted below.");
  lines.push("");
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
  lines.push("### Answer");
  lines.push("");
  if (!related.length) {
    lines.push("No stored passage in this app uses wording that belongs to this question.");
    lines.push("");
  } else {
    writeDetailedList(lines, related, asked);
    lines.push("### All stored wording");
    lines.push("");
    lines.push(
      `${related.length} stored passage${related.length === 1 ? "" : "s"} belong to this question. Read them yourself.`
    );
    lines.push("");
    writePassageBlock(lines, related);
  }
  return lines.join("\n");
}
