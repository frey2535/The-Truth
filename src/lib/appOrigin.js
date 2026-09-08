/** The published copy that home-screen apps should install from. */
export const PUBLISHED_APP_URL = "https://thetruth.currentflowconsulting.org";

/** Public link for Facebook and friends — opens the app, then asks to install. */
export const SHARE_INSTALL_URL = `${PUBLISHED_APP_URL}/?install=1`;

export function facebookShareUrl(url = SHARE_INSTALL_URL) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function isPublishedOrigin(origin = window.location.origin) {
  try {
    return new URL(origin).host === new URL(PUBLISHED_APP_URL).host;
  } catch {
    return false;
  }
}

export function isLoopbackInstallOrigin(hostname = window.location.hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "truth.localhost";
}

export function isLocalInstallOrigin(hostname = window.location.hostname) {
  if (!hostname) return false;
  if (isLoopbackInstallOrigin(hostname)) return true;
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);
}

/** Same-origin on local/live; GitHub Pages uses the Cloudflare API. */
export function publishedApiOrigin() {
  if (typeof window === "undefined") return "";
  if (isLocalInstallOrigin() || isPublishedOrigin()) return "";
  return PUBLISHED_APP_URL;
}

/** Loopback Vite uses this computer. Everyone else reports to the live counter. */
export function metricsApiOrigin(hostname) {
  if (isLoopbackInstallOrigin(hostname || "")) return "";
  return PUBLISHED_APP_URL;
}
