/** Works from the master list that are not auto-built from stored Bible / Apocrypha / DSS cards. */

const UNKNOWN_AUTHOR = "UNKNOWN. Traditional ascription is not the same as academic attribution.";

const L = {
  deut: "DEUTEROCANONICAL",
  orth: "EASTERN ORTHODOX CANON",
  eth: "ETHIOPIAN CANON",
  pse: "OLD TESTAMENT PSEUDEPIGRAPHA",
  dss: "DEAD SEA SCROLL",
  af: "APOSTOLIC FATHER",
  early: "EARLY CHRISTIAN",
  apo: "CHRISTIAN APOCRYPHA",
  gos: "APOCRYPHAL GOSPEL",
  acts: "APOCRYPHAL ACTS",
  epp: "APOCRYPHAL EPISTLE",
  apoc: "APOCRYPHAL APOCALYPSE",
  gno: "GNOSTIC",
  val: "VALENTINIAN",
  seth: "SETHIAN",
  marc: "MARCIONITE",
  jc: "JEWISH-CHRISTIAN",
  pat: "PATRISTIC",
  her: "HERESIOLOGICAL",
  lit: "LITURGICAL",
  creed: "CREED",
  coun: "CHURCH COUNCIL",
  ms: "MANUSCRIPT",
  frag: "FRAGMENT",
  lost: "LOST TEXT / QUOTED FRAGMENTS",
  recon: "RECONSTRUCTED TEXT",
  jew: "JEWISH COMPARATIVE SOURCE",
  greco: "GRECO-ROMAN HISTORICAL SOURCE",
  med: "MEDIEVAL CHRISTIAN",
  ref: "REFORMATION",
  cath: "CATHOLIC",
  orthod: "ORTHODOX",
  prot: "PROTESTANT",
  dispA: "DISPUTED AUTHORSHIP",
  dispD: "DISPUTED DATE",
  forg: "KNOWN FORGERY",
  modf: "MODERN FORGERY",
  comp: "COMPARATIVE (NOT CHRISTIAN SCRIPTURE)",
};

function E(id, title, sections, labels, extra = {}) {
  return { id, title, sections, labels, ...extra };
}

const PAPYRI = [
  1, 4, 5, 13, 15, 16, 18, 20, 22, 23, 24, 25, 27, 28, 29, 30, 32, 35, 37, 38, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 72, 74, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
  113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135,
  136, 137, 138, 139,
].map((n) =>
  E(`p${n}`, `𝔓${n} / P${n}`, [47], [L.ms, L.frag], {
    textStatus: "manuscript_witness",
    lang: "Greek",
    canon: "A New Testament papyrus witness, not a separate book of Scripture.",
    date: "Assigned palaeographically; century varies by papyrus. Disputed in some cases.",
    earliest: `The papyrus itself is the witness.`,
    claimed: "Scribe unknown",
    probable: "Copyist unknown",
    background: "Catalogued New Testament papyrus. This app does not store a diplomatic transcription.",
  })
);

export const EXTRA_DEFS = [
  E("song-of-the-three", "Song of the Three Holy Children", [3], [L.deut], {
    alt: ["Prayer of Azariah and the Song of the Three"],
    stored: { kind: "apocrypha", book: "Prayer of Azariah" },
    textStatus: "complete_stored",
    background: "In the 1611 Apocrypha this stands with the Prayer of Azariah (Daniel 3 expansion). Open Prayer of Azariah.",
  }),
  E("greek-esther", "Greek Esther / Additions to Esther", [3], [L.deut], {
    stored: { kind: "web", bookId: "additions_esther" },
    textStatus: "complete_stored",
    alt: ["Additions to Esther"],
  }),
  E("odes-lxx", "Odes (Septuagint collection)", [4], [L.orth, L.lit], {
    alt: ["Odes"],
    background: "Septuagint canticles drawn largely from Exodus 15, Deuteronomy 32, 1 Samuel 2, Habakkuk 3, Jonah 2, Daniel 3, and Luke 1–2 — passages already stored.",
    textStatus: "not_stored",
  }),
  E("1-meqabyan", "1 Meqabyan", [5], [L.eth], {
    background: "Ethiopian book. Not 1 Maccabees. Different work. No pre-1929 English translation is stored here; later printings are still in copyright.",
    canon: "Ethiopian Orthodox canon. Not the Greek Maccabees.",
    textStatus: "not_stored",
  }),
  E("2-meqabyan", "2 Meqabyan", [5], [L.eth], {
    background: "Ethiopian book. Not 2 Maccabees. No pre-1929 English translation is stored here.",
    textStatus: "not_stored",
  }),
  E("3-meqabyan", "3 Meqabyan", [5], [L.eth], {
    background: "Ethiopian book. Not 3 Maccabees. No pre-1929 English translation is stored here.",
    textStatus: "not_stored",
  }),
  E("sinodos", "Sinodos", [5, 19], [L.eth, L.early], {
    stored: { kind: "md", slug: "sinodos" },
    textStatus: "complete_stored",
    translation: "George Horner, 1904 (public domain).",
    background: "Ethiopian church-order collection. Stored English is Horner’s translation of the Ethiopic statutes.",
  }),
  E("book-of-the-covenant-eth", "Book of the Covenant (Ethiopic)", [5], [L.eth], {
    stored: { kind: "md", slug: "book-of-the-covenant-eth" },
    textStatus: "complete_stored",
    translation: "Cooper and Maclean, 1902 (public domain).",
    background: "The Ethiopian Book of the Covenant (Mäṣḥafä kidan) is the church-order received as the Testament of Our Lord. Stored English is Cooper–Maclean, 1902.",
  }),
  E("ethiopic-clement", "Ethiopic Clement", [5], [L.eth, L.dispA], {
    stored: { kind: "md", slug: "book-of-the-covenant-eth" },
    textStatus: "complete_stored",
    translation: "Cooper and Maclean, 1902 (public domain).",
    background: "Manuscripts title this Testament as words written in eight books by Clement. The later Geʽez Qälemənṭos romance has no pre-1929 English edition stored here.",
  }),
  E("ethiopic-didascalia", "Ethiopic Didascalia", [5, 19], [L.eth, L.early], {
    stored: { kind: "md", slug: "ethiopic-didascalia" },
    textStatus: "complete_stored",
    translation: "J. M. Harden, 1920 (public domain).",
    background: "Ethiopian church-order. Stored English is Harden’s 1920 translation of the Ethiopic Didascalia.",
  }),
  E("3-enoch", "3 Enoch / Hebrew Enoch", [6], [L.pse, L.dispA], {
    alt: ["Sefer Hekhalot"],
    lang: "Hebrew",
    date: "Often placed in late antiquity. Disputed.",
    claimed: "Enoch / Rabbi Ishmael framework",
    probable: UNKNOWN_AUTHOR,
    stored: { kind: "md", slug: "3-enoch" },
    textStatus: "complete_stored",
    translation: "Hugo Odeberg, 1928 (public domain).",
    background: "Hebrew Enoch / Sefer Hekhalot. Stored English is Odeberg, 1928.",
  }),
  E("book-of-giants-aramaic", "Aramaic Book of Giants fragments", [6, 9], [L.dss, L.pse, L.frag], {
    textStatus: "quoted_only",
    fragments: "Qumran Aramaic fragments (1Q23–24, 2Q26, 4Q203, 4Q530–533, 6Q8).",
  }),
  E("book-of-giants-manichaean", "Manichaean Book of Giants traditions", [6, 43], [L.comp, L.pse], {
    background: "Later Manichaean transmission of Giants traditions. Not orthodox Scripture.",
  }),
  E("enoch-watchers", "1 Enoch — Book of the Watchers", [6], [L.eth, L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
    background: "A subsection of 1 Enoch (typically chs. 1–36). Read in the stored 1 Enoch text.",
  }),
  E("enoch-parables", "1 Enoch — Book of Parables / Similitudes", [6], [L.eth, L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
  }),
  E("enoch-astronomical", "1 Enoch — Astronomical Book", [6], [L.eth, L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
  }),
  E("enoch-dreams", "1 Enoch — Book of Dream Visions", [6], [L.eth, L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
  }),
  E("enoch-epistle", "1 Enoch — Epistle of Enoch", [6], [L.eth, L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
  }),
  E("apocalypse-of-weeks", "Apocalypse of Weeks", [6], [L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
    background: "Embedded in the stored 1 Enoch text.",
  }),
  E("animal-apocalypse", "Animal Apocalypse", [6], [L.pse], {
    stored: { kind: "md", slug: "1-enoch" },
    textStatus: "complete_stored",
    background: "Embedded in the stored 1 Enoch dream visions.",
  }),

  ...pseudepigrapha(),
  ...apostolicFathers(),
  ...gospelsInfancy(),
  ...actsLettersApocalypses(),
  ...nagHammadi(),
  ...otherGnostic(),
  ...mandaeanChurchOrders(),
  ...fathersByAuthor(),
  ...syriacMartyrMaryPilate(),
  ...listsHeresyLostMarcion(),
  ...creedsCouncilsCanon(),
  ...manuscriptsVersions(),
  ...jewishGrecoInscriptions(),
  ...liturgyMedievalModern(),
  ...PAPYRI,
];

