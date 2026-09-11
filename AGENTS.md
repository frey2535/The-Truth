# AGENTS.md

## Project Context

This is a self-hosted copy of The Truth (formerly a Base44 app). Treat it as user-owned application code. Keep changes focused on the user's request and preserve existing project conventions.

Start with `README.md` for local setup and environment variables.

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: local facade that used to wrap the Base44 SDK.
- `src/api/local*.js`: browser auth, entities, integrations, and functions.
- `src/lib/truthMandate.ts`: research prompts shared by local functions.
- `vite.config.js`: Vite config with `@` alias and eBible.org proxy.

## Working Notes

- Use `npm run dev` for local development. Do not add Base44 CLI or SDK dependencies.
- The Truth’s Cursor browser URL is `http://truth.localhost:5174`. Do not open `localhost:5173` (Buildr) or reuse another app’s browser tab.
- Published site: `https://thetruth.currentflowconsulting.org` (Cloudflare Pages project `thetruth`). GitHub Actions deploys the same build to GitHub Pages at `https://frey2535.github.io/The-Truth/`. Do not publish this app to Netlify. Cloudflare deploys with `npx wrangler pages deploy`.
- Research, Investigate, Assistant, and Word Study search only texts and published records stored in the app (King James, Apocrypha, DSS, Enoch, fathers, Philo, Josephus, and `src/data/inAppArchive.js`). Do not send study questions to the internet or invent missing archives.
- Page components should keep talking to the `base44` facade rather than importing `local*` APIs directly, except Layout/auth helpers.
- Run `npm run build` (and `npm run lint` when touching UI) before finishing code changes.
