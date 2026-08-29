/** Where, when, and citable primary / museum / official evidence. Empty URL omitted; no wikis. */

const KJ = {
  title: "King James Bible (public domain, Project Gutenberg ebook 10)",
  url: "https://www.gutenberg.org/ebooks/10",
  note: "Canonical English text used throughout this app",
};
const SEF_GEN6 = {
  title: "Genesis 6 (Sefaria — Hebrew/English scholarly text)",
  url: "https://www.sefaria.org/Genesis.6",
  note: "Sons of God and daughters of men; the flood setting of the Watchers dispute",
};
const FORDHAM_CT = {
  title: "Fordham Medieval Sourcebook — Codex Theodosianus excerpts",
  url: "https://sourcebooks.fordham.edu/source/codex-theod1.asp",
  note: "Imperial Sunday / Lord's-day laws in the Theodosian Code (4th–5th c.)",
};
const LAODICEA29 = {
  title: "Council of Laodicea, canon 29 (NPNF, CCEL)",
  url: "https://www.ccel.org/ccel/schaff/npnf214.viii.vii.iii.xxxiv.html",
  note: "Christians must not judaize by resting on the Sabbath (mid-4th c., Phrygia)",
};
const PLINY_MIST = {
  title: "Pliny, Natural History 16.95 (Perseus / Tufts)",
  url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=16:chapter=95",
  note: "Druids, oak, and mistletoe as all-heal sent from heaven",
};
const TERT_IDOL = {
  title: "Tertullian, On Idolatry (ANF, CCEL)",
  url: "https://ccel.org/ccel/schaff/anf03/anf03.iv.iv.html",
  note: "Against sharing Saturnalia, New Year, and midwinter with the nations (c. AD 200–210, Carthage)",
};
const BEDE_LAT = {
  title: "Bede, De temporum ratione (Latin, Hochschule Augsburg bibliotheca Augustana)",
  url: "https://www.hs-augsburg.de/homes/harsch/Chronologia/Lspost08/Bede/bed_ra00.html",
  note: "AD 725 computus; ch. 15 on English months including Eosturmonath",
};
const CHRONO354 = {
  title: "Scholarly edition: Chronograph of 354 / Calendar of Filocalus (OAPEN)",
  url: "https://library.oapen.org/handle/20.500.12657/33285",
  note: "Civic calendar of Rome, AD 354; includes Natalis Invicti and Christian depositio lists",
};
const MET_HORUS = {
  title: "Met Museum — Wedjat (Eye of Horus) amulet, Dynasty 18, c. 1390–1352 BC",
  url: "https://www.metmuseum.org/art/collection/search/551468",
  note: "Excavated faience amulet from Malqata, palace of Amenhotep III",
};
const LOUVRE_MESHA = {
  title: "Louvre — Mesha Stele (Moabite Stone), Dhiban, c. 830–805 BC",
  url: "https://collections.louvre.fr/en/ark:/53355/cl010120339",
  note: "Mesha boasts in Chemosh (Kamosh) and war with Israel; extra-biblical",
};
const NARA_SEAL = {
  title: "U.S. National Archives — Original design of the Great Seal (20 June 1782)",
  url: "https://www.archives.gov/milestone-documents/original-design-of-the-great-seal-of-the-united-states",
  note: "Official civic document; reverse pyramid and Eye of Providence",
};
const NPS_WAMO = {
  title: "National Park Service — Washington Monument history",
  url: "https://www.nps.gov/wamo/learn/historyculture/index.htm",
  note: "U.S. civic obelisk, completed 1884",
};
const DSS = {
  title: "Leon Levy Dead Sea Scrolls Digital Library (IAA)",
  url: "https://www.deadseascrolls.org.il/",
  note: "Photographs and catalog of Qumran scrolls, including Enoch and Belial texts",
};
const ENOCH = {
  title: "1 Enoch, R. H. Charles translation (CCEL)",
  url: "https://ccel.org/c/charles/otpseudepig/enoch.htm",
  note: "Watchers, Azazel, Semjaza; quoted in Jude; Ethiopic corpus",
};
const IRENAEUS666 = {
  title: "Irenaeus, Against Heresies 5.30 (ANF, CCEL)",
  url: "https://ccel.org/ccel/schaff/anf01/anf01.ix.vii.xxx.html",
  note: "2nd-c. discussion of Revelation's number of the beast",
};
const MINUCIUS = {
  title: "Minucius Felix, Octavius (ANF, CCEL)",
  url: "https://ccel.org/ccel/schaff/anf04/anf04.iv.iii.html",
  note: "2nd/3rd c.; denial that Christians worship crosses",
};
const EUSEBIUS_VC = {
  title: "Eusebius, Life of Constantine (NPNF, CCEL)",
  url: "https://ccel.org/ccel/schaff/npnf201/npnf201.iv.vi.html",
  note: "Imperial adoption of the cross-sign / labarum, 4th century",
};
const NICAEA = {
  title: "First Council of Nicaea documents (NPNF, CCEL)",
  url: "https://ccel.org/ccel/schaff/npnf214/npnf214.vii.i.html",
  note: "AD 325; Easter dating among the conciliar questions",
};

function D(where, when, summary, timeline, links) {
  return { where, when, summary, timeline, links };
}

