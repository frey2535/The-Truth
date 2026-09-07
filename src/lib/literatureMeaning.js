import { familyHitsText } from "./wordFamilies.js";

const GOSPELS = new Set(["Matthew", "Mark", "Luke", "John"]);

export function hasBaptism(text) {
  return familyHitsText(text, "baptism") || familyHitsText(text, "baptize");
}

export function baptismTiedToSalvation(text) {
  const t = String(text || "");
  if (!hasBaptism(t)) return false;
  return /\b(save[dth]*|salvation|remission|justif|eternal|everlasting|into jesus|into christ|into his death|born of water|wash away thy sins|put on christ)\b/i.test(
    t
  );
}

function textOf(row) {
  return String(row?.text || "").trim();
}

function refOf(row) {
  return String(row?.reference || "").trim();
}

function addClaim(out, row, claim) {
  out.push({
    ...claim,
    reference: refOf(row),
    source: row.source || "",
    book: row.book || "",
    text: textOf(row),
  });
}

/**
 * Read what a stored passage asserts. Patterns follow the wording, not a church rule.
 */
export function readClaims(row) {
  const t = textOf(row);
  if (!t) return [];
  const out = [];

  if (/\bbeliev/i.test(t) && hasBaptism(t) && /\bshall be saved\b/i.test(t)) {
    addClaim(out, row, {
      id: "believe-baptize-saved",
      duties: ["believe", "baptize"],
      baptismTied: true,
      direct: true,
      meaning:
        "believing and being baptized are joined in one sentence with being saved; not believing is named with being damned",
    });
  }
  if (/\bbaptism\b/i.test(t) && /\b(doth also now save|now save[sd]?)\b/i.test(t)) {
    addClaim(out, row, {
      id: "baptism-now-saves",
      duties: ["baptize"],
      baptismTied: true,
      direct: true,
      meaning:
        "baptism is said to save now, explained as the answer of a good conscience toward God by the resurrection, not the putting away of the filth of the flesh",
    });
  }
  if (hasBaptism(t) && /\bremission of sins\b/i.test(t) && familyHitsText(t, "repent")) {
    addClaim(out, row, {
      id: "repent-baptize-remission",
      duties: ["repent", "baptize"],
      baptismTied: true,
      direct: true,
      meaning: "repentance and baptism in the name of Jesus Christ are named for the remission of sins",
    });
  }
  if (hasBaptism(t) && /\bwash away thy sins\b/i.test(t)) {
    addClaim(out, row, {
      id: "baptize-wash-sins",
      duties: ["baptize"],
      baptismTied: true,
      direct: true,
      meaning: "being baptized is named with washing away sins, calling on the name of the Lord",
    });
  }
  if (/\bbaptized into\b/i.test(t) && /\b(jesus|christ|his death)\b/i.test(t)) {
    addClaim(out, row, {
      id: "baptized-into-christ",
      duties: ["baptize"],
      baptismTied: true,
      direct: true,
      meaning: "baptism is named as being baptized into Jesus Christ and into his death",
    });
  }
  if (/\bborn of water\b/i.test(t) && /\b(spirit|kingdom)\b/i.test(t)) {
    addClaim(out, row, {
      id: "born-of-water",
      duties: ["born"],
      baptismTied: true,
      direct: true,
      meaning: "a man must be born of water and of the Spirit to enter the kingdom of God",
    });
  }
  if (/\bput on christ\b/i.test(t) && hasBaptism(t)) {
    addClaim(out, row, {
      id: "put-on-christ",
      duties: ["baptize"],
      baptismTied: true,
      direct: true,
      meaning: "as many as were baptized into Christ have put on Christ",
    });
  }
  if (/\bbeliev/i.test(t) && /\b(everlasting life|eternal life)\b/i.test(t)) {
    addClaim(out, row, {
      id: "believe-everlasting-life",
      duties: ["believe"],
      baptismTied: false,
      direct: true,
      meaning: "whoever believes in the Son is given everlasting life and does not perish",
    });
  }
  if (/\bbeliev/i.test(t) && /\bshall be saved\b/i.test(t) && !hasBaptism(t)) {
    addClaim(out, row, {
      id: "believe-saved",
      duties: ["believe"],
      baptismTied: false,
      direct: true,
      meaning: "believing on the Lord is named with “shall be saved”",
    });
  }
  if (/\bcall(?:ed|eth)? (?:upon|on) the name\b/i.test(t) && /\bshall be saved\b/i.test(t)) {
    addClaim(out, row, {
      id: "call-saved",
      duties: ["call"],
      baptismTied: false,
      direct: true,
      meaning: "whoever calls on the name of the Lord shall be saved",
    });
  }
  if (familyHitsText(t, "confess") && /\b(mouth|lord jesus|shalt be saved|salvation)\b/i.test(t)) {
    addClaim(out, row, {
      id: "confess-believe-saved",
      duties: ["confess", "believe"],
      baptismTied: false,
      direct: true,
      meaning: "confessing the Lord Jesus with the mouth and believing in the heart are named with being saved",
    });
  }
  if (/\bby grace\b/i.test(t) && /\b(saved|salvation)\b/i.test(t)) {
    addClaim(out, row, {
      id: "grace-saved",
      duties: ["grace"],
      baptismTied: false,
      direct: true,
      meaning: "being saved is named as by grace, through faith, and not of yourselves / not of works",
    });
  }
  if (/\bdoeth the will of my father\b/i.test(t) || /\benter(?:eth)? into the kingdom\b/i.test(t)) {
    addClaim(out, row, {
      id: "do-fathers-will",
      duties: ["obey"],
      baptismTied: false,
      direct: true,
      meaning:
        "saying “Lord, Lord” is not enough to enter the kingdom; the one who does the will of the Father enters",
    });
  }
  if (/\bobey not the gospel\b/i.test(t) || /\bobey the gospel\b/i.test(t)) {
    addClaim(out, row, {
      id: "obey-gospel",
      duties: ["obey"],
      baptismTied: false,
      direct: true,
      meaning: "those who know not God and obey not the gospel are named under vengeance; the gospel is something to be obeyed",
    });
  }
  if (familyHitsText(t, "repent") && /\b(perish|remission|kingdom|baptis|sins)\b/i.test(t)) {
    addClaim(out, row, {
      id: "repent",
      duties: ["repent"],
      baptismTied: hasBaptism(t) && baptismTiedToSalvation(t),
      direct: true,
      meaning: "repentance is named as required, and in places it is joined to baptism and the remission of sins",
    });
  }
  if (/\bborn again\b/i.test(t)) {
    addClaim(out, row, {
      id: "born-again",
      duties: ["born"],
      baptismTied: false,
      direct: true,
      meaning: "a man must be born again to see the kingdom of God",
    });
  }
  if (/\bjustif/i.test(t) && /\bworks\b/i.test(t) && /\bfaith\b/i.test(t)) {
    addClaim(out, row, {
      id: "faith-works",
      duties: ["obey"],
      baptismTied: false,
      direct: true,
      meaning: "faith is named together with works; a man is said to be justified by works, and not by faith only",
    });
  }
  if (/\bwashing of regeneration\b/i.test(t) || (/\bhe saved us\b/i.test(t) && /\bwashing\b/i.test(t))) {
    addClaim(out, row, {
      id: "washing-regeneration",
      duties: ["baptize", "grace"],
      baptismTied: true,
      direct: true,
      meaning: "he saved us by the washing of regeneration and renewing of the Holy Ghost, not by works of righteousness which we have done",
    });
  }

  if (!out.length && baptismTiedToSalvation(t)) {
    addClaim(out, row, {
      id: "baptism-tied",
      duties: ["baptize"],
      baptismTied: true,
      direct: false,
      meaning: "baptism is named together with being saved, remission, or union with Christ",
    });
  }
  if (!out.length && /\b(shall be saved|everlasting life|eternal life|unto salvation)\b/i.test(t)) {
    addClaim(out, row, {
      id: "saved-result",
      duties: [],
      baptismTied: false,
      direct: false,
      meaning: "the passage names being saved or everlasting life",
    });
  }

  return out;
}

