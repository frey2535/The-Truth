import { PUBLISHED_APP_URL, isLocalInstallOrigin, isPublishedOrigin } from "@/lib/appOrigin";
import { getInstallPlatform, isStandaloneDisplay } from "@/lib/pwa";
import { readOwnerSession } from "@/lib/ownerSession";

const DEVICE_KEY = "the_truth_install_device_id";
const REPORTED_KEY = "the_truth_install_reported";

function isGitHubPagesOrigin(origin = window.location.origin) {
  try {
    return new URL(origin).host.endsWith("github.io");
  } catch {
    return false;
  }
}

/** Local Vite uses this computer's API. Published and GitHub Pages report to the live site. */
export function installMetricsOrigin() {
  if (typeof window === "undefined") return "";
  if (isLocalInstallOrigin()) return "";
  if (isPublishedOrigin() || isGitHubPagesOrigin()) return PUBLISHED_APP_URL;
  return PUBLISHED_APP_URL;
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

export async function reportAppInstall(source = "standalone") {
  if (typeof window === "undefined") return { recorded: false };
  const device = installDeviceId();
  if (!device) return { recorded: false };
  try {
    if (window.localStorage.getItem(REPORTED_KEY) === "1") {
      return { recorded: false };
    }
  } catch {
    /* continue */
  }
  const origin = installMetricsOrigin();
  try {
    const res = await fetch(`${origin}/api/installs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device,
        platform: platformName(),
        source,
        standalone: isStandaloneDisplay(),
        at: new Date().toISOString(),
      }),
    });
    if (!res.ok) return { recorded: false };
    const data = await res.json();
    try {
      window.localStorage.setItem(REPORTED_KEY, "1");
    } catch {
      /* ignore */
    }
    return { recorded: Boolean(data.recorded) };
  } catch {
    return { recorded: false };
  }
}

export function watchInstallMetrics() {
  if (typeof window === "undefined" || window.__truthInstallMetrics) return;
  window.__truthInstallMetrics = true;
  window.addEventListener("appinstalled", () => {
    try {
      window.localStorage.removeItem(REPORTED_KEY);
    } catch {
      /* ignore */
    }
    reportAppInstall("appinstalled");
  });
  window.addEventListener("truth-app-installed", () => {
    try {
      window.localStorage.removeItem(REPORTED_KEY);
    } catch {
      /* ignore */
    }
    reportAppInstall("prompt");
  });
  if (isStandaloneDisplay()) reportAppInstall("standalone");
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
