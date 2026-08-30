import { weekdayFromJd } from "./civil.js";

const SABBATH = 6;

export function appointedTimesForHebrew(month, day, { shavuotOn } = {}) {
  const tags = [];
  if (day === 1) tags.push({ id: "new-moon", name: "New Moon", evidence: "scripture" });
  if (month === 1 && day === 14) tags.push({ id: "passover", name: "Passover", evidence: "scripture" });
  if (month === 1 && day >= 15 && day <= 21) {
    tags.push({ id: "unleavened", name: "Unleavened Bread", evidence: "scripture" });
  }
  if (month === 1 && day === 16) {
    tags.push({
      id: "firstfruits-16",
      name: "Firstfruits (Nisan 16 reading)",
      evidence: "disputed",
    });
  }
  if (month === 7 && day === 1) tags.push({ id: "trumpets", name: "Trumpets", evidence: "scripture" });
  if (month === 7 && day === 10) tags.push({ id: "atonement", name: "Day of Atonement", evidence: "scripture" });
  if (month === 7 && day >= 15 && day <= 21) {
    tags.push({ id: "tabernacles", name: "Tabernacles", evidence: "scripture" });
  }
  if (month === 7 && day === 22) {
    tags.push({ id: "eighth", name: "Eighth-day assembly", evidence: "scripture" });
  }
  if (shavuotOn && month === shavuotOn.month && day === shavuotOn.day) {
    tags.push({ id: "weeks", name: "Weeks / Shavuot", evidence: "disputed" });
  }
  return tags;
}

export function isSabbathJd(jd) {
  return weekdayFromJd(jd) === SABBATH;
}

/** Rabbinic count: fifty days from Nisan 16. */
export function shavuotFromNisan16(year, hebrewToJd) {
  const start = hebrewToJd(year, 1, 16);
  return start + 49;
}

/** Sunday-during-Unleavened-Bread count: fifty days from that Sunday. */
export function shavuotFromSundayInUnleavened(year, hebrewToJd, weekdayFromJdFn) {
  for (let d = 15; d <= 21; d += 1) {
    const jd = hebrewToJd(year, 1, d);
    if (weekdayFromJdFn(jd) === 0) return jd + 49;
  }
  return null;
}