function pseudepigrapha() {
  const titles = [
    ["life-of-adam-and-eve", "Life of Adam and Eve", ["Greek Apocalypse of Moses", "Vita Adae et Evae"]],
    ["greek-apocalypse-of-moses", "Greek Apocalypse of Moses", ["Life of Adam and Eve (Greek)"]],
    ["vita-adae", "Latin Life of Adam and Eve / Vita Adae et Evae", []],
    ["apocalypse-of-adam", "Apocalypse of Adam", []],
    ["testament-of-adam", "Testament of Adam", []],
    ["first-book-of-adam-and-eve", "The First Book of Adam and Eve", []],
    ["conflict-adam-eve", "Conflict of Adam and Eve with Satan", []],
    ["cave-of-treasures", "Cave of Treasures", []],
    ["apocalypse-of-abraham", "Apocalypse of Abraham", []],
    ["testament-of-abraham", "Testament of Abraham", []],
    ["testament-of-isaac", "Testament of Isaac", []],
    ["testament-of-jacob", "Testament of Jacob", []],
    ["joseph-and-aseneth", "Joseph and Aseneth", []],
    ["prayer-of-joseph", "Prayer of Joseph", []],
    ["history-of-joseph", "History of Joseph", []],
    ["testaments-twelve", "Testaments of the Twelve Patriarchs", []],
    ["testament-reuben", "Testament of Reuben", []],
    ["testament-simeon", "Testament of Simeon", []],
    ["testament-levi", "Testament of Levi", []],
    ["testament-judah", "Testament of Judah", []],
    ["testament-issachar", "Testament of Issachar", []],
    ["testament-dan", "Testament of Dan", []],
    ["testament-naphtali", "Testament of Naphtali", []],
    ["testament-gad", "Testament of Gad", []],
    ["testament-asher", "Testament of Asher", []],
    ["testament-joseph", "Testament of Joseph", []],
    ["testament-benjamin", "Testament of Benjamin", []],
    ["testament-job", "Testament of Job", []],
    ["testament-moses", "Testament of Moses", ["Assumption of Moses"]],
    ["assumption-of-moses", "Assumption of Moses", ["Testament of Moses"]],
    ["apocalypse-of-elijah", "Apocalypse of Elijah", []],
    ["apocalypse-of-zephaniah", "Apocalypse of Zephaniah", []],
    ["apocalypse-of-sedrach", "Apocalypse of Sedrach", []],
    ["apocalypse-of-ezra", "Apocalypse of Ezra", []],
    ["greek-apocalypse-ezra", "Greek Apocalypse of Ezra", []],
    ["questions-of-ezra", "Questions of Ezra", []],
    ["vision-of-ezra", "Vision of Ezra", []],
    ["revelation-of-ezra", "Revelation of Ezra", []],
    ["2-baruch", "Apocalypse of Baruch / 2 Baruch", ["2 Baruch"]],
    ["3-baruch", "Greek Apocalypse of Baruch / 3 Baruch", ["3 Baruch"]],
    ["4-baruch", "4 Baruch / Paraleipomena of Jeremiah", ["Paraleipomena of Jeremiah"]],
    ["martyrdom-ascension-isaiah", "Martyrdom and Ascension of Isaiah", ["Ascension of Isaiah"]],
    ["ascension-of-isaiah", "Ascension of Isaiah", []],
    ["jannes-and-jambres", "Jannes and Jambres", []],
    ["eldad-and-modad", "Eldad and Modad", []],
    ["history-of-the-rechabites", "History of the Rechabites", []],
    ["pseudo-philo", "Pseudo-Philo / Biblical Antiquities", ["Liber Antiquitatum Biblicarum"]],
    ["apocryphon-ezekiel", "Apocryphon of Ezekiel", []],
    ["apocryphon-jacob-joseph", "Apocryphon of Jacob and Joseph", []],
    ["prayer-of-jacob", "Prayer of Jacob", []],
    ["odes-of-solomon", "Odes of Solomon", []],
    ["sibylline-oracles", "Sibylline Oracles", []],
    ["book-of-noah", "Book of Noah traditions", []],
    ["treatise-of-shem", "Treatise of Shem", []],
    ["apocalypse-of-daniel-trad", "Apocalypse of Daniel traditions", []],
  ];
  const storedMd = {
    "cave-of-treasures": ["cave-of-treasures", "E. A. Wallis Budge, 1927 (public domain)."],
    "apocalypse-of-abraham": ["apocalypse-of-abraham", "G. H. Box, 1918 (public domain)."],
    "joseph-and-aseneth": ["joseph-and-aseneth", "E. W. Brooks, 1918 (public domain)."],
    "testament-job": ["testament-of-job", "Kaufmann Kohler, 1897 (public domain)."],
    "testament-moses": ["assumption-of-moses", "R. H. Charles, 1913 (public domain)."],
    "assumption-of-moses": ["assumption-of-moses", "R. H. Charles, 1913 (public domain)."],
    "2-baruch": ["2-baruch", "R. H. Charles, 1913 (public domain)."],
    "3-baruch": ["3-baruch", "H. M. Hughes in Charles, APOT 1913 (public domain)."],
    "4-baruch": ["4-baruch", "Jacques Issaverdens, 1901, from the Armenian (public domain)."],
    "martyrdom-ascension-isaiah": ["ascension-of-isaiah", "R. H. Charles, 1900 (public domain)."],
    "ascension-of-isaiah": ["ascension-of-isaiah", "R. H. Charles, 1900 (public domain)."],
    "pseudo-philo": ["pseudo-philo", "M. R. James, 1917 (public domain)."],
    "odes-of-solomon": ["odes-of-solomon", "Harris and Mingana, 1920 (public domain)."],
    "sibylline-oracles": ["sibylline-oracles", "Milton S. Terry, 1899 (public domain)."],
  };
  return titles.map(([id, title, alt]) => {
    const hit = storedMd[id];
    return E(id, title, [7], [L.pse, L.dispA], {
      alt,
      claimed: "The name in the title (pseudepigraphon).",
      probable: UNKNOWN_AUTHOR,
      canon: "Noncanonical in most churches.",
      ...(hit
        ? {
            stored: { kind: "md", slug: hit[0] },
            textStatus: "complete_stored",
            translation: hit[1],
            background: `${title} is stored in this app from a public-domain English edition.`,
          }
        : {}),
    });
  });
}

