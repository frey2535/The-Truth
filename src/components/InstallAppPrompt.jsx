import React, { useEffect, useState } from "react";
import { Download, Share, PlusSquare, MoreVertical, X, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInstallPlatform, isStandaloneDisplay } from "@/lib/pwa";

const DISMISS_KEY = "the_truth_install_dismissed_at";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

function wasDismissedRecently() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_MS;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore quota */
  }
}

export default function InstallAppPrompt() {
  const [open, setOpen] = useState(false);
  const [deferred, setDeferred] = useState(null);
  const [installing, setInstalling] = useState(false);
  const platform = getInstallPlatform();

  useEffect(() => {
    if (isStandaloneDisplay()) return undefined;

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
      if (!wasDismissedRecently()) setOpen(true);
    };
    const onForceShow = () => setOpen(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("truth-show-install", onForceShow);

    const timer = window.setTimeout(() => {
      if (!isStandaloneDisplay() && platform.isMobile && !wasDismissedRecently()) {
        setOpen(true);
      }
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("truth-show-install", onForceShow);
      window.clearTimeout(timer);
    };
  }, [platform.isMobile]);

  const close = () => {
    dismiss();
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    setInstalling(true);
    try {
      deferred.prompt();
      const result = await deferred.userChoice;
      if (result?.outcome === "accepted") close();
      else setOpen(false);
    } catch {
      setOpen(false);
    } finally {
      setInstalling(false);
      setDeferred(null);
    }
  };

  if (!open || isStandaloneDisplay()) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#2b2620]/50 backdrop-blur-[2px]"
        aria-label="Dismiss install prompt"
        onClick={close}
      />
      <div
        role="dialog"
        aria-labelledby="install-app-title"
        className="relative w-full max-w-md rounded-2xl bg-[#faf6ef] border border-[#e8ddc7] shadow-2xl overflow-hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="bg-[#2b2620] px-5 pt-5 pb-4 text-[#f3e9c8]">
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-[#f3e9c8]/10 border border-[#f3e9c8]/20 flex items-center justify-center">
              <ScrollText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#b08d3c]">
                Install on this device
              </p>
              <h2 id="install-app-title" className="font-display text-xl leading-tight">
                Add The Truth
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#f3e9c8]/80 mt-3 leading-relaxed">
            Put it on your home screen. It opens like an app — no browser chrome — and the library stays
            available when you are offline.
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {deferred ? (
            <Button
              onClick={install}
              disabled={installing}
              className="w-full h-12 text-sm font-medium gap-2 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
            >
              <Download className="w-4 h-4" />
              {installing ? "Installing…" : "Install app"}
            </Button>
          ) : platform.isIOS ? (
            <ol className="space-y-3 text-sm text-[#5b5142]">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                  <Share className="w-4 h-4 text-[#7a2e2e]" />
                </span>
                <span>
                  <strong className="text-[#2b2620]">Tap Share</strong> at the bottom of Safari.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                  <PlusSquare className="w-4 h-4 text-[#7a2e2e]" />
                </span>
                <span>
                  Scroll and tap <strong className="text-[#2b2620]">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#7a2e2e]">
                  3
                </span>
                <span>
                  Tap <strong className="text-[#2b2620]">Add</strong>. The Truth appears like a native app.
                </span>
              </li>
            </ol>
          ) : (
            <ol className="space-y-3 text-sm text-[#5b5142]">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                  <MoreVertical className="w-4 h-4 text-[#7a2e2e]" />
                </span>
                <span>Open the browser menu (⋮ or Share).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 text-[#7a2e2e]" />
                </span>
                <span>
                  Tap <strong className="text-[#2b2620]">Install app</strong> or{" "}
                  <strong className="text-[#2b2620]">Add to Home screen</strong>.
                </span>
              </li>
            </ol>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-11 border-[#e8ddc7] text-[#5b5142]"
              onClick={close}
            >
              Not now
            </Button>
            {deferred ? null : (
              <Button
                className="flex-1 h-11 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
                onClick={close}
              >
                Got it
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
