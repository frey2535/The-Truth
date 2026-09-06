import React from "react";
import { Link } from "react-router-dom";
import { libraryHref } from "@/lib/libraryLinks";
import SymbolPhoto from "@/components/library/SymbolPhoto";
import { REPLACEMENT_CARDS, REPLACEMENT_TIMELINE, WEEKDAY_NAMES, MONTH_NAMES } from "@/data/calendarReplacements";

function ScrollTable({ caption, headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e8ddc7] bg-white/70 mb-6">
      <table className="w-full text-sm min-w-[640px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[#f3e9c8]/70 text-[#5b5142]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-t border-[#e8ddc7]">
              {row.map((cell, i) => (
                <td key={`${cell}-${i}`} className={`px-4 py-2 ${i === 0 ? "text-[#2b2620] font-medium" : "text-[#5b5142]"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReplacedTimes() {
  return (
    <section id="changed" className="mb-10">
      <h2 className="font-display text-2xl text-[#2b2620] mb-3">Times and seasons replaced</h2>
      <blockquote className="mb-4 border-l-2 border-[#b08d3c] pl-4 text-sm text-[#3a3328] max-w-3xl">
        <Link className="text-[#7a2e2e] underline" to={libraryHref({ reference: "Daniel 7:25" })}>
          Daniel 7:25
        </Link>
        {" — "}
        “he shall… think to change times and laws.”
        This page does not treat that verse as a dated fulfillment. It stores the documented replacements
        beside what Scripture appointed, so the later calendar can be seen for what it is.
      </blockquote>
      <p className="text-sm text-[#5b5142] mb-6 max-w-3xl leading-relaxed">
        Most people live inside January, Sunday, and midnight as if those were nature. They are Rome’s
        names, Rome’s year-start, and a later church rest-day.{" "}
        <Link className="text-[#7a2e2e] underline" to={libraryHref({ reference: "Genesis 1:14" })}>
          Genesis 1:14
        </Link>{" "}
        ties lights in the heavens to seasons and appointed times.{" "}
        <Link className="text-[#7a2e2e] underline" to={libraryHref({ reference: "Galatians 4:10" })}>
          Galatians 4:10–11
        </Link>{" "}
        warns against observing days, months, times, and years that are not the ones given.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {REPLACEMENT_CARDS.map((card) => (
          <article key={card.id} className="rounded-2xl border border-[#e8ddc7] bg-white/70 overflow-hidden">
            <div className="aspect-[4/3] bg-[#f3e9c8]">
              <SymbolPhoto id={card.photoId} title={card.later} className="h-full" />
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wide text-[#b08d3c] mb-1">Appointed</p>
              <p className="text-sm text-[#2b2620] leading-snug mb-3">{card.appointed}</p>
              <p className="text-[10px] uppercase tracking-wide text-[#7a2e2e] mb-1">Later overlay</p>
              <p className="font-display text-lg text-[#2b2620] leading-snug mb-2">{card.later}</p>
              <p className="text-sm text-[#5b5142] leading-relaxed mb-3">{card.body}</p>
              <Link className="text-sm text-[#7a2e2e] underline" to={card.href}>
                {card.linkLabel || (card.href.startsWith("/customs") ? "Open this tradition" : "Open the stored text")}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <h3 className="font-display text-xl text-[#2b2620] mb-2">Every weekday name</h3>
      <p className="text-sm text-[#5b5142] mb-3 max-w-3xl">
        Hebrew and the Gospels number the days. English catechizes the planetary week and the northern gods.
      </p>
      <ScrollTable
        caption="Civil weekday names beside numbered biblical days"
        headers={["Civil name", "Named for", "Latin planetary day", "Numbered day"]}
        rows={WEEKDAY_NAMES.map((w) => [w.civil, w.namedFor, w.latin, w.numbered])}
      />

      <h3 className="font-display text-xl text-[#2b2620] mb-2">Every month name</h3>
      <p className="text-sm text-[#5b5142] mb-3 max-w-3xl">
        Scripture’s first month is Aviv. The wall calendar is Janus, Mars, Juno, and two deified Caesars.
      </p>
      <ScrollTable
        caption="Civil month names beside who or what they name"
        headers={["Civil month", "Named for", "What that is"]}
        rows={MONTH_NAMES.map((m) => [m.civil, m.namedFor, m.note])}
      />

      <h3 className="font-display text-xl text-[#2b2620] mb-3">When the overlays were written down</h3>
      <ScrollTable
        caption="Documented replacements of times and seasons"
        headers={["Period", "Development", "Who or what produced it", "Why"]}
        rows={REPLACEMENT_TIMELINE.map((t) => [t.period, t.development, t.who, t.why])}
      />
    </section>
  );
}