export const DOSSIER = {
  "sunday-sabbath": D(
    "Sinai (commandment) → Rome and Laodicea in Phrygia (civil/church change)",
    "Commandment: Late Bronze / traditional Mosaic era in Exodus 20. Civil Sun-day rest: 7 March 321 (Constantine). Church ban on Sabbath rest: Council of Laodicea, between AD 343 and 381.",
    "The seventh-day rest is in Genesis 2 and Exodus 20. The later weekly holy-day of the churches is a documented imperial and conciliar change, not a verse that renames the seventh day. Constantine's statute names the venerable day of the Sun. Laodicea anathematizes resting on the Sabbath.",
    [
      { date: "Creation week (Genesis 2:2–3)", event: "God blesses and sanctifies the seventh day." },
      { date: "Exodus 20:8–11", event: "The fourth commandment names the seventh day as the Sabbath of the LORD." },
      { date: "c. AD 50–62", event: "Acts still records synagogue Sabbaths; a first-day meeting and collection appear (Acts 20:7; 1 Cor 16:2) without a transfer command." },
      { date: "7 March 321", event: "Constantine: judges and city trades rest on dies Solis; farm work excepted (Codex Justinianus 3.12.2 / related Theodosian material)." },
      { date: "AD 343–381", event: "Laodicea canon 29: do not judaize by Sabbath rest; honour the Lord's Day; judaizers anathema." },
    ],
    [KJ, FORDHAM_CT, LAODICEA29]
  ),
  christmas: D(
    "Judea (nativity narratives, undated) vs Rome (25 December civic/solar calendar)",
    "Gospels: 1st century. 25 December as Natalis Invicti and as nativity both appear in the Chronograph of 354. Saturnalia is older Republican/imperial mid-December. Tertullian already rebukes midwinter sharing c. AD 200.",
    "Scripture never dates the birth. Rome's civic handbook of 354 lists both the Unconquered's birthday and a Christian nativity date on 25 December. Midwinter rites of the nations predate that handbook.",
    [
      { date: "Republican–imperial Rome", event: "Saturnalia in mid-December (classically from 17 Dec)." },
      { date: "c. AD 200–210, Carthage", event: "Tertullian, On Idolatry 14: do not keep Saturnalia, New Year, midwinter with the nations." },
      { date: "AD 274", event: "Aurelian promotes Sol Invictus as a state cult in Rome." },
      { date: "AD 336–354, Rome", event: "Chronograph of 354: Depositio lists nativity 25 Dec; civic calendar marks Natalis Invicti with races." },
    ],
    [KJ, TERT_IDOL, CHRONO354]
  ),
  "christmas-trees": D(
    "German-speaking Europe (domestic tree); older green-tree high places in Israel and Roman Kalends greenery",
    "Torah forbids groves by the altar (Deuteronomy 16:21). German parlour tree: early modern (16th–17th c.). English-speaking world: popularized after the 1848 Illustrated London News engraving of Victoria and Albert's tree.",
    "Jeremiah 10 is idol-manufacture, not a fir in a parlour. The winter evergreen as undying life is older folk. The object in living rooms is German then Victorian.",
    [
      { date: "Torah", event: "No grove of trees by YHWH's altar (Deut 16:21); green trees on high places condemned (2 Kings 17:10)." },
      { date: "Roman Kalends of January", event: "Greenery and strenae at the turning of the civic year." },
      { date: "16th–17th c., Alsace/Germany", event: "Domestic decorated evergreens attested in German-speaking lands." },
      { date: "December 1848, London", event: "Illustrated London News popularizes the royal Christmas tree in Britain." },
    ],
    [KJ]
  ),
  easter: D(
    "Egypt/Canaan (Passover, first month) vs Anglo-Saxon England (Eostre name) vs Nicaea (date)",
    "Passover: Exodus 12, 14th of Abib. English name: Bede, AD 725, Northumbria. Conciliar date vs Jewish calendar: Nicaea, AD 325.",
    "The feast God named is Passover. English 'Easter' is, according to Bede, the old month-name from a goddess Eostre. Nicaea moved the churches off the Jewish calculation. Eggs and hares are later European folk, not Exodus 12.",
    [
      { date: "Exodus 12 / Leviticus 23", event: "Passover and Unleavened Bread commanded, first month." },
      { date: "c. AD 55", event: "1 Corinthians 5:7–8: Messiah our passover; keep the feast." },
      { date: "AD 325, Nicaea", event: "Churches agree a common Easter computation, not following the Jews' calendar." },
      { date: "AD 725, Wearmouth-Jarrow", event: "Bede, De temporum ratione 15: Eosturmonath named from the goddess Eostre." },
    ],
    [KJ, BEDE_LAT, NICAEA]
  ),
  birthdays: D(
    "Egyptian court (Genesis 40) and Herodian court (Matthew 14); later general custom of the nations",
    "Pharaoh's birthday in the Joseph narrative (2nd millennium setting). Herod Antipas, c. AD 28–32. Origen (3rd c., Caesarea/Alexandria) treats birthday-keeping as the custom of the wicked in Scripture.",
    "Israel is never commanded a natal feast. The two named birthday feasts in the canon are royal and bound to death. Candles-on-cake are 19th–20th c. and do not change the biblical pattern.",
    [
      { date: "Genesis 40:20", event: "Pharaoh's birthday feast; the baker is hanged." },
      { date: "c. AD 28–32", event: "Herod's birthday; John the Baptist beheaded (Matt 14; Mark 6)." },
      { date: "c. AD 240", event: "Origen, Homilies on Leviticus 8: birthday feasts belong to Pharaoh and Herod, not the saints." },
    ],
    [KJ]
  ),
  "wedding-rings": D(
    "Rome (anulus pronubus); not Sinai",
    "Roman Republic/Empire: the pledge-ring. Tertullian Apology 6 (c. AD 197). Pliny, Natural History 33, on gold rings of rank. Clement of Alexandria, Paedagogus 3.11 (c. AD 190–200).",
    "Genesis 2:24 is one flesh, not a metal circle. The Western wedding band is Roman pledge-jewelry adopted by later churches.",
    [
      { date: "Roman law and custom", event: "Ring as betrothal pledge (anulus pronubus)." },
      { date: "c. AD 77", event: "Pliny NH 33: gold rings and social rank." },
      { date: "c. AD 197–200", event: "Tertullian and Clement discuss the ring as pledge or signet, not as Torah." },
    ],
    [KJ, TERT_IDOL]
  ),
  mistletoe: D(
    "Gaul (Pliny's Druids) → early-modern England (kissing custom)",
    "Pliny writes Natural History c. AD 77. English kissing under mistletoe is early modern/Victorian parlour custom, not a Gospel ordinance.",
    "The sacred oak-parasite is attested as Druid all-heal. The doorway kiss is a later emptying of that plant into midwinter play.",
    [
      { date: "c. AD 77", event: "Pliny NH 16.95: Druids hold nothing more sacred than mistletoe on the oak." },
      { date: "Early modern–Victorian England", event: "Kissing under the hanging sprig becomes a recorded folk custom." },
    ],
    [PLINY_MIST, KJ]
  ),
  crosses: D(
    "Rome (execution) → post-Constantinian empire and churches (badge and devotion)",
    "Crucifixion as Roman penalty, 1st c. Minucius Felix denies cross-worship (late 2nd/early 3rd c.). Eusebius records Constantine's labarum (early 4th c.). Jewelry crosses are later still.",
    "The preaching of the cross is apostolic. The object as talisman is the Nehushtan path (2 Kings 18:4).",
    [
      { date: "c. AD 30–33", event: "Messiah crucified under Pontius Pilate." },
      { date: "c. AD 160–250", event: "Minucius Felix, Octavius: Christians do not worship the execution-stake." },
      { date: "AD 312–337", event: "Eusebius, Life of Constantine: imperial cross-sign / labarum." },
    ],
    [KJ, MINUCIUS, EUSEBIUS_VC]
  ),
  halloween: D(
    "Rome (All Saints, 8th c.) layered on Gaelic Samhain season and later American commerce",
    "Gregory III (d. 741) associated with an All Saints oratory in St Peter's; Gregory IV extends 1 November. Samhain is a medieval Irish year's turning. U.S. commercial Halloween: late 19th–20th c.",
    "Deuteronomy 18 forbids consulting the dead in every century. The night's modern theme is the dead as play. Layers must not be smashed into one 'satanic mass' story, and the commandment must not be waived.",
    [
      { date: "Torah", event: "Necromancy and familiar spirits forbidden (Deut 18; Lev 19:31)." },
      { date: "8th c., Rome", event: "Western All Saints on 1 November; eve becomes All Hallows' Eve." },
      { date: "Medieval Ireland", event: "Samhain as seasonal turning in Irish literature." },
      { date: "19th–20th c., United States", event: "Guising, candy, and horror-as-fun become mass culture." },
    ],
    [KJ]
  ),
  "new-year": D(
    "Rome (Kalends of January / Janus) vs Israel's Abib (Exodus 12:2)",
    "Exodus 12 resets the year in spring. Julian calendar (45 BC) and Roman month-names make 1 January Janus's threshold. Tertullian lists the New Year among forbidden shares.",
    "Civil dating is one use. Treating midnight 1 January as a fate-making holy beginning is Janus plus observer-of-times.",
    [
      { date: "Exodus 12:2", event: "This month shall be the beginning of months — Abib/Nisan." },
      { date: "45 BC, Rome", event: "Julian reform; year associated with 1 January." },
      { date: "c. AD 200", event: "Tertullian: New Year among the nations' festivals." },
    ],
    [KJ, TERT_IDOL]
  ),
  "lent-carnival": D(
    "Churches of the Mediterranean (Lenten fast) and later European folk (Carnival)",
    "Nicaea (325) already knows a Lenten season of varying length. Ash Wednesday and Mardi Gras are medieval Western developments. Torah's commanded affliction is 10th of the seventh month (Lev 23).",
    "A binge God did not write plus a fast God did not date as Lent, tied to Easter's Nicaean date.",
    [
      { date: "Leviticus 23:27", event: "Day of Atonement, seventh month." },
      { date: "AD 325", event: "Nicaea mentions Lent." },
      { date: "Medieval West", event: "Ash Wednesday face-ashes; Carnival as fare-well to meat." },
    ],
    [KJ, NICAEA]
  ),
  valentines: D(
    "Rome (Lupercalia, 15 Feb; later martyrology of Valentine, 14 Feb) then 14th-c. English poetry and 19th-c. commerce",
    "Lupercalia is a real Roman rite. Gelasius I associated with ending it (late 5th c.). Romantic Valentine is largely Chaucer-era and later retail. The Lupercalia-swap story is disputed.",
    "Cupid on the goods is a Roman love-god. Love in Song of Solomon is not his feast.",
    [
      { date: "Republican Rome", event: "Lupercalia, 15 February." },
      { date: "Late 5th c.", event: "Gelasius I and the end of Lupercalia in Rome." },
      { date: "14th–15th c. England", event: "Valentine associated with mating birds in poetry." },
      { date: "18th–19th c.", event: "Commercial valentines." },
    ],
    [KJ]
  ),
  santa: D(
    "Myra in Lycia (Nicholas, 4th c.) → Dutch Sinterklaas (6 Dec) → New York literary Santa (1823)",
    "Nicholas of Myra: 4th c. Moore, A Visit from St. Nicholas, 1823. Nast cartoons later 19th c. 20th-c. advertising.",
    "The assembled all-seeing gift-judge is American literature plus commerce, wearing a bishop's legend.",
    [
      { date: "4th c., Myra", event: "Bishop Nicholas; later gift-legends." },
      { date: "Medieval–early modern Low Countries", event: "Sinterklaas, 5–6 December." },
      { date: "1823, United States", event: "Moore's poem fixes reindeer, chimney, pack." },
    ],
    [KJ]
  ),
  weekdays: D(
    "Rome (planetary week) → English (Tiw, Woden, Thor, Frigg)",
    "The seven-day planetary week is Roman imperial. Old English replaces several names with northern gods. Exodus 23:13 forbids the names of other gods in the mouth.",
    "Every appointment book still recites Sun, Moon, Tiw, Woden, Thor, Frigg, Saturn.",
    [
      { date: "Roman Empire", event: "Dies Solis … dies Saturni." },
      { date: "Early medieval England", event: "Tiwesdæg, Wodnesdæg, Thunresdæg, Frigedæg." },
    ],
    [KJ]
  ),
  months: D(
    "Rome (Janus, Mars, Maia, Juno, Julius, Augustus)",
    "Republican calendar reformed under Julius Caesar (45 BC); Quintilis and Sextilis renamed for Julius and Augustus in the early empire. Biblical first month remains Abib (Exodus 12–13).",
    "March is Mars. July is a deified Caesar. The theophoric year outlived the temples.",
    [
      { date: "45 BC", event: "Julian year." },
      { date: "27 BC–AD 14", event: "August renamed for Augustus." },
    ],
    [KJ]
  ),
  images: D(
    "Horeb (no form) vs later churches (icons, 787 Nicaea II) vs solar nimbus of Hellenistic rulers",
    "Exodus 20 / Deuteronomy 4. Second Council of Nicaea, AD 787, defines veneration of images. Radiate imperial crowns are earlier Roman/Hellenistic.",
    "The commandment was not rewritten at Nicaea II. Halos continue solar kingship's light.",
    [
      { date: "Sinai / Horeb", event: "No similitude; no likeness to bow to." },
      { date: "Hellenistic–Roman", event: "Radiate Sol and emperors on coinage." },
      { date: "AD 787", event: "Nicaea II on icons — church law, not Torah." },
    ],
    [KJ]
  ),
  horoscopes: D(
    "Mesopotamia (celestial omens) → Hellenistic twelve-sign zodiac → newspaper sun-signs",
    "Babylonian omen series (1st millennium BC). Greek zodiac. Isaiah 47 addresses Babylon's astrologers. Modern sun-sign columns: 20th c. popular reduction.",
    "Genesis 1:14 is seasons, not natal fate. Deuteronomy 18 names the observer of times.",
    [
      { date: "1st millennium BC, Mesopotamia", event: "Planetary/celestial omens as a scholarly craft." },
      { date: "Isaiah 47", event: "Astrologers and monthly prognosticators cannot save Babylon." },
      { date: "Hellenistic–Roman", event: "Twelve-sign natal astrology." },
    ],
    [KJ]
  ),
  "luck-charms": D(
    "Cross-cultural folk; Isaiah 65:11 names Fortune and Destiny as a table-cult in Judah",
    "Isaiah (8th–6th c. setting). Gad and Meni as fortune-deities in the Hebrew of 65:11 (many scholarly notes).",
    "Tiny rites to bind luck are the charmer's occupation miniaturized (Deut 18).",
    [{ date: "Isaiah 65:11", event: "A table for Fortune, a drink for Destiny." }],
    [KJ]
  ),
  "talking-boards": D(
    "United States, spiritualist market, 1890s → toy branding later",
    "U.S. patents and novelty companies of the 1890s. Parker Brothers later mass-market. The occupation is Leviticus 20 / 1 Samuel 28, not a 19th-c. invention.",
    "This page will not describe operation. The date of the box does not create a toy exception.",
    [
      { date: "1 Samuel 28", event: "Saul and the familiar spirit at Endor." },
      { date: "1890s, United States", event: "Talking-board patents and spiritualist novelty trade." },
    ],
    [KJ]
  ),
  "may-day": D(
    "Medieval and early modern England (May / maypole); analogous green-tree rites far older",
    "English May customs well attested by the late Middle Ages. Puritans attack maypoles in the 16th–17th c. 2 Kings 17:10 is the biblical analogue, not a museum label on every pole.",
    "A dressed tree-substitute on a day Leviticus 23 did not name.",
    [
      { date: "2 Kings 17:10", event: "Groves under every green tree." },
      { date: "Medieval–early modern England", event: "Bringing in the May; maypole dances." },
    ],
    [KJ]
  ),
  "queen-of-heaven": D(
    "Judah (Jeremiah 7, 44, late 7th–6th c. BC) — family cakes to a heavenly queen",
    "Jeremiah's ministry c. 627–586 BC. Later Europe: hot cross buns as early modern English Good Friday bread — related by category, not line-for-line identity.",
    "The people said the cakes brought plenty. God called it provocation. That argument is still used for goddess-household religion.",
    [
      { date: "c. 609–586 BC", event: "Jeremiah 7:18; 44:17–19: cakes and drink to the Queen of Heaven." },
    ],
    [KJ]
  ),

  "sun-disk": D("Egypt, Mesopotamia, Rome", "Old Kingdom Egypt through Roman Sol Invictus (3rd–4th c. AD)", "The sun as a visible god. Deuteronomy 4:19 forbids worship of sun, moon, and host of heaven.", [
    { date: "Pharaonic Egypt", event: "Solar disks of Ra/Aten in temple reliefs." },
    { date: "AD 274, Rome", event: "Aurelian's Sol Invictus." },
    { date: "AD 321 / 354", event: "Dies Solis rest; Natalis Invicti on 25 Dec in the Chronograph." },
  ], [KJ, CHRONO354, FORDHAM_CT]),
  "sun-cross": D("Bronze Age Europe and the Near East", "2nd–1st millennium BC solar wheels on artifacts", "A quartered circle as the year-god's geometry, not the Latin execution cross.", [{ date: "Bronze Age", event: "Quartered-circle solar/wheel signs on European metalwork." }], [KJ]),
  "radiate-crown": D("Hellenistic kingdoms and imperial Rome", "3rd c. BC–3rd c. AD coinage", "Spikes of light = Helios/Sol and deified emperors. Later saint-halos inherit the grammar.", [{ date: "Roman imperial coinage", event: "Radiate Sol and emperors." }], [KJ]),
  "halo-nimbus": D("Late antique Christian art borrowing imperial solar light", "4th–6th c. AD onward", "A gold disk behind a head is the sun's badge moved onto a likeness.", [{ date: "Late antiquity", event: "Nimbus in mosaic and icon." }], [KJ]),
  "winged-sun": D("Egypt, Assyria, Achaemenid Persia", "2nd–1st millennium BC royal reliefs", "The king under the sun-god's wings. 19th-c. occult orders copied the motif.", [{ date: "New Kingdom–Neo-Assyrian–Persian", event: "Winged disks in palace and tomb art." }], [KJ]),
  "crescent-moon": D("Mesopotamia (Sin of Harran/Ur), Greece (Artemis), Rome (Diana)", "3rd millennium BC onward for Sin; classical crescent of Diana", "Moon as deity and as timed fate. Deut 17:3 names sun or moon worship.", [{ date: "Ur / Harran", event: "Moon-god Sin." }, { date: "Classical world", event: "Artemis/Diana crescent." }], [KJ]),
  evergreen: D("Levantine high places; Germanic midwinter; German parlour (early modern)", "Torah era groves; German 16th–17th c. tree; 1848 Britain", "Undying vegetation at the sun's weakness.", [{ date: "Deut 16:21; 2 Kings 17:10", event: "Forbidden groves and green trees." }, { date: "1848", event: "Victorian tree popularized in print." }], [KJ]),
  "oak-mistletoe": D("Gaul, as reported by a Roman encyclopedist", "Pliny, c. AD 77", "Priestly oak-parasite cult.", [{ date: "c. AD 77", event: "Pliny NH 16.95." }], [PLINY_MIST]),
  "zodiac-wheel": D("Mesopotamia then the Hellenistic Mediterranean", "1st millennium BC omens; Hellenistic 12 signs", "Fate from the hour of birth.", [{ date: "Isaiah 47", event: "Astrologers of Babylon mocked." }], [KJ]),
  "pentagram-up": D("Mediterranean geometry; 19th-c. occult textbooks; 20th-c. Wicca", "Ancient decorative stars; Lévi 1854–56; Gardnerian Wicca 1950s", "A five-point star is not automatically a working pentacle. The circled pentagram as a craft tool is modern witchcraft's public sign.", [{ date: "1854–56, Paris", event: "Éliphas Lévi, Dogme et Rituel de la Haute Magie, popularizes upright vs inverted pentagram doctrine." }, { date: "1950s, England", event: "Wicca takes the pentacle as a religious badge." }], [KJ]),
  "pentagram-down": D("Lévi's 19th-c. occultism; 20th-c. Satanist groups", "1850s (Lévi); 1966 Church of Satan goat-star as a corporate seal (logo not copied here)", "Inversion as a taught meaning: matter over spirit / goat of the sabbath in Lévi's scheme.", [{ date: "1850s", event: "Lévi's inverted pentagram = goat." }, { date: "1966, United States", event: "Satanist organizations adopt a goat-in-star (trademarked design not reproduced)." }], [KJ]),
  pentacle: D("Ceremonial magic grimoires and 20th-c. Wicca", "Early modern grimoires; Wicca mid-20th c.", "A consecrated disk. This page does not describe consecration.", [{ date: "20th c.", event: "Pentacle as Wiccan identity and altar tool." }], [KJ]),
  hexagram: D("Wide decorative use; Jewish Magen David as a late communal badge; Solomonic magical texts", "Jewish civic star: medieval–modern. Occult 'Seal of Solomon' diagrams: medieval/early modern grimoires.", "Same geometry, different use. Do not smear a synagogue. Do not deny grimoire use.", [{ date: "Medieval–modern", event: "Shield of David as Jewish emblem." }, { date: "Agrippa and later magical prints", event: "Hexagrams among planetary/Solomonic diagrams (working seals not printed here)." }], [KJ]),
  "unicursal-hexagram": D("England, Aleister Crowley / Thelema", "Early 1900s", "A modern occult badge of 'Do what thou wilt,' not ancient Israel.", [{ date: "1904–1910s", event: "Crowley uses the unicursal hexagram." }], [KJ]),
  "chaos-star": D("Modern fiction (Moorcock) and 1970s chaos magic", "1960s–1970s", "Eight arrows: undirected force, no fixed law.", [{ date: "1970s", event: "Chaos magic adopts the eight-arrow star." }], [KJ]),
  "latin-cross": D("Roman execution, Judaea, 1st c. AD", "c. AD 30–33 event; badge after Constantine", "See crosses custom.", [{ date: "1st c.", event: "Crucifixion." }, { date: "4th c.", event: "Imperial labarum (Eusebius)." }], [KJ, MINUCIUS, EUSEBIUS_VC]),
  "inverted-cross": D("Later Petrine legend vs 20th-c. pop inversion", "Apocryphal Acts of Peter (late antique); cinema/metal 20th c.", "Context decides humility-legend vs mockery-brand.", [{ date: "Late antique", event: "Peter upside-down legend." }, { date: "20th c.", event: "Inverted cross as blasphemy merchandise." }], [KJ]),
  "leviathan-cross": D("European alchemy (sulfur glyph); 20th-c. Satanist nickname", "Medieval–early modern alchemical MSS; LaVeyan 20th c.", "Job 41 / Isaiah 27:1 are not a logo. The brimstone glyph is later branding.", [{ date: "Isaiah 27:1; Job 41", event: "Leviathan as creature God made and will punish." }, { date: "20th c.", event: "Brimstone-style pendant nicknamed Leviathan cross." }], [KJ]),
  ankh: D("Pharaonic Egypt", "From at least the Old Kingdom; ubiquitous in New Kingdom temple reliefs", "Hieroglyph for life, held by Egyptian gods to the king. Occult Egyptomania in the 19th c. revives it as jewelry.", [{ date: "Pharaonic Egypt", event: "Ankh as divine life-sign." }, { date: "19th c. West", event: "Theosophy and fashion copies." }], [KJ, MET_HORUS]),
  "all-seeing-eye": D("Baroque Christian 'Eye of Providence'; Freemasonry; U.S. Great Seal reverse 1782", "1782 official U.S. design (Charles Thomson). Older Christian art of Providence. Lodge tracing-boards.", "Civic deism on a seal is not Sinai and not automatically one cabal. Proverbs 15:3 locates seeing in the LORD.", [{ date: "20 June 1782", event: "Continental Congress approves the Great Seal, including reverse pyramid and eye." }, { date: "1935", event: "Both sides popularized on the U.S. one-dollar bill." }], [NARA_SEAL, KJ]),
  "eye-of-horus": D("Egypt", "Wedjat amulets from late Old Kingdom through Ptolemaic times; New Kingdom example at the Met c. 1390–1352 BC", "Horus's restored eye as health/protection amulet. Not the same drawing as the U.S. Providence eye.", [{ date: "c. 1390–1352 BC, Thebes/Malqata", event: "Met 11.215.130 faience wedjat from Amenhotep III's palace excavations." }], [MET_HORUS, KJ]),
  "nazar-eye": D("Eastern Mediterranean / West Asia folk", "Long folk use; modern glass nazar as Turkish/Greek souvenir trade", "Apotropaic counter-eye. Deut 18: charmer.", [{ date: "Folk, ongoing", event: "Blue concentric bead as curse-deflector." }], [KJ]),
  hamsa: D("North Africa and the Levant", "Folk; modern global jewelry", "Open hand of protection, sometimes named for Fatima or Miriam.", [{ date: "Levantine/Maghreb folk", event: "Khamsa as apotropaic hand." }], [KJ]),
  ouroboros: D("Egypt and Hellenistic alchemy", "Egyptian funerary; Greek magical papyri; Chrysopoeia of Cleopatra (alchemical)", "Eternity as a closed loop, no Judge. Rev 22:13 is Alpha and Omega, not a snake-circle.", [{ date: "Hellenistic–alchemical", event: "Serpent eating its tail as 'the all is one.'" }], [KJ]),
  caduceus: D("Greece (Hermes) vs Asclepius's single snake; U.S. Army Medical Corps mix-up 1902", "Classical cult; 1902 U.S. medical insignia error", "Numbers 21's serpent was smashed when worshipped (2 Kings 18:4).", [{ date: "Classical Greece/Rome", event: "Caduceus of Hermes; rod of Asclepius." }, { date: "1902", event: "U.S. Army Medical Corps adopts the caduceus." }], [KJ]),
  "baphomet-pentagram": D("14th-c. Templar accusations (word disputed) → Lévi 1856 drawing → 20th-c. Satanist goat-star", "1856 Paris plate; 1966+ group seals (not copied); goat-demons already in Leviticus 17:7", "Lévi invented the famous androgyne picture. The Torah already forbade goat-demon offerings.", [{ date: "1307–1314", event: "Templar trials mention a 'Baphomet' head; meaning disputed." }, { date: "1856", event: "Lévi publishes the Baphomet plate." }, { date: "Leviticus 17:7", event: "No sacrifices to seirim (KJV 'devils')." }], [KJ]),
  "thor-hammer": D("Scandinavia, Viking Age (c. AD 800–1050)", "Silver Mjölnir pendants in graves; English Thursday < Thor", "A Thor-amulet. Exodus 20:3.", [{ date: "Viking Age", event: "Hammer pendants as Thor's sign." }, { date: "Old English", event: "Thunresdæg still names him weekly." }], [KJ]),
  valknut: D("Germanic picture stones (e.g. Gotland); modern name and Ásatrú use", "Migration Period / Viking Age stones; 20th-c. revival", "Locked triangles near Odin-related scenes; modern pagans treat it as Odin's knot of the slain.", [{ date: "Viking Age Gotland stones", event: "Triquetra-like locked triangles in Odinic scenes." }], [KJ]),
  "triple-moon": D("20th-c. Wicca / Goddess movement (Graves's poetic triple goddess popularized)", "1940s–1970s", "Retail moon-goddess. Jeremiah's Queen of Heaven is older and named.", [{ date: "20th c.", event: "Maiden/Mother/Crone moon badge." }], [KJ]),
  skull: D("Universal death-image; medieval memento mori; Halloween merchandise", "Medieval Christian art; 19th–21st c. costume", "Psalm 90:12 is wisdom. Isaiah 8:19 is seeking the dead.", [{ date: "Medieval Europe", event: "Memento mori." }, { date: "Modern Halloween", event: "Skull as play-theme of the dead." }], [KJ]),
  "circle-ring": D("Rome (marriage ring); grimoires (magic circle as a working boundary)", "Roman; early modern Solomonic MSS (rites not given)", "A circle binds in occult doctrine. A wedding band is Roman furniture. Test the use.", [{ date: "Rome", event: "Anulus pronubus." }], [KJ]),
  "pyramid-eye": D("Philadelphia / Continental Congress, 1782 (design); Egypt (pyramid form far older)", "20 June 1782 approval; 1935 on the dollar", "Thomson: Providence and lasting union. Later conspiracy literature fuses it with Egypt and lodges. Present the official explanation and the later reading as a conflict.", [{ date: "1776–1782", event: "Committees fail; Thomson/Barton design approved 20 June 1782." }, { date: "1935", event: "Reverse appears on the one-dollar bill." }], [NARA_SEAL, KJ]),
  "masonic-square": D("London speculative Freemasonry", "Grand Lodge of 1717 as a conventional landmark; tools older as trade", "Public badge of a lodge religion of the Architect and of oaths (James 5:12).", [{ date: "1717, London", event: "Premier Grand Lodge; square and compasses become the public emblem." }], [KJ]),
  obelisk: D("Egypt; then Rome as trophies; then modern civic copies (Washington 1884)", "Pharaonic cult; Roman re-erection (including the Vatican circus obelisk); Washington Monument dedicated 1885 (completed 1884)", "A petrified sun-ray of another god standing in 'Christian' capitals.", [{ date: "Pharaonic Egypt", event: "Temple obelisks." }, { date: "Imperial Rome", event: "Obelisks moved as spoils." }, { date: "1884, Washington, D.C.", event: "Civic obelisk completed." }], [NPS_WAMO, KJ]),
  "number-666": D("Asia Minor, Revelation (late 1st c.); Irenaeus discusses it in Gaul, late 2nd c.", "Revelation 13:18; Irenaeus Against Heresies 5.30; some MSS 616", "A number to count with wisdom, not a Halloween font.", [{ date: "Late 1st c.", event: "Revelation 13:18." }, { date: "c. AD 180, Lyons", event: "Irenaeus on the number and variants." }], [KJ, IRENAEUS666]),
  "egg-hare": D("European spring folk on the English Easter", "Medieval–early modern eggs after Lent; hares as folk fertility; commercial Easter 19th–20th c.", "Exodus 12's signs are lamb, unleavened bread, bitter herbs.", [{ date: "Exodus 12", event: "Appointed foods of Passover." }, { date: "European folk", event: "Eggs and hares attached to the English Easter." }], [KJ, BEDE_LAT]),
  "janus-door": D("Rome", "Archaic Roman cult; Julian 1 January", "Two-faced god of gates. Tertullian lists his New Year.", [{ date: "Roman Forum", event: "Janus Geminus; doors of war and peace." }], [KJ, TERT_IDOL]),
  "cupid-heart": D("Greece/Rome (Eros/Cupid); Valentine retail later", "Classical; 19th-c. cards", "A love-god's brand.", [{ date: "Classical", event: "Eros/Cupid." }, { date: "19th c.", event: "Heart-and-arrow merchandise." }], [KJ]),
  maypole: D("England and wider Germanic spring folk", "Late medieval–early modern", "Green-tree rite in daylight clothes.", [{ date: "Early modern England", event: "Maypoles; Puritan attacks." }], [KJ]),

  satan: D("Hebrew Bible (Job, Zechariah, Chronicles) and New Testament (Gospels, Revelation)", "Job as a wisdom book of the first millennium BC in setting; NT 1st c. AD", "Adversary, accuser, deceiver of the whole world. Not a medieval cartoon.", [
    { date: "Job 1–2", event: "Satan among the sons of God, limited by YHWH." },
    { date: "Zechariah 3", event: "Satan resists Joshua; the LORD rebukes him." },
    { date: "1st c. AD", event: "Temptation narratives; Revelation 12:9 identifies dragon, serpent, Devil, Satan." },
  ], [KJ]),
  "serpent-dragon": D("Eden narrative; Isaiah's Leviathan; Revelation's dragon", "Genesis 3; Isaiah 27; Revelation 12, 20", "First deception: 'hath God said' plus opened eyes.", [{ date: "Genesis 3", event: "The subtil serpent." }, { date: "Revelation 12:9", event: "That old serpent called the Devil and Satan." }], [KJ]),
  devil: D("Greek diabolos in the NT", "1st c. AD", "Slanderer; wiles; doctrines of devils (1 Tim 4:1).", [{ date: "c. AD 60–65", event: "Ephesians 6:11–12; 1 Timothy 4:1." }], [KJ]),
  lucifer: D("Isaiah 14 taunt against the king of Babylon; Latin lucifer = morning star", "Isaiah, 8th–6th c. setting; later Christian application to Satan's pride", "Two layers: a human king who said 'I will be like the most High,' and the later reading onto the spiritual rebel. 2 Cor 11:14: Satan as an angel of light.", [{ date: "Isaiah 14:4–15", event: "Proverb against the king of Babylon; KJV 'Lucifer.'" }, { date: "c. AD 55", event: "2 Corinthians 11:14." }], [KJ]),
  beelzebub: D("Ekron (Philistia) as Baal-zebub; Gospels as prince of the devils", "2 Kings 1 (9th c. setting); Matthew 12, 1st c. AD", "Ahaziah inquires of Ekron's god. Messiah's enemies credit His exorcisms to Beelzebub.", [{ date: "2 Kings 1", event: "Baal-zebub of Ekron." }, { date: "c. AD 28–33", event: "Matthew 12:24–32." }], [KJ]),
  belial: D("Hebrew Bible 'sons of Belial'; Paul; Qumran War Scroll / Community Rule", "Deuteronomy–Samuel; 2 Cor 6:15 (c. AD 55); Qumran 2nd c. BC–1st c. AD", "What concord hath Christ with Belial? Qumran sets Belial as the Angel of Darkness.", [{ date: "c. AD 55", event: "2 Corinthians 6:14–16." }, { date: "Qumran", event: "1QS and 1QM: war against Belial." }], [KJ, DSS]),
  abaddon: D("Hebrew poetry (Job, Proverbs) as Destruction; Revelation 9:11 as the angel of the pit", "Wisdom books; Revelation late 1st c., Asia Minor", "Destroyer: Hebrew Abaddon, Greek Apollyon.", [{ date: "Late 1st c.", event: "Revelation 9:11." }], [KJ]),
  legion: D("Gadara/Gerasa region, Galilee/Decapolis", "Mark 5 / Luke 8, c. AD 28–33", "Many unclean spirits, named Legion, swine, confession of who He is.", [{ date: "c. AD 28–33", event: "Mark 5:1–20." }], [KJ]),
  python: D("Philippi, Macedonia; Greek python/oracle spirit", "Acts 16, c. AD 49–52", "A fortune-telling slave girl; owners angry when the product leaves.", [{ date: "c. AD 50", event: "Acts 16:16–19." }], [KJ]),
  azazel: D("Leviticus 16 (wilderness scapegoat) and 1 Enoch 8–10 (Watcher teacher)", "Torah; Enochic expansion 3rd–1st c. BC (Qumran copies)", "Keep the layers: Yom Kippur ordinance vs Enoch's bound Watcher. 2 Peter 2:4 / Jude 6 name angels that sinned without the name Azazel.", [{ date: "Leviticus 16", event: "One lot for YHWH, one for Azazel/scapegoat." }, { date: "3rd–1st c. BC", event: "1 Enoch 8–10; Qumran Enoch MSS." }], [KJ, ENOCH, DSS]),
  seirim: D("Israel/Judah, Torah and prophets", "Leviticus 17:7; 2 Chronicles 11:15; Isaiah 13:21; 34:14", "Goat-demons. Later Baphomet is 19th-c. art on an old prohibition.", [{ date: "Leviticus 17:7", event: "No more sacrifices to seirim." }], [KJ]),
  lilith: D("Isaiah 34:14 Edom-oracle; Mesopotamian lilītu background; much later Jewish folklore", "Isaiah; medieval Alphabet of Ben Sira is not canon", "KJV 'screech owl.' Do not read the whole later myth into the verse as a grimoire entry.", [{ date: "Isaiah 34:14", event: "Lilit in the ruins." }], [KJ]),
  asmodeus: D("Diaspora tale in Tobit (Apocrypha); later demonology", "Tobit often dated 3rd–2nd c. BC; 1611 KJV Apocrypha", "Tobit: Raphael binds him. Later lists make him a 'king of lust' — post-biblical ranking.", [{ date: "Tobit 3:8; 8:3", event: "Asmodeus the evil spirit." }], [KJ]),
  "familiar-spirits": D("Israel's law; Endor in Saul's reign", "Leviticus 19–20; Deuteronomy 18; 1 Samuel 28", "The occupation. No entertainment clause.", [{ date: "1 Samuel 28", event: "Saul at Endor." }], [KJ]),
  mammon: D("Jesus' teaching in Galilee/Judea", "Matthew 6:24; Luke 16:13, c. AD 28–33", "A rival master. Later allegory personified him as a devil of greed.", [{ date: "Sermon on the Mount", event: "Ye cannot serve God and mammon." }], [KJ]),
  leviathan: D("Hebrew poetry; Ugaritic sea-dragon background as extra-biblical context", "Job 41; Psalm 74; Isaiah 27:1", "Creature God made. Later Satanism nicknamed a glyph. Do not replace the verses with the nickname.", [{ date: "Isaiah 27:1", event: "The LORD will punish Leviathan the piercing serpent." }], [KJ]),
  "prince-persia": D("Daniel's visions, Persian period setting", "Daniel 10, 6th–2nd c. dating dispute of the book; the scene is empire-war in the unseen", "A territorial prince withstood Michael twenty-one days. Not a license to map every modern flag.", [{ date: "Daniel 10:13, 20–21", event: "Prince of Persia; prince of Grecia; Michael." }], [KJ]),
  baal: D("Canaan / Ugarit / Israelite high places", "Ugaritic tablets 14th–13th c. BC (Ras Shamra); Judges–Kings; Elijah contest 1 Kings 18 (9th c. setting)", "Storm-and-fertility lord. Israel limped between two opinions.", [{ date: "14th–13th c. BC, Ugarit", event: "Baal cycle tablets (extra-biblical)." }, { date: "1 Kings 18", event: "Carmel contest." }], [KJ]),
  ashtoreth: D("Sidon / Canaan; Solomon's high places", "Judges 2:13; 1 Kings 11:5; 2 Kings 23:13", "Goddess beside Baal. Do not rest the case on a fake Ishtar=Easter etymology.", [{ date: "1 Kings 11:5", event: "Solomon went after Ashtoreth of the Zidonians." }], [KJ]),
  molech: D("Ammon / Judah, Valley of Hinnom (Tophet)", "Leviticus 18:21; 20:2–5; 2 Kings 23:10; Jeremiah 32:35, late monarchy", "Children through the fire. Not a metaphor for a busy calendar.", [{ date: "Late 7th c. BC", event: "Josiah defiles Topheth (2 Kings 23:10)." }], [KJ]),
  chemosh: D("Moab; high place east of Jerusalem under Solomon", "1 Kings 11:7; Mesha Stele c. 830–805 BC from Dhiban, now in the Louvre", "Mesha boasts in Kamosh. Extra-biblical stone next to Kings.", [{ date: "c. 830–805 BC, Dhiban", event: "Mesha Stele: sanctuary to Chemosh, war with Israel." }, { date: "1 Kings 11:7", event: "Solomon's high place for Chemosh." }], [LOUVRE_MESHA, KJ]),
  dagon: D("Philistia (Ashdod, Gaza)", "Judges 16; 1 Samuel 5", "The idol falls before the ark, head and hands on the threshold.", [{ date: "1 Samuel 5", event: "Dagon fallen before the ark of the LORD." }], [KJ]),
  tammuz: D("Jerusalem temple precinct; Mesopotamian Dumuzi background", "Ezekiel 8:14, 6th c. BC setting of the vision", "Women weeping for Tammuz at the LORD's house. Later tracts that make every spring feast 'Tammuz' often overreach; the verse is specific.", [{ date: "Ezekiel 8:14", event: "Weeping for Tammuz at the north gate of the LORD's house." }], [KJ]),
  "queen-heaven": D("Judah, late monarchy / early exile", "Jeremiah 7 and 44", "See the tradition card. Family cult with a prosperity defense.", [{ date: "c. 586 BC horizon", event: "Jeremiah 44: the remnant in Egypt still defend the cakes." }], [KJ]),
  "gad-meni": D("Judah, Isaiah 65", "Isaiah 65:11", "Fortune and Destiny with a place-setting.", [{ date: "Isaiah 65:11", event: "Table for Gad, drink for Meni." }], [KJ]),
  "golden-calf": D("Wilderness of Sinai / later Bethel and Dan", "Exodus 32 (narrative of the departure from Egypt); 1 Kings 12:26–33 (Jeroboam, 10th c. setting)", "The master key: Egypt's form, YHWH's name, a feast God did not accept.", [{ date: "Exodus 32:4–5", event: "Molten calf; 'these be thy gods'; a feast to the LORD." }, { date: "1 Kings 12", event: "Jeroboam's calves as royal policy." }], [KJ]),
  "binsfeld-princes": D("Trier, Peter Binsfeld, 1589", "1589 treatise on witches' confessions", "A late Catholic filing of seven names onto seven sins. Not a verse list. Not a summoning key.", [{ date: "1589", event: "Binsfeld, Tractatus de confessionibus maleficorum." }], [KJ]),
  "goetia-note": D("Early modern Europe; English 17th-c. Lemegeton MSS (e.g. British Library Sloane collection)", "Weyer, Pseudomonarchia Daemonum, 1577; Lemegeton / Ars Goetia circulating in 17th-c. English manuscripts", "Seventy-two named spirits with ranks and seals, claiming Solomon. 1 Kings 4 describes Solomon's wisdom as nature, proverb, and song — not a spirit-registry. Seals are not reproduced here (Deut 18; Acts 19:19).", [
    { date: "1 Kings 4:29–34", event: "Solomon's wisdom described without a demon-directory." },
    { date: "1577", event: "Weyer's catalog of names (partly satirical toward witch-hunters)." },
    { date: "17th c., England", event: "Lemegeton MSS; Ars Goetia as book one." },
    { date: "Acts 19:19, Ephesus, c. AD 54", event: "Curious arts burned, valued at fifty thousand pieces of silver." },
  ], [KJ]),
  plancy: D("Paris, Collin de Plancy", "Dictionnaire Infernal 1818; illustrated 1863 (Louis Le Breton)", "A 19th-c. picture-book of hell. Not Isaiah's field guide.", [{ date: "1818 / 1863, Paris", event: "Dictionary and popular engravings." }], [KJ]),
  "crowley-aiwass": D("Cairo, 1904 (Crowley's claim); then O.T.O. / Thelema", "8–10 April 1904 claimed dictation of The Book of the Law", "A 20th-c. prophet of self-as-god. Deuteronomy 13 tests prophets. Seals/rites not taught here.", [{ date: "1904, Cairo", event: "Crowley claims Aiwass dictated 'Do what thou wilt.'" }], [KJ]),

  "watchers-genesis": D("Antediluvian world (Genesis 6); interpreted in 1 Enoch and at Qumran", "Genesis 6 in the Torah; 1 Enoch 6–16 (3rd–1st c. BC copies at Qumran); Jude 6; 2 Peter 2:4", "Sons of God, daughters of men, giants/Nephilim, then the flood. Two ancient readings: heavenly beings who left their estate, or the line of Seth. 1 Enoch and Jude/2 Peter weigh toward angels that sinned. Present the conflict; do not hide Enoch or the epistles.", [
    { date: "Genesis 6:1–4", event: "Sons of God, daughters of men, Nephilim." },
    { date: "3rd–1st c. BC", event: "1 Enoch 6–16: Watchers, Semjaza, Azazel, oath on Mount Hermon, teaching of weapons and adornment." },
    { date: "Qumran", event: "Aramaic Enoch (4Q201–202, 4Q204–212) and Genesis Apocryphon." },
    { date: "c. AD 60–80", event: "2 Peter 2:4: angels that sinned, tartarus, chains. Jude 6: angels who kept not their first estate." },
  ], [SEF_GEN6, ENOCH, DSS, KJ]),
  semjaza: D("1 Enoch 6–8 (Mount Hermon in the narrative)", "Enochic, 3rd–1st c. BC; not a 66-book proper name", "Chief of the Watchers who leads the descent in 1 Enoch 6. Not a Goetic seal. Identified so the later catalogs are not mistaken for Torah.", [{ date: "1 Enoch 6", event: "Semjaza and two hundred descend; oath on Hermon." }], [ENOCH, DSS]),
  "enoch-teachings": D("1 Enoch 8 (Azazel and the chiefs' crafts)", "Same Enochic corpus", "Enoch's charge: the Watchers taught swords, shields, metals, cosmetics, root-cuttings, astrology — the way of the nations as leaked heaven-craft. That is a Second Temple explanation of Genesis 6, not a lab manual.", [{ date: "1 Enoch 8:1–3", event: "Azazel teaches weapons and adornment; others teach signs of heaven." }], [ENOCH]),
  "jude-watchers": D("Jude writing to believers, using Enoch", "Jude 6, 14–15; late 1st c.", "Jude quotes 1 Enoch 1:9 about the Lord coming with ten thousands of his saints, and cites angels who left their habitation. The NT itself points at that corpus.", [{ date: "Jude 6, 14–15", event: "Angels in everlasting chains; Enoch's prophecy cited." }], [KJ, ENOCH]),
  "peter-tartarus": D("2 Peter", "2 Peter 2:4–5, next to the flood", "Angels that sinned cast down to hell (tartarōsas), reserved unto judgment; then the old world overflowed with water. The flood and the Watchers sit in one paragraph.", [{ date: "2 Peter 2:4–5", event: "Angels, tartarus, flood of Noah." }], [KJ]),
  "rev-dragon-angels": D("Revelation 12, heavenly war", "Late 1st c., Asia Minor", "The dragon's tail draws the third part of the stars; he is cast out, and his angels with him. A named host of fallen angels under the dragon already identified as Satan.", [{ date: "Revelation 12:4, 7–9", event: "War in heaven; dragon and his angels cast out." }], [KJ]),
  mastema: D("Book of Jubilees (Ethiopic; Hebrew fragments at Qumran)", "Jubilees often dated 2nd c. BC", "Prince of the accusing spirits in Jubilees — extra-canonical. Qumran copied Jubilees. Not a summoning name; a Second Temple way of talking about the adversary's office.", [{ date: "2nd c. BC", event: "Jubilees; 4QJubilees at Qumran." }], [DSS]),
  shedim: D("Deuteronomy 32:17; Psalm 106:37", "Song of Moses; later psalm of national confession", "They sacrificed unto devils (shedim), not to God; to gods they knew not. Paul echoes the category in 1 Cor 10:20.", [{ date: "Deuteronomy 32:17", event: "Sacrifices to shedim." }, { date: "Psalm 106:37", event: "Sons and daughters unto devils." }, { date: "c. AD 55", event: "1 Corinthians 10:20: Gentiles sacrifice to devils." }], [KJ]),
  rahab: D("Isaiah 51:9; Psalm 89:10 — the proud sea-monster / Egypt as 'Rahab'", "Exodus memory in the prophets", "A crushed chaos-monster and a name for Egypt. Not the harlot of Jericho. Later occult lists sometimes steal the name.", [{ date: "Isaiah 51:9", event: "Art thou not it that hath cut Rahab and wounded the dragon?" }], [KJ]),
};

export function getDossier(id) {
  return DOSSIER[id] || null;
}
