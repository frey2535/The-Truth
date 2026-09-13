/** Spoken-English voices that run on this device. Scripture is not uploaded. */

export const HUMAN_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const HUMAN_VOICE_PREFIX = "human:";
export const HUMAN_TTS_SKIP_KEY = "searchingfortruth_skip_human_tts";

export const HUMAN_VOICES = [
  { id: "af_heart", uri: "human:af_heart", name: "Heart — American woman" },
  { id: "af_bella", uri: "human:af_bella", name: "Bella — American woman" },
  { id: "am_michael", uri: "human:am_michael", name: "Michael — American man" },
  { id: "am_liam", uri: "human:am_liam", name: "Liam — American man" },
  { id: "bf_emma", uri: "human:bf_emma", name: "Emma — British woman" },
  { id: "bm_george", uri: "human:bm_george", name: "George — British man" },
  { id: "bm_daniel", uri: "human:bm_daniel", name: "Daniel — British man" },
];

export function isHumanVoice(uri) {
  return String(uri || "").startsWith(HUMAN_VOICE_PREFIX);
}

export function humanVoiceId(uri) {
  const raw = String(uri || "").slice(HUMAN_VOICE_PREFIX.length);
  return HUMAN_VOICES.some((voice) => voice.id === raw) ? raw : HUMAN_VOICES[0].id;
}

export function humanTtsAllowed({ userAgent = "", deviceMemory, webAssembly = true, skip = false } = {}) {
  if (!webAssembly || skip) return false;
  if (/Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(String(userAgent))) return false;
  const memory = Number(deviceMemory);
  // The spoken model plus WASM is too large for phones and for browsers that
  // do not report enough memory. Those devices keep Listen on the system voice.
  if (!Number.isFinite(memory) || memory < 8) return false;
  return true;
}

export function humanTtsSupported() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (typeof WebAssembly !== "object") return false;
  let skip = false;
  try {
    skip = window.sessionStorage?.getItem(HUMAN_TTS_SKIP_KEY) === "1";
  } catch {
    /* ignore quota / private mode */
  }
  return humanTtsAllowed({
    userAgent: navigator.userAgent,
    deviceMemory: navigator.deviceMemory,
    webAssembly: true,
    skip,
  });
}

let humanTtsFailed = false;

export function markHumanTtsFailed() {
  humanTtsFailed = true;
  try {
    window.sessionStorage?.setItem(HUMAN_TTS_SKIP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function canUseHumanTts() {
  return humanTtsSupported() && !humanTtsFailed;
}

let model = null;
let modelPromise = null;
let audioEl = null;

export function stopHumanAudio() {
  if (!audioEl) return;
  try {
    audioEl.pause();
    audioEl.removeAttribute("src");
    audioEl.load();
  } catch {
    /* some browsers throw if src is empty */
  }
}

export function pauseHumanAudio() {
  try {
    audioEl?.pause();
  } catch {
    /* ignore */
  }
}

export function resumeHumanAudio() {
  try {
    return audioEl?.play?.() || Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

function withTimeout(promise, ms, message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export async function loadHumanTts(onProgress) {
  if (!canUseHumanTts()) {
    throw new Error("This device should use its own voice.");
  }
  if (model) return model;
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    onProgress?.("Preparing a human voice…");
    const { KokoroTTS } = await withTimeout(
      import("kokoro-js"),
      30000,
      "The spoken-English voice could not start."
    );
    model = await withTimeout(
      KokoroTTS.from_pretrained(HUMAN_MODEL_ID, {
        dtype: "q8",
        device: "wasm",
        progress_callback: (info) => {
          const status = info?.status || "";
          const file = String(info?.file || "").split("/").pop() || "voice model";
          const pct =
            Number.isFinite(info?.progress)
              ? Math.round(info.progress)
              : Number.isFinite(info?.loaded) && Number.isFinite(info?.total) && info.total
                ? Math.round((info.loaded / info.total) * 100)
                : null;
          onProgress?.(
            pct != null && status === "progress"
              ? `Preparing a human voice… ${pct}%`
              : status === "done"
                ? "Preparing a human voice…"
                : `Preparing a human voice… ${file}`
          );
        },
      }),
      120000,
      "The spoken-English voice took too long to load."
    );
    return model;
  })().catch((error) => {
    modelPromise = null;
    markHumanTtsFailed();
    throw error;
  });
  return modelPromise;
}

function playBlob(blob, signal) {
  return new Promise((resolve, reject) => {
    stopHumanAudio();
    const url = URL.createObjectURL(blob);
    const el = new Audio(url);
    audioEl = el;
    const finish = (err) => {
      URL.revokeObjectURL(url);
      if (audioEl === el) audioEl = null;
      if (err) reject(err);
      else resolve();
    };
    el.onended = () => finish();
    el.onerror = () => finish(new Error("Could not play this voice."));
    if (signal?.aborted) {
      finish();
      return;
    }
    const onAbort = () => {
      try {
        el.pause();
      } catch {
        /* ignore */
      }
      finish();
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    el.play().catch((error) => finish(error));
  });
}

export async function speakHumanText(chunks, { voice, speed, signal, onProgress, onChunkStart }) {
  const tts = await loadHumanTts(onProgress);
  if (signal?.aborted) return;
  onProgress?.("");
  const id = humanVoiceId(voice);
  const rate = Number(speed) || 1;
  for (let i = 0; i < chunks.length; i += 1) {
    if (signal?.aborted) return;
    onChunkStart?.(i);
    const raw = await tts.generate(chunks[i], { voice: id, speed: rate });
    if (signal?.aborted) return;
    await playBlob(raw.toBlob(), signal);
  }
}
