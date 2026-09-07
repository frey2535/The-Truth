import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Share, PlusSquare, MoreVertical, X, ExternalLink, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLISHED_APP_URL } from "@/lib/appOrigin";
import { publicUrl } from "@/lib/publicUrl";
import { isLegalPath } from "@/lib/playStore";
import { isAuthPath } from "@/lib/shareInstall";
import {
  arrivedFromShare,
  chromeIntentUrl,
  getDeferredInstall,
  getInstallPlatform,
  isInAppBrowser,
  isStandaloneDisplay,
  onDeferredInstallChange,
  promptAppInstall,
} from "@/lib/pwa";

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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const windowPath = typeof window !== "undefined" ? window.location.pathname : pathname;
  const [open, setOpen] = useState(false);
  const [canPrompt, setCanPrompt] = useState(() => Boolean(getDeferredInstall()));
  const [installing, setInstalling] = useState(false);
  const [help, setHelp] = useState("");
  const platform = getInstallPlatform();
  const inApp = isInAppBrowser();
  const fromShare = arrivedFromShare();
  const onAuth =
    isAuthPath(pathname) ||
    isAuthPath(windowPath) ||
    isLegalPath(pathname) ||
    isLegalPath(windowPath);

  useEffect(() => {
    return onDeferredInstallChange((event) => setCanPrompt(Boolean(event)));
  }, []);

  useEffect(() => {
    if (isStandaloneDisplay() || onAuth) {
      setOpen(false);
      return undefined;
    }

    const shouldForce = fromShare || inApp;
    const onForceShow = () => {
      if (!isAuthPath(window.location.pathname) && !isLegalPath(window.location.pathname)) {
        setOpen(true);
      }
    };
    window.addEventListener("truth-show-install", onForceShow);

    const timer = window.setTimeout(() => {
      if (
        isStandaloneDisplay() ||
        isAuthPath(window.location.pathname) ||
        isLegalPath(window.location.pathname)
      ) {
        return;
      }
      if (shouldForce || (platform.isMobile && !wasDismissedRecently())) {
        setOpen(true);
      }
    }, shouldForce ? 200 : 1200);

    return () => {
      window.removeEventListener("truth-show-install", onForceShow);
      window.clearTimeout(timer);
    };
  }, [fromShare, inApp, onAuth, platform.isMobile]);

  const close = () => {
    dismiss();
    setOpen(false);
  };

  const install = async () => {
    setInstalling(true);
    setHelp("");
    try {
      const result = await promptAppInstall();
      if (result.outcome === "accepted") {
        close();
        return;
      }
      if (result.outcome === "unavailable") {
        close();
        navigate("/install");
        return;
      }
      setHelp("The browser closed the install dialog. Tap Install app again, or use the browser menu.");
    } catch {
      close();
      navigate("/install");
    } finally {
      setInstalling(false);
    }
  };

  const openInChrome = () => {
    window.location.href = chromeIntentUrl(window.location.href);
  };

  const closeForLogin = () => {
    dismiss();
    setOpen(false);
  };

  if (!open || onAuth || isStandaloneDisplay()) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6 pointer-events-none">
      <div
        className="absolute inset-0 z-0 bg-[#2b2620]/50 backdrop-blur-[2px] pointer-events-auto"
        aria-hidden="true"
        onClick={close}
      />
      <div
        role="dialog"
        aria-labelledby="install-app-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-[#faf6ef] border border-[#e8ddc7] shadow-2xl overflow-hidden pointer-events-auto"
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
            <img
              src={publicUrl("/icon-192.png?v=6")}
              alt=""
              width="48"
              height="48"
              className="w-12 h-12 rounded-2xl object-cover shadow-[0_0_20px_rgba(232,201,122,0.35)]"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#b08d3c]">
                {inApp ? "Open, then install" : "Install this app"}
              </p>
              <h2 id="install-app-title" className="font-display text-xl leading-tight">
                The Truth
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#f3e9c8]/80 mt-3 leading-relaxed">
            {inApp
              ? "Facebook opened this inside its own browser. Install only works in Chrome or Safari."
              : "Add The Truth to your home screen. It opens like an app. Google Play uses this same public site."}
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {inApp ? (
            <>
              {platform.isAndroid ? (
                <Button
                  type="button"
                  onClick={openInChrome}
                  className="w-full h-12 text-sm font-medium gap-2 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Chrome to install
                </Button>
              ) : null}
              <ol className="space-y-3 text-sm text-[#5b5142]">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-[#7a2e2e]" />
                  </span>
                  <span>
                    Tap the <strong className="text-[#2b2620]">⋯</strong> menu in{" "}
                    {platform.isIOS ? "Facebook" : "this browser"}.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-4 h-4 text-[#7a2e2e]" />
                  </span>
                  <span>
                    Choose{" "}
                    <strong className="text-[#2b2620]">
                      {platform.isIOS ? "Open in Safari" : "Open in Chrome"}
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#f3e9c8]/70 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-[#7a2e2e]" />
                  </span>
                  <span>
                    Then tap <strong className="text-[#2b2620]">Install</strong> or{" "}
                    <strong className="text-[#2b2620]">Add to Home Screen</strong>.
                  </span>
                </li>
              </ol>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={install}
                disabled={installing}
                className="w-full h-12 text-sm font-medium gap-2 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
              >
                <Download className="w-4 h-4" />
                {installing ? "Installing…" : canPrompt ? "Install app" : "Install on this device"}
              </Button>
              {help ? <p className="text-sm text-[#7a2e2e] leading-relaxed">{help}</p> : null}
              {platform.isIOS ? (
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
                </ol>
              ) : canPrompt ? null : (
                <p className="text-sm text-[#5b5142] leading-relaxed">
                  If the browser does not offer Install, open the menu (⋮) and choose{" "}
                  <strong className="text-[#2b2620]">Install app</strong> or{" "}
                  <strong className="text-[#2b2620]">Add to Home screen</strong>.
                </p>
              )}
            </>
          )}

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-md text-sm font-medium border border-[#e8ddc7] bg-white text-[#2b2620] hover:bg-[#f3e9c8]/60"
            onClick={closeForLogin}
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </Link>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 border-[#e8ddc7] text-[#5b5142]"
              onClick={close}
            >
              Not now
            </Button>
          </div>
          <p className="text-[11px] text-[#8a7f6f] break-all text-center">{PUBLISHED_APP_URL}</p>
        </div>
      </div>
    </div>
  );
}
