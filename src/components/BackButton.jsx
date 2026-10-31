import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { canGoBackInApp, takePreviousNavPath } from "@/lib/navHistory";

export default function BackButton({ dark = false, className = "" }) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const here = `${pathname}${search || ""}`;
  if (pathname === "/") return null;

  function goBack() {
    if (canGoBackInApp()) {
      navigate(takePreviousNavPath("/"));
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  }

  const tone = dark
    ? "text-[#f3e9c8]/90 hover:bg-white/10"
    : "text-[#3a3328] hover:bg-[#2b2620]/8";

  return (
    <button
      type="button"
      onClick={goBack}
      title="Back to previous screen"
      aria-label="Back to previous screen"
      data-current={here}
      className={`truth-header-link truth-header-back ${tone} ${className}`.trim()}
    >
      <ArrowLeft />
      <span className="truth-header-label">Back</span>
    </button>
  );
}
