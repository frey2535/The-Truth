import { DSS_GROUP } from "./dssWorks";

// Canonical Bible — modern KJV (aruljohn/Bible-kjv). Filenames are camelCase with no spaces.
export const CANON_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation",
];

export const CANON_BOOK_INFO = {
  Genesis: "The creation of the world, the patriarchs, and the descent of Israel into Egypt.",
  Exodus: "Israel's deliverance from Egypt, the covenant at Sinai, and the building of the tabernacle.",
  Leviticus: "The priestly law of sacrifice, holiness, and the worship of Israel.",
  Numbers: "The wilderness census, wanderings, and the approach to the promised land.",
  Deuteronomy: "Moses' final addresses, restating the law before Israel enters the land.",
  Joshua: "The conquest of Canaan and the allotment of the land among the tribes.",
  Judges: "The cycles of apostasy, oppression, and deliverance under Israel's judges.",
  Ruth: "The Moabite woman's loyalty in the days of the judges, in the line of David.",
  "1 Samuel": "The last judge, the first king, and the rise of David.",
  "2 Samuel": "David's reign over Israel — his victories, sin, and the promise of an enduring house.",
  "1 Kings": "Solomon's temple and the divided kingdoms of Israel and Judah.",
  "2 Kings": "The fall of Samaria and Jerusalem, and the exile of both kingdoms.",
  "1 Chronicles": "Genealogies from Adam and a retelling of David's reign.",
  "2 Chronicles": "Judah's kings from Solomon to the exile, centered on the temple.",
  Ezra: "The return from exile and the rebuilding of the temple in Jerusalem.",
  Nehemiah: "The rebuilding of Jerusalem's walls and the renewal of the covenant.",
  Esther: "The Jewish queen who delivers her people in the Persian court.",
  Job: "The righteous sufferer's contest with friends and with God.",
  Psalms: "The prayers, hymns, and laments of Israel, attributed largely to David.",
  Proverbs: "Wisdom sayings on the fear of the Lord, justice, and daily life.",
  Ecclesiastes: "The Preacher's search for meaning under the sun.",
  "Song of Solomon": "The love poem of bride and bridegroom.",
  Isaiah: "Judgment and consolation, including the servant songs and the hope of restoration.",
  Jeremiah: "The weeping prophet's oracles against Judah and the coming exile.",
  Lamentations: "Dirges over the destruction of Jerusalem.",
  Ezekiel: "Visions of God's glory, the fall of Jerusalem, and a restored temple.",
  Daniel: "Court tales and apocalyptic visions in the Babylonian and Persian empires.",
  Hosea: "The prophet's marriage as a sign of the Lord's love for unfaithful Israel.",
  Joel: "The locust plague and the promise of the outpoured Spirit.",
  Amos: "Oracles of justice against Israel and the nations.",
  Obadiah: "The shortest prophetic book — judgment on Edom.",
  Jonah: "The reluctant prophet sent to Nineveh.",
  Micah: "Judgment on Samaria and Jerusalem, and the hope of a ruler from Bethlehem.",
  Nahum: "The oracle of Nineveh's fall.",
  Habakkuk: "The prophet's complaint and the vision that the righteous shall live by faith.",
  Zephaniah: "The day of the Lord against Judah and the nations.",
  Haggai: "The call to rebuild the temple after the return from exile.",
  Zechariah: "Night visions and oracles of restoration and a coming king.",
  Malachi: "The last prophetic book of the Old Testament, looking toward Elijah's return.",
  Matthew: "The Gospel of Jesus as Messiah and son of David, with the Sermon on the Mount.",
  Mark: "The shortest Gospel — the beginning of the good news of Jesus Christ.",
  Luke: "An orderly account of Jesus' life, death, and resurrection, written for Theophilus.",
  John: "The Gospel of the Word made flesh, the signs, and eternal life.",
  Acts: "The apostles' witness from Jerusalem to Rome after the resurrection.",
  Romans: "Paul's letter on the gospel, justification, and the mercy shown to Jew and Gentile.",
  "1 Corinthians": "Paul's counsel to a divided church on worship, gifts, and the resurrection.",
  "2 Corinthians": "Paul's defense of his ministry and the collection for the saints.",
  Galatians: "The letter insisting that justification is by faith, not by works of the law.",
  Ephesians: "The unity of Jews and Gentiles in Christ and the armor of God.",
  Philippians: "Paul's letter of joy from prison to the church at Philippi.",
  Colossians: "The supremacy of Christ over all things visible and invisible.",
  "1 Thessalonians": "Encouragement to a young church and teaching on the Lord's coming.",
  "2 Thessalonians": "Correction concerning the day of the Lord and a call to steadfast work.",
  "1 Timothy": "Instructions to Timothy on church order, teaching, and godliness.",
  "2 Timothy": "Paul's last letter — a charge to preach the word.",
  Titus: "Instructions for appointing elders and teaching sound doctrine in Crete.",
  Philemon: "Paul's appeal for the runaway Onesimus as a brother.",
  Hebrews: "The argument that Jesus is the better high priest and the mediator of a better covenant.",
  James: "A letter on living faith, wisdom, and care for the poor.",
  "1 Peter": "Counsel to scattered believers suffering for the name of Christ.",
  "2 Peter": "A warning against false teachers and a reminder of the coming day of the Lord.",
  "1 John": "A letter on walking in the light, love, and the confession of Jesus come in the flesh.",
  "2 John": "A brief warning not to receive those who deny that Jesus Christ has come in the flesh.",
  "3 John": "A personal letter commending hospitality and naming Diotrephes and Demetrius.",
  Jude: "A call to contend for the faith, quoting Enoch against ungodly intruders.",
  Revelation: "The apocalypse of Jesus Christ — letters to the churches and visions of the end.",
};