function uniqueRefs(rows, limit = 8) {
  const seen = new Set();
  const out = [];
  const ranked = [...(rows || [])].sort((a, b) => {
    const ac = a.source === "canon" ? 0 : 1;
    const bc = b.source === "canon" ? 0 : 1;
    if (ac !== bc) return ac - bc;
    const ag = GOSPELS.has(a.book) ? 0 : 1;
    const bg = GOSPELS.has(b.book) ? 0 : 1;
    return ag - bg;
  });
  for (const row of ranked) {
    const ref = refOf(row);
    if (!ref || seen.has(ref)) continue;
    seen.add(ref);
    out.push(ref);
    if (out.length >= limit) break;
  }
  return out;
}

function claimsOf(claims, id) {
  return claims.filter((c) => c.id === id);
}

function refsFor(claims, id, limit) {
  return uniqueRefs(claimsOf(claims, id), limit);
}

function hasClaim(claims, id) {
  return claims.some((c) => c.id === id);
}

function anyDuty(claims, duty) {
  return claims.some((c) => (c.duties || []).includes(duty));
}

/**
 * Combined reading of the literature. Believe-only verses do not cancel baptism-saves verses,
 * and baptism-saves verses do not cancel believing. The body of literature is read as a whole.
 */
export function understandLiterature(passages, asked) {
  const rows = passages || [];
  const claims = rows.flatMap((row) => readClaims(row));
  const tied = rows.filter((row) => baptismTiedToSalvation(row.text));
  const believeWithoutBaptism = rows.filter(
    (row) => !hasBaptism(row.text) && (/\bbeliev/i.test(row.text) || /\bcall(?:ed|eth)? (?:upon|on) the name\b/i.test(row.text))
  );
  const deniedBaptism = rows.filter((row) =>
    /\b(baptism (?:is|doth|does) not|not (?:by |of )?baptism|baptism cannot|need not be baptized|need not baptiz)\b/i.test(
      String(row.text || "")
    )
  );

  let verdict = "";
  let verdictReason = "";
  if (asked?.yesNo) {
    if (!rows.length) {
      verdict = "No";
      verdictReason = "No stored passage belonging to this question was found.";
    } else if (asked.kind === "baptism-salvation") {
      if (tied.length && !deniedBaptism.length) {
        verdict = "Yes";
        verdictReason =
          "Read together, the literature names baptism with being saved, the remission of sins, and union with Christ. Verses that name believing or calling on the Lord without mentioning baptism in that sentence do not say baptism is unnecessary; they add believing and calling, which the baptism passages also require.";
      } else if (!tied.length) {
        verdict = "No";
        verdictReason =
          "The stored passages that speak of being saved in this set do not name baptism with being saved.";
      } else {
        verdict = "Yes";
        verdictReason =
          "Some wording complicates baptism, but the passages that speak directly of baptism and salvation still name baptism as saving or for the remission of sins. The combined reading still includes baptism.";
      }
    } else {
      verdict = "Yes";
      verdictReason = "Stored literature belonging to this question was found and was read for meaning.";
    }
  }

  return {
    rows,
    claims,
    tied,
    believeWithoutBaptism,
    deniedBaptism,
    verdict,
    verdictReason,
    asked,
  };
}

