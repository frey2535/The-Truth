export const EVIDENCE_LABELS = [
  { id: "scripture", label: "Scripture", meaning: "Explicitly stated in the biblical text." },
  { id: "primary", label: "Primary historical evidence", meaning: "Reported by an ancient source." },
  { id: "strong_reconstruction", label: "Strong reconstruction", meaning: "Best fit to incomplete historical and astronomical evidence." },
  { id: "later_tradition", label: "Later tradition", meaning: "Preserved later but not independently established for the biblical period." },
  { id: "disputed", label: "Disputed", meaning: "Credible interpretations differ." },
  { id: "unsupported", label: "Unsupported", meaning: "The necessary evidence has not been produced." },
];

export const CALENDAR_SYSTEMS = [
  {
    id: "temple",
    label: "Temple-era reconstruction",
    short: "Observational lunisolar, Jerusalem",
    usedThen: "Jewish worship in the time of Jesus, in its first-century form — not this page's exact algorithm.",
  },
  {
    id: "hebrew",
    label: "Fixed Hebrew",
    short: "Calculated lunisolar used today",
    usedThen: "Not in its completed modern form.",
  },
  {
    id: "gregorian",
    label: "Gregorian",
    short: "Modern international civil calendar",
    usedThen: "No. A later reform of the Julian civil calendar.",
  },
  {
    id: "julian",
    label: "Julian",
    short: "Roman civil calendar after 45 BCE",
    usedThen: "Yes, for Roman officials.",
  },
  {
    id: "qumran",
    label: "Qumran 364-day",
    short: "Ancient sectarian alternative",
    usedThen: "A real Qumran system. Not shown to be the calendar of Jesus or the Temple.",
  },
];

export const COMPARISON_ENTRIES = [
  {
    id: "israelite",
    label: "Early Israelite agricultural calendar",
    evidence: "scripture",
    body: "Scripture ties Month 1 to Aviv and the grain season, and appointed times to lunar months. It does not supply a complete written algorithm.",
  },
  {
    id: "babylonian",
    label: "Babylonian calendar",
    evidence: "primary",
    body: "A lunisolar civil calendar. Later Jewish month names such as Nisan and Adar entered usage through imperial and cultural contact. That did not rewrite Leviticus 23.",
  },
  {
    id: "seleucid",
    label: "Seleucid / Macedonian calendar",
    evidence: "primary",
    body: "Josephus, stored in this app, pairs Hebrew Nisan with Macedonian Xanthicus. Greek month names were a parallel civil vocabulary, not a replacement of the Jewish festival months.",
  },
  {
    id: "egyptian",
    label: "Egyptian / Alexandrian calendar",
    evidence: "later_tradition",
    body: "A solar civil year used in Egypt and later Alexandria. It is a neighboring imperial system, not the Temple festival calendar.",
  },
  {
    id: "samaritan",
    label: "Samaritan calendar",
    evidence: "later_tradition",
    body: "Samaritan communities preserved their own lunisolar reckoning. It is a related but separate tradition and is not treated here as the Jerusalem Temple calendar.",
  },
  {
    id: "karaite",
    label: "Karaite observational calendar",
    evidence: "later_tradition",
    body: "A later Jewish practice that emphasizes crescent sighting and, in some communities, agricultural signs. It is not a first-century Temple ledger.",
  },
  {
    id: "enoch",
    label: "Enoch / Jubilees calendar traditions",
    evidence: "primary",
    body: "1 Enoch and Jubilees, stored in this app, describe a 364-day year. That scheme is related to Qumran practice. It is not shown to be the calendar of Moses, the Temple, or Jesus.",
  },
  {
    id: "computus",
    label: "Early Christian computus",
    evidence: "later_tradition",
    body: "Church methods for dating Easter after the first century, including the Council of Nicaea’s Easter rule. They reformed Christian festival dating, not the Sabbath and not the biblical month numbers. See Pagan traditions for the Easter dossier.",
    href: "/customs",
  },
];

