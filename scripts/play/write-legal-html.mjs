import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGAL_PAGES, renderLegalHtml } from "./legal-html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });

for (const page of Object.values(LEGAL_PAGES)) {
  const out = join(publicDir, page.path.replace(/^\//, ""));
  writeFileSync(out, renderLegalHtml(page));
  console.log(`wrote ${page.path}`);
}
