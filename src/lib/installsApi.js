import { PRIOR_INSTALLS } from "../data/priorInstalls.js";
import {
  createOwnerSession,
  emptyLedger,
  mergeDevices,
  normalizeEmail,
  ownerCredentials,
  ownerSession,
  ownerStats,
  passwordsMatch,
  pruneSessions,
  recordDevice,
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

export async function handleOwnerLogin({ body, credentials, load, save }) {
  if (!credentials.configured) {
    return {
      status: 503,
      body: {
        error:
          "The live site still cannot see PLATFORM_OWNER_PASSWORD. Add it as a Secret on the Cloudflare Pages project named thetruth, then retry the latest deploy.",
      },
    };
  }
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");
  if (email !== credentials.email || !passwordsMatch(password, credentials.password)) {
    return { status: 401, body: { error: "Invalid owner email or password" } };
  }
  const ledger = pruneSessions(await loadMerged(load, save));
  const session = createOwnerSession(ledger, email);
  await save(session.ledger);
  return {
    status: 200,
    body: {
      token: session.token,
      email,
      exp: session.exp,
    },
  };
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
      const ledger = pruneSessions(await loadMerged(load, save));
      const session = ownerSession(ledger, bearerToken(authorization));
      if (!session) {
        return { status: 401, body: { error: "Platform owner sign-in is required" } };
      }
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
    const ledger = await loadMerged(load, save);
    const result = recordDevice(ledger, body || {});
    if (result.error) return { status: 400, body: { error: result.error } };
    if (result.added) await save(result.ledger);
    return { status: 200, body: { recorded: result.added } };
  }

  if (method !== "GET") {
    return { status: 405, body: { error: "Method not allowed" } };
  }

  if (!credentials.configured) {
    return {
      status: 503,
      body: {
        error:
          "The live site still cannot see PLATFORM_OWNER_PASSWORD. Add it as a Secret on the Cloudflare Pages project named thetruth, then retry the latest deploy.",
      },
    };
  }

  const ledger = pruneSessions(await loadMerged(load, save));
  const session = ownerSession(ledger, bearerToken(authorization));
  if (!session) {
    return { status: 401, body: { error: "Platform owner sign-in is required" } };
  }
  return { status: 200, body: { email: session.email, ...ownerStats(ledger) } };
}

export function readOwnerCredentials(env, allowLocalFallback) {
  return ownerCredentials(env, { allowLocalFallback });
}
