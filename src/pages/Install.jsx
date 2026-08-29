import React, { useEffect, useState } from "react";
import { Download, Share2, Copy, Check, Smartphone, Wifi, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isStandaloneDisplay, requestInstallPrompt } from "@/lib/pwa";

export default function Install() {
  const [copied, setCopied] = useState(false);
  const [lanUrls, setLanUrls] = useState([]);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const standalone = isStandaloneDisplay();

  useEffect(() => {
    let cancelled = false;
    fetch("/__lan.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.addresses?.length) return;
        const port = data.port || window.location.port;
        const proto = window.location.protocol;
        setLanUrls(
          data.addresses.map((ip) => `${proto}//${ip}${port ? `:${port}` : ""}`)
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const shareUrl = lanUrls[0] || origin;

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      copy(shareUrl);
      return;
    }
    try {
      await navigator.share({
        title: "The Truth",
        text: "Install The Truth on your phone — Read, Investigate, Learn.",
        url: shareUrl,
      });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] tracking-[0.25em] uppercase text-[#b08d3c] mb-2">Share</p>
      <h1 className="font-display text-4xl text-[#2b2620] mb-3">Install on a phone</h1>
      <p className="text-[#5b5142] leading-relaxed mb-8">
        The Truth installs as a home-screen app. Android uses Install app; iPhone uses Safari’s Add to
        Home Screen. No App Store account is required.
      </p>

      {standalone ? (
        <div className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-6 text-sm text-[#5b5142]">
          This copy is already running as an installed app on this device.
        </div>
      ) : (
        <Button
          onClick={requestInstallPrompt}
          className="w-full sm:w-auto h-12 px-6 mb-8 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
        >
          <Download className="w-4 h-4 mr-2" />
          Install on this device
        </Button>
      )}

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-2">
          <Smartphone className="w-5 h-5 text-[#b08d3c]" /> On this phone
        </h2>
        <ol className="list-decimal list-inside text-sm text-[#5b5142] space-y-1.5 leading-relaxed">
          <li>Open this site in Safari (iPhone) or Chrome (Android).</li>
          <li>Tap Install on this device, or use the browser’s Add to Home Screen.</li>
          <li>Launch The Truth from the home screen like any other app.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5 mb-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-2">
          <Wifi className="w-5 h-5 text-[#b08d3c]" /> Send it to another phone
        </h2>
        <p className="text-sm text-[#5b5142] leading-relaxed mb-4">
          Phones on the same Wi‑Fi should open the LAN address, not 127.0.0.1. After the page loads,
          they install from their browser.
        </p>
        <div className="space-y-2 mb-4">
          {(lanUrls.length ? lanUrls : [origin]).map((url) => (
            <code
              key={url}
              className="block text-sm bg-[#f3e9c8]/50 rounded-lg px-3 py-2 text-[#2b2620] break-all"
            >
              {url}
            </code>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={nativeShare}
            className="h-11 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share link
          </Button>
          <Button
            variant="outline"
            className="h-11 border-[#e8ddc7] text-[#5b5142]"
            onClick={() => copy(shareUrl)}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e8ddc7] bg-white/70 p-5">
        <h2 className="font-display text-xl text-[#2b2620] flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-[#b08d3c]" /> Share beyond this Wi‑Fi
        </h2>
        <p className="text-sm text-[#5b5142] leading-relaxed mb-3">
          Build the app and host the <code className="text-[#2b2620]">dist/</code> folder on any HTTPS
          site (Cloudflare Pages, Netlify, or your own server). People open that URL once, then add it
          to the home screen. Phones will not install a service worker over plain HTTP except on
          localhost.
        </p>
        <p className="text-sm text-[#5b5142] leading-relaxed">
          Search is free. Research, Investigate, Word Study, and the Assistant quote the texts in
          this app. No OpenAI key or subscription is required.
        </p>
      </section>
    </div>
  );
}
