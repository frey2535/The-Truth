/** Google Play / TWA identity. The live origin is Cloudflare, not GitHub Pages. */
export const PLAY_PACKAGE_ID = "com.currentflow.thetruth";
export const PLAY_HOST = "thetruth.currentflowconsulting.org";
export const PLAY_START_URL = "https://thetruth.currentflowconsulting.org/";
export const PRIVACY_POLICY_URL = "https://thetruth.currentflowconsulting.org/privacy";
export const DATA_SAFETY_URL = "https://thetruth.currentflowconsulting.org/data-safety";
export const ACCOUNT_DELETION_URL = "https://thetruth.currentflowconsulting.org/account";
export const PLAY_CONSOLE_ANSWERS_URL = "https://thetruth.currentflowconsulting.org/play-console";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;

/** Play Console app name — 30 characters max. */
export const PLAY_TITLE = "The Truth";

/** Play Console: create the app as Free. Do not add in-app products. */
export const PLAY_IS_FREE = true;

/** Play Console short description — 80 characters max. */
export const PLAY_SHORT_DESCRIPTION =
  "Free Scripture research. Read and investigate claims from stored texts.";

export const PLAY_FULL_DESCRIPTION = `The Truth is a free, independent Scripture research app. It is not a church, denomination, or government app, and it is not affiliated with Google. There is no paid download and no in-app purchases.

Read the King James Bible, the 1611 Apocrypha, Dead Sea Scrolls English already stored here, Enoch, early church fathers, Josephus, and other published records that ship with the app.

Investigate a claim and the answers quote wording stored in this app — not a live internet search, and not invented verses. Ask searches those same stored texts. It is not a generative AI chatbot and does not use a paid AI API.

What you can do
• Read and search the library on your phone
• Investigate a claim against the stored texts
• Follow guided study paths
• Keep notes, highlights, and favorites on this device
• Install from Chrome, or open the same site at thetruth.currentflowconsulting.org

Who it is for
The app is a Scripture reference tool for ages 13 and up. Stored texts include accounts of war, judgment, and adult religious subjects. It is not a children’s game and is not designed for families.

Optional sign-in
Create a local account on this device, or continue with Google. That is optional. Reading works without an account. Delete the on-device account at ${ACCOUNT_DELETION_URL}

This listing is free. No ads. No in-app purchases or subscriptions.

Privacy: ${PRIVACY_POLICY_URL}
`;

export const LEGAL_PATHS = ["/privacy", "/data-safety", "/account", "/play-console"];

export function isLegalPath(pathname = "", baseUrl = import.meta.env?.BASE_URL || "/") {
  const raw = String(pathname || "");
  const base = String(baseUrl || "/").replace(/\/$/, "");
  const path = base && (raw === base || raw.startsWith(`${base}/`)) ? raw.slice(base.length) || "/" : raw || "/";
  return LEGAL_PATHS.some((legal) => path === legal || path.startsWith(`${legal}/`));
}
