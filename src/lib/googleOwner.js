/** Server-side Google proof for platform-owner sign-in. */

function tokenFromBody(body = {}) {
  return {
    idToken: String(body.idToken || body.id_token || "").trim(),
    accessToken: String(body.accessToken || body.access_token || "").trim(),
  };
}

function ownerProfile(payload = {}) {
  const email = String(payload.email || "").trim();
  if (!email) {
    const err = new Error("Google did not share an email address.");
    err.status = 401;
    throw err;
  }
  if (payload.email_verified === false || payload.email_verified === "false") {
    const err = new Error("Google has not verified this email.");
    err.status = 401;
    throw err;
  }
  return {
    email,
    email_verified: true,
    google_id: String(payload.sub || payload.id || ""),
  };
}

export async function verifyGoogleOwnerProof(body = {}, { clientId = "", fetchImpl } = {}) {
  const { idToken, accessToken } = tokenFromBody(body);
  const fetchFn = fetchImpl || globalThis.fetch;
  if (typeof fetchFn !== "function") {
    const err = new Error("Google owner sign-in is not available here.");
    err.status = 503;
    throw err;
  }
  if (idToken) {
    const res = await fetchFn(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error_description || "Google sign-in could not be verified.");
      err.status = 401;
      throw err;
    }
    if (clientId && data.aud && data.aud !== clientId) {
      const err = new Error("Google returned a token for a different app.");
      err.status = 401;
      throw err;
    }
    return ownerProfile(data);
  }
  if (accessToken) {
    const res = await fetchFn("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error_description || "Google sign-in could not be verified.");
      err.status = 401;
      throw err;
    }
    return ownerProfile(data);
  }
  const err = new Error("Google sign-in is required.");
  err.status = 400;
  throw err;
}
