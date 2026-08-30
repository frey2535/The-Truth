/**
 * Qumran 364-day schematic year.
 * Ancient sectarian alternative. Not the calendar of Moses, the Temple, or Jesus.
 * Surviving texts fix festivals to weekdays in a 52-week year of four 91-day quarters.
 * The year begins on Wednesday in the usual reconstruction. No uncontested epoch
 * converts "today" onto this year, so this module draws the scheme — it does not
 * claim a certain Qumran date for a Gregorian day.
 */

export const QUMRAN_NOTE =
  "364-day year: four quarters of 91 days (30 + 30 + 31). Festivals lock to the same weekdays. Year begins Wednesday in the surviving scheme. A 364-day year is shorter than the solar year; the texts do not give one agreed correction for seasonal drift.";

export const QUMRAN_QUARTERS = [
  { season: "Spring", months: ["Month 1 (30)", "Month 2 (30)", "Month 3 (31)"] },
  { season: "Summer", months: ["Month 4 (30)", "Month 5 (30)", "Month 6 (31)"] },
  { season: "Autumn", months: ["Month 7 (30)", "Month 8 (30)", "Month 9 (31)"] },
  { season: "Winter", months: ["Month 10 (30)", "Month 11 (30)", "Month 12 (31)"] },
];

export const QUMRAN_MONTH_LENGTHS = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];

export function qumranYearDays() {
  return QUMRAN_MONTH_LENGTHS.reduce((sum, n) => sum + n, 0);
}

/** Schematic weekday of Month/day. Year day 1 is Wednesday. */
export function qumranWeekday(month, day) {
  let offset = day - 1;
  for (let m = 1; m < month; m += 1) offset += QUMRAN_MONTH_LENGTHS[m - 1] || 0;
  return (3 + offset) % 7;
}

export function qumranFestivalsOn(month, day) {
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    qumranWeekday(month, day)
  ];
  return QUMRAN_FESTIVALS.filter((f) => {
    const m = f.name.match(/Month (\d+) day (\d+)/);
    if (!m) return f.weekday === weekday && /Weeks/.test(f.name);
    return Number(m[1]) === month && Number(m[2]) === day;
  });
}

export const QUMRAN_FESTIVALS = [
  { name: "New Year / Month 1 day 1", weekday: "Wednesday" },
  { name: "Passover (Month 1 day 14)", weekday: "Tuesday" },
  { name: "Wave sheaf (Month 1 day 26 in the 364-day scheme)", weekday: "Sunday" },
  { name: "Weeks", weekday: "Sunday" },
  { name: "Trumpets (Month 7 day 1)", weekday: "Wednesday" },
  { name: "Day of Atonement (Month 7 day 10)", weekday: "Friday" },
  { name: "Tabernacles (Month 7 day 15)", weekday: "Wednesday" },
];
