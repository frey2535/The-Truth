import { useState } from "react";
import { Link } from "react-router-dom";
import LegalDoc, { LegalH2, LegalP } from "@/components/LegalDoc";
import { PLAY_FULL_DESCRIPTION, PLAY_CONSOLE_ANSWERS_URL } from "@/lib/playStore";
import { PLAY_QUESTIONNAIRE, PLAY_REVIEW_NOTES } from "@/lib/playConsole";

function CopyAnswer({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 text-[11px] uppercase tracking-wide text-[#7a2e2e] hover:underline"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Question({ item }) {
  return (
    <li className="rounded-xl border border-[#ece3d0] bg-[#fffdf8] px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[#5b5142]">{item.q}</p>
        <CopyAnswer text={item.a} />
      </div>
      <p className="mt-1 font-medium text-[#2b2620]">{item.a}</p>
      {item.note ? <p className="mt-1 text-sm text-[#8a7f6f]">{item.note}</p> : null}
    </li>
  );
}

export default function PlayConsole() {
  return (
    <LegalDoc
      kicker="Google Play"
      title="Play Console answers"
      updated="Paste these exact answers. The listing stays free. Updated 11 September 2026."
    >
      <LegalP>
        Open this page beside Play Console and copy each answer. The app is a free Trusted Web
        Activity for{" "}
        <a className="text-[#7a2e2e] underline" href="https://thetruth.currentflowconsulting.org/">
          thetruth.currentflowconsulting.org
        </a>
        . There is no paid download, no in-app purchase, and no paid API required for study.
      </LegalP>
      <LegalP>
        Public copy of this page:{" "}
        <a className="text-[#7a2e2e] underline" href={PLAY_CONSOLE_ANSWERS_URL}>
          {PLAY_CONSOLE_ANSWERS_URL}
        </a>
        . Privacy and deletion stay on{" "}
        <Link className="text-[#7a2e2e] underline" to="/privacy">
          /privacy
        </Link>{" "}
        and{" "}
        <Link className="text-[#7a2e2e] underline" to="/account">
          /account
        </Link>
        .
      </LegalP>

      {PLAY_QUESTIONNAIRE.map((section) => (
        <section key={section.id}>
          <LegalH2>{section.title}</LegalH2>
          <ol className="mt-3 space-y-2">
            {section.items.map((item) => (
              <Question key={`${section.id}:${item.q}`} item={item} />
            ))}
          </ol>
        </section>
      ))}

      <LegalH2>Full store description</LegalH2>
      <pre className="whitespace-pre-wrap rounded-xl border border-[#ece3d0] bg-[#fffdf8] px-3 py-3 text-sm text-[#2b2620]">
        {PLAY_FULL_DESCRIPTION}
      </pre>

      <LegalH2>Review notes</LegalH2>
      <pre className="whitespace-pre-wrap rounded-xl border border-[#ece3d0] bg-[#fffdf8] px-3 py-3 text-sm text-[#2b2620]">
        {PLAY_REVIEW_NOTES}
      </pre>
    </LegalDoc>
  );
}
