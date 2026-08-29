const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function googleClientId() {
  return (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    ""
  ).trim();
}

export function googleClientSecret() {
  return (process.env.GOOGLE_CLIENT_SECRET || "").trim();
}

export async function exchangeGoogleCode({ code, redirectUri, codeVerifier }) {
  const clientId = googleClientId();
  const clientSecret = googleClientSecret();
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