export function yesNoOpening(asked, passages) {
  if (!asked?.yesNo) return "";
  const reading = understandLiterature(passages, asked);
  if (!reading.verdict) return "";
  if (asked.kind === "baptism-salvation" && reading.verdict === "Yes") {
    return `**Yes.** ${reading.verdictReason}`;
  }
  if (reading.verdict === "No") {
    return `**No.** ${reading.verdictReason}`;
  }
  return `**Yes.** ${reading.verdictReason}`;
}

function lineWithRefs(label, meaning, refs) {
  if (!refs.length) return `${label} ${meaning}`;
  return `${label} ${meaning} (${refs.join("; ")}).`;
}

export function writeUnderstanding(lines, passages, asked) {
  const reading = understandLiterature(passages, asked);
  const { claims } = reading;
  const kind = asked?.kind || "topic-family";

  lines.push("### Understanding of the literature");
  lines.push("");
  lines.push(
    "Every stored passage that belongs to this question was read for what it means, then the whole body of that literature was taken together. A verse that names one duty does not cancel a verse that names another. Nothing outside these writings was used."
  );
  lines.push("");

  if (kind === "salvation-duty" || kind === "baptism-salvation") {
    writeSalvationUnderstanding(lines, reading, asked);
    return reading;
  }

  writeTopicUnderstanding(lines, passages, asked, claims);
  return reading;
}

