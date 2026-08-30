import assert from "node:assert/strict";
import { isJesusVerse, speechSegments } from "../src/lib/jesusWords.js";
import { textToNumberedVerses } from "../src/lib/readingVerses.js";
import { looksLikeAppShell, looksLikeHtmlDocument } from "../src/lib/fetchStoredText.js";
import { extractCatalogSection } from "../src/lib/catalogExtract.js";

assert.equal(isJesusVerse("John", 3, 16), true);
assert.equal(isJesusVerse("Matthew", 5, 3), true);
assert.equal(isJesusVerse("John", 11, 35), false);
assert.equal(isJesusVerse("Genesis", 1, 1), false);
assert.equal(isJesusVerse("Acts", 9, 4), true);
assert.equal(isJesusVerse("Revelation", 1, 17), true);
assert.equal(isJesusVerse("1 Corinthians", 11, 24), true);

const john316 = speechSegments("John", 3, 16, "For God so loved the world, that he gave his only begotten Son.");
assert.equal(john316.length, 1);
assert.equal(john316[0].jesus, true);

const intro = speechSegments("Matthew", 4, 19, "And he saith unto them, Follow me, and I will make you fishers of men.");
assert.equal(intro[0].jesus, false);
assert.equal(intro[1].jesus, true);
assert.match(intro[1].text, /Follow me/);

const wept = speechSegments("John", 11, 35, "Jesus wept.");
assert.equal(wept.every((s) => !s.jesus), true);

const thomas = speechSegments("Gospel of Thomas", 1, 3, "Jesus said, If those who lead you say to you, See, the kingdom is in the sky.");
assert.equal(thomas.some((s) => s.jesus), true);
assert.match(thomas.find((s) => s.jesus).text, /If those who lead you/);

const web = textToNumberedVerses(
  "3 Maccabees\nThe Third Book of the Maccabees is recognized as Deuterocanonical.\n1 Now Philopater marched out.\n2 And one Theodotus took armed men.\n3 But Dositheus conveyed Ptolemy away."
);
assert.ok(web.length >= 3);
assert.ok(web.some((v) => /Philopater/.test(v.text)));
assert.ok(web.some((v) => /Theodotus/.test(v.text)));

const prose = textToNumberedVerses("First paragraph here.\n\nSecond paragraph here.\n\nThird paragraph here.");
assert.equal(prose.length, 3);
assert.equal(prose[1].verse, 2);

const didache = textToNumberedVerses(
  "A long introduction about the Bryennios manuscript.\n\n1. There are two ways, one of life and one of death.\n2. The way of life, then, is this: First, thou shalt love God.\n3. And of these sayings the teaching is this."
);
assert.ok(didache.length >= 3);
assert.match(didache.map((v) => v.text).join(" "), /two ways/);
assert.match(didache.map((v) => v.text).join(" "), /way of life/);

const citations = textToNumberedVerses(
  "See 1 Cor. iv. 16 and 2 Clement xviii for the notes.\n\nAnother paragraph of introduction remains here.\n\n1 Now Philopater marched out.\n2 And one Theodotus took armed men.\n3 But Dositheus conveyed Ptolemy away."
);
assert.ok(citations.some((v) => /Philopater/.test(v.text)));
assert.equal(citations.filter((v) => /^Cor\./.test(v.text)).length, 0);

assert.equal(looksLikeAppShell("<!doctype html><html><body><div id=\"root\"></div></body></html>"), true);
assert.equal(looksLikeHtmlDocument("<!doctype html><html lang=\"en\">", "text/html"), true);
assert.equal(looksLikeHtmlDocument("THE FIRST EPISTLE OF CLEMENT\n\nThe Church of God.", "text/plain"), false);
assert.equal(extractCatalogSection("<!doctype html><html><body>app</body></html>", "THE TEACHING OF THE TWELVE APOSTLES", "THE APOSTOLICAL CONSTITUTIONS").found, false);
assert.match(extractCatalogSection("intro\nTHE TEACHING OF THE TWELVE APOSTLES\n1. Two ways.\nTHE APOSTOLICAL CONSTITUTIONS\nmore", "THE TEACHING OF THE TWELVE APOSTLES", "THE APOSTOLICAL CONSTITUTIONS").text, /Two ways/);

console.log("reading layout tests passed");
