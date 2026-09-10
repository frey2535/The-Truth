import { loadGoogleOAuth } from "./googleStore.js";
import { signOwnerToken } from "./installLedger.js";
import { handleInstallsRequest, resolveOwnerSession } from "./installsApi.js";
import { APP_PAGES, MCP_PROTOCOL_VERSION, MCP_PROTOCOL_VERSIONS, MCP_SERVER_NAME, MCP_SERVER_TITLE } from "./mcpConfig.js";
import { listMcpTokens, touchMcpToken, verifyMcpToken } from "./mcpStore.js";

const TOOLS = [
  {
    name: "get_app_status",
    description:
      "Status of The Truth owner app: published URL, Google sign-in, OpenAI binding, and download totals.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_pages",
    description: "Routes in The Truth and what each page is for.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_installs",
    description: "Devices that installed The Truth (truncated device ids, platform, source, notes).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "add_prior_install",
    description: "Record an install from before the counter. Platform is ios, android, or desktop.",
    inputSchema: {
      type: "object",
      properties: {
        platform: { type: "string", enum: ["ios", "android", "desktop"] },
        at: { type: "string", description: "ISO date or datetime" },
        note: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_google_status",
    description: "Whether Google sign-in has a public client ID on this deploy.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_cursor_tokens",
    description: "Metadata for Cursor MCP tokens (never the secret). Owner connection only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function toolText(value) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
  };
}

function toolError(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

function openaiConfigured(env) {
  const bag = env || {};
  return Boolean(String(bag.OPENAI_API_KEY || bag.VITE_OPENAI_API_KEY || "").trim());
}

export function listMcpTools() {
  return TOOLS;
}

export async function resolveMcpAuth({ authorization, credentials, load, save, loadTokens, saveTokens }) {
  const session = await resolveOwnerSession({ authorization, credentials, load, save });
  if (session) return { kind: "owner", email: session.email };

  const raw = String(authorization || "");
  const match = raw.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1].trim() : "";
  if (!token || !loadTokens) return null;
  const store = await loadTokens();
  const row = await verifyMcpToken(store, token);
  if (!row) return null;
  if (saveTokens) await saveTokens(touchMcpToken(store, row.id));
  return { kind: "mcp", email: credentials?.email || "", tokenId: row.id, name: row.name };
}

async function ownerAuthorization(ctx) {
  if (ctx.auth?.kind === "owner") return ctx.authorization;
  const session = await signOwnerToken(ctx.credentials.email, ctx.credentials.password);
  return `Bearer ${session.token}`;
}

async function callTool(name, args, ctx) {
  const { env, credentials, load, save, loadTokens, origin } = ctx;
  const authorization = await ownerAuthorization(ctx);
  if (name === "get_app_status") {
    const oauth = await loadGoogleOAuth(env);
    const installs = await handleInstallsRequest({
      method: "GET",
      authorization,
      credentials,
      load,
      save,
    });
    const stats = installs.status === 200 ? installs.body : { error: installs.body?.error };
    return toolText({
      app: MCP_SERVER_TITLE,
      origin,
      ownerEmail: ctx.auth.email || credentials.email,
      googleSignIn: Boolean(oauth.clientId),
      openai: openaiConfigured(env),
      ownerPasswordConfigured: Boolean(credentials?.configured),
      downloads: stats,
    });
  }
  if (name === "list_pages") return toolText({ pages: APP_PAGES });
  if (name === "list_installs") {
    const result = await handleInstallsRequest({
      method: "GET",
      authorization,
      credentials,
      load,
      save,
    });
    if (result.status !== 200) return toolError(result.body?.error || "Could not load installs");
    return toolText(result.body);
  }
  if (name === "add_prior_install") {
    const result = await handleInstallsRequest({
      method: "POST",
      body: {
        backfill: true,
        downloads: [
          {
            platform: args?.platform || "desktop",
            at: args?.at || new Date().toISOString(),
            note: args?.note || "Added from Cursor",
          },
        ],
      },
      authorization,
      credentials,
      load,
      save,
    });
    if (result.status !== 200) return toolError(result.body?.error || "Could not record that install");
    return toolText(result.body);
  }
  if (name === "get_google_status") {
    const oauth = await loadGoogleOAuth(env);
    return toolText({
      configured: Boolean(oauth.clientId),
      clientId: oauth.clientId || "",
      codeExchange: Boolean(oauth.clientSecret),
    });
  }
  if (name === "list_cursor_tokens") {
    if (!loadTokens) return toolError("Token store is not available");
    return toolText({ tokens: listMcpTokens(await loadTokens()) });
  }
  return toolError(`Unknown tool: ${name}`);
}

export async function handleMcpMessage(message, ctx) {
  if (!message || message.jsonrpc !== "2.0" || !message.method) {
    return { status: 400, body: jsonRpcError(message?.id ?? null, -32600, "Invalid Request") };
  }

  const id = message.id;
  const isNotification = id === undefined;
  const method = String(message.method);

  if (method === "notifications/initialized" || method === "initialized") {
    return isNotification ? { status: 202, body: null } : { status: 200, body: jsonRpcResult(id, {}) };
  }
  if (method === "ping") {
    return isNotification ? { status: 202, body: null } : { status: 200, body: jsonRpcResult(id, {}) };
  }
  if (method === "initialize") {
    const requested = String(message.params?.protocolVersion || "");
    const protocolVersion = MCP_PROTOCOL_VERSIONS.includes(requested) ? requested : MCP_PROTOCOL_VERSION;
    return {
      status: 200,
      body: jsonRpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: MCP_SERVER_NAME, title: MCP_SERVER_TITLE, version: "1.0.0" },
        instructions:
          "You are connected to The Truth platform-owner tools. Inspect the live app, downloads, Google sign-in, and routes. Study questions stay inside stored texts — do not search the internet or invent archives.",
      }),
    };
  }
  if (method === "tools/list") {
    return { status: 200, body: jsonRpcResult(id, { tools: TOOLS }) };
  }
  if (method === "tools/call") {
    const name = String(message.params?.name || "");
    const args = message.params?.arguments && typeof message.params.arguments === "object" ? message.params.arguments : {};
    const result = await callTool(name, args, ctx);
    return { status: 200, body: jsonRpcResult(id, result) };
  }
  if (method === "resources/list") {
    return { status: 200, body: jsonRpcResult(id, { resources: [] }) };
  }
  if (method === "prompts/list") {
    return { status: 200, body: jsonRpcResult(id, { prompts: [] }) };
  }
  if (isNotification) return { status: 202, body: null };
  return { status: 200, body: jsonRpcError(id, -32601, `Method not found: ${method}`) };
}

export async function handleMcpSession(payload, ctx) {
  if (Array.isArray(payload)) {
    const bodies = [];
    for (const message of payload) {
      const result = await handleMcpMessage(message, ctx);
      if (result.body) bodies.push(result.body);
    }
    return { status: 200, body: bodies };
  }
  return handleMcpMessage(payload, ctx);
}