function apostolicFathers() {
  const inVol1 = new Set([
    "1-clement",
    "ignatius-ephesians",
    "ignatius-magnesians",
    "ignatius-trallians",
    "ignatius-romans",
    "ignatius-philadelphians",
    "ignatius-smyrnaeans",
    "ignatius-polycarp",
    "polycarp-philippians",
    "martyrdom-polycarp",
    "epistle-barnabas",
    "fragments-papias",
    "epistle-diognetus",
  ]);
  const items = [
    ["1-clement", "1 Clement"],
    ["2-clement", "2 Clement"],
    ["ignatius-ephesians", "Ignatius to the Ephesians"],
    ["ignatius-magnesians", "Ignatius to the Magnesians"],
    ["ignatius-trallians", "Ignatius to the Trallians"],
    ["ignatius-romans", "Ignatius to the Romans"],
    ["ignatius-philadelphians", "Ignatius to the Philadelphians"],
    ["ignatius-smyrnaeans", "Ignatius to the Smyrnaeans"],
    ["ignatius-polycarp", "Ignatius to Polycarp"],
    ["polycarp-philippians", "Letter of Polycarp to the Philippians"],
    ["martyrdom-polycarp", "Martyrdom of Polycarp"],
    ["didache", "Didache / Teaching of the Twelve Apostles"],
    ["epistle-barnabas", "Epistle of Barnabas"],
    ["fragments-papias", "Fragments of Papias"],
    ["epistle-diognetus", "Epistle to Diognetus"],
    ["quadratus", "Quadratus fragment"],
    ["early-elders-fragments", "Traditions / fragments of early Christian elders"],
  ];
  return items.map(([id, title]) => {
    const storedHere = inVol1.has(id);
    return E(id, title, [10], [L.af, L.early], {
      stored: storedHere ? { kind: "plain", file: "/corpus/fathers/ante-nicene-vol1.txt" } : null,
      textStatus: storedHere ? "complete_stored" : id === "quadratus" || id === "early-elders-fragments" ? "quoted_only" : "not_stored",
      background: storedHere
        ? `${title} is in the stored Ante-Nicene Fathers, Volume 1 (Roberts–Donaldson / Coxe). Open Early Christian Writings.`
        : `${title} is catalogued. Complete wording is not in the stored Volume 1 file.`,
      translation: storedHere ? "Public-domain English (Ante-Nicene Fathers)." : undefined,
    });
  });
}

function gospelsInfancy() {
  const gospels = [
    ["gospel-of-thomas", "Gospel of Thomas", [11, 16], [L.gos, L.gno, L.dispA], { earliest: "Greek Oxyrhynchus fragments; Coptic Nag Hammadi Codex II.", probable: "UNKNOWN. Not established as the Apostle Thomas.", disputes: "Date (1st vs 2nd century) and independence from the canonical Gospels are disputed." }],
    ["gospel-of-peter", "Gospel of Peter", [11], [L.gos, L.dispA]],
    ["gospel-of-mary", "Gospel of Mary", [11, 17], [L.gos, L.gno, L.dispA]],
    ["gospel-of-philip", "Gospel of Philip", [11, 16], [L.gos, L.gno, L.val]],
    ["gospel-of-judas", "Gospel of Judas", [11, 17], [L.gos, L.gno, L.dispA], { earliest: "Coptic Codex Tchacos.", probable: "UNKNOWN. Judas did not write the surviving Coptic book." }],
    ["gospel-hebrews", "Gospel of the Hebrews", [11, 39, 41], [L.gos, L.jc, L.lost], { textStatus: "quoted_only" }],
    ["gospel-nazarenes", "Gospel of the Nazarenes", [11, 39, 41], [L.gos, L.jc, L.lost], { textStatus: "quoted_only" }],
    ["gospel-ebionites", "Gospel of the Ebionites", [11, 39, 41], [L.gos, L.jc, L.lost], { textStatus: "quoted_only" }],
    ["gospel-egyptians", "Gospel of the Egyptians", [11, 39], [L.gos, L.lost], { textStatus: "quoted_only" }],
    ["coptic-gospel-egyptians", "Coptic Gospel of the Egyptians", [11, 16], [L.gos, L.gno, L.seth]],
    ["gospel-of-marcion", "Gospel of Marcion / Evangelion", [11, 40], [L.gos, L.marc, L.recon], { textStatus: "reconstructed", disputes: "Reconstructed from patristic quotations. Shown separately from any surviving manuscript." }],
    ["gospel-of-matthias", "Gospel of Matthias", [11, 39], [L.gos, L.lost], { textStatus: "quoted_only" }],
    ["gospel-of-eve", "Gospel of Eve", [11], [L.gos, L.lost], { textStatus: "quoted_only" }],
    ["gospel-of-truth", "Gospel of Truth", [11, 16], [L.gos, L.gno, L.val]],
    ["gospel-of-the-savior", "Gospel of the Savior", [11], [L.gos, L.frag]],
    ["gospel-of-the-twelve", "Gospel of the Twelve", [11], [L.gos, L.lost]],
    ["gospel-of-barnabas", "Gospel of Barnabas", [11], [L.gos, L.med, L.dispA], { date: "Surviving Italian/Spanish text is medieval, not a first-century apostolic gospel.", provenance: "Do not equate the surviving book with an apostolic original." }],
    ["gospel-of-nicodemus", "Gospel of Nicodemus", [11, 36], [L.gos, L.apo]],
    ["acts-of-pilate", "Acts of Pilate", [11, 36], [L.gos, L.apo]],
    ["egerton-gospel", "Egerton Gospel", [11], [L.gos, L.frag, L.ms]],
    ["fayyum-fragment", "Fayyum Gospel Fragment", [11], [L.gos, L.frag]],
    ["oxyrhynchus-gospel-fragments", "Oxyrhynchus Gospel fragments", [11], [L.gos, L.frag]],
    ["p-berlin-11710", "Papyrus Berlin 11710", [11], [L.frag, L.ms]],
    ["p-merton-51", "Papyrus Merton 51", [11], [L.frag, L.ms]],
    ["secret-mark", "Secret Gospel of Mark", [11], [L.gos, L.dispA, L.dispD], { disputes: "Provenance is seriously disputed. Present arguments for and against authenticity. Not treated as settled.", textStatus: "not_stored" }],
    ["unknown-gospel-fragments", "Unknown Gospel fragments", [11], [L.gos, L.frag]],
    ["agrapha", "Agrapha (sayings attributed to Jesus outside the canonical Gospels)", [11, 39], [L.early, L.lost], { textStatus: "quoted_only" }],
    ["gospel-jesus-wife", "Gospel of Jesus' Wife", [11], [L.modf, L.frag], { provenance: "Widely regarded as a modern forgery. Kept in the catalog so the reader can see why authentication failed.", textStatus: "not_stored" }],
  ];
  const infancy = [
    ["protoevangelium-james", "Protoevangelium of James", [11, 12, 35]],
    ["infancy-thomas", "Infancy Gospel of Thomas", [11, 12]],
    ["pseudo-matthew", "Gospel of Pseudo-Matthew", [11, 12, 35]],
    ["arabic-infancy", "Arabic Infancy Gospel", [12]],
    ["armenian-infancy", "Armenian Infancy Gospel", [12]],
    ["syriac-infancy", "Syriac Infancy Gospel traditions", [12]],
    ["history-joseph-carpenter", "History of Joseph the Carpenter", [12]],
    ["nativity-of-the-savior", "Book of the Nativity of the Savior", [12]],
    ["birth-of-mary", "Birth of Mary", [12, 35]],
    ["nativity-of-mary", "Nativity of Mary", [12, 35]],
    ["liber-de-infantia", "Liber de Infantia Salvatoris", [12]],
    ["book-of-the-rolls", "Book of the Rolls", [12]],
    ["book-of-the-rooster", "Book of the Rooster", [12]],
    ["miracles-of-jesus", "Miracles of Jesus", [12]],
  ].map(([id, title, sections]) => E(id, title, sections, [L.apo, L.gos, L.dispA], { probable: UNKNOWN_AUTHOR }));
  return [
    ...gospels.map(([id, title, sections, labels, extra]) => E(id, title, sections, labels, extra)),
    ...infancy,
  ];
}

