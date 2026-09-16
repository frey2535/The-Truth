# Send The Truth to Google Play production

The Play app is a Trusted Web Activity. It opens `https://thetruth.currentflowconsulting.org` in Chrome Custom Tabs, full screen, once Digital Asset Links verify.

GitHub Pages is a mirror only. Do not point the TWA at it.

The listing is **free**. Do not add a paid download, in-app products, subscriptions, ads, or a paid testing service. Study features do not need a paid AI API.

**Paste every Console answer from** https://thetruth.currentflowconsulting.org/play-console  
Repo copies: `store/play/console/` and `src/lib/playConsole.js`.

This repository cannot create the Play developer account or click Submit. If you already have a Play developer account, there is no extra Google fee for this listing. A new personal account still pays Google’s one-time registration fee — that is Google’s charge, not an in-app cost. Until Play is live, the public site is already the free production app.

## What is already done in the repo

- Privacy, data safety, account deletion, Console answers: `/privacy`, `/data-safety`, `/account`, `/play-console`
- Digital Asset Links: `public/.well-known/assetlinks.json`
- Android TWA, package `org.currentflowconsulting.thetruth`, target / compile SDK **36**
- No Play Billing, no advertising ID
- Store listing and screenshots: `store/play/` and `fastlane/metadata/android/en-US/`
- Console paste pack: `store/play/console/`
- Reviewer notes: `store/play/console/REVIEW_NOTES.txt`
- This listing is an **organization** Play account: skip closed testing and upload the `.aab` to Production. Personal-account closed-test notes (not used here): `store/play/console/CLOSED_TESTING.md`

## What you still do in Play Console

1. Sign in with an existing Play developer account, or create one (Google’s one-time fee). Finish identity verification.
2. Create the app:
   - Name: **The Truth**
   - Package: `org.currentflowconsulting.thetruth`
   - Type: App
   - Category: Books & Reference
   - **Free** (not Paid). Do not add in-app products or subscriptions.
3. Turn on **Play App Signing**.
4. Paste listing copy from `store/play/listing.md` (or upload `fastlane/metadata/android/en-US/`).
5. Upload graphics from `store/play/` (icon, feature graphic, phone + tablet screenshots). Leave the AI-generated-content box **unchecked**. Do **not** enroll in Designed for Families.
6. App content: open `/play-console` and copy each answer, or follow `store/play/console/APP_CONTENT.md`.
7. Data safety: `store/play/console/DATA_SAFETY.md` (same as `/data-safety`).
8. IARC questionnaire: `store/play/console/IARC.md` (expect Teen; not Designed for Families).
9. Review notes: `store/play/console/REVIEW_NOTES.txt`.
10. Upload the signed Android App Bundle (`.aab`) under **Test and release → Production**.
11. This Play developer account is an **organization** account. Do **not** run the 12-tester / 14-day closed test. Create a production release, upload `thetruth-play-1.0.0.aab` (or `android/app/build/outputs/bundle/release/app-release.aab`), and submit for review. Closed testing is only for new personal accounts after 13 November 2023 — see `store/play/console/CLOSED_TESTING.md` if Play ever asks for it.

## Build the App Bundle

On a machine with the Android SDK:

```bash
cp android/keystore.properties.example android/keystore.properties
PLAY_KEYSTORE_PASSWORD='your-strong-password' bash scripts/play/create-upload-keystore.sh
cd android
./gradlew bundleRelease
```

The bundle is `android/app/build/outputs/bundle/release/app-release.aab`.

Keep `android/upload.keystore` and `android/keystore.properties` **off git**. For GitHub Actions, store them as `PLAY_KEYSTORE_BASE64`, `PLAY_KEYSTORE_PASSWORD`, and `PLAY_KEY_ALIAS`, then run the **Play App Bundle** workflow (Actions → Play App Bundle → Run workflow).

## Digital Asset Links (remove the Chrome URL bar)

After the first upload, Play Console → Test and release → App integrity → App signing shows **App signing key certificate** SHA-256. Add it (keep the upload-key fingerprint too):

```bash
PLAY_SHA256_CERT_FINGERPRINTS='UPLOAD_SHA,PLAY_APP_SIGNING_SHA' npm run play:assetlinks
```

Commit, deploy the public site, then confirm

https://thetruth.currentflowconsulting.org/.well-known/assetlinks.json

Google’s tester:

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://thetruth.currentflowconsulting.org&relation=delegate_permission/common.handle_all_urls

Until the live file matches Play App Signing, Android may show a Custom Tab URL bar. Play reviewers treat a TWA that still shows Chrome’s address bar as a website wrapper and can reject it. Add the Play signing fingerprint before you apply for production.

## After the listing is live

You may set `prefer_related_applications` to `true` in `public/manifest.json` so Android Chrome offers Play instead of Add to Home screen. Leave it `false` until the listing is published.
