import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PUBLISHED_APP_URL } from "@/lib/appOrigin";
import { applyAppUpdate, getInstallKind } from "@/lib/pwa";

export default function AppUpdateBanner() {
  const [kind, setKind] = useState({ standalone: false, local: false, published: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setKind(getInstallKind());
  }, []);

  if (!kind.standalone) return null;

  if (kind.local && !kind.published) {
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

  return (
    <div className="bg-[#2b2620] text-[#f3e9c8] text-sm px-4 py-2 flex items-center justify-center gap-3">
      <span>Installed copies check for a new build when you open the app.</span>
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
