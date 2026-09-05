const TOKEN_URL = "https://oauth2.googleapis.com/token";

function envValue(env, ...keys) {
  const source = env || (typeof process !== "undefined" ? process.env : {});
  for (const key of keys) {
    const value = String(source?.[key] || "").trim();
    if (value) return value;
  }
  return "";
}

export function googleClientId(env) {
  return envValue(env, "GOOGLE_CLIENT_ID", "VITE_GOOGLE_CLIENT_ID");
}

export function googleClientSecret(env) {
  return envValue(env, "GOOGLE_CLIENT_SECRET");
}

export async function exchangeGoogleCode({ code, redirectUri, codeVerifier, env }) {
  const clientId = googleClientId(env);
  const clientSecret = googleClientSecret(env);
  if (!clientId) {
    const error = new Error(
      "Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local."
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