function actsLettersApocalypses() {
  const acts = [
    "Acts of Peter", "Acts of Paul", "Acts of Paul and Thecla", "Acts of John", "Acts of Andrew", "Acts of Thomas",
    "Acts of Philip", "Acts of Peter and Andrew", "Acts of Andrew and Matthias", "Acts of Peter and Paul",
    "Acts of Barnabas", "Acts of Thaddaeus", "Acts of Bartholomew", "Acts of Matthew", "Acts of Timothy",
    "Acts of Titus", "Acts of Xanthippe and Polyxena", "Acts of John by Prochorus", "History of John",
    "History of John and James", "History of Simon Cephas", "Apostolic Histories / Virtutes Apostolorum",
    "Martyrdom of Andrew", "Martyrdom of Bartholomew", "Martyrdom of Matthew", "Martyrdom of Peter",
    "Martyrdom of Paul", "Martyrdom of Philip", "Martyrdom of Thomas", "Martyrdom of Thaddaeus",
    "Martyrdom of Simon", "Martyrdom of Stephen", "Martyrdom of Thecla",
  ].map((title) => E(slug(title), title, [13], [L.acts, L.apo, L.dispA]));
  const letters = [
    "Epistle of the Apostles / Epistula Apostolorum", "Third Corinthians / 3 Corinthians",
    "Letter of Paul to the Laodiceans", "Correspondence of Paul and Seneca", "Epistle to the Alexandrians",
    "Apocryphal Epistle to the Colossians", "Epistle of Titus (apocryphal)", "Epistle of James to Quadratus",
    "Epistles of Ignatius to Mary and John", "Letter of Peter to Philip", "Letter of Peter to James",
    "Epistles of Christ and Abgar", "Epistle of Christ from Heaven", "Epistle of Lentulus",
    "Epistle of Pilate to Claudius", "Epistle of Pilate to Tiberius", "Epistle of Tiberius to Pilate",
    "Epistles of Pilate and Herod", "Epistles of Pilate and Theodore",
  ].map((title) => E(slug(title), title, [14], [L.epp, L.apo, L.dispA]));
  const apocs = [
    "Apocalypse of Peter", "Coptic Apocalypse of Peter", "Apocalypse of Paul", "Coptic Apocalypse of Paul",
    "Apocalypse of Thomas", "Apocalypse of Stephen", "Apocalypse of the Virgin",
    "Arabic Apocalypse of the Virgin", "Ethiopic Apocalypse of the Virgin",
    "1 Apocryphal Apocalypse of John", "2 Apocryphal Apocalypse of John", "3 Apocryphal Apocalypse of John",
    "First Apocalypse of James", "Second Apocalypse of James", "Apocalypse of Pseudo-Methodius",
    "Mysteries of John", "Fifteen Signs Before Judgment",
  ].map((title) => E(slug(title), title, [15], [L.apoc, L.apo, L.dispA]));
  return [...acts, ...letters, ...apocs];
}

