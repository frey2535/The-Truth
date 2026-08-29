/** Names of the adversary and of the nations' gods. Scripture first. Later occult lists are identified, not turned into a working grimoire. */

export const NAME_SECTIONS = [
  {
    id: "scripture",
    title: "Named in Scripture",
    blurb:
      "The canon does not print a phone book of hell. It names the serpent, Satan, the devil, unclean spirits, and a few titles. That is enough to know the enemy is personal, a liar, and already judged.",
  },
  {
    id: "nations",
    title: "Gods of the nations (the other side of the same war)",
    blurb:
      "Paul says the things the Gentiles sacrifice, they sacrifice to devils, not to God (1 Corinthians 10:20). The named gods of Canaan, Egypt, Babylon, and Greece are not 'just culture.'",
  },
  {
    id: "later",
    title: "Later occult catalogs (identified, not reproduced)",
    blurb:
      "From the 1500s–1800s, demonologists and grimoires ranked 'princes,' assigned seals, and sold methods. This app will not draw those seals or teach conjuration. Deuteronomy 18 already named the occupation. The deception is that a complete picture of the enemy requires his own textbooks.",
  },
  {
    id: "watchers",
    title: "Fallen angels and the Watchers",
    blurb:
      "Genesis 6, 1 Enoch, Jude, and 2 Peter sit in one war: beings who left their estate, taught the nations' crafts, and are reserved for judgment. Qumran copied Enoch. This is not a summoning list. It is the Bible's own window on how the world learned the way of the heathen.",
  },
];

