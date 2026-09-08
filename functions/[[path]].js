import { serveSpaIndex, shouldServeSpa } from "../src/lib/spaRoutes.js";

/**
 * Serve the app HTML at /login, /owner, and other client routes.
 * Rewriting those paths to /index.html in _redirects makes Cloudflare's
 * pretty-URL rule 308 them to /, which hides the login pages.
 */
export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  if (!shouldServeSpa(url.pathname)) return next();
  if (!env?.ASSETS) return next();
  return serveSpaIndex(env.ASSETS, url.origin);
}
