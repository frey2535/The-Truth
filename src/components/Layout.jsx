import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useOwner } from "@/lib/OwnerContext";
import { publicUrl } from "@/lib/publicUrl";
import { GUEST_EMAIL } from "@/api/localAuth";
import HeavenBackdrop from "@/components/HeavenBackdrop";
import PapyrusBackdrop from "@/components/PapyrusBackdrop";
import { CUSTOMS_NAV_LABEL } from "@/data/inheritedCustoms";
import AppUpdateBanner from "@/components/AppUpdateBanner";
import AudibleBar from "@/components/AudibleBar";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import PageTools from "@/components/PageTools";
import { stopAudible } from "@/lib/audibleReader";
import { isEvidencePath } from "@/components/evidence/EvidenceSectionNav";
import { isStandaloneDisplay } from "@/lib/pwa";
import {
  BookOpenText,
  Sparkles,
  Landmark,
  Search,
  Moon,
  Download,
  Map as MapIcon,
  CalendarDays,
  BookMarked,
  Globe,
} from "lucide-react";

const PRIMARY = [
  { to: "/library", label: "Read", icon: BookOpenText },
  { to: "/search", label: "Search", icon: Search },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/customs", label: CUSTOMS_NAV_LABEL, shortLabel: "Traditions", icon: Moon },
  { to: "/prophecy", label: "Prophecy", icon: Globe },
  { to: "/evidence", label: "Evidence", icon: Landmark, matchEvidence: true },
  { to: "/notebook", label: "Notebook", icon: BookMarked },
];

const MOBILE_NAV = [
  { to: "/library", label: "Read", icon: BookOpenText },
  { to: "/search", label: "Search", icon: Search },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/notebook", label: "Notebook", icon: BookMarked },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/evidence", label: "Evidence", icon: Landmark, matchEvidence: true },
  { to: "/assistant", label: "Ask", icon: Sparkles },
];

function navActive(pathname, to, matchEvidence) {
  return matchEvidence ? isEvidencePath(pathname) : pathname.startsWith(to);
}

