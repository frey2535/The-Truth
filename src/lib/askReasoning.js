import { familyHitsText } from "./wordFamilies.js";

const PERMIT =
  /\b(lawful|is it lawful|may|allowed|permit(?:ted)?|suffer(?:ed)?|free to|not forbidden|not unclean)\b/i;
const FORBID =
  /\b(shall not|shalt not|do not|thou shalt not|ye shall not|forbidden|abomination|adultery|except it be|hardness of (?:your )?heart|put away|writing of divorcement|bill of divorcement)\b/i;
const COMMAND =
  /\b(thou shalt|ye shall|command(?:ed|eth|ment)?|must|ought|require(?:d)?|it is written)\b/i;
const DEFINITION =
  /\b(is|are|was|were|means|meaneth|called|named|this is|he is|she is|who is)\b/i;

/** Topic aliases used while reading passages — kept here to avoid pulling the full corpus loader. */
const TOPIC_ALIASES = {
  divorce: ["divorcement", "put away", "writing of divorcement", "bill of divorcement"],
  divorcement: ["divorce", "put away"],
  marriage: ["marry", "married", "wife", "husband", "wedlock", "one flesh", "bride", "bridegroom"],
  marry: ["marriage", "married", "wife", "husband"],
  tithing: ["tithe", "tithes", "tenth", "tenth part", "firstfruits", "storehouse"],
  tithe: ["tithes", "tithing", "tenth", "tenth part"],
  tithes: ["tithe", "tithing", "tenth"],
  forgive: ["forgiveness", "remission", "forgiven", "forgiving"],
  forgiveness: ["forgive", "remission", "forgiven", "forgiving"],
};

export function questionIntent(question) {
  const q = String(question || "").trim();
  if (!q) return "general";
  if (/^\s*(compare|contrast)\b/i.test(q) || /\b(?:vs\.?|versus|compared to|difference between)\b/i.test(q)) {
    return "compare";
  }
  if (/^\s*(who|whom)\b/i.test(q) || /\bidentify\b/i.test(q)) return "identify";
  if (/^\s*(define|what (?:is|are|does .+ mean))\b/i.test(q)) return "define";
  if (/^\s*(explain|describe|tell me about)\b/i.test(q) || /\bhow (?:does|do|did|can|should)\b/i.test(q)) {
    return "explain";
  }
  if (/^\s*(list|name|which|where)\b/i.test(q)) return "list";
  if (/^\s*(is|are|am|was|were|do|does|did|can|could|should|must|will|shall|has|have|had)\b/i.test(q)) {
    return "yesno";
  }
  return "general";
}

function topicHit(text, topic) {
  const t = String(text || "");
  if (familyHitsText(t, topic)) return true;
  const aliases = TOPIC_ALIASES[String(topic || "").toLowerCase()] || [];
  return aliases.some((alias) => {
    const needle = String(alias || "").toLowerCase();
    if (!needle) return false;
    if (needle.includes(" ")) return t.toLowerCase().includes(needle);
    return familyHitsText(t, alias);
  });
}

function sentencesOf(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.?;:])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

function stanceOf(sentence, topics) {
  const t = String(sentence || "");
  const about = (topics || []).some((topic) => topicHit(t, topic));
  if (!about && topics?.length) return null;
  if (FORBID.test(t) && PERMIT.test(t)) return "qualified";
  if (FORBID.test(t)) return "forbid";
  if (PERMIT.test(t)) return "permit";
  if (COMMAND.test(t)) return "command";
  if (DEFINITION.test(t)) return "define";
  return "teach";
}

/**
 * Read what each related passage asserts about the asked topics.
 * Keeps the agent on stored wording — no invented doctrine.
 */
export function extractAssertions(passages, topics = []) {
  const out = [];
  for (const row of passages || []) {
    const text = String(row?.text || "").trim();
    if (!text) continue;
    const hits = topics.length ? topics.filter((topic) => topicHit(text, topic)) : [];
    if (topics.length && !hits.length) continue;
    const sentences = sentencesOf(text);
    const focused =
      sentences.filter((s) => !topics.length || topics.some((topic) => topicHit(s, topic))) || [];
    const pick = (focused.length ? focused : sentences).slice(0, 2);
    for (const sentence of pick) {
      const stance = stanceOf(sentence, topics);
      if (!stance) continue;
      out.push({
        reference: String(row.reference || "").trim(),
        source: row.source || "",
        book: row.book || "",
        topics: hits.length ? hits : topics,
        stance,
        meaning: sentence,
        text,
      });
    }
    if (!pick.length) {
      out.push({
        reference: String(row.reference || "").trim(),
        source: row.source || "",
        book: row.book || "",
        topics: hits,
        stance: "teach",
        meaning: text.slice(0, 280),
        text,
      });
    }
  }
  return out;
}

