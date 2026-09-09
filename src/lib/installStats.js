import { metricsApiOrigin } from "@/lib/appOrigin";
import { detectInstallSource } from "@/lib/installDisplay";
import { getInstallPlatform, isStandaloneDisplay } from "@/lib/pwa";
import { readOwnerSession } from "@/lib/ownerSession";

const DEVICE_KEY = "the_truth_install_device_id";
const REPORTED_KEY = "the_truth_install_reported";
const PENDING_KEY = "the_truth_install_pending";

/**
 * Loopback Vite uses this computer's API. Phones on Wi-Fi, the live site,
 * and GitHub Pages all report to the published Cloudflare counter.
 */
export function installMetricsOrigin(hostname) {
  const host =
    typeof hostname === "string"
      ? hostname
      : typeof window !== "undefined"
        ? window.location.hostname
        : "";
  return metricsApiOrigin(host);
}

export function installDeviceId() {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(DEVICE_KEY);
    if (id && id.length >= 8) return id;
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function platformName() {
  const platform = getInstallPlatform();
  if (platform.isIOS) return "ios";
  if (platform.isAndroid) return "android";
  return "desktop";
}

function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function installLooksPresent() {
  return isStandaloneDisplay();
}

export { detectInstallSource } from "@/lib/installDisplay";

function installHitUrl(origin, payload) {
  const params = new URLSearchParams({
    device: payload.device || "",
    platform: payload.platform || "",
    source: payload.source || "",
    standalone: payload.standalone ? "1" : "0",
    at: payload.at || new Date().toISOString(),
  });
  return `${origin}/api/install-hit?${params}`;
}

function beaconPixel(url) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const done = (ok) => {
        img.onload = null;
        img.onerror = null;
        resolve(ok);
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = url;
      window.setTimeout(() => done(true), 2000);
    } catch {
      resolve(false);
    }
  });
}

async function postInstall(payload) {
  const origin = installMetricsOrigin();
  const url = `${origin}/api/installs`;
  const hit = installHitUrl(origin, payload);
  const body = JSON.stringify(payload);
  const pixel = beaconPixel(hit);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    if (res.ok) {
      await res.json().catch(() => ({}));
      await pixel;
      return true;
    }
  } catch {
    /* try GET / pixel */
  }
  try {
    const getRes = await fetch(hit, { method: "GET", keepalive: true, cache: "no-store" });
    if (getRes.ok) {
      await pixel;
      return true;
    }
  } catch {
    /* pixel may still land */
  }
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    }
  } catch {
    /* ignore */
  }
  return pixel;
}

function markReported() {
  try {
    window.localStorage.setItem(REPORTED_KEY, "1");
    window.localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export async function reportAppInstall(source = "standalone") {
  if (typeof window === "undefined") return { recorded: false };
  const device = installDeviceId();
  if (!device) return { recorded: false };
  const payload = {
    device,
    platform: platformName(),
    source,
    standalone: isStandaloneDisplay(),
    at: new Date().toISOString(),
  };
  writeJson(PENDING_KEY, payload);
  const recorded = await postInstall(payload);
  if (recorded) markReported();
  return { recorded };
}

async function flushPendingInstall() {
  if (typeof window === "undefined") return;
  const pending = readJson(PENDING_KEY);
  if (pending?.device) {
    const recorded = await postInstall(pending);
    if (recorded) markReported();
    return;
  }
  if (installLooksPresent() && window.localStorage.getItem(REPORTED_KEY) !== "1") {
    await reportAppInstall(
      detectInstallSource({
        referrer: typeof document !== "undefined" ? document.referrer : "",
      })
    );
  }
}

export function watchInstallMetrics() {
  if (typeof window === "undefined" || window.__truthInstallMetrics) return;
  window.__truthInstallMetrics = true;

  const report = (source) => {
    try {
      window.localStorage.removeItem(REPORTED_KEY);
    } catch {
      /* ignore */
    }
    reportAppInstall(source);
  };

  window.addEventListener("appinstalled", () => report("appinstalled"));
  window.addEventListener("truth-app-installed", () => report("prompt"));
  window.addEventListener("pageshow", () => {
    flushPendingInstall();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") flushPendingInstall();
  });

  for (const mode of ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"]) {
    try {
      const media = window.matchMedia(`(display-mode: ${mode})`);
      const onChange = (event) => {
        if (event.matches) report(mode === "standalone" || mode === "fullscreen" ? "standalone" : "homescreen");
      };
      if (typeof media.addEventListener === "function") media.addEventListener("change", onChange);
      else if (typeof media.addListener === "function") media.addListener(onChange);
    } catch {
      /* ignore */
    }
  }

  if (typeof navigator.getInstalledRelatedApps === "function") {
    navigator.getInstalledRelatedApps()
      .then((apps) => {
        if (Array.isArray(apps) && apps.length) report("related");
      })
      .catch(() => undefined);
  }

  flushPendingInstall();
}

export async function ownerLogin(email, password) {
  const origin = installMetricsOrigin();
  const res = await fetch(`${origin}/api/owner-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Owner sign-in failed");
  return data;
}

export async function backfillOwnerDownloads(downloads) {
  const session = readOwnerSession();
  if (!session?.token) throw new Error("Platform owner sign-in is required");
  const origin = installMetricsOrigin();
  const res = await fetch(`${origin}/api/installs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ backfill: true, downloads }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not record past installs");
  return data;
}

export async function saveGoogleClientId(clientId) {
  const session = readOwnerSession();
  if (!session?.token) throw new Error("Platform owner sign-in is required");
  const origin = installMetricsOrigin();
  const res = await fetch(`${origin}/api/google-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ clientId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not connect Google sign-in");
  return data;
}

export async function fetchOwnerDownloads() {
  const session = readOwnerSession();
  if (!session?.token) throw new Error("Platform owner sign-in is required");
  const origin = installMetricsOrigin();
  const res = await fetch(`${origin}/api/installs`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not load downloads");
  return data;
}
