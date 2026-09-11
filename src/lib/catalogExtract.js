/** High enough to return a whole stored volume. Do not invent missing books. */
const MAX_EXTRACT = 6000000;

function escapeRe(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** ANF/CCEL texts use æ/œ; catalog needles often use ae/oe. */
export function headingPattern(value) {
  const folded = String(value || "")
    .replace(/æ/gi, "ae")
    .replace(/œ/gi, "oe");
  const pattern = escapeRe(folded)
    .replace(/ae/gi, "(?:ae|æ)")
    .replace(/oe/gi, "(?:oe|œ)");
  return new RegExp(pattern, "i");
}

const PREAMBLE_MARKERS = [
  "The First Epistle of Clement to the Corinthians [2]",
  "TATIAN",
  "TERTULLIAN",
  "ORIGEN DE PRINCIPIIS",
  "THE REFUTATION OF ALL HERESIES",
  "THE APOSTOLICAL CONSTITUTIONS",
  "THE TESTAMENTS OF THE TWELVE PATRIARCHS",
  "THE GOSPEL OF PETER",
  "The Confessions of St. Augustin",
  "The City of God.\n\n   Book I.",
  "The First Book of Adam and Eve",
  "THE APOSTLES' CREED",
  "LITERALLY TRANSLATED FROM THE COPTIC BY GEORGE HORNER",
  "ON THE CREATION",
];

/** Drop Gutenberg/CCEL title pages so the reader opens the work, not editor notes. */
export function stripCollectedPreamble(text) {
  let body = String(text || "");
  // Standalone stored manuscripts already open on the work. Do not jump to a
  // later mention of an ANF title such as the Testaments of the Twelve Patriarchs.
  if (
    /^#\s+\S+/m.test(body.slice(0, 400)) &&
    /public-domain english stored/i.test(body.slice(0, 1200))
  ) {
    return body.trim();
  }
  const gutenberg = body.search(/\*\*\*\s*START OF (THE )?PROJECT GUTENBERG/i);
  if (gutenberg >= 0) {
    const nl = body.indexOf("\n", gutenberg);
    body = body.slice(nl >= 0 ? nl + 1 : gutenberg);
  }
  for (const mark of PREAMBLE_MARKERS) {
    const from = body.search(headingPattern(mark));
    if (from > 400) return body.slice(from);
  }
  return body.trim();
}

function findHeadingHits(body, start) {
  const re = new RegExp(headingPattern(start).source, "gi");
  const hits = [];
  let match;
  while ((match = re.exec(body))) {
    hits.push({ index: match.index, length: match[0].length });
    if (match[0].length === 0) re.lastIndex += 1;
  }
  return hits;
}

function lineAround(body, index) {
  const lineStart = body.lastIndexOf("\n", index - 1) + 1;
  const newline = body.indexOf("\n", index);
  const lineEnd = newline < 0 ? body.length : newline;
  return { lineStart, lineEnd, line: body.slice(lineStart, lineEnd) };
}

function looksLikeWorkOpening(body, index) {
  return /Chapter\s+I\b|Chapter\s+1\b|Chap\.\s*i\.--|Part\s+I\b|Book\s+I\b|I\.\s*\(\d+\)|I\.\s*--The Testament|The Lord's Teaching|Memorials of Our Lord|It came to pass|1\s+But of the Jews|Prologue\.|Here Begins|\[Section I\]/i.test(
    body.slice(index, index + 500)
  );
}

/** Title on its own line, not a TOC sentence or Coxe paragraph. */
export function isStandaloneTitle(body, index, length) {
  const { lineStart, lineEnd, line } = lineAround(body, index);
  if (line.trim().length > 100) return false;
  if (/--/.test(line)) return false;
  const before = body.slice(lineStart, index).trim();
  if (before && !/^(?:[IVXLC]+\.?|[0-9]+\.?|[A-Z]\.)?[\s.()-]*$/i.test(before)) return false;
  if (/^(?:[IVXLC]+|[0-9]+)\.?\s*$/i.test(before)) return false;
  const after = body.slice(index + length, lineEnd).trim();
  if (after && !/^[.:\s\d\[\]()—–-]*$/.test(after)) return false;
  return true;
}

const EDITOR_FRONT = /introductory notice|introductory notes|translator's preface|\n\s*Introduction\.\s*\n/i;

function skipEditorFrontMatter(body, from, start) {
  const window = body.slice(from, from + 24000);
  if (!EDITOR_FRONT.test(window.slice(0, 5000))) return from;
  const hasEditorLead = /introductory notice|translator's preface/i.test(window.slice(0, 1500));
  if (looksLikeWorkOpening(body, from) && !hasEditorLead) return from;

  const later = findHeadingHits(body.slice(from + 40), start);
  for (const hit of later) {
    const abs = from + 40 + hit.index;
    if (abs - from > 30000) break;
    if (!isStandaloneTitle(body, abs, hit.length)) continue;
    if (/introductory/i.test(lineAround(body, abs).line)) continue;
    if (looksLikeWorkOpening(body, abs)) return abs;
  }
  const work = window.slice(80).search(
    /\n\s*(?:Chapter\s+I\b|Chapter\s+1\b|Chap\.\s*i\.--|Part\s+I\b|Book\s+I\b|I\.\s*--The Testament|The Lord's Teaching|The Gospel According to Peter|Here Begins|\[Section I\])/i
  );
  if (work >= 0) return from + 80 + work;
  return from;
}

export function findWorkStart(body, start) {
  const hits = findHeadingHits(body, start);
  if (!hits.length) return -1;
  const titles = hits.filter((hit) => isStandaloneTitle(body, hit.index, hit.length));
  const withOpening = titles.filter((hit) => looksLikeWorkOpening(body, hit.index));
  const from = (withOpening[0] || titles[0] || hits[0]).index;
  return skipEditorFrontMatter(body, from, start);
}

export function extractCatalogSection(text, start, next) {
  let body = String(text || "");
  if (!body) return { text: "", found: false, truncated: false };
  if (!start) {
    body = stripCollectedPreamble(body);
    const truncated = body.length > MAX_EXTRACT;
    return { text: (truncated ? body.slice(0, MAX_EXTRACT) : body).trim(), found: Boolean(body.trim()), truncated };
  }
  const from = findWorkStart(body, start);
  if (from < 0) return { text: "", found: false, truncated: false };
  let slice = body.slice(from);
  if (next) {
    const cut = slice.slice(80).search(headingPattern(next));
    if (cut > 0) slice = slice.slice(0, cut + 80);
  }
  const truncated = slice.length > MAX_EXTRACT;
  if (truncated) slice = slice.slice(0, MAX_EXTRACT);
  return { text: slice.trim(), found: true, truncated };
}
