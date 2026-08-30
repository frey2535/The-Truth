/**
 * Fixed (calculated) Hebrew calendar.
 * Arithmetic is the published molad + postponement calendar, not a private reconstruction.
 * Month 1 = Nisan. The numbered year begins on Tishri 1.
 * Source model: public-domain Fourmilab / Dershowitz–Reingold elapsed-day formulas.
 */

import { gregorianToJd, jdToGregorian } from "./civil.js";

const HEBREW_EPOCH = 347995.5;

export const HEBREW_MONTHS = [
  { n: 1, name: "Nisan" },
  { n: 2, name: "Iyyar" },
  { n: 3, name: "Sivan" },
  { n: 4, name: "Tammuz" },
  { n: 5, name: "Av" },
  { n: 6, name: "Elul" },
  { n: 7, name: "Tishri" },
  { n: 8, name: "Cheshvan" },
  { n: 9, name: "Kislev" },
  { n: 10, name: "Tevet" },
  { n: 11, name: "Shevat" },
  { n: 12, name: "Adar" },
  { n: 13, name: "Adar II" },
];

export function isHebrewLeapYear(year) {
  return (7 * year + 1) % 19 < 7;
}

export function hebrewYearMonths(year) {
  return isHebrewLeapYear(year) ? 13 : 12;
}

function delay1(year) {
  const months = Math.floor((235 * year - 234) / 19);
  const parts = 12084 + 13753 * months;
  let day = months * 29 + Math.floor(parts / 25920);
  if ((3 * (day + 1)) % 7 < 3) day += 1;
  return day;
}

function delay2(year) {
  const last = delay1(year - 1);
  const present = delay1(year);
  const next = delay1(year + 1);
  if (next - present === 356) return 2;
  if (present - last === 382) return 1;
  return 0;
}

export function hebrewToJd(year, month, day) {
  const months = hebrewYearMonths(year);
  let jd = HEBREW_EPOCH + delay1(year) + delay2(year) + day + 1;
  if (month < 7) {
    for (let mon = 7; mon <= months; mon += 1) jd += hebrewMonthDays(year, mon);
    for (let mon = 1; mon < month; mon += 1) jd += hebrewMonthDays(year, mon);
  } else {
    for (let mon = 7; mon < month; mon += 1) jd += hebrewMonthDays(year, mon);
  }
  return jd;
}

export function hebrewYearDays(year) {
  return hebrewToJd(year + 1, 7, 1) - hebrewToJd(year, 7, 1);
}

export function hebrewMonthDays(year, month) {
  if (month === 2 || month === 4 || month === 6 || month === 10 || month === 13) return 29;
  if (month === 12 && !isHebrewLeapYear(year)) return 29;
  if (month === 8 && hebrewYearDays(year) % 10 !== 5) return 29;
  if (month === 9 && hebrewYearDays(year) % 10 === 3) return 29;
  return 30;
}

export function jdToHebrew(jd) {
  const approx = Math.floor((jd - HEBREW_EPOCH) * 98496) / 35975351 + 1;
  let year = Math.floor(approx) - 1;
  while (jd >= hebrewToJd(year + 1, 7, 1)) year += 1;
  const startMonth = jd < hebrewToJd(year, 1, 1) ? 7 : 1;
  let month = startMonth;
  while (jd > hebrewToJd(year, month, hebrewMonthDays(year, month))) month += 1;
  const day = Math.floor(jd + 0.5) - Math.floor(hebrewToJd(year, month, 1) + 0.5) + 1;
  return { year, month, day };
}

export function gregorianToHebrew(year, month, day) {
  return jdToHebrew(gregorianToJd(year, month, day));
}

export function hebrewToGregorian(year, month, day) {
  return jdToGregorian(hebrewToJd(year, month, day));
}

export function addHebrewMonths(year, month, delta) {
  let y = year;
  let m = month + delta;
  while (m > hebrewYearMonths(y)) {
    m -= hebrewYearMonths(y);
    y += 1;
  }
  while (m < 1) {
    y -= 1;
    m += hebrewYearMonths(y);
  }
  return { year: y, month: m };
}

export function hebrewMonthName(year, month) {
  if (month === 12 && isHebrewLeapYear(year)) return "Adar I";
  return HEBREW_MONTHS.find((item) => item.n === month)?.name || `Month ${month}`;
}
