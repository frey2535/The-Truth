import assert from "node:assert/strict";
import { emptyLedger, ownerCredentials, signOwnerToken } from "../src/lib/installLedger.js";
import { handleMcpHttp, handleMcpTokensRequest, mcpDiscovery } from "../src/lib/mcpApi.js";
import { cursorMcpSnippet, mcpEndpoint } from "../src/lib/mcpConfig.js";
import { handleMcpSession, listMcpTools, resolveMcpAuth } from "../src/lib/mcpProtocol.js";
import { createMcpToken, emptyMcpTokenStore, listMcpTokens, revokeMcpToken, verifyMcpToken } from "../src/lib/mcpStore.js";

const credentials = ownerCredentials({}, { allowLocalFallback: true });
let ledger = emptyLedger();
let tokens = emptyMcpTokenStore();

const ctxBase = {
  credentials,
  load: async () => ledger,
  save: async (next) => {
    ledger = next;
  },
  loadTokens: async () => tokens,
  saveTokens: async (next) => {
    tokens = next;
  },
  env: { PLATFORM_OWNER_PASSWORD: "owner-local" },
  origin: "http://truth.localhost:5174",
};

const created = await createMcpToken(emptyMcpTokenStore(), { name: "Test Cursor" });
assert.match(created.token, /^mcp_[0-9a-f]{64}$/);
assert.equal(created.record.name, "Test Cursor");
assert.equal(listMcpTokens(created.store).length, 1);
assert.equal((await verifyMcpToken(created.store, created.token)).id, created.record.id);
assert.equal(await verifyMcpToken(created.store, "mcp_nope"), null);
const revoked = revokeMcpToken(created.store, created.record.id);
assert.equal(revoked.revoked, true);
assert.equal(listMcpTokens(revoked.store).length, 0);

assert.equal(mcpEndpoint("https://thetruth.currentflowconsulting.org"), "https://thetruth.currentflowconsulting.org/api/mcp");
assert.match(cursorMcpSnippet("https://thetruth.currentflowconsulting.org/api/mcp", "mcp_demo"), /"type": "http"/);
assert.equal(mcpDiscovery().auth, "bearer");
assert.ok(listMcpTools().some((tool) => tool.name === "list_installs"));

const owner = await signOwnerToken(credentials.email, credentials.password);
const ownerAuth = { authorization: `Bearer ${owner.token}`, ...ctxBase };
assert.equal((await resolveMcpAuth(ownerAuth)).kind, "owner");

const minted = await handleMcpTokensRequest({
  method: "POST",
  body: { name: "Cloud agent" },
  ...ownerAuth,
});
assert.equal(minted.status, 200);
assert.match(minted.body.token, /^mcp_/);
assert.equal(minted.body.tokens.length, 1);
const mcpToken = minted.body.token;

const listed = await handleMcpTokensRequest({ method: "GET", ...ownerAuth });
assert.equal(listed.status, 200);
assert.equal(listed.body.tokens[0].name, "Cloud agent");
assert.equal(listed.body.tokens[0].token, undefined);

const denied = await handleMcpHttp({
  method: "POST",
  body: { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } },
  authorization: "",
  ...ctxBase,
});
assert.equal(denied.status, 401);

const mcpAuth = { authorization: `Bearer ${mcpToken}`, ...ctxBase };
assert.equal((await resolveMcpAuth(mcpAuth)).kind, "mcp");

const ready = await handleMcpHttp({
  method: "POST",
  body: { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } },
  ...mcpAuth,
});
assert.equal(ready.status, 200);
assert.equal(ready.body.result.protocolVersion, "2025-03-26");
assert.equal(ready.body.result.serverInfo.name, "the-truth");

const tools = await handleMcpSession({ jsonrpc: "2.0", id: 2, method: "tools/list" }, { auth: { kind: "mcp" }, ...mcpAuth });
assert.equal(tools.status, 200);
assert.ok(tools.body.result.tools.find((tool) => tool.name === "get_app_status"));

const status = await handleMcpSession(
  { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_app_status", arguments: {} } },
  { auth: { kind: "mcp", email: credentials.email }, ...mcpAuth }
);
assert.equal(status.status, 200);
assert.match(status.body.result.content[0].text, /The Truth/);

const pages = await handleMcpSession(
  { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "list_pages", arguments: {} } },
  { auth: { kind: "mcp" }, ...mcpAuth }
);
assert.match(pages.body.result.content[0].text, /\/owner\/cursor/);

const added = await handleMcpSession(
  {
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: { name: "add_prior_install", arguments: { platform: "ios", note: "From Cursor test" } },
  },
  { auth: { kind: "mcp", email: credentials.email }, ...mcpAuth }
);
assert.equal(added.status, 200);
assert.match(added.body.result.content[0].text, /From Cursor test/);

const tokenList = await handleMcpTokensRequest({
  method: "POST",
  body: { action: "revoke", id: minted.body.id },
  ...ownerAuth,
});
assert.equal(tokenList.status, 200);
assert.equal(tokenList.body.revoked, true);

const afterRevoke = await handleMcpHttp({
  method: "POST",
  body: { jsonrpc: "2.0", id: 6, method: "tools/list" },
  ...mcpAuth,
});
assert.equal(afterRevoke.status, 401);

const open = await handleMcpHttp({ method: "GET", ...ctxBase });
assert.equal(open.status, 200);
assert.equal(open.body.transport, "streamable-http");

console.log("mcp ok");
