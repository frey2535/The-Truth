import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("src/pages/Home.jsx", "utf8");
assert.match(home, /className="home-heaven-title"/);
assert.match(home, /<h1 className="home-heaven-title">The Truth<\/h1>/);
assert.match(home, /className="home-heaven-stage"/);
assert.ok(
  home.indexOf('<h1 className="home-heaven-title">The Truth</h1>') <
    home.indexOf("<form onSubmit={handleResearch}"),
  "The Truth heading must appear in the markup before the Home search form"
);

const css = readFileSync("src/index.css", "utf8");
assert.match(css, /\.home-heaven-title\s*\{/);
assert.match(css, /color:\s*#fff/);
assert.match(css, /\.home-heaven-title[\s\S]*position:\s*absolute/);
assert.match(css, /\.home-heaven-title[\s\S]*bottom:\s*0\.15rem/);
assert.doesNotMatch(
  css,
  /\.home-heaven-title[\s\S]{0,400}color:\s*#f3e9c8/,
  "Title must stay white on the clouds, not cream-on-cream"
);

console.log("home title: The Truth stays on the clouds above the search");
