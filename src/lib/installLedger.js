/** Shared install ledger — used by the Cloudflare function and local Vite API. */

export const OWNER_EMAIL_DEFAULT = "currenflowconsultingllc@gmail.com";
export const LOCAL_OWNER_PASSWORD = "owner-local";
export const OWNER_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

const SHARE_VALUES = new Set(["facebook", "play", "link", "direct"]);

export function emptyLedger() {
  return { devices: {}, sessions: {} };
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function envValue(env, names) {
  const bag = env || {};
  for (const name of names) {
    const value = String(bag[name] || "").trim();
    if (value) return value;
  }
  return "";
}

export function ownerEmailList(source = {}) {
  const extra = [];
  if (Array.isArray(source.emails)) extra.push(...source.emails);
  if (source.email) extra.push(source.email);
  extra.push(OWNER_EMAIL_DEFAULT);
  extra.push(envValue(source, ["PLATFORM_OWNER_EMAIL"]));
  return [...new Set(extra.map((value) => normalizeEmail(value)).filter(Boolean))];
}

export function isPlatformOwnerEmail(email, source = {}) {
  return ownerEmailList(source).includes(normalizeEmail(email));
}

export function ownerCredentials(env = {}, { allowLocalFallback = false } = {}) {
  const emails = ownerEmailList(env);
  const email = emails[0] || OWNER_EMAIL_DEFAULT;
  const configured = envValue(env, ["PLATFORM_OWNER_PASSWORD", "PLATFORM_OWNER_PASS"]);
  const password = configured || (allowLocalFallback ? LOCAL_OWNER_PASSWORD : "");
  return {
    email,
    emails,
    password,
    configured: Boolean(password),
    usingLocalFallback: Boolean(allowLocalFallback && !configured),
    googleClientId: envValue(env, ["GOOGLE_CLIENT_ID", "VITE_GOOGLE_CLIENT_ID"]),
  };
}

export function passwordsMatch(given, expected) {
  const a = String(given || "");
  const b = String(expected || "");
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function newToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return `own_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function pruneSessions(ledger, now = Date.now()) {
  const sessions = { ...(ledger.sessions || {}) };
  for (const [token, row] of Object.entries(sessions)) {
    if (!row?.exp || row.exp < now) delete sessions[token];
  }
  return { ...ledger, sessions };
}

export function createOwnerSession(ledger, email, now = Date.now()) {
  const next = pruneSessions(ledger, now);
  const token = newToken();
  next.sessions = {
    ...next.sessions,
    [token]: { email: normalizeEmail(email), exp: now + OWNER_SESSION_MS },
  };
  return { ledger: next, token, exp: next.sessions[token].exp };
}

export function ownerSession(ledger, token, now = Date.now()) {
  if (!token) return null;
  const row = ledger.sessions?.[token];
  if (!row || row.exp < now) return null;
  return row;
}

async function hmacHex(secret, text) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(String(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(text)));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Signed owner token — does not write the download ledger. */
export async function signOwnerToken(email, secret, now = Date.now()) {
  const normalized = normalizeEmail(email);
  const exp = now + OWNER_SESSION_MS;
  const payload = `${normalized}|${exp}`;
  const sig = await hmacHex(secret, payload);
  return { token: `own2.${exp}.${sig}`, email: normalized, exp };
}

export async function verifyOwnerToken(token, secret, now = Date.now(), email = OWNER_EMAIL_DEFAULT) {
  const raw = String(token || "");
  const parts = raw.split(".");
  if (parts[0] !== "own2" || parts.length !== 3 || !secret) return null;
  const exp = Number(parts[1]);
  if (!exp || exp < now) return null;
  const normalized = normalizeEmail(email);
  const expected = await hmacHex(secret, `${normalized}|${exp}`);
  if (!passwordsMatch(parts[2], expected)) return null;
  return { email: normalized, exp };
}

export async function verifyOwnerTokenForEmails(token, secret, now = Date.now(), emails = [OWNER_EMAIL_DEFAULT]) {
  for (const email of ownerEmailList({ emails })) {
    const signed = await verifyOwnerToken(token, secret, now, email);
    if (signed) return signed;
  }
  return null;
}

function cleanText(value, max, pattern) {
  const raw = String(value || "").trim();
  if (!raw || raw.length > max) return "";
  return pattern.test(raw) ? raw : "";
}

function deviceExtras(event = {}) {
  const language = cleanText(event.language, 16, /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/);
  const timezone = cleanText(event.timezone, 64, /^[A-Za-z0-9_+\-/]{1,64}$/);
  const browser = String(event.browser || "")
    .replace(/[^\w ./-]/g, "")
    .trim()
    .slice(0, 48);
  const share = SHARE_VALUES.has(event.share) ? event.share : "";
  return {
    ...(language ? { language } : {}),
    ...(timezone ? { timezone } : {}),
    ...(browser ? { browser } : {}),
    ...(share ? { share } : {}),
  };
}

function fillMissing(existing = {}, extras = {}) {
  const next = { ...existing };
  for (const [key, value] of Object.entries(extras)) {
    if (value && !next[key]) next[key] = value;
  }
  return next;
}

export function recordDevice(ledger, event) {
  const device = String(event?.device || "").trim();
  if (!device || device.length < 8) {
    return { ledger, added: false, error: "A device id is required" };
  }
  const extras = deviceExtras(event);
  const seenAt = event.lastSeen || event.at || new Date().toISOString();
  if (ledger.devices?.[device]) {
    const current = ledger.devices[device];
    const nextRow = {
      ...fillMissing(current, extras),
      lastSeen: seenAt,
      standalone: Boolean(event.standalone) || Boolean(current.standalone),
    };
    return {
      ledger: {
        ...ledger,
        devices: {
          ...(ledger.devices || {}),
          [device]: nextRow,
        },
      },
      added: false,
      updated: true,
    };
  }
  const at = event.at || new Date().toISOString();
  const platform = ["ios", "android", "desktop"].includes(event.platform) ? event.platform : "desktop";
  const source = [
    "appinstalled",
    "standalone",
    "prompt",
    "prior",
    "play",
    "related",
    "homescreen",
  ].includes(event.source)
    ? event.source
    : "standalone";
  const note = String(event.note || "").trim();
  return {
    ledger: {
      ...ledger,
      devices: {
        ...(ledger.devices || {}),
        [device]: {
          at,
          lastSeen: seenAt,
          platform,
          source,
          standalone: Boolean(event.standalone),
          ...extras,
          ...(note ? { note } : {}),
        },
      },
    },
    added: true,
    updated: false,
  };
}

export function mergeDevices(ledger, extras = []) {
  let next = ledger || emptyLedger();
  let added = 0;
  for (const row of extras || []) {
    const result = recordDevice(next, row);
    if (result.error) continue;
    if (result.added) {
      next = result.ledger;
      added += 1;
    }
  }
  return { ledger: next, added };
}

export function ownerStats(ledger) {
  const downloads = Object.entries(ledger.devices || {})
    .map(([device, row]) => ({
      device: device.slice(0, 8),
      at: row.at,
      lastSeen: row.lastSeen || row.at,
      platform: row.platform,
      source: row.source,
      standalone: Boolean(row.standalone),
      language: row.language || "",
      timezone: row.timezone || "",
      browser: row.browser || "",
      share: row.share || "",
      note: row.note || "",
    }))
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
  const byPlatform = { ios: 0, android: 0, desktop: 0 };
  for (const row of downloads) {
    if (byPlatform[row.platform] != null) byPlatform[row.platform] += 1;
  }
  return {
    total: downloads.length,
    prior: downloads.filter((row) => row.source === "prior").length,
    byPlatform,
    downloads,
  };
}
