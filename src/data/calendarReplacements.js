import { gregorianEasterSeason } from "@/lib/calendars/westernEaster";

/** Civil weekday names are the planetary week and the northern gods — not Hebrew numbers. */
export const WEEKDAY_NAMES = [
  { civil: "Sunday", short: "Su", numbered: "first day", namedFor: "the Sun", latin: "dies Solis", href: "/customs/weekdays" },
  { civil: "Monday", short: "Mo", numbered: "second day", namedFor: "the Moon", latin: "dies Lunae", href: "/customs/weekdays" },
  { civil: "Tuesday", short: "Tu", numbered: "third day", namedFor: "Tiw / Tyr (Mars)", latin: "dies Martis", href: "/customs/weekdays" },
  { civil: "Wednesday", short: "We", numbered: "fourth day", namedFor: "Woden / Odin (Mercury)", latin: "dies Mercurii", href: "/customs/weekdays" },
  { civil: "Thursday", short: "Th", numbered: "fifth day", namedFor: "Thor (Jupiter)", latin: "dies Iovis", href: "/customs/weekdays" },
  { civil: "Friday", short: "Fr", numbered: "sixth day", namedFor: "Frigg (Venus)", latin: "dies Veneris", href: "/customs/weekdays" },
  { civil: "Saturday", short: "Sb", numbered: "seventh day — the Sabbath", namedFor: "Saturn", latin: "dies Saturni", href: "/customs/weekdays" },
];

/** English month names are Rome’s gods, rites, leftover numbers, and deified Caesars. */
export const MONTH_NAMES = [
  { civil: "January", namedFor: "Janus", kind: "god", note: "Two-faced god of doorways. Rome opens the year here." },
  { civil: "February", namedFor: "Februa", kind: "rite", note: "Roman purification rites, not a biblical month name." },
  { civil: "March", namedFor: "Mars", kind: "god", note: "Roman god of war." },
  { civil: "April", namedFor: "Aprilis", kind: "disputed", note: "Etymology disputed (often aperire, “to open”). Not a Hebrew name." },
  { civil: "May", namedFor: "Maia", kind: "god", note: "Roman goddess of growth." },
  { civil: "June", namedFor: "Juno", kind: "god", note: "Queen of the Roman gods." },
  { civil: "July", namedFor: "Julius Caesar", kind: "caesar", note: "Renamed from Quintilis for a deified emperor." },
  { civil: "August", namedFor: "Augustus", kind: "caesar", note: "Renamed from Sextilis for a deified emperor." },
  { civil: "September", namedFor: "septem (seven)", kind: "number", note: "A leftover number from Rome’s older ten-month count — now month 9." },
  { civil: "October", namedFor: "octo (eight)", kind: "number", note: "A leftover number — now month 10." },
  { civil: "November", namedFor: "novem (nine)", kind: "number", note: "A leftover number — now month 11." },
  { civil: "December", namedFor: "decem (ten)", kind: "number", note: "A leftover number — now month 12." },
];

