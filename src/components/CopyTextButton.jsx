import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyTextToClipboard, resolveCopyText } from "@/lib/clipboardText";

export default function CopyTextButton({
  text,
  label = "Copy",
  title = "Copy this text",
  variant = "page",
  className = "",
  onCopied,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function onCopy() {
    const result = await copyTextToClipboard(text);
    if (!result.ok) return;
    setCopied(true);
    onCopied?.(result.text);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        className={`p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#2b2620] ${className}`.trim()}
        title={copied ? "Copied" : title}
        aria-label={copied ? "Copied" : title}
        onClick={onCopy}
        data-no-listen
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    );
  }

  const tone =
    variant === "verse"
      ? "verse-tool"
      : variant === "chapter"
        ? "inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#e8ddc7] text-sm hover:bg-[#f3e9c8]/40"
        : className || "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide";

  return (
    <button
      type="button"
      onClick={onCopy}
      className={tone}
      title={copied ? "Copied to clipboard" : title}
      data-no-listen
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export { resolveCopyText };