function writeSalvationUnderstanding(lines, reading, asked) {
  const { claims, tied, believeWithoutBaptism } = reading;

  if (hasClaim(claims, "believe-everlasting-life") || hasClaim(claims, "believe-saved")) {
    const refs = [...refsFor(claims, "believe-everlasting-life", 4), ...refsFor(claims, "believe-saved", 4)];
    lines.push(
      lineWithRefs(
        "**Believing.**",
        "The literature means that whoever believes in the Son / on the Lord is given everlasting life and shall be saved. That meaning stands in the Gospels and the Acts and is never taken back by the rest of the stored writings on this question.",
        [...new Set(refs)].slice(0, 6)
      )
    );
    lines.push("");
  }

  if (hasClaim(claims, "repent") || hasClaim(claims, "repent-baptize-remission")) {
    const refs = [...refsFor(claims, "repent-baptize-remission", 4), ...refsFor(claims, "repent", 4)];
    lines.push(
      lineWithRefs(
        "**Repenting.**",
        "The literature means that repentance is not optional wording. It is named so that sins may be remitted, and it is spoken in the same breath as baptism.",
        [...new Set(refs)].slice(0, 6)
      )
    );
    lines.push("");
  }

  if (tied.length) {
    const parts = [];
    if (hasClaim(claims, "believe-baptize-saved")) {
      parts.push(
        `Mark and like wording mean that the one who believes and is baptized shall be saved (${refsFor(claims, "believe-baptize-saved", 3).join("; ") || "Mark 16:16"})`
      );
    }
    if (hasClaim(claims, "repent-baptize-remission")) {
      parts.push(
        `Peter’s words at the beginning of the church mean repent and be baptized for the remission of sins (${refsFor(claims, "repent-baptize-remission", 3).join("; ") || "Acts 2:38"})`
      );
    }
    if (hasClaim(claims, "baptism-now-saves")) {
      parts.push(
        `Peter later means that baptism now saves, as a figure of the flood, by the resurrection of Jesus Christ (${refsFor(claims, "baptism-now-saves", 3).join("; ") || "1 Peter 3:21"})`
      );
    }
    if (hasClaim(claims, "baptized-into-christ")) {
      parts.push(
        `Paul means baptism as being baptized into Jesus Christ and into his death (${refsFor(claims, "baptized-into-christ", 4).join("; ") || "Romans 6"})`
      );
    }
    if (hasClaim(claims, "born-of-water")) {
      parts.push(
        `Jesus means that entering the kingdom requires being born of water and of the Spirit (${refsFor(claims, "born-of-water", 3).join("; ") || "John 3:5"})`
      );
    }
    if (hasClaim(claims, "baptize-wash-sins")) {
      parts.push(
        `Ananias means arise, be baptized, and wash away sins, calling on the name of the Lord (${refsFor(claims, "baptize-wash-sins", 3).join("; ")})`
      );
    }
    if (hasClaim(claims, "put-on-christ")) {
      parts.push(
        `Those baptized into Christ have put on Christ (${refsFor(claims, "put-on-christ", 3).join("; ")})`
      );
    }
    if (hasClaim(claims, "washing-regeneration")) {
      parts.push(
        `Saving is also named as the washing of regeneration and renewing of the Holy Ghost (${refsFor(claims, "washing-regeneration", 3).join("; ")})`
      );
    }
    if (!parts.length) {
      parts.push("baptism is named together with being saved, remission, or union with Christ");
    }
    lines.push(`**Baptism.** ${parts.join(". ")}.`);
    lines.push("");
  }

  if (hasClaim(claims, "call-saved")) {
    lines.push(
      lineWithRefs(
        "**Calling on the name.**",
        "The literature means that whoever calls on the name of the Lord shall be saved. In the same book that sentence is immediately followed by the call to repent and be baptized, so calling is not read as a way around the rest of the wording.",
        refsFor(claims, "call-saved", 4)
      )
    );
    lines.push("");
  }

  if (hasClaim(claims, "confess-believe-saved")) {
    lines.push(
      lineWithRefs(
        "**Confessing.**",
        "The literature means that the mouth confesses the Lord Jesus and the heart believes unto righteousness, and that this is named with being saved.",
        refsFor(claims, "confess-believe-saved", 4)
      )
    );
    lines.push("");
  }

  if (hasClaim(claims, "born-again") || hasClaim(claims, "born-of-water")) {
    const refs = [...refsFor(claims, "born-again", 3), ...refsFor(claims, "born-of-water", 3)];
    lines.push(
      lineWithRefs(
        "**New birth.**",
        "The literature means a man must be born again, and Jesus names that birth as of water and of the Spirit if he is to enter the kingdom.",
        [...new Set(refs)].slice(0, 6)
      )
    );
    lines.push("");
  }

  if (hasClaim(claims, "grace-saved")) {
    lines.push(
      lineWithRefs(
        "**Grace.**",
        "The literature means salvation is by grace through faith, not of yourselves, not of works, so that no man may boast. That meaning is kept. It is not used to erase the passages that name believing, repenting, and baptism as the way that grace is received in the same literature.",
        refsFor(claims, "grace-saved", 4)
      )
    );
    lines.push("");
  }

  if (hasClaim(claims, "do-fathers-will") || hasClaim(claims, "obey-gospel") || hasClaim(claims, "faith-works")) {
    const refs = [
      ...refsFor(claims, "do-fathers-will", 3),
      ...refsFor(claims, "obey-gospel", 3),
      ...refsFor(claims, "faith-works", 3),
    ];
    lines.push(
      lineWithRefs(
        "**Doing the Father’s will / obeying the gospel.**",
        "The literature means that a confession of “Lord” without doing the Father’s will does not enter the kingdom, that the gospel is obeyed, and that faith is not left alone as a word without what the texts command.",
        [...new Set(refs)].slice(0, 8)
      )
    );
    lines.push("");
  }

  if (asked?.kind === "baptism-salvation" && believeWithoutBaptism.length && tied.length) {
    const believeRefs = uniqueRefs(believeWithoutBaptism, 6);
    const tiedRefs = uniqueRefs(tied, 6);
    lines.push(
      `**How the whole literature reads together.** John and other verses name believing and calling on the Lord for life and salvation without saying the word baptism in that sentence (${believeRefs.join("; ")}). Mark, Acts, Romans, and Peter name baptism with being saved, remission of sins, or being baptized into Christ (${tiedRefs.join("; ")}). Read as one literature, those are not two religions. The believe-and-live verses state the trust the other verses also require. They do not say “do not be baptized.” The baptism verses state what the believer is commanded to do, and they still require believing. The understanding of all the stored literature is that baptism is required for salvation, together with believing, repenting, and obeying — not instead of them.`
    );
    lines.push("");
  } else if (asked?.kind === "salvation-duty") {
    lines.push(
      "**How the whole literature reads together.** The stored writings do not give a single isolated word as the whole answer. They name believing, repenting, confessing, calling on the Lord, being baptized, being born of water and of the Spirit, grace, and doing the Father’s will. The meaning of the body of literature is that a person is saved in the way all of that wording is kept, not by choosing one verse and discarding the rest."
    );
    lines.push("");
  }
}

