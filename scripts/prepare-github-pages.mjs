import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const repo = process.env.GITHUB_REPOSITORY || "frey2535/The-Truth";
const name = repo.split("/")[1] || "The-Truth";
const base = `/${name}/`;

function prefix(url) {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${base}${String(url).replace(/^\//, "")}`;
}

copyFileSync(join(dist, "index.html"), join(dist, "404.html"));
writeFileSync(join(dist, ".nojekyll"), "");

const manifestPath = join(dist, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.id = base;
manifest.start_url = base;
manifest.scope = base;
manifest.icons = (manifest.icons || []).map((icon) => ({ ...icon, src: prefix(icon.src) }));
manifest.shortcuts = (manifest.shortcuts || []).map((shortcut) => ({
  ...shortcut,
  url: prefix(shortcut.url),
  icons: (shortcut.icons || []).map((icon) => ({ ...icon, src: prefix(icon.src) })),
}));
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