export const CANON_BOOK_ENTRIES = CANON_BOOKS.map((title) => ({
  title,
  desc: CANON_BOOK_INFO[title],
}));

// Apocrypha — 1611 KJV (aruljohn/Bible-kjv-1611). Filenames keep their spaces.
export const APOCRYPHA_BOOKS = [
  "1 Esdras", "2 Esdras", "Tobit", "Judith", "Wisdom of Solomon", "Ecclesiasticus",
  "Baruch", "Letter of Jeremiah", "Prayer of Azariah", "Susanna", "Bel and the Dragon",
  "Prayer of Manasseh", "1 Maccabees", "2 Maccabees",
];

export const APOCRYPHA_BOOK_INFO = {
  "1 Esdras": "A Greek parallel to the Ezra–Nehemiah narrative, with the story of the three bodyguards.",
  "2 Esdras": "Apocalyptic visions of Ezra, including the eagle vision and the hope of the messiah.",
  "Tobit": "A faithful Israelite's story of piety, exile, and divine provision.",
  "Judith": "The heroine who delivers Israel by slaying the Assyrian general Holofernes.",
  "Wisdom of Solomon": "Wisdom literature praising divine wisdom and the immortality of the righteous.",
  "Ecclesiasticus": "The wisdom of Jesus ben Sirach on godly, practical living.",
  "Baruch": "The scribe of Jeremiah's prayers and the letter to the exiles.",
  "Letter of Jeremiah": "A warning to the exiles against the worship of idols.",
  "Prayer of Azariah": "The prayer of the three young men in the fiery furnace.",
  "Susanna": "The story of Susanna and the discerning judgment of Daniel.",
  "Bel and the Dragon": "Daniel's exposure of the idols Bel and the living dragon.",
  "Prayer of Manasseh": "The penitential prayer of King Manasseh of Judah.",
  "1 Maccabees": "The Maccabean revolt against Antiochus IV and the rededication of the temple.",
  "2 Maccabees": "A parallel account of the Maccabean martyrs and the purification of the temple.",
};

// Additional apocryphal / deuterocanonical books beyond the 1611 KJV set.
// type "markdown" => fetched in-app (slug uses scrollmapper; url is a direct markdown URL).
// type "web"      => fetched in-app via the fetch_apocrypha_text backend function (World English Bible, public domain).
// type "info"     => description + external source link (no clean in-app text source confirmed).
export const EXTRA_APOCRYPHA_BOOKS = [
  { id: "1_enoch", title: "Book of Enoch (1 Enoch)", type: "markdown", slug: "1-enoch", desc: "The Book of Enoch, quoted in the New Testament book of Jude and treasured in the Ethiopic tradition." },
  { id: "jubilees", title: "Book of Jubilees", type: "markdown", url: "/corpus/manuscripts/jubilees.md", desc: "A 2nd-century BC retelling of Genesis and Exodus, also called the Lesser Genesis." },
  { id: "psalms_of_solomon", title: "Psalms of Solomon", type: "markdown", slug: "psalms-of-solomon", desc: "First-century BC Jewish psalms reflecting messianic hope." },
  { id: "additions_esther", title: "Additions to Esther", type: "web", bookId: "additions_esther", desc: "The Greek additions to Esther, collected as Greek Esther in the Septuagint. Text: World English Bible (public domain)." },
  { id: "psalm_151", title: "Psalm 151", type: "web", bookId: "psalm_151", desc: "A short psalm found in the Septuagint and received in the Orthodox canon. Text: World English Bible (public domain)." },
  { id: "3_maccabees", title: "3 Maccabees", type: "web", bookId: "3_maccabees", desc: "A Greek deuterocanonical book on the persecution of the Jews under Ptolemy IV. Text: World English Bible (public domain)." },
  { id: "4_maccabees", title: "4 Maccabees", type: "web", bookId: "4_maccabees", desc: "A philosophical discourse on devout reason and the Maccabean martyrs. Text: World English Bible (public domain)." },
  { id: "odes", title: "Odes", type: "info", desc: "The Odes of the Septuagint — a collection of biblical canticles (the Song of Moses, the Prayer of Hannah, the Prayer of Habakkuk, the Magnificat, the Nunc Dimittis, and others). Most of its content is drawn from passages already in the app: Exodus 15, Deuteronomy 32, 1 Samuel 2, Habakkuk 3, Jonah 2, Daniel 3, and Luke 1–2.", sourceUrl: "https://www.ccel.org/b/brenton/septuagint/" },
];

