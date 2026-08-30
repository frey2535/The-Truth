import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CalendarExplorer from "@/components/calendar/CalendarExplorer";
import { libraryHref } from "@/lib/libraryLinks";
import { QUMRAN_FESTIVALS, QUMRAN_NOTE, QUMRAN_QUARTERS } from "@/lib/calendars";
import {
  APPOINTED_TIMES,
  BIBLICAL_MONTHS,
  CALENDAR_SYSTEMS,
  CLAIMS,
  COMPARE_ROWS,
  COMPARISON_ENTRIES,
  EVIDENCE_LABELS,
  SCRIPTURE_POINTS,
  SOURCES,
  TIMELINE,
} from "@/data/biblicalCalendarCopy";

const PAGE_TABS = [
  { id: "calendar", label: "Use the calendar" },
  { id: "about", label: "About each calendar" },
  { id: "scripture", label: "Scripture & months" },
  { id: "claims", label: "Test a claim" },
];

const HASH_TO_TAB = {
  explorer: "calendar",
  jesus: "about",
  changed: "about",
  appointed: "scripture",
  claims: "claims",
};

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

export default function Calendar() {
  const [tab, setTab] = useState("calendar");

  useEffect(() => {
    document.title = "Calendar — The Truth";
    const hash = window.location.hash.replace("#", "");
    if (HASH_TO_TAB[hash]) setTab(HASH_TO_TAB[hash]);
    return () => {
      document.title = "The Truth — Biblical Scripture Research";
    };
  }, []);

  return (
    <div>
      <header className="mb-5">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#b08d3c] mb-2">
          Biblical time · Observation · History
        </p>
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Calendar</h1>
        <p className="text-[#5b5142] max-w-3xl leading-relaxed">
          Pick a day to see it on the civil calendar, the Hebrew calendar used today, a Temple-era
          reconstruction, and the Julian calendar Rome used in the time of Jesus.
        </p>
      </header>

      <nav aria-label="Calendar sections" className="flex flex-wrap gap-2 mb-6">
        {PAGE_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              tab === item.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "border-[#e8ddc7] bg-white/80 text-[#5b5142] hover:bg-[#f3e9c8]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "calendar" && (
        <div id="explorer">
          <CalendarExplorer />
          <blockquote className="mb-4 border-l-2 border-[#b08d3c] pl-4 text-sm text-[#3a3328] max-w-3xl">
            <strong>Truth standard:</strong> No surviving evidence shows that one person secretly replaced
            a single, perfectly preserved “biblical calendar.” Several documented calendar reforms occurred
            in different communities for different reasons. Where the evidence is incomplete, this page
            identifies reconstruction as reconstruction.
          </blockquote>
        </div>
      )}

      {tab === "about" && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-[#2b2620] mb-3">Learn each calendar</h2>
          <p className="text-sm text-[#5b5142] mb-4 max-w-3xl">
            Open a system to see how it counts days. None of these is hidden. The Temple-era view is a
            reconstruction. The Qumran year is an ancient alternative, not the common Temple calendar.
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {CALENDAR_SYSTEMS.map((sys) => (
              <article key={sys.id} className="rounded-2xl border border-[#e8ddc7] bg-white/75 p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#b08d3c] mb-1">{sys.short}</p>
                <h3 className="font-display text-xl text-[#2b2620] mb-1">{sys.label}</h3>
                <p className="text-sm text-[#5b5142]">{sys.usedThen}</p>
              </article>
            ))}
          </div>
          <div className="rounded-2xl border border-[#e8ddc7] bg-[#faf6ef] p-4 mb-8">
            <h3 className="font-display text-lg text-[#2b2620] mb-2">Qumran 364-day year</h3>
            <p className="text-sm text-[#5b5142] mb-3">{QUMRAN_NOTE}</p>
            <div className="grid sm:grid-cols-4 gap-2 mb-3">
              {QUMRAN_QUARTERS.map((q) => (
                <div key={q.season} className="rounded-lg border border-[#e8ddc7] bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-wide text-[#8a7f6f]">{q.season}</p>
                  {q.months.map((m) => (
                    <p key={m} className="text-sm text-[#2b2620]">{m}</p>
                  ))}
                </div>
              ))}
            </div>
            <ul className="text-sm text-[#5b5142] space-y-1">
              {QUMRAN_FESTIVALS.map((f) => (
                <li key={f.name}>
                  <span className="text-[#2b2620]">{f.name}</span> — {f.weekday}
                </li>
              ))}
            </ul>
          </div>
          <h3 className="font-display text-xl text-[#2b2620] mb-2">Other calendars for comparison</h3>
          <p className="text-sm text-[#5b5142] mb-3 max-w-3xl">
            These are neighboring or later systems. They are not given the same authority as Scripture or as the
            first-century Jewish festival calendar.
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {COMPARISON_ENTRIES.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-[#e8ddc7] bg-white/75 p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#b08d3c] mb-1">
                  {EVIDENCE_LABELS.find((l) => l.id === entry.evidence)?.label}
                </p>
                <h3 className="font-display text-lg text-[#2b2620] mb-1">{entry.label}</h3>
                <p className="text-sm text-[#5b5142]">{entry.body}</p>
                {entry.href && (
                  <Link className="inline-block mt-2 text-sm text-[#7a2e2e] underline" to={entry.href}>
                    Open Holidays
                  </Link>
                )}
              </article>
            ))}
          </div>

          <h2 className="font-display text-2xl text-[#2b2620] mb-3">Evidence labels</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {EVIDENCE_LABELS.map((l) => (
              <span key={l.id} className="max-w-xs rounded-xl border border-[#e8ddc7] bg-white/80 px-3 py-2 text-xs text-[#5b5142]">
                <strong className="block text-[#2b2620]">{l.label}</strong>
                {l.meaning}
              </span>
            ))}
          </div>

          <h2 className="font-display text-2xl text-[#2b2620] mb-3">At a glance</h2>
          <ScrollTable
            caption="Comparison of Temple-era reconstruction, fixed Hebrew calendar, and Gregorian calendar"
            headers={["Feature", "Temple-era reconstruction", "Fixed Hebrew calendar", "Gregorian calendar"]}
            rows={COMPARE_ROWS}
          />

          <Accordion type="multiple" className="mb-8">
            <AccordionItem value="reconstruct">
              <AccordionTrigger className="font-display text-xl text-[#2b2620]">Reconstructing the Temple-era calendar</AccordionTrigger>
              <AccordionContent className="text-[#5b5142] space-y-3 leading-relaxed">
                <p>
                  A biblical calendar date is shown from local sunset to the following sunset. The civil date
                  and biblical date remain separately visible whenever sunset causes them to differ.
                </p>
                <p>
                  Jerusalem is the reference location. A reconstructed month begins at sunset following the
                  first credible visibility of the waxing crescent. Months contain 29 or 30 days. Ancient
                  Jewish literature describes witnesses reporting the crescent and a court declaring the new
                  month. If the previous month was not ended on day 29, it ended after day 30.
                </p>
                <p>
                  Astronomical conjunction is not the same event as first visibility. The moon is invisible
                  at conjunction; the first crescent is seen later.
                </p>
                <p>
                  Month 1 is the month of Aviv, the spring season connected with ripening grain. A lunar year
                  is roughly eleven days shorter than a solar year, so an additional month must sometimes be
                  inserted to prevent Passover from moving through every season. This page begins Month 1
                  with the first credible Jerusalem crescent whose fourteenth day falls in the spring season,
                  normally on or after the northern vernal equinox. That rule is <strong>Strong reconstruction</strong>,
                  not Scripture. Agricultural conditions may have informed ancient decisions, but a barley-only
                  algorithm cannot be proved as the universal biblical rule.
                </p>
                <p>
                  The weekly cycle does not restart with the moon. Sabbath is every seventh day in a continuous
                  cycle. A “lunar Sabbath” calendar is listed under unsupported claims because Scripture gives
                  no instruction to reset weekdays at the beginning of a month.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="jesus" id="jesus">
              <AccordionTrigger className="font-display text-xl text-[#2b2620]">In the time of Jesus</AccordionTrigger>
              <AccordionContent className="text-[#5b5142] space-y-3 leading-relaxed">
                <p>
                  Jesus, his disciples, and the Jerusalem Temple participated in the mainstream Jewish festival
                  calendar: lunar months, a spring Nisan, twelve or thirteen months, appointed festivals, and a
                  continuous seventh-day Sabbath.
                </p>
                <p>
                  Josephus, stored in this app, calls Nisan the beginning of the year and places Passover on
                  the fourteenth day of a lunar month when the sun is in Aries. The Gospels and Acts present
                  Jesus and his followers attending the public festivals and Temple occasions of other Jews.
                  There is no clear evidence that Jesus followed a separate Qumran 364-day calendar.
                </p>
                <p>
                  Roman officials used the Julian calendar. Julius Caesar’s reform took effect in 45 BCE,
                  before Jesus’ lifetime. A Roman civil date from the first century should be labeled{" "}
                  <strong>Julian</strong>. A Gregorian equivalent is a modern backward conversion and should
                  be labeled <strong>proleptic Gregorian</strong>.
                </p>
                <p>
                  Ancient documents could identify years through a ruler’s reign, Roman consuls, a provincial
                  or city era, the Seleucid era, or an officeholder. People in the first century did not call
                  their year “AD 30”; the AD era was devised centuries later.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hebrew-dev">
              <AccordionTrigger className="font-display text-xl text-[#2b2620]">How the fixed Hebrew calendar developed</AccordionTrigger>
              <AccordionContent className="text-[#5b5142] space-y-3 leading-relaxed">
                <p>
                  The present Hebrew calendar preserves the biblical months and festivals while determining
                  dates through fixed calculation: twelve months in an ordinary year and thirteen in a leap
                  year; seven leap years in each nineteen-year cycle (years 3, 6, 8, 11, 14, 17, and 19);
                  months of 29 or 30 days; variable Cheshvan and Kislev; calculated molad and postponement
                  rules for Rosh Hashanah; a numbered year beginning on Tishri 1 while Nisan remains biblical
                  Month 1.
                </p>
                <p>
                  The claim that Hillel II created every rule of today’s calendar in AD 359 is a later
                  traditional simplification. Historical evidence points to a gradual transition from
                  observation and declaration to prediction, fixed intercalation, and standardized calculation.
                  Jewish authorities in Palestine and Babylonia could still disagree over festival dates in
                  921–922 CE.
                </p>
                <p>
                  The change was not the act of a Roman emperor or pope. Calculation allowed distant
                  communities to know dates in advance, reduced dependence on weather and messengers, and
                  helped geographically dispersed communities observe together.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gregorian" id="changed">
              <AccordionTrigger className="font-display text-xl text-[#2b2620]">How calendars changed</AccordionTrigger>
              <AccordionContent className="text-[#5b5142] space-y-3 leading-relaxed">
                <p>
                  Scripture ties Israel’s worship year to Aviv and the moon. Babylonian month names later
                  entered Jewish use. In the Second Temple period the mainstream festival calendar was
                  lunisolar, while Qumran, 1 Enoch, and Jubilees preserve a 364-day alternative. The fixed
                  Hebrew calendar developed gradually after the Temple. Rome used the Julian civil calendar
                  from 45 BCE. Early Christian computus later dated Easter; Nicaea regulated that Christian
                  practice, not the seventh-day Sabbath. Gregory XIII reformed the Julian civil calendar in
                  1582. The timeline table below lists these steps without treating them as one authority.
                </p>
                <p>
                  Julius Caesar reformed Rome’s irregular civil calendar, and the Julian calendar took effect
                  in 45 BCE. The assumed year of 365.25 days is slightly too long, causing a drift of roughly
                  one day every 128 years.
                </p>
                <p>
                  Pope Gregory XIII promulgated the Gregorian calendar in 1582. In the first adopting
                  territories, October 4, 1582, Julian, was followed by October 15, 1582, Gregorian. The
                  weekday sequence did not change. Century years not divisible by 400 are not leap years:
                  1600 and 2000 were leap years; 1700, 1800, and 1900 were not.
                </p>
                <p>
                  Countries adopted the Gregorian calendar at different times. The reform changed western
                  civil and ecclesiastical dating; it did not rewrite the Torah or directly alter the Jewish
                  calendar.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="firstfruits">
              <AccordionTrigger className="font-display text-xl text-[#2b2620]">Where interpretation differs</AccordionTrigger>
              <AccordionContent className="text-[#5b5142] space-y-3 leading-relaxed">
                <p>
                  “The morrow after the Sabbath” in Leviticus 23:11 has been read in more than one way.
                  Rabbinic practice — also the practice Josephus describes — begins the count on Nisan 16.
                  Another interpretation begins on the Sunday during Unleavened Bread. Because that decision
                  changes the date of Shavuot, the explorer can mark both calculations.
                </p>
                <p>
                  Passover can refer narrowly to the sacrifice associated with Nisan 14 or more broadly to
                  the festival period extending into Unleavened Bread. The intended meaning should be stated
                  when comparing Gospel chronologies.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <h2 className="font-display text-2xl text-[#2b2620] mb-3">Timeline of documented development</h2>
          <ScrollTable
            caption="Documented calendar developments"
            headers={["Period", "Development", "Who or what produced it", "Why"]}
            rows={TIMELINE.map((t) => [t.period, t.development, t.who, t.why])}
          />
        </section>
      )}

      {tab === "scripture" && (
        <section className="mb-8">
          <h2 className="font-display text-2xl text-[#2b2620] mb-3">What Scripture establishes</h2>
          <p className="text-[#5b5142] mb-3 max-w-3xl">
            The biblical texts establish a framework, not a complete mathematical algorithm. Scripture does
            not supply a crescent-visibility formula, a nineteen-year leap cycle, a list of leap years, or
            a complete era counted from Creation. It never instructs Israel to reset the weekly cycle at
            each new moon.
          </p>
          <ul className="space-y-2 mb-8">
            {SCRIPTURE_POINTS.map((p) => (
              <li key={p.ref} className="text-sm text-[#3a3328]">
                <Link className="text-[#7a2e2e] underline" to={libraryHref({ reference: p.ref.split(";")[0] })}>
                  {p.ref}
                </Link>
                {" — "}
                {p.text}
              </li>
            ))}
          </ul>

          <h2 className="font-display text-2xl text-[#2b2620] mb-3">The biblical months</h2>
          <p className="text-sm text-[#5b5142] mb-3">
            Month numbers are the primary Temple-era labels. Later names are secondary. Babylonian-derived
            names entered Jewish usage through cultural and imperial contact; that did not abolish the
            biblical festival dates.
          </p>
          <ScrollTable
            caption="Biblical month numbers, later Jewish names, earlier biblical names, and seasons"
            headers={["Number", "Common Jewish name", "Earlier biblical name or note", "Approximate season", "Stored text"]}
            rows={BIBLICAL_MONTHS.map((m) => [String(m.n), m.jewish, m.earlier, m.season, m.verse])}
          />

          <section id="appointed">
            <h2 className="font-display text-2xl text-[#2b2620] mb-3">Biblical appointed times</h2>
            <p className="text-sm text-[#5b5142] mb-3 max-w-3xl">
              Dates below are the biblical month and day. The explorer shows the matching Temple-era
              reconstruction, the fixed Hebrew date, and the Gregorian civil date for a chosen day.
              Firstfruits and the count to Shavuot have two readings; both are labeled Disputed.
            </p>
            <ScrollTable
              caption="Appointed times with biblical dates and principal texts"
              headers={["Appointed time", "Biblical date", "Principal text"]}
              rows={APPOINTED_TIMES.map((a) => [a.name, a.when, a.text])}
            />
          </section>
        </section>
      )}

      {tab === "claims" && (
        <>
          <section id="claims" className="mb-10">
            <h2 className="font-display text-2xl text-[#2b2620] mb-3">Test a claim</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {CLAIMS.map((c) => (
                <article key={c.claim} className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
                  <p className="text-sm text-[#5b5142] mb-2">“{c.claim}”</p>
                  <p className="font-display text-lg text-[#7a2e2e] mb-2">{c.verdict}</p>
                  <p className="text-sm text-[#3a3328]">{c.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-[#2b2620] mb-3">Sources for investigation</h2>
            <ul className="space-y-1.5 text-sm">
              {SOURCES.map((s) => (
                s.href.startsWith("/") ? (
                  <li key={s.label}>
                    <Link className="text-[#7a2e2e] underline" to={s.href}>{s.label}</Link>
                  </li>
                ) : (
                  <li key={s.label}>
                    <a className="text-[#7a2e2e] underline" href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </section>
        </>
      )}

      <p className="text-sm text-[#5b5142] border-t border-[#e8ddc7] pt-4 max-w-3xl">
        Dates communicate more than numbers. They preserve observation, authority, worship, agriculture,
        empire, and community. The purpose of this calendar is not to force certainty where evidence is
        missing, but to let Scripture, history, and astronomy each say exactly what they can establish.
      </p>
    </div>
  );
}
