# The Truth

Self-hosted biblical scripture research app. This is the Base44 export running independently — same library, investigation, evidence, and study tools, without Base44.

## Quick start

```bash
npm install
npm run dev
```

Open **[http://truth.localhost:5174](http://truth.localhost:5174)** in Cursor’s browser (a separate origin from Buildr on `localhost:5173` and NECALCUL8R on `5176`). `http://127.0.0.1:5174` also works. On a phone on the same Wi‑Fi, use the **Network** URL Vite prints (not 127.0.0.1).

The app works immediately. Sign-in is optional; the first named account you create becomes admin. Base44 accounts were not imported.

### Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create a **Web application** OAuth client.
2. **Authorized JavaScript origins**
   - `http://127.0.0.1:5174`
   - `https://thetruth.currentflowconsulting.org`
   - `https://frey2535.github.io`
3. **Authorized redirect URIs**
   - `http://127.0.0.1:5174/login`
   - `https://thetruth.currentflowconsulting.org/login`
   - `https://frey2535.github.io/The-Truth/login`
4. **Local:** put `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local` and restart `npm run dev`. Open [http://127.0.0.1:5174/login](http://127.0.0.1:5174/login) (not `truth.localhost`).
5. **Live site:** the function reads `GOOGLE_CLIENT_ID` from the **thetruth** Pages environment when that value is bound. If Continue with Google stays disabled, sign in at **/owner** and paste the public Client ID (it ends with `.apps.googleusercontent.com`) — that stores it for the installed app. Email/password accounts stay on the device.

## Install on a phone

This is a Progressive Web App. People open it once in the phone’s browser, then add it to the home screen — it launches like a native app.

Google Play uses the same public site as a Trusted Web Activity (`org.currentflowconsulting.thetruth`). The Play listing is **free** — no paid download and no in-app purchases. Store copy, graphics, the Android project, and the remaining Play Console steps are in [`store/play/PUBLISH.md`](store/play/PUBLISH.md). There is not yet an Apple App Store listing; iPhone install is still Safari → Add to Home Screen.

1. Run `npm run dev` (or `npm run share` for a production build on port **4174**).
2. On the phone, open the LAN address shown as Vite’s **Network** URL, or open **Install on a phone** in the app and share/copy that link.
3. **iPhone:** Safari → Share → Add to Home Screen.
4. **Android:** Chrome menu → Install app / Add to Home screen.

iPhone install works best in Safari. For people not on your Wi‑Fi, use the public HTTPS site: **https://thetruth.currentflowconsulting.org**.

To post it on Facebook, share **https://thetruth.currentflowconsulting.org/?install=1** (or use **Install this app → Post on Facebook**). The post shows the app icon. Friends tap it, the site opens, and it asks them to install. After a deploy, refresh Facebook’s preview at [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/).

### Platform owner — download count

Each install is recorded once per device when Chrome finishes **Install**, when Google Play opens this site, or the first time a home-screen icon opens. iPhone **Add to Home Screen** has no browser event — it counts when they tap the icon. Phones that first open a Wi‑Fi / LAN copy still report to the public Cloudflare counter. Sign in at **/owner** to see the full list. Installs from before 7 September 2026 were not stored; add them on that page, or they appear when that home-screen app opens again.

GitHub Actions can create a KV namespace named **thetruth-installs**. Bind it as **INSTALLS** on the Pages project **thetruth** in the dashboard (do not rewrite the project’s environment from a script). `PLATFORM_OWNER_PASSWORD`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` already live on that project — leave them there. A wrangler.toml `[vars]` block makes Cloudflare ignore those dashboard values.

- **Local:** [http://truth.localhost:5174/owner](http://truth.localhost:5174/owner)  
  Email `owner@thetruth.currentflowconsulting.org`  
  Password `owner-local` (used when `PLATFORM_OWNER_PASSWORD` is not set)
- **Live site:** open `https://thetruth.currentflowconsulting.org/owner` and use the `PLATFORM_OWNER_PASSWORD` already stored on the **thetruth** Pages project. If sign-in says the deploy did not receive it, the last upload used wrangler.toml `[vars]` and ignored the dashboard. Redeploy with `node scripts/pages-deploy.mjs` (or merge a commit that does).

There is a quiet **Platform owner** link at the bottom of the Install page. The live count is stored on the Cloudflare site, so GitHub Pages installs report there too.

Privacy policy: [https://thetruth.currentflowconsulting.org/privacy](https://thetruth.currentflowconsulting.org/privacy). Play data-safety answers and on-device account deletion: `/data-safety` and `/account`.

## Publish

Live app: [https://thetruth.currentflowconsulting.org](https://thetruth.currentflowconsulting.org)

This is a Cloudflare Pages site (`thetruth`), same pattern as NECALCUL8R. It is not hosted on Netlify.

```bash
npm run publish
```

That builds `dist` and deploys it to Cloudflare Pages. Custom domain: `thetruth.currentflowconsulting.org`.

GitHub **Actions** publishes the Vite build to **GitHub Pages** (`.github/workflows/deploy-github-pages.yml`) on every push to `main`. In the repo: **Settings → Pages → Source → GitHub Actions**. The site is `https://frey2535.github.io/The-Truth/`. No Cloudflare secrets are required for that workflow.

`npm run publish` still deploys `dist` to Cloudflare Pages (`thetruth`) if you want the custom domain `thetruth.currentflowconsulting.org`.

## Free local study

Research, Investigate, Word Study, and the Assistant search only what is stored in this app:

- King James (66 books) and the 1611 Apocrypha
- Extra deuterocanonical books, 1–2 Enoch, Jubilees, and other early manuscripts
- Dead Sea Scrolls English already in the Library
- Ante-Nicene Fathers, Volume 1, and Josephus, *Antiquities*
- Published inscriptions, government science notes, state papers, and published papal / conciliar decrees

No account and no paid API. The first search may take a moment while the books load. Results quote stored wording only — no invented verses and no internet search for answers.

The closed Vatican Apostolic Archive and paywalled journals are not published in full anywhere. This app does not invent them. What is here is the actual text of the documents included.

To refresh the public-domain downloads later:

```bash
node scripts/vendor-corpus.mjs
```

## What changed vs Base44

- Removed `@base44/sdk` and `@base44/vite-plugin`
- Auth, study plans, conversations, and evidence records persist in the browser (`localStorage`)
- Scripture, early writings, and the in-app evidence archive are stored under `public/corpus/` and `src/data/inAppArchive.js` and are searched in the browser
- Google sign-in uses `VITE_GOOGLE_CLIENT_ID` (see `.env.example`). Local Google login: [http://127.0.0.1:5174/login](http://127.0.0.1:5174/login)
- Extra Apocrypha chapters from eBible.org are proxied in `npm run dev` / `npm run preview`

To move to a real backend later (Supabase, Postgres, etc.), replace `src/api/local*.js` — page components already talk to a `base44` facade.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run share
npm run play:assets
npm run test:play
```

`npm run share` builds a production copy and serves it on your LAN at port **4174** so phones can open and install it.

Play Store (Android App Bundle on a machine with the Android SDK):

```bash
bash scripts/play/create-upload-keystore.sh
cd android && ./gradlew bundleRelease
```

See [`store/play/PUBLISH.md`](store/play/PUBLISH.md). After Play App Signing is on, put the signing-cert SHA-256 in `public/.well-known/assetlinks.json` with `npm run play:assetlinks` and deploy the site.
