import { publicUrl } from "@/lib/publicUrl";
import { CANON_BOOKS } from "@/components/library/corpusData";
import { bibleBookFileName, bibleVersionById } from "@/data/bibleVersions";

function bookUrl(version, book) {
  return publicUrl(`${version.path}/${bibleBookFileName(book)}`);
}

export async function loadBibleBook(versionId, book) {
  const version = bibleVersionById(versionId);
  const res = await fetch(bookUrl(version, book));
  if (!res.ok) throw new Error(`Could not load ${book} in ${version.label}.`);
  const raw = await res.text();
  if (raw.trimStart().startsWith("<")) throw new Error(`Could not load ${book} in ${version.label}.`);
  return JSON.parse(raw);
}

export function booksForVersion(versionId) {
  const version = bibleVersionById(versionId);
  return [...CANON_BOOKS, ...(version.extraBooks || [])];
}

export async function buildBiblePlainText(versionId) {
  const version = bibleVersionById(versionId);
  const lines = [
    `The Truth — ${version.label}`,
    version.note,
    "",
  ];
  for (const book of booksForVersion(versionId)) {
    try {
      const data = await loadBibleBook(versionId, book);
      lines.push(data.book || book, "");
      for (const ch of data.chapters || []) {
        lines.push(`Chapter ${ch.chapter}`);
        for (const v of ch.verses || []) {
          lines.push(`${v.verse} ${v.text}`);
        }
        lines.push("");
      }
    } catch {
      /* skip a book that is not stored for this version */
    }
  }
  return lines.join("\n");
}

export function downloadBibleText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function bibleDownloadFilename(versionId) {
  const version = bibleVersionById(versionId);
  return `${version.id}-holy-bible.txt`;
}
