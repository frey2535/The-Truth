import { publicUrl } from "@/lib/publicUrl";

/** Detect the SPA shell so a 200 HTML fallback is never treated as a stored book. */

export function looksLikeHtmlDocument(text, _contentType = "") {
  const head = String(text || "")
    .slice(0, 280)
    .replace(/^\uFEFF/, "")
    .trimStart();
  return /^<!doctype html/i.test(head) || /^<html[\s>]/i.test(head);
}

export function looksLikeAppShell(text) {
  const head = String(text || "").slice(0, 800);
  return (
    /<!doctype html/i.test(head) &&
    (/id=["']root["']/.test(head) ||
      /This site is hosted on Netlify/.test(head) ||
      /<title>The Truth/i.test(head))
  );
}

export async function fetchStoredText(url) {
  const res = await fetch(publicUrl(url));
  if (!res.ok) return { ok: false, text: "", missing: true };
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  if (looksLikeHtmlDocument(text, contentType)) return { ok: false, text: "", missing: true };
  return { ok: true, text, missing: false };
}
