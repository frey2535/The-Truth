import React, { useState } from "react";
import { Download, Share2, Copy, Check, Smartphone, Globe, Monitor, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { facebookShareUrl, SHARE_INSTALL_URL } from "@/lib/appOrigin";
import { getInstallPlatform, isStandaloneDisplay, promptAppInstall, requestInstallPrompt } from "@/lib/pwa";

export default function Install() {
  const [copied, setCopied] = useState(false);
  const standalone = isStandaloneDisplay();
  const platform = getInstallPlatform();
  const installUrl = SHARE_INSTALL_URL;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(installUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "The Truth",
          text: "Tap to open The Truth, then install it on your phone.",
          url: installUrl,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    await copyLink();
  }

  async function installHere() {
    const result = await promptAppInstall();
    if (result.outcome === "accepted") return;
    requestInstallPrompt();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] tracking-[0.25em] uppercase text-[#b08d3c] mb-2">Share</p>
      <h1 className="font-display text-4xl text-[#2b2620] mb-3">Install this app</h1>
      <p className="text-[#5b5142] leading-relaxed mb-6">
        Post the link below on Facebook. Friends see the app icon, tap it, and The Truth opens —
        then it asks them to install on their phone. There is no store download. If Facebook’s
        own browser opens the page, they tap <strong>Open in Safari</strong> or{" "}
        <strong>Open in Chrome</strong> first.
      </p>

      <div className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-5 mb-6">
        <p className="text-xs uppercase tracking-wide text-[#8a7f6f] mb-2">Post this address</p>
        <a
          href={installUrl}
          className="block font-medium text-[#7a2e2e] break-all underline mb-4"
        >
          {installUrl}
        </a>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => window.open(facebookShareUrl(installUrl), "_blank", "noopener,noreferrer")}
            className="h-11 bg-[#1877F2] hover:bg-[#166fe5] text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Post on Facebook
          </Button>
          <Button onClick={copyLink} className="h-11 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Link copied" : "Copy install link"}
          </Button>
          <Button
            onClick={shareLink}
            className="h-11 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Send to a friend
          </Button>
        </div>
      </div>

      {standalone ? (
        <div className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-6 text-sm text-[#5b5142]">
          This copy is already running as an installed app on this device.
        </div>
      ) : (
        <Button
          onClick={installHere}
          className="w-full sm:w-auto h-12 px-6 mb-8 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
        >
          <Download className="w-4 h-4 mr-2" />
          Install on this device
        </Button>
      )}

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-[#b08d3c]" /> On the phone
        </h2>
        {platform.isIOS ? (
          <ol className="space-y-3 text-sm text-[#5b5142]">
            <li className="flex items-start gap-3">
              <Share className="w-4 h-4 mt-0.5 text-[#7a2e2e]" />
              <span>In <strong className="text-[#2b2620]">Safari</strong>, tap Share.</span>
            </li>
            <li className="flex items-start gap-3">
              <PlusSquare className="w-4 h-4 mt-0.5 text-[#7a2e2e]" />
              <span>
                Tap <strong className="text-[#2b2620]">Add to Home Screen</strong>, then Add.
              </span>
            </li>
          </ol>
        ) : (
          <ol className="list-decimal list-inside text-sm text-[#5b5142] space-y-1.5 leading-relaxed">
            <li>Open the link in Chrome — not inside a text-message preview.</li>
            <li>Tap the menu, then <strong className="text-[#2b2620]">Install app</strong>.</li>
          </ol>
        )}
      </section>

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-3">
          <Monitor className="w-5 h-5 text-[#b08d3c]" /> On a computer
        </h2>
        <ol className="list-decimal list-inside text-sm text-[#5b5142] space-y-1.5 leading-relaxed">
          <li>Open this site in Chrome or Edge.</li>
          <li>
            Open the browser menu and choose <strong className="text-[#2b2620]">Install The Truth</strong> or{" "}
            <strong className="text-[#2b2620]">Install app</strong>.
          </li>
          <li>It opens in its own window, like other desktop apps, and stays a website in the browser too.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-[#b08d3c]" /> Why a Wi‑Fi link will not stay updated
        </h2>
        <p className="text-sm text-[#5b5142] leading-relaxed">
          A home-screen icon made from this computer’s address only works while this computer is on.
          Use the public address above. That is the copy that can receive new builds.
        </p>
      </section>
    </div>
  );
}
