import { exchangeGoogleCode } from "../../scripts/googleToken.js";
import { looksLikeGoogleClientId } from "../../src/lib/googleEnv.js";
import { loadGoogleOAuth, saveGoogleOAuth } from "../../src/lib/googleStore.js";
import { readOwnerCredentials, resolveOwnerSession } from "../../src/lib/installsApi.js";
import { loadInstallLedger, saveInstallLedger } from "../../src/lib/installStore.js";

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

function publicGoogle(oauth) {
  return {
    configured: Boolean(oauth.clientId),
    clientId: oauth.clientId || "",
    codeExchange: Boolean(oauth.clientSecret),
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

export async function onRequestGet({ env }) {
  return json(200, publicGoogle(await loadGoogleOAuth(env)));
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (payload?.clientId && looksLikeGoogleClientId(payload.clientId) && !payload.code) {
    const credentials = readOwnerCredentials(env, false);
    const session = await resolveOwnerSession({
      authorization: request.headers.get("Authorization"),
      credentials,
      load: () => loadInstallLedger(env),
      save: (ledger) => saveInstallLedger(env, ledger),
    });
    if (!session) {
      return json(401, { error: "Platform owner sign-in is required to connect Google." });
    }
    try {
      return json(200, await saveGoogleOAuth(env, payload));
    } catch (error) {
      return json(error.status || 400, { error: error.message || "Could not save Google client ID" });
    }
  }

  try {
    const oauth = await loadGoogleOAuth(env);
    const data = await exchangeGoogleCode({
      code: payload.code,
      redirectUri: payload.redirect_uri,
      codeVerifier: payload.code_verifier,
      env,
      oauth,
    });
    return json(200, { id_token: data.id_token });
  } catch (error) {
    return json(error.status || 500, { error: error.message || "Google sign-in failed" });
  }
}
