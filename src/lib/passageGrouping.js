function referenceDocument(reference) {
  const ref = String(reference || "").trim();
  if (!ref) return "";
  const beforeSection = ref.split(/\s+[§¶]\s*|\s+[§¶]/)[0]?.trim();
  const base = beforeSection || ref;
  const withoutVerse = base.replace(/\s+\d+(?::\d+(?:-\d+)?)?$/, "").trim();
  if (withoutVerse && withoutVerse !== base) return withoutVerse;
  const commaParts = base.split(",").map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 2) return commaParts.slice(0, 2).join(", ");
  return commaParts[0] || base;
}

export function passageDocumentTitle(row) {
  const explicit = row?.document || row?.document_title || row?.work || row?.title;
  if (explicit) return String(explicit).trim();
  if (row?.book) return String(row.book).trim();
  return referenceDocument(row?.reference) || String(row?.source || "Stored text").trim();
}

export function groupPassagesByDocument(rows = []) {
  const groups = [];
  const byKey = new Map();
  for (const row of rows || []) {
    const title = passageDocumentTitle(row);
    const key = `${row?.source || ""}|${title}`.toLowerCase();
    if (!byKey.has(key)) {
      const group = {
        id: key || `group-${groups.length}`,
        title,
        source: row?.source || "",
        rows: [],
      };
      byKey.set(key, group);
      groups.push(group);
    }
    byKey.get(key).rows.push(row);
  }
  return groups;
}

export function shouldGroupPassages(rows = [], threshold = 3) {
  return groupPassagesByDocument(rows).some((group) => group.rows.length > threshold);
}