function uniqueByRef(rows, limit = 8) {
  const seen = new Set();
  const out = [];
  for (const row of rows || []) {
    const ref = String(row.reference || "").trim();
    if (!ref || seen.has(ref)) continue;
    seen.add(ref);
    out.push(ref);
    if (out.length >= limit) break;
  }
  return out;
}

function groupByStance(assertions) {
  const map = new Map();
  for (const row of assertions || []) {
    if (!map.has(row.stance)) map.set(row.stance, []);
    map.get(row.stance).push(row);
  }
  return map;
}

function groupByTopic(assertions, topics) {
  return (topics || []).map((topic) => ({
    topic,
    rows: (assertions || []).filter((row) => (row.topics || []).some((t) => String(t).toLowerCase() === String(topic).toLowerCase()) || topicHit(row.meaning, topic)),
  }));
}

export function reasonFromLiterature(passages, asked = {}) {
  const topics = asked.topics || asked.words || [];
  const intent = asked.intent || questionIntent(asked.question || "");
  const assertions = extractAssertions(passages, topics);
  const byStance = groupByStance(assertions);
  const forbid = byStance.get("forbid") || [];
  const permit = byStance.get("permit") || [];
  const qualified = byStance.get("qualified") || [];
  const command = byStance.get("command") || [];
  const define = byStance.get("define") || [];
  const teach = byStance.get("teach") || [];

  let verdict = "";
  let verdictReason = "";
  if (intent === "yesno" || asked.yesNo) {
    if (!assertions.length) {
      verdict = "No";
      verdictReason = "No stored passage belonging to this question was found.";
    } else if (forbid.length && !permit.length) {
      verdict = "No";
      verdictReason = `The stored wording that speaks to this question forbids or restricts it (${uniqueByRef(forbid, 5).join("; ")}).`;
    } else if (permit.length && !forbid.length) {
      verdict = "Yes";
      verdictReason = `The stored wording that speaks to this question permits or affirms it (${uniqueByRef(permit, 5).join("; ")}).`;
    } else if (forbid.length && permit.length) {
      verdict = "Qualified";
      verdictReason = `Some stored wording permits or names the matter (${uniqueByRef(permit, 4).join("; ")}), while other wording forbids or limits it (${uniqueByRef(forbid, 4).join("; ")}). The passages must be read together.`;
    } else if (command.length) {
      verdict = "Yes";
      verdictReason = `The stored literature commands or requires what you asked about (${uniqueByRef(command, 5).join("; ")}).`;
    } else {
      verdict = "See the literature";
      verdictReason =
        "Stored passages belonging to this question were found. Their own sentences below show what they teach; they do not reduce to a bare yes or no without reading them.";
    }
  }

  return {
    intent,
    topics,
    assertions,
    forbid,
    permit,
    qualified,
    command,
    define,
    teach,
    topicGroups: groupByTopic(assertions, topics),
    verdict,
    verdictReason,
  };
}

export function writeReasonedUnderstanding(lines, passages, asked) {
  const reading = reasonFromLiterature(passages, asked);
  const topicLabel = reading.topics.join(", ") || "this question";

  lines.push("### Understanding of the literature");
  lines.push("");
  lines.push(
    "The Assistant read the question, found every stored writing that belongs to it, and took the meaning from those sentences. Nothing outside the texts stored in this app was used."
  );
  lines.push("");

  if (reading.intent === "compare" && reading.topicGroups.length >= 2) {
    lines.push("**Comparison from the stored writings.**");
    lines.push("");
    for (const group of reading.topicGroups) {
      if (!group.rows.length) {
        lines.push(`- **${group.topic}:** no direct stored wording was found for this term in the gathered passages.`);
        continue;
      }
      const sample = group.rows.slice(0, 3).map((row) => `${row.reference}: ${row.meaning}`);
      lines.push(`- **${group.topic}:** ${sample.join(" · ")}`);
    }
    lines.push("");
    lines.push(
      "Read side by side, those are the meanings the stored literature gives each term. The answer below keeps both without discarding either."
    );
    lines.push("");
    return reading;
  }

  if (reading.intent === "identify" || reading.intent === "define") {
    const defs = [...reading.define, ...reading.teach].slice(0, 8);
    if (defs.length) {
      lines.push(`**Identification from the stored writings on ${topicLabel}.**`);
      lines.push("");
      for (const row of defs) {
        lines.push(`- ${row.reference}: ${row.meaning}`);
      }
      lines.push("");
    }
    return reading;
  }

  const highlights = [];
  if (reading.command.length) {
    highlights.push(
      `**Commands / requirements.** ${reading.command
        .slice(0, 4)
        .map((row) => `${row.reference}: ${row.meaning}`)
        .join(" · ")}`
    );
  }
  if (reading.forbid.length) {
    highlights.push(
      `**Restrictions / prohibitions.** ${reading.forbid
        .slice(0, 4)
        .map((row) => `${row.reference}: ${row.meaning}`)
        .join(" · ")}`
    );
  }
  if (reading.permit.length) {
    highlights.push(
      `**Permissions / affirmations.** ${reading.permit
        .slice(0, 4)
        .map((row) => `${row.reference}: ${row.meaning}`)
        .join(" · ")}`
    );
  }
  if (reading.qualified.length) {
    highlights.push(
      `**Qualified wording.** ${reading.qualified
        .slice(0, 3)
        .map((row) => `${row.reference}: ${row.meaning}`)
        .join(" · ")}`
    );
  }
  if (!highlights.length) {
    const sample = reading.assertions.slice(0, 6);
    if (sample.length) {
      lines.push(`**What the stored writings say about ${topicLabel}.**`);
      lines.push("");
      for (const row of sample) {
        lines.push(`- ${row.reference}: ${row.meaning}`);
      }
      lines.push("");
    } else {
      lines.push(
        `No clear topic sentence was isolated, so the answer rests on the full stored passages quoted below for ${topicLabel}.`
      );
      lines.push("");
    }
    return reading;
  }

  for (const line of highlights) {
    lines.push(line);
    lines.push("");
  }
  lines.push(
    `Taken together, that is the meaning of the stored literature on ${topicLabel}. The detailed answer keeps every strand above; it does not pick one verse and discard the rest.`
  );
  lines.push("");
  return reading;
}

