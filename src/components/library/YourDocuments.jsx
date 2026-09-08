import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  APP_STORAGE_LABEL,
  appStorageStatus,
  formatStorageBytes,
} from "@/lib/appStorage";
import { resetCorpusCache } from "@/lib/localCorpusSearch";
import { addUserDocuments, removeUserDocument, userDocumentSummaries } from "@/lib/userDocuments";

export default function YourDocuments() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [docs, setDocs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function refresh() {
    try {
      const [nextStatus, nextDocs] = await Promise.all([appStorageStatus(), userDocumentSummaries()]);
      setStatus(nextStatus);
      setDocs(nextDocs);
    } catch (error) {
      setNote(error.message || "The document vault could not be opened.");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onPick(event) {
    const files = event.target.files;
    if (!files?.length) return;
    setBusy(true);
    setNote("");
    try {
      const result = await addUserDocuments(files);
      resetCorpusCache();
      await refresh();
      const added = result.added.length;
      const skipped = result.skipped.length;
      const parts = [];
      if (added) parts.push(`${added} document${added === 1 ? "" : "s"} stored. Assistant and Search can read the text.`);
      if (skipped) parts.push(result.skipped.map((row) => `${row.name}: ${row.reason}`).join(" "));
      setNote(parts.join(" ") || "No documents were stored.");
    } catch (error) {
      setNote(error.message || "Those documents could not be stored.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onRemove(id) {
    setBusy(true);
    try {
      await removeUserDocument(id);
      resetCorpusCache();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const used = status?.used || 0;
  const capacity = status?.capacity || 0;
  const pct = capacity ? Math.min(100, (used / capacity) * 100) : 0;

  return (
    <section className="mb-10 p-5 rounded-2xl border border-[#e8ddc7] bg-white/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-[#2b2620]">Your documents</h2>
          <p className="text-sm text-[#5b5142] mt-1 max-w-2xl">
            This app holds up to {APP_STORAGE_LABEL} of documents on this device. Text you add is stored here
            and searched with the other writings. Nothing is sent to the internet.
          </p>
        </div>
        <Button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
        >
          Upload documents
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onPick}
        />
      </div>

      <div className="mt-4">
        <div className="h-2 rounded-full bg-[#e8ddc7] overflow-hidden">
          <div className="h-full bg-[#7a2e2e]" style={{ width: `${Math.max(pct, used ? 0.4 : 0)}%` }} />
        </div>
        <p className="text-xs text-[#8a7f6f] mt-2">
          {formatStorageBytes(used)} used of {APP_STORAGE_LABEL}
          {status?.persistent ? " · kept on this device" : ""}
          {status?.remaining != null ? ` · ${formatStorageBytes(status.remaining)} free` : ""}
        </p>
      </div>

      {note ? <p className="text-sm text-[#5b5142] mt-3">{note}</p> : null}

      {docs.length ? (
        <ul className="mt-4 space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#e8ddc7] bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm text-[#2b2620] truncate">{doc.name}</p>
                <p className="text-xs text-[#8a7f6f]">
                  {formatStorageBytes(doc.size)}
                  {doc.searchable ? " · searchable" : " · stored, no readable text yet"}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRemove(doc.id)}
                className="text-xs text-[#7a2e2e] underline shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#8a7f6f] mt-4">No documents stored yet. Upload the writings you want added.</p>
      )}
    </section>
  );
}
