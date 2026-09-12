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

const idleState = () => ({ status: "idle", id: "", title: "" });

let state = idleState();
const listeners = new Set();
let queue = [];
let index = 0;
let token = 0;

function emit() {
  const snap = { ...state };
  for (const fn of listeners) fn(snap);
}

export function getAudibleState() {
  return { ...state };
}

export function subscribeAudible(fn) {
  listeners.add(fn);
  fn({ ...state });
  return () => listeners.delete(fn);
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function synth() {
  return isSpeechSupported() ? window.speechSynthesis : null;
}

function pickVoice(speech) {
  const voices = speech.getVoices?.() || [];
  return (
    voices.find((voice) => /^en-GB/i.test(voice.lang) && /United Kingdom|English \(UK\)/i.test(voice.name)) ||
    voices.find((voice) => /^en/i.test(voice.lang) && /natural|premium|enhanced|neural/i.test(voice.name)) ||
    voices.find((voice) => voice.lang === "en-US") ||
    voices.find((voice) => /^en/i.test(voice.lang)) ||
    null
  );
}

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
  utterance.rate = 0.95;
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
  speech.resume();
  state = { ...state, status: "speaking" };
  emit();
}

export function stopAudible() {
  token += 1;
  const speech = synth();
  if (speech) speech.cancel();
  queue = [];
  index = 0;
  state = idleState();
  emit();
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
