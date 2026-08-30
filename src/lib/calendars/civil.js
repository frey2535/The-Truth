/**
 * Gregorian and Julian day arithmetic.
 * Gregorian leap rule is the 4 / 100 / 400 civil rule.
 * Julian here is the historical Roman solar calendar (leap day every fourth year).
 */

export function isGregorianLeap(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function isJulianLeap(year) {
  return year % 4 === 0;
}

/** Julian Day Number at 0h UTC for a Gregorian civil date. */
export function gregorianToJd(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Historical Julian calendar date to Julian Day Number at 0h UTC. */
export function julianToJd(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

export function jdToGregorian(jd) {
  const j = Math.floor(jd + 0.5);
  const a = j + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function jdToJulian(jd) {
  const j = Math.floor(jd + 0.5);
  const b = 0;
  const c = j + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

/** 0 = Sunday … 6 = Saturday. Continuous through new moons. */
export function weekdayFromJd(jd) {
  return ((Math.floor(jd + 1.5) % 7) + 7) % 7;
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function gregorianMonthLength(year, month) {
  return [31, isGregorianLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function addGregorianMonths(year, month, delta) {
  const i = year * 12 + (month - 1) + delta;
  return { year: Math.floor(i / 12), month: (i % 12 + 12) % 12 + 1 };
}

export function julianMonthLength(year, month) {
  return [31, isJulianLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function addJulianMonths(year, month, delta) {
  const i = year * 12 + (month - 1) + delta;
  return { year: Math.floor(i / 12), month: (i % 12 + 12) % 12 + 1 };
}
