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
    await navigator.serviceWorker.register("/sw.js").catch(() => undefined);
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

export function requestInstallPrompt() {
  window.dispatchEvent(new Event("truth-show-install"));
}