export const bibleBookUrl = (book, apocrypha) =>
  apocrypha
    ? `/corpus/apocrypha/${book.replace(/ /g, "_")}.json`
    : `/corpus/bible/${book.replace(/ /g, "")}.json`;

export const manuscriptUrl = (slug) => `/corpus/manuscripts/${slug}.md`;

export const CODEX_VATICANUS_MD = `# Codex Vaticanus (Codex Vaticanus Graecus 1209)

**Date:** c. 300–325 AD (4th century)
**Material:** Parchment vellum, Greek uncial (capital) script
**Held at:** Bibliotheca Apostolica Vaticana (Vatican Library), Rome

Codex Vaticanus is one of the two oldest and most important extant manuscripts of the Greek Bible. Written in uncial Greek on fine parchment, it preserves the text of the Septuagint Old Testament and most of the New Testament.

## Contents

**Old Testament (Septuagint order):** Genesis–2 Chronicles; 1 Esdras; 2 Esdras (Ezra–Nehemiah); Psalms; Proverbs; Ecclesiastes; Song of Songs; Job; Wisdom; Ecclesiasticus (Sirach); Esther; Judith; Tobit; the Twelve Minor Prophets; Isaiah; Jeremiah; Baruch; Lamentations; Epistle of Jeremiah; Ezekiel; Daniel.

**New Testament:** Gospels (Matthew, Mark, Luke, John); Acts; General Epistles; Pauline Epistles; Hebrews (extant only through Hebrews 9:14).

**Missing portions:** Genesis 1:1–46:28a and Psalm 105:27–137:6b are lost. The New Testament lacks 1 Timothy, 2 Timothy, Titus, Philemon, and Revelation.

## Notable textual features

- **Mark ends at 16:8** — the longer ending (Mark 16:9–20) is absent.
- The Pericope Adulterae (John 7:53–8:11) is absent.
- Several verses found in later manuscripts are absent, including Matthew 12:47; 16:2b–3; 17:21; 18:11; 23:14; Mark 7:16; 9:44; 9:46; 11:26; 15:28.

## Significance

Together with Codex Sinaiticus, Vaticanus is a foundational witness for modern critical editions of the Greek New Testament (such as the Nestle-Aland text). Its text is generally regarded as Alexandrian in character.

> Holding: Biblioteca Apostolica Vaticana, Vat. gr. 1209. This app does not contain a page-by-page transcription.
`;

export const CODEX_SINAITICUS_MD = `# Codex Sinaiticus

**Date:** c. 330–360 AD (mid-4th century)
**Material:** Parchment vellum, Greek uncial script
**Held at:** British Library (London), National Library of Russia (St. Petersburg), Saint Catherine's Monastery (Sinai), Leipzig University Library

Codex Sinaiticus is the earliest known complete New Testament and one of the two oldest great uncial manuscripts of the Greek Bible. It was discovered by the German scholar Constantin von Tischendorf at Saint Catherine's Monastery on Mount Sinai between 1844 and 1859.

## Contents

**Old Testament (Septuagint):** About half of the Old Testament survives, including portions of Genesis, Numbers, Deuteronomy, Joshua, Judges, 1–4 Kingdoms (1–2 Samuel and 1–2 Kings), 1–2 Chronicles, Ezra, Nehemiah, Esther, Tobit, Judith, Job, Proverbs, Ecclesiastes, Song of Songs, Wisdom, Sirach, Isaiah, Jeremiah, Lamentations, the Minor Prophets, Ezekiel, and Daniel.

**New Testament:** The complete New Testament — the earliest complete copy in existence — Gospels, Acts, the General Epistles, the Pauline Epistles, and Revelation.

**Extra-canonical works included:** The Epistle of Barnabas and the Shepherd of Hermas (partially) appear at the end, writings read in the early Church but not included in the later 27-book New Testament canon.

## Notable textual features

- **Mark ends at 16:8** — the longer ending (Mark 16:9–20) is absent.
- The Pericope Adulterae (John 7:53–8:11) is absent.
- The text is Alexandrian in character and is a primary witness for modern critical editions of the New Testament.

## Significance

Codex Sinaiticus is a cornerstone of New Testament textual criticism. The manuscript is now divided among four institutions; a digital transcription and high-resolution images are available through the Codex Sinaiticus project.

> Holdings: British Library, National Library of Russia, Saint Catherine's Monastery, Leipzig University Library. This app does not contain a page-by-page transcription.
`;

