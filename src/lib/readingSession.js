/** Last place read, type size, and verse ids for Listen follow-along. */

export const READING_PREFS_KEY = "searchingfortruth_reading_v1";

export const FONT_SCALES = [0.9, 1, 1.15, 1.3, 1.5];
export const DEFAULT_FONT_SCALE = 1;

export function verseDomId(book, chapter, verse) {
  const slug = `${book}-${chapter}-${verse}`.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `verse-${slug}`;
}

export function readingHref(last) {
  if (!last) return "/library";
  if (last.href && String(last.href).startsWith("/library")) return last.href;
  const q = new URLSearchParams();
  if (last.corpus) q.set("corpus", last.corpus);
  if (last.work) q.set("work", last.work);
  if (last.book) q.set("book", last.book);
  if (last.chapter) q.set("chapter", String(last.chapter));
  if (last.verse) q.set("verse", String(last.verse));
  if (last.version && last.version !== "kjv") q.set("version", String(last.version));
  const qs = q.toString();
  return qs ? `/library?${qs}` : "/library";
}

export function readingLabel(last) {
  if (!last?.book) return last?.title || "";
  const chapter = last.chapter ? ` ${last.chapter}` : "";
  const verse = last.verse ? `:${last.verse}` : "";
  const version = last.version && last.version !== "kjv" ? ` (${last.version})` : "";
  return `${last.book}${chapter}${verse}${version}`;
}

export function listeningVerseId(activeId, currentVerse, book, chapter) {
  if (`chapter:${book}:${chapter}` === String(activeId || "")) return String(currentVerse || "");
  const prefix = `verse:${book} ${chapter}:`;
  if (String(activeId || "").startsWith(prefix)) return String(activeId).slice(prefix.length);
  return "";
}

function emptyPrefs() {
  return { fontScale: DEFAULT_FONT_SCALE, last: null };
}

export function normalizeFontScale(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_FONT_SCALE;
  return FONT_SCALES.reduce((best, step) => (Math.abs(step - n) < Math.abs(best - n) ? step : best), FONT_SCALES[0]);
}

export function loadReadingPrefs(storage) {
  try {
    const raw = storage?.getItem?.(READING_PREFS_KEY);
    if (!raw) return emptyPrefs();
    const parsed = JSON.parse(raw);
    return {
      fontScale: normalizeFontScale(parsed.fontScale),
      last: parsed.last && typeof parsed.last === "object" ? parsed.last : null,
    };
  } catch {
    return emptyPrefs();
  }
}

export function saveReadingPrefs(next, storage) {
  const prefs = {
    fontScale: normalizeFontScale(next?.fontScale),
    last: next?.last && typeof next.last === "object" ? next.last : null,
  };
  try {
    storage?.setItem?.(READING_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota */
  }
  return prefs;
}

function store() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export function loadReadingPosition(storage = store()) {
  return loadReadingPrefs(storage).last;
}

export function loadFontScale(storage = store()) {
  return loadReadingPrefs(storage).fontScale;
}

export function saveFontScale(scale, storage = store()) {
  const prefs = loadReadingPrefs(storage);
  return saveReadingPrefs({ ...prefs, fontScale: scale }, storage).fontScale;
}

export function saveReadingPosition(partial, storage = store()) {
  const prefs = loadReadingPrefs(storage);
  const last = {
    corpus: String(partial?.corpus || prefs.last?.corpus || "bible"),
    book: String(partial?.book || ""),
    chapter: partial?.chapter != null && partial.chapter !== "" ? String(partial.chapter) : "",
    verse: partial?.verse != null && partial.verse !== "" ? String(partial.verse) : "",
    work: String(partial?.work || ""),
    title: String(partial?.title || ""),
    version: String(partial?.version || prefs.last?.version || ""),
    ts: Date.now(),
  };
  last.href = readingHref(last);
  if (!last.book && !last.work) return prefs.last;
  return saveReadingPrefs({ ...prefs, last }, storage).last;
}

export function stepFontScale(current, direction) {
  const scale = normalizeFontScale(current);
  const i = FONT_SCALES.indexOf(scale);
  const next = FONT_SCALES[Math.min(FONT_SCALES.length - 1, Math.max(0, i + direction))];
  return next;
}