export default function Layout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { isOwner } = useOwner();
  const isGuest = !user || user.email === GUEST_EMAIL || user.is_guest;
  const isHome = pathname === "/";
  const usePapyrus = !isHome;
  const standalone = isStandaloneDisplay();

  useEffect(() => {
    document.documentElement.classList.toggle("truth-standalone", standalone);
    return () => document.documentElement.classList.remove("truth-standalone");
  }, [standalone]);

  useEffect(() => {
    stopAudible();
  }, [pathname]);

  return (
    <div className={`min-h-dvh truth-app text-[#2b2620] flex flex-col${usePapyrus ? " truth-app--read" : ""}`}>
      {usePapyrus ? <PapyrusBackdrop /> : <HeavenBackdrop />}
      <AppUpdateBanner />
      <header
        className={`truth-header sticky top-0 z-[90] border-b pt-[env(safe-area-inset-top)] ${
          usePapyrus
            ? "border-[#c9b27c]/50 bg-[#efe0b8]"
            : "border-[#e8c97a]/25 bg-[#120c08]"
        }`}
      >
        <div className="truth-header-bar">
          <Link to="/" className="truth-header-brand group">
            <img
              src={publicUrl("/icon-192.png?v=6")}
              alt=""
              width="36"
              height="36"
              className="shrink-0 rounded-full object-cover shadow-[0_0_24px_rgba(243,221,150,0.45)]"
            />
            <span className="truth-header-brand-text">
              <span className={`truth-header-title font-display tracking-wide ${usePapyrus ? "text-[#2b2620]" : "text-[#f3e9c8]"}`}>
                The Truth
              </span>
              <span className={`truth-header-tag ${usePapyrus ? "text-[#7a2e2e]" : "text-[#e8c97a]"}`}>
                Read · Investigate · Learn
              </span>
            </span>
          </Link>
          <nav className="truth-header-nav" aria-label="Primary">
            {PRIMARY.map(({ to, label, shortLabel, icon: Icon, matchEvidence }) => {
              const active = navActive(pathname, to, matchEvidence);
              return (
                <Link
                  key={to}
                  to={to}
                  title={label}
                  className={`truth-header-link ${
                    active
                      ? "bg-[#f3e9c8] text-[#2b2620]"
                      : usePapyrus
                        ? "text-[#3a3328] hover:bg-[#2b2620]/8"
                        : "text-[#f3e9c8]/85 hover:bg-white/10"
                  }`}
                >
                  <Icon />
                  <span className="truth-header-label">{shortLabel || label}</span>
                </Link>
              );
            })}
            <Link
              to="/assistant"
              title="Truth Assistant"
              className={`truth-header-ask font-medium ${
                pathname.startsWith("/assistant")
                  ? "bg-[#5e2222] text-[#f3e9c8]"
                  : "bg-[#7a2e2e] text-[#f3e9c8] hover:bg-[#5e2222]"
              }`}
            >
              <Sparkles />
              <span className="truth-header-label">Ask</span>
            </Link>
            {isOwner ? (
              <>
                <Link
                  to="/owner/downloads"
                  title="Downloads"
                  className={`truth-header-link ${
                    usePapyrus ? "text-[#3a3328] hover:bg-[#2b2620]/8" : "text-[#e8c97a] hover:bg-white/10"
                  }`}
                >
                  <Download />
                  <span className="truth-header-label">Downloads</span>
                </Link>
                <Link
                  to="/owner/cursor"
                  title="Cursor"
                  className={`truth-header-link ${
                    pathname.startsWith("/owner/cursor")
                      ? usePapyrus
                        ? "bg-[#2b2620]/10 text-[#3a3328]"
                        : "bg-white/10 text-[#e8c97a]"
                      : usePapyrus
                        ? "text-[#3a3328] hover:bg-[#2b2620]/8"
                        : "text-[#e8c97a] hover:bg-white/10"
                  }`}
                >
                  <Sparkles />
                  <span className="truth-header-label">Cursor</span>
                </Link>
              </>
            ) : null}
            <div className="truth-header-tools">
              <PageTools dark={!usePapyrus} compact />
            </div>
            {isGuest ? (
              <Link
                to="/login"
                className={`truth-header-account relative z-[91] ${
                  usePapyrus ? "text-[#3a3328] hover:bg-[#2b2620]/8" : "text-[#f3e9c8]/90 hover:bg-white/10"
                }`}
              >
                Sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => logout(true)}
                className={`truth-header-account ${
                  usePapyrus ? "text-[#3a3328] hover:bg-[#2b2620]/8" : "text-[#f3e9c8]/90 hover:bg-white/10"
                }`}
                title={user.email}
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main
        className={`relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8 ${
          isHome ? "pt-0" : "pt-6 sm:pt-8"
        }`}
      >
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-[#e8ddc7]/70 bg-[#faf6ef]/70 backdrop-blur-md py-6 mb-[calc(4.25rem+env(safe-area-inset-bottom))] md:mb-0">
        <div className="max-w-6xl mx-auto px-5 text-center text-xs text-[#8a7f6f]">
          <p className="font-display italic text-[#5b5142]">
            “And you will know the truth, and the truth will set you free.” — John 8:32
          </p>
          {standalone ? (
            <p className="mt-3 text-[#5b5142]">Running as an installed app on this device.</p>
          ) : (
            <Link
              to="/install"
              className="inline-flex items-center gap-1.5 mt-3 text-[#7a2e2e] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              Install this app
            </Link>
          )}
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/data-safety" className="hover:underline">
              Data safety
            </Link>
            <Link to="/play-console" className="hover:underline">
              Play Console
            </Link>
            <Link to="/account" className="hover:underline">
              Delete account
            </Link>
          </p>
          <div className="mt-3">
            <PageTools />
          </div>
        </div>
      </footer>
      <nav
        aria-label="App"
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)] ${
          usePapyrus
            ? "border-[#c9b27c]/50 bg-[#efe0b8]/95"
            : "border-[#e8c97a]/25 bg-[#120c08]/90"
        }`}
      >
        <div className="grid grid-cols-7 h-[4.25rem]">
          {MOBILE_NAV.map(({ to, label, icon: Icon, matchEvidence }) => {
            const active = navActive(pathname, to, matchEvidence);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 text-[11px] min-h-[44px] ${
                  usePapyrus
                    ? active
                      ? "text-[#7a2e2e]"
                      : "text-[#5b5142]"
                    : active
                      ? "text-[#e8c97a]"
                      : "text-[#f3e9c8]/70"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
      <AudibleBar />
      <InstallAppPrompt />
    </div>
  );
}
