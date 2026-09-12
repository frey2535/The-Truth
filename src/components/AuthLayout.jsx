import React from "react";
import HeavenBackdrop from "@/components/HeavenBackdrop";
import PageTools from "@/components/PageTools";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children, variant = "light" }) {
  const dark = variant === "dark";
  return (
    <div className="min-h-screen truth-app truth-app--auth relative flex items-center justify-center px-4 py-12">
      <HeavenBackdrop />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f3e9c8] text-[#2b2620] mb-4 shadow-[0_0_28px_rgba(243,221,150,0.4)]">
            <Icon className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl tracking-wide text-[#f3e9c8] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#f3e9c8]/85 mt-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">{subtitle}</p>
          )}
        </div>
        <div
          className={
            dark
              ? "bg-[#2b2620]/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#e8c97a]/40 p-8 text-white"
              : "bg-[#faf6ef] rounded-2xl shadow-lg border border-[#e8c97a]/35 p-8 text-[#2b2620]"
          }
        >
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-[#f3e9c8]/85 mt-6 drop-shadow [&_a]:text-[#e8c97a] [&_a]:font-medium [&_a]:underline">
            {footer}
          </p>
        )}
        <div className="mt-6">
          <PageTools dark pageTitle={title} />
        </div>
      </div>
    </div>
  );
}