function nagHammadi() {
  const works = [
    [1, "Prayer of the Apostle Paul", [L.gno]],
    [1, "Apocryphon of James", [L.gno]],
    [1, "Treatise on the Resurrection", [L.gno, L.val]],
    [1, "Tripartite Tractate", [L.gno, L.val]],
    [2, "Apocryphon of John", [L.gno, L.seth]],
    [2, "Hypostasis of the Archons", [L.gno, L.seth]],
    [2, "On the Origin of the World", [L.gno]],
    [2, "Exegesis on the Soul", [L.gno]],
    [2, "Book of Thomas the Contender", [L.gno]],
    [3, "Eugnostos the Blessed", [L.gno]],
    [3, "Sophia of Jesus Christ", [L.gno]],
    [3, "Dialogue of the Savior", [L.gno]],
    [5, "Apocalypse of Adam (Nag Hammadi)", [L.gno, L.seth]],
    [6, "Acts of Peter and the Twelve Apostles", [L.gno, L.acts]],
    [6, "Thunder, Perfect Mind", [L.gno]],
    [6, "Authoritative Teaching", [L.gno]],
    [6, "Concept of Our Great Power", [L.gno]],
    [6, "Republic of Plato fragment (Nag Hammadi)", [L.gno, L.frag]],
    [6, "Discourse on the Eighth and Ninth", [L.gno]],
    [6, "Prayer of Thanksgiving", [L.gno, L.lit]],
    [6, "Asclepius (Nag Hammadi)", [L.gno]],
    [7, "Paraphrase of Shem", [L.gno]],
    [7, "Second Treatise of the Great Seth", [L.gno, L.seth]],
    [7, "Teachings of Silvanus", [L.gno]],
    [7, "Three Steles of Seth", [L.gno, L.seth]],
    [8, "Zostrianos", [L.gno, L.seth]],
    [9, "Melchizedek (Nag Hammadi)", [L.gno]],
    [9, "Thought of Norea", [L.gno, L.seth]],
    [9, "Testimony of Truth", [L.gno]],
    [10, "Marsanes", [L.gno, L.seth]],
    [11, "Interpretation of Knowledge", [L.gno, L.val]],
    [11, "Valentinian Exposition", [L.gno, L.val]],
    [11, "Allogenes", [L.gno, L.seth]],
    [11, "Hypsiphrone", [L.gno]],
    [12, "Sentences of Sextus", [L.early]],
    [13, "Trimorphic Protennoia", [L.gno, L.seth]],
  ];
  return works.map(([codex, title, labels]) =>
    E(slug(title), title, [16], labels, {
      discovery: "Nag Hammadi, Egypt (1945)",
      location: "Coptic Museum, Cairo (principal holding)",
      earliest: `Nag Hammadi Codex ${["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"][codex - 1]} (4th century Coptic)`,
      lang: "Coptic translation of Greek",
      canon: "Noncanonical. Gnostic or related. Not removed because a church condemned it.",
    })
  );
}

function otherGnostic() {
  return [
    E("pistis-sophia", "Pistis Sophia", [17], [L.gno]),
    E("first-book-of-jeu", "First Book of Jeu", [17], [L.gno]),
    E("second-book-of-jeu", "Second Book of Jeu", [17], [L.gno]),
    E("bruce-codex", "Bruce Codex materials", [17], [L.gno, L.ms]),
    E("bruce-untitled", "Untitled Text of the Bruce Codex", [17], [L.gno]),
    E("book-of-allogenes", "Book of Allogenes", [17], [L.gno]),
    E("secret-book-of-john", "Secret Book of John", [17], [L.gno, L.seth], { alt: ["Apocryphon of John"] }),
  ];
}

function mandaeanChurchOrders() {
  const mandaean = [
    ["ginza-rabba", "Ginza Rabba"],
    ["right-ginza", "Right Ginza"],
    ["left-ginza", "Left Ginza"],
    ["mandaean-book-of-john", "Book of John / Mandaean Book of John"],
    ["qolasta", "Qolasta"],
    ["haran-gawaita", "Haran Gawaita"],
    ["diwan-abatur", "Diwan Abatur"],
  ].map(([id, title]) =>
    E(id, title, [18], [L.comp], {
      canon: "Not Christian Scripture. Comparative Late Antique religious literature.",
      accepted: "Mandaean community.",
      rejected: "Not part of any Christian canon.",
    })
  );
  const orders = [
    ["didascalia-apostolorum", "Didascalia Apostolorum"],
    ["apostolic-tradition", "Apostolic Tradition", { labels: [L.early, L.dispA], disputes: "Attribution to Hippolytus is disputed." }],
    ["apostolic-church-order", "Apostolic Church Order"],
    ["apostolic-constitutions", "Apostolic Constitutions"],
    ["canons-of-hippolytus", "Canons of Hippolytus"],
    ["testamentum-domini", "Testamentum Domini"],
    ["canons-of-the-apostles", "Canons of the Apostles"],
  ].map(([id, title, extra]) => E(id, title, [19], extra?.labels || [L.early, L.lit], extra));
  return [...mandaean, ...orders];
}

