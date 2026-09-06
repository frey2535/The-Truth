import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sunset } from "lucide-react";
import {
  WEEKDAYS,
  addGregorianMonths,
  addJulianMonths,
  gregorianMonthLength,
  gregorianToJd,
  gregorianToHebrew,
  hebrewMonthDays,
  hebrewMonthName,
  hebrewToGregorian,
  hebrewYearMonths,
  addHebrewMonths,
  jdToGregorian,
  jdToJulian,
  julianMonthLength,
  julianToJd,
  weekdayFromJd,
  gregorianToTemple,
  templeMonthGrid,
  addTempleMonths,
  jerusalemSunTimes,
  formatClock,
  VISIBILITY_CRITERION,
  appointedTimesForHebrew,
  isSabbathJd,
  hebrewToJd,
  shavuotFromNisan16,
  shavuotFromSundayInUnleavened,
  QUMRAN_MONTH_LENGTHS,
  QUMRAN_NOTE,
  qumranFestivalsOn,
  qumranWeekday,
} from "@/lib/calendars";
import { EVIDENCE_LABELS } from "@/data/biblicalCalendarCopy";
import { civilHolidaysOn, MONTH_NAMES, overlayJumps, overlaysForCivilDate, WEEKDAY_NAMES } from "@/data/calendarReplacements";

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const VIEWS = [
  { id: "gregorian", label: "Civil", hint: "Gregorian — the later wall calendar: gods, Caesars, and midnight" },
  { id: "hebrew", label: "Hebrew", hint: "Fixed Jewish calendar used today" },
  { id: "temple", label: "Temple-era", hint: "Reconstruction of the first-century festival calendar" },
  { id: "julian", label: "Julian", hint: "Roman civil calendar in the time of Jesus" },
  { id: "qumran", label: "Qumran", hint: "364-day year from the scrolls — a schematic year, not a conversion" },
];

const FEAST_JUMPS = [
  { id: "passover", name: "Passover", month: 1, day: 14 },
  { id: "unleavened", name: "Unleavened Bread", month: 1, day: 15 },
  { id: "trumpets", name: "Trumpets", month: 7, day: 1 },
  { id: "atonement", name: "Atonement", month: 7, day: 10 },
  { id: "tabernacles", name: "Tabernacles", month: 7, day: 15 },
];

function todayParts() {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate() };
}