export const MANUSCRIPT_GROUPS = {
  enoch: {
    title: "Book of Enoch",
    desc: "The Book of Enoch, quoted in the New Testament book of Jude and treasured in the Ethiopic and Slavonic traditions.",
    items: [
      {
        slug: "1-enoch",
        title: "1 Enoch (Ethiopic)",
        desc: "The oldest known apocalyptic text — the Watchers, the Nephilim, and Enoch's tour of the heavens.",
      },
      {
        slug: "2-enoch",
        title: "2 Enoch (Slavonic)",
        desc: "Enoch's ascent through the seven heavens, preserved in the Slavonic tradition.",
      },
    ],
  },
  dss: DSS_GROUP,
  other: {
    title: "Other Early Christian & Jewish Manuscripts",
    desc: "Extra-biblical writings revered by early Christians and Jews, surviving in whole or in part. Stored in this app.",
    items: [
      { slug: "psalms-of-solomon", title: "Psalms of Solomon", desc: "First-century BC Jewish psalms reflecting messianic hope." },
      { slug: "lives-of-the-prophets", title: "Lives of the Prophets", desc: "Early traditions on the lives and deaths of the Old Testament prophets." },
      { slug: "testament-of-zebulun", title: "Testament of Zebulun", desc: "One of the Testaments of the Twelve Patriarchs." },
      { slug: "ladder-of-jacob", title: "Ladder of Jacob", desc: "An apocalyptic expansion of Jacob's dream at Bethel." },
      { slug: "2-hermas", title: "The Shepherd of Hermas", desc: "An early Christian writing widely read in the early Church." },
    ],
  },
  fathers: {
    title: "Early Christian Writings",
    desc: "The Ante-Nicene Fathers, Volume 1 (Roberts–Donaldson, 1885, public domain): Clement, Ignatius, Polycarp, Barnabas, Papias, Justin Martyr, and Irenaeus. Stored in this app.",
    items: [
      {
        title: "Ante-Nicene Fathers, Volume 1",
        desc: "Clement of Rome, Mathetes, Polycarp, Ignatius, Barnabas, Papias, Justin Martyr, and Irenaeus. English of 1885.",
        file: "/corpus/fathers/ante-nicene-vol1.txt",
        plain: true,
      },
    ],
  },
  josephus: {
    title: "Josephus",
    desc: "Flavius Josephus, Antiquities of the Jews and The Jewish War, William Whiston translation (public domain). Stored in this app. Josephus is a first-century Jewish historian, not Scripture.",
    items: [
      {
        title: "Antiquities of the Jews",
        desc: "From creation through the war with Rome, including the notices of Pilate, John, and James.",
        file: "/corpus/fathers/josephus-antiquities.txt",
        plain: true,
      },
      {
        title: "The Jewish War",
        desc: "Josephus' account of the war with Rome. Not Scripture.",
        file: "/corpus/fathers/josephus-wars.txt",
        plain: true,
      },
    ],
  },
  codices: {
    title: "Great Bible Codices",
    desc: "The oldest and most important complete Greek manuscripts of the Bible — Codex Vaticanus and Codex Sinaiticus, both 4th-century uncials.",
    items: [
      {
        slug: "codex-vaticanus",
        title: "Codex Vaticanus",
        desc: "A 4th-century Greek uncial of the Bible, held at the Vatican Library.",
        content: CODEX_VATICANUS_MD,
        sourceUrl: "",
      },
      {
        slug: "codex-sinaiticus",
        title: "Codex Sinaiticus",
        desc: "The earliest complete New Testament, a 4th-century Greek uncial found at Sinai.",
        content: CODEX_SINAITICUS_MD,
        sourceUrl: "https://www.codexsinaiticus.org/en/",
      },
    ],
  },
};