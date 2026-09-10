import assert from "node:assert/strict";
import { serveSpaIndex, shouldServeSpa } from "../src/lib/spaRoutes.js";

assert.equal(shouldServeSpa("/login"), true);
assert.equal(shouldServeSpa("/owner"), true);
assert.equal(shouldServeSpa("/owner/downloads"), true);
assert.equal(shouldServeSpa("/owner/cursor"), true);
assert.equal(shouldServeSpa("/register"), true);
assert.equal(shouldServeSpa("/library"), true);
assert.equal(shouldServeSpa("/"), true);
assert.equal(shouldServeSpa("/api/owner-login"), false);
assert.equal(shouldServeSpa("/api/google-token"), false);
assert.equal(shouldServeSpa("/api/mcp"), false);
assert.equal(shouldServeSpa("/.well-known/mcp.json"), false);
assert.equal(shouldServeSpa("/corpus/kjv/Genesis.txt"), false);
assert.equal(shouldServeSpa("/dss/foo"), false);
assert.equal(shouldServeSpa("/sw.js"), false);
assert.equal(shouldServeSpa("/assets/index-abc.js"), false);
assert.equal(shouldServeSpa("/icon-192.png"), false);
assert.equal(shouldServeSpa("/.well-known/assetlinks.json"), false);
assert.equal(shouldServeSpa("/404.html"), false);

const html = "<!doctype html><title>The Truth</title>";
const assets = {
  async fetch(url) {
    const path = new URL(url, "https://thetruth.currentflowconsulting.org").pathname;
    if (path === "/index.html") {
      return new Response(null, { status: 308, headers: { location: "/" } });
    }
    if (path === "/") {
      return new Response(html, { status: 200, headers: { "content-type": "text/html" } });
    }
    return new Response("no", { status: 404 });
  },
};

const res = await serveSpaIndex(assets, "https://thetruth.currentflowconsulting.org");
assert.equal(res.status, 200);
assert.match(await res.text(), /The Truth/);
assert.match(res.headers.get("content-type"), /text\/html/);

console.log("spa routes ok");
