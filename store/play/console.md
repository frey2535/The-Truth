# Play Console form answers — The Truth

Use this while creating the listing. The app is **free**, with **full access for anyone**. Do not add in-app products.

Package name: `org.currentflowconsulting.thetruth`  
Default store listing language: English (United States)

Privacy policy: https://thetruth.currentflowconsulting.org/privacy  
Account deletion: https://thetruth.currentflowconsulting.org/account  
Data safety notes: https://thetruth.currentflowconsulting.org/data-safety

Paste store copy from [`listing.md`](listing.md). Graphics are in this folder.

---

## Create the app

1. Play Console → All apps → Create app.
2. App name: **The Truth**
3. Default language: English (United States)
4. App or game: **App**
5. Free or paid: **Free** (this is usually permanent)
6. Declarations: accept Developer Program Policies and US export laws as they apply.
7. Do **not** create in-app products, subscriptions, or a payments profile for this app.

## Store listing

| Field | Value |
| --- | --- |
| App name | The Truth |
| Short description | Read Scripture and investigate claims using texts stored in the app. |
| Full description | See `listing.md` |
| App icon | `icon-512.png` (512×512) |
| Feature graphic | `feature-graphic.png` (1024×500, no transparency) |
| Phone screenshots | at least `screenshots/phone-read.png`, `phone-investigate.png`, `phone-learn.png` |
| Category | Books & Reference |
| Tags (if asked) | Education, Books & reference, Religion |
| Email | owner@thetruth.currentflowconsulting.org |
| Website | https://thetruth.currentflowconsulting.org |
| Phone | leave blank unless Play requires one for the account |

Do not put “Free”, “#1”, or “Install now” in the title, icon, or short description.

## App access (Sign-in details)

Play asks: **Is any part of your app restricted?**

Choose **No**.

- No part of the study app is locked.
- Account sign-in is not required in any country.
- Nothing requires payment.
- Email / Google sign-in is optional and only stores a name on that device.

Do **not** choose Yes and do **not** add Google username/password. Reviewers have their own Google accounts if they tap Continue with Google. A password we typed here would not work on their phone anyway (accounts live on the device).

Do not give them the Platform owner login.

If Play still shows a notes box, paste:

> Open the app. Reading, search, Investigate, Calendar, and Learn work without an account. Sign-in is optional. Do not use the Platform owner page. There is no paid unlock.

## Ads

Does your app contain ads? **No**

## Content ratings (IARC)

Start the IARC questionnaire. This is a reference / educational Scripture app, not a game.

Suggested answers (adjust if the form wording differs):

| Topic | Answer |
| --- | --- |
| App category | Reference / educational / books |
| User interaction | Users do not compete, and there is no public chat |
| Violence | The library contains religious and historical texts that describe war, death, and judgment. The app does not depict graphic violence as a game. |
| Sexual content | Some Scripture passages mention sexual matters as text, not as images or interactive content. |
| Language | Occasional strong language may appear in stored writings. Not the focus of the app. |
| Controlled substances | Alcohol or similar may be mentioned in stored texts. The app does not sell or promote drugs. |
| Gambling | No |
| Horror | Some prophetic or judgment passages may be intense for children. |
| Purchases | No digital goods, no paid unlock |
| Location sharing | No |
| Users can communicate | No public social network. Optional local notes only. |
| User-generated content shared with others | No. Notes stay on the device. |
| Unrestricted internet | The Play package opens this site. Study search does not browse the open web for answers. |
| Age | Not designed for children |

Expected rating: **Teen** (or equivalent). Do **not** enroll in Designed for Families.

## Target audience and content

- Target age: **18 and over**. You may also include 16–17 if the form requires more than one group. Do **not** include Under 13.
- Appeal to children: **No**
- News app: **No**
- COVID-19: **No**
- Government / political campaign: **No** (the Evidence section quotes published state papers for study; this is not a government or campaign app)

## Data safety

Follow https://thetruth.currentflowconsulting.org/data-safety

Summary:

- Collects data: **Yes** (optional account + optional install count)
- Encrypted in transit: **Yes**
- Users can request deletion: **Yes** — https://thetruth.currentflowconsulting.org/account
- Data sold: **No**
- Independent security review: **No**
- Families policy: **No**

Declare:

1. Personal info → Email, Name — optional, on-device, App functionality. Not required to use the app.
2. Photos and videos — Google profile picture URL only if they use Google sign-in. App functionality.
3. App info and performance → Other app performance data — install count (random device id, platform, source, timestamp). Analytics. Not linked to identity.
4. Device or other IDs — that install id and ordinary user-agent. Analytics / App functionality.

Shared:

- Google, only if Continue with Google is used (OAuth).
- OpenAI, only if an extra AI tool is used and a key is configured. Ordinary study search is not sent.

Do not declare location, financial info, health, messages, contacts, files upload, microphone, camera, or advertising ID.

## Account deletion

Users can create an optional account. In Play Console:

- Account deletion is available: **Yes**
- In-app deletion: **Yes** (`/account` in the running app)
- Web URL: https://thetruth.currentflowconsulting.org/account
- Data deleted with the account: the named account on that device; notes if the reader checks that box. Install counts are anonymous and are not tied to email.

## Other App content declarations

| Declaration | Answer |
| --- | --- |
| Financial features | No |
| Health | No |
| Health Connect | No |
| Photos and videos permissions | No (the Android package does not request them) |
| Advertising ID | No |
| Foreground services | No |
| Full-screen intent | No |
| Crypto / blockchain | No |
| VPN / device admin | No |
| News | No |
| Government apps | No |
| Political content | Not a political campaign app |
| Data Safety “required to use the app” | No collected type is required |

## Pricing and distribution

- Free
- Available in all countries you are allowed to distribute (or the same set as your other apps)
- Contains ads: No
- Meets US export laws / content guidelines as declared in the create-app flow

## Testing tracks

1. Upload the signed AAB to **Internal testing** first and install it on a phone.
2. If this Play developer account is personal and was created after 13 November 2023, and you do not yet have production access: run **Closed testing** with at least **12 testers opted in for 14 continuous days**, then apply for production.
3. If this account already has production access from another app, you can still use internal/closed testing, then promote the same AAB to production.

Organization Play accounts are exempt from the 12-tester rule.

## Production access questionnaire (if asked)

- Testers used the real app from the closed track, not a sideload only.
- Feedback: reading and search work without an account; no payment is requested.
- The app is ready for production: yes. It is the same site already public at https://thetruth.currentflowconsulting.org

## After the first AAB upload

Play Console → Test and release → App integrity → App signing → copy **App signing key certificate** SHA-256 (colon-separated).

```bash
PLAY_SHA256_CERT_FINGERPRINTS='AA:BB:CC:...' npm run play:assetlinks
```

Commit `public/.well-known/assetlinks.json`, merge to `main` so Cloudflare updates, then confirm:

https://thetruth.currentflowconsulting.org/.well-known/assetlinks.json
