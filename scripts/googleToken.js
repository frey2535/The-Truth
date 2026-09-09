import { googleClientIdFromEnv, googleClientSecretFromEnv } from "../src/lib/googleEnv.js";
import { loadGoogleOAuth } from "../src/lib/googleStore.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function googleClientId(env) {
  return googleClientIdFromEnv(env);
}

export function googleClientSecret(env) {
  return googleClientSecretFromEnv(env);
}

export async function exchangeGoogleCode({ code, redirectUri, codeVerifier, env, oauth }) {
  const resolved =
    oauth ||
    (env
      ? await loadGoogleOAuth(env)
      : { clientId: googleClientIdFromEnv(env), clientSecret: googleClientSecretFromEnv(env) });
  const clientId = resolved.clientId;
  const clientSecret = resolved.clientSecret;
  if (!clientId) {
    const error = new Error(
      "Google sign-in is not connected on this copy. Locally set VITE_GOOGLE_CLIENT_ID in .env.local."
    );
    error.status = 503;
    throw error;
  }
  if (!code || !redirectUri || !codeVerifier) {
    const error = new Error("Google sign-in was incomplete. Try Continue with Google again.");
    error.status = 400;
    throw error;
  }

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });
  if (clientSecret) body.set("client_secret", clientSecret);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      data.error_description || data.error || `Google token exchange failed (${res.status}).`
    );
    error.status = res.status;
    throw error;
  }
  if (!data.id_token) {
    const error = new Error("Google did not return an identity token.");
    error.status = 502;
    throw error;
  }
  return data;
}