function padGrid(firstWeekday, length) {
  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let d = 1; d <= length; d += 1) cells.push(d);
  return cells;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function isoDate(parts) {
  if (parts.year < 1 || parts.year > 9999) return "";
  return `${String(parts.year).padStart(4, "0")}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

function formatGregorian(parts) {
  return `${GREGORIAN_MONTHS[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

function appointedForHebrewDate(year, month, day, showAppointed) {
  if (!showAppointed) return [];
  const shavuot16 = jdToGregorian(shavuotFromNisan16(year, hebrewToJd));
  const tags = appointedTimesForHebrew(month, day, {
    shavuotOn: gregorianToHebrew(shavuot16.year, shavuot16.month, shavuot16.day),
  });
  const shavuotSunJd = shavuotFromSundayInUnleavened(year, hebrewToJd, weekdayFromJd);
  if (shavuotSunJd && Math.floor(hebrewToJd(year, month, day)) === Math.floor(shavuotSunJd)) {
    tags.push({
      id: "weeks-sunday",
      name: "Weeks / Shavuot (Sunday-count reading)",
      evidence: "disputed",
    });
  }
  return tags;
}

function upcomingFeasts(from, count = 5) {
  const startH = gregorianToHebrew(from.year, from.month, from.day);
  const startJd = gregorianToJd(from.year, from.month, from.day);
  const items = [];
  for (let y = startH.year; y <= startH.year + 1; y += 1) {
    for (const feast of FEAST_JUMPS) {
      if (feast.month > hebrewYearMonths(y)) continue;
      const gregorian = hebrewToGregorian(y, feast.month, feast.day);
      const jd = gregorianToJd(gregorian.year, gregorian.month, gregorian.day);
      if (jd >= startJd) items.push({ ...feast, gregorian, jd });
    }
    const weeks = jdToGregorian(shavuotFromNisan16(y, hebrewToJd));
    const weeksJd = gregorianToJd(weeks.year, weeks.month, weeks.day);
    if (weeksJd >= startJd) {
      items.push({ id: `weeks-${y}`, name: "Weeks / Shavuot", gregorian: weeks, jd: weeksJd });
    }
  }
  items.sort((a, b) => a.jd - b.jd);
  return items.slice(0, count);
}

function Badge({ id }) {
  const meta = EVIDENCE_LABELS.find((x) => x.id === id);
  if (!meta) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-[#e8ddc7] bg-[#f3e9c8]/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#5b5142]">
      {meta.label}
    </span>
  );
}

const KIND_LABEL = {
  pagan: "text-[#a34a12]",
  christian: "text-[#3d4a8a]",
};

function holidaysForParts(parts, moveable) {
  return parts ? civilHolidaysOn(parts, { moveable }) : [];
}

function cellTone({ active, sabbath, pagan, christian }) {
  if (active) return "border-[#7a2e2e] bg-[#f3e9c8]";
  if (pagan && christian) return "border-[#a34a12] bg-[#efe6f0]";
  if (pagan) return "border-[#e0b080] bg-[#f8ead4]";
  if (christian) return "border-[#b8b4d8] bg-[#e8e6f5]";
  if (sabbath) return "border-[#e8ddc7] bg-[#efe6cf]";
  return "border-[#eee6d4] bg-white/80";
}

function jumpChipClass(kind) {
  if (kind === "pagan") return "shrink-0 rounded-full border border-[#e0b080] bg-[#f8ead4] px-3 py-1.5 text-xs text-[#5a3010] hover:bg-[#f3d9b8]";
  if (kind === "christian") return "shrink-0 rounded-full border border-[#b8b4d8] bg-[#e8e6f5] px-3 py-1.5 text-xs text-[#2c3258] hover:bg-[#ddd9f0]";
  return "shrink-0 rounded-full border border-[#e8ddc7] bg-white px-3 py-1.5 text-xs text-[#2b2620] hover:bg-[#f3e9c8]";
}

function GlanceCard({ active, title, value, note, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-3 transition-colors ${
        active
          ? "border-[#7a2e2e] bg-[#f3e9c8]"
          : "border-[#e8ddc7] bg-white/80 hover:bg-[#faf6ef]"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wide text-[#8a7f6f]">{title}</p>
      <p className="font-display text-lg text-[#2b2620] leading-tight mt-0.5">{value}</p>
      {note && <p className="text-[11px] text-[#5b5142] mt-1 leading-snug">{note}</p>}
    </button>
  );
}

export default function CalendarExplorer() {
  const today = todayParts();
  const [view, setView] = useState("gregorian");
  const [cursor, setCursor] = useState({ year: today.year, month: today.month });
  const [selected, setSelected] = useState(today);
  const [showNotes, setShowNotes] = useState(false);
  const swipeX = useRef(null);

  const selectedJd = gregorianToJd(selected.year, selected.month, selected.day);
  const hebrew = gregorianToHebrew(selected.year, selected.month, selected.day);
  const temple = gregorianToTemple(selected.year, selected.month, selected.day);
  const julian = jdToJulian(selectedJd);
  const sun = jerusalemSunTimes(selected.year, selected.month, selected.day);
  const appointed = appointedForHebrewDate(hebrew.year, hebrew.month, hebrew.day, true);
  const weekdayIndex = weekdayFromJd(selectedJd);
  const weekday = WEEKDAYS[weekdayIndex];
  const sabbath = isSabbathJd(selectedJd);
  const overlays = overlaysForCivilDate(selected, weekdayIndex);
  const feasts = useMemo(() => upcomingFeasts(selected), [selected]);
  const civilJumps = useMemo(() => overlayJumps(selected), [selected]);
  const viewMeta = VIEWS.find((v) => v.id === view);

  const grid = useMemo(() => {
    if (view === "gregorian") {
      const len = gregorianMonthLength(cursor.year, cursor.month);
      const first = weekdayFromJd(gregorianToJd(cursor.year, cursor.month, 1));
      return {
        title: `${GREGORIAN_MONTHS[cursor.month - 1]} ${cursor.year} — ${MONTH_NAMES[cursor.month - 1].namedFor}`,
        cells: padGrid(first, len).map((day) => {
          if (!day) return null;
          const jd = gregorianToJd(cursor.year, cursor.month, day);
          const h = gregorianToHebrew(cursor.year, cursor.month, day);
          return {
            day,
            jd,
            gregorian: { year: cursor.year, month: cursor.month, day },
            hebrew: h,
            sabbath: isSabbathJd(jd),
            appointed: appointedForHebrewDate(h.year, h.month, h.day, true),
            civil: holidaysForParts({ year: cursor.year, month: cursor.month, day }, true),
          };
        }),
      };
    }
    if (view === "hebrew") {
      const len = hebrewMonthDays(cursor.year, cursor.month);
      const firstG = hebrewToGregorian(cursor.year, cursor.month, 1);
      const first = weekdayFromJd(gregorianToJd(firstG.year, firstG.month, firstG.day));
      return {
        title: `${hebrewMonthName(cursor.year, cursor.month)} ${cursor.year}`,
        cells: padGrid(first, len).map((day) => {
          if (!day) return null;
          const g = hebrewToGregorian(cursor.year, cursor.month, day);
          const jd = gregorianToJd(g.year, g.month, g.day);
          return {
            day,
            jd,
            gregorian: g,
            hebrew: { year: cursor.year, month: cursor.month, day },
            sabbath: isSabbathJd(jd),
            appointed: appointedForHebrewDate(cursor.year, cursor.month, day, true),
            civil: holidaysForParts(g, true),
          };
        }),
      };
    }
    if (view === "julian") {
      const len = julianMonthLength(cursor.year, cursor.month);
      const first = weekdayFromJd(julianToJd(cursor.year, cursor.month, 1));
      return {
        title: `${GREGORIAN_MONTHS[cursor.month - 1]} ${cursor.year} Julian — ${MONTH_NAMES[cursor.month - 1].namedFor}`,
        cells: padGrid(first, len).map((day) => {
          if (!day) return null;
          const jd = julianToJd(cursor.year, cursor.month, day);
          const g = jdToGregorian(jd);
          const h = gregorianToHebrew(g.year, g.month, g.day);
          return {
            day,
            jd,
            gregorian: g,
            hebrew: h,
            sabbath: isSabbathJd(jd),
            appointed: appointedForHebrewDate(h.year, h.month, h.day, true),
            civil: holidaysForParts({ year: cursor.year, month: cursor.month, day }, false),
          };
        }),
      };
    }
    if (view === "qumran") {
      const len = QUMRAN_MONTH_LENGTHS[cursor.month - 1] || 30;
      const first = qumranWeekday(cursor.month, 1);
      return {
        title: `Qumran month ${cursor.month}`,
        schematic: true,
        cells: padGrid(first, len).map((day) => {
          if (!day) return null;
          const wd = qumranWeekday(cursor.month, day);
          return {
            day,
            jd: `q-${cursor.month}-${day}`,
            gregorian: selected,
            hebrew,
            sabbath: wd === 6,
            appointed: qumranFestivalsOn(cursor.month, day).map((f) => ({ name: f.name })),
            civil: [],
            schematic: true,
          };
        }),
      };
    }
    const built = templeMonthGrid(cursor.year, cursor.month);
    if (!built) {
      return { title: `Month ${cursor.month} ${cursor.year}`, cells: [] };
    }
    const first = weekdayFromJd(built.startJd);
    return {
      title: `Biblical month ${cursor.month}, ${cursor.year}`,
      cells: padGrid(first, built.length).map((day) => {
        if (!day) return null;
        const cell = built.days[day - 1];
        const h = gregorianToHebrew(cell.gregorian.year, cell.gregorian.month, cell.gregorian.day);
        return {
          day,
          jd: cell.jd,
          gregorian: cell.gregorian,
          hebrew: h,
          sabbath: isSabbathJd(cell.jd),
          appointed: appointedForHebrewDate(h.year, h.month, h.day, true),
          civil: holidaysForParts(cell.gregorian, true),
        };
      }),
    };
  }, [view, cursor, selected, hebrew]);

  function syncCursor(nextView, parts) {
    if (nextView === "gregorian") return { year: parts.year, month: parts.month };
    if (nextView === "hebrew") {
      const h = gregorianToHebrew(parts.year, parts.month, parts.day);
      return { year: h.year, month: h.month };
    }
    if (nextView === "julian") {
      const j = jdToJulian(gregorianToJd(parts.year, parts.month, parts.day));
      return { year: j.year, month: j.month };
    }
    if (nextView === "temple") {
      const t = gregorianToTemple(parts.year, parts.month, parts.day);
      return { year: t.year || parts.year, month: t.month || 1 };
    }
    return { year: 1, month: 1 };
  }

  function jumpToGregorian(parts) {
    setSelected(parts);
    setCursor(syncCursor(view, parts));
  }

  function goToday() {
    jumpToGregorian(today);
    if (view === "qumran") setCursor({ year: 1, month: 1 });
  }

  function shift(delta) {
    if (view === "gregorian") setCursor((c) => addGregorianMonths(c.year, c.month, delta));
    if (view === "hebrew") setCursor((c) => addHebrewMonths(c.year, c.month, delta));
    if (view === "julian") setCursor((c) => addJulianMonths(c.year, c.month, delta));
    if (view === "temple") setCursor((c) => addTempleMonths(c.year, c.month, delta));
    if (view === "qumran") {
      setCursor((c) => {
        const month = ((c.month - 1 + delta) % 12 + 12) % 12 + 1;
        return { year: 1, month };
      });
    }
  }

  function shiftYear(delta) {
    if (view === "qumran") return;
    if (view === "gregorian") setCursor((c) => ({ year: c.year + delta, month: c.month }));
    if (view === "julian") setCursor((c) => ({ year: c.year + delta, month: c.month }));
    if (view === "hebrew") {
      setCursor((c) => {
        const year = c.year + delta;
        return { year, month: Math.min(c.month, hebrewYearMonths(year)) };
      });
    }
    if (view === "temple") setCursor((c) => ({ year: c.year + delta, month: c.month }));
  }

  function chooseView(next) {
    setView(next);
    setCursor(syncCursor(next, selected));
  }

  function onSwipeStart(event) {
    swipeX.current = event.touches[0]?.clientX ?? null;
  }

  function onSwipeEnd(event) {
    if (swipeX.current == null) return;
    const dx = (event.changedTouches[0]?.clientX ?? swipeX.current) - swipeX.current;
    swipeX.current = null;
    if (dx > 50) shift(-1);
    if (dx < -50) shift(1);
  }

  const crescent = temple.visibility;
  const isToday =
    selected.year === today.year && selected.month === today.month && selected.day === today.day;
  const dateValue = isoDate(selected);

  return (
    <section className="truth-card p-4 sm:p-5 mb-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#b08d3c] mb-1">
            {isToday ? "Today" : "Selected day"}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#2b2620] leading-tight">
            {weekday}, {formatGregorian(selected)}
          </h2>
          <p className="text-sm text-[#5b5142] mt-1">
            {sabbath ? "Sabbath day" : overlays.weekday.numbered}
            {appointed.length ? ` · ${appointed.map((a) => a.name).join(", ")}` : ""}
          </p>
          <p className="text-xs text-[#7a2e2e] mt-1">
            Civil name: {overlays.weekday.civil} for {overlays.weekday.namedFor}
            {" · "}
            {overlays.month.civil} for {overlays.month.namedFor}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="calendar-jump">Jump to a civil date</label>
          <input
            id="calendar-jump"
            type="date"
            value={dateValue}
            onChange={(event) => {
              const [year, month, day] = event.target.value.split("-").map(Number);
              if (year && month && day) jumpToGregorian({ year, month, day });
            }}
            className="h-9 rounded-full border border-[#e8ddc7] bg-white px-3 text-sm text-[#2b2620]"
          />
          <button type="button" className="truth-btn-sm" onClick={goToday}>
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <GlanceCard
          active={view === "gregorian"}
          title="Civil / Gregorian"
          value={`${GREGORIAN_MONTHS[selected.month - 1]} ${selected.day}`}
          note={String(selected.year)}
          onClick={() => chooseView("gregorian")}
        />
        <GlanceCard
          active={view === "hebrew"}
          title="Fixed Hebrew"
          value={`${hebrew.day} ${hebrewMonthName(hebrew.year, hebrew.month)}`}
          note={`Year ${hebrew.year}`}
          onClick={() => chooseView("hebrew")}
        />
        <GlanceCard
          active={view === "temple"}
          title="Temple-era"
          value={temple.day ? `Month ${temple.month}, day ${temple.day}` : temple.label}
          note={temple.day ? `Reconstruction · ${temple.year}` : "Reconstruction uncertain"}
          onClick={() => chooseView("temple")}
        />
        <GlanceCard
          active={view === "julian"}
          title="Julian (Rome)"
          value={`${GREGORIAN_MONTHS[julian.month - 1] || julian.month} ${julian.day}`}
          note={`${julian.year} · civil calendar then`}
          onClick={() => chooseView("julian")}
        />
      </div>

      <p className="flex items-start gap-2 text-sm text-[#5b5142] mb-4">
        <Sunset className="w-4 h-4 mt-0.5 shrink-0 text-[#b08d3c]" />
        <span>
          Jerusalem sunset {formatClock(sun.sunset)}
          {sun.sunrise ? ` · sunrise ${formatClock(sun.sunrise)}` : ""}.
          A biblical day is counted from sunset to the next sunset. The civil date flips at midnight.
        </span>
      </p>

      <div className="rounded-xl border border-[#e8ddc7] bg-[#faf6ef] p-3 mb-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#b08d3c] mb-2">What the civil name covers</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f]">Appointed</p>
            <p className="text-[#2b2620] leading-snug">
              {overlays.weekday.numbered}
              {temple.day ? ` · Month ${temple.month}, day ${temple.day}` : ""}
              {appointed.length ? ` · ${appointed.map((a) => a.name).join(", ")}` : ""}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f]">Civil overlay</p>
            <p className="text-[#2b2620] leading-snug">
              {overlays.weekday.latin} — named for {overlays.weekday.namedFor}. {overlays.month.note}
            </p>
          </div>
        </div>
        {overlays.events.length > 0 && (
          <ul className="mt-3 space-y-2 border-t border-[#e8ddc7] pt-3">
            {overlays.events.map((event) => (
              <li key={event.id} className="text-sm">
                <p className={`font-display ${KIND_LABEL[event.kind] || "text-[#7a2e2e]"}`}>
                  {event.kind === "pagan" ? "Pagan · " : event.kind === "christian" ? "Christian · " : ""}
                  {event.title}
                </p>
                <p className="text-[#5b5142] leading-snug">{event.appointed}</p>
                <p className="text-[#5b5142] leading-snug">Later overlay: {event.later}.</p>
                <Link className="text-xs text-[#7a2e2e] underline" to={event.href}>
                  Open this tradition
                </Link>
              </li>
            ))}
          </ul>
        )}
        {appointed.length === 0 && overlays.events.length === 0 && (
          <p className="mt-3 border-t border-[#e8ddc7] pt-3 text-xs text-[#5b5142] leading-relaxed">
            No later feast is parked on this civil date. The weekday and month names are still the names of
            the nations’ gods and Caesars.{" "}
            <Link className="text-[#7a2e2e] underline" to={overlays.weekday.href}>
              See the weekday names
            </Link>
            {" · "}
            <Link className="text-[#7a2e2e] underline" to="/customs/months">
              See the month names
            </Link>
            .
          </p>
        )}
        {appointed.length > 0 && overlays.events.every((e) => e.id !== "sabbath-day") && (
          <p className="mt-3 border-t border-[#e8ddc7] pt-3 text-xs text-[#5b5142] leading-relaxed">
            Leviticus 23 marks this day. The civil wall calendar does not.
          </p>
        )}
      </div>

      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f] mb-2">Jump to an appointed time</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {feasts.map((feast) => (
            <button
              key={`${feast.id}-${feast.jd}`}
              type="button"
              onClick={() => jumpToGregorian(feast.gregorian)}
              className="shrink-0 rounded-full border border-[#e8ddc7] bg-white px-3 py-1.5 text-xs text-[#2b2620] hover:bg-[#f3e9c8]"
            >
              {feast.name}
              <span className="text-[#8a7f6f]">
                {" · "}
                {feast.gregorian.month}/{feast.gregorian.day}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f] mb-2 mt-3">Jump to a pagan feast</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {civilJumps.filter((jump) => jump.kind === "pagan").map((jump) => (
            <button
              key={jump.id}
              type="button"
              onClick={() => jumpToGregorian(jump.gregorian)}
              className={jumpChipClass("pagan")}
            >
              {jump.name}
              <span className="opacity-70">
                {" · "}
                {jump.gregorian.month}/{jump.gregorian.day}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f] mb-2 mt-3">Jump to a later Christian feast</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {civilJumps.filter((jump) => jump.kind === "christian").map((jump) => (
            <button
              key={jump.id}
              type="button"
              onClick={() => jumpToGregorian(jump.gregorian)}
              className={jumpChipClass("christian")}
            >
              {jump.name}
              <span className="opacity-70">
                {" · "}
                {jump.gregorian.month}/{jump.gregorian.day}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => chooseView(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              view === item.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#8a7f6f] mb-3">{viewMeta?.hint}</p>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1">
          {view !== "qumran" && (
            <button
              type="button"
              className="h-9 px-2 rounded-full border border-[#e8ddc7] bg-white text-[#2b2620] text-xs inline-flex items-center"
              onClick={() => shiftYear(-1)}
              aria-label="Previous year"
            >
              <ChevronLeft className="w-4 h-4" />
              Yr
            </button>
          )}
          <button
            type="button"
            className="h-9 w-9 rounded-full border border-[#e8ddc7] bg-white text-[#2b2620] grid place-items-center"
            onClick={() => shift(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <p className="font-display text-lg sm:text-xl text-[#2b2620] text-center min-w-0 px-2">
          {grid.title}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="h-9 w-9 rounded-full border border-[#e8ddc7] bg-white text-[#2b2620] grid place-items-center"
            onClick={() => shift(1)}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {view !== "qumran" && (
            <button
              type="button"
              className="h-9 px-2 rounded-full border border-[#e8ddc7] bg-white text-[#2b2620] text-xs inline-flex items-center"
              onClick={() => shiftYear(1)}
              aria-label="Next year"
            >
              Yr
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {grid.schematic && (
        <p className="text-xs text-[#8a7f6f] mb-3">{QUMRAN_NOTE} This grid is a schematic year. It does not convert the selected civil date.</p>
      )}

      <div
        className="touch-pan-y"
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
      >
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_NAMES.map((w, i) => (
            <div
              key={w.civil}
              title={`${w.civil} — ${w.latin}, named for ${w.namedFor}`}
              className={`text-center py-1 leading-tight ${i === 6 ? "text-[#7a2e2e]" : i === 0 ? "text-[#9a6b2f]" : "text-[#8a7f6f]"}`}
            >
              <span className="block text-[11px]">{i === 6 ? "Sabbath" : w.short}</span>
              <span className="hidden sm:block text-[9px] opacity-80">
                {i === 6 ? "7th day" : w.namedFor.replace(/\s*\/.*/, "").replace(/^the /, "")}
              </span>
            </div>
          ))}
          {grid.cells.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} />;
            const active = !cell.schematic &&
              cell.gregorian.year === selected.year &&
              cell.gregorian.month === selected.month &&
              cell.gregorian.day === selected.day;
            const feast = cell.appointed[0];
            const pagan = (cell.civil || []).filter((h) => h.kind === "pagan");
            const christian = (cell.civil || []).filter((h) => h.kind === "christian");
            return (
              <button
                key={`${cell.jd}-${i}`}
                type="button"
                onClick={() => {
                  if (!cell.schematic) jumpToGregorian(cell.gregorian);
                }}
                className={`min-h-[3.5rem] sm:min-h-[4.5rem] rounded-lg border p-1 sm:p-1.5 text-left ${
                  cellTone({ active, sabbath: cell.sabbath, pagan: pagan.length, christian: christian.length })
                }`}
              >
                <span className="block text-sm font-medium text-[#2b2620]">{cell.day}</span>
                {view !== "gregorian" && !cell.schematic && (
                  <span className="hidden sm:block text-[10px] text-[#8a7f6f]">
                    {cell.gregorian.month}/{cell.gregorian.day}
                  </span>
                )}
                {cell.sabbath && (
                  <span className="block text-[10px] leading-tight text-[#7a2e2e]">Sabbath day</span>
                )}
                {feast && (
                  <span className="hidden sm:block text-[10px] text-[#7a2e2e] leading-tight line-clamp-2">
                    {feast.name}
                  </span>
                )}
                {pagan.map((h) => (
                  <span key={h.id} className="block text-[10px] leading-tight text-[#a34a12] line-clamp-2">
                    {h.short}
                  </span>
                ))}
                {christian.map((h) => (
                  <span key={h.id} className="block text-[10px] leading-tight text-[#3d4a8a] line-clamp-2">
                    {h.short}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#5b5142]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#efe6cf] border border-[#7a2e2e]" />
          Appointed / Sabbath
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#e8e6f5] border border-[#3d4a8a]" />
          Christian feast
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#f8ead4] border border-[#a34a12]" />
          Pagan feast
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge id={temple.evidence || "strong_reconstruction"} />
        {appointed.map((a) => (
          <Badge key={a.id} id={a.evidence} />
        ))}
      </div>

      {crescent && view === "temple" && (
        <p className="text-xs text-[#5b5142] mt-3">
          Crescent-visibility confidence: {crescent.confidence}
          {typeof crescent.age === "number" ? ` (about ${crescent.age.toFixed(1)} hours after mean conjunction at sunset)` : ""}
        </p>
      )}

      <p className="text-xs text-[#8a7f6f] mt-3">
        Temple-era dates are reconstructions, normally ±1 day. Unknown ancient intercalation can shift a date by one month.
      </p>

      <button
        type="button"
        className="mt-3 text-xs text-[#7a2e2e] underline"
        onClick={() => setShowNotes((open) => !open)}
        aria-expanded={showNotes}
      >
        {showNotes ? "Hide calculation notes" : "How this date is calculated"}
      </button>
      {showNotes && (
        <div className="mt-2 text-xs text-[#5b5142] space-y-2 leading-relaxed">
          <p>
            Gregorian uses the 4/100/400 leap rule. Julian leaps every fourth year. Fixed Hebrew uses
            published molad and postponement arithmetic. Temple-era months use Jerusalem sunset after first
            crescent; {VISIBILITY_CRITERION} This is not a Yallop or Odeh sky-geometry test.
          </p>
          <p>
            The weekly cycle is never reset at a new moon. Civil mapping uses midnight; the biblical day is
            described from sunset to sunset. First-century Gregorian numbers are proleptic.
          </p>
          {view === "qumran" && (
            <p>
              Qumran schematic month {cursor.month} begins on {WEEKDAYS[qumranWeekday(cursor.month, 1)]}. {QUMRAN_NOTE}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