export const ADVERSARY_NAMES = [
  {
    id: "satan",
    section: "scripture",
    title: "Satan",
    card: "The adversary. Accuser of the brethren. Appears in Job, Zechariah, the Gospels, and Revelation. Not a cartoon in red tights — a personal enemy who quotes Scripture and seeks to devour.",
    meaningToday:
      "When traditions, images, and 'harmless' rites are kept in Messiah's name, the strategy is the same as Genesis 3 and Matthew 4: mix a word of God with a lie, and offer a shorter path. You do not have to intend 'Satan' for him to be served by a commandment of men that replaced a commandment of God (Mark 7:7–9; John 8:44).",
    history:
      "Hebrew *satan* means adversary. Job 1–2: he appears among the sons of God, accuses Job, and is limited by YHWH. Zechariah 3:1–2: he resists Joshua the high priest; the LORD rebukes him. 1 Chronicles 21:1: Satan stands against Israel (compare 2 Samuel 24:1 — present the tension). Gospels: he tempts Messiah with Scripture (Matthew 4). Revelation 12:9: the great dragon, that old serpent, called the Devil and Satan, who deceives the whole world.",
    scriptures: [
      {
        ref: "Job 1:6–7",
        text: "Now there was a day when the sons of God came to present themselves before the LORD, and Satan came also among them. And the LORD said unto Satan, Whence comest thou? Then Satan answered the LORD, and said, From going to and fro in the earth, and from walking up and down in it.",
      },
      {
        ref: "Revelation 12:9",
        text: "And the great dragon was cast out, that old serpent, called the Devil, and Satan, which deceiveth the whole world: he was cast out into the earth, and his angels were cast out with him.",
      },
      {
        ref: "John 8:44",
        text: "Ye are of your father the devil, and the lusts of your father ye will do. He was a murderer from the beginning, and abode not in the truth, because there is no truth in him. When he speaketh a lie, he speaketh of his own: for he is a liar, and the father of it.",
      },
      {
        ref: "1 Peter 5:8",
        text: "Be sober, be vigilant; because your adversary the devil, as a roaring lion, walketh about, seeking whom he may devour:",
      },
    ],
    sources: ["Job 1–2; Zechariah 3:1–2; 1 Chronicles 21:1; Matthew 4; John 8:44; Revelation 12:9; 1 Peter 5:8"],
  },
  {
    id: "serpent-dragon",
    section: "scripture",
    title: "The serpent and the dragon",
    card: "Eden's serpent is identified in Revelation as the dragon and Satan. The war is from Genesis 3 to the lake of fire — not a medieval invention.",
    meaningToday:
      "The first deception was not a pentagram. It was 'hath God said' plus a promised opening of the eyes. Every later custom that keeps a forbidden way and calls it wisdom is that grammar.",
    history:
      "Genesis 3: the serpent is subtil, questions the commandment, promises to be as gods. Numbers 21: a brazen serpent for healing, later worshipped and smashed (2 Kings 18:4). Isaiah 27:1: Leviathan the piercing serpent, the dragon in the sea. Revelation 12 and 20: dragon bound, then loosed, then doomed.",
    scriptures: [
      {
        ref: "Genesis 3:1",
        text: "Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden?",
      },
      {
        ref: "Genesis 3:5",
        text: "For God doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil.",
      },
    ],
    sources: ["Genesis 3; 2 Kings 18:4; Isaiah 27:1; Revelation 12; 20"],
  },
  {
    id: "devil",
    section: "scripture",
    title: "The devil",
    card: "Greek *diabolos*: slanderer. Used of the same enemy as Satan. He has angels, doctrines, and devices.",
    meaningToday:
      "2 Corinthians 2:11: not ignorant of his devices. 1 Timothy 4:1: doctrines of devils. The devices in this whole section are renamed rites, images, and 'games' that are the old occupations.",
    history: "New Testament title alongside Satan. Matthew 4; 13:39 (the enemy that sowed tares); Ephesians 6:11 (wiles); James 4:7 (resist).",
    scriptures: [
      {
        ref: "Ephesians 6:11–12",
        text: "Put on the whole armour of God, that ye may be able to stand against the wiles of the devil. For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.",
      },
      {
        ref: "1 Timothy 4:1",
        text: "Now the Spirit speaketh expressly, that in the latter times some shall depart from the faith, giving heed to seducing spirits, and doctrines of devils;",
      },
    ],
    sources: ["Matthew 4; 13:39; Ephesians 6:11–12; 1 Timothy 4:1; James 4:7; 2 Corinthians 2:11"],
  },
  {
    id: "lucifer",
    section: "scripture",
    title: "Lucifer (Isaiah 14:12 KJV)",
    card: "The King James reads 'Lucifer, son of the morning' in a taunt against the king of Babylon. Later Christian teaching applied it to Satan's fall. Present the text and the later identification as two layers — do not hide either.",
    meaningToday:
      "Occult and pop culture use 'Lucifer' as a proper name of a light-bearer rebel. Isaiah 14 is a proverb against a man who said 'I will be like the most High.' Whether the verse also peels back to the spiritual rebel is a long dispute. What is not disputed: pride that would sit in God's seat is the pattern — and light as a disguise is 2 Corinthians 11:14.",
    history:
      "Hebrew *helel ben-shachar* (shining one, son of dawn). Latin *lucifer* = morning star / light-bearer. The taunt is aimed at the king of Babylon (Isaiah 14:4). Ezekiel 28's prince/king of Tyre is the parallel passage often read the same way. 2 Corinthians 11:14: Satan himself is transformed into an angel of light.",
    scriptures: [
      {
        ref: "Isaiah 14:12–14",
        text: "How art thou fallen from heaven, O Lucifer, son of the morning! how art thou cut down to the ground, which didst weaken the nations! For thou hast said in thine heart, I will ascend into heaven, I will exalt my throne above the stars of God: I will sit also upon the mount of the congregation, in the sides of the north: I will ascend above the heights of the clouds; I will be like the most High.",
      },
      {
        ref: "2 Corinthians 11:14",
        text: "And no marvel; for Satan himself is transformed into an angel of light.",
      },
    ],
    sources: ["Isaiah 14:4–15; Ezekiel 28:12–19; 2 Corinthians 11:14"],
  },
  {
    id: "beelzebub",
    section: "scripture",
    title: "Beelzebub",
    card: "Prince of the devils in the Gospels. The name is the Philistine god of Ekron (Baal-zebub) turned as a title for the ruler of demons.",
    meaningToday:
      "Messiah's enemies said He cast out demons by Beelzebub. He answered that a kingdom divided cannot stand, and that blasphemy against the Spirit is the unpardonable line (Matthew 12). The deception then was to credit the adversary with God's work. The deception now is often the reverse: credit the adversary's customs with God's name.",
    history:
      "2 Kings 1:2–3: Ahaziah inquires of Baal-zebub the god of Ekron. Gospels: Beelzebub as prince of the devils (Matthew 12:24; Mark 3:22; Luke 11:15).",
    scriptures: [
      {
        ref: "Matthew 12:24–26",
        text: "But when the Pharisees heard it, they said, This fellow doth not cast out devils, but by Beelzebub the prince of the devils. And Jesus knew their thoughts, and said unto them, Every kingdom divided against itself is brought to desolation; and every city or house divided against itself shall not stand: And if Satan cast out Satan, he is divided against himself; how shall then his kingdom stand?",
      },
    ],
    sources: ["2 Kings 1:2–6; Matthew 12:24–32; Mark 3:22; Luke 11:15–20"],
  },
  {
    id: "belial",
    section: "scripture",
    title: "Belial",
    card: "Worthlessness / a named wickedness. Sons of Belial in the Old Testament; 'what concord hath Christ with Belial?' in Paul. Dead Sea Scrolls set the Prince of Lights against the Angel of Darkness (Belial) in the War Scroll and Community Rule.",
    meaningToday:
      "2 Corinthians 6:15 is the verse for this whole library: no concord between Messiah and Belial, no agreement of the temple of God with idols. Participation in the nations' way is that yoking.",
    history:
      "Deuteronomy 13:13; Judges 19:22; 1 Samuel 2:12 — sons of Belial as lawless men. 2 Corinthians 6:15. Qumran: Belial as the hostile power in 1QS and 1QM.",
    scriptures: [
      {
        ref: "2 Corinthians 6:14–15",
        text: "Be ye not unequally yoked together with unbelievers: for what fellowship hath righteousness with unrighteousness? and what communion hath light with darkness? And what concord hath Christ with Belial? or what part hath he that believeth with an infidel?",
      },
    ],
    sources: ["Deuteronomy 13:13; 2 Corinthians 6:14–16; 1QS / 1QM (Qumran) on Belial"],
  },
  {
    id: "abaddon",
    section: "scripture",
    title: "Abaddon / Apollyon",
    card: "The angel of the bottomless pit in Revelation 9:11 — Hebrew Abaddon, Greek Apollyon, Destroyer.",
    meaningToday:
      "Not a Halloween name. A titled destroyer in the apocalypse. Pop occultism that 'works with' Apollyon is advertising the occupation God forbids.",
    history: "Job 26:6; 28:22; Proverbs 15:11 use *abaddon* as Destruction / the realm of ruin. Revelation 9:11 personalizes the angel of the pit.",
    scriptures: [
      {
        ref: "Revelation 9:11",
        text: "And they had a king over them, which is the angel of the bottomless pit, whose name in the Hebrew tongue is Abaddon, but in the Greek tongue hath his name Apollyon.",
      },
    ],
    sources: ["Job 26:6; 28:22; Revelation 9:11"],
  },
  {
    id: "legion",
    section: "scripture",
    title: "Legion",
    card: "Many unclean spirits in one man, begging to enter swine. The enemy is not a metaphor in Mark 5.",
    meaningToday:
      "Possession is treated as folklore until it is not. Scripture records Messiah's authority over a named host. This page is not a field manual for exorcism theater. It is a record that unclean spirits are real in the text.",
    history: "Mark 5:1–20; Luke 8:26–39. The spirits confess who He is and fear the abyss.",
    scriptures: [
      {
        ref: "Mark 5:9",
        text: "And he asked him, What is thy name? And he answered, saying, My name is Legion: for we are many.",
      },
    ],
    sources: ["Mark 5:1–20; Luke 8:26–39"],
  },
  {
    id: "python",
    section: "scripture",
    title: "Spirit of Python (Acts 16)",
    card: "A slave girl at Philippi with a python spirit — the Greek oracle-spirit — who told fortunes until Paul commanded it out.",
    meaningToday:
      "Fortune-telling as a business. The spirit was real, the owners were angry when the product left, and the apostles were beaten for it. Horoscopes and paid psychics sit in that marketplace.",
    history:
      "Acts 16:16: *pneuma pythona* — a python/oracle spirit. Delphi's Python was the serpent Apollo slew in myth; the title stuck to diviners.",
    scriptures: [
      {
        ref: "Acts 16:16",
        text: "And it came to pass, as we went to prayer, a certain damsel possessed with a spirit of divination met us, which brought her masters much gain by soothsaying:",
      },
    ],
    sources: ["Acts 16:16–19"],
  },
  {
    id: "azazel",
    section: "scripture",
    title: "Azazel",
    card: "Leviticus 16's scapegoat is 'for Azazel' in Hebrew. Later Enoch makes Azazel a chief of the Watchers who taught weapons and adornment. Layers: Torah ritual, then Enochic expansion.",
    meaningToday:
      "The Day of Atonement sends one goat to Azazel. That is God's ordinance, not a Halloween goat. 1 Enoch 8–10 (not the 66-book canon) blames Azazel for teaching the nations violence and cosmetics — a story of how the world learned the way of the heathen. Read it as Enoch, not as Leviticus silently rewritten.",
    history:
      "Leviticus 16:8–10, 26. 1 Enoch 8:1; 10:4–8: Azazel bound in darkness. Jude and 2 Peter 2:4 speak of angels that sinned, without the name Azazel.",
    scriptures: [
      {
        ref: "Leviticus 16:8",
        text: "And Aaron shall cast lots upon the two goats; one lot for the LORD, and the other lot for the scapegoat.",
      },
      {
        ref: "2 Peter 2:4",
        text: "For if God spared not the angels that sinned, but cast them down to hell, and delivered them into chains of darkness, to be reserved unto judgment;",
      },
    ],
    sources: ["Leviticus 16; 1 Enoch 8–10; 2 Peter 2:4; Jude 6"],
  },
  {
    id: "seirim",
    section: "scripture",
    title: "Goat-demons (seirim)",
    card: "Leviticus 17:7 forbids sacrificing to 'devils' — Hebrew *seirim*, hairy ones / goat-demons. 2 Chronicles 11:15: Jeroboam's priests for the devils and calves.",
    meaningToday:
      "Baphomet's goat-head is 19th-century art. The Torah already forbade goat-demon offerings. Halloween goats and Satanist goats are late costumes on an old prohibition.",
    history: "Leviticus 17:7; 2 Chronicles 11:15; Isaiah 13:21; 34:14 (seirim in ruined places).",
    scriptures: [
      {
        ref: "Leviticus 17:7",
        text: "And they shall no more offer their sacrifices unto devils, after whom they have gone a whoring. This shall be a statute for ever unto them throughout their generations.",
      },
    ],
    sources: ["Leviticus 17:7; 2 Chronicles 11:15; Isaiah 13:21; 34:14"],
  },
  {
    id: "lilith",
    section: "scripture",
    title: "Lilith (Isaiah 34:14)",
    card: "KJV 'screech owl'; some translations 'Lilith,' a night-creature in Edom's ruins. Later Jewish folklore made her a demon of infants. Do not read the whole later myth back into Isaiah as if the verse were a grimoire entry.",
    meaningToday:
      "Modern occult and feminist-occult writing treats Lilith as a goddess of refusal. Isaiah 34 is a judgment oracle on Edom's wasteland creatures — not a license to invoke a night-demon.",
    history:
      "Isaiah 34:14 Hebrew *lilit*. Mesopotamian lilû / lilītu spirits exist in older texts. Medieval Alphabet of Ben Sira (much later) builds the Adam's first-wife story. Keep the layers.",
    scriptures: [
      {
        ref: "Isaiah 34:14",
        text: "The wild beasts of the desert shall also meet with the wild beasts of the island, and the satyr shall cry to his fellow; the screech owl also shall rest there, and find for herself a place of rest.",
      },
    ],
    sources: ["Isaiah 34:14; later Jewish folklore (Alphabet of Ben Sira) — not canon"],
  },
  {
    id: "asmodeus",
    section: "scripture",
    title: "Asmodeus (Tobit)",
    card: "In the Apocrypha, Asmodeus the evil spirit kills Sarah's husbands. Raphael binds him. Not in the 66-book canon; in the 1611 KJV Apocrypha.",
    meaningToday:
      "Later demonology made Asmodeus a 'king of lust.' That is post-biblical ranking. Tobit already treats him as a destroyer opposed to God's messenger.",
    history: "Tobit 3:8, 8:3. Later: Testament of Solomon, medieval lists, Dictionnaire Infernal.",
    scriptures: [
      {
        ref: "Tobit 3:8 (Apocrypha)",
        text: "Because that she had been married to seven husbands, whom Asmodeus the evil spirit had killed, before they had lain with her.",
      },
    ],
    sources: ["Tobit 3:8; 8:3 (Apocrypha); later demonological lists"],
  },
  {
    id: "familiar-spirits",
    section: "scripture",
    title: "Familiar spirits and necromancers",
    card: "The occupation, not a proper name. Endor. The witch. The peepers and mutterers. Talking boards and mediums sell this occupation as a service.",
    meaningToday:
      "Leviticus 20:6: God sets His face against the soul that turns after familiar spirits. There is no entertainment clause. Saul's visit ends in judgment, not a how-to (1 Samuel 28).",
    history: "Leviticus 19:31; 20:6, 27; Deuteronomy 18:10–12; 1 Samuel 28; Isaiah 8:19; 19:3.",
    scriptures: [
      {
        ref: "Leviticus 20:6",
        text: "And the soul that turneth after such as have familiar spirits, and after wizards, to go a whoring after them, I will even set my face against that soul, and will cut him off from among his people.",
      },
    ],
    sources: ["Leviticus 19:31; 20:6; Deuteronomy 18:10–12; 1 Samuel 28; Isaiah 8:19"],
  },
  {
    id: "mammon",
    section: "scripture",
    title: "Mammon",
    card: "A master you cannot serve with God. Not always pictured as a demon in the Gospels — pictured as a rival lord.",
    meaningToday:
      "Christmas retail, prosperity as proof of the Queen of Heaven's cakes, and 'the economy' as an unquestioned god. Messiah named the rival.",
    history: "Matthew 6:24; Luke 16:13. Later medieval allegory personified Mammon as a devil of greed.",
    scriptures: [
      {
        ref: "Matthew 6:24",
        text: "No man can serve two masters: for either he will hate the one, and love the other; or else he will hold to the one, and despise the other. Ye cannot serve God and mammon.",
      },
    ],
    sources: ["Matthew 6:24; Luke 16:13"],
  },
  {
    id: "leviathan",
    section: "scripture",
    title: "Leviathan",
    card: "A real creature in Job 41, a twisting serpent in Isaiah 27:1 that the LORD will punish. Later Satanism nicknamed a brimstone glyph after him. Do not let the nickname replace the verses.",
    meaningToday:
      "Wearing a 'Leviathan cross' as rebellion is using a nickname. Job 41 still says none is so fierce that he dare stir him up — who then is able to stand before God?",
    history: "Job 41; Psalm 74:14; 104:26; Isaiah 27:1. Later occult: a 'prince of the west' in some lists; LaVeyan brimstone glyph.",
    scriptures: [
      {
        ref: "Job 41:1",
        text: "Canst thou draw out leviathan with an hook? or his tongue with a cord which thou lettest down?",
      },
    ],
    sources: ["Job 41; Psalm 74:14; Isaiah 27:1"],
  },
  {
    id: "prince-persia",
    section: "scripture",
    title: "Prince of Persia (Daniel 10)",
    card: "A territorial prince who withstood Michael twenty-one days. Scripture's window into war in the unseen over empires.",
    meaningToday:
      "Nations have more than cabinets. Daniel 10 does not invite mapping every modern flag to a demon. It does forbid pretending the war is only human.",
    history: "Daniel 10:13, 20–21; 12:1 Michael the great prince who stands for Daniel's people.",
    scriptures: [
      {
        ref: "Daniel 10:13",
        text: "But the prince of the kingdom of Persia withstood me one and twenty days: but, lo, Michael, one of the chief princes, came to help me; and I remained there with the kings of Persia.",
      },
    ],
    sources: ["Daniel 10:12–21; 12:1"],
  },
  {
    id: "baal",
    section: "nations",
    title: "Baal",
    card: "The storm-and-fertility lord of Canaan. Israel kept 'limping between two opinions.' His prophets cut themselves. Elijah's contest is not a metaphor.",
    meaningToday:
      "Baal means lord/master. Any fertility, storm, or prosperity cult that takes the LORD's people is in this line. Sunday solar rest and spring fertility feasts are not 'Baal' by slogan — they are the same category of serving other masters with YHWH's name on the building.",
    history: "Judges 2:11–13; 1 Kings 18; Jeremiah 19:5 (sons in the fire to Baal). Ugaritic texts (Ras Shamra) describe Baal's cycle — extra-biblical confirmation of the cult's character, not a second Bible.",
    scriptures: [
      {
        ref: "1 Kings 18:21",
        text: "And Elijah came unto all the people, and said, How long halt ye between two opinions? if the LORD be God, follow him: but if Baal, then follow him. And the people answered him not a word.",
      },
    ],
    sources: ["Judges 2:11–13; 1 Kings 18; Jeremiah 19:5; Ugaritic Baal cycle (Ras Shamra) as extra-biblical context"],
  },
  {
    id: "ashtoreth",
    section: "nations",
    title: "Ashtoreth / Ashtaroth",
    card: "The goddess alongside Baal. Solomon went after her. Later writers fused her with Easter/Ishtar — that fusion is often sloppy. The biblical charge does not need the fusion.",
    meaningToday:
      "Queen-of-heaven baking, triple-moon jewelry, and 'divine feminine' that replaces the LORD are in her category. Do not rest the case on a fake etymology from Ishtar to Easter; rest it on Judges 2:13 and Jeremiah 7:18.",
    history: "Judges 2:13; 10:6; 1 Kings 11:5, 33; 2 Kings 23:13. Astarte in Phoenician; Ishtar in Akkadian — related type, not identical word to English Easter (see Bede / Eostre).",
    scriptures: [
      {
        ref: "1 Kings 11:5",
        text: "For Solomon went after Ashtoreth the goddess of the Zidonians, and after Milcom the abomination of the Ammonites.",
      },
    ],
    sources: ["Judges 2:13; 1 Kings 11:5; 2 Kings 23:13; Jeremiah 7:18"],
  },
  {
    id: "molech",
    section: "nations",
    title: "Molech / Milcom",
    card: "Passing children through the fire. The Torah's horror. Not a metaphor for a busy schedule — a cult of child-burning in the valley of Hinnom.",
    meaningToday:
      "Jeremiah 7:31: they built high places of Tophet which God did not command. Any culture that sheds innocent blood and calls it worship or progress sits under this indictment. Do not cheapen Molech by calling every bad habit 'Molech.' Do not pretend the fire never happened.",
    history: "Leviticus 18:21; 20:2–5; 1 Kings 11:7; 2 Kings 23:10; Jeremiah 32:35.",
    scriptures: [
      {
        ref: "Leviticus 18:21",
        text: "And thou shalt not let any of thy seed pass through the fire to Molech, neither shalt thou profane the name of thy God: I am the LORD.",
      },
    ],
    sources: ["Leviticus 18:21; 20:2–5; 2 Kings 23:10; Jeremiah 7:31; 32:35"],
  },
  {
    id: "chemosh",
    section: "nations",
    title: "Chemosh",
    card: "Abomination of Moab. Solomon built him a high place. Mesha of Moab (Moabite Stone) boasts in Chemosh — extra-biblical.",
    meaningToday: "National gods that demand high places beside the LORD's house. Solomon's pattern: wisdom plus shrines for foreign gods.",
    history: "Numbers 21:29; 1 Kings 11:7; 2 Kings 23:13; Mesha Stele.",
    scriptures: [
      {
        ref: "1 Kings 11:7",
        text: "Then did Solomon build an high place for Chemosh, the abomination of Moab, in the hill that is before Jerusalem, and for Molech, the abomination of the children of Ammon.",
      },
    ],
    sources: ["1 Kings 11:7; 2 Kings 23:13; Mesha Stele (Louvre)"],
  },
  {
    id: "dagon",
    section: "nations",
    title: "Dagon",
    card: "Philistine god. The ark in his house; he falls, head and hands cut on the threshold.",
    meaningToday: "The idol cannot stand before the ark. Every later image still has to be carried (Jeremiah 10:5).",
    history: "Judges 16:23; 1 Samuel 5:1–5.",
    scriptures: [
      {
        ref: "1 Samuel 5:4",
        text: "And when they arose early on the morrow morning, behold, Dagon was fallen upon his face to the ground before the ark of the LORD; and the head of Dagon and both the palms of his hands were cut off upon the threshold; only the stump of Dagon was left to him.",
      },
    ],
    sources: ["Judges 16:23; 1 Samuel 5"],
  },
  {
    id: "tammuz",
    section: "nations",
    title: "Tammuz",
    card: "Women weeping for Tammuz at the temple gate — Ezekiel 8:14. A dying-and-rising vegetation god. Later tracts made every spring feast 'Tammuz.' The verse is specific: weeping at YHWH's house for another god.",
    meaningToday:
      "Grief-ritual for a fertility god inside the temple precinct. Easter's later folk is not proven to be Tammuz line-for-line. Ezekiel's charge still stands against mixing the nations' dying-god season with the LORD's house.",
    history: "Ezekiel 8:14. Dumuzi in Mesopotamia. Hislop-style chains to Christmas/Easter are often overreach (see customs' disputed notes).",
    scriptures: [
      {
        ref: "Ezekiel 8:14",
        text: "Then he brought me to the door of the gate of the LORD's house which was toward the north; and, behold, there sat women weeping for Tammuz.",
      },
    ],
    sources: ["Ezekiel 8:14"],
  },
  {
    id: "queen-heaven",
    section: "nations",
    title: "The Queen of Heaven",
    card: "Jeremiah 7 and 44. Family cult, cakes, drink offerings, prosperity argument. Still the template for household goddess religion.",
    meaningToday:
      "See the custom card. Mary titled Queen of Heaven in later churches, Wiccan Triple Goddess, and 'we had plenty when we baked' are the same defense Jeremiah already recorded.",
    history: "Jeremiah 7:18; 44:15–25.",
    scriptures: [
      {
        ref: "Jeremiah 44:17",
        text: "But we will certainly do whatsoever thing goeth forth out of our own mouth, to burn incense unto the queen of heaven, and to pour out drink offerings unto her, as we have done, we, and our fathers, our kings, and our princes, in the cities of Judah, and in the streets of Jerusalem: for then had we plenty of victuals, and were well, and saw no evil.",
      },
    ],
    sources: ["Jeremiah 7:18; 44:15–25"],
  },
  {
    id: "gad-meni",
    section: "nations",
    title: "Gad and Meni (Fortune and Destiny)",
    card: "Isaiah 65:11 — a table for Fortune and a drink for Destiny. Luck as a god with a place-setting.",
    meaningToday: "Lucky charms, 'the universe,' and knocking on wood are this table miniaturized.",
    history: "Isaiah 65:11. Many notes: Gad and Meni as deities of fortune.",
    scriptures: [
      {
        ref: "Isaiah 65:11",
        text: "But ye are they that forsake the LORD, that forget my holy mountain, that prepare a table for that troop, and that furnish the drink offering unto that number.",
      },
    ],
    sources: ["Isaiah 65:11"],
  },
  {
    id: "golden-calf",
    section: "nations",
    title: "The golden calf (a feast 'to the LORD')",
    card: "The pattern of this entire section: take Egypt's ox, hold a feast, and say it is YHWH's feast. God did not accept the relabel.",
    meaningToday:
      "Exodus 32 is the master key. They did not say 'we reject YHWH.' They said 'these be thy gods, O Israel, which brought thee up,' and Aaron built an altar and proclaimed a feast to the LORD. That is Christmas trees, Sunday Sabbaths, and Eostre hunts in seed form: the nations' form, His name.",
    history: "Exodus 32; 1 Kings 12:28–33 (Jeroboam's calves at Bethel and Dan — same pattern as a royal policy).",
    scriptures: [
      {
        ref: "Exodus 32:4–5",
        text: "And he received them at their hand, and fashioned it with a graving tool, after he had made it a molten calf: and they said, These be thy gods, O Israel, which brought thee up out of the land of Egypt. And when Aaron saw it, he built an altar before it; and Aaron made proclamation, and said, To morrow is a feast to the LORD.",
      },
    ],
    sources: ["Exodus 32; 1 Kings 12:26–33"],
  },
  {
    id: "binsfeld-princes",
    section: "later",
    title: "Binsfeld's seven princes (1589)",
    card: "Peter Binsfeld assigned seven 'princes' to seven sins: Lucifer pride, Mammon greed, Asmodeus lust, Leviathan envy, Beelzebub gluttony, Satan wrath, Belphegor sloth. A late Catholic scheme — not a verse list. Names borrowed from Scripture and folklore, then ranked.",
    meaningToday:
      "Pop culture still uses this roster. It is a 16th-century filing system, useful only as identification of what later Christendom believed. It is not a map God published. Treating it as a summoning list is the occupation forbidden in Deuteronomy 18.",
    history: "Peter Binsfeld, *Tractatus de confessionibus maleficorum* (1589). Mixes biblical names with Belphegor (later folklore).",
    scriptures: [
      {
        ref: "Deuteronomy 29:29",
        text: "The secret things belong unto the LORD our God: but those things which are revealed belong unto us and to our children for ever, that we may do all the words of this law.",
      },
    ],
    sources: ["Deuteronomy 29:29; 18:10–12; Binsfeld 1589 (later scheme, not canon)"],
    noSigil: true,
  },
  {
    id: "goetia-note",
    section: "later",
    title: "The 72 of the Goetia (Lemegeton)",
    card: "A 17th-century Solomonic grimoire lists seventy-two spirits with ranks, appearances, and seals, claiming Solomon bound them. This app will not print those seals or the conjurations. That would be handing over the tool. The list exists; the occupation is forbidden; the claim that Solomon's wisdom was a spirit-catalog is a lie against 1 Kings 3–4.",
    meaningToday:
      "Internet occultism treats the Goetia as a directory: pick a name, draw a seal, get a result. That is Deuteronomy 18 with better graphic design. The deception of 'I need every sigil to understand the enemy' is how the catalog spreads. Understanding the enemy in Scripture is: he is a liar, he disguises himself as light, he uses the nations' ways, and Messiah has already bound the strong man. You do not need seventy-two diagrams to know that. You need the commandment not to consult them.",
    history:
      "The Lesser Key of Solomon (*Lemegeton Clavicula Salomonis*), of which the *Ars Goetia* is the first book, circulates in 17th-century manuscripts (English copies associated with the Sloane collection). It stands in a longer 'Solomonic' magical tradition (Testament of Solomon is earlier extra-biblical narrative). 1 Kings 4:29–34 describes Solomon's wisdom as nature, proverb, and song — not a spirit-registry. Weyer's *Pseudomonarchia Daemonum* (1577) is a related earlier list, partly satirical toward demonology even as it catalogs names.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Acts 19:19",
        text: "Many of them also which used curious arts brought their books together, and burned them before all men: and they counted the price of them, and found it fifty thousand pieces of silver.",
      },
    ],
    sources: [
      "Deuteronomy 18:10–12; Acts 19:19; 1 Kings 4:29–34; Lemegeton / Ars Goetia (17th-c. MSS) — names exist, seals not reproduced here; Weyer, Pseudomonarchia Daemonum (1577)",
    ],
    noSigil: true,
  },
  {
    id: "plancy",
    section: "later",
    title: "Dictionnaire Infernal (1818 / 1863)",
    card: "Collin de Plancy's dictionary of demons, with Louis Le Breton's 1863 engravings (horned bureaucrats, insect-kings, etc.). Popular image-bank of 'what demons look like.' Those pictures are 19th-century imagination, not photographs from Isaiah.",
    meaningToday:
      "Halloween masks and internet 'demonology' still copy Plancy's zoo. Useful as proof that the 1800s commercialized hell into a picture book. Not useful as a field guide God authorized.",
    history: "Jacques Collin de Plancy, *Dictionnaire Infernal*, 1818; illustrated edition 1863.",
    scriptures: [
      {
        ref: "2 Corinthians 11:14",
        text: "And no marvel; for Satan himself is transformed into an angel of light.",
      },
    ],
    sources: ["2 Corinthians 11:14; Collin de Plancy, Dictionnaire Infernal (1818/1863) — later art, not Scripture"],
    noSigil: true,
  },
  {
    id: "crowley-aiwass",
    section: "later",
    title: "Thelema and 'Aiwass' (Crowley)",
    card: "Aleister Crowley claimed a being named Aiwass dictated *The Book of the Law* (1904): 'Do what thou wilt shall be the whole of the Law.' A modern prophet of self-as-god. The unicursal hexagram is his badge (see Symbols).",
    meaningToday:
      "Pop occultism, some rock aesthetics, and 'true will' spirituality descend from this. Judges 21:25 already named the doctrine: every man did that which was right in his own eyes.",
    history: "Cairo 1904, Crowley; Ordo Templi Orientis later carried Thelema. Not ancient Egypt in the biblical sense — a 20th-century revelation-claim.",
    scriptures: [
      {
        ref: "Judges 21:25",
        text: "In those days there was no king in Israel: every man did that which was right in his own eyes.",
      },
    ],
    sources: ["Judges 21:25; Deuteronomy 13 (test of a prophet); Crowley's 1904 claim — identified, not taught"],
    noSigil: true,
  },
  {
    id: "watchers-genesis",
    section: "watchers",
    title: "The Watchers (Genesis 6 and 1 Enoch)",
    card: "Sons of God took daughters of men; Nephilim. 1 Enoch names the chiefs, the oath on Hermon, and the crafts taught to mankind. Jude and 2 Peter treat angels who left their estate as history next to the flood. Two readings exist (Sethite vs heavenly). The epistles and Enoch weigh toward the heavenly. Qumran copied Enoch. No seals are drawn here.",
    meaningToday:
      "The way of the nations is, in Enoch's telling, leaked heaven-craft: weapons, adornment, root-cuttings, astrology. That is how Second Temple Jews explained a world already expert in war and signs of heaven before Sinai. Modern occultism that 'works with Watchers' is the occupation Jude said was already in chains.",
    history:
      "Genesis 6:1–4 is Torah. 1 Enoch 6–16 (Ethiopic; Aramaic at Qumran, 4Q201–212) expands names and crimes. Jude 6 and 14–15 cite the angels and quote Enoch. 2 Peter 2:4–5 binds tartarus and the flood in one paragraph. The Sethite reading (sons of God = line of Seth) is later Christian interpretation and must be shown as a dispute, not as the only reading.",
    scriptures: [
      {
        ref: "Genesis 6:1–4",
        text: "And it came to pass, when men began to multiply on the face of the earth, and daughters were born unto them, That the sons of God saw the daughters of men that they were fair; and they took them wives of all which they chose. And the LORD said, My spirit shall not always strive with man, for that he also is flesh: yet his days shall be an hundred and twenty years. There were giants in the earth in those days; and also after that, when the sons of God came in unto the daughters of men, and they bare children to them, the same became mighty men which were of old, men of renown.",
      },
      {
        ref: "Jude 6",
        text: "And the angels which kept not their first estate, but left their own habitation, he hath reserved in everlasting chains under darkness unto the judgment of the great day.",
      },
      {
        ref: "2 Peter 2:4–5",
        text: "For if God spared not the angels that sinned, but cast them down to hell, and delivered them into chains of darkness, to be reserved unto judgment; And spared not the old world, but saved Noah the eighth person, a preacher of righteousness, bringing in the flood upon the world of the ungodly;",
      },
    ],
    sources: [
      "Genesis 6:1–4; Jude 6, 14–15; 2 Peter 2:4–5 (King James)",
      "1 Enoch 6–16 (Charles; Qumran Aramaic 4QEnoch)",
    ],
    noSigil: true,
  },
  {
    id: "semjaza",
    section: "watchers",
    title: "Semjaza (chief of the Watchers in 1 Enoch)",
    card: "1 Enoch 6: Semjaza leads two hundred who descend, swear on Mount Hermon, and take wives. Not in the 66-book canon as a name. Identified because later occult lists steal Enochic chiefs and attach seals. Those seals are not here.",
    meaningToday:
      "If a modern book offers Semjaza as a spirit to contact, it is selling the crime Jude said is already under chains. Identification is not invocation.",
    history: "1 Enoch 6–8. Qumran Aramaic Enoch. Mount Hermon is in the narrative as the oath-site.",
    scriptures: [
      {
        ref: "Jude 6",
        text: "And the angels which kept not their first estate, but left their own habitation, he hath reserved in everlasting chains under darkness unto the judgment of the great day.",
      },
    ],
    sources: ["1 Enoch 6–8 (Charles); Jude 6; 4QEnoch at Qumran"],
    noSigil: true,
  },
  {
    id: "enoch-teachings",
    section: "watchers",
    title: "What 1 Enoch says the Watchers taught",
    card: "1 Enoch 8: Azazel — swords, knives, shields, breastplates, metals, bracelets, antimony, eyelids, precious stones. Others — enchantments, root-cuttings, astrology, signs of the earth and sun and moon. A Second Temple indictment of the nations' crafts as stolen knowledge. Not a course syllabus.",
    meaningToday:
      "Weapons, cosmetics, and astrology as 'Watchers' gifts' is Enoch's way of saying the world did not invent the way of the heathen in a vacuum. Isaiah 47 still mocks the astrologers. Deuteronomy 18 still forbids the observer of times. Enoch is the backstory some Second Temple Jews told; it is not permission.",
    history: "1 Enoch 8:1–3; 10:4–8 Azazel bound. Charles translation. Qumran copies.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch.",
      },
    ],
    sources: ["1 Enoch 8; 10 (Charles); Deuteronomy 18:10–12"],
    noSigil: true,
  },
  {
    id: "jude-watchers",
    section: "watchers",
    title: "Jude's use of Enoch",
    card: "Jude 14–15 quotes 1 Enoch 1:9 almost directly: the Lord cometh with ten thousands of his saints. The New Testament itself treats that prophecy as to be heard. That does not put 1 Enoch into the 66-book table of contents. It does forbid pretending Enoch is irrelevant.",
    meaningToday:
      "A canon that quotes Enoch about judgment, then a church that never lets the reader see Enoch, is a kind of omission. This library already has 1 Enoch. Read Jude beside it.",
    history: "Jude, late 1st c. 1 Enoch 1:9 in Charles.",
    scriptures: [
      {
        ref: "Jude 14–15",
        text: "And Enoch also, the seventh from Adam, prophesied of these, saying, Behold, the Lord cometh with ten thousands of his saints, To execute judgment upon all, and to convince all that are ungodly among them of all their ungodly deeds which they have ungodly committed, and of all their hard speeches which ungodly sinners have spoken against him.",
      },
    ],
    sources: ["Jude 14–15; 1 Enoch 1:9 (Charles)"],
  },
  {
    id: "peter-tartarus",
    section: "watchers",
    title: "2 Peter: tartarus and the flood",
    card: "The Greek of 2 Peter 2:4 uses tartarōsas — cast down to Tartarus. Next verse: the flood. Fallen angels and Noah's world are one argument that God knows how to judge.",
    meaningToday:
      "The epistle does not invite a map of Tartarus for tourism. It warns false teachers by reminding them that even angels were not spared.",
    history: "2 Peter 2:4–5, c. AD 60–80 (dating disputed; the text is the evidence).",
    scriptures: [
      {
        ref: "2 Peter 2:4–5",
        text: "For if God spared not the angels that sinned, but cast them down to hell, and delivered them into chains of darkness, to be reserved unto judgment; And spared not the old world, but saved Noah the eighth person, a preacher of righteousness, bringing in the flood upon the world of the ungodly;",
      },
    ],
    sources: ["2 Peter 2:4–5 (King James; Greek tartarōsas)"],
  },
  {
    id: "rev-dragon-angels",
    section: "watchers",
    title: "The dragon and his angels (Revelation 12)",
    card: "Michael wars with the dragon. The dragon is that old serpent, the Devil and Satan. His angels are cast out with him. A third of the stars are drawn. This is the NT's named host of fallen angels under Satan — not seventy-two seals.",
    meaningToday:
      "The war is already decided in heaven's verdict and not yet finished on earth (Rev 12:12). Traditions that keep the nations' way are how the deceiver still works after the casting out.",
    history: "Revelation 12, late 1st c., Asia Minor.",
    scriptures: [
      {
        ref: "Revelation 12:7–9",
        text: "And there was war in heaven: Michael and his angels fought against the dragon; and the dragon fought and his angels, And prevailed not; neither was their place found any more in heaven. And the great dragon was cast out, that old serpent, called the Devil, and Satan, which deceiveth the whole world: he was cast out into the earth, and his angels were cast out with him.",
      },
    ],
    sources: ["Revelation 12:4, 7–12"],
  },
  {
    id: "mastema",
    section: "watchers",
    title: "Mastema (Jubilees)",
    card: "In Jubilees the prince of accusing spirits. Hebrew fragments at Qumran. Extra-canonical. A Second Temple name for the adversary's office, not a Goetic spirit to diagram.",
    meaningToday:
      "Useful as evidence that Jews before and after the Maccabees already spoke of a named accusing prince. Not useful as a contact.",
    history: "Jubilees, often 2nd c. BC; 4QJubilees.",
    scriptures: [
      {
        ref: "Zechariah 3:1",
        text: "And he shewed me Joshua the high priest standing before the angel of the LORD, and Satan standing at his right hand to resist him.",
      },
    ],
    sources: ["Jubilees (Ethiopic; 4QJubilees); Zechariah 3:1 as the canonical accusing figure"],
    noSigil: true,
  },
  {
    id: "shedim",
    section: "scripture",
    title: "Shedim (Deuteronomy 32:17)",
    card: "KJV 'devils': they sacrificed unto shedim, not to God — gods they knew not, new gods. Psalm 106:37: sons and daughters unto devils. 1 Corinthians 10:20: Gentiles sacrifice to devils. The nations' gods are not empty in Paul's accounting.",
    meaningToday:
      "Every high place, every 'just culture' feast offered to another god, sits in this word. Paul will not let you call it nothing.",
    history: "Song of Moses; psalm of confession; Paul to Corinth c. AD 55.",
    scriptures: [
      {
        ref: "Deuteronomy 32:17",
        text: "They sacrificed unto devils, not to God; to gods whom they knew not, to new gods that came newly up, whom your fathers feared not.",
      },
      {
        ref: "1 Corinthians 10:20",
        text: "But I say, that the things which the Gentiles sacrifice, they sacrifice to devils, and not to God: and I would not that ye should have fellowship with devils.",
      },
    ],
    sources: ["Deuteronomy 32:17; Psalm 106:37; 1 Corinthians 10:20–21"],
  },
  {
    id: "rahab",
    section: "scripture",
    title: "Rahab the dragon (not Jericho's harlot)",
    card: "Isaiah 51:9 and Psalm 89:10: Rahab as the pierced sea-monster / a name for proud Egypt. Distinct from Rahab of Joshua 2. Occult lists sometimes steal the monster-name.",
    meaningToday:
      "Chaos-monster already wounded by the LORD who dries the sea. Not a spirit to hire.",
    history: "Exodus memory in the prophets.",
    scriptures: [
      {
        ref: "Isaiah 51:9",
        text: "Awake, awake, put on strength, O arm of the LORD; awake, as in the ancient days, in the generations of old. Art thou not it that hath cut Rahab, and wounded the dragon?",
      },
    ],
    sources: ["Isaiah 51:9; Psalm 89:10; Psalm 87:4 (Rahab as Egypt)"],
  },
];
