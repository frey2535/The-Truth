import assert from "node:assert/strict";
import {
  chapterReadingText,
  chunkSpokenText,
  pageReadingText,
  spokenText,
} from "../src/lib/audibleReader.js";

assert.equal(spokenText("  And ye shall <b>know</b> the truth.  "), "And ye shall know the truth.");
assert.equal(spokenText("**Yes.** [John 8:32]"), "Yes. John 8:32");

const chunks = chunkSpokenText("First sentence. Second sentence! Third sentence?", 40);
assert.ok(chunks.length >= 2);
assert.ok(chunks.every((part) => part.length <= 40 || !part.includes(" ")));
assert.equal(chunkSpokenText("").length, 0);

const chapter = chapterReadingText("John", 8, [
  { verse: 31, text: "Then said Jesus to those Jews which believed on him" },
  { verse: 32, text: "And ye shall know the truth, and the truth shall make you free." },
]);
assert.match(chapter, /John, chapter 8/);
assert.match(chapter, /Verse 32/);
assert.match(chapter, /the truth shall make you free/);

const fakeMain = {
  querySelector() {
    return this;
  },
  cloneNode() {
    return {
      querySelectorAll() {
        return [];
      },
      innerText: "John 8:32 And ye shall know the truth.",
      textContent: "John 8:32 And ye shall know the truth.",
    };
  },
};
assert.match(pageReadingText(fakeMain), /John 8:32/);

console.log("audible reader ok");
