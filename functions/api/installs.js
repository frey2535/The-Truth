import { emptyLedger } from "../../src/lib/installLedger.js";
import { handleInstallsRequest, readOwnerCredentials } from "../../src/lib/installsApi.js";

const LEDGER_KEY = "ledger";
const CACHE_URL = "https://thetruth.currentflowconsulting.org/__install-ledger";

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

async function loadLedger(env) {
  if (env.INSTALLS) {
    return (await env.INSTALLS.get(LEDGER_KEY, { type: "json" })) || emptyLedger();
  }
  const hit = await caches.default.match(CACHE_URL);
  return hit ? await hit.json() : emptyLedger();
}

async function saveLedger(env, ledger) {
  const raw = JSON.stringify(ledger);
  if (env.INSTALLS) {
    await env.INSTALLS.put(LEDGER_KEY, raw);
    return;
  }
  await caches.default.put(
    CACHE_URL,
    new Response(raw, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=31536000",
      },
    })
  );
}

export async function onRequest({ request, env }) {
  let body = {};
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }
  }
  const result = await handleInstallsRequest({
    method: request.method,
    body,
    authorization: request.headers.get("authorization"),
    credentials: readOwnerCredentials(env, false),
    load: () => loadLedger(env),
    save: (ledger) => saveLedger(env, ledger),
  });
  return json(result.status, result.body);
}
