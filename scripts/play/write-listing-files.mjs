import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLAY_CONSOLE_ANSWERS_URL,
  PLAY_FULL_DESCRIPTION,
  PLAY_SHORT_DESCRIPTION,
  PLAY_TITLE,
} from "../../src/lib/playStore.js";
import {
  PLAY_APP_ACCESS,
  PLAY_CATEGORY,
  PLAY_CONSOLE,
  PLAY_CONTACT_EMAIL,
  PLAY_DATA_SAFETY,
  PLAY_DEFAULT_LANGUAGE,
  PLAY_IARC,
  PLAY_QUESTIONNAIRE,
  PLAY_REVIEW_NOTES,
} from "../../src/lib/playConsole.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const en = join(root, "fastlane/metadata/android/en-US");

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`);
}

function renderSection(section) {
  const items = section.items
    .map((item) => {
      const note = item.note ? `\n\n_${item.note}_\n` : "\n";
      return `### ${item.q}\n\n**${item.a}**${note}`;
    })
    .join("\n");
  return `## ${section.title}\n\n${items}`;
}

write(join(en, "title.txt"), PLAY_TITLE);
write(join(en, "short_description.txt"), PLAY_SHORT_DESCRIPTION);
write(join(en, "full_description.txt"), PLAY_FULL_DESCRIPTION);
write(join(en, "video.txt"), "");
write(
  join(root, "fastlane/metadata/android/default/changelogs/1.txt"),
  "First Play listing. Free Scripture research from texts stored in the app."
);
write(
  join(root, "fastlane/Appfile"),
  `json_key_file("") # optional Play API key — leave empty and upload the AAB in Play Console
package_name("${PLAY_CONSOLE.packageName}")
`
);

const listing = `# Google Play listing copy

Paste these fields in Play Console → Grow → Store presence → Main store listing.

Public click-through pack: ${PLAY_CONSOLE_ANSWERS_URL}

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
Leave the Play Console “AI-generated content” box unchecked on these graphics.
`;
write(join(root, "store/play/listing.md"), listing);

write(join(root, "store/play/console/REVIEW_NOTES.txt"), PLAY_REVIEW_NOTES);

write(
  join(root, "store/play/console/APP_CONTENT.md"),
  `# Play Console → App content

Public page: ${PLAY_CONSOLE_ANSWERS_URL}

Use these exact answers. The listing is free. Do not add ads or in-app products.

${PLAY_QUESTIONNAIRE.filter((section) =>
  [
    "privacy",
    "ads",
    "app-access",
    "ads-id",
    "news",
    "covid",
    "government",
    "financial",
    "health",
    "ai",
    "permissions",
    "audience",
    "data-safety",
    "iarc",
  ].includes(section.id)
)
  .map(renderSection)
  .join("\n")}
`
);

write(
  join(root, "store/play/console/IARC.md"),
  `# IARC content rating answers

Expected outcome: **${PLAY_IARC.expectedRating}**. Not Designed for Families.
IARC email: ${PLAY_IARC.email}
Category: ${PLAY_IARC.category}

${PLAY_QUESTIONNAIRE.find((section) => section.id === "iarc").items
  .map((item) => `## ${item.q}\n\n**${item.a}**${item.note ? `\n\n${item.note}` : ""}\n`)
  .join("\n")}
`
);

write(
  join(root, "store/play/console/DATA_SAFETY.md"),
  `# Data safety form

Source of truth: ${PLAY_CONSOLE.dataSafety}
Click-through pack: ${PLAY_CONSOLE_ANSWERS_URL}

- Does the app collect required user data to work? **No**
- Encrypted in transit: **Yes**
- Users can request deletion: **Yes** (${PLAY_CONSOLE.accountDeletion})
- Data sold: **No**
- Independent security review: **No**
- Advertising ID: **No** (permission removed)

## Declare

${PLAY_DATA_SAFETY.collected
  .map(
    (row) =>
      `- ${row.type} — collected: ${row.collected ? "Yes" : "No"}; shared: ${row.shared ? "Yes" : "No"}; optional: ${row.optional ? "Yes" : "No"}; ephemeral: ${row.ephemeral ? "Yes" : "No"}. ${row.purpose}. ${row.stored}`
  )
  .join("\n")}

## Do not declare

${PLAY_DATA_SAFETY.doNotDeclare.join(", ")}.

## Shared

${PLAY_DATA_SAFETY.shared.map((item) => `- ${item}`).join("\n")}
`
);

write(
  join(root, "store/play/console/CLOSED_TESTING.md"),
  `# Closed testing at no cost

New personal Play developer accounts created after 13 November 2023 cannot go straight to production. Organization accounts can usually apply after review.

Do **not** pay testers or a testing service.

1. Play Console → Test and release → Testing → Closed testing → Create a new closed test.
2. Create a free Google Group and add at least twelve people you know.
3. Add that group as testers. Copy the opt-in link.
4. Each tester must open the link while signed into Play and tap **Become a tester**, then install from the Play closed-test listing.
5. Keep twelve testers opted in for **14 continuous days**.
6. Internal testing does not count.
7. Dashboard → Apply for production access.

Reviewers should not use /owner. Reading works without an account.
${PLAY_APP_ACCESS.notes}

Default language: ${PLAY_DEFAULT_LANGUAGE}
`
);

console.log("wrote Play listing and Console paste files");