export const COMPARE_ROWS = [
  ["System", "Observational lunisolar", "Calculated lunisolar", "Calculated solar"],
  ["Day begins", "Sunset", "Sunset", "Midnight"],
  ["Month begins", "First credible crescent and authoritative declaration", "Fixed calculation", "Fixed civil date"],
  ["Month length", "29 or 30 days", "29 or 30 days", "28–31 days"],
  ["Normal year", "About 354 days", "353–355 days", "365 days"],
  ["Leap adjustment", "Thirteenth month when seasonally required", "7 leap years per 19-year cycle", "Leap day under the 4/100/400 rule"],
  ["First biblical month", "Aviv/Nisan", "Nisan", "Not applicable"],
  ["Numbered year begins", "More than one ancient reckoning existed", "Tishri 1", "January 1"],
  ["Week", "Continuous seven-day cycle", "Continuous seven-day cycle", "Continuous seven-day cycle"],
  ["Used by Jesus?", "Yes, in its first-century form", "Not in its completed modern form", "No"],
  ["Used by Roman officials then?", "For Jewish worship they used the Jewish calendar", "No", "Julian, not Gregorian"],
];

export const BIBLICAL_MONTHS = [
  { n: 1, jewish: "Nisan", earlier: "Aviv/Abib", season: "March–April", verse: "Exodus 12:2; 13:4; Esther 3:7" },
  { n: 2, jewish: "Iyyar", earlier: "Ziv (KJV: Zif)", season: "April–May", verse: "1 Kings 6:1" },
  { n: 3, jewish: "Sivan", earlier: "Named in Esther", season: "May–June", verse: "Esther 8:9" },
  { n: 4, jewish: "Tammuz", earlier: "Babylonian-derived name", season: "June–July", verse: "Not used as a month name in the Hebrew Bible" },
  { n: 5, jewish: "Av", earlier: "Babylonian-derived name", season: "July–August", verse: "Not used as a month name in the Hebrew Bible" },
  { n: 6, jewish: "Elul", earlier: "Named in Nehemiah", season: "August–September", verse: "Nehemiah 6:15" },
  { n: 7, jewish: "Tishri", earlier: "Ethanim", season: "September–October", verse: "1 Kings 8:2" },
  { n: 8, jewish: "Cheshvan / Marcheshvan", earlier: "Bul", season: "October–November", verse: "1 Kings 6:38" },
  { n: 9, jewish: "Kislev", earlier: "Chisleu in the KJV", season: "November–December", verse: "Zechariah 7:1; Nehemiah 1:1" },
  { n: 10, jewish: "Tevet", earlier: "Tebeth in the KJV", season: "December–January", verse: "Esther 2:16" },
  { n: 11, jewish: "Shevat", earlier: "Sebat in the KJV", season: "January–February", verse: "Zechariah 1:7" },
  { n: 12, jewish: "Adar", earlier: "Named in Esther and Ezra", season: "February–March", verse: "Esther 3:7; Ezra 6:15" },
  { n: 13, jewish: "Adar II", earlier: "Intercalated month", season: "When required", verse: "Not numbered as a thirteenth month in the Torah" },
];

export const APPOINTED_TIMES = [
  { name: "Sabbath", when: "Every seventh day", text: "Exodus 20:8–11" },
  { name: "New Moon", when: "Day 1 of each lunar month", text: "Numbers 28:11–15" },
  { name: "Passover", when: "Month 1, day 14", text: "Leviticus 23:5" },
  { name: "Unleavened Bread", when: "Month 1, days 15–21", text: "Leviticus 23:6–8" },
  { name: "Firstfruits", when: "During Unleavened Bread", text: "Leviticus 23:9–14" },
  { name: "Weeks / Shavuot", when: "Count 50 days", text: "Leviticus 23:15–21" },
  { name: "Trumpets", when: "Month 7, day 1", text: "Leviticus 23:23–25" },
  { name: "Day of Atonement", when: "Month 7, day 10", text: "Leviticus 23:26–32" },
  { name: "Tabernacles", when: "Month 7, days 15–21", text: "Leviticus 23:33–43" },
  { name: "Eighth-day assembly", when: "Month 7, day 22", text: "Leviticus 23:36, 39" },
];

