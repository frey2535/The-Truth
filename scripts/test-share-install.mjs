import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  facebookShareUrl,
  isLoopbackInstallOrigin,
  metricsApiOrigin,
  PUBLISHED_APP_URL,
  SHARE_INSTALL_URL,
} from "../src/lib/appOrigin.js";
import { detectShareChannel, summarizeBrowser } from "../src/lib/installContext.js";
import { chromeIntentUrl, isAuthPath, urlWantsInstall } from "../src/lib/shareInstall.js";

assert.equal(SHARE_INSTALL_URL, `${PUBLISHED_APP_URL}/?install=1`);
assert.equal(isLoopbackInstallOrigin("truth.localhost"), true);
assert.equal(metricsApiOrigin("192.168.0.12"), PUBLISHED_APP_URL);
assert.ok(facebookShareUrl().includes(encodeURIComponent(SHARE_INSTALL_URL)));
assert.equal(urlWantsInstall("?install=1"), true);
assert.equal(urlWantsInstall("?install=true"), true);
assert.equal(urlWantsInstall(""), false);
assert.equal(urlWantsInstall("?fbclid=abc"), true);
assert.equal(urlWantsInstall("", "https://m.facebook.com/"), true);
assert.equal(urlWantsInstall("", "https://example.com/"), false);
assert.equal(detectShareChannel({ search: "?install=1" }), "link");
assert.equal(detectShareChannel({ search: "?fbclid=abc" }), "facebook");
assert.equal(
  detectShareChannel({ referrer: "android-app://org.currentflowconsulting.thetruth" }),
  "play"
);
assert.equal(summarizeBrowser("Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0"), "Chrome on Android");

const intent = chromeIntentUrl("https://thetruth.currentflowconsulting.org/?install=1");
assert.match(intent, /^intent:\/\/thetruth\.currentflowconsulting\.org\/\?install=1#Intent;/);
assert.match(intent, /package=com\.android\.chrome/);

assert.equal(isAuthPath("/login"), true);
assert.equal(isAuthPath("/register"), true);
assert.equal(isAuthPath("/forgot-password"), true);
assert.equal(isAuthPath("/owner"), true);
assert.equal(isAuthPath("/owner/downloads"), true);
assert.equal(isAuthPath("/library"), false);

const redirects = readFileSync("public/_redirects", "utf8");
assert.match(redirects, /^\/login\s+\/index\.html\s+200/m);
assert.match(redirects, /^\/owner\s+\/index\.html\s+200/m);
const wrangler = readFileSync("wrangler.toml", "utf8");
assert.doesNotMatch(wrangler, /^\s*\[vars\]/m);
assert.match(readFileSync("functions/[[path]].js", "utf8"), /serveSpaIndex/);
assert.equal(isAuthPath("/"), false);
assert.equal(isAuthPath("/The-Truth/login", "/The-Truth/"), true);
assert.equal(isAuthPath("/The-Truth/library", "/The-Truth/"), false);

console.log("share-install helpers ok");
