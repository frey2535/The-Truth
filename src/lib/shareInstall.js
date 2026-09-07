/** True when a shared Facebook/friend link should force the install prompt. */
export function urlWantsInstall(search = "", referrer = "") {
  const query = String(search || "");
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  if (params.get("install") === "1" || params.get("install") === "true") return true;
  return /facebook\.com|fbclid=|instagram\.com|l\.facebook|lm\.facebook|m\.facebook/.test(
    `${String(referrer || "").toLowerCase()} ${query}`
  );
}

export const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/owner"];

/** Strip Vite's GitHub Pages base so `/The-Truth/login` still counts as login. */
export function appPathname(pathname = "", baseUrl = import.meta.env?.BASE_URL || "/") {
  const raw = String(pathname || "");
  const base = String(baseUrl || "/").replace(/\/$/, "");
  if (base && (raw === base || raw.startsWith(`${base}/`))) {
    return raw.slice(base.length) || "/";
  }
  return raw || "/";
}

export function isAuthPath(pathname = "", baseUrl = import.meta.env?.BASE_URL || "/") {
  const path = appPathname(pathname, baseUrl);
  return AUTH_PATHS.some((auth) => path === auth || path.startsWith(`${auth}/`));
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
