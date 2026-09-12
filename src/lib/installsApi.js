import { PRIOR_INSTALLS } from "../data/priorInstalls.js";
import { verifyGoogleOwnerProof } from "./googleOwner.js";
import {
  emptyLedger,
  isPlatformOwnerEmail,
  mergeDevices,
  normalizeEmail,
  ownerCredentials,
  ownerEmailList,
  ownerSession,
  ownerStats,
  passwordsMatch,
  pruneSessions,
  recordDevice,
  signOwnerToken,
  verifyOwnerTokenForEmails,
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

export function ownerLoginStatus(credentials) {
  return {
    configured: Boolean(credentials?.configured),
    email: credentials?.email || "",
  };
}

export async function handleOwnerLogin({ body, credentials, verifyGoogle }) {
  if (!credentials.configured) {
    return {
      status: 503,
      body: {
        error:
          "This deploy did not receive PLATFORM_OWNER_PASSWORD from the Pages environment.",
      },
    };
  }
  const googleProof = body?.idToken || body?.id_token || body?.accessToken || body?.access_token;
  if (googleProof) {
    try {
      const profile = verifyGoogle
        ? await verifyGoogle(body)
        : await verifyGoogleOwnerProof(body, { clientId: credentials.googleClientId });
      if (!isPlatformOwnerEmail(profile?.email, credentials)) {
        return {
          status: 401,
          body: { error: "This Google account is not the platform owner." },
        };
      }
      return {
        status: 200,
        body: await signOwnerToken(profile.email, credentials.password),
      };
    } catch (error) {
      return { status: error.status || 401, body: { error: error.message || "Google owner sign-in failed" } };
    }
  }
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");
  if (!isPlatformOwnerEmail(email, credentials) || !passwordsMatch(password, credentials.password)) {
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
  const signed = await verifyOwnerTokenForEmails(
    token,
    credentials.password,
    Date.now(),
    ownerEmailList(credentials)
  );
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
      language: query.language,
      timezone: query.timezone,
      browser: query.browser,
      share: query.share,
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
    if (!result.added && !result.updated) return { status: 200, body: { recorded: false } };
    await save(result.ledger);
    const verify = asLedger(await load());
    if (verify.devices?.[device]) {
      return { status: 200, body: { recorded: Boolean(result.added), updated: Boolean(result.updated) } };
    }
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
