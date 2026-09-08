import { handleInstallHit } from "../../src/lib/installsApi.js";
import { loadInstallLedger, saveInstallLedger } from "../../src/lib/installStore.js";

const PIXEL = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
  (c) => c.charCodeAt(0)
);

function gif() {
  return new Response(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  await handleInstallHit({
    query: Object.fromEntries(url.searchParams.entries()),
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
  });
  return gif();
}
