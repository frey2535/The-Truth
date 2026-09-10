/** Cursor MCP tokens — hashed in KV (or Cache) so they can be revoked. */

export const MCP_TOKENS_KEY = "mcp-tokens";
export const MCP_TOKENS_CACHE_URL = "https://thetruth.currentflowconsulting.org/__mcp-tokens";

export function emptyMcpTokenStore() {
  return { tokens: {} };
}

function asStore(value) {
  if (!value || typeof value !== "object") return emptyMcpTokenStore();
  const tokens = value.tokens && typeof value.tokens === "object" ? value.tokens : {};
  return { tokens };
}

export async function sha256Hex(text) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text || "")));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hashesMatch(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (!left || !right || left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

export function publicMcpToken(id, row) {
  return {
    id,
    name: row?.name || "Cursor",
    createdAt: row?.createdAt || "",
    lastUsedAt: row?.lastUsedAt || null,
  };
}

export function listMcpTokens(store) {
  return Object.entries(asStore(store).tokens)
    .map(([id, row]) => publicMcpToken(id, row))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export async function createMcpToken(store, { name } = {}) {
  const next = asStore(store);
  const id = `tok_${randomHex(8)}`;
  const token = `mcp_${randomHex(32)}`;
  const createdAt = new Date().toISOString();
  const label = String(name || "Cursor").trim().slice(0, 80) || "Cursor";
  next.tokens[id] = {
    hash: await sha256Hex(token),
    name: label,
    createdAt,
    lastUsedAt: null,
  };
  return {
    store: next,
    token,
    record: publicMcpToken(id, next.tokens[id]),
  };
}

export async function verifyMcpToken(store, token) {
  const raw = String(token || "");
  if (!raw.startsWith("mcp_")) return null;
  const hash = await sha256Hex(raw);
  for (const [id, row] of Object.entries(asStore(store).tokens)) {
    if (hashesMatch(row?.hash, hash)) return { id, ...row };
  }
  return null;
}

export function revokeMcpToken(store, id) {
  const next = asStore(store);
  const key = String(id || "");
  if (!next.tokens[key]) return { store: next, revoked: false };
  delete next.tokens[key];
  return { store: next, revoked: true };
}

export function touchMcpToken(store, id, now = new Date().toISOString()) {
  const next = asStore(store);
  const key = String(id || "");
  if (!next.tokens[key]) return next;
  next.tokens[key] = { ...next.tokens[key], lastUsedAt: now };
  return next;
}

async function loadCacheStore() {
  const cache = globalThis.caches?.default;
  if (!cache) return emptyMcpTokenStore();
  try {
    const hit = await cache.match(MCP_TOKENS_CACHE_URL);
    return hit ? asStore(await hit.json()) : emptyMcpTokenStore();
  } catch {
    return emptyMcpTokenStore();
  }
}

async function saveCacheStore(store) {
  const cache = globalThis.caches?.default;
  if (!cache) return;
  await cache.put(
    MCP_TOKENS_CACHE_URL,
    new Response(JSON.stringify(asStore(store)), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=31536000" },
    })
  );
}

export async function loadMcpTokens(env) {
  if (env?.INSTALLS?.get) {
    try {
      const fromKv = asStore(await env.INSTALLS.get(MCP_TOKENS_KEY, { type: "json" }));
      if (Object.keys(fromKv.tokens).length) return fromKv;
    } catch {
      /* fall through */
    }
  }
  return loadCacheStore();
}

export async function saveMcpTokens(env, store) {
  const next = asStore(store);
  if (env?.INSTALLS?.put) {
    await env.INSTALLS.put(MCP_TOKENS_KEY, JSON.stringify(next));
  }
  await saveCacheStore(next);
  return next;
}
