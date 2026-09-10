/** Play Console field values — paste these; keep them in sync with playStore.js. */

import {
  ACCOUNT_DELETION_URL,
  DATA_SAFETY_URL,
  PLAY_FULL_DESCRIPTION,
  PLAY_HOST,
  PLAY_IS_FREE,
  PLAY_PACKAGE_ID,
  PLAY_SHORT_DESCRIPTION,
  PLAY_START_URL,
  PLAY_TITLE,
  PRIVACY_POLICY_URL,
} from "./playStore.js";

export const PLAY_CATEGORY = "Books & Reference";
export const PLAY_CONTACT_EMAIL = "owner@thetruth.currentflowconsulting.org";
export const PLAY_WEBSITE = `https://${PLAY_HOST}`;
export const PLAY_DEFAULT_LANGUAGE = "en-US";
export const PLAY_VERSION_NAME = "1.0.0";
export const PLAY_VERSION_CODE = 1;

export const PLAY_TAGS = ["Bible", "Religion", "Education", "Reference", "Books"];

export const PLAY_CONSOLE = {
  appName: PLAY_TITLE,
  packageName: PLAY_PACKAGE_ID,
  appType: "App",
  category: PLAY_CATEGORY,
  defaultLanguage: PLAY_DEFAULT_LANGUAGE,
  free: PLAY_IS_FREE,
  inAppProducts: false,
  subscriptions: false,
  ads: false,
  startUrl: PLAY_START_URL,
  website: PLAY_WEBSITE,
  email: PLAY_CONTACT_EMAIL,
  privacyPolicy: PRIVACY_POLICY_URL,
  dataSafety: DATA_SAFETY_URL,
  accountDeletion: ACCOUNT_DELETION_URL,
  shortDescription: PLAY_SHORT_DESCRIPTION,
  fullDescription: PLAY_FULL_DESCRIPTION,
};

export const PLAY_APP_ACCESS = {
  allFeaturesAvailableWithoutRestriction: true,
  loginRequired: false,
  notes:
    "Reading, search, and study work without an account. Sign-in is optional. Do not use the platform owner page.",
};

export const PLAY_ADS = {
  containsAds: false,
};

export const PLAY_NEWS = {
  isNewsApp: false,
};

export const PLAY_GOVERNMENT = {
  isGovernmentApp: false,
};

export const PLAY_FINANCIAL = {
  hasFinancialFeatures: false,
};

export const PLAY_HEALTH = {
  hasHealthFeatures: false,
};

export const PLAY_COVID = {
  covidRelated: false,
};

export const PLAY_TARGET_AUDIENCE = {
  designedForChildren: false,
  designedForFamilies: false,
  ageGroups: ["13-15", "16-17", "18+"],
  appeal: "The app is a Scripture reference tool. It is not a children’s game.",
};

export const PLAY_DATA_SAFETY = {
  collectsRequiredData: false,
  encryptedInTransit: true,
  usersCanRequestDeletion: true,
  dataSold: false,
  independentSecurityReview: false,
  collected: [
    {
      type: "Personal info → Email address, Name",
      optional: true,
      purpose: "App functionality (sign-in)",
      stored: "On device",
    },
    {
      type: "Photos and videos",
      optional: true,
      purpose: "App functionality (Google profile picture URL only)",
      stored: "On device",
    },
    {
      type: "App info and performance → Other app performance data",
      optional: true,
      purpose: "Analytics (install count)",
      stored: "This site; not linked to name or email",
    },
    {
      type: "Device or other IDs",
      optional: true,
      purpose: "Analytics / App functionality",
      stored: "Random install device id",
    },
  ],
  doNotDeclare: [
    "Location",
    "Financial info",
    "Health and fitness",
    "Messages, contacts, calendar",
    "Files and docs",
    "Audio, microphone, camera",
    "Advertising or marketing IDs",
  ],
  shared: [
    "Google — only if Continue with Google (email, name, picture)",
    "OpenAI — only if an extra AI tool is used and a key is configured (prompt text)",
    "Cloudflare — ordinary request logs",
  ],
};

export const PLAY_IARC = {
  expectedRating: "Teen",
  notDesignedForFamilies: true,
  answers: {
    "App category": "Reference / educational. Not a game.",
    "Violence":
      "Yes, infrequently. Stored Scripture and related records describe war, judgment, and death. This is text, not interactive gameplay.",
    "Sexual content":
      "Some biblical narrative mentions marriage, childbirth, or sexual sin. There is no pornography and no interactive sexual content.",
    "Language": "Some stored texts include strong or archaic language.",
    "Controlled substances":
      "Some stored texts mention wine or similar. The app does not sell or promote drugs.",
    "Gambling": "No.",
    "User interaction / UGC":
      "Notes, highlights, and chats stay on this device. There is no public feed and no user-to-user chat.",
    "Location sharing": "No.",
    "Digital purchases": "No. The app is free and has no in-app products.",
    "Unrestricted internet":
      "No. The Play app is a Trusted Web Activity for thetruth.currentflowconsulting.org only.",
    "Age": "Not directed at children under 13.",
  },
};

export const PLAY_REVIEW_NOTES = `The app is free. There is no checkout, paid unlock, or subscription.

Demo: open the app. Reading the library works without creating an account.

Optional sign-in: Create account on the device (email/password). Continue with Google is optional and may be unavailable if a Google client ID is not bound.

Do not use /owner — that is the platform operator page.

Research, Investigate, Assistant, and Word Study search only texts stored in the app. They do not search the live internet or invent archives.`;
