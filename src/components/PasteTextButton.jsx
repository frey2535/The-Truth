import React, { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { readTextFromClipboard } from "@/lib/clipboardText";

/** Paste clipboard text into an input/textarea controlled by the parent. */
export default function PasteTextButton({
  onPaste,
  label = "Paste",
  title = "Paste from clipboard",
  className = "",
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function handlePaste() {
    if (disabled || busy) return;
    setBusy(true);
    setNote("");
    try {
      const result = await readTextFromClipboard();
      if (!result.ok) {
        setNote(result.error || "Could not paste.");
        return;
      }
      const text = String(result.text || "").trim();
      if (!text) {
        setNote("Clipboard is empty.");
        return;
      }
      onPaste?.(text);
    } finally {
      setBusy(false);
      window.setTimeout(() => setNote(""), 2000);
    }
  }

  return (
    <span className="inline-flex items-center gap-2" data-no-listen>
      <button
        type="button"
        onClick={handlePaste}
        disabled={disabled || busy}
        title={title}
        className={
          className ||
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] bg-white text-sm hover:bg-[#f3e9c8]/40 disabled:opacity-60"
        }
      >
        <ClipboardPaste className="w-3.5 h-3.5" />
        {busy ? "Paste…" : label}
      </button>
      {note ? <span className="text-xs text-[#8a7f6f]">{note}</span> : null}
    </span>
  );
}