export const SCRIPTURE_POINTS = [
  { ref: "Genesis 1:14", text: "The heavenly lights mark days, years, seasons, and appointed times." },
  { ref: "Psalm 104:19", text: "The moon marks appointed times." },
  { ref: "Exodus 12:2; 13:4; Deuteronomy 16:1", text: "Aviv/Abib is the first month." },
  { ref: "Exodus 20:8–11", text: "The Sabbath is the seventh day of a continuous week." },
  { ref: "Exodus 23:13", text: "The names of other gods are not to be heard from Israel’s mouth." },
  { ref: "Leviticus 23:5", text: "Passover is on Month 1, day 14." },
  { ref: "Leviticus 23:23–44", text: "Trumpets, Atonement, and Tabernacles occur in Month 7." },
  { ref: "Leviticus 23:32", text: "A sacred date can run from evening to evening." },
  { ref: "Daniel 7:25", text: "A later power is said to think to change times and laws. This page stores the verse; it does not date a fulfillment." },
  { ref: "Galatians 4:10–11", text: "Observing days, months, times, and years that were not given is treated as a return to bondage." },
];

export const TIMELINE = [
  { period: "Biblical periods", development: "Lunar and seasonal Israelite timekeeping", who: "Israelite society and religious authorities", why: "Agriculture and appointed worship" },
  { period: "Exile and post-exilic periods", development: "Babylonian month names enter Jewish use", who: "Cultural and imperial contact", why: "Shared administrative vocabulary" },
  { period: "Second Temple period", development: "Mainstream Jewish lunisolar calendar alongside minority alternatives", who: "Temple authorities and separate communities", why: "Worship, agriculture, and communal identity" },
  { period: "45 BCE", development: "Julian calendar begins; year opens at the Kalends of January", who: "Julius Caesar and Roman administration", why: "Regularize Rome’s civil calendar — not Israel’s festivals" },
  { period: "First century CE", development: "Jewish festival calendar and Roman Julian calendar coexist", who: "Temple authorities and Roman government", why: "Religious and civil purposes" },
  { period: "AD 321", development: "Civil rest on the venerable day of the Sun", who: "Constantine", why: "Imperial Sun-day rest (Codex Justinianus 3.12.2)" },
  { period: "AD 325", development: "Easter dating rule", who: "Council of Nicaea", why: "Coordinate church Pascha; the seventh day was not rewritten" },
  { period: "Mid-4th century", development: "Canon against resting on the Sabbath", who: "Council of Laodicea, canon 29", why: "Church law honouring a later “Lord’s Day”" },
  { period: "AD 336–354", development: "25 December listed as Natalis Invicti and as a nativity date", who: "Chronograph of 354, Rome", why: "Roman civil-religious calendar, not a Gospel date" },
  { period: "AD 70", development: "Temple destroyed", who: "Roman conquest", why: "Major disruption to Temple-centered administration" },
  { period: "c. AD 200", development: "Mishnah records crescent-witness procedures", who: "Rabbinic compilers", why: "Preservation and legal standardization" },
  { period: "Late antiquity–early Middle Ages", development: "Jewish calendar becomes increasingly calculated", who: "Multiple Jewish authorities and communities", why: "Predictability and unity across distance" },
  { period: "921–922", development: "Palestinian–Babylonian calendar dispute", who: "Ben Meir, Saadia Gaon, and their communities", why: "Disagreement over calculation" },
  { period: "1582 onward", development: "Gregorian reform and gradual adoption", who: "Gregory XIII, technical advisers, churches, and governments", why: "Correct Julian drift and coordinate civil dates" },
];

