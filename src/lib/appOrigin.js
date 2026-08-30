/** The published copy that home-screen apps should install from. */
export const PUBLISHED_APP_URL = "https://searching-for-truth-173.netlify.app";

export function isPublishedOrigin(origin = window.location.origin) {
  try {
    return new URL(origin).host === new URL(PUBLISHED_APP_URL).host;
  } catch {
    return false;
  }
}

export function isLocalInstallOrigin(hostname = window.location.hostname) {
  if (!hostname) return false;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "truth.localhost") {
    return true;
  }
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);
}
