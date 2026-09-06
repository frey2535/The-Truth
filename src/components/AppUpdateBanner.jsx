import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PUBLISHED_APP_URL } from "@/lib/appOrigin";
import { applyAppUpdate, checkPublishedBuild, getInstallKind } from "@/lib/pwa";

function forceUpdatePrompt() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("update_now") === "1";
}

export default function AppUpdateBanner() {
  const [kind, setKind] = useState({ standalone: false, local: false, published: false });
  const [available, setAvailable] = useState(forceUpdatePrompt);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setKind(getInstallKind());
    if (forceUpdatePrompt()) {
      setAvailable(true);
      return undefined;
    }
    let cancelled = false;
    const check = async () => {
      const result = await checkPublishedBuild();
      if (!cancelled && result.stale) setAvailable(true);
    };
    check();
    const timer = window.setInterval(check, 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (kind.standalone && kind.local && !kind.published) {
    return (
      <div className="bg-[#7a2e2e] text-[#f3e9c8] text-sm px-4 py-2.5 text-center">
        This home-screen copy is tied to this computer. Published updates will not reach it.
        Delete the icon, then install from{" "}
        <a className="underline font-medium" href={PUBLISHED_APP_URL}>
          {PUBLISHED_APP_URL.replace("https://", "")}
        </a>
        .
      </div>
    );
  }

  if (!available) return null;

  return (
    <div className="bg-[#2b2620] text-[#f3e9c8] text-sm px-4 py-2 flex items-center justify-center gap-3">
      <span>A new version of The Truth is ready.</span>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await applyAppUpdate();
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e9c8] text-[#2b2620] px-3 py-1 text-xs font-medium"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        {busy ? "Updating…" : "Update now"}
      </button>
    </div>
  );
}
