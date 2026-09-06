export function takeResumePath() {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("resume");
  if (!raw) return null;
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return null;
    if (path.startsWith("/corpus/") || path.startsWith("/dss/")) return "/library";
    return path;
  } catch {
    return null;
  }
}