function fathersByAuthor() {
  const justin = ["First Apology", "Second Apology", "Dialogue with Trypho", "Fragments / disputed works attributed to Justin"].map((t) =>
    E(slug(t), t, [20], [L.pat, L.early], {
      stored: t.startsWith("Fragments") ? null : { kind: "plain", file: "/corpus/fathers/ante-nicene-vol1.txt" },
      textStatus: t.startsWith("Fragments") ? "quoted_only" : "complete_stored",
    })
  );
  const irenaeus = ["Against Heresies / Adversus Haereses", "Demonstration of the Apostolic Preaching", "Fragments of Irenaeus"].map((t) =>
    E(slug(t), t, [21, 38], [L.pat, L.her], {
      stored: t.startsWith("Against") ? { kind: "plain", file: "/corpus/fathers/ante-nicene-vol1.txt" } : null,
      textStatus: t.startsWith("Against") ? "complete_stored" : t.startsWith("Fragments") ? "quoted_only" : "not_stored",
    })
  );
  const tertullian = [
    "Apology (Tertullian)", "Against Marcion", "Against Praxeas", "On the Prescription of Heretics", "On Baptism",
    "On Prayer (Tertullian)", "On Repentance", "On the Flesh of Christ", "On the Resurrection of the Flesh",
    "On the Soul", "On Monogamy", "On Modesty", "On Idolatry", "To the Nations", "Scorpiace", "Ad Martyras",
    "De Spectaculis", "De Corona", "De Cultu Feminarum", "De Virginibus Velandis", "Ad Uxorem",
    "De Exhortatione Castitatis", "De Fuga in Persecutione",
  ].map((t) => E(slug(t), t, [22], [L.pat]));
  const clement = [
    "Protrepticus / Exhortation to the Greeks", "Paedagogus / Instructor", "Stromata / Miscellanies",
    "Who Is the Rich Man That Shall Be Saved?", "Excerpts of Theodotus", "Prophetic Extracts",
    "Fragments of Clement of Alexandria",
  ].map((t) => E(slug(t), t, [23], [L.pat]));
  const origen = [
    "On First Principles / De Principiis", "Against Celsus", "On Prayer (Origen)", "Exhortation to Martyrdom",
    "Commentary on John (Origen)", "Commentary on Matthew (Origen)", "Commentary on Romans (Origen)",
    "Homilies on Genesis", "Homilies on Exodus", "Homilies on Leviticus", "Homilies on Numbers",
    "Homilies on Joshua", "Homilies on Judges", "Homilies on Samuel", "Homilies on Psalms (Origen)",
    "Homilies on Isaiah", "Homilies on Jeremiah", "Homilies on Ezekiel", "Homilies on Luke (Origen)",
    "Hexapla fragments", "Philocalia",
  ].map((t) => E(slug(t), t, [24], [L.pat, L.frag], { fragments: t.includes("fragment") || t.includes("Hexapla") ? "Much of Origen survives only in fragments or Latin translation (Rufinus)." : "See surviving manuscript tradition; some homilies are complete in Latin." }));
  const hipp = [
    ["Refutation of All Heresies", [25, 38], [L.pat, L.her]],
    ["Commentary on Daniel (Hippolytus)", [25], [L.pat]],
    ["On Christ and Antichrist", [25], [L.pat]],
    ["Fragments of Hippolytus", [25], [L.pat, L.frag]],
  ].map(([t, s, l]) => E(slug(t), t, s, l));
  const cyprian = [
    "On the Unity of the Catholic Church", "On the Lapsed", "On the Lord's Prayer (Cyprian)", "To Donatus",
    "On Mortality", "On Works and Alms", "Letters of Cyprian",
  ].map((t) => E(slug(t), t, [26], [L.pat]));
  const eusebius = [
    "Ecclesiastical History / Church History", "Life of Constantine", "Preparation for the Gospel",
    "Proof of the Gospel", "Chronicle (Eusebius)", "Onomasticon", "Martyrs of Palestine",
    "Against Hierocles", "Theophany", "Letters and fragments of Eusebius",
  ].map((t) => E(slug(t), t, [27], [L.pat]));
  const athanasius = [
    "On the Incarnation", "Against the Heathen", "Orations Against the Arians", "Life of Antony",
    "Festal Letters", "39th Festal Letter", "Letters to Serapion", "Defense of the Nicene Definition",
  ].map((t) => E(slug(t), t, t.includes("39th") ? [28, 46] : [28], [L.pat]));
  const capp = [
    ["Hexaemeron", 29], ["On the Holy Spirit (Basil)", 29], ["Longer Rules", 29], ["Shorter Rules", 29],
    ["Letters of Basil", 29], ["Homilies of Basil", 29], ["Theological Orations", 29],
    ["Orations of Gregory of Nazianzus", 29], ["Letters of Gregory of Nazianzus", 29],
    ["Poems of Gregory of Nazianzus", 29], ["Life of Moses (Gregory of Nyssa)", 29],
    ["Great Catechism", 29], ["On the Making of Man", 29], ["Against Eunomius", 29],
    ["On the Soul and Resurrection", 29], ["Homilies on Song of Songs (Nyssa)", 29], ["Life of Macrina", 29],
  ].map(([t, s]) => E(slug(t), t, [s], [L.pat, L.orthod]));
  const chrys = [
    "Homilies on Genesis (Chrysostom)", "Homilies on Matthew (Chrysostom)", "Homilies on John (Chrysostom)",
    "Homilies on Acts", "Homilies on Romans (Chrysostom)", "Homilies on Corinthians (Chrysostom)",
    "Homilies on Galatians (Chrysostom)", "Homilies on Ephesians (Chrysostom)",
    "Homilies on Philippians (Chrysostom)", "Homilies on Colossians (Chrysostom)",
    "Homilies on Thessalonians (Chrysostom)", "Homilies on Timothy (Chrysostom)",
    "Homilies on Titus (Chrysostom)", "Homilies on Philemon (Chrysostom)", "Homilies on Hebrews (Chrysostom)",
    "On the Priesthood", "Letters of Chrysostom",
  ].map((t) => E(slug(t), t, [30], [L.pat, L.orthod]));
  const jerome = [
    "Vulgate Bible (Jerome's Latin)", "Prefaces to biblical books (Jerome)", "Against Helvidius",
    "Against Jovinian", "Against Vigilantius", "Lives of Illustrious Men / De Viris Illustribus",
    "Life of Paul the Hermit", "Letters of Jerome", "Biblical commentaries (Jerome)", "Chronicle (Jerome)",
  ].map((t) => E(slug(t), t, [31], [L.pat]));
  const augustine = [
    "Confessions", "City of God", "On Christian Doctrine", "On the Trinity (Augustine)",
    "On Free Choice of the Will", "Enchiridion", "On Grace and Free Will", "On Nature and Grace",
    "On the Spirit and the Letter", "Anti-Pelagian writings", "Anti-Donatist writings", "Retractions",
    "Letters of Augustine", "Sermons of Augustine", "Biblical commentaries (Augustine)",
  ].map((t) => E(slug(t), t, [32], [L.pat, L.cath]));
  return [...justin, ...irenaeus, ...tertullian, ...clement, ...origen, ...hipp, ...cyprian, ...eusebius, ...athanasius, ...capp, ...chrys, ...jerome, ...augustine];
}

function syriacMartyrMaryPilate() {
  const syriac = [
    "Doctrine of Addai", "Teaching of Addai", "Acts of Mar Mari", "Aphrahat — Demonstrations",
    "Hymns on Faith (Ephrem)", "Hymns on Paradise", "Hymns on the Nativity (Ephrem)",
    "Hymns Against Heresies (Ephrem)", "Commentary on the Diatessaron", "Diatessaron of Tatian",
    "Book of the Bee", "Chronicle of Edessa", "Syriac Apocalypse traditions",
    "History of the Virgin", "Book of Mary's Repose", "Syriac Dormition traditions",
  ].map((t) => E(slug(t), t, [33], [L.early, t.includes("Dormition") || t.includes("Mary") ? L.apo : L.pat]));
  const martyrs = [
    ["Martyrs of Lyons and Vienne", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Acts of the Scillitan Martyrs", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Passion of Perpetua and Felicity", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Acts of Justin and Companions", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Martyrdom of Pionius", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Acts of Cyprian (martyrdom)", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Martyrdom of Carpus, Papylus and Agathonice", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Martyrdom of Apollonius", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Palestinian Martyrs", "EARLY/PROBABLE HISTORICAL MARTYR ACTS"],
    ["Later legendary hagiography (collected notice)", "LATER LEGENDARY HAGIOGRAPHY"],
  ].map(([t, kind]) =>
    E(slug(t), t, [34], [L.early], {
      background: kind === "LATER LEGENDARY HAGIOGRAPHY"
        ? "Later legendary martyr stories must be kept distinct from early/probable acts. This entry marks that distinction."
        : `Classed as ${kind}. Early date does not automatically prove every detail.`,
    })
  );
  const mary = [
    "Six Books Dormition Apocryphon", "Transitus Mariae traditions",
    "Assumption of the Virgin by Pseudo-Melito", "Syriac Assumption of the Virgin",
    "Arabic Dormition traditions", "Ethiopic Dormition traditions", "Homilies on the Dormition",
    "Euthymiac History", "Encomium on Mary Magdalene", "Eremitic Life of Mary Magdalene",
    "Miracles of Mary", "Epistles attributed to Mary",
  ].map((t) => E(slug(t), t, [35], [L.apo, L.dispA]));
  const pilate = [
    "Anaphora Pilati / Report of Pilate", "Paradosis Pilati / Handing Over of Pilate",
    "Death of Pilate", "Martyrdom of Pilate", "Healing of Tiberius",
    "Vindicta Salvatoris / Vengeance of the Savior", "Narrative of Joseph of Arimathea",
  ].map((t) => E(slug(t), t, [36], [L.apo, L.dispA]));
  return [...syriac, ...martyrs, ...mary, ...pilate];
}

