import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { GUEST_EMAIL } from "@/api/localAuth";
import HeavenBackdrop from "@/components/HeavenBackdrop";
import PapyrusBackdrop from "@/components/PapyrusBackdrop";
import { isEvidencePath } from "@/components/evidence/EvidenceSectionNav";
import {
  BookOpenText,
  Sparkles,
  ScrollText,
  Landmark,
  Search,
  Moon,
  Download,
  Map as MapIcon,
  BookMarked,
} from "lucide-react";

const PRIMARY = [
  { to: "/library", label: "Read", icon: BookOpenText },
  { to: "/search", label: "Search", icon: Search },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/customs", label: "Holidays", icon: Moon },
  { to: "/evidence", label: "Evidence", icon: Landmark, matchEvidence: true },
  { to: "/notebook", label: "Notebook", icon: BookMarked },
];

const MOBILE_NAV = [
  { to: "/library", label: "Read", icon: BookOpenText },
  { to: "/search", label: "Search", icon: Search },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/customs", label: "Holidays", icon: Moon },
  { to: "/evidence", label: "Evidence", icon: Landmark, matchEvidence: true },
  { to: "/notebook", label: "Notes", icon: BookMarked },
  { to: "/assistant", label: "Ask", icon: Sparkles },
];

export default function Layout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isGuest = !user || user.email === GUEST_EMAIL || user.is_guest;
  const isHome = pathname === "/";
  const usePapyrus = !isHome;
  return (
    <div className={`min-h-screen truth-app text-[#2b2620] flex flex-col${usePapyrus ? " truth-app--read" : ""}`}>
      {usePapyrus ? <PapyrusBackdrop /> : <HeavenBackdrop />}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          usePapyrus
            ? "border-[#c9b27c]/50 bg-[#efe0b8]/90"
            : "border-[#e8c97a]/25 bg-[#120c08]/55"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-full bg-[#f3e9c8] text-[#2b2620] grid place-items-center shadow-[0_0_24px_rgba(243,221,150,0.45)]">
              <ScrollText className="w-5 h-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className={`font-display text-2xl tracking-wide ${usePapyrus ? "text-[#2b2620]" : "text-[#f3e9c8]"}`}>The Truth</span>
              <span className={`text-[10px] tracking-[0.25em] uppercase ${usePapyrus ? "text-[#7a2e2e]" : "text-[#e8c97a]"}`}>Read · Investigate · Learn</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {PRIMARY.map(({ to, label, icon: Icon, matchEvidence }) => {
              const active = matchEvidence ? isEvidencePath(pathname) : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group relative hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors ${
                    active
                      ? "bg-[#f3e9c8] text-[#2b2620]"
                      : usePapyrus
                        ? "text-[#3a3328] hover:bg-[#2b2620]/8"
                        : "text-[#f3e9c8]/85 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{label}</span>
                  <span className="lg:hidden pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-md bg-[#2b2620] px-2 py-1 text-[11px] text-[#f3e9c8] opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {label}
                  </span>
                </Link>
              );
            })}
            <Link
              to="/assistant"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname.startsWith("/assistant")
                  ? "bg-[#5e2222] text-[#f3e9c8]"
                  : "bg-[#7a2e2e] text-[#f3e9c8] hover:bg-[#5e2222]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Truth Assistant</span>
            </Link>
            {isGuest ? (
              <Link
                to="/login"
                className={`hidden sm:inline-flex items-center px-3 py-2 rounded-full text-sm ${
                  usePapyrus ? "text-[#3a3328] hover:bg-[#2b2620]/8" : "text-[#f3e9c8]/90 hover:bg-white/10"
                }`}
              >
                Sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => logout(true)}
                className={`hidden sm:inline-flex items-center px-3 py-2 rounded-full text-sm ${
                  usePapyrus ? "text-[#3a3328] hover:bg-[#2b2620]/8" : "text-[#f3e9c8]/90 hover:bg-white/10"
                }`}
                title={user.email}
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
        <div className={`sm:hidden border-t flex justify-around py-2 ${usePapyrus ? "border-[#c9b27c]/40" : "border-[#e8c97a]/20"}`}>
          {MOBILE_NAV.map(({ to, label, icon: Icon, matchEvidence }) => {
            const active = matchEvidence ? isEvidencePath(pathname) : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 text-[11px] ${
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
      </header>
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-5 py-8">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-[#e8ddc7]/70 bg-[#faf6ef]/70 backdrop-blur-md py-6">
        <div className="max-w-6xl mx-auto px-5 text-center text-xs text-[#8a7f6f]">
          <p className="font-display italic text-[#5b5142]">
            “And you will know the truth, and the truth will set you free.” — John 8:32
          </p>
          <Link
            to="/install"
            className="inline-flex items-center gap-1.5 mt-3 text-[#7a2e2e] hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            Install on a phone
          </Link>
        </div>
      </footer>
    </div>
  );
}