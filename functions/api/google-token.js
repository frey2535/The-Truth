import { exchangeGoogleCode } from "../../scripts/googleToken.js";

function json(status, body) {
  return Response.json(body, { status });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  try {
    const data = await exchangeGoogleCode({
      code: payload.code,
      redirectUri: payload.redirect_uri,
      codeVerifier: payload.code_verifier,
      env,
    });
    return json(200, { id_token: data.id_token });
  } catch (error) {
    return json(error.status || 500, { error: error.message || "Google sign-in failed" });
  }
}
