/** Identification lexicon of signs people still meet. Not a working grimoire. */

export const SYMBOL_SECTIONS = [
  {
    id: "solar",
    title: "Sun, moon, and the wheel of the year",
    blurb: "The nations were dismayed at the signs of heaven (Jeremiah 10:2). Solar disks, wheels, and midwinter evergreens are still the grammar of the civil calendar.",
  },
  {
    id: "stars",
    title: "Stars, pentagrams, and hexagrams",
    blurb: "Five- and six-pointed stars moved from geometry and civic seals into occult textbooks, then into jewelry and album covers. Shape alone is not a rite; use and teaching are.",
  },
  {
    id: "crosses",
    title: "Crosses, loops, and inverted signs",
    blurb: "Rome's execution shape, Egypt's ankh, and later inversions all occupy the same visual field. Distinguish the event, the object, and the inversion.",
  },
  {
    id: "eyes",
    title: "Eyes, hands, and watching gods",
    blurb: "The all-seeing eye, the Eye of Horus, the nazar, and the hamsa are sold as protection. Scripture locates seeing in the LORD, not in an amulet.",
  },
  {
    id: "serpents",
    title: "Serpents and the circle of return",
    blurb: "From Eden's serpent to the ouroboros and the caduceus: the nations made the snake a god of wisdom, healing, and eternity.",
  },
  {
    id: "horns",
    title: "Horns, goats, and the inverted star",
    blurb: "Goat-demons (seirim) are named in the Torah. Later occultism drew Baphomet and the inverted pentagram. This page identifies; it does not copy trademarked cult logos or teach their use.",
  },
  {
    id: "death",
    title: "Death, skulls, and the forbidden theme",
    blurb: "Halloween's merchandise and memento-mori jewelry put the dead in the living room. Seeking the dead is forbidden; remembering you will die is not the same act.",
  },
  {
    id: "craft",
    title: "Craft marks, cubes, and later orders",
    blurb: "Squares, compasses, pyramids, and chaos-stars appear in lodges, advertising, and pop occultism. Many origin-stories online overreach; the marks are still in public.",
  },
];

