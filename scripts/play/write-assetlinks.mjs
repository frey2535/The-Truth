import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PLAY_PACKAGE_ID } from "../../src/lib/playStore.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = join(root, "public/.well-known/assetlinks.json");

const fromEnv = String(process.env.PLAY_SHA256_CERT_FINGERPRINTS || "");
const fromArgs = process.argv.slice(2).join(",");
const fingerprints = `${fromEnv},${fromArgs}`
  .split(/[,;]+/)
  .map((value) => value.trim().toUpperCase().replace(/[^0-9A-F:]/g, ""))
  .filter((value) => /[0-9A-F]{2}(:[0-9A-F]{2}){31}/.test(value));

const body = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: PLAY_PACKAGE_ID,
      sha256_cert_fingerprints: fingerprints.length
        ? fingerprints
        : ["REPLACE_WITH_PLAY_APP_SIGNING_SHA256"],
    },
  },
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(body, null, 2)}\n`);
if (!fingerprints.length) {
  console.log("wrote placeholder assetlinks.json — add Play App Signing SHA-256, then rerun:");
  console.log("  PLAY_SHA256_CERT_FINGERPRINTS=AA:BB:... npm run play:assetlinks");
} else {
  console.log(`wrote ${fingerprints.length} fingerprint(s) to public/.well-known/assetlinks.json`);
}
