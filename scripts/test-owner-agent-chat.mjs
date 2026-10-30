import assert from "node:assert/strict";
import { emptyLedger, ownerCredentials, signOwnerToken } from "../src/lib/installLedger.js";
import { handleOwnerAgentChat } from "../src/lib/ownerAgentChatApi.js";
import {
  DEFAULT_APP_ORIGIN,
  buildGeminiContents,
  isOwnerEmailAllowed,
  normalizeGeminiHistory,
  responseHeadersForOrigin,
} from "../src/lib/ownerAgentChatPrompt.js";

let ledger = emptyLedger();
const load = async () => ledger;
const save = async (next) => {
  ledger = next;
};

assert(isOwnerEmailAllowed(" currenflowconsultingllc@gmail.com "), "platform owner is allowed by default");
assert(isOwnerEmailAllowed(" CurrentFlowConsultingLLC@gmail.com "), "alternate platform owner spelling is allowed by default");
assert(isOwnerEmailAllowed("marcus.a.frey@gmail.com"), "backup admin is allowed by default");
assert(isOwnerEmailAllowed("other@example.com", "other@example.com"), "deployment allowlist can add owners");
assert(!isOwnerEmailAllowed("customer@example.com"), "ordinary users are not owners");

const headers = responseHeadersForOrigin("https://preview.example.com/path", {
  appOrigins: "https://preview.example.com, https://another.example.com",
});
assert.equal(headers["Access-Control-Allow-Origin"], "https://preview.example.com");
assert.equal(
  responseHeadersForOrigin("https://evil.example.com", {})["Access-Control-Allow-Origin"],
  DEFAULT_APP_ORIGIN,
);

const normalized = normalizeGeminiHistory([
  { role: "assistant", text: "Local inspection ran first" },
  { role: "user", text: "What is broken?" },
  { role: "assistant", text: "A request failed" },
  { role: "assistant", text: "Check the function logs" },
]);
assert.equal(normalized[0].role, "user");
assert.equal(normalized.length, 2);
assert.match(normalized[1].parts[0].text, /A request failed/);
assert.match(normalized[1].parts[0].text, /Check the function logs/);

const contents = buildGeminiContents({
  question: "Can you answer now?",
  context: "{\"screen\":\"Owner\"}",
  history: [{ role: "assistant", text: "Inspection-only note" }],
});
assert.equal(contents.length, 1);
assert.equal(contents[0].role, "user");
assert.match(contents[0].parts[0].text, /Can you answer now/);

const options = await handleOwnerAgentChat({
  request: new Request("https://thetruth.currentflowconsulting.org/api/owner-agent-chat", {
    method: "OPTIONS",
    headers: { origin: "https://preview.example.com" },
  }),
  env: { TRUTH_APP_ORIGINS: "https://preview.example.com" },
  load,
  save,
});
assert.equal(options.status, 204);
assert.equal(options.headers.get("Access-Control-Allow-Origin"), "https://preview.example.com");

const missingAuth = await handleOwnerAgentChat({
  request: new Request("https://thetruth.currentflowconsulting.org/api/owner-agent-chat", { method: "POST" }),
  env: { PLATFORM_OWNER_PASSWORD: "owner-secret" },
  load,
  save,
});
assert.equal(missingAuth.status, 401);

const credentials = ownerCredentials({ PLATFORM_OWNER_PASSWORD: "owner-secret" });
const owner = await signOwnerToken(credentials.email, credentials.password);

const notConfigured = await handleOwnerAgentChat({
  request: new Request("https://thetruth.currentflowconsulting.org/api/owner-agent-chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${owner.token}` },
    body: JSON.stringify({ message: "Status?" }),
  }),
  env: { PLATFORM_OWNER_PASSWORD: "owner-secret" },
  load,
  save,
});
assert.equal(notConfigured.status, 503);

let providerRequest;
const ok = await handleOwnerAgentChat({
  request: new Request("https://thetruth.currentflowconsulting.org/api/owner-agent-chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${owner.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Status?",
      history: [{ role: "assistant", text: "local-only inspection" }],
      context: { page: "/owner/cursor" },
    }),
  }),
  env: { PLATFORM_OWNER_PASSWORD: "owner-secret", GEMINI_API_KEY: "fake-key" },
  load,
  save,
  fetchImpl: async (_url, init) => {
    providerRequest = JSON.parse(init.body);
    return Response.json({ candidates: [{ content: { parts: [{ text: "Ready." }] } }] });
  },
});
assert.equal(ok.status, 200);
assert.equal((await ok.json()).answer, "Ready.");
assert.equal(providerRequest.contents.length, 1);
assert.equal(providerRequest.contents[0].role, "user");

const backupCredentials = ownerCredentials({
  PLATFORM_OWNER_EMAIL: "customer@example.com",
  PLATFORM_OWNER_PASSWORD: "owner-secret",
});
const customer = await signOwnerToken(backupCredentials.email, backupCredentials.password);
const forbidden = await handleOwnerAgentChat({
  request: new Request("https://thetruth.currentflowconsulting.org/api/owner-agent-chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${customer.token}` },
    body: JSON.stringify({ message: "Status?" }),
  }),
  env: {
    PLATFORM_OWNER_EMAIL: "customer@example.com",
    PLATFORM_OWNER_PASSWORD: "owner-secret",
    GEMINI_API_KEY: "fake-key",
  },
  load,
  save,
});
assert.equal(forbidden.status, 403);

console.log("owner agent chat ok");
