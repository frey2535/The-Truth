/** On-device read-aloud. Uses the browser’s speech voices. Text is not sent to the internet. */

const MAX_CHUNK = 280;

export function spokenText(raw) {
  return String(raw || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>]/g, "")
    .replace(/\[|\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function chunkSpokenText(text, max = MAX_CHUNK) {
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
        buf = word.length <= max ? word : word.slice(0, max);
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

export function chapterReadingText(book, chapter, verses = []) {
  const head = [book, chapter ? `chapter ${chapter}` : ""].filter(Boolean).join(", ");
  const body = (verses || [])
    .map((verse) => {
      const number = verse?.verse != null && verse.verse !== "" ? `Verse ${verse.verse}. ` : "";
      return `${number}${verse?.text || ""}`;
    })
    .join(" ");
  return spokenText(`${head}. ${body}`);
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

export const LISTEN_PREFS_KEY = "searchingfortruth_listen_v1";

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
  return [...voices]
    .map((voice) => ({
      uri: String(voice.voiceURI || voice.name || ""),
      name: String(voice.name || "Voice"),
      lang: String(voice.lang || ""),
    }))
    .filter((voice) => voice.uri)
    .sort((a, b) => {
      const ae = /^en/i.test(a.lang) ? 0 : 1;
      const be = /^en/i.test(b.lang) ? 0 : 1;
      if (ae !== be) return ae - be;
      return a.name.localeCompare(b.name);
    });
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
    return {
      voiceURI: String(parsed.voiceURI || ""),
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

const idleState = () => ({ status: "idle", id: "", title: "" });

let prefs = defaultListenPrefs();
let cachedVoices = [];
let pendingRestart = false;
let state = idleState();
const listeners = new Set();
let queue = [];
let index = 0;
let token = 0;

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

export function getAudibleState() {
  return snapshot();
}

export function subscribeAudible(fn) {
  listeners.add(fn);
  fn(snapshot());
  return () => listeners.delete(fn);
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function synth() {
  return isSpeechSupported() ? window.speechSynthesis : null;
}

function refreshVoices(speech) {
  cachedVoices = listVoiceChoices(speech?.getVoices?.() || []);
  return cachedVoices;
}

function pickVoice(speech) {
  const voices = speech.getVoices?.() || [];
  if (prefs.voiceURI) {
    const chosen = voices.find((voice) => (voice.voiceURI || voice.name) === prefs.voiceURI);
    if (chosen) return chosen;
  }
  return (
    voices.find((voice) => /^en-GB/i.test(voice.lang) && /United Kingdom|English \(UK\)/i.test(voice.name)) ||
    voices.find((voice) => /^en/i.test(voice.lang) && /natural|premium|enhanced|neural/i.test(voice.name)) ||
    voices.find((voice) => voice.lang === "en-US") ||
    voices.find((voice) => /^en/i.test(voice.lang)) ||
    voices[0] ||
    null
  );
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
  if (!speech || myToken !== token) return;
  if (index >= queue.length) {
    state = idleState();
    emit();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(queue[index]);
  const voice = pickVoice(speech);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-US";
  utterance.rate = prefs.rate;
  utterance.onend = () => {
    if (myToken !== token) return;
    index += 1;
    speakNext(myToken);
  };
  utterance.onerror = () => {
    if (myToken !== token) return;
    index += 1;
    speakNext(myToken);
  };
  speech.speak(utterance);
}

export function speakText(text, { id = "", title = "" } = {}) {
  const speech = synth();
  if (!speech) return false;
  token += 1;
  const myToken = token;
  speech.cancel();
  queue = chunkSpokenText(typeof text === "function" ? text() : text);
  index = 0;
  if (!queue.length) {
    state = idleState();
    emit();
    return false;
  }
  state = { status: "speaking", id: String(id || title || "listen"), title: String(title || "The Truth") };
  emit();
  const start = () => {
    if (myToken !== token) return;
    speakNext(myToken);
  };
  if (!speech.getVoices().length) {
    speech.addEventListener("voiceschanged", start, { once: true });
  }
  start();
  return true;
}

export function pauseAudible() {
  const speech = synth();
  if (!speech || state.status !== "speaking") return;
  speech.pause();
  state = { ...state, status: "paused" };
  emit();
}

export function resumeAudible() {
  const speech = synth();
  if (!speech || state.status !== "paused") return;
  if (pendingRestart || !speech.speaking) {
    pendingRestart = false;
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
  pendingRestart = false;
  const speech = synth();
  if (speech) speech.cancel();
  queue = [];
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
  const speech = synth();
  const wasPaused = state.status === "paused";
  token += 1;
  if (speech) speech.cancel();
  if (wasPaused) {
    pendingRestart = true;
    state = { ...state, status: "paused" };
    emit();
    return;
  }
  speakNext(token);
}

export function setAudibleRate(rate) {
  persistPrefs({ rate: normalizeRate(rate) });
  applyLiveSettings();
}

export function setAudibleVoice(voiceURI) {
  persistPrefs({ voiceURI: String(voiceURI || "") });
  applyLiveSettings();
}

export function previewAudibleVoice() {
  speakText("And ye shall know the truth, and the truth shall make you free.", {
    id: "listen-preview",
    title: "Voice preview",
  });
}

export function toggleAudible(text, opts = {}) {
  const id = String(opts.id || opts.title || "listen");
  if (state.status !== "idle" && state.id === id) {
    if (state.status === "speaking") pauseAudible();
    else resumeAudible();
    return;
  }
  speakText(text, { ...opts, id });
}
