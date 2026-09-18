import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const src = join(root, "android/app/build/outputs/bundle/release/app-release.aab");
if (!existsSync(src)) {
  throw new Error(`Missing ${src}. Run npm run play:bundle first.`);
}
const outDir = join(root, "release");
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, `TheTruth-${pkg.version}.aab`);
copyFileSync(src, dest);
const digest = createHash("sha256").update(readFileSync(dest)).digest("hex");
writeFileSync(`${dest}.sha256`, `${digest}  TheTruth-${pkg.version}.aab\n`);
console.log(`wrote ${dest}`);
console.log(`sha256 ${digest}`);
