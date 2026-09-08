import { handleInstallsRequest, readOwnerCredentials } from "../../src/lib/installsApi.js";
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

export async function onRequest({ request, env }) {
  let body = {};
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }
  }
  const result = await handleInstallsRequest({
    method: request.method,
    body,
    authorization: request.headers.get("authorization"),
    credentials: readOwnerCredentials(env, false),
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
  });
  return json(result.status, result.body);
}
