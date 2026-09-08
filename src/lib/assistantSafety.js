export const MAX_PASSAGE_CHARS = 900;
export const MAX_HISTORY_CHARS = 4000;
export const MAX_SAVED_ANSWER_CHARS = 16000;
export const MAX_SAVED_PASSAGES = 40;

export function clipPassageText(text, max = MAX_PASSAGE_CHARS) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function trimAnswerContent(content) {
  const text = String(content || "");
  const cut = text.search(/^### All stored wording/m);
  if (cut > 200 && text.length > MAX_SAVED_ANSWER_CHARS) {
    return `${text.slice(0, cut).trim()}\n\n### All stored wording\n\nThe stored quotes were shown under this answer when it was first given. Ask again to read them.`;
  }
  if (text.length > MAX_SAVED_ANSWER_CHARS) return `${text.slice(0, MAX_SAVED_ANSWER_CHARS).trim()}\n\n…`;
  return text;
}

export function askHistory(messages) {
  return (Array.isArray(messages) ? messages : []).map((row) => ({
    role: row?.role === "assistant" ? "assistant" : "user",
    content: String(row?.content || "").slice(0, MAX_HISTORY_CHARS),
  }));
}

function slimSavedPassage(row) {
  if (!row || typeof row !== "object") return null;
  const reference = String(row.reference || "").trim().slice(0, 200);
  const text = clipPassageText(row.text);
  if (!reference && !text) return null;
  return {
    source: String(row.source || ""),
    reference,
    text,
    book: String(row.book || ""),
    chapter: row.chapter,
    verse: row.verse,
  };
}

export function persistableMessages(messages) {
  return (Array.isArray(messages) ? messages : []).map((row) => {
    if (row?.role === "assistant") {
      const passages = (Array.isArray(row.passages) ? row.passages : [])
        .slice(0, MAX_SAVED_PASSAGES)
        .map(slimSavedPassage)
        .filter(Boolean);
      return {
        role: "assistant",
        content: trimAnswerContent(row.content),
        passages,
      };
    }
    return {
      role: row?.role === "user" ? "user" : "assistant",
      content: String(row?.content || "").slice(0, MAX_HISTORY_CHARS),
    };
  });
}

export function loadableMessages(messages) {
  return persistableMessages(messages);
}
