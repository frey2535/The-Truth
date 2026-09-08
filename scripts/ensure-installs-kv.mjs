/**
 * Create the thetruth-installs KV namespace if needed.
 * Does not PATCH the Pages project — rewriting deployment_configs strips
 * Secrets (PLATFORM_OWNER_PASSWORD, Google) and breaks sign-in.
 */
const ACCOUNT = String(process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
const TOKEN = String(process.env.CLOUDFLARE_API_TOKEN || "").trim();
const TITLE = "thetruth-installs";

if (!ACCOUNT || !TOKEN) {
  console.log("No Cloudflare credentials; skip INSTALLS KV ensure.");
  process.exit(0);
}

async function cf(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.errors?.[0]?.message || `Cloudflare API ${res.status} ${path}`);
  }
  return data.result;
}

const namespaces = (await cf("/storage/kv/namespaces")) || [];
let ns = (Array.isArray(namespaces) ? namespaces : []).find((row) => row.title === TITLE);
if (!ns) {
  ns = await cf("/storage/kv/namespaces", { method: "POST", body: { title: TITLE } });
  console.log(`Created KV namespace ${TITLE} (${ns.id})`);
} else {
  console.log(`Using KV namespace ${TITLE} (${ns.id})`);
}
console.log(
  "Bind it as INSTALLS on Pages project thetruth in the dashboard if it is not already bound. Do not PATCH deployment_configs from CI."
);
