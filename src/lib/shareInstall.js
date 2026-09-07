/** True when a shared Facebook/friend link should force the install prompt. */
export function urlWantsInstall(search = "", referrer = "") {
  const query = String(search || "");
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  if (params.get("install") === "1" || params.get("install") === "true") return true;
  return /facebook\.com|fbclid=|instagram\.com|l\.facebook|lm\.facebook|m\.facebook/.test(
    `${String(referrer || "").toLowerCase()} ${query}`
  );
}

export const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function isAuthPath(pathname = "") {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function chromeIntentUrl(href) {
  const target = href || "";
  try {
    const u = new URL(target);
    return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(u.toString())};end`;
  } catch {
    return target;
  }
}