export const REPLACEMENT_CARDS = [
  {
    id: "sabbath",
    photoId: "sunday-sabbath",
    href: "/customs/sunday-sabbath",
    appointed: "The seventh day, blessed in Genesis 2 and commanded in Exodus 20",
    later: "Civil and church rest on Sunday — dies Solis, the day of the Sun",
    body: "On 7 March 321 Constantine ordered rest “on the venerable day of the Sun.” Laodicea canon 29 later forbade Christians to rest on the Sabbath. The commandment still names the seventh day. First-day gatherings in Acts 20:7 and 1 Corinthians 16:2 do not rename it.",
  },
  {
    id: "weekdays",
    photoId: "weekdays",
    href: "/customs/weekdays",
    appointed: "Numbered days: first day, second day… and the Sabbath",
    later: "Sunday, Monday, Tuesday… named for the Sun, Moon, Tiw, Woden, Thor, Frigg, and Saturn",
    body: "Rome’s planetary week (dies Solis through dies Saturni) became English weekday names. Exodus 23:13 warns Israel not to let the names of other gods be heard. Using a civil date is not a temple vow. The names are still those names.",
  },
  {
    id: "months",
    photoId: "months",
    href: "/customs/months",
    appointed: "Month 1 is Aviv/Abib. Other biblical names are agricultural (Ziv, Ethanim, Bul)",
    later: "January–December: Janus, Februa, Mars, Maia, Juno, Julius, Augustus, then leftover numbers",
    body: "Writing “March” is writing Mars. Writing “July” is writing a deified Caesar. Scripture’s first month is the spring month of the Exodus, not Janus.",
  },
  {
    id: "year-start",
    photoId: "new-year",
    href: "/customs/new-year",
    appointed: "“This month shall be unto you the beginning of months” — Aviv, in the spring (Exodus 12:2)",
    later: "1 January, the Kalends of Janus, with noise, vows, and drink",
    body: "The Julian civil year begins at January. Tertullian lists the nations’ New Year among festivals Christians should not share. Other later year-starts (25 March, 25 December) are also not Exodus 12.",
  },
  {
    id: "christmas",
    photoId: "christmas",
    href: "/customs/christmas",
    appointed: "The Gospels give no calendar date for the birth. Leviticus 23 never appoints 25 December",
    later: "Christmas on 25 December, listed on the Chronograph of 354 beside Natalis Invicti",
    body: "Midwinter rites were already old. Luke 2 has shepherds in the field at night. December 25 is a later Roman-church date, not a verse.",
  },
  {
    id: "easter",
    photoId: "easter",
    href: "/customs/easter",
    appointed: "Passover on Month 1, day 14, then Unleavened Bread (Leviticus 23:5–8)",
    later: "Easter, a moveable Sunday fixed by church computus after Nicaea",
    body: "Nicaea regulated how churches date Easter relative to the Jewish calendar. That reformed Christian festival dating. It did not rewrite Exodus 20 or move Passover off Nisan 14.",
  },
  {
    id: "day-boundary",
    photoId: "months",
    href: "/library?corpus=bible&book=Leviticus&chapter=23",
    appointed: "A sacred date can run from evening to evening (Leviticus 23:32)",
    later: "Civil midnight. The wall calendar changes the day while Jerusalem is still the previous evening",
    body: "The explorer keeps both visible. A biblical day is counted from sunset to the next sunset at Jerusalem. The civil date flips at midnight.",
    linkLabel: "Open Leviticus 23",
  },
];

export const REPLACEMENT_TIMELINE = [
  { period: "Torah", development: "Seventh-day Sabbath; Month 1 in Aviv; appointed times in Leviticus 23", who: "Scripture", why: "Worship and the agricultural year of Israel" },
  { period: "45 BCE", development: "Julian civil calendar; year begins at the Kalends of January", who: "Julius Caesar and Roman administration", why: "Regularize Rome’s civil year — not Israel’s festivals" },
  { period: "AD 321", development: "Civil rest on the venerable day of the Sun", who: "Constantine (Codex Justinianus 3.12.2)", why: "Imperial Sun-day rest for magistrates and city people" },
  { period: "AD 325", development: "Easter dating rule", who: "Council of Nicaea", why: "Coordinate church Pascha; not a rewrite of the seventh day" },
  { period: "Mid-4th century", development: "Canon against resting on the Sabbath", who: "Council of Laodicea, canon 29", why: "Church law honouring “the Lord’s Day” and forbidding “judaizing” rest" },
  { period: "AD 336–354", development: "25 December listed as Natalis Invicti and as a nativity date", who: "Chronograph of 354, Rome", why: "Roman civil-religious calendar, not a Gospel date" },
  { period: "1582 onward", development: "Ten days dropped; 4/100/400 leap rule", who: "Gregory XIII and adopting states", why: "Correct Julian drift. Weekdays were not renamed. Torah months were not rewritten." },
];

