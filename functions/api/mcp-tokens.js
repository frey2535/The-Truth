import { handleMcpTokensRequest, MCP_CORS } from "../../src/lib/mcpApi.js";
import { readOwnerCredentials } from "../../src/lib/installsApi.js";
import { loadInstallLedger, saveInstallLedger } from "../../src/lib/installStore.js";
import { loadMcpTokens, saveMcpTokens } from "../../src/lib/mcpStore.js";

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      ...MCP_CORS,
      "Content-Type": "application/json",
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: MCP_CORS });
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
  const result = await handleMcpTokensRequest({
    method: request.method,
    body,
    authorization: request.headers.get("authorization"),
    credentials: readOwnerCredentials(env, false),
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
    loadTokens: () => loadMcpTokens(env),
    saveTokens: (store) => saveMcpTokens(env, store),
  });
  return json(result.status, result.body);
}
