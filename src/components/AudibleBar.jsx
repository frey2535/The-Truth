import React from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import useAudibleReader from "@/hooks/useAudibleReader";
import ListenSettings from "@/components/ListenSettings";
import { pauseAudible, resumeAudible, stopAudible } from "@/lib/audibleReader";

export default function AudibleBar() {
  const { status, title, supported } = useAudibleReader();
  if (!supported || status === "idle") return null;
  return (
    <div
      className="listen-now fixed inset-x-0 z-[85] border-t border-[#e8ddc7] bg-[#faf6ef]/95 backdrop-blur-md px-4 py-2 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-0"
      data-no-listen
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-sm text-[#2b2620]">
        <p className="min-w-0 truncate inline-flex items-center gap-2">
          <Volume2 className="w-4 h-4 shrink-0 text-[#7a2e2e]" />
          <span className="truncate">{status === "paused" ? "Paused" : "Listening"}: {title}</span>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <ListenSettings compact />
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#e8ddc7] bg-white"
            onClick={status === "speaking" ? pauseAudible : resumeAudible}
          >
            {status === "speaking" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {status === "speaking" ? "Pause" : "Resume"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#e8ddc7] bg-white"
            onClick={stopAudible}
          >
            <Square className="w-3.5 h-3.5" />
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
