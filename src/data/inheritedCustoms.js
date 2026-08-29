/** Inherited customs many people still keep. Scripture first; then attested history; then disputed later claims. */

export const CUSTOM_SECTIONS = [
  {
    id: "times",
    title: "Appointed times replaced",
    blurb:
      "The Torah names Sabbaths and feast days. Later empires and churches moved rest, celebration, and the year itself onto other days — and most people now keep the later calendar without asking who changed it.",
  },
  {
    id: "household",
    title: "Household, marriage, and feast customs",
    blurb:
      "Rings, trees, kissing under plants, cakes, and birthday feasts are ordinary now. Scripture either never commands them, records them only among the nations, or warns about related rites.",
  },
  {
    id: "images",
    title: "Images, signs, and names of the gods",
    blurb:
      "The second commandment forbids making a likeness to bow to it. The nations named days and months after their gods. Those names and signs are still on every calendar and many walls.",
  },
  {
    id: "divination",
    title: "Divination sold as harmless",
    blurb:
      "Scripture names observers of times, astrologers, and those who consult familiar spirits as abomination. Modern culture often sells the same acts as games, horoscopes, or luck.",
  },
];

export const CUSTOMS = [
  {
    id: "sunday-sabbath",
    section: "times",
    title: "Sunday as the Sabbath",
    card: "The seventh day was set apart in Genesis and commanded at Sinai. Civil rest on the day of the Sun was imposed by imperial law; a later council forbade resting on the Sabbath.",
    practicedToday:
      "Most churches treat Sunday as the weekly holy day of rest and assembly. Saturday is treated as an ordinary weekend day. Many believers have never been shown that the commandment names the seventh day, not the first.",
    scriptures: [
      {
        ref: "Genesis 2:2–3",
        text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made. And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
      },
      {
        ref: "Exodus 20:8–11",
        text: "Remember the sabbath day, to keep it holy. Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the LORD thy God: in it thou shalt not do any work, thou, nor thy son, nor thy daughter, thy manservant, nor thy maidservant, nor thy cattle, nor thy stranger that is within thy gates: For in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the LORD blessed the sabbath day, and hallowed it.",
      },
      {
        ref: "Ezekiel 20:12",
        text: "Moreover also I gave them my sabbaths, to be a sign between me and them, that they might know that I am the LORD that sanctify them.",
      },
      {
        ref: "Daniel 7:25",
        text: "And he shall speak great words against the most High, and shall wear out the saints of the most High, and think to change times and laws: and they shall be given into his hand until a time and times and the dividing of time.",
      },
      {
        ref: "Acts 20:7",
        text: "And upon the first day of the week, when the disciples came together to break bread, Paul preached unto them, ready to depart on the morrow; and continued his speech until midnight.",
      },
      {
        ref: "1 Corinthians 16:2",
        text: "Upon the first day of the week let every one of you lay by him in store, as God hath prospered him, that there be no gatherings when I come.",
      },
      {
        ref: "Colossians 2:16–17",
        text: "Let no man therefore judge you in meat, or in drink, or in respect of an holyday, or of the new moon, or of the sabbath days: Which are a shadow of things to come; but the body is of Christ.",
      },
      {
        ref: "Romans 14:5",
        text: "One man esteemeth one day above another: another esteemeth every day alike. Let every man be fully persuaded in his own mind.",
      },
      {
        ref: "Mark 7:7–9",
        text: "Howbeit in vain do they worship me, teaching for doctrines the commandments of men. For laying aside the commandment of God, ye hold the tradition of men, as the washing of pots and cups: and many other such like things ye do. And he said unto them, Full well ye reject the commandment of God, that ye may keep your own tradition.",
      },
    ],
    history: `The commandment in Exodus 20 names **the seventh day**, the same day blessed in Genesis 2. It is not named "Saturday" in Hebrew; it is the seventh day of the week. In the New Testament the disciples are still going to synagogue on the Sabbath (Acts 13:14, 17:2). A meeting "upon the first day of the week" is recorded in Acts 20:7, and a collection is appointed on that day in 1 Corinthians 16:2. Those texts describe a first-day gathering or a laying aside of money. They do not repeal Exodus 20 or rename the seventh day.

On 7 March 321, Constantine issued a civil edict (preserved as *Codex Justinianus* 3.12.2 / related Theodosian material) that magistrates and city people rest "**on the venerable day of the Sun**" (*dies Solis*), with an exception for farm work. The edict names the Sun, not the resurrection, as the day's dignity.

The Council of Laodicea (canon 29, mid-4th century) then ordered: Christians must not "judaize by resting on the Sabbath, but must work on that day, rather honouring the Lord's Day"; those found "judaizing" were to be shut out from Christ. That is a church law against keeping the seventh-day rest, not a verse of Scripture.

Revelation 1:10 says John was "in the Spirit on the Lord's day." The text does not define which weekday that is. Later writers applied it to Sunday. That application is tradition, not a definition given in the verse.`,
    unawares: `Millions rest, worship, and shop on a weekly rhythm set by **imperial Sunday law** and **post-biblical canons**, while still saying they "keep the Sabbath." The Hebrew Scriptures never transfer the sanctified seventh day to the first. Whether Colossians 2 and Romans 14 mean the weekly Sabbath is no longer binding is a live dispute in the text itself — it is not settled by Constantine or Laodicea. Those sources show *who changed civil and church practice*, not what Sinai said.`,
    disputed: `Popular teaching that "the pope changed the Sabbath" compresses a slower shift (first-day gatherings, then imperial Sun-day rest, then conciliar bans on Sabbath rest) into a single cartoon villain. The change is real and documented. The mechanism was imperial and conciliar, not a verse that says the seventh day was moved.

Some also treat every Sunday keeper as a sun-worshipper. Constantine's edict uses solar language; that does not prove every later congregation intends to worship the sun. The question Scripture puts is whether the commandment of God has been laid aside for the tradition of men (Mark 7).`,
    sources: [
      "Genesis 2:2–3; Exodus 20:8–11; Ezekiel 20:12; Daniel 7:25; Acts 13:14; 17:2; 20:7; 1 Corinthians 16:2; Colossians 2:16–17; Romans 14:5; Mark 7:7–9; Revelation 1:10 (King James)",
      "Codex Justinianus 3.12.2 (Constantine, 7 March 321) — rest on the venerable day of the Sun",
      "Council of Laodicea, canon 29 (mid-4th century) — against resting on the Sabbath",
    ],
  },
  {
    id: "christmas",
    section: "times",
    title: "Christmas and December 25",
    card: "Scripture never dates the birth of Messiah. December 25 appears on a 4th-century Roman calendar beside the Birthday of the Unconquered Sun. Midwinter rites of the nations were already old.",
    practicedToday:
      "December 25 is treated as Jesus' birthday: trees, lights, gifts, nativity plays, and a civil holiday. Most celebrants have never read that the Gospels give no calendar date, or that shepherds were abiding in the fields at night in the account of the birth.",
    scriptures: [
      {
        ref: "Luke 2:8",
        text: "And there were in the same country shepherds abiding in the field, keeping watch over their flock by night.",
      },
      {
        ref: "Deuteronomy 12:30–32",
        text: "Take heed to thyself that thou be not snared by following them, after that they be destroyed from before thee; and that thou enquire not after their gods, saying, How did these nations serve their gods? even so will I do likewise. Thou shalt not do so unto the LORD thy God: for every abomination to the LORD, which he hateth, have they done unto their gods; for even their sons and their daughters they have burnt in the fire to their gods. What thing soever I command you, observe to do it: thou shalt not add thereto, nor diminish from it.",
      },
      {
        ref: "Jeremiah 10:2",
        text: "Thus saith the LORD, Learn not the way of the heathen, and be not dismayed at the signs of heaven; for the heathen are dismayed at them.",
      },
      {
        ref: "Galatians 4:10–11",
        text: "Ye observe days, and months, and times, and years. I am afraid of you, lest I have bestowed upon you labour in vain.",
      },
    ],
    history: `Matthew and Luke narrate a birth. They do not give a month or day. Luke 2:8 has shepherds in the field at night — a detail often used against a midwinter date in Judea, though it is not a calendar proof by itself.

The **Chronograph of 354** (a Roman almanac) lists 25 December as the nativity of Christ in the Depositio Martirum, and the same compilation's civic calendar marks 25 December as *Natalis Invicti* — the Birthday of the Unconquered Sun. Saturnalia (in honour of Saturn) ran in mid-December (classically from 17 December, later extended). Germanic and Norse midwinter (Yule) is independently attested in later medieval sources as a midwinter feast with drinking and sacrifice.

Tertullian (*On Idolatry* 14) already rebuked Christians who joined the nations' **Saturnalia, New Year, and midwinter** observances. That is 3rd-century evidence that winter festivals of the nations were a snare *before* Christmas was universal.

Two origin stories for the Christian date are both in the record, and they conflict:

1. **Co-option of the solar birthday** — 25 December already belonged to Sol Invictus in the Roman civic calendar of 354.
2. **Calculation from 25 March** — some early Christian writers treated 25 March as the date of the incarnation (and sometimes of the crucifixion) and counted nine months to 25 December (a tradition associated with writers such as Hippolytus and later Latin computists).

The appointed times in Leviticus 23 are Passover, Unleavened Bread, Firstfruits, Weeks, Trumpets, Atonement, and Tabernacles. A feast of the nativity is not among them.`,
    unawares: `People "keep Christmas" as if it were from Bethlehem. The date, the midwinter timing, the civic holiday, and much of the surrounding revel are **Roman and later European**. The nativity accounts are Scripture; December 25 as a holy day is not.`,
    disputed: `Saying "Christmas is Saturnalia" is too neat. Saturnalia was not 25 December. Saying "Christmas is only the birthday of Sol Invictus" ignores the March-25 calculation tradition. Both the solar civic date and the midwinter rites of the nations are real. Later Protestant polemics (including Alexander Hislop's *The Two Babylons*, 1853/1858) traced almost every Christmas custom to Nimrod's Babylon. Much of that chain is not how ancient Near Eastern evidence actually reads. The biblical warning does not need Hislop: Deuteronomy 12 already forbids worshipping the LORD the way the nations served their gods, and forbids adding feast days He did not command.`,
    sources: [
      "Luke 2:8; Deuteronomy 12:30–32; Jeremiah 10:2; Leviticus 23; Galatians 4:10–11 (King James)",
      "Chronograph of 354 — 25 December as nativity and as Natalis Invicti",
      "Tertullian, On Idolatry 14 — against Saturnalia, New Year, and midwinter",
    ],
  },
  {
    id: "christmas-trees",
    section: "household",
    title: "Christmas trees, wreaths, and evergreens",
    card: "Bringing an evergreen into the house, decking it, and setting it up so it will not fall is a German early-modern custom that became universal. Jeremiah 10 describes a craftsman making an idol from a tree — often applied here, though the verse is about a carved image.",
    practicedToday:
      "Families cut or buy a fir, hang lights and ornaments, and put gifts under it. Wreaths of evergreen, holly, and ivy hang on doors. The custom is treated as Christian furniture, not as a question.",
    scriptures: [
      {
        ref: "Jeremiah 10:2–4",
        text: "Thus saith the LORD, Learn not the way of the heathen, and be not dismayed at the signs of heaven; for the heathen are dismayed at them. For the customs of the people are vain: for one cutteth a tree out of the forest, the work of the hands of the workman, with the axe. They deck it with silver and with gold; they fasten it with nails and with hammers, that it move not.",
      },
      {
        ref: "Deuteronomy 16:21",
        text: "Thou shalt not plant thee a grove of any trees near unto the altar of the LORD thy God, which thou shalt make thee.",
      },
      {
        ref: "Jeremiah 17:2",
        text: "Whilst their children remember their altars and their groves by the green trees upon the high hills.",
      },
    ],
    history: `Jeremiah 10:3–4 describes a **workman** cutting a tree, shaping it with a tool, overlaying it with silver and gold, and nailing it so it will not totter. That is the manufacture of a **carved idol**, the same class of object Isaiah 44 mocks. It is not a botanical description of a living fir in a parlour. Readers who apply it to Christmas trees are using the passage as a warning about tree-related customs of the nations; they should also read what the verses actually depict.

What *is* attested: sacred groves and green trees as sites of forbidden worship in Israel (Deuteronomy 16:21; Jeremiah 17:2; 2 Kings 17:10). Romans decorated with greenery at the January Kalends and other civic feasts (the elder Seneca and later calendrical writers note laurel and greenery at the turning of the year). Germanic midwinter used evergreens as the living thing that does not die when the sun is weakest.

The **domestic Christmas tree** as known today is attested in German-speaking Europe in the early modern period and was popularized in the English-speaking world after the 1848 *Illustrated London News* engraving of Queen Victoria and Prince Albert's decorated tree. It is not a first-century Judean practice and is not commanded in the Gospels.`,
    unawares: `The tree is treated as "how we do Christmas," as if Bethlehem had a fir in the house. It is a **German folk custom** married to a midwinter date the Gospels never set. Holly, ivy, and hanging wreaths ride the same evergreen logic: life in the dead season, a theme of pagan midwinter long before it was called Christian.`,
    disputed: `Two overreaches: (1) that Jeremiah 10 is a literal prophecy of the Christmas tree — the grammar is idol-making; (2) that every evergreen is "the Asherah." Asherah/groves in the Hebrew Bible are cult objects and tree-shrines God forbade near His altar. A parlour fir is not automatically that object. The honest questions are: Did God command this? Is it the way of the nations (Jeremiah 10:2)? Has a custom of the heathen been renamed and kept (Deuteronomy 12:30)?`,
    sources: [
      "Jeremiah 10:2–4; 17:2; Deuteronomy 16:21; Isaiah 44:13–17; 2 Kings 17:10 (King James)",
      "Illustrated London News, 1848 — royal Christmas tree popularized in Britain",
      "German early-modern domestic tree custom (16th–17th centuries), later universalized",
    ],
  },
  {
    id: "easter",
    section: "times",
    title: "Easter, eggs, hares, and sunrise",
    card: "The appointed feast is Passover. English 'Easter' is named, according to Bede, after a goddess. Eggs, hares, and facing the sun at dawn are not in the Torah of that feast.",
    practicedToday:
      "Churches keep 'Easter Sunday' with sunrise services, lilies, egg hunts, and chocolate hares. The week is detached from the 14th of the first biblical month. The King James Bible itself once printed the word Easter where the Greek says Passover.",
    scriptures: [
      {
        ref: "Exodus 12:14",
        text: "And this day shall be unto you for a memorial; and ye shall keep it a feast to the LORD throughout your generations; ye shall keep it a feast by an ordinance for ever.",
      },
      {
        ref: "Leviticus 23:5–6",
        text: "In the fourteenth day of the first month at even is the LORD's passover. And on the fifteenth day of the same month is the feast of unleavened bread unto the LORD: seven days ye must eat unleavened bread.",
      },
      {
        ref: "1 Corinthians 5:7–8",
        text: "Purge out therefore the old leaven, that ye may be a new lump, as ye are unleavened. For even Christ our passover is sacrificed for us: Therefore let us keep the feast, not with old leaven, neither with the leaven of malice and wickedness; but with the unleavened bread of sincerity and truth.",
      },
      {
        ref: "Acts 12:4",
        text: "And when he had apprehended him, he put him in prison, and delivered him to four quaternions of soldiers to keep him; intending after Easter to bring him forth to the people.",
      },
      {
        ref: "Ezekiel 8:16",
        text: "And he brought me into the inner court of the LORD's house, and, behold, at the door of the temple of the LORD, between the porch and the altar, were about five and twenty men, with their backs toward the temple of the LORD, and their faces toward the east; and they worshipped the sun toward the east.",
      },
    ],
    history: `The feast God named is **Passover** (Hebrew *Pesach*), on the 14th day of the first month, then Unleavened Bread (Leviticus 23). Paul calls Messiah "our passover" and says "let us keep the feast" (1 Corinthians 5:7–8). The Greek of Acts 12:4 is *pascha* (Passover). The 1611 King James rendered it "**Easter**" there — an English seasonal word, not a different Greek festival.

The English name **Easter** is explained by Bede (*De temporum ratione* 15): the old English month *Eosturmonath* was named after a goddess **Eostre**, in whose honour feasts were once held; the month's name was later used for the Paschal season. Romance languages kept a form of *Pascha*. So the English/German name is the outlier, and Bede is the primary witness for the goddess-name.

The **date** of "Easter" was fixed against the Jewish calendar by the Council of Nicaea (325) and Constantine's letter to the churches: the churches were not to follow the Jews in calculating the feast. That is a conciliar change of *when*, not a verse that creates a new feast of eggs.

**Eggs** as spring and Lent-end food are medieval Christian and folk (eggs were often forbidden in Lent, then eaten at the feast). **Hares/rabbits** as fertility signs are European folk, not Leviticus 23. **Sunrise services** facing the rising sun sit next to Ezekiel 8:16, where Judah's elders turned their backs on the temple and worshipped the sun toward the east. The prophet calls that an abomination. A congregation greeting the resurrection at dawn is not automatically that rite — but the posture of sun-facing worship is exactly what Ezekiel condemns, and it is not how Passover is described in Exodus 12.`,
    unawares: `Children hunt eggs and receive chocolate hares on a Sunday named, in English, after **Eostre**, on a date set by **Nicaea** so as not to keep Passover with the Jews, while 1 Corinthians 5 still says Messiah is our Passover. Most never hear that Acts 12:4 KJV "Easter" is *pascha*.`,
    disputed: `The internet equation **Easter = Ishtar** is folk etymology. *Ishtar* is Akkadian; *Eostre* is what Bede wrote; *Pesach/pascha* is what the apostles wrote. Hislop and later tracts fused them into one goddess. That fusion is not how the languages work.

Bede's Eostre is attested in that one Anglo-Saxon explanation; we do not have a full cult manual. Absence of extra inscriptions does not erase Bede, and Bede does not turn Passover into Babylon. Keep the layers separate: (1) God's Passover, (2) English name from Eostre according to Bede, (3) Nicaean dating, (4) folk eggs and hares, (5) sun-facing worship condemned in Ezekiel 8.`,
    sources: [
      "Exodus 12; Leviticus 23:5–6; 1 Corinthians 5:7–8; Acts 12:4 (Greek pascha; KJV 'Easter'); Ezekiel 8:16 (King James)",
      "Bede, De temporum ratione 15 — Eosturmonath named from the goddess Eostre",
      "Council of Nicaea (325) and Constantine's letter on not following the Jewish calculation of the feast",
    ],
  },
  {
    id: "birthdays",
    section: "household",
    title: "Birthdays",
    card: "Scripture records birthday feasts for Pharaoh and Herod — both scenes of death. It never commands Israel to keep the day of birth. Early Christian teachers treated birthday-keeping as a custom of the nations.",
    practicedToday:
      "Cakes, candles, songs, and honouring the person on the anniversary of birth are nearly universal, including among people who say they reject pagan custom. The day is treated as a right, not as something to test against the text.",
    scriptures: [
      {
        ref: "Genesis 40:20–22",
        text: "And it came to pass the third day, which was Pharaoh's birthday, that he made a feast unto all his servants: and he lifted up the head of the chief butler and of the chief baker among his servants. And he restored the chief butler unto his butlership again; and he gave the cup into Pharaoh's hand: But he hanged the chief baker: as Joseph had interpreted to them.",
      },
      {
        ref: "Matthew 14:6–10",
        text: "But when Herod's birthday was kept, the daughter of Herodias danced before them, and pleased Herod. Whereupon he promised with an oath to give her whatsoever she would ask. And she, being before instructed of her mother, said, Give me here John Baptist's head in a charger. And the king was sorry: nevertheless for the oath's sake, and them which sat with him at meat, he commanded it to be given her. And he sent, and beheaded John in the prison.",
      },
      {
        ref: "Ecclesiastes 7:1",
        text: "A good name is better than precious ointment; and the day of death than the day of one's birth.",
      },
      {
        ref: "Job 1:4–5",
        text: "And his sons went and feasted in their houses, every one his day; and sent and called for their three sisters to eat and to drink with them. And it was so, when the days of their feasting were gone about, that Job sent and sanctified them, and rose up early in the morning, and offered burnt offerings according to the number of them all: for Job said, It may be that my sons have sinned, and cursed God in their hearts. Thus did Job continually.",
      },
    ],
    history: `The only birthday feasts **named as such** in the canonical narrative are **Pharaoh's** (Genesis 40) and **Herod's** (Matthew 14; Mark 6:21). Both are royal, both involve a feast, and both are bound to an execution. Israel is commanded many memorial days (Passover, Sabbath, etc.). A yearly honour of one's own birth is not among them.

Job 1:4 says Job's sons feasted "every one his day." Readers dispute whether that means birthdays or a rotation of feast days. The text does not say "birthday." Job's response is to sanctify them in case they had sinned — not to bless the custom.

Origen (*Homilies on Leviticus* 8) treats the keeping of birthdays as a practice of sinners and of Pharaoh and Herod, not of the saints; he notes that in the Scriptures it is the wicked who keep birthday feasts. That is an early Christian reading of the same two passages, not a new commandment, but it shows birthday-keeping was already identified with the nations.

Candles on a cake and the "happy birthday" song are modern (19th–20th century). They are not Roman Saturnalia. They are still a feast God did not appoint, centred on the self rather than on His times.`,
    unawares: `People who would refuse a "pagan holiday" still keep **the day of one's birth** with ritual food, fire (candles), and sung honour, because it feels private and kind. Scripture's two named birthday feasts are not kind stories. Ecclesiastes 7:1 ranks the day of death above the day of birth.`,
    disputed: `Claiming birthday candles are "always" a remnant of a specific ancient fire-cult is usually guesswork. The stronger, checkable point is simpler: Scripture does not command the custom; it associates named birthday feasts with Pharaoh and Herod; early teachers such as Origen rejected the custom on that basis. Job's "his day" remains ambiguous — do not force it.`,
    sources: [
      "Genesis 40:20–22; Matthew 14:6–10; Mark 6:21; Ecclesiastes 7:1; Job 1:4–5 (King James)",
      "Origen, Homilies on Leviticus 8 — birthday-keeping as the custom of the wicked in Scripture",
    ],
  },
  {
    id: "wedding-rings",
    section: "household",
    title: "Wedding rings",
    card: "A ring as the pledge of marriage is a Roman custom. Scripture uses rings as signets and gifts, never as the required token of covenant marriage.",
    practicedToday:
      "Nearly every civil and church wedding in the West includes the exchange or placing of a ring, often with words the Bible does not contain. Couples who have never read Roman law still treat the ring as what 'makes it marriage.'",
    scriptures: [
      {
        ref: "Genesis 24:22",
        text: "And it came to pass, as the camels had done drinking, that the man took a golden earring of half a shekel weight, and two bracelets for her hands of ten shekels weight of gold;",
      },
      {
        ref: "Genesis 41:42",
        text: "And Pharaoh took off his ring from his hand, and put it upon Joseph's hand, and arrayed him in vestures of fine linen, and put a gold chain about his neck;",
      },
      {
        ref: "Luke 15:22",
        text: "But the father said to his servants, Bring forth the best robe, and put it on him; and put a ring on his hand, and shoes on his feet:",
      },
      {
        ref: "James 2:2–3",
        text: "For if there come unto your assembly a man with a gold ring, in goodly apparel, and there come in also a poor man in vile raiment; And ye have respect to him that weareth the gay clothing, and say unto him, Sit thou here in a good place; and say to the poor, Stand thou there, or sit here under my footstool:",
      },
    ],
    history: `Roman marriage used a ring as a pledge (*anulus pronubus*). Tertullian (*Apology* 6) refers to the ring with which a woman is pledged. Pliny (*Natural History* 33) discusses gold rings as marks of rank. Clement of Alexandria (*Paedagogus* 3.11) allows a ring as a **signet** for sealing household goods and warns against luxury of gold — he is not instituting a sacrament of the wedding band.

In Scripture a ring is a **signet of authority** (Pharaoh to Joseph, Genesis 41:42; the prodigal's restoration, Luke 15:22) or jewelry (Rebekah's earring and bracelets, Genesis 24). Marriage in the Torah is covenant, bride-price, and becoming one flesh (Genesis 2:24; Exodus 22:16–17; Malachi 2:14). No verse says the covenant is made by a circle of metal on the finger.

The "fourth finger of the left hand" vein-to-the-heart story is Roman/medieval lore (*vena amoris*), not Moses.`,
    unawares: `The ring is assumed to be "biblical marriage." It is **Roman pledge-jewelry** that the churches adopted. A believer can wear a ring as a sign without worshipping it; that does not make the custom a commandment. James 2 warns against honouring the gold ring in the assembly — the opposite of treating the ring as a holy object.`,
    disputed: `Tracts that call the wedding ring "always a satanic circle" or "always an Egyptian sun-disk" go beyond the evidence. Egyptian signet rings existed; Roman marriage rings existed. A circle is a geometric shape, not automatically a cult object. The documented fact is: **extra-biblical Roman custom**, not Sinai, made the ring the public token of marriage in the West.`,
    sources: [
      "Genesis 24:22; 41:42; Luke 15:22; James 2:2–3; Genesis 2:24; Malachi 2:14 (King James)",
      "Tertullian, Apology 6 — the ring as the woman's pledge",
      "Clement of Alexandria, Paedagogus 3.11 — ring as signet, warning against luxury",
      "Pliny, Natural History 33 — gold rings and rank",
    ],
  },
  {
    id: "mistletoe",
    section: "household",
    title: "Mistletoe",
    card: "Pliny records Druid reverence for mistletoe on the oak as a heaven-sent all-heal. English kissing under the bough is a later folk use of the same plant. Scripture never sanctifies it.",
    practicedToday:
      "Sprigs are hung in doorways at midwinter. Strangers and family are expected to kiss beneath them. It is sold as Christmas décor and treated as a joke, not as a plant once treated as sacred.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Deuteronomy 12:30",
        text: "Take heed to thyself that thou be not snared by following them, after that they be destroyed from before thee; and that thou enquire not after their gods, saying, How did these nations serve their gods? even so will I do likewise.",
      },
    ],
    history: `Pliny the Elder (*Natural History* 16.95) describes the Gaulish Druids holding nothing more sacred than **mistletoe** and the tree on which it grows when that tree is an oak. They call it by a name meaning all-heal, and they believe whatever grows on those trees is sent from heaven. That is a primary Roman ethnography of a Celtic priestly plant-rite — not a Christian ordinance.

English and later American **kissing under mistletoe** is a folk custom of the early modern and Victorian periods, bound to midwinter greenery. It is not in the Gospels. Norse literature has a mistletoe story around the death of Baldr; that is a separate mythic use of the same plant, not a church sacrament.

This page does not reconstruct Druid ritual. The point is the plant's attested sacred status among the nations, and its later "harmless" party use.`,
    unawares: `A doorway kiss is treated as romance. The plant was recorded as **holy to Druid priests**, gathered from the oak as heaven-sent. Midwinter kissing does not make someone a Druid — it does mean a sacred plant of the nations was kept and emptied of its old name, not tested against Deuteronomy 12.`,
    disputed: `Not every kiss under a sprig is "Druid worship." Pliny is describing a specific priesthood and oak-rite. Victorian parlour custom is a descendant in the botanical and seasonal sense, not a full reconstruction of that rite. Do not invent a ceremonial how-to; do not pretend the plant was always just décor.`,
    sources: [
      "Deuteronomy 12:30; 18:10–12 (King James)",
      "Pliny the Elder, Natural History 16.95 — Druids, oak, and mistletoe as all-heal sent from heaven",
    ],
  },
  {
    id: "crosses",
    section: "images",
    title: "Displaying crosses",
    card: "The cross was Rome's instrument of a cursed death. Early Christians were accused of worshipping it and denied the charge. Later empire and churches made the shape a badge, jewel, and object of devotion.",
    practicedToday:
      "Crosses hang on walls, necks, steeples, and graves. Many who wear one could not say whether they mean 'Messiah died' or 'this object blesses me.' The second commandment is rarely read over the jewelry counter.",
    scriptures: [
      {
        ref: "Exodus 20:4–5",
        text: "Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth: Thou shalt not bow down thyself to them, nor serve them: for I the LORD thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me;",
      },
      {
        ref: "Deuteronomy 21:23",
        text: "His body shall not remain all night upon the tree, but thou shalt in any wise bury him that day; (for he that is hanged is accursed of God;) that thy land be not defiled, which the LORD thy God giveth thee for an inheritance.",
      },
      {
        ref: "Galatians 3:13",
        text: "Christ hath redeemed us from the curse of the law, being made a curse for us: for it is written, Cursed is every one that hangeth on a tree:",
      },
      {
        ref: "1 Corinthians 1:18",
        text: "For the preaching of the cross is to them that perish foolishness; but unto us which are saved it is the power of God.",
      },
      {
        ref: "2 Kings 18:4",
        text: "He removed the high places, and brake the images, and cut down the groves, and brake in pieces the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan.",
      },
    ],
    history: `Paul boasts in the **preaching** of the cross (1 Corinthians 1:18) — the message of the execution, not an instruction to carve the scaffold. Deuteronomy 21:23 and Galatians 3:13 call hanging on a tree a curse. The earliest widespread Christian signs in the record are the fish, the chi-rho, and the anchor. Minucius Felix (*Octavius* 29, 2nd/3rd century) has a pagan accuser charge Christians with worshipping crosses; the Christian speaker **denies** that they worship the instrument of execution.

After Constantine (Eusebius, *Life of Constantine*, on the vision of the cross-sign in the sky and the labarum), the cross becomes an imperial and then ecclesiastical emblem. Crucifixes (corpus on the cross) as objects of devotion are later still. Jewelry crosses are later than the apostles.

Hezekiah smashed the brazen serpent Moses had made once people burned incense to it (2 Kings 18:4). A thing God had used could become an idol. That is the biblical pattern for any object — including a replica of the Roman scaffold.`,
    unawares: `Wearing or hanging a cross is treated as the mark of a Christian. For centuries after the apostles it was not the ordinary public badge. Many now kiss, bow to, or "feel protected by" the object. Exodus 20:4–5 forbids making a likeness **to bow down to it**. 1 Corinthians 1:18 locates power in the preaching, not in silver on a chain.`,
    disputed: `Two opposite overreaches: (1) that any two crossed lines are "the mark of Tammuz" — Ezekiel 8:14 weeps for Tammuz; it does not define the Latin cross; (2) that displaying a cross can never become a snare — Hezekiah's Nehushtan shows a God-associated object can. The pre-Constantinian writers who denied cross-worship are part of the record. So is later veneration. Distinguish the **event** (Messiah crucified) from the **object** (a made likeness).`,
    sources: [
      "Exodus 20:4–5; Deuteronomy 21:23; Galatians 3:13; 1 Corinthians 1:18; 2 Kings 18:4; Ezekiel 8:14 (King James)",
      "Minucius Felix, Octavius 29 — denial that Christians worship crosses",
      "Eusebius, Life of Constantine — imperial adoption of the cross-sign (labarum)",
    ],
  },
  {
    id: "halloween",
    section: "times",
    title: "Halloween and All Hallows",
    card: "A church vigil for All Saints sits on 31 October / 1 November. Folk night-customs of souls, disguises, and later American 'spooky' play sit on the same nights. Scripture forbids consulting the dead.",
    practicedToday:
      "Costumes, candy, haunted houses, and 'fun' death-imagery fill 31 October. Churches sometimes host alternatives on the same night. Few ask why the dead are the theme, or what Deuteronomy 18 says about consulting spirits.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Isaiah 8:19",
        text: "And when they shall say unto you, Seek unto them that have familiar spirits, and unto wizards that peep, and that mutter: should not a people seek unto their God? for the living to the dead?",
      },
      {
        ref: "Leviticus 19:31",
        text: "Regard not them that have familiar spirits, neither seek after wizards, to be defiled by them: I am the LORD your God.",
      },
    ],
    history: `**All Saints** on 1 November is a medieval Western church date (an oratory for all saints in St. Peter's is associated with Gregory III in the 8th century; Gregory IV is associated with extending the observance). 31 October is the eve of that feast — **All Hallows' Eve**.

Irish **Samhain** is a Gaelic turning of the year in medieval Irish literature, with otherworld and assembly associations. Modern writing often collapses Samhain, All Hallows, and Satanism into one night. The church vigil, Gaelic season, English "souling" and guising, and 20th-century American commercial Halloween are **layers**, not a single rite.

This page does not teach any night ceremony. What Scripture states without layer-blurring: seeking the dead and familiar spirits is forbidden (Deuteronomy 18; Isaiah 8:19). A culture that dresses its children as the dead and makes horror a game on that night is playing with what the Torah calls defilement — whether or not anyone in the house can name Samhain.`,
    unawares: `Parents who would never visit a medium will still send children to collect candy while wearing the dead, witches, and demons as costumes, because a store sold it as autumn fun. The **theme is the dead and the forbidden occupations of Deuteronomy 18**, even when the intent is sugar.`,
    disputed: `The slogan "Halloween is Samhain, and Samhain is Satan" is a modern collapse. Satan as a named object of worship is not how medieval Irish texts describe Samhain. All Saints is a church feast of the dead-in-Christ. Folk customs mixed. American Halloween is largely commercial. None of that makes Deuteronomy 18 optional. None of it requires inventing a single ancient 'satanic mass' behind every pumpkin.`,
    sources: [
      "Deuteronomy 18:10–12; Leviticus 19:31; Isaiah 8:19 (King James)",
      "Western All Saints / All Hallows' Eve (8th-century Roman observance of 1 November, later universal in the West)",
      "Medieval Irish literature on Samhain as a seasonal turning — distinct from later American Halloween",
    ],
  },
  {
    id: "new-year",
    section: "times",
    title: "New Year's Day on 1 January",
    card: "Rome opened the year with January, named for Janus of the two faces. Scripture sets the beginning of months in the spring, at the Exodus. People still 'start the year' on Janus's day with noise, vows, and drink.",
    practicedToday:
      "Midnight of 31 December / 1 January is treated as the true turning of the year: fireworks, toasts, resolutions. Calendars, contracts, and school years follow it. The first month of Exodus 12 is unknown to most.",
    scriptures: [
      {
        ref: "Exodus 12:2",
        text: "This month shall be unto you the beginning of months: it shall be the first month of the year to you.",
      },
      {
        ref: "Exodus 13:4",
        text: "This day came ye out in the month Abib.",
      },
      {
        ref: "Esther 3:7",
        text: "In the first month, that is, the month Nisan, in the twelfth year of king Ahasuerus, they cast Pur, that is, the lot, before Haman from day to day, and from month to month, to the twelfth month, that is, the month Adar.",
      },
    ],
    history: `Exodus 12:2 resets Israel's year to the month of the departure from Egypt — **Abib/Nisan**, in the spring. That is a commanded beginning of months.

The Roman civil year, as settled in the Julian reform, begins at the **Kalends of January**. January is named for **Janus**, the two-faced god of doorways and beginnings. Tertullian lists the **New Year** among the festivals Christians should not share with the nations (*On Idolatry* 14). Gift-giving at the Kalends (*strenae*) and later European New Year customs descend from that civic-religious turn of the year.

1 January as "the New Year" is therefore a **Roman** marker, not the Abib of Exodus. Other Christian eras used 25 March or 25 December as year-start; those are also not Exodus 12. The modern international default is Janus's month.`,
    unawares: `Resolutions, champagne, and "Happy New Year" feel secular. The date is **Janus**. The biblical first month is still the month of Passover, in the spring. Keeping a civil calendar for taxes is one thing; calling Janus's day a holy beginning, or pouring drink to it, is another.`,
    disputed: `Not every fireworks show is a Janus liturgy. The name of the month, the Kalends, and Tertullian's warning are the documented core. Later magic of "what you do at midnight sets the year" is folk superstition riding the same date — observer-of-times territory (Deuteronomy 18), even when people think they are only partying.`,
    sources: [
      "Exodus 12:2; 13:4; Esther 3:7 (King James)",
      "Roman designation of January from Janus; Julian year beginning at the Kalends of January",
      "Tertullian, On Idolatry 14 — New Year among the nations' festivals",
    ],
  },
  {
    id: "lent-carnival",
    section: "times",
    title: "Lent, Carnival, and Mardi Gras",
    card: "A forty-day fast before Easter and a binge before the fast are church and folk inventions. The Torah's fast that is commanded is the Day of Atonement. Carnival means 'farewell to flesh' — then the same flesh is indulged by rule.",
    practicedToday:
      "Ashes on the forehead, giving up chocolate, and, in some cities, a public carnival of excess the day before. It is treated as the Christian year. Leviticus 23's Day of Atonement is not the template most people are using.",
    scriptures: [
      {
        ref: "Leviticus 23:27–28",
        text: "Also on the tenth day of this seventh month there shall be a day of atonement: it shall be an holy convocation unto you; and ye shall afflict your souls, and offer an offering made by fire unto the LORD. And ye shall do no work in that same day: for it is a day of atonement, to make an atonement for you before the LORD your God.",
      },
      {
        ref: "Isaiah 58:5–6",
        text: "Is it such a fast that I have chosen? a day for a man to afflict his soul? is it to bow down his head as a bulrush, and to spread sackcloth and ashes under him? wilt thou call this a fast, and an acceptable day to the LORD? Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke?",
      },
      {
        ref: "Matthew 6:16–18",
        text: "Moreover when ye fast, be not, as the hypocrites, of a sad countenance: for they disfigure their faces, that they may appear unto men to fast. Verily I say unto you, They have their reward. But thou, when thou fastest, anoint thine head, and wash thy face; That thou appear not unto men to fast, but unto thy Father which is in secret: and thy Father, which seeth in secret, shall reward thee openly.",
      },
    ],
    history: `Messiah fasted forty days (Matthew 4); that is a narrative, not a command to copy the calendar every spring. The **Lenten** fast as a fixed season before Easter grew in the churches (Nicaea mentions a Lenten period; the length and foods varied by region for centuries). **Ash Wednesday** ashes on the face sit in tension with Matthew 6:16–18, which forbids disfiguring the face to be seen fasting.

**Carnival / Mardi Gras** is the folk inversion: a licensed excess before the fast. The name is Latin *carne levare* / farewell to meat. Public carnival has long mixed Christian calendar with revel, masks, and in some cities open indecency. That pattern — feast of the flesh, then a fast of the church's making — is not Leviticus 23.

The commanded affliction of soul in the Torah is **Yom Kippur**, the tenth of the seventh month.`,
    unawares: `Giving up a snack for Lent is treated as discipleship. The season is **tied to Easter's date**, not to the seventh-month Day of Atonement. Carnival then teaches that sin can be scheduled: excess on Tuesday, ashes on Wednesday.`,
    disputed: `Some tracts make Carnival a direct survival of a single named pagan orgy. Carnival is historically a **Christian-calendar folk binge**, not a verse, and it has absorbed local revels. You do not need a lost Babylonian liturgy to see that licensed debauchery plus a man-made fast is not the fast God describes in Isaiah 58.`,
    sources: [
      "Leviticus 23:27–28; Isaiah 58:5–6; Matthew 4:1–2; 6:16–18 (King James)",
      "Council of Nicaea (325) — reference to a Lenten season whose length later standardized",
      "Western Ash Wednesday and Carnival / Mardi Gras as calendar folk around that season",
    ],
  },
  {
    id: "valentines",
    section: "household",
    title: "Valentine's Day",
    card: "14 February as a lovers' feast is medieval and later commercial. A popular story that it replaced Lupercalia is widely repeated and poorly attested. Scripture never appoints a day of Cupid.",
    practicedToday:
      "Cards, roses, and compulsory romance on 14 February. Schools hold exchanges. The day is treated as natural law. Cupid — a Roman love-god — still appears on the merchandise.",
    scriptures: [
      {
        ref: "Exodus 20:3",
        text: "Thou shalt have no other gods before me.",
      },
      {
        ref: "Song of Solomon 8:6–7",
        text: "Set me as a seal upon thine heart, as a seal upon thine arm: for love is strong as death; jealousy is cruel as the grave: the coals thereof are coals of fire, which hath a most vehement flame. Many waters cannot quench love, neither can the floods drown it: if a man would give all the substance of his house for love, it would utterly be contemned.",
      },
    ],
    history: `A feast of **Saint Valentine** on 14 February appears in Western martyrologies. The romantic meaning is largely later: Chaucer and 14th–15th-century English poetry associate Valentine with the mating of birds; commercial valentines boom in the 18th–19th centuries.

**Lupercalia** (15 February, in honour of Faunus/Lupercus, with running and leather thongs) was a real Roman rite. Pope Gelasius I is associated with ending Lupercalia in late 5th-century Rome. The further claim that he **replaced** it with Valentine's Day as a lovers' festival is not how the surviving Gelasian texts read; historians often judge that link late and weak.

Cupid (Greek Eros) as a winged archer on cards is **Roman myth merchandised**, not 1 Corinthians 13.`,
    unawares: `People who reject 'pagan holidays' still keep **Cupid's merchandise day** because it is about marriage and kindness. Love is in Scripture. A feast of a Roman love-god on a martyrology date is not.`,
    disputed: `Do not treat "Valentine's = Lupercalia" as a proven church-for-church swap. Lupercalia ended; Valentine's romantic meaning grew centuries later. The honest residue is: a **non-biblical lovers' feast**, Cupid on the goods, and a popular origin story that overreaches.`,
    sources: [
      "Exodus 20:3; Song of Solomon 8:6–7 (King James)",
      "Western feast of St Valentine (14 February) in martyrologies; romantic association in later medieval English poetry",
      "Lupercalia as a separate mid-February Roman rite; Gelasius I and the end of Lupercalia — replacement-with-Valentine is disputed",
    ],
  },
  {
    id: "santa",
    section: "household",
    title: "Santa Claus",
    card: "A bishop of Myra, Dutch Sinterklaas, a 19th-century American poem, and later advertising produced a all-seeing gift-bringer who occupies the place of a god in children's houses every December.",
    practicedToday:
      "Children are taught that a man sees them when they are sleeping, knows if they are good or bad, and rewards them. Parents speak the story as fact, then call it harmless. The attributes overlap what Scripture says of God, not of a shopkeeper.",
    scriptures: [
      {
        ref: "Psalm 139:2–4",
        text: "Thou knowest my downsitting and mine uprising, thou understandest my thought afar off. Thou compassest my path and my lying down, and art acquainted with all my ways. For there is not a word in my tongue, but, lo, O LORD, thou knowest it altogether.",
      },
      {
        ref: "Proverbs 15:3",
        text: "The eyes of the LORD are in every place, beholding the evil and the good.",
      },
      {
        ref: "James 1:17",
        text: "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.",
      },
      {
        ref: "Ephesians 4:25",
        text: "Wherefore putting away lying, speak every man truth with his neighbour: for we are members one of another.",
      },
      {
        ref: "Jeremiah 10:5",
        text: "They are upright as the palm tree, but speak not: they must needs be borne, because they cannot go. Be not afraid of them; for they cannot do evil, neither also is it in them to do good.",
      },
    ],
    history: `**Nicholas of Myra** (4th century) is a historical bishop around whom gift-legends grew. Dutch **Sinterklaas** (eve of 6 December) is a distinct European custom. The American **Santa Claus** is assembled in the 19th century: Washington Irving's sketches, Clement Clarke Moore's 1823 *A Visit from St. Nicholas* (the reindeer, chimney, pack), Thomas Nast's cartoons, then 20th-century advertising.

The resulting figure: omniscient moral surveillance, heavenly travel, reward and withholding, a throne at the mall. James 1:17 locates good gifts in the Father. Psalm 139 locates all-seeing in the LORD. Teaching children that Santa has those attributes, as fact, is not a Bible story. It is also a seasonal lie (Ephesians 4:25).`,
    unawares: `Adults who would never teach a child to pray to an idol will still train the child to **write petitions to Santa** and to fear his gaze. The costume is red and commercial. The job description is divine.`,
    disputed: `Internet claims that Santa "is Odin" (Wild Hunt, eight-legged horse, etc.) mix real Norse myth with modern listicles. Sinterklaas and Santa have documented Christian-legendary and American literary sources. You do not need Odin to see the problem: an all-seeing gift-god installed in the house beside, or in front of, the Father of lights. Do not baptize the mall Santa; do not invent a Viking liturgy for every Coca-Cola ad.`,
    sources: [
      "Psalm 139:2–4; Proverbs 15:3; James 1:17; Ephesians 4:25; Jeremiah 10:5 (King James)",
      "Nicholas of Myra as a 4th-century bishop; Dutch Sinterklaas (6 December)",
      "Clement Clarke Moore, A Visit from St. Nicholas (1823); 19th-century American visual type (e.g. Thomas Nast)",
    ],
  },
  {
    id: "weekdays",
    section: "images",
    title: "Days of the week named for the gods",
    card: "English weekday names are the planets and the northern gods: Sun, Moon, Tiw, Woden, Thor, Frigg, and Saturn. People schedule their lives on a theophoric week without noticing the names in their mouths.",
    practicedToday:
      "Every school, office, and church bulletin says Sunday, Monday, Tuesday… as if the words were neutral. They are not Hebrew numbers (first day, second day…). They are the nations' sky-gods and, in the North, the gods of war, frenzy, thunder, and marriage.",
    scriptures: [
      {
        ref: "Exodus 23:13",
        text: "And in all things that I have said unto you be circumspect: and make no mention of the name of other gods, neither let it be heard out of thy mouth.",
      },
      {
        ref: "Joshua 23:7",
        text: "That ye come not among these nations, these that remain among you; neither make mention of the name of their gods, nor cause to swear by them, neither serve them, nor bow yourselves unto them:",
      },
      {
        ref: "Psalm 16:4",
        text: "Their sorrows shall be multiplied that hasten after another god: their drink offerings of blood will I not offer, nor take up their names into my lips.",
      },
    ],
    history: `Rome named weekdays after the seven planetary gods (dies Solis, Lunae, Martis, Mercurii, Iovis, Veneris, Saturni). English replaced several with **Tiw (Tyr), Woden (Odin), Thor, Frigg** — interpretatio germanica of Mars, Mercury, Jupiter, Venus. Saturday kept Saturn. Sunday and Monday kept the Sun and Moon.

Hebrew and the Gospels number the days (the first day of the week, the Sabbath). They do not name Thor's day. Exodus 23:13 and Joshua 23:7 command Israel not to let the names of other gods be heard in the mouth. Using a civil calendar is not the same as swearing by Thor; the names are still those names.`,
    unawares: `A believer can say "I'll see you Thursday" a thousand times and never hear **Thor**. The week is a missionary victory of the nations' vocabulary over numbered days. Churches even print "Sun-day" as the Lord's day — the same word Constantine's edict used for the Sun.`,
    disputed: `Speaking a weekday is not automatically idolatry; Paul discusses food offered to idols and unknown gods without requiring a new language (Acts 17; 1 Corinthians 8). The point of this card is **unawareness**: the calendar is a catechism of gods. Exodus 23:13 is in the book. Whether civil speech violates it is for the reader; hiding the etymology is not honesty.`,
    sources: [
      "Exodus 23:13; Joshua 23:7; Psalm 16:4 (King James)",
      "Latin planetary week (dies Solis … dies Saturni); English Tiw, Woden, Thor, Frigg as the northern equivalents",
    ],
  },
  {
    id: "months",
    section: "images",
    title: "Months named for gods and Caesars",
    card: "January is Janus. March is Mars. May is Maia. June is Juno. July and August are Julius and Augustus Caesar. The biblical months are numbered and, in places, named from the agricultural year of Israel — not from Rome's gods and emperors.",
    practicedToday:
      "Legal documents, birthdays, and church bulletins use January–December as if they were nature. They are a Roman list: gods, a goddess of growth, the queen of the Roman gods, and deified emperors.",
    scriptures: [
      {
        ref: "Exodus 12:2",
        text: "This month shall be unto you the beginning of months: it shall be the first month of the year to you.",
      },
      {
        ref: "Exodus 13:4",
        text: "This day came ye out in the month Abib.",
      },
      {
        ref: "1 Kings 6:1",
        text: "And it came to pass in the four hundred and eightieth year after the children of Israel were come out of the land of Egypt, in the fourth year of Solomon's reign over Israel, in the month Zif, which is the second month, that he began to build the house of the LORD.",
      },
    ],
    history: `The Roman month-names still in English:

- **January** — Janus  
- **March** — Mars  
- **May** — Maia (and the Maiestas / spring growth complex)  
- **June** — Juno  
- **July** — Julius Caesar (renamed from Quintilis)  
- **August** — Augustus (renamed from Sextilis)

February is bound to Februa (purification). April's etymology is disputed (perhaps *aperire*, to open). September–December are leftover numbers from a ten-month scheme (*septem, octo, novem, decem*) that no longer match their place.

Scripture's first month is **Abib/Nisan**. Other biblical month-names appear (Zif, Bul, Ethanim). None are Janus or Julius.`,
    unawares: `Writing "March 15" is writing **Mars**. Writing "July" is writing a **deified Caesar**. The calendar of the empire outlived the empire in the mouths of people who think they have left Babylon.`,
    disputed: `As with weekdays, civil dating is not the same as a temple vow. The names remain the names. Exodus 12 still starts the year in Abib. Honesty is naming the gods in the months rather than pretending the list is Hebrew.`,
    sources: [
      "Exodus 12:2; 13:4; 1 Kings 6:1 (King James)",
      "Roman month-names: Janus, Februa, Mars, Maia, Juno; Quintilis/Sextilis renamed for Julius and Augustus",
    ],
  },
  {
    id: "images",
    section: "images",
    title: "Images of God and of Messiah",
    card: "The second commandment forbids a likeness to bow to. Later churches filled walls with pictures and statues of the Father, the Son, and the saints. Many homes now treat a painting of 'Jesus' as piety.",
    practicedToday:
      "Portraits with long European hair, plastic nativity sets, and statues that are kissed or processed. The commandment is explained away as 'we are not worshipping the wood.' Hezekiah's generation said similar things about the serpent Moses made.",
    scriptures: [
      {
        ref: "Exodus 20:4–5",
        text: "Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth: Thou shalt not bow down thyself to them, nor serve them: for I the LORD thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me;",
      },
      {
        ref: "Deuteronomy 4:15–16",
        text: "Take ye therefore good heed unto yourselves; for ye saw no manner of similitude on the day that the LORD spake unto you in Horeb out of the midst of the fire: Lest ye corrupt yourselves, and make you a graven image, the similitude of any figure, the likeness of male or female,",
      },
      {
        ref: "Isaiah 42:8",
        text: "I am the LORD: that is my name: and my glory will I not give to another, neither my praise to graven images.",
      },
      {
        ref: "Acts 17:29",
        text: "Forasmuch then as we are the offspring of God, we ought not to think that the Godhead is like unto gold, or silver, or stone, graven by art and man's device.",
      },
      {
        ref: "Romans 1:23",
        text: "And changed the glory of the uncorruptible God into an image made like to corruptible man, and to birds, and fourfooted beasts, and creeping things.",
      },
    ],
    history: `Israel saw **no form** at Horeb (Deuteronomy 4:15). The second commandment bans a likeness for worship. The tabernacle had cherubim God commanded — that is not a license for an image of YHWH as a man. Romans 1:23 names exchanging God's glory for the image of corruptible **man** as the nations' fall.

The churches later divided: some smashed images (Byzantine controversy; later Protestant iconoclasm); some defined veneration versus worship (Second Council of Nicaea, 787). That council is church law. It is not Exodus 20. Statues of Mary and the saints, and European "sacred hearts" and "holy faces," are post-biblical.

Halos as a sun-disk behind the head in religious art continue a visual language older than the churches (radiate crowns of Hellenistic and Roman solar rulers). The art-history fact does not by itself prove every icon painter intended Sol Invictus; it does show the **sun-nimbus** entered Christian pictures.`,
    unawares: `A picture of a European man is called "Jesus" and hung where a household would once have put a household god. Children learn the face of the painting, not Deuteronomy 4. Kissing icons, processing statues, and lighting candles to them is what the nations did with images — the churches renamed the objects.`,
    disputed: `Some say any drawing is forbidden, including a child's sketch of a sheep. Deuteronomy 4 and Exodus 20 are aimed at **similitude for worship** and at representing the God who showed no form. Some say the incarnation now allows a picture of the Son. The text of the commandment was not rewritten in Matthew. Present both claims; the verses still say what they say. Second Nicaea is not Sinai.`,
    sources: [
      "Exodus 20:4–5; Deuteronomy 4:15–16; Isaiah 42:8; Acts 17:29; Romans 1:23; 2 Kings 18:4 (King James)",
      "Second Council of Nicaea (787) — church ruling on images, not a Torah text",
    ],
  },
  {
    id: "horoscopes",
    section: "divination",
    title: "Horoscopes, zodiac, and 'signs of heaven'",
    card: "Jeremiah 10:2 forbids learning the way of the heathen and being dismayed at the signs of heaven. Isaiah mocks astrologers and monthly prognosticators. The same charts are now a newspaper toy.",
    practicedToday:
      "Sun-sign columns, natal charts, 'what's your sign,' and apps that claim the stars govern the day. It is sold as personality, not as the abomination Deuteronomy 18 names: observer of times.",
    scriptures: [
      {
        ref: "Jeremiah 10:2",
        text: "Thus saith the LORD, Learn not the way of the heathen, and be not dismayed at the signs of heaven; for the heathen are dismayed at them.",
      },
      {
        ref: "Isaiah 47:13–14",
        text: "Thou art wearied in the multitude of thy counsels. Let now the astrologers, the stargazers, the monthly prognosticators, stand up, and save thee from these things that shall come upon thee. Behold, they shall be as stubble; the fire shall burn them; they shall not deliver themselves from the power of the flame: there shall not be a coal to warm at, nor fire to sit before it.",
      },
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Genesis 1:14",
        text: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
      },
    ],
    history: `Babylonian and later Hellenistic astrology mapped planets and zodiac signs onto fate. Rome and the medieval West kept the art. Isaiah 47 addresses **Babylon's** astrologers and monthly prognosticators as unable to save. Deuteronomy 18 lists the **observer of times**. Jeremiah 10:2 forbids dread of the signs of heaven after the manner of the nations.

Genesis 1:14 says the lights are for signs and *seasons* (appointed times) — calendar and lights God made — not for reading a person's character from the hour of birth.

This page does not teach chart-casting. The newspaper horoscope is the same occupation with the danger-label torn off.`,
    unawares: `"I'm a Scorpio" is treated as small talk. It is **zodiac identity**: locating the self in a system Isaiah says cannot save. Magazines and phones catechize it daily.`,
    disputed: `Genesis 1:14 is sometimes twisted to baptize astrology. The rest of the canon (Deuteronomy 18; Isaiah 47; Jeremiah 10:2) will not allow that reading. The Magi in Matthew 2 saw a sign at Messiah's birth — a specific act of God, not a license for natal charts. Do not confuse God's unique signs with the nations' monthly prognosticators.`,
    sources: [
      "Jeremiah 10:2; Isaiah 47:13–14; Deuteronomy 18:10–12; Genesis 1:14 (King James)",
    ],
  },
  {
    id: "luck-charms",
    section: "divination",
    title: "Luck, charms, and 'harmless' superstition",
    card: "Knocking on wood, salt over the shoulder, lucky numbers, horseshoes, and 'jinx' language treat unseen powers as things to bribe or dodge. Scripture calls that the nations' way, not a personality quirk.",
    practicedToday:
      "Athletes' rituals, 'knock on wood,' crossing fingers, lucky socks, and fear of Friday the 13th. People who deny 'the occult' still perform small rites to manage fate.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Isaiah 2:6",
        text: "Therefore thou hast forsaken thy people the house of Jacob, because they be replenished from the east, and are soothsayers like the Philistines, and they please themselves in the children of strangers.",
      },
      {
        ref: "Isaiah 65:11",
        text: "But ye are they that forsake the LORD, that forget my holy mountain, that prepare a table for that troop, and that furnish the drink offering unto that number.",
      },
    ],
    history: `A **charmer** is in Deuteronomy 18's list. Cross-cultural "luck" rites (touching wood, spilling salt, apotropaic iron, numbers) are folk attempts to bind fortune. Isaiah 65:11 rebukes those who **prepare a table for Fortune** (KJV "that troop") and a drink for **Destiny** ("that number") — reading the Hebrew as Gad and Meni, gods of fortune, which many translations note.

This page does not catalogue how to perform any charm. The pattern is enough: small acts meant to control hidden luck are the nations' piety, miniaturized.`,
    unawares: `Crossing fingers "so it will happen" is a petition to **luck**, not to the LORD. Knocking on wood after praise is fear that a jealous unseen thing will punish speech — the opposite of Psalm 34. The vocabulary is joking. The act is still a rite.`,
    disputed: `Not every habit is a named ancient god. Do not invent a Babylonian origin for every athletes' tic. Do read Deuteronomy 18 and Isaiah 65:11 over the word "luck." If the act is meant to manipulate unseen fortune apart from God, it belongs in this list whether or not a museum label names the deity.`,
    sources: [
      "Deuteronomy 18:10–12; Isaiah 2:6; 65:11 (King James; many notes on 65:11 as Gad and Meni, fortune and destiny)",
    ],
  },
  {
    id: "talking-boards",
    section: "divination",
    title: "Talking boards sold as games",
    card: "Nineteenth-century spiritualism commercialized a board for 'talking' with spirits. Later it was sold in toy aisles. Scripture forbids consulting familiar spirits. This page will not describe how to use one.",
    practicedToday:
      "A boxed 'game' appears at parties and in closets. It is treated as a thrill or a joke. Deuteronomy 18 does not have a toy exception.",
    scriptures: [
      {
        ref: "Deuteronomy 18:10–12",
        text: "There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch, Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee.",
      },
      {
        ref: "Leviticus 20:6",
        text: "And the soul that turneth after such as have familiar spirits, and after wizards, to go a whoring after them, I will even set my face against that soul, and will cut him off from among his people.",
      },
      {
        ref: "Isaiah 8:19",
        text: "And when they shall say unto you, Seek unto them that have familiar spirits, and unto wizards that peep, and that mutter: should not a people seek unto their God? for the living to the dead?",
      },
      {
        ref: "1 Samuel 28:7",
        text: "Then said Saul unto his servants, Seek me a woman that hath a familiar spirit, that I may go to her, and enquire of her. And his servants said to him, Behold, there is a woman that hath a familiar spirit at Endor.",
      },
    ],
    history: `In the late 19th century, American spiritualism marketed **talking boards** (patents and novelty companies of the 1890s; later mass-market toy branding). The claim of the object is contact with the unseen by a moving indicator — the same class of act as consulting a familiar spirit.

Saul's visit to the woman at Endor (1 Samuel 28) is recorded as disobedience; he dies under judgment. The text is a warning, not a method.

**This entry deliberately omits operation, "how it works," and any ritual detail.** The only fact needed: it was sold as entertainment after being a spiritualist tool. The Torah already named the occupation.`,
    unawares: `A closet in a "Christian home" can hold a box whose advertised purpose is **talking to spirits**, because the box says Game. Leviticus 20:6 does not ask what the box was filed under in a store.`,
    disputed: `Skeptics say it is only ideomotor movement. Scripture's category is still **consulting spirits**, which it forbids whether or not a laboratory explains the motion. Do not test the object "to see." Do not teach it.`,
    sources: [
      "Deuteronomy 18:10–12; Leviticus 20:6; Isaiah 8:19; 1 Samuel 28 (King James)",
      "Late 19th-century American patents and novelty marketing of talking boards; later toy-aisle branding",
    ],
  },
  {
    id: "may-day",
    section: "household",
    title: "May Day and the maypole",
    card: "A pole, garlands, and dancing on the first of May are European spring folk. Scripture never commands them. Green-tree and grove worship is exactly what Israel was told not to copy.",
    practicedToday:
      "Schoolchildren still dance ribbons around a pole in some towns. Others keep 'May Day' as labour day only. The older folk form is a spring fertility revel around a tree-substitute.",
    scriptures: [
      {
        ref: "Deuteronomy 16:21",
        text: "Thou shalt not plant thee a grove of any trees near unto the altar of the LORD thy God, which thou shalt make thee.",
      },
      {
        ref: "Jeremiah 17:2",
        text: "Whilst their children remember their altars and their groves by the green trees upon the high hills.",
      },
      {
        ref: "2 Kings 17:10",
        text: "And they set them up images and groves in every high hill, and under every green tree:",
      },
    ],
    history: `European **May** customs (bringing in the May, maypole, greenery) are well attested in medieval and early modern sources as spring folk. A pole dressed as a tree, danced about with ribbons, is a **green-tree rite** in form even when the town calls it a school pageant.

Roman *Floralia* and other spring festivals are sometimes compared; the English maypole is not a verse-by-verse copy of one Latin rite. The biblical analogue is closer: groves and green trees as the nations' worship sites (2 Kings 17:10).

This page does not reconstruct a maypole ceremony.`,
    unawares: `A pretty dance for children is filed under "culture." The shape is still a **dressed tree** in the open, on a day the churches did not get from Leviticus 23.`,
    disputed: `Philip Stubbes and later Puritans attacked maypoles as idolatry; some modern writers call every pole "Asherah." An Asherah is a specific forbidden cult object in Hebrew. A village maypole is not automatically that object in a museum sense. It is still a green-tree custom of the nations, which is what Deuteronomy 16:21 and Jeremiah 17:2 are about.`,
    sources: [
      "Deuteronomy 16:21; Jeremiah 17:2; 2 Kings 17:10 (King James)",
      "Medieval and early modern English May / maypole folk custom",
    ],
  },
  {
    id: "queen-of-heaven",
    section: "household",
    title: "Cakes for the Queen of Heaven",
    card: "Jeremiah names a real rite: families baking cakes to the Queen of Heaven. Later Europe baked marked cakes at the spring feast. Whether every bun 'is' that rite is disputed; the prophet's charge is not.",
    practicedToday:
      "Hot cross buns and similar seasonal cakes are sold as Easter food. In other traditions, votive cakes and breads are still offered in folk religion. Jeremiah's families thought they were being devout.",
    scriptures: [
      {
        ref: "Jeremiah 7:18",
        text: "The children gather wood, and the fathers kindle the fire, and the women knead their dough, to make cakes to the queen of heaven, and to pour out drink offerings unto other gods, that they may provoke me to anger.",
      },
      {
        ref: "Jeremiah 44:17–19",
        text: "But we will certainly do whatsoever thing goeth forth out of our own mouth, to burn incense unto the queen of heaven, and to pour out drink offerings unto her, as we have done, we, and our fathers, our kings, and our princes, in the cities of Judah, and in the streets of Jerusalem: for then had we plenty of victuals, and were well, and saw no evil. But since we left off to burn incense to the queen of heaven, and to pour out drink offerings unto her, we have wanted all things, and have been consumed by the sword and by the famine. And when we burned incense to the queen of heaven, and poured out drink offerings unto her, did we make her cakes to worship her, and pour out drink offerings unto her, without our men?",
      },
    ],
    history: `Jeremiah 7 and 44 document a **household cult**: wood, fire, dough, cakes, drink offerings to the **Queen of Heaven**. The people defend it as the custom that brought prosperity. God names it provocation.

Near Eastern goddesses (including those titled queen of heaven in various cultures) received baked offerings. European **hot cross buns** are a Good Friday / Easter bread with a cross marked on them, attested in early modern England. They are not a verse of Jeremiah — they are a seasonal cake at the spring feast the churches substituted for Passover.

The prophet's pattern is the warning: **family baking as worship of a queen in heaven**, justified because "we had plenty." That pattern can migrate without the same goddess-name on the recipe card.`,
    unawares: `A spiced bun with a cross is "just breakfast." Jeremiah's cakes were also ordinary food turned into an offering. The question is not spices. It is **to whom the seasonal baking is oriented**, and whether the spring feast itself is the one God named.`,
    disputed: `Tracts that say the hot cross bun *is* Jeremiah 7, line for line, overstate. Jeremiah's cakes are a named idolatrous offering in Judah. English buns are later Christian-folk bread. The connection worth keeping is the **category**: sacred seasonal cakes for a heavenly queen or a church feast God did not write in Leviticus 23 — not a culinary conspiracy theory about every bakery.`,
    sources: [
      "Jeremiah 7:18; 44:17–19 (King James)",
      "Early modern English hot cross buns as spring / Good Friday folk bread",
    ],
  },
];