function listsHeresyLostMarcion() {
  const lists = [
    "Lists of the Twelve Apostles", "Lists of the Seventy / Seventy-Two Disciples",
    "Pseudo-Hippolytus apostle lists", "Pseudo-Epiphanius apostle lists", "Pseudo-Irenaeus apostle lists",
    "Anonymous apostle lists", "Genealogies of the Twelve Apostles", "Fates of the Apostles",
    "On the Deaths of the Apostles", "Notes on Where the Apostles Preached", "Notes on Where the Apostles Were Buried",
  ].map((t) =>
    E(slug(t), t, [37], [L.apo, L.dispA], {
      background: "NASSCAL and related catalogs treat these as distinct lists, not one document. Variants stay separate.",
    })
  );
  const her = [
    ["Epiphanius — Panarion", 38],
    ["Pseudo-Tertullian — Against All Heresies", 38],
    ["Philastrius — Diversarum Hereseon Liber", 38],
    ["Theodoret — Compendium of Heretical Fables", 38],
  ].map(([t, s]) => E(slug(t), t, [s], [L.her, L.pat]));
  const lost = [
    "Traditions of Matthias", "Gospel of Basilides", "Gospel of Cerinthus traditions",
    "Gospel of Apelles traditions", "Preaching of Peter / Kerygma Petrou", "Preaching of Paul",
    "Writings of Hegesippus", "Aristides fragments", "Melito of Sardis fragments",
    "Lost writings of early bishops (testimonia)",
  ].map((t) => E(slug(t), t, [39], [L.lost, L.early], { textStatus: "quoted_only" }));
  const marcion = [
    E("marcion-apostolikon", "Marcionite Apostolikon", [40], [L.marc, L.recon], { textStatus: "reconstructed" }),
    E("marcion-antitheses", "Marcion's Antitheses — reconstructed fragments", [40], [L.marc, L.recon, L.lost], { textStatus: "reconstructed" }),
    E("marcion-prologues", "Marcionite prologues", [40], [L.marc, L.recon]),
    E("marcion-inscriptions", "Marcionite inscriptions and fragments", [40], [L.marc, L.frag]),
    E("marcion-patristic-quotes", "Patristic quotations preserving Marcionite readings", [40], [L.marc, L.lost], { textStatus: "quoted_only" }),
  ];
  const jc = [
    "Kerygmata Petrou traditions", "Ascents of James", "Pseudo-Clementine Homilies",
    "Pseudo-Clementine Recognitions", "Contestatio", "Jewish-Christian fragments preserved by Church Fathers",
    "Clementine Epitomes", "Epistle of Clement to James",
  ].map((t) => E(slug(t), t, t.includes("Clement") ? [41, 42] : [41], [L.jc, L.apo]));
  const mani = [
    "Mani's Gospel", "Treasure of Life", "Pragmateia", "Book of Mysteries (Mani)",
    "Epistles of Mani", "Manichaean Psalms and Prayers", "Coptic Manichaean Homilies",
    "Kephalaia", "Cologne Mani Codex",
  ].map((t) =>
    E(slug(t), t, [43], [L.comp], {
      canon: "Manichaean provenance. Not orthodox Christian Scripture.",
      accepted: "Manichaean communities historically.",
      rejected: "Catholic, Orthodox, and Protestant canons.",
    })
  );
  return [...lists, ...her, ...lost, ...marcion, ...jc, ...mani];
}

function creedsCouncilsCanon() {
  const creeds = [
    "Old Roman Creed", "Apostles' Creed", "Nicene Creed — AD 325",
    "Niceno-Constantinopolitan Creed — AD 381", "Athanasian Creed / Quicumque Vult",
    "Creed of Chalcedon", "Creeds of early baptismal traditions", "Creeds preserved in early Church Fathers",
  ].map((t) => E(slug(t), t, [44], [L.creed, L.early]));
  const councils = [
    ["Council of Jerusalem — Acts 15", "complete_stored", { stored: { kind: "canon", book: "Acts" }, background: "Read Acts 15 in the stored King James text." }],
    ["Council of Nicaea — 325", "not_stored", {}],
    ["Council of Constantinople I — 381", "not_stored", {}],
    ["Council of Ephesus — 431", "not_stored", {}],
    ["Council of Chalcedon — 451", "not_stored", {}],
    ["Council of Constantinople II — 553", "not_stored", {}],
    ["Council of Constantinople III — 680–681", "not_stored", {}],
    ["Council of Nicaea II — 787", "not_stored", {}],
  ].map(([t, st, extra]) => E(slug(t), t, [45], [L.coun], { textStatus: st, ...extra }));
  const lists = [
    "Muratorian Fragment", "Melito of Sardis canon list", "Origen's canon discussions",
    "Eusebius — Ecclesiastical History canon classifications", "Cyril of Jerusalem canon list",
    "Council of Laodicea list", "Council of Hippo traditions", "Councils of Carthage canon traditions",
    "Jerome's biblical prologues (canon)", "Augustine's canon discussions",
    "Codex Claromontanus canon list", "Cheltenham / Mommsen List", "Bryennios List",
    "Apostolic Canons canon list", "Syriac canon traditions", "Ethiopian canon traditions",
  ].map((t) => E(slug(t), t, [46], [L.early, t.includes("Fragment") ? L.frag : L.coun]));
  return [...creeds, ...councils, ...lists];
}

function manuscriptsVersions() {
  const mss = [
    ["Ketef Hinnom Scrolls", [47], [L.ms, L.frag], { archaeology: "Ketef Hinnom, Jerusalem. Silver amulets with priestly blessing wording." }],
    ["Nash Papyrus", [47], [L.ms, L.frag]],
    ["Aleppo Codex", [47], [L.ms]],
    ["Leningrad Codex", [47], [L.ms]],
    ["Cairo Codex", [47], [L.ms]],
    ["Samaritan Pentateuch manuscripts", [47, 49], [L.ms, L.jew]],
    ["Papyrus Rylands 458", [47], [L.ms, L.frag]],
    ["Papyrus Fouad 266", [47], [L.ms, L.frag]],
    ["Papyrus Chester Beatty collections", [47], [L.ms]],
    ["Codex Ephraemi Rescriptus", [47], [L.ms]],
    ["Codex Alexandrinus", [47], [L.ms]],
  ].map(([t, s, l, extra]) => E(slug(t), t, s, l, { textStatus: "manuscript_witness", ...extra }));
  const versions = [
    "Septuagint / LXX", "Old Greek translations", "Aquila", "Symmachus", "Theodotion",
    "Old Latin / Vetus Latina", "Latin Vulgate", "Old Syriac Gospels", "Curetonian Gospels",
    "Sinaitic Syriac", "Peshitta", "Harklean Syriac", "Philoxenian Syriac",
    "Coptic Sahidic Bible", "Coptic Bohairic Bible", "Coptic Fayyumic traditions",
    "Gothic Bible", "Armenian Bible", "Georgian Bible", "Ethiopic / Ge'ez Bible",
    "Old Church Slavonic Bible", "Arabic biblical traditions",
  ].map((t) => E(slug(t), t, [48], [L.ms], { textStatus: "not_stored", canon: "A version / translation, not a separate book list." }));
  return [...mss, ...versions];
}

