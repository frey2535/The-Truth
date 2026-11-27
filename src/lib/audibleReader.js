/** Read-aloud. Spoken-English voices run on this device. Scripture is not uploaded. */

import {
  BUILTIN_VOICE,
  HUMAN_VOICES,
  canUseBuiltInVoice,
  canUseHumanTts,
  isHumanVoice,
  primeAudioOutput,
  pauseGeneratedAudio,
  resumeGeneratedAudio,
  speakGeneratedText,
  resetGeneratedPause,
} from "./humanTts.js";
import { bestDeviceVoice, humanLikeDeviceVoices } from "./voiceQuality.js";

const DEVICE_CHUNK = 240;
const HUMAN_CHUNK = 380;

export function spokenText(raw) {
  return String(raw || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>]/g, "")
    .replace(/\[|\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function chunkSpokenText(text, max = DEVICE_CHUNK) {
  max = Math.max(1, Math.floor(max) || DEVICE_CHUNK);
  const clean = spokenText(text);
  if (!clean) return [];
  const parts = clean.split(/(?<=[.!?;:])\s+/);
  const chunks = [];
  let buf = "";

  function pushWords(part) {
    const words = String(part || "").split(/\s+/).filter(Boolean);
    for (const word of words) {
      const next = buf ? `${buf} ${word}` : word;
      if (next.length <= max) {
        buf = next;
      } else {
        if (buf) chunks.push(buf);
        let rest = word;
        while (rest.length > max) {
          chunks.push(rest.slice(0, max));
          rest = rest.slice(max);
        }
        buf = rest;
      }
    }
  }

  for (const part of parts) {
    const next = buf ? `${buf} ${part}` : part;
    if (next.length <= max) {
      buf = next;
    } else {
      if (buf) chunks.push(buf);
      buf = "";
      if (part.length <= max) buf = part;
      else pushWords(part);
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

export function chapterSpeakParts(book, chapter, verses = []) {
  return (verses || [])
    .map((verse, i) => {
      const head = i === 0 ? [book, chapter ? `chapter ${chapter}` : ""].filter(Boolean).join(", ") : "";
      // Verse numbers remain available for highlighting, but are never spoken.
      return {
        verse: String(verse?.verse ?? ""),
        text: spokenText(`${head ? `${head}. ` : ""}${verse?.text || ""}`),
      };
    })
    .filter((part) => part.text);
}

export function chapterReadingText(book, chapter, verses = []) {
  return chapterSpeakParts(book, chapter, verses)
    .map((part) => part.text)
    .join(" ");
}

export function pageReadingText(root) {
  const host = root || (typeof document !== "undefined" ? document : null);
  const main = host?.querySelector?.("main") || host;
  if (!main) return "";
  if (!main.cloneNode) return spokenText(main.innerText || main.textContent || "");
  const clone = main.cloneNode(true);
  clone
    .querySelectorAll("button, nav, form, input, textarea, select, .page-tools, .listen-control, .listen-now, [data-no-listen]")
    .forEach((el) => el.remove());
  return spokenText(clone.innerText || clone.textContent || "");
}

export const LISTEN_PREFS_KEY = "searchingfortruth_listen_v3";

export const RATE_PRESETS = [
  { value: 0.7, label: "Slow" },
  { value: 0.85, label: "Gentle" },
  { value: 1, label: "Normal" },
  { value: 1.2, label: "Brisk" },
  { value: 1.4, label: "Fast" },
];

export const RATE_MIN = 0.6;
export const RATE_MAX = 1.6;

export function normalizeRate(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(RATE_MAX, Math.max(RATE_MIN, Math.round(n * 20) / 20));
}

export function ratePresetLabel(rate) {
  const normalized = normalizeRate(rate);
  const hit = RATE_PRESETS.find((preset) => preset.value === normalized);
  return hit ? hit.label : `${normalized}×`;
}

export function listVoiceChoices(voices = []) {
  return humanLikeDeviceVoices(
    [...voices].map((voice) => ({
      uri: String(voice.voiceURI || voice.name || ""),
      voiceURI: String(voice.voiceURI || voice.name || ""),
      name: String(voice.name || "Voice"),
      lang: String(voice.lang || ""),
      localService: voice.localService,
    }))
  ).map((voice) => ({
    uri: voice.uri,
    name: voice.name,
    lang: voice.lang,
    group: "Human-like voices on this device",
  }));
}

/** @param {any[]} voices @param {{ includeHuman?: boolean }} [options] */
export function listenVoiceOptions(voices = [], { includeHuman } = {}) {
  const human = includeHuman ?? canUseHumanTts();
  return [
    ...(human
      ? HUMAN_VOICES.map((voice) => ({
          uri: voice.uri,
          name: voice.name,
          lang: "en",
          group: "Spoken English — sounds like a person",
        }))
      : []),
    ...listVoiceChoices(voices),
    ...(canUseBuiltInVoice() ? [{ uri: BUILTIN_VOICE, name: "Built-in English voice", lang: "", group: "Built-in voices" }] : []),
  ];
}

export function defaultListenPrefs() {
  return { voiceURI: "", rate: 1 };
}

export function loadListenPrefs(storage) {
  const fallback = defaultListenPrefs();
  try {
    const raw = storage?.getItem?.(LISTEN_PREFS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const voiceURI = String(parsed.voiceURI || "");
    return {
      voiceURI: isHumanVoice(voiceURI) && !canUseHumanTts() ? "" : voiceURI,
      rate: normalizeRate(parsed.rate),
    };
  } catch {
    return fallback;
  }
}

export function saveListenPrefs(prefs, storage) {
  const next = {
    voiceURI: String(prefs?.voiceURI || ""),
    rate: normalizeRate(prefs?.rate),
  };
  try {
    storage?.setItem?.(LISTEN_PREFS_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

const idleState = () => ({ status: "idle", id: "", title: "", preparing: "", currentVerse: "" });

let prefs = defaultListenPrefs();
let cachedVoices = listenVoiceOptions();
let pendingRestart = false;
let state = idleState();
const listeners = new Set();
let queue = [];
let verseMarks = [];
let index = 0;
let token = 0;
let speakAbort = null;
let completion = null;
let activeEngine = "device";
let activeUtterance = null;
let deviceWatchdog = null;
let retries = 0;
const triedEngines = new Set();
let preferBuiltIn = false;
function clearDeviceWatchdog() {
  if (deviceWatchdog !== null) clearTimeout(deviceWatchdog);
  deviceWatchdog = null;
}
function deferCompletion(done, myToken) {
  defer(() => { if (myToken === token) done?.(); });
}

function snapshot() {
  return {
    ...state,
    rate: prefs.rate,
    voiceURI: prefs.voiceURI,
    voices: cachedVoices,
  };
}

function emit() {
  const snap = snapshot();
  for (const fn of listeners) fn(snap);
}

function defer(fn) {
  if (typeof fn !== "function") return;
  const timer = typeof window !== "undefined" ? window.setTimeout : setTimeout;
  timer(fn, 0);
}

export function getAudibleState() {
  return snapshot();
}

export function subscribeAudible(fn) {
  listeners.add(fn);
  fn(snapshot());
  return () => listeners.delete(fn);
}

export function isSpeechSupported() {
  return Boolean(synth()) || canUseHumanTts();
}

function synth() {
  if (typeof window === "undefined" || typeof window.SpeechSynthesisUtterance !== "function") return null;
  return window.speechSynthesis || null;
}

function refreshVoices(speech) {
  cachedVoices = listenVoiceOptions(speech?.getVoices?.() || []);
  return cachedVoices;
}

function pickVoice(speech) {
  const voices = speech.getVoices?.() || [];
  if (prefs.voiceURI && !isHumanVoice(prefs.voiceURI)) {
    const chosen = voices.find((voice) => (voice.voiceURI || voice.name) === prefs.voiceURI);
    if (chosen && bestDeviceVoice([chosen])) return chosen;
  }
  return bestDeviceVoice(voices);
}

function loadPrefsFromWindow() {
  if (typeof window === "undefined") return;
  prefs = loadListenPrefs(window.localStorage);
  const speech = synth();
  if (speech) {
    refreshVoices(speech);
    speech.addEventListener("voiceschanged", () => {
      refreshVoices(speech);
      emit();
    });
  }
}

if (typeof window !== "undefined") loadPrefsFromWindow();

function speakNext(myToken) {
  const speech = synth();
  if (!speech || myToken !== token || state.status !== "speaking") return;
  clearDeviceWatchdog();
  if (index >= queue.length) {
    const done = completion;
    completion = null;
    state = idleState();
    emit();
    deferCompletion(done, myToken);
    return;
  }
  triedEngines.add("device");
  state = { ...state, currentVerse: verseMarks[index] || "" };
  emit();
  const utterance = new window.SpeechSynthesisUtterance(queue[index]);
  activeUtterance = utterance;
  const voice = pickVoice(speech);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-US";
  utterance.rate = prefs.rate;
  utterance.pitch = 1;
  const current = () => myToken === token && activeUtterance === utterance;
  const retry = (event) => {
    if (!current()) return;
    clearDeviceWatchdog();
    activeUtterance = null;
    speech.cancel();
    if (state.status !== "speaking") return;
    const transient = ["canceled", "interrupted", "audio-busy", "audio-hardware"].includes(event?.error);
    if (transient && ++retries <= 2) {
      window.setTimeout(() => speakNext(myToken), 250);
      return;
    }
    if (!triedEngines.has("builtin") && canUseBuiltInVoice()) {
      preferBuiltIn = true;
      activeEngine = "builtin";
      void speakGeneratedQueue(myToken, state.id, state.title);
      return;
    }
    pauseForRetry("The device voice is unavailable. Tap Resume to retry.");

  };
  utterance.onend = () => {
    if (!current()) return;
    clearDeviceWatchdog();
    activeUtterance = null;
    retries = 0;
    state = { ...state, preparing: "" };
    index += 1;
    if (state.status === "speaking") window.setTimeout(() => speakNext(myToken), 30);
  };
  utterance.onerror = retry;
  deviceWatchdog = setTimeout(retry, 4000);
  utterance.onstart = () => {
    if (!current()) return;
    clearDeviceWatchdog();
    state = { ...state, preparing: "" };
    emit();
    deviceWatchdog = setTimeout(retry, Math.max(15000, queue[index].length * 180 / prefs.rate + 5000));
  };
  try {
    speech.speak(utterance);
  } catch {
    retry();
  }
}

function preferredEngine() {
  if (isHumanVoice(prefs.voiceURI) && canUseHumanTts()) return "human";
  if ((prefs.voiceURI === BUILTIN_VOICE || preferBuiltIn || !synth()) && canUseBuiltInVoice()) return "builtin";
  return synth() ? "device" : "human";
}

/** @typedef {{ id?: string, title?: string, verses?: { verse?: string | number, text?: string }[], book?: string, chapter?: number, onComplete?: () => void }} NarrationOptions */

/** @param {string | (() => string)} text @param {NarrationOptions} [options] */
function beginQueue(text, { id = "", title = "", verses, book, chapter, onComplete } = {}) {
  activeEngine = preferredEngine();
  completion = typeof onComplete === "function" ? onComplete : null;
  if (Array.isArray(verses) && verses.length) {
    const parts = chapterSpeakParts(book, chapter, verses);
    const chunks = parts.flatMap(({ text, verse }) =>
      chunkSpokenText(text, activeEngine === "human" ? HUMAN_CHUNK : DEVICE_CHUNK).map((chunk) => ({ text: chunk, verse }))
    );
    queue = chunks.map(part => part.text);
    verseMarks = chunks.map(part => part.verse);
  } else {
    queue = chunkSpokenText(typeof text === "function" ? text() : text, activeEngine === "human" ? HUMAN_CHUNK : DEVICE_CHUNK);
    verseMarks = queue.map(() => "");
  }
  index = 0;
  retries = 0;
  triedEngines.clear();
  return {
    id: String(id || title || "listen"),
    title: String(title || "The Truth"),
  };
}

function pauseForRetry(message) {
  pendingRestart = true;
  state = { ...state, status: "paused", preparing: message };
  emit();
}

async function speakGeneratedQueue(myToken, id, title) {
  const builtIn = activeEngine === "builtin";
  triedEngines.add(activeEngine);
  speakAbort?.abort();
  speakAbort = new AbortController();
  const signal = speakAbort.signal;
  state = { status: "speaking", id, title, preparing: builtIn ? "Loading the built-in voice…" : "Preparing a human voice…", currentVerse: verseMarks[index] || "" };
  emit();
  try {
    const startIndex = index;
    await speakGeneratedText(queue.slice(startIndex), {
      voice: builtIn ? BUILTIN_VOICE : prefs.voiceURI,
      speed: prefs.rate,
      signal,
      onChunkStart: (offset) => {
        if (myToken !== token) return;
        index = startIndex + offset;
        state = { ...state, currentVerse: verseMarks[index] || "" };
        emit();
      },
      onPlaying: () => {
        if (myToken !== token) return;
        state = { ...state, preparing: "" };
        emit();
      },
      onProgress: (message) => {
        if (myToken !== token) return;
        state = { ...state, preparing: message || "", currentVerse: verseMarks[index] || state.currentVerse };
        emit();
      },
    });
    if (myToken !== token || signal.aborted) return;
    const done = completion;
    completion = null;
    state = idleState();
    emit();
    deferCompletion(done, myToken);
  } catch (error) {
    if (myToken !== token || signal.aborted) return;
    if (error?.name === "NotAllowedError") {
      pauseForRetry("Tap Resume to enable narration audio.");
      return;
    }
    if (!triedEngines.has("device") && synth()) {
      activeEngine = "device";
      state = { ...state, preparing: "Using the device voice…" };
      if (state.status === "paused") {
        pendingRestart = true;
        emit();
      } else speakNext(myToken);
      return;
    }
    if (!triedEngines.has("builtin") && canUseBuiltInVoice()) {
      activeEngine = "builtin";
      if (state.status === "paused") pauseForRetry("Tap Resume to try the built-in voice.");
      else void speakGeneratedQueue(myToken, state.id, state.title);
      return;
    }
    pauseForRetry("Narration could not start. Tap Resume to retry or choose another voice.");
  }
}

/** @param {string | (() => string)} text @param {NarrationOptions} [options] */
export function speakText(text, { id = "", title = "", verses, book, chapter, onComplete } = {}) {
  token += 1;
  clearDeviceWatchdog();
  activeUtterance = null;
  pendingRestart = false;
  const myToken = token;
  speakAbort?.abort();
  speakAbort = null;
  resetGeneratedPause();
  const speech = synth();
  if (speech) speech.cancel();
  const started = beginQueue(text, { id, title, verses, book, chapter, onComplete });
  if (!queue.length) {
    completion = null;
    state = idleState();
    emit();
    return false;
  }
  primeAudioOutput();
  if (activeEngine !== "device" && canUseHumanTts()) {
    void speakGeneratedQueue(myToken, started.id, started.title);
    return true;
  }
  if (!speech) {
    completion = null;
    state = idleState();
    emit();
    return false;
  }
  state = { status: "speaking", id: started.id, title: started.title, preparing: "Starting narration…", currentVerse: verseMarks[0] || "" };
  emit();
  // Start in the Play click so browsers that require user activation can speak.
  speakNext(myToken);
  return true;
}

export function pauseAudible() {
  if (state.status !== "speaking") return;
  if (activeEngine !== "device") pauseGeneratedAudio();
  else {
    clearDeviceWatchdog();
    activeUtterance = null;
    synth()?.cancel();
    pendingRestart = true;
  }
  state = { ...state, status: "paused" };
  emit();
}

export function resumeAudible() {
  if (state.status !== "paused") return;
  primeAudioOutput();
  if (activeEngine !== "device") {
    if (pendingRestart) {
      pendingRestart = false;
      triedEngines.clear();
      resetGeneratedPause();
      token += 1;
      void speakGeneratedQueue(token, state.id, state.title);
      return;
    }
    const resumeToken = token;
    state = { ...state, status: "speaking" };
    emit();
    void resumeGeneratedAudio().catch(() => {
      if (resumeToken !== token || state.status !== "speaking") return;
      pauseGeneratedAudio();
      state = { ...state, status: "paused", preparing: "Audio could not resume. Tap Resume to retry." };
      emit();
    });
    return;
  }
  const speech = synth();
  if (!speech) return;
  if (pendingRestart || !speech.speaking) {
    pendingRestart = false;
    retries = 0;
    triedEngines.clear();
    resetGeneratedPause();
    token += 1;
    state = { ...state, status: "speaking" };
    emit();
    speakNext(token);
    return;
  }
  speech.resume();
  state = { ...state, status: "speaking" };
  emit();
}

export function stopAudible() {
  token += 1;
  clearDeviceWatchdog();
  activeUtterance = null;
  pendingRestart = false;
  completion = null;
  speakAbort?.abort();
  speakAbort = null;
  resetGeneratedPause();
  const speech = synth();
  if (speech) speech.cancel();
  queue = [];
  verseMarks = [];
  index = 0;
  state = idleState();
  emit();
}

function persistPrefs(next) {
  prefs = saveListenPrefs({ ...prefs, ...next }, typeof window !== "undefined" ? window.localStorage : null);
  emit();
}

function applyLiveSettings() {
  if (state.status === "idle") return;
  const wasPaused = state.status === "paused";
  const id = state.id;
  const title = state.title;
  token += 1;
  clearDeviceWatchdog();
  activeUtterance = null;
  speakAbort?.abort();
  resetGeneratedPause();
  const speech = synth();
  speech?.cancel();
  activeEngine = preferredEngine();
  retries = 0;
  triedEngines.clear();
  if (wasPaused) {
    pendingRestart = true;
    state = { ...state, status: "paused", preparing: "" };
    emit();
    return;
  }
  primeAudioOutput();
  if (activeEngine !== "device") void speakGeneratedQueue(token, id, title);
  else speakNext(token);
}

export function setAudibleRate(rate) {
  persistPrefs({ rate: normalizeRate(rate) });
  applyLiveSettings();
}

export function setAudibleVoice(voiceURI) {
  preferBuiltIn = false;
  persistPrefs({ voiceURI: String(voiceURI || "") });
  applyLiveSettings();
}

export function previewAudibleVoice() {
  speakText("And ye shall know the truth, and the truth shall make you free.", {
    id: "listen-preview",
    title: "Voice preview",
  });
}

/** @param {string | (() => string)} text @param {NarrationOptions} [opts] */
export function toggleAudible(text, opts = {}) {
  const id = String(opts.id || opts.title || "listen");
  if (state.status !== "idle" && state.id === id) {
    if (state.status === "speaking") pauseAudible();
    else resumeAudible();
    return;
  }
  speakText(text, { ...opts, id });
}
