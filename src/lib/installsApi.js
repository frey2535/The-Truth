import {
  createOwnerSession,
  emptyLedger,
  normalizeEmail,
  ownerCredentials,
  ownerSession,
  ownerStats,
  passwordsMatch,
  pruneSessions,
  recordDevice,
} from "./installLedger.js";

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
  const ledger = pruneSessions((await load()) || emptyLedger());
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
    const ledger = (await load()) || emptyLedger();
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

  const ledger = pruneSessions((await load()) || emptyLedger());
  const session = ownerSession(ledger, bearerToken(authorization));
  if (!session) {
    return { status: 401, body: { error: "Platform owner sign-in is required" } };
  }
  return { status: 200, body: { email: session.email, ...ownerStats(ledger) } };
}

export function readOwnerCredentials(env, allowLocalFallback) {
  return ownerCredentials(env, { allowLocalFallback });
}
