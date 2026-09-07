import assert from "node:assert/strict";
import { facebookShareUrl, PUBLISHED_APP_URL, SHARE_INSTALL_URL } from "../src/lib/appOrigin.js";
import { chromeIntentUrl, isAuthPath, urlWantsInstall } from "../src/lib/shareInstall.js";

assert.equal(SHARE_INSTALL_URL, `${PUBLISHED_APP_URL}/?install=1`);
assert.ok(facebookShareUrl().includes(encodeURIComponent(SHARE_INSTALL_URL)));
assert.equal(urlWantsInstall("?install=1"), true);
assert.equal(urlWantsInstall("?install=true"), true);
assert.equal(urlWantsInstall(""), false);
assert.equal(urlWantsInstall("?fbclid=abc"), true);
assert.equal(urlWantsInstall("", "https://m.facebook.com/"), true);
assert.equal(urlWantsInstall("", "https://example.com/"), false);

const intent = chromeIntentUrl("https://thetruth.currentflowconsulting.org/?install=1");
assert.match(intent, /^intent:\/\/thetruth\.currentflowconsulting\.org\/\?install=1#Intent;/);
assert.match(intent, /package=com\.android\.chrome/);

assert.equal(isAuthPath("/login"), true);
assert.equal(isAuthPath("/register"), true);
assert.equal(isAuthPath("/forgot-password"), true);
assert.equal(isAuthPath("/owner"), true);
assert.equal(isAuthPath("/owner/downloads"), true);
assert.equal(isAuthPath("/library"), false);
assert.equal(isAuthPath("/"), false);
assert.equal(isAuthPath("/The-Truth/login", "/The-Truth/"), true);
assert.equal(isAuthPath("/The-Truth/library", "/The-Truth/"), false);

console.log("share-install helpers ok");
