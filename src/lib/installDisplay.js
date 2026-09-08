/** Installed-app signals shared by the PWA UI and the download counter. */

export const INSTALLED_DISPLAY_MODES = [
  "standalone",
  "fullscreen",
  "minimal-ui",
  "window-controls-overlay",
];

export function displayLooksInstalled({ matchMedia, standalone } = {}) {
  const query =
    typeof matchMedia === "function"
      ? matchMedia
      : typeof window !== "undefined"
        ? (q) => window.matchMedia(q)
        : () => ({ matches: false });
  const homeScreen =
    standalone ?? (typeof window !== "undefined" ? window.navigator.standalone : false);
  return (
    INSTALLED_DISPLAY_MODES.some((mode) => {
      try {
        return Boolean(query(`(display-mode: ${mode})`)?.matches);
      } catch {
        return false;
      }
    }) || homeScreen === true
  );
}

export function launchedFromAndroidApp(referrer = "") {
  return /^android-app:\/\//i.test(String(referrer || ""));
}

export function detectInstallSource({ referrer = "", matchMedia, standalone } = {}) {
  if (launchedFromAndroidApp(referrer)) return "play";
  if (displayLooksInstalled({ matchMedia, standalone })) return "standalone";
  return "homescreen";
}
