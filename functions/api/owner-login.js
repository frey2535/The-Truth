import { handleOwnerLogin, readOwnerCredentials } from "../../src/lib/installsApi.js";
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
  const credentials = readOwnerCredentials(env, false);
  return json(200, { configured: credentials.configured });
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  const result = await handleOwnerLogin({
    body,
    credentials: readOwnerCredentials(env, false),
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
  });
  return json(result.status, result.body);
}
