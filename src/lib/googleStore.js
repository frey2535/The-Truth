import { googleClientIdFromEnv, googleClientSecretFromEnv, looksLikeGoogleClientId, normalizeGoogleClientId } from "./googleEnv.js";

export const GOOGLE_OAUTH_KEY = "google-oauth";
export const GOOGLE_OAUTH_CACHE_URL = "https://thetruth.currentflowconsulting.org/__google-oauth";

function asConfig(value) {
  if (!value || typeof value !== "object") return { clientId: "", clientSecret: "" };
  return {
    clientId: normalizeGoogleClientId(value.clientId),
    clientSecret: String(value.clientSecret || "").trim(),
  };
}

async function loadStored(env) {
  if (env?.INSTALLS?.get) {
    try {
      const fromKv = asConfig(await env.INSTALLS.get(GOOGLE_OAUTH_KEY, { type: "json" }));
      if (fromKv.clientId) return fromKv;
    } catch {
      /* fall through to cache */
    }
  }
  const cache = globalThis.caches?.default;
  if (!cache) return { clientId: "", clientSecret: "" };
  try {
    const hit = await cache.match(GOOGLE_OAUTH_CACHE_URL);
    return hit ? asConfig(await hit.json()) : { clientId: "", clientSecret: "" };
  } catch {
    return { clientId: "", clientSecret: "" };
  }
}

export async function loadGoogleOAuth(env) {
  const stored = await loadStored(env);
  return {
    clientId: googleClientIdFromEnv(env) || stored.clientId,
    clientSecret: googleClientSecretFromEnv(env) || stored.clientSecret,
  };
}

export async function saveGoogleOAuth(env, { clientId, clientSecret } = {}) {
  const next = asConfig({
    clientId,
    clientSecret: clientSecret === undefined ? (await loadStored(env)).clientSecret : clientSecret,
  });
  if (!looksLikeGoogleClientId(next.clientId)) {
    const error = new Error("That is not a Google client ID. It should end with .apps.googleusercontent.com");
    error.status = 400;
    throw error;
  }
  if (env?.INSTALLS?.put) {
    await env.INSTALLS.put(GOOGLE_OAUTH_KEY, JSON.stringify(next));
  }
  const cache = globalThis.caches?.default;
  if (cache) {
    await cache.put(
      GOOGLE_OAUTH_CACHE_URL,
      new Response(JSON.stringify(next), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=31536000" },
      })
    );
  }
  return { clientId: next.clientId, configured: true, codeExchange: Boolean(next.clientSecret) };
}
