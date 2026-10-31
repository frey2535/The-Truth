/** Copy plain text from The Truth onto the device clipboard. */

export function resolveCopyText(value) {
  if (typeof value === "function") return String(value() ?? "");
  return String(value ?? "");
}

export async function copyTextToClipboard(value) {
  const text = resolveCopyText(value).replace(/\u00a0/g, " ").trim();
  if (!text) return { ok: false, error: "Nothing to copy." };

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, text };
    } catch {
      /* fall through to legacy path */
    }
  }

  if (typeof document === "undefined") return { ok: false, error: "Clipboard is not available." };

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok ? { ok: true, text } : { ok: false, error: "Could not copy that text." };
}

export async function readTextFromClipboard() {
  if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
    try {
      const text = await navigator.clipboard.readText();
      return { ok: true, text: String(text || "") };
    } catch (error) {
      return { ok: false, error: error?.message || "Could not read the clipboard." };
    }
  }
  return { ok: false, error: "Paste from clipboard is not available in this browser." };
}
