import { gregorianToJd, jdToGregorian } from "./civil.js";

/**
 * Western (Gregorian) Easter Sunday.
 * Meeus/Jones/Butcher anonymous Gregorian algorithm.
 * This dates later church practice. It is not a Leviticus 23 calculation.
 */
export function gregorianEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

export function isGregorianEaster(year, month, day) {
  const easter = gregorianEaster(year);
  return easter.month === month && easter.day === day;
}

/** Mardi Gras is the Tuesday before Ash Wednesday; Ash Wednesday is 46 days before Easter. */
export function gregorianEasterSeason(year) {
  const easter = gregorianEaster(year);
  const easterJd = gregorianToJd(easter.year, easter.month, easter.day);
  return {
    easter,
    mardiGras: jdToGregorian(easterJd - 47),
    ashWednesday: jdToGregorian(easterJd - 46),
  };
}