export const OCCULT_SYMBOLS = [
  {
    id: "sun-disk",
    section: "solar",
    glyph: "sun-disk",
    title: "Sun disk and solar rays",
    card: "The disk with rays is how Egypt, Rome, and later churches pictured the ruling light. Constantine's rest day is named for it.",
    seenToday: "Flags, church windows, children's drawings of God as a smiling sun, Sunday-school art, jewelry, and midwinter lights that 'bring back the sun.'",
    meaning:
      "In Egypt the solar disk (Aten, Ra, winged forms) was a deity or the visible body of a deity. Rome's Sol Invictus is the Unconquered Sun; 25 December is his birthday on the Chronograph of 354. Radiate crowns on emperors claimed solar glory. The biblical issue is not that God made the sun (Genesis 1:16) but that the nations worshipped it (Deuteronomy 4:19; Ezekiel 8:16; 2 Kings 23:5).",
    history:
      "Deuteronomy 4:19 forbids lifting the eyes to the sun, moon, and stars to be driven to worship them. Josiah put down those who burned incense to the sun (2 Kings 23:5). Ezekiel 8:16 shows twenty-five men with backs to the temple, faces east, worshipping the sun. Later Christian art often kept the nimbus and radiate glory around holy figures — the visual language of solar kingship baptized.",
    intention:
      "Original: honour the sun as god or as the emperor's god. Today's usual intention: warmth, 'goodness,' or decoration. Participation in sun-facing worship or in treating Sunday as the Sun's holy day still uses the old grammar.",
    scriptures: [
      {
        ref: "Deuteronomy 4:19",
        text: "And lest thou lift up thine eyes unto heaven, and when thou seest the sun, and the moon, and the stars, even all the host of heaven, shouldest be driven to worship them, and serve them, which the LORD thy God hath divided unto all nations under the whole heaven.",
      },
      {
        ref: "Ezekiel 8:16",
        text: "And he brought me into the inner court of the LORD's house, and, behold, at the door of the temple of the LORD, between the porch and the altar, were about five and twenty men, with their backs toward the temple of the LORD, and their faces toward the east; and they worshipped the sun toward the east.",
      },
    ],
    sources: ["Deuteronomy 4:19; 17:3; 2 Kings 23:5; Ezekiel 8:16; Chronograph of 354 (Natalis Invicti)"],
  },
  {
    id: "sun-cross",
    section: "solar",
    glyph: "sun-cross",
    title: "Sun wheel (solar cross)",
    card: "A cross inside a circle — the wheel of the year, the four seasons, the sun's chariot. Older than the Latin cross as a religious badge.",
    seenToday: "Folk art, neopagan sabbat wheels, some church floor-patterns, and logos that 'just look Celtic.'",
    meaning:
      "A circle quartered marks the solar year: solstices and equinoxes. In various European and Near Eastern settings it is a sun-emblem, not the Roman execution cross. Neopagan calendars still use a wheel of eight festivals around that geometry.",
    history:
      "Quartered circles appear on Bronze Age and later European artifacts as solar or wheel signs. They are not 'the Christian cross' and they are not automatically the Church of Satan. They are the geometry of the year-god.",
    intention:
      "Mark the turning of the sun. Today: heritage décor or Wiccan year-wheel. Participation in 'sabbats' on those quarter-days is keeping the nations' solar calendar.",
    scriptures: [
      {
        ref: "Jeremiah 10:2",
        text: "Thus saith the LORD, Learn not the way of the heathen, and be not dismayed at the signs of heaven; for the heathen are dismayed at them.",
      },
    ],
    sources: ["Jeremiah 10:2; Deuteronomy 4:19"],
  },
  {
    id: "radiate-crown",
    section: "solar",
    glyph: "radiate-crown",
    title: "Radiate crown and halo",
    card: "Spikes of light around a head — Helios, Sol, deified emperors, then saints. The sun-nimbus entered church pictures.",
    seenToday: "Icons, stained glass, statues of Mary and 'Jesus,' coins, and comic-book 'holy' glows.",
    meaning:
      "The radiate crown is how the sun-god and solar emperors were drawn. The halo (nimbus) in later Christian art continues that visual claim: this figure is filled with the light that pagans gave to Sol. Scripture never commands a disk behind the head.",
    history:
      "Hellenistic and Roman coins show Helios/Sol and emperors radiate. Christian iconography adopted the nimbus in late antiquity. Second commandment concerns bowing to likenesses; the halo is the solar grammar of those likenesses.",
    intention:
      "Mark a being as divine-solar. Today: 'that's just how holy people are painted.' Participation: learning God from a sun-crowned European face.",
    scriptures: [
      {
        ref: "Romans 1:23",
        text: "And changed the glory of the uncorruptible God into an image made like to corruptible man, and to birds, and fourfooted beasts, and creeping things.",
      },
    ],
    sources: ["Romans 1:23; Deuteronomy 4:15–16; Roman radiate coinage of Sol and emperors"],
  },
  {
    id: "winged-sun",
    section: "solar",
    glyph: "winged-sun",
    title: "Winged sun",
    card: "A disk with spread wings — Egypt, Assyria, Persia. Later copied in occult orders and some civic seals.",
    seenToday: "Masonic and Theosophical art, museum jewelry replicas, album covers, and 'Egyptian' décor.",
    meaning:
      "Royal and divine protection under the sun-god; the king rules under that disk. It is not a biblical cherub. It is a sky-god emblem of empire.",
    history:
      "Egyptian Behedeti / Horus of Edfu and related solar disks; Assyrian and Achaemenid winged disks for Assur and Ahura Mazda in royal reliefs. Nineteenth-century occult revival copied the motif into lodge rooms.",
    intention:
      "Place the king under the sun-god's wings. Today: exotic ornament. The original is still a god-sign.",
    scriptures: [
      {
        ref: "Exodus 20:3",
        text: "Thou shalt have no other gods before me.",
      },
    ],
    sources: ["Exodus 20:3; Egyptian and Mesopotamian royal reliefs of the winged disk"],
  },
  {
    id: "crescent-moon",
    section: "solar",
    glyph: "crescent-moon",
    title: "Crescent moon",
    card: "The sickle moon of Sin, of Artemis/Diana, of later Marian iconography, and of Islamic standards. A sky-sign of the nations.",
    seenToday: "Flags, 'goddess' jewelry, Islamic art, and statues of Mary standing on a crescent (drawing on Revelation 12 imagery mixed with older moon-goddess poses).",
    meaning:
      "Moon deities governed time, women, and the night. Jeremiah 10:2 forbids heathen dismay at the signs of heaven. A crescent on a banner is not automatically 'satanic'; it is a celestial god-sign the Bible already named as a snare.",
    history:
      "Ur and Harran worshipped Sin, the moon-god. Greek Artemis and Roman Diana bear the crescent. The Qur'anic/Islamic crescent as a political emblem is later than the earliest Islam; the moon as deity is far older.",
    intention:
      "Honour the moon as god or as timed fate. Today: national flag, goddess-shop, or Madonna art. Test whether the pose is Revelation 12 or Diana renamed.",
    scriptures: [
      {
        ref: "Deuteronomy 17:3",
        text: "And hath gone and served other gods, and worshipped them, either the sun, or moon, or any of the host of heaven, which I have not commanded;",
      },
    ],
    sources: ["Deuteronomy 17:3; 4:19; Jeremiah 10:2"],
  },
  {
    id: "evergreen",
    section: "solar",
    glyph: "evergreen",
    title: "Evergreen tree",
    card: "The tree that does not die in winter — Yule, groves, the parlour fir, wreaths.",
    seenToday: "Christmas trees, wreaths, logos, and 'keep the tree' arguments that treat the fir as the faith.",
    meaning:
      "Life in the death of the sun. Forbidden grove-worship in Israel used green trees on high places. The German Christmas tree is a later domestic form of the same winter logic.",
    history:
      "See the Christmas-tree custom in this same section. Deuteronomy 16:21; Jeremiah 17:2; 2 Kings 17:10.",
    intention:
      "Bring undying vegetation into the house at the year's death. Participation: the tree as the center of the renamed midwinter feast.",
    scriptures: [
      {
        ref: "Deuteronomy 16:21",
        text: "Thou shalt not plant thee a grove of any trees near unto the altar of the LORD thy God, which thou shalt make thee.",
      },
    ],
    sources: ["Deuteronomy 16:21; Jeremiah 10:2–4; 17:2; 2 Kings 17:10"],
  },
  {
    id: "oak-mistletoe",
    section: "solar",
    glyph: "oak-mistletoe",
    title: "Oak and mistletoe",
    card: "Pliny: Druids held nothing more sacred than mistletoe on the oak, heaven-sent all-heal.",
    seenToday: "Kissing sprigs in doorways, 'Druid' jewelry, neopagan groves.",
    meaning: "Priestly plant-cult. The oak as world-tree or sky-god's tree; the evergreen parasite as gift from heaven.",
    history: "Pliny, Natural History 16.95. Later English kissing custom. Not a Gospel ordinance.",
    intention: "Sacred healing and sky-gift. Today: romance game at midwinter.",
    scriptures: [
      {
        ref: "Deuteronomy 12:30",
        text: "Take heed to thyself that thou be not snared by following them, after that they be destroyed from before thee; and that thou enquire not after their gods, saying, How did these nations serve their gods? even so will I do likewise.",
      },
    ],
    sources: ["Pliny, Natural History 16.95; Deuteronomy 12:30"],
  },
  {
    id: "zodiac-wheel",
    section: "solar",
    glyph: "zodiac-wheel",
    title: "Zodiac wheel",
    card: "Twelve signs around a circle — Babylonian and Hellenistic fate-map. 'What's your sign' is that map as identity.",
    seenToday: "Apps, newspapers, tattoos, and church youth who 'don't believe it' but still are a Leo.",
    meaning:
      "The person is written in the stars at birth. Isaiah 47:13–14: astrologers and monthly prognosticators cannot save. Deuteronomy 18: observer of times.",
    history: "Mesopotamian celestial omens; Greek twelve-sign zodiac; Roman and medieval Europe kept the art. Newspaper sun-signs are a late popular reduction.",
    intention: "Read fate. Today: identity and entertainment. Scripture's category does not change with the magazine.",
    scriptures: [
      {
        ref: "Isaiah 47:13",
        text: "Thou art wearied in the multitude of thy counsels. Let now the astrologers, the stargazers, the monthly prognosticators, stand up, and save thee from these things that shall come upon thee.",
      },
    ],
    sources: ["Isaiah 47:13–14; Deuteronomy 18:10–12; Jeremiah 10:2"],
  },
  {
    id: "pentagram-up",
    section: "stars",
    glyph: "pentagram-up",
    title: "Pentagram, point up",
    card: "Five-pointed star. Pythagorean geometry, later elemental magic, then Wiccan 'upright' pentacle as 'not satanic.'",
    seenToday: "Wiccan jewelry, US civic stars (five-point, usually not a pentagram drawn in one line), flags, and occult shops.",
    meaning:
      "A unicursal five-point star. In nineteenth- and twentieth-century occultism, point-up was often taught as spirit-over-matter or as the five elements. That teaching is occult doctrine, not Exodus. A five-point star on a flag is not automatically a Wiccan pentacle — look for the interlaced pentagram in a circle, used as a magical tool.",
    history:
      "Five-point stars are ancient decorative and civic. The pentagram as a magical diagram is older in some Mediterranean math/magic texts and becomes standard in modern ceremonial magic and Wicca. Eliphas Lévi (1850s) popularized the upright vs inverted moralizing of the star.",
    intention:
      "Occult use: a working sign for elemental/spirit magic. Civic use: a star. Do not collapse every star into witchcraft; do not pretend the circled pentagram in a Book of Shadows is a flag.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–11",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer.",
      },
    ],
    sources: ["Deuteronomy 18:10–12; Eliphas Lévi, Dogme et Rituel de la Haute Magie (1854–56) on the pentagram"],
  },
  {
    id: "pentagram-down",
    section: "stars",
    glyph: "pentagram-down",
    title: "Inverted pentagram",
    card: "Point down. Lévi taught it as the goat of the sabbath / matter over spirit. Later Satanist groups took it as a badge. This drawing is a plain star, not a trademarked goat-logo.",
    seenToday: "Heavy-metal art, some Satanist jewelry, horror posters, and internet 'proof' overlaid on every triangle.",
    meaning:
      "In Lévi's scheme the inverted pentagram is the horned goat, the inversion of the 'human' upright star. Twentieth-century Satanist organizations used a goat's head in an inverted pentagram (a specific design that is trademarked — not reproduced here). The plain inverted star is still their public grammar of inversion: what was up is down.",
    history:
      "Eliphas Lévi, mid-19th century. Church of Satan (1966) and related groups made a goat-pentagram their seal. Inversion as a spiritual statement: reject the God of Scripture, exalt the goat/adversary.",
    intention:
      "Among those groups: identify with the adversary and with inversion. Among fashion: shock. Participation in the cult badge is not the same as wearing a random star — but inversion is the taught meaning.",
    scriptures: [
      {
        ref: "Isaiah 5:20",
        text: "Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness; that put bitter for sweet, and sweet for bitter!",
      },
    ],
    sources: [
      "Isaiah 5:20; Eliphas Lévi on the inverted pentagram; later Satanist use of the goat-star as a group seal (specific logo not copied here)",
    ],
  },
  {
    id: "pentacle",
    section: "stars",
    glyph: "pentacle",
    title: "Pentacle (star in a circle)",
    card: "The working tool of much modern witchcraft: pentagram enclosed, used as a pentacle on an altar. Not a random sheriff's star.",
    seenToday: "Wiccan pentacle jewelry, altar tiles, and 'religious pentacle' legal cases.",
    meaning:
      "In ceremonial magic and Wicca the pentacle is a consecrated disk or drawn figure used in ritual. The circle 'binds' the star. This page does not describe how to consecrate or use one.",
    history: "Grimoires and 20th-century Wicca standardized the circled pentagram as the craft's public sign (Gerald Gardner and later).",
    intention: "A ritual tool and identity badge of witchcraft. Wearing it as 'just a star' is the same emptying-method used on every other sign in this list.",
    scriptures: [
      {
        ref: "Deuteronomy 18:12",
        text: "For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
    ],
    sources: ["Deuteronomy 18:10–12; modern Wiccan / ceremonial-magic use of the pentacle as a working sign"],
  },
  {
    id: "hexagram",
    section: "stars",
    glyph: "hexagram",
    title: "Hexagram (two triangles)",
    card: "Six-pointed star. In Judaism it became the Shield of David. In occult texts it is the 'Seal of Solomon' used in spirit-magic diagrams. Same geometry, different claims — do not smash them into one lie or ignore the occult use.",
    seenToday: "Israeli flag, synagogues, occult 'Solomon' seals in books, Theosophy, and conspiracy posters that call every hexagram satanic.",
    meaning:
      "Two overlapping triangles. Jewish civic/religious use as Magen David is late-medieval to modern as a community badge. Occult 'Seal of Solomon' traditions (medieval and later grimoires) use hexagrams in diagrams for commanding spirits — an occupation Deuteronomy 18 forbids. The geometry is shared; the use is not identical. Truth mandate: present both. Do not call a synagogue star a Satanist pentagram. Do not pretend grimoires never used this star.",
    history:
      "Hexagrams appear in many cultures as decoration. Jewish use as a communal emblem is historically late compared with the menorah. Agrippa and later magical texts print hexagrams among planetary seals and Solomon legends.",
    intention:
      "Jewish: identity of Israel. Occult: a Solomon-magic diagram. Conspiracy: smear. Read the use.",
    scriptures: [
      {
        ref: "Deuteronomy 18:11",
        text: "Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer.",
      },
    ],
    sources: [
      "Deuteronomy 18; later Jewish Magen David as communal emblem; Agrippa and Solomonic magical texts using hexagrams (seals not reproduced as working tools)",
    ],
  },
  {
    id: "unicursal-hexagram",
    section: "stars",
    glyph: "unicursal-hexagram",
    title: "Unicursal hexagram",
    card: "Aleister Crowley's six-point star drawn in one line — a badge of Thelema, not of ancient Israel.",
    seenToday: "Thelemic jewelry, occult publishing, and tattoos among Crowley's heirs.",
    meaning:
      "Crowley (early 20th century) used this one-line hexagram as a sign of his law 'Do what thou wilt.' It is a modern occult trademark of Thelema, not the Shield of David.",
    history: "Aleister Crowley, Thelema, early 1900s. Distinct from the interlaced Star of David.",
    intention: "Identify with Thelema's will-religion. Participation: wearing a prophet of 'do what thou wilt' as a star.",
    scriptures: [
      {
        ref: "Judges 21:25",
        text: "In those days there was no king in Israel: every man did that which was right in his own eyes.",
      },
    ],
    sources: ["Judges 21:25; Crowley's Thelemic use of the unicursal hexagram"],
  },
  {
    id: "chaos-star",
    section: "stars",
    glyph: "chaos-star",
    title: "Chaos star (eight arrows)",
    card: "Eight arrows from a hub — popularized in modern chaos magic (and earlier as a fiction emblem). A sign of 'all directions / no law.'",
    seenToday: "Chaos-magic books, games, and tattoos.",
    meaning: "In late-20th-century chaos magic, a symbol of undirected force and the rejection of fixed dogma — including Scripture. Fiction (Moorcock) and occult practice borrowed each other.",
    history: "Michael Moorcock's fiction; Peter Carroll and others in chaos magic (1970s–). Not an ancient biblical sign.",
    intention: "Magic without a fixed god, will as method. The opposite of 'the LORD our God is one LORD.'",
    scriptures: [
      {
        ref: "Deuteronomy 6:4",
        text: "Hear, O Israel: The LORD our God is one LORD:",
      },
    ],
    sources: ["Deuteronomy 6:4; late-20th-century chaos-magic use"],
  },
  {
    id: "latin-cross",
    section: "crosses",
    glyph: "latin-cross",
    title: "Latin cross",
    card: "The shape of the Roman scaffold. Preaching of the cross is Scripture; bowing to a gold replica is the second commandment's snare.",
    seenToday: "Steeples, necks, graves, flags, and pastry.",
    meaning: "Historically an instrument of curse (Deuteronomy 21:23). Paul boasts in the preaching, not the jewelry (1 Corinthians 1:18). See the custom card 'Displaying crosses.'",
    history: "Roman crucifixion; slow Christian adoption as a public badge after Constantine; later veneration.",
    intention: "Rome: shame and death. Churches: memory or talisman. Test which.",
    scriptures: [
      {
        ref: "Galatians 3:13",
        text: "Christ hath redeemed us from the curse of the law, being made a curse for us: for it is written, Cursed is every one that hangeth on a tree:",
      },
    ],
    sources: ["Deuteronomy 21:23; Galatians 3:13; 1 Corinthians 1:18; Minucius Felix, Octavius 29"],
  },
  {
    id: "inverted-cross",
    section: "crosses",
    glyph: "inverted-cross",
    title: "Inverted cross",
    card: "Two meanings fight: Petrine tradition (Peter crucified head-down) versus modern Satanist inversion. Context decides. Shock-merchandise usually means the second.",
    seenToday: "Pope's furnishings in some Petrine art; metal albums; horror films.",
    meaning:
      "Catholic legend: Peter asked to be crucified upside down. That is tradition, not a New Testament command. Modern inversion: mock the cross by turning it over (same spirit as Isaiah 5:20). A movie poster with an inverted cross in blood is not a Petrine devotion.",
    history: "Acts 10–1 Peter never narrate Peter's upside-down death; later ecclesiastical legend (e.g. apocryphal Acts of Peter). 20th-century pop Satanism and cinema made the inverted cross a brand of blasphemy.",
    intention: "Either apostolic humility (in that legend) or mockery. Read the room. Merchandise of inversion is not humility.",
    scriptures: [
      {
        ref: "Isaiah 5:20",
        text: "Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness; that put bitter for sweet, and sweet for bitter!",
      },
    ],
    sources: ["Isaiah 5:20; later Acts of Peter legend; 20th-century pop-occult inversion"],
  },
  {
    id: "leviathan-cross",
    section: "crosses",
    glyph: "leviathan-cross",
    title: "Alchemical sulfur / 'Leviathan cross'",
    card: "Infinity beneath a double-cross. Alchemy's sign for brimstone; later Satanist use as 'Leviathan.'",
    seenToday: "Satanic jewelry, album art, and online lists of 'satanic symbols.'",
    meaning:
      "In alchemy, sulfur (brimstone) had a standard glyph: a cross with an inflected loop or infinity-like base in later stylization. Anton LaVey and related aesthetics adopted a brimstone-style glyph as a Satanist emblem, nicknamed the Leviathan cross. Leviathan in Scripture is a twisting serpent/dragon creature God made and will punish (Isaiah 27:1; Psalm 74:14; Job 41) — not a mascot.",
    history: "Alchemical notation; 20th-century Satanist branding. Job 41 describes Leviathan as creature, not as a logo.",
    intention: "Alchemy: a material. Satanist use: identify with rebellion and with the sea-dragon against God.",
    scriptures: [
      {
        ref: "Isaiah 27:1",
        text: "In that day the LORD with his sore and great and strong sword shall punish leviathan the piercing serpent, even leviathan that crooked serpent; and he shall slay the dragon that is in the sea.",
      },
    ],
    sources: ["Isaiah 27:1; Job 41; Psalm 74:14; alchemical sulfur glyph; later Satanist nickname 'Leviathan cross'"],
  },
  {
    id: "ankh",
    section: "crosses",
    glyph: "ankh",
    title: "Ankh (looped cross)",
    card: "Egypt's sign of life in the hands of the gods. Not the Latin cross. Worn today as 'eternal life' jewelry without naming Osiris.",
    seenToday: "Museum shops, goth jewelry, African-heritage fashion, and some churches that treat it as a cross variant.",
    meaning:
      "Hieroglyph for life (*ankh*), held by Egyptian deities to the nose of the king. It is a god-sign of the Egyptian pantheon. It is not Galatians 3's tree. Some Coptic uses later mixed looped crosses; the pharaonic object remains a life-amulet of other gods.",
    history: "Pharaonic Egypt, ubiquitous in temple reliefs. Nineteenth-century occult revival (Theosophy, Crowley-adjacent Egyptomania) re-popularized it in the West.",
    intention: "Life from the Egyptian gods. Today: style. Participation: wearing Osiris's life-sign as a cross substitute.",
    scriptures: [
      {
        ref: "Exodus 20:3–4",
        text: "Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth:",
      },
    ],
    sources: ["Exodus 20:3–5; Egyptian temple reliefs of the ankh as divine life"],
  },
  {
    id: "all-seeing-eye",
    section: "eyes",
    glyph: "all-seeing-eye",
    title: "Eye in the triangle (all-seeing eye)",
    card: "Providence, the craftsman's 'Great Architect,' the US Great Seal, and a thousand conspiracy posters. Scripture: the LORD's eyes, not a painted eye-god.",
    seenToday: "Dollar bill, Masonic tracing boards, corporate logos, and 'Illuminati' memes.",
    meaning:
      "An eye in a radiance or triangle. Christian artists sometimes meant the Trinity watching. Freemasonry uses the All-Seeing Eye for the Great Architect. The US reverse Great Seal (1782) has an unfinished pyramid and eye as 'Providence.' Occult and conspiracy culture then made it a single global-cult logo. Truth: the geometry is shared; the doctrines are not one blob. Proverbs 15:3 locates all-seeing in the LORD. A lodge's Architect is not automatically YHWH of Sinai.",
    history:
      "Eye of Providence in Baroque Christian art; Masonic use; 1782 Great Seal (Charles Thomson's explanation: Providence). Later occult and pop culture fused it with Egypt's Eye of Horus.",
    intention:
      "Watchfulness of a deity or of 'Providence.' Today: civic seal, lodge, or meme. Test which god is said to see.",
    scriptures: [
      {
        ref: "Proverbs 15:3",
        text: "The eyes of the LORD are in every place, beholding the evil and the good.",
      },
    ],
    sources: ["Proverbs 15:3; Psalm 139; US Great Seal reverse (1782); Masonic all-seeing eye; distinguish from Eye of Horus"],
  },
  {
    id: "eye-of-horus",
    section: "eyes",
    glyph: "eye-of-horus",
    title: "Eye of Horus (Wadjet)",
    card: "Egyptian healing and royal-protection eye. Not the same drawing as the US Providence eye, though pop culture fuses them.",
    seenToday: "Tattoos, makeup branding, 'spiritual' jewelry, and pyramid merch.",
    meaning:
      "The restored eye of Horus, a god's body-part as amulet of health, protection, and kingship. Wearing it is a Horus-amulet whether or not the wearer can parse hieroglyphs.",
    history: "Pharaonic amulets and coffin texts. Modern occult and fashion revival.",
    intention: "Protection from Horus/Wadjet. Today: aesthetic. Same emptying-method.",
    scriptures: [
      {
        ref: "Isaiah 31:1",
        text: "Woe to them that go down to Egypt for help; and stay on horses, and trust in chariots, because they are many; and in horsemen, because they are very strong; but they look not unto the Holy One of Israel, neither seek the LORD!",
      },
    ],
    sources: ["Isaiah 31:1; Exodus 20:3–5; Egyptian Wadjet / Eye of Horus amulets"],
  },
  {
    id: "nazar-eye",
    section: "eyes",
    glyph: "nazar-eye",
    title: "Nazar (evil-eye bead)",
    card: "Blue concentric eye to bounce curse. Folk apotropaic magic around the Mediterranean and West Asia.",
    seenToday: "Keychains, baby pins, Airbnb décor, and 'just a souvenir from Turkey.'",
    meaning:
      "A charm against the envious gaze. Deuteronomy 18 lists charmers. Protection is the LORD's name, not a glass eye (Proverbs 18:10).",
    history: "Wide folk use (Greek βασκανία, Turkish nazar). Not a biblical ordinance.",
    intention: "Bind envy by a counter-eye. Participation: a rival protector on the stroller.",
    scriptures: [
      {
        ref: "Proverbs 18:10",
        text: "The name of the LORD is a strong tower: the righteous runneth into it, and is safe.",
      },
    ],
    sources: ["Proverbs 18:10; Deuteronomy 18:10–12; Mediterranean nazar folk charm"],
  },
  {
    id: "hamsa",
    section: "eyes",
    glyph: "hamsa",
    title: "Hamsa (hand of protection)",
    card: "Open hand, often with an eye in the palm — Khamsa / Hand of Fatima / Hand of Miriam. Folk protection across Jewish, Muslim, and occult-shop contexts.",
    seenToday: "Wall hangings, necklaces, and 'boho' stores.",
    meaning: "An apotropaic hand. Sometimes called after Fatima or Miriam. Still a charm. The LORD's hand in Scripture is His power, not a metal palm on the wall.",
    history: "North African and Levantine folk; modern global jewelry.",
    intention: "Warding. Participation: another amulet in the category of charmer.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch.",
      },
    ],
    sources: ["Deuteronomy 18:10–12; Levantine / Maghreb hamsa folk use"],
  },
  {
    id: "ouroboros",
    section: "serpents",
    glyph: "ouroboros",
    title: "Ouroboros (serpent eating its tail)",
    card: "Eternity as a loop, death-and-rebirth without a Judge, alchemy's 'all is one.' The opposite of a beginning and an end in the LORD.",
    seenToday: "Tattoos, gnostic-adjacent art, jewelry, and corporate 'cycle' logos.",
    meaning:
      "The snake that consumes itself: endless return, no final judgment, matter as eternal. Egyptian and Greek alchemical texts use it. Revelation's God is Alpha and Omega — not a loop with no exit.",
    history: "Egyptian funerary and later Hellenistic magic; alchemical emblems (Chrysopoeia of Cleopatra, etc.). Gnostic and occult revival.",
    intention: "Eternal nature without the Creator's throne. Today: 'cycles' aesthetics.",
    scriptures: [
      {
        ref: "Revelation 22:13",
        text: "I am Alpha and Omega, the beginning and the end, the first and the last.",
      },
    ],
    sources: ["Revelation 22:13; Genesis 3; Egyptian / Hellenistic ouroboros; alchemical use"],
  },
  {
    id: "caduceus",
    section: "serpents",
    glyph: "caduceus",
    title: "Caduceus (two serpents on a staff)",
    card: "Hermes' wand of commerce and messages. Often confused with the medical rod of Asclepius (one snake). Serpent-as-healer is the nations' twist on Numbers 21.",
    seenToday: "Hospitals, pharmacies, and military medical insignia (often the wrong staff).",
    meaning:
      "Hermes/Mercury: trade, theft, messages between gods. Asclepius: one serpent, healing god. Numbers 21's brazen serpent was God's provision, later smashed as Nehushtan when it was worshipped (2 Kings 18:4). Medical logos that use Hermes' two snakes are pagan grammar even when the intent is 'health.'",
    history: "Greek and Roman cult. US Army Medical Corps adopted the caduceus in 1902 (a known mix-up with Asclepius).",
    intention: "Herald of the gods / healing god. Today: medicine. The snake remains the sign.",
    scriptures: [
      {
        ref: "2 Kings 18:4",
        text: "He removed the high places, and brake the images, and cut down the groves, and brake in pieces the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan.",
      },
    ],
    sources: ["Numbers 21:8–9; 2 Kings 18:4; Greek caduceus of Hermes; rod of Asclepius"],
  },
  {
    id: "baphomet-pentagram",
    section: "horns",
    glyph: "baphomet-pentagram",
    title: "Goat and the inverted star (Baphomet's grammar)",
    card: "Lévi's 1856 Baphomet (a goat-headed androgyne) plus the inverted pentagram became the public face of modern Satanism. We draw a schematic goat-skull over an inverted star — not the Church of Satan's trademarked seal.",
    seenToday: "Satanic Temple statues, protest props, metal art, and 'Baphomet' Halloween masks.",
    meaning:
      "Éliphas Lévi's Baphomet is a 19th-century occult drawing: goat, torch, caduceus-abdomen, solve/coagula — a manifesto of 'equilibrium' of opposites, including what Scripture calls abomination. Knights Templar were accused of a head called Baphomet in 14th-century trials; historians dispute what that word even meant. Lévi invented the famous picture. Later Satanist groups put a goat in an inverted pentagram as a corporate logo (trademarked; not copied here). Leviticus 17:7 forbids sacrificing to goat-demons (*seirim*).",
    history:
      "1307–1314 Templar accusations; Lévi 1856; 20th-century Satanist branding; 21st-century political Baphomet statues. Goat-demons in the Hebrew Bible are older than all of that.",
    intention:
      "Lévi: occult synthesis. Satanist groups: the adversary as mascot. Scripture: do not go after goat-demons. Participation in the statue or the badge is public alignment with that mascot.",
    scriptures: [
      {
        ref: "Leviticus 17:7",
        text: "And they shall no more offer their sacrifices unto devils, after whom they have gone a whoring. This shall be a statute for ever unto them throughout their generations.",
      },
    ],
    sources: [
      "Leviticus 17:7 (seirim, KJV 'devils'); 2 Chronicles 11:15; Eliphas Lévi, 1856 Baphomet plate; later Satanist goat-pentagram (logo not reproduced)",
    ],
  },
  {
    id: "thor-hammer",
    section: "horns",
    glyph: "thor-hammer",
    title: "Thor's hammer (Mjölnir)",
    card: "The thunder-god's weapon, revived as a neopagan pendant. Thursday is still his day in English.",
    seenToday: "Jewelry, Viking-revival tattoos, and some extremist misuse of Norse signs (not identical to every hammer pendant).",
    meaning: "Protection and power from Thor. Wearing Mjölnir as identity is a Thor-amulet. Exodus 20:3.",
    history: "Norse literature and archaeology (hammer pendants in Viking Age graves). Modern Ásatrú revival.",
    intention: "Honour Thor. Today: heritage or pagan religion. Thursday still names him.",
    scriptures: [
      {
        ref: "Exodus 20:3",
        text: "Thou shalt have no other gods before me.",
      },
    ],
    sources: ["Exodus 20:3; 23:13; Norse Mjölnir pendants; English Thursday < Thor"],
  },
  {
    id: "valknut",
    section: "horns",
    glyph: "valknut",
    title: "Valknut (locked triangles)",
    card: "Three interlocking triangles associated in modern use with Odin and the slain. Archaeological meaning is debated; pop-pagan meaning is not.",
    seenToday: "Tattoos, Ásatrú sites, and some extremist co-option.",
    meaning:
      "Stora Hammars and other picture stones show the motif near Odin-related scenes; the name *valknut* is modern. Contemporary pagans treat it as Odin's knot of the fallen. It is not a biblical sign.",
    history: "Germanic Migration-period / Viking-Age stones; 20th-century name and revival.",
    intention: "Modern: Odin and the dead warriors. Wear as such, and it is an Odin-sign.",
    scriptures: [
      {
        ref: "Exodus 23:13",
        text: "And in all things that I have said unto you be circumspect: and make no mention of the name of other gods, neither let it be heard out of thy mouth.",
      },
    ],
    sources: ["Exodus 23:13; Germanic picture stones; modern Ásatrú use"],
  },
  {
    id: "triple-moon",
    section: "horns",
    glyph: "triple-moon",
    title: "Triple moon (goddess)",
    card: "Waxing, full, waning moons — the modern 'Triple Goddess' (Maiden/Mother/Crone). A 20th-century goddess-religion badge.",
    seenToday: "Wiccan shops, 'divine feminine' branding, and yoga studios.",
    meaning: "Robert Graves and later Wicca taught a triple moon-goddess. Jeremiah's Queen of Heaven is older; this is the modern retail form of moon-goddess religion.",
    history: "20th-century Wicca and Goddess movement; not a Torah symbol.",
    intention: "Worship or honour the Goddess in three aspects. Participation: that religion's badge.",
    scriptures: [
      {
        ref: "Jeremiah 7:18",
        text: "The children gather wood, and the fathers kindle the fire, and the women knead their dough, to make cakes to the queen of heaven, and to pour out drink offerings unto other gods, that they may provoke me to anger.",
      },
    ],
    sources: ["Jeremiah 7:18; 44:17–19; 20th-century Wiccan Triple Goddess"],
  },
  {
    id: "skull",
    section: "death",
    glyph: "skull",
    title: "Skull and death's-head",
    card: "Memento mori can be Christian art. A skull as a costume of the dead, a Nazi Totenkopf, or a 'cool' death-god is another use. Context.",
    seenToday: "Halloween, fashion, biker patches, some military insignia, and sugar-skull folk (Día de los Muertos — a different, later syncretic feast of the dead).",
    meaning:
      "To remember death is wisdom (Psalm 90:12). To costume the dead, pray to them, or make death a brand is the theme of Deuteronomy 18 and Isaiah 8:19. Mexican sugar skulls belong to a syncretic feast of the dead, not to Leviticus 23.",
    history: "Medieval memento mori; military death's-heads; Halloween; later folk Catholicism mixed with older dead-feasts.",
    intention: "Either 'you will die' or 'honour/play as the dead.' The second is the nations' night.",
    scriptures: [
      {
        ref: "Isaiah 8:19",
        text: "And when they shall say unto you, Seek unto them that have familiar spirits, and unto wizards that peep, and that mutter: should not a people seek unto their God? for the living to the dead?",
      },
    ],
    sources: ["Isaiah 8:19; Deuteronomy 18:10–12; Psalm 90:12"],
  },
  {
    id: "circle-ring",
    section: "craft",
    glyph: "circle-ring",
    title: "Closed circle (ring, magic circle, wedding band)",
    card: "A circle binds. Magicians draw circles to contain spirits. Rome pledged brides with a ring. A gold band is not automatically a magic circle — occult texts still treat the circle as a working boundary.",
    seenToday: "Wedding rings, pentacles, and ritual diagrams (not drawn here as instructions).",
    meaning:
      "In grimoires the circle is a barrier and a world. In Rome the ring is a pledge. Scripture's covenant is spoken and lived, not a geometric spell. See wedding-rings custom.",
    history: "Roman anulus; Solomonic and later magical circles (we do not reproduce working circle-rites).",
    intention: "Bind or pledge. Test whether the circle is marriage-furniture or a spirit-working.",
    scriptures: [
      {
        ref: "James 2:2",
        text: "For if there come unto your assembly a man with a gold ring, in goodly apparel, and there come in also a poor man in vile raiment;",
      },
    ],
    sources: ["James 2:2–3; Roman marriage ring; later magical 'circle' doctrine (rites not given)"],
  },
  {
    id: "pyramid-eye",
    section: "craft",
    glyph: "pyramid-eye",
    title: "Unfinished pyramid and eye",
    card: "The US Great Seal reverse: thirteen courses, capstone with eye, *Annuit Coeptis* / *Novus Ordo Seclorum*. Civic Enlightenment emblem later treated as a single occult master-key.",
    seenToday: "Dollar bill, conspiracy media, and 'new world order' merch.",
    meaning:
      "Charles Thomson (1782) explained the eye as Providence favouring the American cause, the unfinished pyramid as strength, the mottoes as Providence and a new order of the ages (Virgil's language). That is Enlightenment deism on a seal — not a verse of Scripture, and not automatically a proof of one hidden Satanist cabal. Occult groups also like pyramids and eyes. Present the civic document and the later occult reading as a conflict, not as one forced story.",
    history: "1782 Great Seal; 1935 dollar-bill popularization; 20th-century conspiracy literature.",
    intention:
      "1782: Providence and lasting union. Later occult/conspiracy: a priesthood of the eye. Neither is Sinai. Do not baptize the seal; do not invent a single cabal from a Virgil motto.",
    scriptures: [
      {
        ref: "Psalm 127:1",
        text: "Except the LORD build the house, they labour in vain that build it: except the LORD keep the city, the watchman waketh but in vain.",
      },
    ],
    sources: ["Psalm 127:1; US Great Seal reverse, Thomson 1782 explanation; later popular occult readings"],
  },
  {
    id: "masonic-square",
    section: "craft",
    glyph: "masonic-square",
    title: "Square and compasses",
    card: "The public badge of Freemasonry, often with a G. A lodge religion of symbols, oaths, and a generic Architect — not the Gospel, not 'just a hardware logo.'",
    seenToday: "Rings, car decals, building cornerstones, and cemetery markers.",
    meaning:
      "Operative masons' tools made speculative: morality as geometry, God as Great Architect, secrecy and oaths. Matthew 5:34–37 and James 5:12 weigh oaths. 2 Corinthians 6:14–18 weighs yoking. This page is not a lodge exposé of every degree; it is the public sign.",
    history: "Early modern speculative Freemasonry (1717 London Grand Lodge as a conventional landmark); tools far older as trade.",
    intention: "Lodge identity and a religion of the Architect. Participation: that fraternity's mark on the body.",
    scriptures: [
      {
        ref: "James 5:12",
        text: "But above all things, my brethren, swear not, neither by heaven, neither by the earth, neither by any other oath: but let your yea be yea; and your nay, nay; lest ye fall into condemnation.",
      },
    ],
    sources: ["James 5:12; Matthew 5:34–37; 2 Corinthians 6:14–18; public Masonic square-and-compasses emblem"],
  },
  {
    id: "obelisk",
    section: "craft",
    glyph: "obelisk",
    title: "Obelisk",
    card: "Egypt's petrified sun-ray, re-erected in Rome, Paris, London, and Washington. A stone needle of another god in 'Christian' capitals.",
    seenToday: "Vatican plaza, Washington Monument, war memorials, graveyard pillars.",
    meaning:
      "Egyptian obelisks are solar-temple architecture, inscribed to pharaohs and gods. Rome took them as trophies and re-erected them (including in the circus that became St. Peter's square). A graveyard obelisk is often just a Victorian shape — the form still comes from that solar stone.",
    history: "Pharaonic cult; Roman relocation; modern civic copies (Washington Monument completed 1884).",
    intention: "Sun and king. Today: civic grandeur. The shape remains Egypt's.",
    scriptures: [
      {
        ref: "Jeremiah 43:13",
        text: "He shall break also the images of Bethshemesh, that is in the land of Egypt; and the houses of the gods of the Egyptians shall he burn with fire.",
      },
    ],
    sources: ["Jeremiah 43:13; Egyptian obelisks; Roman re-erection; Washington Monument as civic obelisk"],
  },
  {
    id: "number-666",
    section: "craft",
    glyph: "number-666",
    title: "Six hundred threescore and six",
    card: "Revelation 13:18's number of the beast. Pop culture made it a joke and a brand. The text is a call to wisdom, not a Halloween font.",
    seenToday: "Horror posters, barcodes-as-proof videos, and inverted 'jokes.'",
    meaning:
      "A number of a man, to be counted with wisdom. Later speculation (Nero gematria, papal titles, microchips) is not the verse itself. Using 666 as décor is treating the beast's number as entertainment — inversion as a product.",
    history: "Revelation 13:18; manuscript variants (some 616); Irenaeus discusses the number. Modern pop use is empty shock.",
    intention: "In the text: identify the beast. In the mall: joke. The joke is still the number.",
    scriptures: [
      {
        ref: "Revelation 13:18",
        text: "Here is wisdom. Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six.",
      },
    ],
    sources: ["Revelation 13:18; Irenaeus, Against Heresies 5.30"],
  },
  {
    id: "egg-hare",
    section: "solar",
    glyph: "egg-hare",
    title: "Egg and hare",
    card: "Spring fertility tokens on the English Easter. Not in Exodus 12. Sold to children as the faith.",
    seenToday: "Church lawns, chocolate, and school hunts.",
    meaning: "New life and fertility folk. Passover's appointed signs are lamb, unleavened bread, and bitter herbs — not a hare.",
    history: "European spring folk; Bede on Eostre; commercial Easter.",
    intention: "Fertility of the season. Today: 'for the kids.' The kids are being taught the wrong feast-signs.",
    scriptures: [
      {
        ref: "Exodus 12:8",
        text: "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it.",
      },
    ],
    sources: ["Exodus 12; 1 Corinthians 5:7–8; Bede, De temporum ratione 15"],
  },
  {
    id: "janus-door",
    section: "solar",
    glyph: "janus-door",
    title: "Two-faced doorway (Janus)",
    card: "January's god looks both ways. New Year's Day is his threshold.",
    seenToday: "January 1, 'Janus-faced' speech, door-rituals at midnight.",
    meaning: "Beginnings, gates, war-and-peace doors of the Janus Geminus in the Forum. The year-start is his.",
    history: "Roman cult of Janus; Julian calendar; Tertullian against the New Year.",
    intention: "Honour the door-god of time. Today: fireworks. The date is still his.",
    scriptures: [
      {
        ref: "Exodus 12:2",
        text: "This month shall be unto you the beginning of months: it shall be the first month of the year to you.",
      },
    ],
    sources: ["Exodus 12:2; Tertullian, On Idolatry 14; Roman Janus"],
  },
  {
    id: "cupid-heart",
    section: "craft",
    glyph: "cupid-heart",
    title: "Heart and arrow (Cupid)",
    card: "Eros/Cupid's brand. Valentine merchandise is his shrine in paper.",
    seenToday: "14 February, logos, emoji.",
    meaning: "The Roman love-god's wound. Not Song of Solomon.",
    history: "Classical Eros; later Valentine commercial art.",
    intention: "Love as Cupid's hit. Today: romance retail.",
    scriptures: [
      {
        ref: "Exodus 20:3",
        text: "Thou shalt have no other gods before me.",
      },
    ],
    sources: ["Exodus 20:3; classical Cupid/Eros; later Valentine commercial art"],
  },
  {
    id: "maypole",
    section: "solar",
    glyph: "maypole",
    title: "Maypole",
    card: "A dressed tree-substitute, ribbons, spring dance.",
    seenToday: "School greens, English villages, neopagan Beltane.",
    meaning: "Green-tree fertility rite in daylight clothes.",
    history: "Medieval and early modern English May; Puritans attacked it.",
    intention: "Bring in the May. Participation: grove-logic for children.",
    scriptures: [
      {
        ref: "2 Kings 17:10",
        text: "And they set them up images and groves in every high hill, and under every green tree:",
      },
    ],
    sources: ["2 Kings 17:10; Deuteronomy 16:21; English May folk"],
  },
  {
    id: "halo-nimbus",
    section: "solar",
    glyph: "halo-nimbus",
    title: "Nimbus (saint's disk)",
    card: "The solar disk moved behind a human head and called holiness.",
    seenToday: "Icons, holy cards, Christmas pageants.",
    meaning: "Same visual as Sol. See radiate crown.",
    history: "Late antique Christian art borrowing imperial solar light.",
    intention: "Mark divinity/holiness with the sun's disk.",
    scriptures: [
      {
        ref: "Deuteronomy 4:15–16",
        text: "Take ye therefore good heed unto yourselves; for ye saw no manner of similitude on the day that the LORD spake unto you in Horeb out of the midst of the fire: Lest ye corrupt yourselves, and make you a graven image, the similitude of any figure, the likeness of male or female,",
      },
    ],
    sources: ["Deuteronomy 4:15–16; Romans 1:23"],
  },
];
