import { PUBLISHED_APP_URL } from "./appOrigin.js";
import { MCP_PROTOCOL_VERSION, MCP_SERVER_NAME, MCP_SERVER_TITLE, mcpEndpoint } from "./mcpConfig.js";
import { handleMcpSession, resolveMcpAuth } from "./mcpProtocol.js";
import { createMcpToken, listMcpTokens, revokeMcpToken } from "./mcpStore.js";
import { resolveOwnerSession } from "./installsApi.js";

export const MCP_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version, MCP-Session-Id, Accept",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
};

export function mcpDiscovery(origin = PUBLISHED_APP_URL) {
  return {
    name: MCP_SERVER_NAME,
    title: MCP_SERVER_TITLE,
    version: "1.0.0",
    protocolVersion: MCP_PROTOCOL_VERSION,
    transport: "streamable-http",
    url: mcpEndpoint(origin),
    auth: "bearer",
  };
}

export async function handleMcpHttp({ method, body, authorization, accept, credentials, load, save, loadTokens, saveTokens, env, origin }) {
  if (method === "GET") {
    return { status: 200, body: mcpDiscovery(origin) };
  }
  if (method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" } };
  }
  if (!credentials?.configured) {
    return {
      status: 503,
      body: { error: "Platform owner sign-in is required before Cursor can connect." },
    };
  }
  const auth = await resolveMcpAuth({ authorization, credentials, load, save, loadTokens, saveTokens });
  if (!auth) {
    return { status: 401, body: { error: "A Cursor token or platform owner sign-in is required" } };
  }
  const result = await handleMcpSession(body, {
    auth,
    authorization,
    credentials,
    load,
    save,
    loadTokens,
    saveTokens,
    env,
    origin,
  });
  return { ...result, accept };
}

export async function handleMcpTokensRequest({ method, body, authorization, credentials, load, save, loadTokens, saveTokens }) {
  if (!credentials?.configured) {
    return {
      status: 503,
      body: { error: "This deploy did not receive PLATFORM_OWNER_PASSWORD from the Pages environment." },
    };
  }
  const session = await resolveOwnerSession({ authorization, credentials, load, save });
  if (!session) {
    return { status: 401, body: { error: "Platform owner sign-in is required" } };
  }
  if (method === "GET") {
    return { status: 200, body: { tokens: listMcpTokens(await loadTokens()) } };
  }
  if (method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" } };
  }
  if (body?.revoke || body?.id && body?.action === "revoke") {
    const id = String(body.revoke || body.id || "");
    const result = revokeMcpToken(await loadTokens(), id);
    await saveTokens(result.store);
    if (!result.revoked) return { status: 404, body: { error: "That Cursor token was not found" } };
    return { status: 200, body: { revoked: true, id, tokens: listMcpTokens(result.store) } };
  }
  const created = await createMcpToken(await loadTokens(), { name: body?.name });
  await saveTokens(created.store);
  return {
    status: 200,
    body: {
      token: created.token,
      ...created.record,
      tokens: listMcpTokens(created.store),
    },
  };
}