/** Later civil and church dates stored under Pagan traditions. Pagan and Christian are colored differently on the grid. */
export const CIVIL_HOLIDAYS = [
  {
    id: "kalends-janus",
    name: "Kalends of Janus",
    short: "Janus",
    kind: "pagan",
    month: 1,
    day: 1,
    href: "/customs/new-year",
    appointed: "Month 1 is Aviv, in the spring (Exodus 12:2)",
    later: "1 January — Kalends of Janus",
  },
  {
    id: "new-years-eve",
    name: "New Year's Eve",
    short: "Janus eve",
    kind: "pagan",
    month: 12,
    day: 31,
    href: "/customs/new-year",
    appointed: "Scripture does not turn the year at midnight of 31 December",
    later: "Janus’s door — the night before the Kalends",
  },
  {
    id: "valentines",
    name: "Valentine's Day",
    short: "Valentine",
    kind: "christian",
    month: 2,
    day: 14,
    href: "/customs/valentines",
    appointed: "Scripture never appoints a day of Cupid",
    later: "14 February — medieval St Valentine, later a lovers’ feast",
  },
  {
    id: "lupercalia",
    name: "Lupercalia",
    short: "Lupercalia",
    kind: "pagan",
    month: 2,
    day: 15,
    href: "/customs/valentines",
    appointed: "No Leviticus 23 feast falls on a Roman rite of Faunus",
    later: "15 February — Lupercalia in honour of Faunus / Lupercus",
  },
  {
    id: "lady-day",
    name: "Lady Day",
    short: "Lady Day",
    kind: "christian",
    month: 3,
    day: 25,
    href: "/customs/new-year",
    appointed: "Exodus 12 sets the beginning of months in Aviv, not 25 March",
    later: "25 March — later Christian year-start and incarnation date in some computists",
  },
  {
    id: "may-day",
    name: "May Day",
    short: "May Day",
    kind: "pagan",
    month: 5,
    day: 1,
    href: "/customs/may-day",
    appointed: "Leviticus 23 never appoints the first of May or a maypole",
    later: "1 May — European green-tree / maypole spring folk",
  },
  {
    id: "halloween",
    name: "Halloween / Samhain",
    short: "Halloween",
    kind: "pagan",
    month: 10,
    day: 31,
    href: "/customs/halloween",
    appointed: "Consulting the dead is forbidden (Deuteronomy 18)",
    later: "31 October — folk night of the dead; Samhain is the Gaelic year-turning",
  },
  {
    id: "all-hallows-eve",
    name: "All Hallows' Eve",
    short: "All Hallows' Eve",
    kind: "christian",
    month: 10,
    day: 31,
    href: "/customs/halloween",
    appointed: "Scripture does not appoint a vigil of all saints on 31 October",
    later: "Eve of the Western All Saints feast",
  },
  {
    id: "all-saints",
    name: "All Saints",
    short: "All Saints",
    kind: "christian",
    month: 11,
    day: 1,
    href: "/customs/halloween",
    appointed: "No Leviticus 23 feast of all saints",
    later: "1 November — medieval Western All Saints",
  },
  {
    id: "saturnalia",
    name: "Saturnalia",
    short: "Saturnalia",
    kind: "pagan",
    month: 12,
    day: 17,
    throughDay: 23,
    href: "/customs/christmas",
    appointed: "Tertullian already warned Christians not to keep Saturnalia",
    later: "17–23 December — feast of Saturn, classically from the 17th",
  },
  {
    id: "natalis-invicti",
    name: "Natalis Invicti",
    short: "Unconquered Sun",
    kind: "pagan",
    month: 12,
    day: 25,
    href: "/customs/christmas",
    appointed: "The Gospels give no nativity date. Leviticus 23 never appoints 25 December",
    later: "Birthday of the Unconquered Sun on the Chronograph of 354",
  },
  {
    id: "christmas",
    name: "Christmas",
    short: "Christmas",
    kind: "christian",
    month: 12,
    day: 25,
    href: "/customs/christmas",
    appointed: "The Gospels give no calendar date for the birth",
    later: "25 December as a church nativity feast, listed beside Natalis Invicti",
  },
];

function sameCivilDay(parts, month, day, throughDay) {
  if (parts.month !== month) return false;
  if (throughDay) return parts.day >= day && parts.day <= throughDay;
  return parts.day === day;
}

