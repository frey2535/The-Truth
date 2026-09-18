# Publish The Truth on Google Play

The Play app is a Trusted Web Activity. It opens `https://thetruth.currentflowconsulting.org` full screen once Digital Asset Links verify. It is a **free** app with **full access** — no paid download, no ads, no in-app products.

GitHub Pages (`frey2535.github.io`) is a mirror only. Do not point the TWA at it.

Fill Play Console using [`console.md`](console.md) and [`listing.md`](listing.md).

## What this repo already has

- Crawler-readable privacy policy: `/privacy` (`public/privacy.html`)
- Data safety answers: `/data-safety`
- Account deletion: `/account`
- Digital Asset Links file: `public/.well-known/assetlinks.json`
- Android TWA targeting API **36**: `android/`
- Package id: `org.currentflowconsulting.thetruth`
- Store copy and graphics: `store/play/`
- Signed App Bundle workflow: `.github/workflows/build-android-aab.yml`

This repository cannot create the Play account or click Submit for you.

## You still do in Play Console

1. Use the same Play developer account as your other apps (the $25 fee is once per account). Finish identity verification and, if shown, Android Developer Verification.
2. Create an app named **The Truth**, package `org.currentflowconsulting.thetruth`, type App, category Books & Reference. Set **Free**. Do not create in-app products — that choice is usually permanent.
3. Turn on **Play App Signing**.
4. Complete every App content form using [`console.md`](console.md): privacy URL, Data safety, IARC rating, target audience 18+, ads **No**, App access unrestricted, account deletion URL.
5. Personal developer accounts created after 13 November 2023 need a 14-day closed test with at least 12 opted-in testers before production, unless this account already has production access.
6. Upload a signed Android App Bundle (`.aab`).
7. After the internal track installs on a phone, you may replace the listing screenshots with photos of the real app. Play rejects shots that do not match the running UI.

## Build the App Bundle

### GitHub Actions (recommended)

Add these repository secrets (Settings → Secrets and variables → Actions):

- `ANDROID_UPLOAD_KEYSTORE_BASE64`
- `ANDROID_UPLOAD_STORE_PASSWORD`
- `ANDROID_UPLOAD_KEY_ALIAS` (`thetruth`)
- `ANDROID_UPLOAD_KEY_PASSWORD`
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` (only if you want the workflow to upload a draft)

Create the keystore once on your Mac:

```bash
npm run play:keystore
base64 -i android/upload.keystore | pbcopy
```

Run **Actions → Build Android App Bundle**. Leave `upload_to_play` false the first time. Download `TheTruth-1.0.0.aab` and upload it in Play Console → Testing → Internal testing.

To have Actions upload a draft:

- `upload_to_play`: true
- `play_track`: internal (then closed, then production)

### Local machine with the Android SDK

```bash
npm run play:keystore
npm run android:bundle:release
```

The bundle is `release/TheTruth-1.0.0.aab`.

Target / compile SDK is **36** (Android 16), required for new Play uploads from 31 August 2026.

## Digital Asset Links (remove the Chrome URL bar)

After the first upload, Play Console → Test and release → App integrity → App signing shows **App signing key certificate** SHA-256.

```bash
PLAY_SHA256_CERT_FINGERPRINTS='AA:BB:CC:...' npm run play:assetlinks
```

Commit that file, merge to `main` so Cloudflare updates, then wait until

https://thetruth.currentflowconsulting.org/.well-known/assetlinks.json

returns the fingerprint. Google’s tester:

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://thetruth.currentflowconsulting.org&relation=delegate_permission/common.handle_all_urls

Until the live fingerprint matches Play App Signing, Android may show a Custom Tab URL bar. That is expected.

## Review notes for Play

- The app is free. There is no checkout, paid unlock, or subscription.
- Demo: open the app; reading works without an account.
- Sign-in is optional. Local test account: create one on the device from Create account.
- Owner login is not for reviewers.
- Study search does not use the internet for answers.

## After the listing is live

You may set `prefer_related_applications` to `true` in `public/manifest.json` so Android Chrome offers Play instead of Add to Home screen. Leave it `false` until the listing is published.
