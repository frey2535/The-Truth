/** Play Console field values — paste these; keep them in sync with playStore.js. */

import {
  ACCOUNT_DELETION_URL,
  DATA_SAFETY_URL,
  PLAY_CONSOLE_ANSWERS_URL,
  PLAY_FULL_DESCRIPTION,
  PLAY_HOST,
  PLAY_IS_FREE,
  PLAY_PACKAGE_ID,
  PLAY_SHORT_DESCRIPTION,
  PLAY_START_URL,
  PLAY_TITLE,
  PRIVACY_POLICY_URL,
} from "./playStore.js";
import { CONTACT_EMAIL } from "./contact.js";

export const PLAY_CATEGORY = "Books & Reference";
export const PLAY_CONTACT_EMAIL = CONTACT_EMAIL;
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
  consoleAnswers: PLAY_CONSOLE_ANSWERS_URL,
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
      type: "App info and performance → Other app performance data",
      collected: true,
      shared: false,
      optional: true,
      ephemeral: false,
      purpose: "Analytics (anonymous install count)",
      stored: "This site; not linked to name or email",
    },
    {
      type: "Device or other IDs",
      collected: true,
      shared: false,
      optional: true,
      ephemeral: false,
      purpose: "Analytics / App functionality (random install device id)",
      stored: "Random install device id on this site",
    },
    {
      type: "Personal info → Email address, Name",
      collected: false,
      shared: true,
      optional: true,
      ephemeral: false,
      purpose: "App functionality (Continue with Google only)",
      stored: "On the device after Google returns the profile. Not uploaded to a reader server.",
    },
    {
      type: "Photos and videos → Photos",
      collected: false,
      shared: true,
      optional: true,
      ephemeral: false,
      purpose: "App functionality (Google profile picture URL only)",
      stored: "On the device. The app does not request photo or camera permission.",
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
    "Other user-generated content (notes stay on the device)",
  ],
  shared: [
    "Google — only if Continue with Google (email, name, picture). The app does not send those fields to a reader server.",
    "Cloudflare — ordinary HTTPS request logs for hosting. Cloudflare is the host, not an advertising partner.",
  ],
};

