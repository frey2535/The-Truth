/**
 * Temple-era lunisolar reconstruction (Jerusalem).
 * Strong reconstruction — not Scripture and not a surviving court ledger.
 *
 * Rules:
 * - Day begins at local sunset.
 * - Month begins at the sunset after first credible waxing-crescent visibility.
 * - Months are 29 or 30 days; a month that is not ended on day 29 ends after day 30.
 * - Week is continuous; it is never reset at new moon.
 * - Month 1 is the first crescent whose 14th day falls on or after the northern vernal equinox.
 *
 * Visibility criterion (displayed to the reader): simplified age-at-sunset test
 * after mean conjunction (synodic month 29.530588853 d). Not Yallop/Odeh full sky geometry.
 */

import { gregorianToJd, jdToGregorian, weekdayFromJd } from "./civil.js";
import { jerusalemSunTimes } from "./jerusalemSun.js";

const SYNODIC = 29.530588853;
/** Mean conjunction near J2000 used as a lunation epoch (JD). */
const MEAN_NEW_MOON = 2451550.09765;

export const VISIBILITY_CRITERION =
  "Simplified age-at-Jerusalem-sunset after mean conjunction. The moon is invisible at conjunction; first crescent is later. Actual ancient declarations could differ by one day.";

function meanConjunctionJd(lunation) {
  return MEAN_NEW_MOON + lunation * SYNODIC;
}

function lunationAt(jd) {
  return Math.floor((jd - MEAN_NEW_MOON) / SYNODIC);
}

function ageHoursAtJerusalemSunset(greg, conjunctionJd) {
  const sun = jerusalemSunTimes(greg.year, greg.month, greg.day);
  const sunsetHours = sun.sunsetUtc ?? 15.5;
  const sunsetJd = gregorianToJd(greg.year, greg.month, greg.day) - 0.5 + sunsetHours / 24;
  return (sunsetJd - conjunctionJd) * 24;
}

function crescentOnEvening(greg, conjunctionJd) {
  const age = ageHoursAtJerusalemSunset(greg, conjunctionJd);
  if (age < 15) return { visible: false, confidence: "not visible", age };
  if (age < 20) return { visible: true, confidence: "low", age };
  if (age < 30) return { visible: true, confidence: "medium", age };
  if (age < 48) return { visible: true, confidence: "high", age };
  return { visible: false, confidence: "too old for first crescent", age };
}

function firstVisibleEvening(conjunctionJd) {
  const start = jdToGregorian(conjunctionJd);
  for (let i = 0; i < 4; i += 1) {
    const jd = gregorianToJd(start.year, start.month, start.day) + i;
    const greg = jdToGregorian(jd);
    const c = crescentOnEvening(greg, conjunctionJd);
    if (c.visible) {
      return { jd, greg, ...c, conjunctionJd };
    }
  }
  const fallbackJd = Math.floor(conjunctionJd + 1.2);
  return {
    jd: fallbackJd,
    greg: jdToGregorian(fallbackJd),
    visible: true,
    confidence: "forced 30-hour fallback",
    age: 30,
    conjunctionJd,
  };
}

function monthStartFromLunation(lunation) {
  return firstVisibleEvening(meanConjunctionJd(lunation));
}

function vernalEquinoxJd(year) {
  return gregorianToJd(year, 3, 20);
}

function nisanLunationForYear(year) {
  const target = vernalEquinoxJd(year);
  let lun = lunationAt(target - 20);
  for (let i = 0; i < 8; i += 1) {
    const start = monthStartFromLunation(lun);
    const day14 = start.jd + 13;
    if (day14 >= target - 0.2) return lun;
    lun += 1;
  }
  return lun;
}

export function templeMonthStartsAround(year) {
  const nisanLun = nisanLunationForYear(year);
  const starts = [];
  for (let i = -1; i < 14; i += 1) {
    const lun = nisanLun + i;
    const start = monthStartFromLunation(lun);
    const next = monthStartFromLunation(lun + 1);
    let length = Math.round(next.jd - start.jd);
    if (length < 29) length = 29;
    if (length > 30) length = 30;
    const biblicalMonth = i < 0 ? 12 + (nisanLunationForYear(year - 1) === nisanLun - 1 ? 1 : 0) : i + 1;
    starts.push({
      lunation: lun,
      startJd: start.jd,
      length,
      biblicalMonth: i >= 0 ? i + 1 : biblicalMonth,
      year: i >= 0 ? year : year - 1,
      visibility: start,
    });
  }
  return starts;
}

export function jdToTemple(jd, yearHint) {
  const g = jdToGregorian(jd);
  const year = yearHint || g.year;
  const months = templeMonthStartsAround(year).concat(templeMonthStartsAround(year - 1), templeMonthStartsAround(year + 1));
  const hit = months.find((m) => jd >= m.startJd && jd < m.startJd + m.length);
  if (!hit) {
    return {
      year: g.year,
      month: 0,
      day: 0,
      label: "Uncertain reconstruction",
      evidence: "disputed",
    };
  }
  return {
    year: hit.year,
    month: hit.biblicalMonth,
    day: Math.floor(jd - hit.startJd) + 1,
    length: hit.length,
    startJd: hit.startJd,
    visibility: hit.visibility,
    evidence: "strong_reconstruction",
  };
}

export function gregorianToTemple(year, month, day) {
  return jdToTemple(gregorianToJd(year, month, day), year);
}

export function templeMonthGrid(year, biblicalMonth) {
  const months = templeMonthStartsAround(year);
  const hit = months.find((m) => m.year === year && m.biblicalMonth === biblicalMonth);
  if (!hit) return null;
  const days = [];
  for (let d = 1; d <= hit.length; d += 1) {
    const jd = hit.startJd + d - 1;
    days.push({
      day: d,
      jd,
      gregorian: jdToGregorian(jd),
      weekday: weekdayFromJd(jd),
    });
  }
  return { ...hit, days };
}

export function addTempleMonths(year, month, delta) {
  let y = year;
  let m = month + delta;
  while (m > 13) {
    m -= 13;
    y += 1;
  }
  while (m < 1) {
    y -= 1;
    m += 13;
  }
  const around = templeMonthStartsAround(y);
  const exists = around.some((row) => row.year === y && row.biblicalMonth === m);
  if (!exists && m === 13) {
    return addTempleMonths(y, 1, delta > 0 ? 0 : -1);
  }
  return { year: y, month: exists ? m : Math.min(m, 12) };
}
