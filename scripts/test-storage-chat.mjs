import assert from "node:assert/strict";
import {
  APP_STORAGE_BYTES,
  APP_STORAGE_LABEL,
  formatStorageBytes,
  wouldExceedCapacity,
} from "../src/lib/appStorage.js";
import { shouldStartNewChat } from "../src/lib/assistantChat.js";
import { extractSearchableText } from "../src/lib/userDocuments.js";

assert.equal(APP_STORAGE_LABEL, "1 TB");
assert.equal(APP_STORAGE_BYTES, 1024 * 1024 * 1024 * 1024);
assert.equal(formatStorageBytes(APP_STORAGE_BYTES), "1.00 TB");
assert.equal(formatStorageBytes(512), "512 B");
assert.equal(wouldExceedCapacity(APP_STORAGE_BYTES - 10, 20), true);
assert.equal(wouldExceedCapacity(100, 20), false);

const savedThread = [{ role: "user", content: "what must I do to be saved?" }];
assert.equal(shouldStartNewChat("is baptism required for salvation?", savedThread), false);
assert.equal(shouldStartNewChat("And what about repentance?", savedThread), false);
assert.equal(shouldStartNewChat("who are the Nephilim?", savedThread), true);
assert.equal(shouldStartNewChat("what must I do to be saved?", []), false);

const text = extractSearchableText(
  "enoch-notes.txt",
  "text/plain",
  "The Book of Enoch speaks of the Watchers and the giants who were born on the earth."
);
assert.match(text, /Watchers/);
assert.equal(extractSearchableText("photo.png", "image/png", ""), "");

console.log("storage and new-chat ok");
