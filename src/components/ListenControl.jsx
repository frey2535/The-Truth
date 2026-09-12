import React from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import useAudibleReader from "@/hooks/useAudibleReader";
import { pauseAudible, resumeAudible, stopAudible, toggleAudible } from "@/lib/audibleReader";

export default function ListenControl({
  text,
  id,
  title,
  label = "Listen",
  variant = "page",
  className = "",
}) {
  const { status, id: activeId, supported } = useAudibleReader();
  if (!supported) return null;
  const key = String(id || title || label);
  const mine = activeId === key && status !== "idle";
  const speaking = mine && status === "speaking";
  const paused = mine && status === "paused";

  function onPlay() {
    if (speaking) pauseAudible();
    else if (paused) resumeAudible();
    else toggleAudible(typeof text === "function" ? text() : text, { id: key, title: title || label });
  }

  if (variant === "icon") {
    return (
      <span className={`listen-control inline-flex items-center ${className}`} data-no-listen>
        <button
          type="button"
          className="p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#2b2620]"
          title={speaking ? `Pause ${label.toLowerCase()}` : paused ? `Resume ${label.toLowerCase()}` : `Listen to this ${label.toLowerCase()}`}
          onClick={onPlay}
        >
          {speaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        {mine ? (
          <button
            type="button"
            className="p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#7a2e2e]"
            title="Stop listening"
            onClick={stopAudible}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </span>
    );
  }

  const tone =
    variant === "verse"
      ? "verse-tool"
      : variant === "chapter"
        ? "inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm hover:bg-[#f3e9c8]/40"
        : className || "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide";

  return (
    <span className={`listen-control inline-flex items-center gap-2 ${variant === "page" ? "" : ""}`} data-no-listen>
      <button type="button" onClick={onPlay} className={tone} title="Listen to this text on this device">
        {speaking ? <Pause className="w-3.5 h-3.5" /> : paused ? <Play className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        {speaking ? "Pause" : paused ? "Resume" : label}
      </button>
      {mine && variant !== "page" ? (
        <button type="button" onClick={stopAudible} className={tone} title="Stop listening">
          <Square className="w-3.5 h-3.5" />
          Stop
        </button>
      ) : null}
    </span>
  );
}
