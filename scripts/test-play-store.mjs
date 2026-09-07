import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  ACCOUNT_DELETION_URL,
  DATA_SAFETY_URL,
  isLegalPath,
  PLAY_FULL_DESCRIPTION,
  PLAY_HOST,
  PLAY_IS_FREE,
  PLAY_PACKAGE_ID,
  PLAY_SHORT_DESCRIPTION,
  PLAY_START_URL,
  PLAY_TITLE,
  PRIVACY_POLICY_URL,
} from "../src/lib/playStore.js";

assert.equal(PLAY_IS_FREE, true);
assert.equal(PLAY_TITLE.length <= 30, true, "Play title must be 30 characters or fewer");
assert.equal(PLAY_SHORT_DESCRIPTION.length <= 80, true, "Play short description must be 80 characters or fewer");
assert.match(PLAY_SHORT_DESCRIPTION, /Free/i);
assert.match(PLAY_FULL_DESCRIPTION, /free/i);
assert.match(PLAY_FULL_DESCRIPTION, /no in-app purchases/i);
assert.ok(PLAY_FULL_DESCRIPTION.length > 200);
assert.ok(PLAY_FULL_DESCRIPTION.length <= 4000);
assert.equal(PLAY_PACKAGE_ID, "org.currentflowconsulting.thetruth");
assert.match(PLAY_START_URL, /^https:\/\/thetruth\.currentflowconsulting\.org\/$/);
assert.equal(PRIVACY_POLICY_URL, `https://${PLAY_HOST}/privacy`);
assert.equal(DATA_SAFETY_URL, `https://${PLAY_HOST}/data-safety`);
assert.equal(ACCOUNT_DELETION_URL, `https://${PLAY_HOST}/account`);
assert.equal(isLegalPath("/privacy"), true);
assert.equal(isLegalPath("/data-safety"), true);
assert.equal(isLegalPath("/account"), true);
assert.equal(isLegalPath("/library"), false);
assert.equal(isLegalPath("/The-Truth/privacy", "/The-Truth/"), true);

const manifest = JSON.parse(readFileSync("public/manifest.json", "utf8"));
assert.equal(manifest.related_applications?.[0]?.id, PLAY_PACKAGE_ID);
assert.equal(manifest.prefer_related_applications, false);
assert.ok(manifest.screenshots?.length >= 2);
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));

const links = JSON.parse(readFileSync("public/.well-known/assetlinks.json", "utf8"));
assert.equal(links[0].target.package_name, PLAY_PACKAGE_ID);
assert.ok(Array.isArray(links[0].target.sha256_cert_fingerprints));
assert.ok(links[0].target.sha256_cert_fingerprints.length >= 1);

const gradle = readFileSync("android/app/build.gradle", "utf8");
assert.match(gradle, /targetSdk 36/);
assert.match(gradle, /compileSdk 36/);
assert.match(gradle, /applicationId "org\.currentflowconsulting\.thetruth"/);
assert.doesNotMatch(gradle, /billingclient|play-billing|com\.android\.vending\.BILLING/i);

const manifestXml = readFileSync("android/app/src/main/AndroidManifest.xml", "utf8");
assert.equal(/<uses-permission[^>]*BILLING/i.test(manifestXml), false);
assert.match(readFileSync("store/play/listing.md", "utf8"), /Pricing[\s\S]*Free/i);

const redirects = readFileSync("public/_redirects", "utf8");
assert.match(redirects, /\.well-known/);

for (const file of [
  "store/play/feature-graphic.png",
  "store/play/icon-512.png",
  "public/icon-maskable-512.png",
  "public/screenshots/phone-read.png",
  "public/screenshots/phone-investigate.png",
  "public/screenshots/phone-learn.png",
  "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
]) {
  const path = join(file);
  assert.equal(existsSync(path), true, `missing ${file}`);
  assert.ok(statSync(path).size > 1000, `${file} looks empty`);
}

console.log("play-store production files ok");
