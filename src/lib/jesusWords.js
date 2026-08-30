/**
 * Red-letter ranges from the traditional King James marking of Jesus' spoken words.
 * Wording is never invented here — only stored verses are colored.
 */

const ALIASES = {
  matthew: "Matthew",
  matt: "Matthew",
  mark: "Mark",
  luke: "Luke",
  john: "John",
  acts: "Acts",
  "acts of the apostles": "Acts",
  revelation: "Revelation",
  rev: "Revelation",
  apocalypse: "Revelation",
  "1 corinthians": "1 Corinthians",
  "i corinthians": "1 Corinthians",
};

const SPECS = {
  Matthew:
    "3:15;4:4,7,10,17,19;5:3-48;6:1-34;7:1-27;8:3-4,7,10-13,20,22,26,32;9:2,4-6,9,12-13,15-17,22,24,28-30,37-38;10:5-42;11:4-19,21-30;12:3-8,11-13,25-37,39-45,48-50;13:3-9,11-33,37-52,57;14:16,18,27,29,31;15:3-11,13-14,16-20,24,26,28,32,34;16:2-4,6,8-11,13,15,17-19,23-28;17:7,9,11-12,17,20-23,25-27;18:3-20,22-35;19:4-12,14,17-19,21,23-24,26,28-30;20:1-16,18-19,21-23,25-28,32;21:2-3,13,16,19,21-22,24-25,27-44;22:2-14,18-21,29-32,37-40,42-45;23:2-39;24:2,4-51;25:1-46;26:2,10-13,18,21,23-29,31-32,34,36,38-42,45-46,50,52-56,64;27:11,46;28:9-10,18-20",
  Mark:
    "1:15,17,25,38,41,44;2:5,8-11,14,17,19-22,25-28;3:3-5,23-29,33-35;4:3-32,35,39-40;5:8-9,19,30,34,36,39,41;6:4,10-11,31,37-38,50;7:6-23,27,29,34;8:2-3,5,12,15,17-21,26-27,29,33-38;9:1,12-13,16,19,21,23,25,29,31,33,35-37,39-50;10:3,5-9,11-12,14-15,18-21,23-25,27,29-31,33-34,36,38-40,42-45,51-52;11:2-3,14,17,22-26,29-30,33;12:1-11,15-17,24-27,29-31,35-40,43-44;13:2,5-37;14:6-9,13-15,18,20-25,27-28,30,32,34,36-38,41-42,48-49,62;15:2,34;16:15-18",
  Luke:
    "2:49;4:4,8,12,18-21,23-27,35,43;5:4,10,13-14,20,22-24,27,31-32,34-39;6:3-5,8-10,20-49;7:9,13-14,22-28,31-35,40-48,50;8:5-18,21-22,25,30,39,45-46,48,50,52,54;9:3-5,13-14,18,20,22-27,41,44,48,50,55-56,58-60,62;10:2-16,18-24,26,28,30-37,41-42;11:2-13,17-36,39-52;12:1-12,14-59;13:2-5,7,12,15-16,18-21,24-30,32-35;14:3,5,8-14,16-24,26-35;15:4-32;16:1-13,15-31;17:1-10,14,17-22,24-37;18:2-8,10-14,16-17,19-20,22,24-25,27,29-33,41-42;19:5,9-10,12-27,30-31,40,42-44,46;20:3-4,8-18,24-25,34-38,41-44,46-47;21:3-4,6,8-36;22:8,10-12,15-22,25-32,34-38,40,42,46,48,51-53,67-70;23:3,28-31,34,43,46;24:17,19,25-26,36,38-39,41,44-49",
  John:
    "1:38-39,42-43,47-48,50-51;2:4,7-8,16,19;3:3,5-8,10-21;4:7,10,13-14,16-18,21-24,26,32,34-38,48,50;5:6,8,14,17,19-47;6:5,10,12,20,26-27,29,32-40,43-58,61-64,67,70;7:6-8,16-19,21-24,28-29,33-34,37-38;8:7,10-12,14-19,21,23-26,28-29,31-32,34-47,49-51,54-56,58;9:3-5,7,35,37,39,41;10:1-18,25-30,32,34-38;11:4,7,9-11,14-15,23,25-26,34,39-44;12:7-8,23-28,30-32,35-36,44-50;13:7-8,10-21,26-27,31-35,36,38;14:1-31;15:1-27;16:1-33;17:1-26;18:4,6-8,11,20-21,23,34,36-37;19:11,26-28,30;20:15-17,19,21-23,26-29;21:5-6,10,12,15-22",
  Acts: "1:4-5,7-8;9:4-6,10-12,15-16;11:16;18:9-10;20:35;22:7-10,18,21;23:11;26:14-18",
  Revelation: "1:8,11,17-20;2:1-29;3:1-22;16:15;21:5-8;22:7,12-13,16,20",
  "1 Corinthians": "11:24-25",
};

const INTRO_RE =
  /^(?:(?:And|Then|But|Now|Again)\s+)?(?:Jesus|he|He)(?:\s+\S+){0,8}?\s+(?:answered and said|answered|said|saith|spake|cried)(?:\s+unto\s+\S+)?(?:\s+again)?[,:]?\s+/;

const SAID_RE =
  /\bJesus\b(?:\s+\S+){0,8}?\s+(?:answered and said|answered|said|saith|spake|cried)(?:\s+unto\s+\S+)?(?:\s+again)?[,:]?\s+/i;

function expandSpec(spec) {
  const set = new Set();
  for (const chunk of String(spec).split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon < 0) continue;
    const chapter = Number(trimmed.slice(0, colon));
    const verses = trimmed.slice(colon + 1);
    if (!chapter || !verses) continue;
    for (const part of verses.split(",")) {
      const [startRaw, endRaw] = part.split("-");
      const start = Number(startRaw);
      const end = endRaw ? Number(endRaw) : start;
      if (!start) continue;
      for (let verse = start; verse <= end; verse += 1) {
        set.add(`${chapter}:${verse}`);
      }
    }
  }
  return set;
}

const LOOKUP = Object.fromEntries(Object.entries(SPECS).map(([book, spec]) => [book, expandSpec(spec)]));

export function canonicalGospelBook(book) {
  const key = String(book || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
  return ALIASES[key] || Object.keys(LOOKUP).find((name) => name.toLowerCase() === key) || "";
}

export function isJesusVerse(book, chapter, verse) {
  const name = canonicalGospelBook(book);
  const set = LOOKUP[name];
  if (!set) return false;
  return set.has(`${Number(chapter)}:${Number(verse)}`);
}

function inferJesusSaid(text) {
  const m = String(text).match(SAID_RE);
  if (!m) return null;
  const start = m.index || 0;
  const end = start + m[0].length;
  const speech = text.slice(end);
  if (speech.trim().length < 4) return null;
  const parts = [];
  if (start > 0) parts.push({ text: text.slice(0, start), jesus: false });
  parts.push({ text: text.slice(start, end), jesus: false });
  parts.push({ text: speech, jesus: true });
  return parts;
}

export function speechSegments(book, chapter, verse, text) {
  const raw = String(text || "");
  if (!raw) return [{ text: "", jesus: false }];
  if (isJesusVerse(book, chapter, verse)) {
    const intro = raw.match(INTRO_RE);
    if (intro && raw.slice(intro[0].length).trim().length > 0) {
      return [
        { text: intro[0], jesus: false },
        { text: raw.slice(intro[0].length), jesus: true },
      ];
    }
    return [{ text: raw, jesus: true }];
  }
  return inferJesusSaid(raw) || [{ text: raw, jesus: false }];
}
