import { isLocalInstallOrigin, isPublishedOrigin } from "@/lib/appOrigin";
import { publicUrl } from "@/lib/publicUrl";
import { chromeIntentUrl, urlWantsInstall } from "@/lib/shareInstall";

export { chromeIntentUrl, urlWantsInstall };

const TRUTH_CACHE_PREFIX = "the-truth-";

function clearForeignCaches() {
  if (typeof caches === "undefined") return Promise.resolve();
  return caches.keys().then((keys) =>
    Promise.all(
      keys
        .filter((key) => !key.startsWith(TRUTH_CACHE_PREFIX))
        .map((key) => caches.delete(key))
    )
  );
}

function reloadOnce() {
  const key = "truth_reloaded_for_sw";
  try {
    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
  window.location.reload();
}

export async function checkPublishedBuild() {
  if (import.meta.env.DEV) return { stale: false };
  const local = import.meta.env.VITE_TRUTH_BUILD;
  if (!local) return { stale: false };
  try {
    const res = await fetch(`${publicUrl("/version.json")}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { stale: false };
    const data = await res.json();
    return { stale: Boolean(data.id && data.id !== local), remote: data.id, local };
  } catch {
    return { stale: false };
  }
}

export async function applyAppUpdate() {
  if (!("serviceWorker" in navigator)) {
    window.location.reload();
    return;
  }
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((reg) => reg.update().catch(() => undefined)));
  const waiting = regs.map((reg) => reg.waiting).find(Boolean);
  if (waiting) waiting.postMessage("skipWaiting");
  window.setTimeout(() => window.location.reload(), 400);
}

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const boot = async () => {
    await clearForeignCaches();
    const regs = await navigator.serviceWorker.getRegistrations();

    // Dev and leftover workers from Buildr/NECALCUL8R on the same localhost
    // port will keep serving the other app. Never keep them here.
    if (import.meta.env.DEV) {
      await Promise.all(regs.map((reg) => reg.unregister()));
      return;
    }

    await Promise.all(
      regs
        .filter((reg) => {
          const url =
            reg.active?.scriptURL ||
            reg.waiting?.scriptURL ||
            reg.installing?.scriptURL ||
            "";
          return !url.endsWith("/sw.js");
        })
        .map((reg) => reg.unregister())
    );

    navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);

    const reg = await navigator.serviceWorker.register(publicUrl("/sw.js"), { updateViaCache: "none" });
    const poke = () => {
      reg.update().catch(() => undefined);
    };
    poke();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") poke();
    });
    window.setInterval(poke, 5 * 60 * 1000);
  };

  window.addEventListener("load", () => {
    boot().catch(() => undefined);
  });
}

export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true
  );
}

export function getInstallKind() {
  if (typeof window === "undefined") {
    return { standalone: false, local: false, published: false };
  }
  return {
    standalone: isStandaloneDisplay(),
    local: isLocalInstallOrigin(),
    published: isPublishedOrigin(),
  };
}

export function getInstallPlatform() {
  if (typeof navigator === "undefined") {
    return { isIOS: false, isAndroid: false, isMobile: false };
  }
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  return {
    isIOS,
    isAndroid,
    isMobile: isIOS || isAndroid || window.matchMedia("(max-width: 768px)").matches,
  };
}

/** Facebook, Instagram, Messenger, and similar in-app browsers cannot install a PWA. */
export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FB_IAB|FB4A|FBIOS|Instagram|Messenger|Line\/|Twitter|LinkedInApp|Snapchat|Pinterest|WhatsApp/i.test(
    ua
  );
}

export function arrivedFromShare() {
  if (typeof window === "undefined") return false;
  return urlWantsInstall(window.location.search, document.referrer);
}

export function requestInstallPrompt() {
  window.dispatchEvent(new Event("truth-show-install"));
}

let deferredInstall = null;
const deferredListeners = new Set();

function setDeferredInstall(event) {
  deferredInstall = event;
  deferredListeners.forEach((fn) => {
    try {
      fn(event);
    } catch {
      /* ignore */
    }
  });
}

/** Capture Chrome's install event as soon as the module loads — before React mounts. */
export function listenForInstallPrompt() {
  if (typeof window === "undefined" || window.__truthInstallListening) return;
  window.__truthInstallListening = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    setDeferredInstall(event);
  });
  window.addEventListener("appinstalled", () => {
    setDeferredInstall(null);
  });
}

export function getDeferredInstall() {
  return deferredInstall;
}

export function onDeferredInstallChange(fn) {
  deferredListeners.add(fn);
  return () => deferredListeners.delete(fn);
}

export async function promptAppInstall() {
  const event = deferredInstall;
  if (!event || typeof event.prompt !== "function") {
    return { outcome: "unavailable" };
  }
  try {
    await event.prompt();
    const result = await event.userChoice;
    setDeferredInstall(null);
    return { outcome: result?.outcome || "dismissed" };
  } catch {
    return { outcome: "unavailable" };
  }
}

if (typeof window !== "undefined") {
  listenForInstallPrompt();
}
