export function notebookItemText(kind, item = {}) {
  const lines = [`The Truth — ${kind}`];
  if (item.reference) lines.push(item.reference);
  if (item.topic) lines.push(`Topic: ${item.topic}`);
  if (item.status) lines.push(`Status: ${item.status}`);
  if (item.created_date) lines.push(`Saved: ${item.created_date}`);
  if (item.text) {
    lines.push("", item.text);
  }
  if (item.body && item.body !== item.text) {
    lines.push("", item.body);
  }
  if (item.description && item.description !== item.body) {
    lines.push("", item.description);
  }
  return lines.filter((line) => line != null).join("\n").trim() + "\n";
}

export function notebookFilename(kind, item = {}) {
  const raw = String(item.reference || item.topic || kind || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${raw || "notebook-item"}.txt`;
}

export function downloadText(filename, text) {
  if (typeof document === "undefined") return;
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

export function printText(title, text) {
  if (typeof window === "undefined") return;
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }
  const safeTitle = String(title || "The Truth").replace(/[<>]/g, "");
  const safeBody = String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  doc.open();
  doc.write(
    `<!doctype html><html><head><title>${safeTitle}</title><style>body{font:16px/1.5 Georgia,serif;padding:24px;color:#2b2620}pre{white-space:pre-wrap}</style></head><body><pre>${safeBody}</pre></body></html>`
  );
  doc.close();
  const cleanup = () => frame.remove();
  frame.contentWindow.addEventListener("afterprint", cleanup);
  frame.contentWindow.focus();
  frame.contentWindow.print();
  window.setTimeout(cleanup, 2000);
}

export function printCurrentPage() {
  if (typeof window !== "undefined") window.print();
}
