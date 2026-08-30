import { catalogTextEntry } from "@/data/catalogTextMap";
import { extractCatalogSection } from "@/lib/catalogExtract";
import { fetchStoredText } from "@/lib/fetchStoredText";

export { extractCatalogSection } from "@/lib/catalogExtract";

const cache = new Map();

export async function loadCatalogWorkText(work) {
  const entry = catalogTextEntry(work);
  if (!entry?.file) return { text: "", file: "", missing: true, truncated: false };
  try {
    let raw = cache.get(entry.file);
    if (raw == null) {
      const fetched = await fetchStoredText(entry.file);
      if (!fetched.ok) return { text: "", file: entry.file, missing: true, truncated: false };
      raw = fetched.text;
      cache.set(entry.file, raw);
    }
    const extracted = extractCatalogSection(raw, entry.start, entry.next);
    if (!extracted.found || !extracted.text) {
      return { text: "", file: entry.file, missing: true, truncated: false };
    }
    return { text: extracted.text, file: entry.file, missing: false, truncated: extracted.truncated };
  } catch {
    return { text: "", file: entry.file, missing: true, truncated: false };
  }
}
