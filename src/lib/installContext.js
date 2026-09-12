/** Non-identifying install details already visible to the downloading browser. */

import { launchedFromAndroidApp } from "./installDisplay.js";

export const SHARE_CHANNELS = ["facebook", "play", "link", "direct"];

export function summarizeBrowser(userAgent = "") {
  const ua = String(userAgent || "");
  if (!ua) return "";
  let browser = "Browser";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  let system = "";
  if (/iPhone|iPad|iPod/i.test(ua)) system = "iPhone / iPad";
  else if (/Android/i.test(ua)) system = "Android";
  else if (/Windows/i.test(ua)) system = "Windows";
  else if (/Mac OS X/i.test(ua)) system = "Mac";
  else if (/Linux/i.test(ua)) system = "Linux";
  return system ? `${browser} on ${system}` : browser;
}

export function detectShareChannel({ search = "", referrer = "" } = {}) {
  if (launchedFromAndroidApp(referrer)) return "play";
  const haystack = `${String(referrer || "").toLowerCase()} ${String(search || "").toLowerCase()}`;
  if (/facebook\.com|fbclid=|instagram\.com|l\.facebook|lm\.facebook|m\.facebook/.test(haystack)) {
    return "facebook";
  }
  const query = String(search || "");
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  if (params.get("install") === "1" || params.get("install") === "true") return "link";
  return "direct";
}

export function installReportExtras({
  language,
  timezone,
  userAgent,
  search,
  referrer,
} = {}) {
  const lang =
    language ||
    (typeof navigator !== "undefined" ? navigator.language || navigator.userLanguage : "");
  const tz =
    timezone ||
    (typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "");
  const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const hrefSearch =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const from =
    referrer ?? (typeof document !== "undefined" ? document.referrer : "");
  return {
    language: String(lang || "").trim(),
    timezone: String(tz || "").trim(),
    browser: summarizeBrowser(ua),
    share: detectShareChannel({ search: hrefSearch, referrer: from }),
  };
}