function jewishGrecoInscriptions() {
  const sam = ["Samaritan Targum", "Samaritan chronicles", "Samaritan liturgical texts"].map((t) =>
    E(slug(t), t, [49], [L.jew, L.comp])
  );
  const targum = [
    "Targum Onkelos", "Targum Jonathan", "Targum Neofiti", "Fragment Targums",
    "Targum Pseudo-Jonathan", "Targums to Psalms", "Targums to Job", "Targums to Proverbs",
    "Targums to the Five Megillot", "Targum to Chronicles",
  ].map((t) => E(slug(t), t, [50], [L.jew, L.comp]));
  const rab = [
    "Mishnah", "Tosefta", "Jerusalem Talmud", "Babylonian Talmud", "Mekhilta", "Sifra",
    "Sifre Numbers", "Sifre Deuteronomy", "Genesis Rabbah", "Exodus Rabbah", "Leviticus Rabbah",
    "Numbers Rabbah", "Deuteronomy Rabbah", "Ecclesiastes Rabbah", "Song of Songs Rabbah",
    "Lamentations Rabbah", "Esther Rabbah", "Pirkei Avot",
  ].map((t) =>
    E(slug(t), t, [51], [L.jew, L.comp], {
      canon: "Not Christian Scripture.",
      background: "Catalogued for comparative study of Messiah, Temple, Sabbath, purity, and related topics. Complete text is not stored in this app yet.",
    })
  );
  const greco = [
    E("josephus-war", "Josephus — Jewish War", [52], [L.greco, L.comp], {
      stored: { kind: "plain", file: "/corpus/fathers/josephus-wars.txt" },
      textStatus: "complete_stored",
      translation: "Whiston, public domain, when the file is present.",
    }),
    E("josephus-apion", "Josephus — Against Apion", [52], [L.greco, L.comp]),
    E("josephus-life", "Josephus — Life", [52], [L.greco, L.comp]),
    E("tacitus-annals", "Tacitus — Annals", [52], [L.greco, L.comp]),
    E("suetonius", "Suetonius — Lives of the Caesars", [52], [L.greco, L.comp]),
    E("pliny-letters", "Pliny the Younger — Letters (incl. 10.96–97)", [52], [L.greco, L.comp]),
    E("trajan-pliny", "Trajan's reply to Pliny", [52], [L.greco, L.comp]),
    E("lucian-peregrinus", "Lucian of Samosata — Death of Peregrinus", [52], [L.greco, L.comp]),
    E("mara-bar-serapion", "Mara bar Serapion letter", [52], [L.greco, L.comp]),
    E("celsus-fragments", "Celsus fragments preserved by Origen", [52], [L.greco, L.lost], { textStatus: "quoted_only" }),
    E("galen-christians", "Galen references to Christians", [52], [L.greco, L.comp]),
    E("porphyry-fragments", "Porphyry fragments relating to Christianity", [52], [L.greco, L.lost], { textStatus: "quoted_only" }),
  ];
  const inscr = [
    "Christian epitaphs", "Catacomb inscriptions", "Dura-Europos Christian inscriptions",
    "Megiddo Christian prayer-hall inscription", "Abercius inscription", "Pectorius inscription",
    "Alexamenos Graffito", "Christian papyrus letters", "Christian amulets", "Christian prayers (documentary)",
    "Early liturgical papyri", "Early biblical amulets",
  ].map((t) => E(slug(t), t, [53], [L.frag, L.early], { textStatus: "fragment_stored" === false ? "not_stored" : "not_stored" }));
  return [...sam, ...targum, ...rab, ...greco, ...inscr];
}

function liturgyMedievalModern() {
  const lit = [
    "Didache Eucharistic prayers", "Apostolic Tradition liturgy", "Anaphora of Addai and Mari",
    "Liturgy of St. James", "Liturgy of St. Mark", "Liturgy of St. Basil", "Liturgy of St. John Chrysostom",
    "Apostolic Constitutions liturgical material", "Serapion's Sacramentary", "Early baptismal liturgies",
    "Early Eucharistic prayers", "Ancient Christian hymns",
    "Phos Hilaron", "Sub Tuum Praesidium", "Oxyrhynchus Hymn", "Gloria in Excelsis traditions",
    "Te Deum", "Early baptismal prayers", "Early martyr prayers",
  ].map((t) => E(slug(t), t, t.includes("Phos") || t.includes("Te Deum") || t.includes("Gloria") || t.includes("Sub Tuum") || t.includes("Oxyrhynchus Hymn") || t.includes("prayers") || t.includes("hymns") ? [54, 55] : [54], [L.lit, L.early]));
  const med = [
    "Rule of St. Benedict", "Rule of St. Basil (medieval reception)", "Writings of John Cassian",
    "Writings of Maximus the Confessor", "Writings of John of Damascus", "Writings of Bede",
    "Writings of Anselm", "Writings of Bernard of Clairvaux", "Writings of Thomas Aquinas",
    "Summa Theologiae", "Summa Contra Gentiles", "Writings of Bonaventure",
    "Writings of Julian of Norwich", "Writings of Catherine of Siena", "Writings of Meister Eckhart",
    "The Cloud of Unknowing", "The Imitation of Christ",
  ].map((t) => E(slug(t), t, [56], [L.med], { background: "Catalogued separately from ancient Christianity. Complete text not stored unless marked." }));
  const ref = [
    "95 Theses", "Freedom of a Christian", "Bondage of the Will", "Large Catechism (Luther)",
    "Small Catechism (Luther)", "Institutes of the Christian Religion", "Huldrych Zwingli writings",
    "Philip Melanchthon writings", "Augsburg Confession", "Apology of the Augsburg Confession",
    "Formula of Concord", "Book of Concord", "Thirty-Nine Articles", "Book of Common Prayer",
    "Westminster Confession", "Westminster Larger Catechism", "Westminster Shorter Catechism",
    "Canons of Dort", "Heidelberg Catechism", "Belgic Confession",
  ].map((t) => E(slug(t), t, [57], [L.ref, L.prot]));
  const cath = [
    "Council of Trent documents", "Roman Catechism", "Catechism of the Catholic Church",
    "Vatican I documents", "Vatican II documents", "Major papal documents relevant to doctrine",
  ].map((t) => E(slug(t), t, [58], [L.cath], { background: "Classify each document as historical, ordinary magisterium, conciliar decree, dogmatic definition, or disputed interpretation when a stored edition is added." }));
  const orth = [
    "Philokalia", "Gregory Palamas writings", "Synodikon of Orthodoxy",
    "Orthodox confessions and catechisms", "Major Byzantine theological texts",
  ].map((t) => E(slug(t), t, [59], [L.orthod]));
  const tcd = [
    E("textual-criticism-notice", "Textual criticism comparison (Masoretic, DSS, LXX, Samaritan, Vulgate, Peshitta, major codices)", [60], [L.ms], {
      textStatus: "not_stored",
      background: "Required: the reader should see witnesses rather than be told a variant is insignificant. A verse-by-verse apparatus is not stored in this app yet. Stored English is the King James unless another stored edition is opened.",
      variants: "Apparatus not yet stored. Do not treat silence as insignificance.",
    }),
  ];
  return [...lit, ...med, ...ref, ...cath, ...orth, ...tcd];
}

function slug(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
