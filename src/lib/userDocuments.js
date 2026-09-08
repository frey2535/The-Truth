import {
  APP_STORAGE_BYTES,
  deleteVaultDocument,
  getVaultDocument,
  listVaultDocuments,
  putVaultDocument,
  requestPersistentStorage,
  vaultUsageBytes,
  wouldExceedCapacity,
} from "./appStorage.js";
import { rowsFromStoredText } from "./corpusPassages.js";

export const USER_DOC_SOURCE = "user";

function newId() {
  return `udoc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function extractSearchableText(name, type, text) {
  const raw = String(text || "");
  const lower = `${name || ""} ${type || ""}`.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|zip|mp3|mp4|mov|pdf|docx?|xlsx?)$/i.test(name || "") && !raw.trim()) {
    return "";
  }
  let body = raw;
  if (lower.includes("html") || /\.(html?|htm)$/i.test(name || "")) {
    body = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");
  }
  body = body.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
  const letters = (body.match(/\p{L}/gu) || []).length;
  if (letters < 40) return "";
  return body;
}

export async function fileToText(file) {
  if (!file) return "";
  if (typeof file.text === "function") {
    try {
      return await file.text();
    } catch {
      /* binary */
    }
  }
  return "";
}

export async function addUserDocuments(files) {
  await requestPersistentStorage();
  const list = Array.from(files || []).filter(Boolean);
  if (!list.length) return { added: [], skipped: [] };
  const used = await vaultUsageBytes();
  let running = used;
  const added = [];
  const skipped = [];
  for (const file of list) {
    const size = Number(file.size) || 0;
    if (wouldExceedCapacity(running, size, APP_STORAGE_BYTES)) {
      skipped.push({ name: file.name, reason: "This file would go past the 1 TB vault." });
      continue;
    }
    const text = await fileToText(file);
    const searchable = extractSearchableText(file.name, file.type, text);
    const id = newId();
    const doc = {
      id,
      name: String(file.name || "document").slice(0, 200),
      type: String(file.type || "application/octet-stream"),
      size,
      text: searchable,
      created: new Date().toISOString(),
    };
    await putVaultDocument(doc);
    running += size;
    added.push({ id, name: doc.name, size, searchable: Boolean(searchable) });
  }
  return { added, skipped };
}

export async function removeUserDocument(id) {
  await deleteVaultDocument(id);
}

export async function userDocumentSummaries() {
  const rows = await listVaultDocuments();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    size: row.size,
    type: row.type,
    created: row.created,
    searchable: Boolean(extractSearchableText(row.name, row.type, row.text)),
  }));
}

export async function loadUserDocumentRows() {
  const rows = await listVaultDocuments();
  return rows.flatMap((row) => {
    const text = extractSearchableText(row.name, row.type, row.text);
    if (!text) return [];
    return rowsFromStoredText(row.name, text, USER_DOC_SOURCE).map((unit) => ({
      ...unit,
      userDocumentId: row.id,
    }));
  });
}

export async function readUserDocument(id) {
  return getVaultDocument(id);
}
