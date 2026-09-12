import { Link } from "react-router-dom";

export default function LegalDoc({ kicker, title, updated, children }) {
  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-[10px] tracking-[0.25em] uppercase text-[#b08d3c] mb-2">{kicker}</p>
      <h1 className="font-display text-4xl text-[#2b2620] mb-2">{title}</h1>
      {updated ? <p className="text-xs text-[#8a7f6f] mb-6">{updated}</p> : null}
      <article className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-5 sm:p-7 text-[#2b2620] leading-relaxed space-y-4">
        {children}
      </article>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 mt-6 text-sm text-[#7a2e2e]">
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
        <Link to="/install" className="hover:underline">
          Install
        </Link>
      </nav>
    </div>
  );
}

export function LegalH2({ children }) {
  return <h2 className="font-display text-2xl text-[#2b2620] pt-2">{children}</h2>;
}

export function LegalP({ children }) {
  return <p className="text-[#3a3328] leading-relaxed">{children}</p>;
}

export function LegalList({ children }) {
  return <ul className="list-disc pl-5 space-y-1.5 text-[#3a3328]">{children}</ul>;
}
