import { PRIOR_INSTALLS } from "../data/priorInstalls.js";
import {
  emptyLedger,
  mergeDevices,
  normalizeEmail,
  ownerCredentials,
  ownerSession,
  ownerStats,
  passwordsMatch,
  pruneSessions,
  recordDevice,
  signOwnerToken,
  verifyOwnerToken,
} from "./installLedger.js";

async function loadMerged(load, save) {
  const merged = mergeDevices((await load()) || emptyLedger(), PRIOR_INSTALLS);
  if (merged.added) await save(merged.ledger);
  return merged.ledger;
}

function newPriorDeviceId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `prior-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function bearerToken(authorization) {
  const raw = String(authorization || "");
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

export async function handleOwnerLogin({ body, credentials }) {
  if (!credentials.configured) {
    return {
      status: 503,
      body: {
        error:
          "This deploy did not receive PLATFORM_OWNER_PASSWORD from the Pages environment.",
      },
    };
  }
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");
  if (email !== credentials.email || !passwordsMatch(password, credentials.password)) {
    return { status: 401, body: { error: "Invalid owner email or password" } };
  }
  const session = await signOwnerToken(email, credentials.password);
  return {
    status: 200,
    body: session,
  };
}

export async function resolveOwnerSession({ authorization, credentials, load, save }) {
  const token = bearerToken(authorization);
  if (!token) return null;
  const signed = await verifyOwnerToken(token, credentials.password, Date.now(), credentials.email);
  if (signed) return signed;
  if (!load) return null;
  const ledger = pruneSessions(await loadMerged(load, save));
  return ownerSession(ledger, token);
}

export async function handleInstallsRequest({ method, body, authorization, credentials, load, save }) {
  if (method === "POST") {
    if (body?.backfill) {
      if (!credentials.configured) {
        return {
          status: 503,
          body: { error: "Platform owner sign-in is required to record past installs." },
        };
      }
      const session = await resolveOwnerSession({ authorization, credentials, load, save });
      if (!session) {
        return { status: 401, body: { error: "Platform owner sign-in is required" } };
      }
      const ledger = pruneSessions(await loadMerged(load, save));
      const rows = Array.isArray(body.downloads) ? body.downloads : [body];
      const extras = rows.map((row) => ({
        device: String(row.device || "").trim() || newPriorDeviceId(),
        platform: row.platform,
        source: "prior",
        standalone: true,
        at: row.at,
        note: row.note,
      }));
      const merged = mergeDevices(ledger, extras);
      if (merged.added) await save(merged.ledger);
      return { status: 200, body: { recorded: merged.added, ...ownerStats(merged.ledger) } };
    }
    return persistRecordedDevice({ body, load, save });
  }

  if (method !== "GET") {
    return { status: 405, body: { error: "Method not allowed" } };
  }

  if (!credentials.configured) {
    return {
      status: 503,
      body: {
        error:
          "This deploy did not receive PLATFORM_OWNER_PASSWORD from the Pages environment.",
      },
    };
  }

  const session = await resolveOwnerSession({ authorization, credentials, load, save });
  if (!session) {
    return { status: 401, body: { error: "Platform owner sign-in is required" } };
  }
  const ledger = pruneSessions(await loadMerged(load, save));
  return { status: 200, body: { email: session.email, ...ownerStats(ledger) } };
}

export async function handleInstallHit({ query, load, save }) {
  return persistRecordedDevice({
    body: {
      device: query.device,
      platform: query.platform,
      source: query.source,
      standalone: query.standalone === "1" || query.standalone === "true",
      at: query.at,
    },
    load,
    save,
  });
}

export async function persistRecordedDevice({ body, load, save, attempts = 5 }) {
  const device = String(body?.device || "").trim();
  for (let i = 0; i < attempts; i += 1) {
    const ledger = await loadMerged(load, save);
    const result = recordDevice(ledger, body || {});
    if (result.error) return { status: 400, body: { error: result.error } };
    if (!result.added) return { status: 200, body: { recorded: false } };
    await save(result.ledger);
    const verify = asLedger(await load());
    if (verify.devices?.[device]) return { status: 200, body: { recorded: true } };
  }
  return { status: 503, body: { error: "Install was not saved. Try again." } };
}

function asLedger(value) {
  if (!value || typeof value !== "object") return { devices: {}, sessions: {} };
  return {
    devices: value.devices && typeof value.devices === "object" ? value.devices : {},
    sessions: value.sessions && typeof value.sessions === "object" ? value.sessions : {},
  };
}

export function readOwnerCredentials(env, allowLocalFallback) {
  return ownerCredentials(env, { allowLocalFallback });
}
