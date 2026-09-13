/** Spoken-English voices that run on this device. Scripture is not uploaded. */

export const HUMAN_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const HUMAN_VOICE_PREFIX = "human:";

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

let model = null;
let modelPromise = null;
let audioEl = null;

export function stopHumanAudio() {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl.load();
}

export function pauseHumanAudio() {
  audioEl?.pause();
}

export function resumeHumanAudio() {
  return audioEl?.play?.() || Promise.resolve();
}

export async function loadHumanTts(onProgress) {
  if (model) return model;
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    const { KokoroTTS } = await import("kokoro-js");
    model = await KokoroTTS.from_pretrained(HUMAN_MODEL_ID, {
      dtype: "q8",
      device: "wasm",
      progress_callback: (info) => {
        const status = info?.status || "";
        const file = String(info?.file || "").split("/").pop() || "voice model";
        const pct =
          Number.isFinite(info?.progress) ? Math.round(info.progress) : Number.isFinite(info?.loaded) && Number.isFinite(info?.total) && info.total
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
    });
    return model;
  })().catch((error) => {
    modelPromise = null;
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
      el.pause();
      finish();
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    el.play().catch((error) => finish(error));
  });
}

export async function speakHumanText(chunks, { voice, speed, signal, onProgress }) {
  const tts = await loadHumanTts(onProgress);
  if (signal?.aborted) return;
  onProgress?.("");
  const id = humanVoiceId(voice);
  const rate = Number(speed) || 1;
  for (const chunk of chunks) {
    if (signal?.aborted) return;
    const raw = await tts.generate(chunk, { voice: id, speed: rate });
    if (signal?.aborted) return;
    await playBlob(raw.toBlob(), signal);
  }
}
