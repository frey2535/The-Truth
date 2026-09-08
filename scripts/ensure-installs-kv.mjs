/**
 * Create the thetruth-installs KV namespace if needed and bind it as INSTALLS
 * on the Cloudflare Pages project. Safe to run on every deploy.
 */
const ACCOUNT = String(process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
const TOKEN = String(process.env.CLOUDFLARE_API_TOKEN || "").trim();
const PROJECT = "thetruth";
const TITLE = "thetruth-installs";
const BINDING = "INSTALLS";

if (!ACCOUNT || !TOKEN) {
  console.log("No Cloudflare credentials; skip INSTALLS KV bind.");
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

const project = await cf(`/pages/projects/${PROJECT}`);
const configs = project.deployment_configs || {};
const patchEnv = (envName) => {
  const current = configs[envName] || {};
  const kv = { ...(current.kv_namespaces || {}) };
  if (kv[BINDING]?.namespace_id === ns.id) return current;
  kv[BINDING] = { namespace_id: ns.id };
  return { ...current, kv_namespaces: kv };
};
const production = patchEnv("production");
const preview = patchEnv("preview");

await cf(`/pages/projects/${PROJECT}`, {
  method: "PATCH",
  body: {
    deployment_configs: {
      ...configs,
      production,
      preview,
    },
  },
});
console.log(`Bound ${BINDING} on Pages project ${PROJECT}`);
