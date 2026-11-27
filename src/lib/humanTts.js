/** Spoken-English voices that run on this device. Scripture is not uploaded. */

export const HUMAN_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const HUMAN_VOICE_PREFIX = "human:";
export const BUILTIN_VOICE = "builtin";

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

export function humanTtsAllowed({ webAssembly = true, skip = false } = {}) {
  return webAssembly && !skip;
}

export function humanTtsSupported() {
  return typeof window !== "undefined" && typeof window.AudioContext === "function" &&
    humanTtsAllowed({ webAssembly: typeof WebAssembly === "object" });
}

export const canUseHumanTts = humanTtsSupported;

export function canUseBuiltInVoice() {
  return humanTtsSupported() && typeof window.Worker === "function";
}

let model = null;
let modelPromise = null;
let audioContext = null;
let paused = false;

// Called from Play or Resume so the generated audio can start after the voice loads.
export function primeAudioOutput() {
  if (!canUseHumanTts()) return;
  try {
    audioContext ??= new window.AudioContext();
    void audioContext.resume().catch(() => {});
  } catch {
    // Surface startup failure if this engine is needed.
  }
}

async function waitWhilePaused(signal) {
  while (paused && !signal?.aborted) await new Promise(resolve => setTimeout(resolve, 100));
}

export function resetGeneratedPause() {
  paused = false;
}

export function pauseGeneratedAudio() {
  paused = true;
  void audioContext?.suspend().catch(() => {});
}

export async function resumeGeneratedAudio() {
  if (!audioContext) throw new Error("Audio could not start.");
  paused = false;
  await withTimeout(audioContext.resume(), 2000, "Audio did not resume.");
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
    throw error;
  });
  return modelPromise;
}

async function playBuffer(buffer, signal, onPlaying) {
  const context = audioContext;
  if (!context) throw new Error("Audio could not start.");
  if (context.state !== "running") {
    try {
      await withTimeout(context.resume(), 2000, "Audio did not start.");
    } catch {
      throw new DOMException("Tap Resume to enable audio.", "NotAllowedError");
    }
  }
  await waitWhilePaused(signal);
  if (signal?.aborted) return;
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);

  await new Promise((resolve, reject) => {
    const finish = () => {
      source.onended = null;
      signal?.removeEventListener("abort", abort);
      source.disconnect();
      resolve();
    };
    const abort = () => {
      source.stop();
      finish();
    };
    source.onended = finish;
    signal?.addEventListener("abort", abort, { once: true });
    try {
      source.start();
      onPlaying?.();
    } catch (error) {
      reject(error);
      finish();
    }
  });
}

let localWorker;

function renderBuiltInAudio(text, rate, signal) {
  localWorker ??= new Worker(new URL("./flite.worker.js", import.meta.url), { type: "module" });
  const worker = localWorker;
  const { port1, port2 } = new MessageChannel();
  return new Promise((resolve, reject) => {
    function finish() {
      clearTimeout(timer);
      port1.close();
      worker.removeEventListener("error", fail);
      signal?.removeEventListener("abort", abort);
    }
    function fail() {
      finish();
      worker.terminate();
      if (localWorker === worker) localWorker = null;
      reject(new Error("The built-in voice could not generate audio."));
    }
    function abort() {
      finish();
      resolve(null);
    }
    const timer = setTimeout(fail, 30000);
    signal?.addEventListener("abort", abort, { once: true });
    worker.addEventListener("error", fail, { once: true });
    port1.onmessage = ({ data }) => {
      if (data.error) {
        fail();
      } else {
        finish();
        resolve(data.wave);
      }
    };
    try {
      worker.postMessage({ text, rate }, [port2]);
    } catch {
      fail();
    }
  });
}

export async function speakGeneratedText(chunks, { voice, speed, signal, onProgress, onChunkStart, onPlaying }) {
  if (!audioContext) throw new Error("Audio could not start.");
  const builtIn = voice === BUILTIN_VOICE;
  const tts = builtIn ? null : await loadHumanTts(onProgress);
  if (signal?.aborted) return;
  const id = humanVoiceId(voice);
  const rate = Number(speed) || 1;
  for (let i = 0; i < chunks.length; i += 1) {
    if (signal?.aborted) return;
    await waitWhilePaused(signal);
    if (signal?.aborted) return;
    onChunkStart?.(i);
    let buffer;
    if (builtIn) {
      const wave = await renderBuiltInAudio(chunks[i], rate, signal);
      if (signal?.aborted) return;
      buffer = await audioContext.decodeAudioData(wave.buffer);
    } else {
      const raw = await withTimeout(tts.generate(chunks[i], { voice: id, speed: rate }), 90000, "Narration generation timed out.");
      if (signal?.aborted) return;
      buffer = audioContext.createBuffer(1, raw.audio.length, raw.sampling_rate);
      buffer.getChannelData(0).set(raw.audio);
    }
    await playBuffer(buffer, signal, () => onPlaying?.(i));
  }
}
