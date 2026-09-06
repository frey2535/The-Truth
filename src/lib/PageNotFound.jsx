import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\//, "") || "this page";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f4ead2]">
      <div className="max-w-md w-full rounded-2xl border border-[#e8ddc7] bg-white/70 p-6 shadow-sm text-center">
        <h1 className="font-display text-3xl text-[#2b2620] mb-3">The Truth</h1>
        <p className="text-[#5b5142] leading-relaxed mb-6">
          “{pageName}” is not a page in this app. You can open The Truth again from here.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium bg-[#2b2620] text-[#f3e9c8]"
          >
            Open The Truth
          </Link>
          <Link
            to="/prophecy"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium border border-[#2b2620] text-[#2b2620] bg-white"
          >
            Open Prophecy
          </Link>
        </div>
      </div>
    </div>
  );
}