export const PLAY_IARC = {
  expectedRating: "Teen",
  notDesignedForFamilies: true,
  category: "All Other App Types (Utility / Productivity / Reference). Not a game.",
  email: PLAY_CONTACT_EMAIL,
  answers: {
    "App category": "All Other App Types. Reference / educational. Not a game.",
    "Violence":
      "Yes, infrequently. Stored Scripture and related records describe war, judgment, and death. This is text, not interactive gameplay, and there are no graphic images of violence.",
    "Sexual content":
      "Some biblical narrative mentions marriage, childbirth, or sexual sin. There is no pornography, no nudity images, and no interactive sexual content.",
    "Language": "Some stored texts include strong or archaic language.",
    "Controlled substances":
      "Some stored texts mention wine or similar. The app does not sell or promote drugs, alcohol, or tobacco.",
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

export const PLAY_REVIEW_NOTES = `The app is free. There is no checkout, paid unlock, or subscription. No ads.

Demo: open the app. Reading the library works without creating an account.

Optional sign-in: Create account on the device (email/password). Continue with Google is optional and may be unavailable if a Google client ID is not bound.

Do not use /owner — that is the platform operator page.

Research, Investigate, Assistant, and Word Study search only texts stored in the app. They do not search the live internet, invent archives, or require a paid API.

Paste pack for every Console question: ${PLAY_CONSOLE_ANSWERS_URL}`;

function qa(q, a, note = "") {
  return note ? { q, a, note } : { q, a };
}

/** Click-through answers for every current Play Console production form. */
export const PLAY_QUESTIONNAIRE = [
  {
    id: "create",
    title: "Create the app (Dashboard)",
    items: [
      qa("App name", PLAY_TITLE),
      qa("Default language", PLAY_DEFAULT_LANGUAGE),
      qa("App or game", "App"),
      qa("Free or paid", "Free"),
      qa("Package name", PLAY_PACKAGE_ID),
      qa("Declarations", "Confirm you will follow Google Play Developer Program Policies. Do not add in-app products."),
    ],
  },
  {
    id: "pricing",
    title: "Monetize → App pricing",
    items: [
      qa("This app is", "Free"),
      qa("Add in-app products", "No. Do not create managed products or subscriptions."),
      qa("Add subscriptions", "No"),
      qa("Play Billing Library", "Not included. Do not add billingclient."),
    ],
  },
  {
    id: "store-settings",
    title: "Grow → Store presence → Store settings",
    items: [
      qa("App category", PLAY_CATEGORY),
      qa("Tags", PLAY_TAGS.join(", ")),
      qa("Store listing contact email", PLAY_CONTACT_EMAIL),
      qa("Phone number", "Leave blank unless you have a public support number."),
      qa("Website", PLAY_WEBSITE),
      qa("External marketing", "Optional. Not required."),
    ],
  },
  {
    id: "listing",
    title: "Grow → Store presence → Main store listing",
    items: [
      qa("App name (30)", PLAY_TITLE),
      qa("Short description (80)", PLAY_SHORT_DESCRIPTION),
      qa("Full description (4000)", "Paste from store/play/listing.md or this page’s listing section."),
      qa("High-res icon 512×512", "store/play/icon-512.png — no transparency"),
      qa("Feature graphic 1024×500", "store/play/feature-graphic.png"),
      qa("Phone screenshots", "store/play/screenshots/phone-*.png (at least 2)"),
      qa("7-inch tablet screenshots", "store/play/screenshots/seven-*.png"),
      qa("10-inch tablet screenshots", "store/play/screenshots/ten-*.png"),
      qa("Promo video", "None. Leave empty."),
      qa(
        "AI-generated content checkbox on each graphic",
        "Leave unchecked",
        "Icon, feature graphic, and screenshots are drawn by a local script from the existing app icon. They are not generative-AI images."
      ),
    ],
  },
  {
    id: "privacy",
    title: "Policy → App content → Privacy policy",
    items: [qa("Privacy policy URL", PRIVACY_POLICY_URL)],
  },
  {
    id: "ads",
    title: "Policy → App content → Ads",
    items: [
      qa("Does your app contain ads?", "No"),
      qa("Third-party ad SDKs, banners, or native ads", "No"),
    ],
  },
  {
    id: "app-access",
    title: "Policy → App content → App access",
    items: [
      qa("All functionality available without special access?", "Yes"),
      qa("Any part of the app restricted (login, password, membership)?", "No"),
      qa("Instructions for reviewers", PLAY_APP_ACCESS.notes),
    ],
  },
  {
    id: "ads-id",
    title: "Policy → App content → Advertising ID",
    items: [
      qa("Does the app use the advertising ID?", "No"),
      qa("AD_ID permission", "Removed in the Android manifest."),
    ],
  },
  {
    id: "news",
    title: "Policy → App content → News apps",
    items: [
      qa("Is this a news or magazine app?", "No"),
      qa("Category News and Magazines", "Do not select."),
    ],
  },
  {
    id: "covid",
    title: "Policy → App content → COVID-19",
    items: [qa("Is this a COVID-19 contact-tracing or status app?", "No")],
  },
  {
    id: "government",
    title: "Policy → App content → Government apps",
    items: [
      qa("Is this a government app?", "No"),
      qa("Developed by or on behalf of a government agency?", "No"),
    ],
  },
  {
    id: "financial",
    title: "Policy → App content → Financial features",
    items: [
      qa("Does the app provide financial features?", "No"),
      qa("Banking, loans, trading, crypto wallets, or payments?", "No"),
      qa("The listing is free. There is no checkout.", "Yes — free, no checkout."),
    ],
  },
  {
    id: "health",
    title: "Policy → App content → Health",
    items: [
      qa("Does the app have health features?", "No"),
      qa("Medical device, diagnosis, treatment, or Health Connect?", "No"),
    ],
  },
  {
    id: "ai",
    title: "Policy → App content → AI-generated content",
    items: [
      qa("Is a generative-AI chatbot a central feature?", "No"),
      qa("Does the app generate images, voice, or video from prompts?", "No"),
      qa(
        "Do Research, Investigate, Assistant, and Word Study use a paid AI API?",
        "No",
        "Those tools search texts stored in the app. They do not require OpenAI or any paid API."
      ),
      qa("Store listing graphics AI label", "Do not check. Assets are not generative AI."),
    ],
  },
  {
    id: "permissions",
    title: "Policy → App content → Photos, videos, and other permissions",
    items: [
      qa("Does the app request Photos or Videos permission?", "No"),
      qa("Camera, microphone, contacts, SMS, call log, or location?", "No"),
      qa("Foreground services / Health Connect / VPN?", "No"),
      qa("Android permissions in the Play wrapper", "INTERNET only. Advertising ID is removed."),
    ],
  },
  {
    id: "audience",
    title: "Policy → App content → Target audience and content",
    items: [
      qa("Target age groups", "13–15, 16–17, and 18+"),
      qa("Children under 13", "Do not select"),
      qa("Appeals to children", "No"),
      qa("Designed for Families / Families policy", "No. Do not enroll."),
      qa("Store presence for children", "Not designed for children"),
      qa("Why these ages", PLAY_TARGET_AUDIENCE.appeal),
    ],
  },
  {
    id: "data-safety",
    title: "Policy → App content → Data safety",
    items: [
      qa("Does the app collect or share any required user data types?", "Yes — see the types below."),
      qa("Does the app collect required user data to work?", "No. Reading works without an account."),
      qa("Data encrypted in transit?", "Yes (HTTPS)"),
      qa("Users can request that data be deleted?", `Yes — ${ACCOUNT_DELETION_URL}`),
      qa("Data sold or used for advertising?", "No"),
      qa("Independent security review?", "No"),
      qa("Committed to Play Families Policy?", "No"),
      qa(
        "App info and performance → Other app performance data",
        "Collected: Yes. Shared: No. Optional: Yes. Ephemeral: No. Purpose: Analytics."
      ),
      qa(
        "Device or other IDs",
        "Collected: Yes. Shared: No. Optional: Yes. Ephemeral: No. Purpose: Analytics (random install device id)."
      ),
      qa(
        "Personal info → Email address, Name",
        "Collected by our servers: No. Shared: Yes, with Google, only if Continue with Google. Optional. Purpose: App functionality."
      ),
      qa(
        "Photos and videos → Photos",
        "Collected by our servers: No. Shared: Yes, Google profile picture URL only if Continue with Google. Optional. The app does not request the Android photos permission."
      ),
      qa("Location, financial, health, messages, files, audio, advertising IDs", "Do not declare."),
      qa("Notes and highlights", "Do not declare. They stay on the device."),
    ],
  },
  {
    id: "iarc",
    title: "Policy → App content → Content ratings (IARC)",
    items: [
      qa("IARC email", PLAY_CONTACT_EMAIL),
      qa("Category", PLAY_IARC.category),
      qa("Does the app contain depictions of violence?", "Yes"),
      qa("Is the violence interactive gameplay or a combat game?", "No"),
      qa("Cartoon or fantasy violence?", "No"),
      qa("Realistic or graphic violence toward humans or animals?", "Yes — textual accounts only, not images."),
      qa("Blood, gore, or dismemberment as images or gameplay?", "No"),
      qa("Sexual violence as interactive or illustrated content?", "No"),
      qa("Sexual content or nudity images?", "No"),
      qa("Sexual themes in text?", "Yes, infrequent biblical narrative. No pornography."),
      qa("Profanity or crude language?", "Yes — some strong or archaic wording in stored texts."),
      qa("Alcohol, tobacco, or drugs sold or promoted?", "No"),
      qa("References to wine or similar in stored texts?", "Yes, infrequently."),
      qa("Real-money or simulated gambling?", "No"),
      qa("Users can interact or chat with each other?", "No"),
      qa("Public user-generated content / social feed?", "No"),
      qa("Shares the user’s location?", "No"),
      qa("Digital purchases or in-app products?", "No"),
      qa("Unrestricted internet / open web browser?", "No. TWA is locked to this site."),
      qa("Primarily directed at children under 13?", "No"),
      qa("Expected rating", `${PLAY_IARC.expectedRating}. Not Designed for Families.`),
    ],
  },
  {
    id: "countries",
    title: "Test and release → Countries / pricing",
    items: [
      qa("Available countries", "All countries, unless you later exclude one."),
      qa("Price", "Free in every country"),
    ],
  },
  {
    id: "devices",
    title: "Test and release → Device catalog",
    items: [
      qa("Phones", "Yes"),
      qa("Tablets", "Yes"),
      qa("ChromeOS", "Yes (the TWA opens the same site)"),
      qa("Android TV, Wear OS, Android Automotive, Android XR", "No. Do not opt in."),
    ],
  },
  {
    id: "release",
    title: "Test and release → Production",
    items: [
      qa("Play App Signing", "Turn on. Required."),
      qa("Release type", "Android App Bundle (.aab), not an APK."),
      qa("Release name", `1.0.0 (${PLAY_VERSION_CODE})`),
      qa("Release notes", "First Play listing. Free Scripture research from texts stored in the app."),
      qa("Review notes", PLAY_REVIEW_NOTES.split("\n")[0]),
    ],
  },
  {
    id: "closed-test",
    title: "Closed testing (personal accounts after 13 Nov 2023)",
    items: [
      qa("Does a new personal Play account need a closed test first?", "Yes"),
      qa("Internal testing count toward production access?", "No"),
      qa("Paid testers or a paid testing service?", "No. Use a free Google Group."),
      qa("Minimum testers opted in", "12 testers, for 14 continuous days, then apply for production on the Dashboard."),
      qa("How to recruit at no cost", "Create a free Google Group, add twelve people you know, and send them the Play closed-test opt-in link."),
    ],
  },
];
