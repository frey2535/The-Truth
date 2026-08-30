/** Turn stored prose, markdown, or WEB-style numbered text into NT-style verse units. */

const CITATION_TOKEN =
  /^(?:[A-Z][A-Za-z]{0,14}\.|Cor|Jn|Mt|Mk|Lk|Rom|Gal|Eph|Phil|Col|Thess|Tim|Tit|Phlm|Heb|Jas|Pet|Rev|Clement|Maccabees|Chronicles|Samuel|Kings|Esdras|John|Luke|Mark|Matthew|Acts|Isa|Jer|Ezek|Dan|Gen|Exod|Lev|Num|Deut|Josh|Judg|Ps|Prov)\b/;

function stripMarkup(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .trim();
}

function cleanChunk(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitOversized(text, max = 900) {
  const body = cleanChunk(text);
  if (body.length <= max) return body ? [body] : [];
  const sentences = body.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let buf = "";
  for (const sentence of sentences) {
    if (buf && buf.length + sentence.length + 1 > max) {
      chunks.push(buf.trim());
      buf = sentence;
    } else {
      buf = buf ? `${buf} ${sentence}` : sentence;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

function looksLikeCitation(text, contentStart) {
  return CITATION_TOKEN.test(text.slice(contentStart).trimStart());
}

function splitNumberedUnits(text) {
  const re = /(?:^|[\s\n])(\d+)\.?\s+(?=[A-Za-z“"‘])/g;
  const hits = [];
  let match;
  while ((match = re.exec(text))) {
    const verse = Number(match[1]);
    const numIndex = match.index + match[0].indexOf(match[1]);
    const afterNumber = text.slice(numIndex + match[1].length).match(/^\.?\s*/);
    const start = numIndex + match[1].length + (afterNumber?.[0].length || 0);
    if (looksLikeCitation(text, start)) continue;
    hits.push({ verse, start, rawIndex: match.index });
  }
  if (hits.length < 2 || hits.length > 4000) return null;

  const kept = [];
  for (const hit of hits) {
    if (!kept.length) {
      if (hit.verse === 1) kept.push(hit);
      continue;
    }
    const prev = kept[kept.length - 1].verse;
    if (hit.verse === prev + 1 || hit.verse === 1) kept.push(hit);
  }
  if (kept.length < 2) return null;

  const units = kept
    .map((hit, i) => {
      const end = i + 1 < kept.length ? kept[i + 1].rawIndex : text.length;
      return { verse: i + 1, text: cleanChunk(text.slice(hit.start, end)), start: hit.rawIndex };
    })
    .filter((row) => row.text);
  if (units.length < 2) return null;
  return units;
}

function paragraphsToVerses(text) {
  const paragraphs = text
    .split(/\n\s*\n+/)
    .flatMap((block) => splitOversized(block))
    .filter(Boolean);
  if (paragraphs.length >= 2) {
    return paragraphs.map((body, i) => ({ verse: i + 1, text: body }));
  }

  const lines = text
    .split("\n")
    .map((line) => cleanChunk(line))
    .filter(Boolean);
  if (lines.length >= 3) {
    return lines.flatMap((line) => splitOversized(line)).map((body, i) => ({ verse: i + 1, text: body }));
  }

  return splitOversized(text).map((body, i) => ({ verse: i + 1, text: body }));
}

export function textToNumberedVerses(raw) {
  const text = stripMarkup(raw);
  if (!text) return [];

  const numbered = splitNumberedUnits(text);
  if (numbered) {
    const preamble = cleanChunk(text.slice(0, numbered[0].start));
    const preVerses = preamble ? paragraphsToVerses(preamble) : [];
    return [...preVerses, ...numbered].map((row, i) => ({ verse: i + 1, text: row.text }));
  }

  return paragraphsToVerses(text);
}
