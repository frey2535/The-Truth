import assert from "node:assert/strict";
import {
  isGregorianLeap,
  isJulianLeap,
  gregorianToJd,
  julianToJd,
  jdToGregorian,
  jdToJulian,
  weekdayFromJd,
  WEEKDAYS,
} from "../src/lib/calendars/civil.js";
import {
  hebrewToGregorian,
  gregorianToHebrew,
  hebrewMonthDays,
  hebrewYearMonths,
  isHebrewLeapYear,
} from "../src/lib/calendars/hebrew.js";
import { templeMonthStartsAround, gregorianToTemple } from "../src/lib/calendars/templeEra.js";
import { jerusalemSunTimes } from "../src/lib/calendars/jerusalemSun.js";
import { qumranYearDays, qumranWeekday, QUMRAN_MONTH_LENGTHS } from "../src/lib/calendars/qumran.js";
import { appointedTimesForHebrew } from "../src/lib/calendars/appointedTimes.js";

assert.equal(isGregorianLeap(1900), false);
assert.equal(isGregorianLeap(2000), true);
assert.equal(isGregorianLeap(2100), false);
assert.equal(isJulianLeap(1900), true);
assert.equal(isJulianLeap(2000), true);
assert.equal(isJulianLeap(1901), false);

const g = jdToGregorian(gregorianToJd(2024, 10, 3));
assert.deepEqual(g, { year: 2024, month: 10, day: 3 });

const rh = hebrewToGregorian(5785, 7, 1);
assert.equal(rh.year, 2024);
assert.equal(rh.month, 10);
assert.equal(rh.day, 3);

const back = gregorianToHebrew(2024, 10, 3);
assert.equal(back.year, 5785);
assert.equal(back.month, 7);
assert.equal(back.day, 1);

assert.equal(isHebrewLeapYear(5784), true);
assert.equal(hebrewYearMonths(5784), 13);

for (let y = 5780; y <= 5790; y += 1) {
  const months = hebrewYearMonths(y);
  for (let m = 1; m <= months; m += 1) {
    const len = hebrewMonthDays(y, m);
    assert.ok(len === 29 || len === 30, `Hebrew ${y}/${m} length ${len}`);
  }
}

const jdFri = gregorianToJd(2024, 10, 4);
assert.equal(WEEKDAYS[weekdayFromJd(jdFri)], "Friday");
const nextMoon = gregorianToJd(2024, 11, 1);
assert.equal((weekdayFromJd(nextMoon) - weekdayFromJd(jdFri) + 70) % 7, (nextMoon - jdFri) % 7);

const jul = jdToJulian(gregorianToJd(2024, 10, 3));
assert.equal(jul.year, 2024);
assert.ok(jul.month === 9 && jul.day === 20);

const starts = templeMonthStartsAround(2024);
starts.forEach((row) => {
  assert.ok(row.length === 29 || row.length === 30, `Temple month length ${row.length}`);
});
const t = gregorianToTemple(2024, 4, 23);
assert.ok(t.month >= 1 && t.month <= 13);
assert.ok(t.day >= 1 && t.day <= 30);

const oct4 = julianToJd(1582, 10, 4);
const oct15 = gregorianToJd(1582, 10, 15);
assert.equal(Math.floor(oct15) - Math.floor(oct4), 1);
assert.equal((weekdayFromJd(oct15) - weekdayFromJd(oct4) + 7) % 7, 1);

assert.equal(hebrewYearMonths(5784), 13);
assert.equal(hebrewMonthDays(5784, 13), 29);
assert.ok(appointedTimesForHebrew(1, 14).some((t) => t.id === "passover"));

assert.equal(qumranYearDays(), 364);
assert.equal(QUMRAN_MONTH_LENGTHS.length, 12);
assert.equal(qumranWeekday(1, 1), 3);

const sun = jerusalemSunTimes(2026, 8, 30);
assert.ok(sun.sunrise > 5 && sun.sunrise < 7, `sunrise ${sun.sunrise}`);
assert.ok(sun.sunset > 18 && sun.sunset < 20, `sunset ${sun.sunset}`);
assert.ok(sun.sunset > sun.sunrise);

console.log("calendar tests passed");
console.log("1 Tishri 5785 =", rh);
console.log("15 Nisan 5784 =", hebrewToGregorian(5784, 1, 15));
console.log("Julian for 3 Oct 2024 Gregorian =", jul);