export function writeReasonedAnswer(lines, passages, asked) {
  const reading = reasonFromLiterature(passages, asked);

  if (reading.verdict === "Yes" || reading.verdict === "No" || reading.verdict === "Qualified") {
    lines.push(`**${reading.verdict}.** ${reading.verdictReason}`);
    lines.push("");
  } else if (reading.verdict) {
    lines.push(`${reading.verdictReason}`);
    lines.push("");
  }

  if (reading.intent === "compare" && reading.topicGroups.length >= 2) {
    lines.push("According to the stored literature, compared:");
    lines.push("");
    let n = 1;
    for (const group of reading.topicGroups) {
      const refs = uniqueByRef(group.rows, 6);
      const meaning =
        group.rows[0]?.meaning ||
        `The gathered passages that name “${group.topic}” are quoted below.`;
      lines.push(`${n}. **${group.topic}.** ${meaning}${refs.length ? ` (${refs.join("; ")})` : ""}.`);
      n += 1;
    }
    lines.push("");
    lines.push("Every stored passage used for this understanding is quoted below.");
    lines.push("");
    return reading;
  }

  if (reading.intent === "identify" || reading.intent === "define") {
    const defs = [...reading.define, ...reading.teach].slice(0, 6);
    if (defs.length) {
      lines.push("According to the stored literature:");
      lines.push("");
      let n = 1;
      for (const row of defs) {
        lines.push(`${n}. **${row.reference}.** ${row.meaning}`);
        n += 1;
      }
      lines.push("");
    }
    lines.push("Every stored passage used for this understanding is quoted below.");
    lines.push("");
    return reading;
  }

  const groups = [];
  if (reading.command.length) {
    groups.push({
      heading: "What is commanded",
      meaning: reading.command[0].meaning,
      references: uniqueByRef(reading.command, 8),
    });
  }
  if (reading.forbid.length) {
    groups.push({
      heading: "What is forbidden or limited",
      meaning: reading.forbid[0].meaning,
      references: uniqueByRef(reading.forbid, 8),
    });
  }
  if (reading.permit.length) {
    groups.push({
      heading: "What is permitted or affirmed",
      meaning: reading.permit[0].meaning,
      references: uniqueByRef(reading.permit, 8),
    });
  }
  if (reading.teach.length && groups.length < 3) {
    groups.push({
      heading: "What the writings teach",
      meaning: reading.teach[0].meaning,
      references: uniqueByRef(reading.teach, 8),
    });
  }
  if (!groups.length) {
    groups.push({
      heading: reading.topics[0] || "The stored wording",
      meaning: "The writings that belong to this question use the words you asked about in the sentences quoted below.",
      references: uniqueByRef(passages, 8),
    });
  }

  lines.push("According to the meaning of the stored literature:");
  lines.push("");
  let n = 1;
  for (const group of groups) {
    lines.push(
      `${n}. **${group.heading}.** ${group.meaning}${group.references.length ? ` ${group.references.join("; ")}.` : ""}`
    );
    n += 1;
  }
  lines.push("");
  lines.push("Every stored passage used for this understanding is quoted below.");
  lines.push("");
  return reading;
}

export function reasonedYesNoOpening(asked, passages) {
  if (!asked?.yesNo) return "";
  const reading = reasonFromLiterature(passages, asked);
  if (!reading.verdict) return "";
  if (reading.verdict === "See the literature") return "";
  return `**${reading.verdict}.** ${reading.verdictReason}`;
}
