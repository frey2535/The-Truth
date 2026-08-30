const MAX_EXTRACT = 180000;

function escapeRe(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractCatalogSection(text, start, next) {
  const body = String(text || "");
  if (!body) return { text: "", found: false, truncated: false };
  if (!start) {
    const truncated = body.length > MAX_EXTRACT;
    return { text: (truncated ? body.slice(0, MAX_EXTRACT) : body).trim(), found: true, truncated };
  }
  const from = body.search(new RegExp(escapeRe(start), "i"));
  if (from < 0) return { text: "", found: false, truncated: false };
  let slice = body.slice(from);
  if (next) {
    const cut = slice.slice(80).search(new RegExp(escapeRe(next), "i"));
    if (cut > 0) slice = slice.slice(0, cut + 80);
  }
  const truncated = slice.length > MAX_EXTRACT;
  if (truncated) slice = slice.slice(0, MAX_EXTRACT);
  return { text: slice.trim(), found: true, truncated };
}
