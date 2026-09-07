/** Google Play / TWA identity. The live origin is Cloudflare, not GitHub Pages. */
export const PLAY_PACKAGE_ID = "org.currentflowconsulting.thetruth";
export const PLAY_HOST = "thetruth.currentflowconsulting.org";
export const PLAY_START_URL = "https://thetruth.currentflowconsulting.org/";
export const PRIVACY_POLICY_URL = "https://thetruth.currentflowconsulting.org/privacy";
export const DATA_SAFETY_URL = "https://thetruth.currentflowconsulting.org/data-safety";
export const ACCOUNT_DELETION_URL = "https://thetruth.currentflowconsulting.org/account";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;

/** Play Console app name — 30 characters max. */
export const PLAY_TITLE = "The Truth";

/** Play Console short description — 80 characters max. */
export const PLAY_SHORT_DESCRIPTION =
  "Read Scripture and ancient writings. Investigate claims from stored texts.";

export const PLAY_FULL_DESCRIPTION = `The Truth is a Scripture research app. Read the King James Bible, the 1611 Apocrypha, Dead Sea Scrolls English already stored here, Enoch, early church fathers, Josephus, and other published records that ship with the app.

Investigate a claim and the answers quote wording stored in this app — not a live internet search, and not invented verses.

What you can do
• Read and search the library on your phone
• Investigate a claim against the stored texts
• Follow guided study paths
• Keep notes, highlights, and favorites on this device
• Install from Chrome, or open the same site at thetruth.currentflowconsulting.org

What stays on the device
Research, Investigate, the Assistant, and Word Study search only texts and published records stored in the app. Study questions are not sent to the internet for answers.

Optional sign-in
Create a local account on this device, or continue with Google. That is optional. Reading works without an account.

Optional extra AI
Some extra tools may call OpenAI if the site operator has configured a key. Ordinary study search does not.

No ads. No store payments inside the app.

Privacy: ${PRIVACY_POLICY_URL}
Delete this device’s account: ${ACCOUNT_DELETION_URL}
`;

export const LEGAL_PATHS = ["/privacy", "/data-safety", "/account"];

export function isLegalPath(pathname = "", baseUrl = import.meta.env?.BASE_URL || "/") {
  const raw = String(pathname || "");
  const base = String(baseUrl || "/").replace(/\/$/, "");
  const path = base && (raw === base || raw.startsWith(`${base}/`)) ? raw.slice(base.length) || "/" : raw || "/";
  return LEGAL_PATHS.some((legal) => path === legal || path.startsWith(`${legal}/`));
}
