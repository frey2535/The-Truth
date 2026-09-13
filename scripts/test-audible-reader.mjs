import assert from "node:assert/strict";
import {
  LISTEN_PREFS_KEY,
  chapterReadingText,
  chapterSpeakParts,
  chunkSpokenText,
  defaultListenPrefs,
  listVoiceChoices,
  listenVoiceOptions,
  loadListenPrefs,
  normalizeRate,
  pageReadingText,
  ratePresetLabel,
  saveListenPrefs,
  spokenText,
} from "../src/lib/audibleReader.js";
import { isRoboticVoiceName, scoreDeviceVoice } from "../src/lib/voiceQuality.js";
import { HUMAN_VOICES, canUseHumanTts, humanTtsAllowed, humanTtsSupported, isHumanVoice } from "../src/lib/humanTts.js";
import {
  listeningVerseId,
  loadFontScale,
  readingHref,
  readingLabel,
  saveFontScale,
  saveReadingPosition,
  stepFontScale,
  verseDomId,
} from "../src/lib/readingSession.js";
import { libraryHref } from "../src/lib/libraryLinks.js";
import { romanNumeral } from "../src/lib/romanNumeral.js";

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

const parts = chapterSpeakParts("John", 8, [
  { verse: 31, text: "Then said Jesus to those Jews which believed on him" },
  { verse: 32, text: "And ye shall know the truth, and the truth shall make you free." },
]);
assert.equal(parts.length, 2);
assert.equal(parts[0].verse, "31");
assert.equal(parts[1].verse, "32");
assert.match(parts[0].text, /John, chapter 8/);
assert.match(parts[1].text, /Verse 32/);
assert.doesNotMatch(parts[1].text, /chapter 8/);

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

assert.equal(normalizeRate("1.2"), 1.2);
assert.equal(normalizeRate(9), 1.6);
assert.equal(normalizeRate("nope"), 1);
assert.equal(ratePresetLabel(0.7), "Slow");

const store = new Map();
const memory = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
};
assert.equal(defaultListenPrefs().voiceURI, "");
assert.equal(humanTtsSupported(), false);
assert.equal(canUseHumanTts(), false);
assert.deepEqual(loadListenPrefs(memory), defaultListenPrefs());
const saved = saveListenPrefs({ voiceURI: "human:am_michael", rate: 0.85 }, memory);
assert.equal(saved.rate, 0.85);
assert.equal(loadListenPrefs(memory).voiceURI, "");
assert.match(memory.getItem(LISTEN_PREFS_KEY), /am_michael/);
const deviceSaved = saveListenPrefs({ voiceURI: "en-US", rate: 1.2 }, memory);
assert.equal(deviceSaved.voiceURI, "en-US");
assert.equal(loadListenPrefs(memory).voiceURI, "en-US");

assert.ok(isRoboticVoiceName("eSpeak NG", "en"));
assert.ok(scoreDeviceVoice({ name: "Google US English", lang: "en-US", localService: false }) > scoreDeviceVoice({ name: "eSpeak NG", lang: "en-GB" }));

const voices = listVoiceChoices([
  { voiceURI: "fr", name: "French", lang: "fr-FR" },
  { voiceURI: "en", name: "Google US English", lang: "en-US", localService: false },
  { voiceURI: "robot", name: "eSpeak NG", lang: "en-GB" },
]);
assert.equal(voices[0].name, "Google US English");
assert.match(voices.at(-1).name, /eSpeak|mechanical/i);

assert.equal(listenVoiceOptions([]).some((voice) => isHumanVoice(voice.uri)), false);
const options = listenVoiceOptions([], { includeHuman: true });
assert.equal(options[0].uri, HUMAN_VOICES[0].uri);
assert.match(options[0].group, /person/i);

assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", deviceMemory: 8 }), false);
assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (Linux; Android 14)", deviceMemory: 8 }), false);
assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120", deviceMemory: 4 }), false);
assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", deviceMemory: undefined }), false);
assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120", deviceMemory: 8 }), true);
assert.equal(humanTtsAllowed({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120", deviceMemory: 8, skip: true }), false);

assert.equal(verseDomId("John", 8, 32), "verse-John-8-32");
assert.equal(listeningVerseId("chapter:John:8", "32", "John", 8), "32");
assert.equal(listeningVerseId("verse:John 8:32", "", "John", 8), "32");
assert.equal(listeningVerseId("chapter:John:7", "1", "John", 8), "");
assert.equal(stepFontScale(1, 1), 1.15);
assert.equal(stepFontScale(0.9, -1), 0.9);

const readingStore = new Map();
const readingMemory = {
  getItem: (key) => (readingStore.has(key) ? readingStore.get(key) : null),
  setItem: (key, value) => readingStore.set(key, String(value)),
};
assert.equal(loadFontScale(readingMemory), 1);
assert.equal(saveFontScale(1.3, readingMemory), 1.3);
const lastRead = saveReadingPosition({ corpus: "bible", book: "John", chapter: 8, verse: 32 }, readingMemory);
assert.equal(readingLabel(lastRead), "John 8:32");
assert.equal(readingHref(lastRead), "/library?corpus=bible&book=John&chapter=8&verse=32");
assert.match(libraryHref({ book: "John", chapter: 8, source: "canon", reference: "John 8:32" }), /verse=32/);
assert.equal(romanNumeral(8), "VIII");
assert.equal(romanNumeral(9), "IX");
assert.equal(romanNumeral(119), "CXIX");

console.log("audible reader ok");