export const CLAIMS = [
  {
    claim: "The pope changed the biblical calendar",
    verdict: "False as stated",
    body: "Gregory XIII reformed the western Julian civil calendar in 1582. He did not create or modify the biblical month numbers, the Temple calendar, or the Jewish fixed calendar.",
  },
  {
    claim: "Hillel II personally created the complete modern Hebrew calendar in 359",
    verdict: "Later tradition; historically oversimplified",
    body: "The surviving evidence supports gradual development and later standardization, not one man writing every modern rule in AD 359.",
  },
  {
    claim: "The calendar of Jesus was Gregorian",
    verdict: "False",
    body: "Jewish religious life used a lunisolar calendar; Roman administration used the Julian calendar.",
  },
  {
    claim: "Every new moon resets the Sabbath week",
    verdict: "Unsupported",
    body: "Scripture never commands such a reset, and it conflicts with the continuous weekly cycle evidenced in Jewish history.",
  },
  {
    claim: "The Qumran 364-day calendar was certainly the calendar of Jesus",
    verdict: "Unsupported",
    body: "It was a real ancient alternative, but available evidence does not establish that Jesus used it.",
  },
  {
    claim: "Ancient dates can always be converted exactly",
    verdict: "False",
    body: "Missing observations, weather, human declarations, local practices, and uncertain intercalation can prevent exact conversion.",
  },
  {
    claim: "Nicaea changed the Sabbath",
    verdict: "Unsupported as stated",
    body: "Nicaea (AD 325) is documented as regulating the dating of Easter relative to the Jewish calendar. It did not rewrite Exodus 20:8–11 or move the seventh-day Sabbath. The documented Sunday shift is Constantine’s 321 Sun-day edict and later canons such as Laodicea 29. See Pagan traditions.",
  },
  {
    claim: "January 1 is the biblical new year",
    verdict: "False",
    body: "Exodus 12:2 sets the beginning of months in Aviv, in the spring. 1 January is the Kalends of Janus on the Roman civil calendar.",
  },
  {
    claim: "Weekday names are just neutral English",
    verdict: "False as history",
    body: "Sunday through Saturday are the planetary week and the northern gods (Sun, Moon, Tiw, Woden, Thor, Frigg, Saturn). Scripture numbers the days and names the seventh the Sabbath.",
  },
  {
    claim: "Daniel 7:25 is fulfilled by the Gregorian reform of 1582",
    verdict: "Unsupported as a dated fulfillment",
    body: "Gregory XIII corrected Julian drift. He did not rename the week or rewrite Leviticus 23. The verse is stored here beside documented changes of rest-day and festival dating. This app does not treat 1582 as the fulfillment.",
  },
  {
    claim: "The biblical month begins at astronomical conjunction",
    verdict: "Unsupported as a scriptural rule",
    body: "The moon is invisible at conjunction. Ancient Jewish procedure, as later recorded in Mishnah Rosh Hashanah, concerns first visibility and declaration. Conjunction is an astronomical event, not the same as first crescent.",
  },
];

export const SOURCES = [
  { label: "Genesis 1:14", href: "/library?corpus=bible&book=Genesis&chapter=1" },
  { label: "Exodus 12:1–18; 13:4; 20:8–11", href: "/library?corpus=bible&book=Exodus&chapter=12" },
  { label: "Leviticus 23", href: "/library?corpus=bible&book=Leviticus&chapter=23" },
  { label: "Numbers 28:11–15", href: "/library?corpus=bible&book=Numbers&chapter=28" },
  { label: "Deuteronomy 16:1", href: "/library?corpus=bible&book=Deuteronomy&chapter=16" },
  { label: "Psalm 104:19", href: "/library?corpus=bible&book=Psalms&chapter=104" },
  { label: "Josephus, Antiquities 3.248–249 (stored in this app)", href: "/library?corpus=josephus" },
  { label: "Mishnah Rosh Hashanah 1–3", href: "https://www.sefaria.org/Mishnah_Rosh_Hashanah.1" },
  { label: "Sacha Stern, Calendar and Community", href: "https://academic.oup.com/book/26077" },
  { label: "UCL: Jewish calendar dispute of 921–2 CE", href: "https://www.ucl.ac.uk/arts-humanities/hebrew-jewish/hjs-research/research-projects-hjs/calendars-late-antiquity-and-middle-ages-standardization-and-fixation/jewish-calendar-dispute-921-2-ce" },
  { label: "Haifa: astronomy and calendars at Qumran", href: "https://cris.haifa.ac.il/en/publications/astronomy-and-calendars-at-qumran/" },
  { label: "IAA / ibiblio Dead Sea Scrolls calendrical exhibit", href: "https://www.ibiblio.org/expo/deadsea.scrolls.exhibit/Library/calend.html" },
  { label: "1 Enoch (stored in this app)", href: "/library?corpus=enoch" },
  { label: "Jubilees (stored in this app)", href: "/library?corpus=other" },
  { label: "Daniel 7:25", href: "/library?corpus=bible&book=Daniel&chapter=7" },
  { label: "Galatians 4:10–11", href: "/library?corpus=bible&book=Galatians&chapter=4" },
  { label: "Pagan traditions — Sunday, weekdays, months, January, Christmas, Easter", href: "/customs" },
  { label: "Sacha Stern, Calendars in Antiquity", href: "https://academic.oup.com/book/26077" },
];
