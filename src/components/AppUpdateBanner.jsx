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

  if (!available && !(kind.standalone && kind.local && !kind.published)) return null;

  return (
    <>
      {kind.standalone && kind.local && !kind.published && (
        <div className="bg-[#7a2e2e] text-[#f3e9c8] text-sm px-4 py-2.5 text-center">
          This home-screen copy is tied to this computer. Published updates will not reach it.
          Delete the icon, then install from{" "}
          <a className="underline font-medium" href={PUBLISHED_APP_URL}>
            {PUBLISHED_APP_URL.replace("https://", "")}
          </a>
          .
        </div>
      )}
      {available && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="truth-update-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#f3e9c8] p-5 text-[#2b2620] shadow-2xl">
            <h2 id="truth-update-title" className="text-lg font-bold">
              Update available
            </h2>
            <p className="mt-2 text-sm">
              A newer version of The Truth is ready. Update now to get the latest changes.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await applyAppUpdate();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2b2620] px-4 py-2 text-sm font-semibold text-[#f3e9c8] disabled:opacity-60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {busy ? "Updating…" : "Update now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
