import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import HeavenBackdrop from "@/components/HeavenBackdrop";
import { useOwner } from "@/lib/OwnerContext";
import { Download, Loader2, Smartphone } from "lucide-react";

function platformLabel(platform) {
  if (platform === "ios") return "iPhone / iPad";
  if (platform === "android") return "Android";
  return "Computer";
}

function sourceLabel(source) {
  if (source === "appinstalled") return "Browser install";
  if (source === "prompt") return "Install prompt";
  return "Opened as installed app";
}

function formatWhen(iso) {
  if (!iso) return "Unknown time";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OwnerDownloads() {
  const { isOwner, owner, logout } = useOwner();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOwner) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const data = await base44.owner.downloads();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load downloads");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOwner]);

  if (!isOwner) return <Navigate to="/owner" replace />;

  return (
    <div className="min-h-screen truth-app truth-app--auth relative px-4 py-8">
      <HeavenBackdrop />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e8c97a]">Platform owner</p>
            <h1 className="font-display text-4xl text-[#f3e9c8]">Downloads</h1>
            <p className="text-sm text-[#f3e9c8]/80 mt-1">{owner.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-10 bg-white/90">
              <Link to="/install">Install page</Link>
            </Button>
            <Button type="button" className="h-10 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6 mb-5">
          {loading ? (
            <p className="flex items-center gap-2 text-[#5b5142]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading downloads…
            </p>
          ) : error ? (
            <p className="text-[#7a2e2e]">{error}</p>
          ) : (
            <>
              <div className="flex items-end gap-3 mb-6">
                <Download className="w-8 h-8 text-[#7a2e2e]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a7f6f]">Devices that installed</p>
                  <p className="font-display text-5xl text-[#2b2620] leading-none">{stats.total}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {["ios", "android", "desktop"].map((platform) => (
                  <div key={platform} className="rounded-xl bg-white/70 border border-[#e8ddc7] py-3">
                    <p className="text-2xl font-display text-[#2b2620]">{stats.byPlatform?.[platform] || 0}</p>
                    <p className="text-[11px] text-[#8a7f6f]">{platformLabel(platform)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6">
          <h2 className="font-display text-xl text-[#2b2620] mb-4">Every download</h2>
          {!loading && !error && stats?.downloads?.length === 0 ? (
            <p className="text-sm text-[#5b5142]">
              No installs recorded yet. When someone adds The Truth to their home screen, it appears here.
            </p>
          ) : null}
          <ul className="space-y-3">
            {(stats?.downloads || []).map((row) => (
              <li
                key={`${row.device}-${row.at}`}
                className="flex items-start gap-3 rounded-xl border border-[#e8ddc7] bg-white/70 p-3"
              >
                <span className="w-9 h-9 rounded-lg bg-[#f3e9c8] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 text-[#7a2e2e]" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-[#2b2620]">{platformLabel(row.platform)}</span>
                  <span className="block text-xs text-[#5b5142]">{sourceLabel(row.source)}</span>
                  <span className="block text-xs text-[#8a7f6f] mt-1">{formatWhen(row.at)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
