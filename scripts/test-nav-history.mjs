import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  canGoBackInApp,
  peekNavStack,
  recordNavPath,
  resetNavHistory,
  takePreviousNavPath,
} from "../src/lib/navHistory.js";

resetNavHistory();
recordNavPath("/");
recordNavPath("/library");
recordNavPath("/library"); // duplicate ignored
recordNavPath("/notebook");
assert.deepEqual(peekNavStack(), ["/", "/library", "/notebook"]);
assert.equal(canGoBackInApp(), true);
assert.equal(takePreviousNavPath(), "/library");
assert.deepEqual(peekNavStack(), ["/", "/library"]);
assert.equal(takePreviousNavPath(), "/");
assert.equal(canGoBackInApp(), false);
assert.equal(takePreviousNavPath("/home-fallback"), "/home-fallback");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const layout = readFileSync(join(root, "src/components/Layout.jsx"), "utf8");
assert.match(layout, /BackButton/);
assert.match(layout, /NavHistoryTracker/);
const back = readFileSync(join(root, "src/components/BackButton.jsx"), "utf8");
assert.match(back, /takePreviousNavPath|navigate\(-1\)/);
assert.match(back, /Back to previous screen/);

console.log("nav-history: ok");
