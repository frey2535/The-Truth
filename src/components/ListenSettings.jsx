import React, { useEffect, useState } from "react";
import { Settings2, X } from "lucide-react";
import useAudibleReader from "@/hooks/useAudibleReader";
import {
  RATE_MAX,
  RATE_MIN,
  RATE_PRESETS,
  previewAudibleVoice,
  ratePresetLabel,
  setAudibleRate,
  setAudibleVoice,
} from "@/lib/audibleReader";

export default function ListenSettings({ dark = false, compact = false, className = "" }) {
  const { supported, rate, voiceURI, voices } = useAudibleReader();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!supported) return null;

  const tone = dark
    ? "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#f3e9c8]/85 hover:underline"
    : compact
      ? "inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm hover:bg-[#f3e9c8]/40"
      : className || "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#7a2e2e] hover:underline";

  return (
    <span className="listen-settings" data-no-listen>
      <button type="button" className={tone} onClick={() => setOpen(true)} title="Choose a voice and reading speed">
        <Settings2 className="w-3.5 h-3.5" />
        Voice & speed
      </button>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-[#120c08]/50 p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-[#e8ddc7] bg-[#faf6ef] p-5 shadow-xl"
            role="dialog"
            aria-labelledby="listen-settings-title"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 id="listen-settings-title" className="font-display text-2xl text-[#2b2620]">
                  Voice and speed
                </h2>
                <p className="text-sm text-[#5b5142] mt-1">
                  Spoken English voices sound like a person and run on this device. The first use may download a
                  voice model onto this device. Scripture is not uploaded.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-[#8a7f6f]" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-sm text-[#2b2620]">
              Voice
              <select
                value={voiceURI}
                onChange={(event) => setAudibleVoice(event.target.value)}
                className="mt-1 w-full h-10 rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
              >
                {["Spoken English — sounds like a person", "This device", "Mechanical system voices"].map((group) => {
                  const rows = voices.filter((voice) => (voice.group || "This device") === group);
                  if (!rows.length) return null;
                  return (
                    <optgroup key={group} label={group}>
                      {rows.map((voice) => (
                        <option key={voice.uri} value={voice.uri}>
                          {voice.name}
                          {voice.lang && !voice.uri.startsWith("human:") ? ` (${voice.lang})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </label>
            <p className="text-sm text-[#2b2620] mt-4 mb-2">Reading speed · {ratePresetLabel(rate)}</p>
            <div className="flex flex-wrap gap-2">
              {RATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAudibleRate(preset.value)}
                  className={`px-3 py-1.5 rounded-full text-xs border ${
                    rate === preset.value
                      ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                      : "bg-white border-[#e8ddc7] text-[#5b5142]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <label className="block text-sm text-[#5b5142] mt-3">
              <span className="sr-only">Custom reading speed</span>
              <input
                type="range"
                min={RATE_MIN}
                max={RATE_MAX}
                step="0.05"
                value={rate}
                onChange={(event) => setAudibleRate(event.target.value)}
                className="w-full mt-1"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={previewAudibleVoice}
                className="px-3 py-1.5 rounded-full border border-[#e8ddc7] bg-white text-sm"
              >
                Hear a sample
              </button>
              <button type="button" onClick={() => setOpen(false)} className="truth-btn-sm h-9 px-4">
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </span>
  );
}
