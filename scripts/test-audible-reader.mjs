import assert from "node:assert/strict";
import {
  LISTEN_PREFS_KEY,
  chapterReadingText,
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
import { HUMAN_VOICES, isHumanVoice } from "../src/lib/humanTts.js";

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

assert.equal(normalizeRate("1.2"), 1.2);
assert.equal(normalizeRate(9), 1.6);
assert.equal(normalizeRate("nope"), 1);
assert.equal(ratePresetLabel(0.7), "Slow");

const store = new Map();
const memory = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
};
assert.equal(defaultListenPrefs().voiceURI, HUMAN_VOICES[0].uri);
assert.ok(isHumanVoice(defaultListenPrefs().voiceURI));
assert.deepEqual(loadListenPrefs(memory), defaultListenPrefs());
const saved = saveListenPrefs({ voiceURI: "human:am_michael", rate: 0.85 }, memory);
assert.equal(saved.rate, 0.85);
assert.equal(loadListenPrefs(memory).voiceURI, "human:am_michael");
assert.match(memory.getItem(LISTEN_PREFS_KEY), /am_michael/);

assert.ok(isRoboticVoiceName("eSpeak NG", "en"));
assert.ok(scoreDeviceVoice({ name: "Google US English", lang: "en-US", localService: false }) > scoreDeviceVoice({ name: "eSpeak NG", lang: "en-GB" }));

const voices = listVoiceChoices([
  { voiceURI: "fr", name: "French", lang: "fr-FR" },
  { voiceURI: "en", name: "Google US English", lang: "en-US", localService: false },
  { voiceURI: "robot", name: "eSpeak NG", lang: "en-GB" },
]);
assert.equal(voices[0].name, "Google US English");
assert.match(voices.at(-1).name, /eSpeak|mechanical/i);

const options = listenVoiceOptions([]);
assert.equal(options[0].uri, HUMAN_VOICES[0].uri);
assert.match(options[0].group, /person/i);

console.log("audible reader ok");
