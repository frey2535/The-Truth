import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCopyText } from "../src/lib/clipboardText.js";

assert.equal(resolveCopyText("  hello  "), "  hello  ");
assert.equal(resolveCopyText(() => "from fn"), "from fn");
assert.equal(resolveCopyText(null), "");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pageTools = readFileSync(join(root, "src/components/PageTools.jsx"), "utf8");
assert.match(pageTools, /CopyTextButton/);
assert.match(pageTools, /Copy this page/);

const verseTools = readFileSync(join(root, "src/components/study/VerseTools.jsx"), "utf8");
assert.match(verseTools, /CopyTextButton/);

const assistant = readFileSync(join(root, "src/pages/Assistant.jsx"), "utf8");
assert.match(assistant, /CopyTextButton/);
assert.match(assistant, /PasteTextButton/);

const search = readFileSync(join(root, "src/pages/Search.jsx"), "utf8");
assert.match(search, /CopyTextButton/);
assert.match(search, /PasteTextButton/);

const css = readFileSync(join(root, "src/index.css"), "utf8");
assert.match(css, /user-select:\s*text/);

console.log("clipboard-text: ok");
