/** Shared install ledger — used by the Cloudflare function and local Vite API. */

export const OWNER_EMAIL_DEFAULT = "owner@thetruth.currentflowconsulting.org";
export const LOCAL_OWNER_PASSWORD = "owner-local";
export const OWNER_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

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

export function ownerCredentials(env = {}, { allowLocalFallback = false } = {}) {
  const email = normalizeEmail(envValue(env, ["PLATFORM_OWNER_EMAIL"]) || OWNER_EMAIL_DEFAULT);
  const configured = envValue(env, ["PLATFORM_OWNER_PASSWORD", "PLATFORM_OWNER_PASS"]);
  const password = configured || (allowLocalFallback ? LOCAL_OWNER_PASSWORD : "");
  return {
    email,
    password,
    configured: Boolean(password),
    usingLocalFallback: Boolean(allowLocalFallback && !configured),
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

export function recordDevice(ledger, event) {
  const device = String(event?.device || "").trim();
  if (!device || device.length < 8) {
    return { ledger, added: false, error: "A device id is required" };
  }
  if (ledger.devices?.[device]) {
    return { ledger, added: false };
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
          platform,
          source,
          standalone: Boolean(event.standalone),
          ...(note ? { note } : {}),
        },
      },
    },
    added: true,
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
      platform: row.platform,
      source: row.source,
      standalone: Boolean(row.standalone),
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
