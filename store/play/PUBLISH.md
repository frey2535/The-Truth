# Publish The Truth on Google Play

The Play app is a Trusted Web Activity. It opens `https://thetruth.currentflowconsulting.org` in Chrome Custom Tabs, full screen, with no browser URL bar once Digital Asset Links verify.

GitHub Pages (`frey2535.github.io`) is a mirror only. Do not point the TWA at it.

## What this repo already has

- Privacy policy: `/privacy`
- Data safety answers: `/data-safety`
- Account deletion: `/account`
- Digital Asset Links file: `public/.well-known/assetlinks.json`
- Android project targeting API 36: `android/`
- Store copy and graphics: `store/play/`
- Package id: `org.currentflowconsulting.thetruth`

## You still do in Play Console

1. Pay the one-time Play developer fee and finish identity verification.
2. Create an app named **The Truth**, package `org.currentflowconsulting.thetruth`, app type App, category Books & Reference. Set **Free** (not Paid). Do not create in-app products or subscriptions — that choice is usually permanent.
3. Turn on **Play App Signing**.
4. Complete Data safety using `/data-safety`, privacy URL, and account-deletion URL.
5. Complete the IARC content rating questionnaire (expect Teen; not Designed for Families).
6. Personal developer accounts created after 13 November 2023 need a 14-day closed test with at least 12 testers before production.
7. Upload a signed Android App Bundle (`.aab`).

This repository cannot create the Play account or upload the bundle for you.

## Build the App Bundle

On a machine with Android Studio or the command-line SDK:

```bash
# once
cp android/keystore.properties.example android/keystore.properties
bash scripts/play/create-upload-keystore.sh
# edit android/keystore.properties with the passwords you chose

# every release
cd android
./gradlew bundleRelease
```

The bundle is `android/app/build/outputs/bundle/release/app-release.aab`.

Target / compile SDK is **36** (Android 16), required for new Play uploads from 31 August 2026.

## Digital Asset Links (remove the Chrome URL bar)

After the first upload, Play Console → Test and release → App integrity → App signing shows **App signing key certificate** SHA-256.

```bash
PLAY_SHA256_CERT_FINGERPRINTS='AA:BB:CC:...' npm run play:assetlinks
```

Commit that file, deploy the public site, then wait until

https://thetruth.currentflowconsulting.org/.well-known/assetlinks.json

returns the fingerprint. Google’s tester:

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://thetruth.currentflowconsulting.org&relation=delegate_permission/common.handle_all_urls

Until the live fingerprint matches Play App Signing, Android shows the site as a Custom Tab with a URL bar. That is expected.

## Review notes for Play

- The app is free. There is no checkout, paid unlock, or subscription.
- Demo: open the app; reading works without an account.
- Sign-in is optional. Local test account: create one on the device from Create account.
- Owner login is not for reviewers.
- Study search does not use the internet for answers.

## After the listing is live

You may set `prefer_related_applications` to `true` in `public/manifest.json` so Android Chrome offers Play instead of Add to Home screen. Leave it `false` until the listing is published.