function easterSeasonHolidays(year) {
  if (year < 1583) return [];
  const season = gregorianEasterSeason(year);
  return [
    {
      id: "mardi-gras",
      name: "Mardi Gras / Carnival",
      short: "Mardi Gras",
      kind: "christian",
      ...season.mardiGras,
      href: "/customs/lent-carnival",
      appointed: "The commanded affliction of soul is the Day of Atonement, not a binge before Lent",
      later: "Carnival / Mardi Gras — licensed excess on the church calendar",
    },
    {
      id: "ash-wednesday",
      name: "Ash Wednesday",
      short: "Ash Wednesday",
      kind: "christian",
      ...season.ashWednesday,
      href: "/customs/lent-carnival",
      appointed: "Matthew 6 forbids disfiguring the face to be seen fasting",
      later: "Ashes to open a church-made Lenten fast before Easter",
    },
    {
      id: "easter",
      name: "Easter Sunday",
      short: "Easter",
      kind: "christian",
      ...season.easter,
      href: "/customs/easter",
      appointed: "Passover is Month 1, day 14 — not a computed Sunday",
      later: "Western Easter by church computus after Nicaea",
    },
  ];
}

export function civilHolidaysOn(parts, { moveable = true } = {}) {
  if (!parts?.month || !parts?.day) return [];
  const fixed = CIVIL_HOLIDAYS.filter((h) => sameCivilDay(parts, h.month, h.day, h.throughDay));
  if (!moveable || !parts.year) return fixed;
  return [...fixed, ...easterSeasonHolidays(parts.year).filter((h) => h.month === parts.month && h.day === parts.day)];
}

const EVENT = {
  sunday: {
    id: "sunday",
    title: "This is the day of the Sun",
    appointed: "First day of the week — not the Sabbath of Exodus 20",
    later: "Civil and church rest on dies Solis",
    href: "/customs/sunday-sabbath",
  },
  sabbath: {
    id: "sabbath-day",
    title: "This is the seventh day",
    appointed: "The Sabbath commanded at Sinai",
    later: "English still names it Saturday, for Saturn",
    href: "/customs/sunday-sabbath",
  },
};

export function overlaysForCivilDate({ year, month, day }, weekdayIndex, options) {
  const weekday = WEEKDAY_NAMES[weekdayIndex];
  const monthMeta = MONTH_NAMES[month - 1];
  const holidays = civilHolidaysOn({ year, month, day }, options);
  const events = holidays.map((h) => ({
    id: h.id,
    title: h.name,
    appointed: h.appointed,
    later: h.later,
    href: h.href,
    kind: h.kind,
  }));
  if (weekdayIndex === 0) events.unshift(EVENT.sunday);
  if (weekdayIndex === 6) events.unshift(EVENT.sabbath);
  return { weekday, month: monthMeta, events, holidays };
}

function nextCivil(from, month, day) {
  const past = from.month > month || (from.month === month && from.day > day);
  return { year: from.year + (past ? 1 : 0), month, day };
}

export function overlayJumps(from) {
  const season = gregorianEasterSeason(from.year);
  const easterPast = season.easter.month < from.month
    || (season.easter.month === from.month && season.easter.day < from.day);
  const nextSeason = easterPast ? gregorianEasterSeason(from.year + 1) : season;
  return [
    { id: "janus", name: "Janus’s New Year", kind: "pagan", gregorian: nextCivil(from, 1, 1) },
    { id: "lupercalia", name: "Lupercalia", kind: "pagan", gregorian: nextCivil(from, 2, 15) },
    { id: "may-day", name: "May Day", kind: "pagan", gregorian: nextCivil(from, 5, 1) },
    { id: "halloween", name: "Halloween", kind: "pagan", gregorian: nextCivil(from, 10, 31) },
    { id: "saturnalia", name: "Saturnalia", kind: "pagan", gregorian: nextCivil(from, 12, 17) },
    { id: "valentines", name: "Valentine's Day", kind: "christian", gregorian: nextCivil(from, 2, 14) },
    { id: "mardi-gras", name: "Mardi Gras", kind: "christian", gregorian: nextSeason.mardiGras },
    { id: "easter", name: "Easter", kind: "christian", gregorian: nextSeason.easter },
    { id: "all-saints", name: "All Saints", kind: "christian", gregorian: nextCivil(from, 11, 1) },
    { id: "christmas", name: "Christmas", kind: "christian", gregorian: nextCivil(from, 12, 25) },
  ];
}
