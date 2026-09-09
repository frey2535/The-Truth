import { handleMcpHttp, MCP_CORS } from "../../src/lib/mcpApi.js";
import { readOwnerCredentials } from "../../src/lib/installsApi.js";
import { loadInstallLedger, saveInstallLedger } from "../../src/lib/installStore.js";
import { loadMcpTokens, saveMcpTokens } from "../../src/lib/mcpStore.js";
import { PUBLISHED_APP_URL } from "../../src/lib/appOrigin.js";
import { MCP_PROTOCOL_VERSION } from "../../src/lib/mcpConfig.js";

function headers(extra = {}) {
  return {
    ...MCP_CORS,
    "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
    ...extra,
  };
}

function json(status, body) {
  return Response.json(body, { status, headers: headers({ "Content-Type": "application/json" }) });
}

function sse(status, body) {
  const payload = `event: message\ndata: ${JSON.stringify(body)}\n\n`;
  return new Response(payload, {
    status,
    headers: headers({ "Content-Type": "text/event-stream", "Cache-Control": "no-store" }),
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: headers() });
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
  const origin = request.headers.get("origin") || PUBLISHED_APP_URL;
  const result = await handleMcpHttp({
    method: request.method,
    body,
    authorization: request.headers.get("authorization"),
    accept: request.headers.get("accept") || "",
    credentials: readOwnerCredentials(env, false),
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
    loadTokens: () => loadMcpTokens(env),
    saveTokens: (store) => saveMcpTokens(env, store),
    env,
    origin,
  });
  if (result.body == null) {
    return new Response(null, { status: result.status, headers: headers() });
  }
  const wantsSse = String(result.accept || "").includes("text/event-stream") && request.method === "POST";
  return wantsSse ? sse(result.status, result.body) : json(result.status, result.body);
}
