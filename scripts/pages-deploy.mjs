/**
 * Deploy dist to Pages project thetruth without wrangler.toml in the
 * working directory. A wrangler.toml [vars] block makes Cloudflare ignore
 * dashboard Text environment variables (PLATFORM_OWNER_PASSWORD, Google).
 */
import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";

const toml = "wrangler.toml";
const bak = "wrangler.toml.deploy-bak";
if (existsSync(toml)) renameSync(toml, bak);
try {
  const extra = process.argv.slice(2);
  const result = spawnSync(
    "npx",
    ["wrangler", "pages", "deploy", "dist", "--project-name=thetruth", ...extra],
    { stdio: "inherit", env: process.env }
  );
  process.exit(result.status ?? 1);
} finally {
  if (existsSync(bak)) renameSync(bak, toml);
}
