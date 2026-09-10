import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLAY_FULL_DESCRIPTION,
  PLAY_SHORT_DESCRIPTION,
  PLAY_TITLE,
} from "../../src/lib/playStore.js";
import {
  PLAY_APP_ACCESS,
  PLAY_CATEGORY,
  PLAY_CONSOLE,
  PLAY_CONTACT_EMAIL,
  PLAY_DEFAULT_LANGUAGE,
  PLAY_IARC,
  PLAY_REVIEW_NOTES,
} from "../../src/lib/playConsole.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const en = join(root, "fastlane/metadata/android/en-US");

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`);
}

write(join(en, "title.txt"), PLAY_TITLE);
write(join(en, "short_description.txt"), PLAY_SHORT_DESCRIPTION);
write(join(en, "full_description.txt"), PLAY_FULL_DESCRIPTION);
write(join(en, "video.txt"), "");
write(join(root, "fastlane/metadata/android/default/changelogs/1.txt"), "First Play listing. Free Scripture research from texts stored in the app.");
write(
  join(root, "fastlane/Appfile"),
  `json_key_file("") # optional Play API key — leave empty and upload the AAB in Play Console
package_name("${PLAY_CONSOLE.packageName}")
`
);

const listing = `# Google Play listing copy

Paste these fields in Play Console → Grow → Store presence → Main store listing.

## App name (30)

${PLAY_TITLE}

## Pricing (Play Console → Monetize)

Free. Do not add in-app products or subscriptions. This choice is usually permanent once the app is created.

## Short description (80)

${PLAY_SHORT_DESCRIPTION}

## Full description (4000)

${PLAY_FULL_DESCRIPTION}

## Category

${PLAY_CATEGORY}

## Contact

Email: ${PLAY_CONTACT_EMAIL}
Website: ${PLAY_CONSOLE.website}
Privacy policy: ${PLAY_CONSOLE.privacyPolicy}

## Graphics in this folder

- \`icon-512.png\` — high-res icon, 512×512, no transparency
- \`feature-graphic.png\` — 1024×500
- \`screenshots/phone-*.png\` — phone shots, 1080×1920
- \`screenshots/seven-*.png\` — 7-inch tablet, 1200×1920
- \`screenshots/ten-*.png\` — 10-inch tablet, 1920×1200

The same files are copied to \`fastlane/metadata/android/en-US/\`.
`;
write(join(root, "store/play/listing.md"), listing);

write(
  join(root, "store/play/console/REVIEW_NOTES.txt"),
  PLAY_REVIEW_NOTES
);

write(
  join(root, "store/play/console/APP_CONTENT.md"),
  `# Play Console → App content

Use these exact answers.

## Privacy policy

${PLAY_CONSOLE.privacyPolicy}

## Ads

Does your app contain ads? **No**

## App access

All functionality is available without restrictions: **Yes**
${PLAY_APP_ACCESS.notes}

## News app

Is this a news app? **No**

## COVID-19

Is this a COVID-19 app? **No**

## Government

Is this a government app? **No**

## Financial features

Does the app provide financial features? **No**

## Health

Does the app have health features? **No**

## Data safety

Open ${PLAY_CONSOLE.dataSafety} and copy those answers.
Account deletion URL: ${PLAY_CONSOLE.accountDeletion}

## Target audience

Designed for children: **No**
Designed for Families: **No**
Age groups: 13–15, 16–17, 18+

## Content rating

Complete the IARC questionnaire using \`store/play/console/IARC.md\`. Expected rating: ${PLAY_IARC.expectedRating}.

## Default language

${PLAY_DEFAULT_LANGUAGE}

## Store listing contact

${PLAY_CONTACT_EMAIL}
`
);

write(
  join(root, "store/play/console/IARC.md"),
  `# IARC content rating answers

Expected outcome: **${PLAY_IARC.expectedRating}**. Not Designed for Families.

${Object.entries(PLAY_IARC.answers)
  .map(([question, answer]) => `## ${question}\n\n${answer}\n`)
  .join("\n")}
`
);

write(
  join(root, "store/play/console/DATA_SAFETY.md"),
  `# Data safety form

Source of truth: ${PLAY_CONSOLE.dataSafety}

- Does the app collect required user data? **No**
- Encrypted in transit: **Yes**
- Users can request deletion: **Yes** (${PLAY_CONSOLE.accountDeletion})
- Data sold: **No**
- Independent security review: **No**
- Advertising ID: **No** (permission removed)

## Declare

- Personal info → Email address, Name — optional, on device, App functionality
- Photos and videos — Google profile picture URL only, optional, on device
- App info and performance → Other app performance data — install count, Analytics
- Device or other IDs — random install device id

## Do not declare

Location, financial info, health, messages, contacts, calendar, files and docs, audio, microphone, camera, advertising IDs.

## Shared

- Google — only if Continue with Google
- OpenAI — only if an extra AI tool runs and a key is configured
- Cloudflare — ordinary request logs
`
);

console.log("wrote Play listing and Console paste files");