function writeTopicUnderstanding(lines, passages, asked, claims) {
  const topics = asked?.topics || asked?.words || [];
  const topic = topics.join(", ") || "this question";
  const specific = claims.filter((c) => c.direct && c.meaning);
  if (specific.length) {
    const seen = new Set();
    let n = 0;
    for (const claim of specific) {
      const key = `${claim.id}|${claim.reference}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`- ${claim.reference}: ${claim.meaning}.`);
      n += 1;
      if (n >= 12) break;
    }
    lines.push("");
    lines.push(`Read together, that is the meaning of the stored literature on ${topic}.`);
    lines.push("");
    return;
  }

  const sample = uniqueRefs(passages, 10);
  lines.push(
    `The stored writings that belong to this question speak of ${topic}. Their meaning is taken from their own sentences, which are quoted in full below${sample.length ? ` (including ${sample.join("; ")})` : ""}.`
  );
  lines.push("");
}

const DUTY_STEPS = [
  {
    id: "believe",
    heading: "Believe on the Lord Jesus Christ",
    match: (reading) => anyDuty(reading.claims, "believe") || hasClaim(reading.claims, "believe-everlasting-life"),
    meaning:
      "Trust what these texts say of the Son: whoever believes in him is given everlasting life and shall be saved. Mark joins that believing to baptism in the same command.",
    claimIds: ["believe-everlasting-life", "believe-saved", "believe-baptize-saved", "confess-believe-saved"],
  },
  {
    id: "repent",
    heading: "Repent",
    match: (reading) => anyDuty(reading.claims, "repent"),
    meaning:
      "Turn from sin as the texts command. Peter names repentance with baptism for the remission of sins.",
    claimIds: ["repent-baptize-remission", "repent"],
  },
  {
    id: "confess",
    heading: "Confess the Lord Jesus",
    match: (reading) => anyDuty(reading.claims, "confess"),
    meaning: "Confess with the mouth the Lord Jesus, and believe in the heart that God raised him from the dead.",
    claimIds: ["confess-believe-saved"],
  },
  {
    id: "call",
    heading: "Call on the name of the Lord",
    match: (reading) => anyDuty(reading.claims, "call"),
    meaning:
      "Call on the name of the Lord, as the texts say whoever does so shall be saved. In Acts that call is the same hour as repent and be baptized.",
    claimIds: ["call-saved", "baptize-wash-sins"],
  },
  {
    id: "baptize",
    heading: "Be baptized",
    match: (reading) => reading.tied.length > 0 || anyDuty(reading.claims, "baptize"),
    meaning:
      "Be baptized in the name of Jesus Christ. The literature means this is for the remission of sins, that baptism now saves, and that in it a person is baptized into Christ and into his death.",
    claimIds: [
      "believe-baptize-saved",
      "repent-baptize-remission",
      "baptism-now-saves",
      "baptized-into-christ",
      "baptize-wash-sins",
      "put-on-christ",
    ],
  },
  {
    id: "born",
    heading: "Be born of water and of the Spirit",
    match: (reading) => anyDuty(reading.claims, "born") || hasClaim(reading.claims, "born-of-water"),
    meaning: "Receive the new birth Jesus names: born again, born of water and of the Spirit, to enter the kingdom of God.",
    claimIds: ["born-of-water", "born-again"],
  },
  {
    id: "grace",
    heading: "Be saved by grace through faith",
    match: (reading) => anyDuty(reading.claims, "grace") || hasClaim(reading.claims, "grace-saved"),
    meaning:
      "Do not treat this as a work you invented. The literature means it is by grace through faith, and then it still names the things grace commands.",
    claimIds: ["grace-saved", "washing-regeneration"],
  },
  {
    id: "obey",
    heading: "Do the will of the Father / obey the gospel",
    match: (reading) => anyDuty(reading.claims, "obey"),
    meaning:
      "Do the will of the Father. The literature means “Lord, Lord” without that will does not enter the kingdom, and those who obey not the gospel are named under judgment.",
    claimIds: ["do-fathers-will", "obey-gospel", "faith-works"],
  },
];

export function writeDetailedAnswer(lines, passages, asked) {
  const reading = understandLiterature(passages, asked);
  const kind = asked?.kind || "topic-family";

  if (kind === "salvation-duty" || kind === "baptism-salvation") {
    if (kind === "baptism-salvation" && asked?.yesNo && reading.verdict === "Yes") {
      lines.push(
        "According to that understanding: **yes, baptism is required for salvation** in the stored literature. It is required together with believing and repenting. It is not a replacement for them, and the believe-only sentences are not a cancellation of it."
      );
      lines.push("");
    } else {
      lines.push(
        "According to that understanding, this is what the stored literature tells a person to do to be saved. The list is the combined meaning of the writings, not a rule added on top of them."
      );
      lines.push("");
    }
    let n = 1;
    for (const step of DUTY_STEPS) {
      if (!step.match(reading)) continue;
      const refs = [...new Set(step.claimIds.flatMap((id) => refsFor(reading.claims, id, 4)))].slice(0, 8);
      lines.push(`${n}. **${step.heading}.** ${step.meaning}${refs.length ? ` ${refs.join("; ")}.` : ""}`);
      n += 1;
    }
    if (n === 1) {
      lines.push("The passages below name being saved. Read their meaning in their own sentences.");
    }
    lines.push("");
    lines.push("Every stored passage used for this understanding is quoted below.");
    lines.push("");
    return;
  }

  const groups = groupTopicMeanings(passages, asked);
  lines.push("According to the meaning of the stored literature:");
  lines.push("");
  let n = 1;
  for (const group of groups) {
    lines.push(`${n}. **${group.heading}.** ${group.meaning} ${group.references.join("; ")}.`);
    n += 1;
  }
  lines.push("");
  lines.push("Every stored passage used for this understanding is quoted below.");
  lines.push("");
}

function groupTopicMeanings(passages, asked) {
  const topics = asked?.topics || asked?.words || [];
  const claims = (passages || []).flatMap((row) => readClaims(row));
  const byId = new Map();
  for (const claim of claims) {
    if (!claim.direct) continue;
    if (!byId.has(claim.id)) {
      byId.set(claim.id, { heading: claim.meaning.split(" ")[0] || claim.id, meaning: claim.meaning, references: [] });
    }
    const g = byId.get(claim.id);
    if (claim.reference && !g.references.includes(claim.reference) && g.references.length < 8) {
      g.references.push(claim.reference);
    }
    g.heading = titleFromMeaning(claim.meaning);
  }
  if (byId.size) return [...byId.values()];
  return [
    {
      heading: topics[0] || "The stored wording",
      meaning: "The writings that belong to this question use the words you asked about in the sentences quoted below.",
      references: uniqueRefs(passages, 8),
    },
  ];
}

function titleFromMeaning(meaning) {
  const t = String(meaning || "");
  if (/^baptism/i.test(t)) return "Baptism";
  if (/^believ/i.test(t)) return "Believing";
  if (/^whoever believes/i.test(t)) return "Believing";
  if (/^repent/i.test(t)) return "Repenting";
  if (/^confess/i.test(t)) return "Confessing";
  if (/calling|calls on the name/i.test(t)) return "Calling on the name";
  if (/grace/i.test(t)) return "Grace";
  if (/Father|gospel|justif/i.test(t)) return "Obedience";
  if (/born/i.test(t)) return "New birth";
  return t.slice(0, 42);
}
