/**
 * Empirical holdings only: published inscriptions, excavated objects, measured
 * government science, and contemporaneous public records.
 * Tradition, doctrine, and uncatalogued popular claims are not stored as evidence.
 */

export const ARCHIVE_NOTICE =
  "This archive holds empirical evidence only: excavated objects, published inscriptions, laboratory measurements, and dated public records. Tradition, tourist names, doctrine, and photographs with no museum or excavation catalog are not stored here as evidence.";

function item(kind, n, fields) {
  const text = String(fields.full_text || "").trim();
  return {
    id: `${kind}-${n}`,
    archive: kind,
    title: fields.title,
    description: text.slice(0, 480),
    full_text: text,
    evidence_type: fields.evidence_type || "",
    scientific_field: fields.scientific_field || "",
    document_type: fields.document_type || "",
    fulfillment_type: fields.fulfillment_type || "",
    scripture_reference: fields.scripture_reference || "",
    prophecy_reference: fields.prophecy_reference || fields.scripture_reference || "",
    era: fields.era || "",
    location: fields.location || "",
    holding: fields.holding || "",
    agency: fields.agency || fields.holding || "",
    country: fields.country || "",
    publication: fields.publication || fields.holding || "",
    date: fields.date || fields.era || "",
    modern_date: fields.modern_date || fields.date || "",
    verification_note: fields.verification_note || ARCHIVE_NOTICE,
    chronological_order: fields.order || n,
    confirms_scripture: false,
    source_url: "",
    document_url: "",
    article_url: "",
    image_url: "",
    local_image: fields.local_image || "",
    image_caption: fields.image_caption || "",
  };
}

let a = 0;
const ev = (fields) => item("archaeology", (a += 1), fields);
let s = 0;
const sci = (fields) => item("science", (s += 1), fields);
let g = 0;
const gov = (fields) => item("government", (g += 1), fields);
let v = 0;
const vat = (fields) => item("vatican", (v += 1), fields);
let m = 0;
const mod = (fields) => item("modern", (m += 1), fields);

export const ARCHAEOLOGY = [
  ev({
    title: "Pilate Stone (Caesarea)",
    evidence_type: "inscription",
    scripture_reference: "Matthew 27; Mark 15; Luke 3:1; Luke 23; John 18–19; Acts 4:27; 1 Timothy 6:13",
    era: "AD 26–36",
    location: "Caesarea Maritima",
    holding: "Israel Museum, Jerusalem. Found 1961 in the Roman theatre at Caesarea.",
    order: 26,
    full_text: `[Latin dedicatory stone, reconstructed published reading]

…]S TIBERIÉUM
[PON]TIUS PILATUS
[PRAEF]ECTUS IUDA[EA]E
[FECIT D]Ē[DICĀVIT]

Published English of the restored lines: “… the Tiberieum … Pontius Pilatus, Prefect of Judaea, has dedicated.”

The stone names Pontius Pilate as prefect (praefectus) of Judaea in the reign of Tiberius. The New Testament calls him governor in the time of Jesus’ trial.`,
  }),
  ev({
    title: "Tel Dan Stele (House of David)",
    evidence_type: "inscription",
    scripture_reference: "2 Samuel 5; 1 Kings 12; 2 Kings 8–10",
    era: "9th century BC",
    location: "Tel Dan, northern Israel",
    holding: "Israel Museum. Basalt fragments found 1993–1994.",
    order: -850,
    full_text: `Published English of the surviving Aramaic lines ( restorations marked ):

“… my father went up [against him when] he fought at […] and my father lay down, he went to his [fathers]. And the king of Israel entered previously in my father’s land. [And] Hadad made me king. And Hadad went in front of me, [and] I departed from [the] seven […] of my kingdom, and I slew [seve]nty kin[gs], who harnessed thou[sands of cha]riots and thousands of horsemen. [I killed Jeho]ram son of [Ahab] king of Israel, and [I] killed [Ahaz]iahu son of [Jehoram kin]g of the House of David. And I set [their towns into ruins and turned] their land into [desolation].”

The phrase “House of David” (bytdwd) is the published reading of the royal line named in 2 Samuel.`,
  }),
  ev({
    title: "Mesha Stele (Moabite Stone)",
    evidence_type: "inscription",
    scripture_reference: "2 Kings 3; Numbers 21:26–30",
    era: "c. 840 BC",
    location: "Dhiban (biblical Dibon), Moab",
    holding: "Louvre, Paris. Discovered 1868.",
    order: -840,
    full_text: `Published English of the opening of the Moabite inscription of King Mesha:

“I am Mesha, son of Chemosh[-yatti], king of Moab, the Dibonite. My father reigned over Moab thirty years, and I reigned after my father. And I made this high place for Chemosh in Qarhoh … because he saved me from all the kings and because he let me prevail over all my enemies. Omri was king of Israel, and he oppressed Moab many days, for Chemosh was angry with his land. And his son succeeded him, and he also said, ‘I will oppress Moab.’ In my days he spoke thus, but I have prevailed over him and over his house, and Israel has perished forever. And Omri had taken possession of the land of Medeba, and he dwelt in it his days and half the days of his son, forty years; but Chemosh dwelt in it in my days.”

2 Kings 3 records war between Israel and Mesha king of Moab after Ahab’s death.`,
  }),
  ev({
    title: "Cyrus Cylinder",
    evidence_type: "inscription",
    scripture_reference: "2 Chronicles 36:22–23; Ezra 1:1–4; Isaiah 44:28; Isaiah 45:1–13",
    era: "539–538 BC",
    location: "Babylon",
    holding: "British Museum. Clay cylinder of Cyrus II, found 1879.",
    order: -539,
    full_text: `Published English of the relevant lines of the Cyrus Cylinder (Babylonian):

“I am Cyrus, king of the universe, great king, mighty king, king of Babylon, king of Sumer and Akkad, king of the four quarters of the world … I returned the images of the gods, who had resided there, to their places and I let them dwell in eternal abodes. I gathered all their people and returned them to their settlements … I have enabled all the lands to live in peace.”

Ezra 1 records a decree of Cyrus for the return to Jerusalem and the rebuilding of the house of the LORD. The cylinder is a general restoration edict for peoples and temples; it does not name Judah or the Jerusalem temple in the surviving text.`,
  }),
  ev({
    title: "Siloam Tunnel Inscription",
    evidence_type: "inscription",
    scripture_reference: "2 Kings 20:20; 2 Chronicles 32:30",
    era: "late 8th century BC",
    location: "Hezekiah’s tunnel, Jerusalem",
    holding: "Istanbul Archaeology Museums. Found 1880 in the tunnel.",
    order: -701,
    full_text: `Published English of the Hebrew Siloam inscription:

“[…] the boring through. And this was the manner of the boring through. While [the hewers were] still [wielding] the axe, each man toward his fellow, and while there were still three cubits to be bored through, [there was heard] the voice of a man calling to his fellow, for there was a cleft in the rock on the right hand and on the left. And on the day of the boring through, the hewers struck each man so that it made an opening, each man toward his fellow, axe against [ax]e. And the water flowed from the spring toward the pool for twelve hundred cubits. And a hundred cubits was the height of the rock above the heads of the hewers.”

2 Kings 20:20: “And the rest of the acts of Hezekiah, and all his might, and how he made a pool, and a conduit, and brought water into the city, are they not written in the book of the chronicles of the kings of Judah?”`,
  }),
  ev({
    title: "Ketef Hinnom silver scrolls",
    evidence_type: "artifact",
    scripture_reference: "Numbers 6:24–26",
    era: "late 7th / early 6th century BC",
    location: "Ketef Hinnom, Jerusalem",
    holding: "Israel Museum. Found 1979.",
    order: -600,
    full_text: `Published English of the priestly blessing on the two silver amulets (Ketef Hinnom I and II), the oldest known copies of a biblical text:

“The LORD bless you and keep you; the LORD make his face shine upon you and give you peace.”

Numbers 6:24–26: “The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.”

The amulets were found in a burial repository west of the Old City. The published palaeographic date is before the Babylonian destruction of Jerusalem.`,
  }),
  ev({
    title: "Merneptah Stele",
    evidence_type: "inscription",
    scripture_reference: "Exodus 1; Genesis 32:28; Exodus 14",
    era: "c. 1208 BC (year 5 of Merneptah)",
    location: "Thebes, Egypt",
    holding: "Egyptian Museum, Cairo. Granite victory stele.",
    order: -1208,
    full_text: `Published English of the closing lines of the Merneptah Stele:

“The princes are prostrate, saying ‘Peace!’
Not one raises his head among the Nine Bows.
Desolation is for Tehenu; Hatti is pacified;
Plundered is Canaan with every evil;
Carried off is Ascalon; seized upon is Gezer;
Yanoam is made as that which does not exist;
Israel is laid waste; his seed is not;
Hurru is become a widow for Egypt!
All lands together, they are pacified.”

This is the earliest published extra-biblical occurrence of the name Israel in an Egyptian royal inscription. It places a people called Israel in Canaan in the late 13th century BC. It does not narrate the Exodus.`,
  }),
  ev({
    title: "Taylor Prism of Sennacherib",
    evidence_type: "inscription",
    scripture_reference: "2 Kings 18–19; 2 Chronicles 32; Isaiah 36–37",
    era: "701 BC",
    location: "Nineveh",
    holding: "British Museum (Taylor Prism). Parallel copies in Chicago and Jerusalem.",
    order: -701,
    full_text: `Published English of Sennacherib’s account of the campaign against Judah:

“As for Hezekiah the Judahite, who had not submitted to my yoke, I shut him up like a caged bird in his royal city of Jerusalem. I threw up earthworks against him. The one coming out of the city-gate, I turned back to his misery. His cities which I had despoiled I cut off from his land and gave them to Mitinti king of Ashdod, Padi king of Ekron, and Silli-bel king of Gaza. … Hezekiah himself, the terrifying splendor of my lordship overcame him, and the Arabs and his mercenaries whom he had brought in to strengthen Jerusalem, his royal city, deserted him. In addition to the 30 talents of gold and 800 talents of silver, gems, antimony, jewels, large sandu-stones, couches of ivory, elephant hides, ebony, boxwood, all kinds of valuable treasures, as well as his daughters, his harem, and his male and female musicians, which he had brought after me to Nineveh, my royal city, he sent his messenger to pay tribute and to do obeisance.”

2 Kings 18:13–16 records Hezekiah paying silver and gold to the king of Assyria. 2 Kings 19 records that Jerusalem was not taken.`,
  }),
  ev({
    title: "Black Obelisk of Shalmaneser III",
    evidence_type: "artifact",
    scripture_reference: "2 Kings 9–10",
    era: "825 BC (carved); the Jehu panel records tribute after 841 BC",
    location: "Nimrud (Kalhu)",
    holding: "British Museum. Found 1846 by Austen Henry Layard.",
    order: -841,
    full_text: `Published English of the caption on the second register:

“The tribute of Jehu, son of Omri: I received from him silver, gold, a golden bowl, a golden vase with pointed bottom, golden tumblers, golden buckets, tin, a staff for a king, and javelins.”

The relief shows a figure prostrate before the Assyrian king. 2 Kings 9–10 names Jehu as king of Israel who destroyed the house of Ahab. The Assyrian text calls him “son of Omri,” using the dynastic name of the kingdom of Israel.`,
  }),
  ev({
    title: "Babylonian Chronicle: capture of Jerusalem (597 BC)",
    evidence_type: "historical_record",
    scripture_reference: "2 Kings 24:10–17; 2 Chronicles 36:9–10; Jeremiah 24; Daniel 1:1–2",
    era: "16 March 597 BC (year 7 of Nebuchadnezzar)",
    location: "Babylon",
    holding: "British Museum, tablet BM 21946 (Jerusalem Chronicle).",
    order: -597,
    full_text: `Published English of the chronicle entry for Nebuchadnezzar’s seventh year:

“In the seventh year, the month of Kislev, the king of Akkad mustered his troops, marched to the Hatti-land, and encamped against the city of Judah and on the second day of the month of Adar he seized the city and captured the king. He appointed there a king of his own choice, received its heavy tribute and sent it to Babylon.”

2 Kings 24:12–17 records Jehoiachin’s surrender, the appointment of Zedekiah, and the carrying away to Babylon.`,
  }),
  ev({
    title: "Jehoiachin ration tablets",
    evidence_type: "historical_record",
    scripture_reference: "2 Kings 25:27–30; Jeremiah 52:31–34",
    era: "c. 592 BC",
    location: "Babylon",
    holding: "Vorderasiatisches Museum, Berlin. Published by Ernst Weidner, 1939.",
    order: -592,
    full_text: `Published English of the Babylonian ration lists:

“10 sila of oil to Ya’u-kīnu, king of the land of Yahudu
2 1/2 sila of oil to the five sons of the king of Yahudu
4 sila to eight men, Judeans, 1/2 each.”

2 Kings 25:27–30 records that Evil-merodach king of Babylon later lifted up the head of Jehoiachin king of Judah from prison and gave him a daily allowance.`,
  }),
  ev({
    title: "Lachish Letters",
    evidence_type: "inscription",
    scripture_reference: "Jeremiah 34:6–7; Jeremiah 6:1; 2 Kings 25",
    era: "c. 589–586 BC",
    location: "Tell ed-Duweir (Lachish)",
    holding: "Israel Museum and British Museum. Ostraca found 1935.",
    order: -588,
    full_text: `Published English of Lachish Letter IV (selected lines):

“And let my lord know that we are watching for the signals of Lachish, according to all the indications which my lord has given, for we cannot see Azekah.”

Jeremiah 34:7: “When the king of Babylon’s army fought against Jerusalem, and against all the cities of Judah that were left, against Lachish, and against Azekah: for these defenced cities remained of the cities of Judah.”`,
  }),
  ev({
    title: "Elephantine papyri (YHW temple)",
    evidence_type: "historical_record",
    scripture_reference: "Ezra 5–6; Nehemiah 8; Deuteronomy 12",
    era: "5th century BC (letter of 407 BC)",
    location: "Elephantine (Yeb), Egypt",
    holding: "Egyptian Museum, Berlin, and Brooklyn Museum. Aramaic papyri of the Judean garrison.",
    order: -407,
    full_text: `Published English of the petition to Bagohi, governor of Judah (Cowley 30 / TAD A4.7), 20 November 407 BC:

“To our lord Bagohi, governor of Judah, your servants Yedoniah and his colleagues the priests who are in the fortress of Yeb. … They entered that temple. They demolished it to the ground. … If it please our lord, let thought be taken for this temple to rebuild it, for they do not let us rebuild it. Look to your well-wishers and friends who are here in Egypt. Let a letter be sent from you to them concerning the temple of YHW the God, to rebuild it in the fortress of Yeb as it was built before.”

The papyri name a temple of YHW on the island, a governor of Judah, and priests in Jerusalem (including Johanan). They are a Persian-period Judean archive in Egypt.`,
  }),
  ev({
    title: "Caiaphas ossuary",
    evidence_type: "artifact",
    scripture_reference: "Matthew 26:3, 57; Luke 3:2; John 11:49; John 18:13–28; Acts 4:6",
    era: "1st century AD",
    location: "Jerusalem (Peace Forest), found 1990",
    holding: "Israel Museum.",
    order: 30,
    full_text: `Published reading of the Aramaic inscription on the ornate ossuary:

“Yehosef bar Qayafa” (Joseph son of Caiaphas).

A second ossuary from the same tomb is published as “Qafa.”

Josephus (Antiquities 18.2.2; 18.4.3) names Joseph called Caiaphas as high priest. The New Testament names Caiaphas as high priest at the trial of Jesus.`,
  }),
  ev({
    title: "Gallio inscription (Delphi)",
    evidence_type: "inscription",
    scripture_reference: "Acts 18:12–17",
    era: "AD 51–52",
    location: "Delphi, Greece",
    holding: "Delphi Archaeological Museum. Claudius’ letter naming Gallio.",
    order: 51,
    full_text: `Published English of the relevant lines of the Delphi inscription of Claudius:

“… [Lucius Ju]nius Gallio, my friend and proconsul [of Achaia] …”

The letter is dated by Claudius’ acclamation number to AD 51/52. Acts 18:12: “And when Gallio was the deputy of Achaia, the Jews made insurrection with one accord against Paul, and brought him to the judgment seat.”`,
  }),
  ev({
    title: "Erastus pavement (Corinth)",
    evidence_type: "inscription",
    scripture_reference: "Romans 16:23; 2 Timothy 4:20",
    era: "1st century AD",
    location: "Corinth, near the theatre",
    holding: "In situ / Corinth excavations. Latin pavement inscription.",
    order: 55,
    full_text: `Published Latin of the pavement:

“ERASTVS PRO AEDILITATE S P STRAVIT”

Published English: “Erastus, in return for his aedileship, laid this pavement at his own expense.”

Romans 16:23: “Gaius mine host, and of the whole church, saluteth you. Erastus the chamberlain of the city saluteth you, and Quartus a brother.”`,
  }),
  ev({
    title: "Theodotus synagogue inscription",
    evidence_type: "inscription",
    scripture_reference: "Acts 6:9; Luke 4:16; Acts 13:14–15",
    era: "1st century BC / 1st century AD (published palaeographic range)",
    location: "Jerusalem, Ophel (found 1913)",
    holding: "Israel Museum / Rockefeller collections.",
    order: 10,
    full_text: `Published English of the Greek inscription:

“Theodotus, son of Vettenus, priest and synagogue-ruler, son of a synagogue-ruler, grandson of a synagogue-ruler, built the synagogue for the reading of the Law and the teaching of the commandments, and the guest-house and the rooms and the water fittings as an inn for those who have need from abroad, which his fathers and the elders and Simonides founded.”

Acts 6:9 names a synagogue of the Libertines, Cyrenians, Alexandrians, and of Cilicia and Asia in Jerusalem.`,
  }),
  ev({
    title: "Pool of Siloam (excavated steps)",
    evidence_type: "archaeological_site",
    scripture_reference: "John 9:7–11; Nehemiah 3:15; Isaiah 8:6",
    era: "Second Temple period pool; excavated 2004",
    location: "City of David, Jerusalem",
    holding: "Israel Antiquities Authority excavations (Eli Shukron, Ronny Reich).",
    order: 30,
    full_text: `Published excavation note: in 2004 a stepped stone pool fed by Hezekiah’s tunnel was uncovered south of the earlier Byzantine pool long shown to visitors. The excavators identified it as the Second Temple period Pool of Siloam.

John 9:7: “And said unto him, Go, wash in the pool of Siloam, (which is by interpretation, Sent.) He went his way therefore, and washed, and came seeing.”`,
  }),
  ev({
    title: "Dead Sea Scrolls (Qumran caves)",
    evidence_type: "scroll",
    scripture_reference: "Isaiah 6–53; Habakkuk 1–2; Psalms; Deuteronomy; Genesis",
    era: "manuscripts copied c. 3rd century BC – 1st century AD; found 1946–1956",
    location: "Qumran and nearby caves, Judaean Desert",
    holding: "Israel Antiquities Authority; Shrine of the Book, Israel Museum. English of many works is stored in this app.",
    order: -150,
    full_text: `The published finds from the Qumran caves include copies of every book of the Hebrew Bible except Esther, plus the Community Rule, War Scroll, Pesher Habakkuk, Thanksgiving Hymns, Temple Scroll, Damascus Document, and many others.

1QIsaᵃ (the Great Isaiah Scroll) is a nearly complete copy of Isaiah. 1QpHab quotes Habakkuk and comments on it. The English of the sectarian works and the King James of the biblical books are readable in this app’s Library.

Radiocarbon and palaeographic dates published by the laboratories and editors place the copies before and around the time of the New Testament, not in the Middle Ages.`,
  }),
  ev({
    title: "Moabite / Israelite names on the Samaria ostraca",
    evidence_type: "inscription",
    scripture_reference: "1 Kings 16:24; 2 Kings 14–15",
    era: "8th century BC",
    location: "Samaria (Sebaste)",
    holding: "Istanbul and Jerusalem collections. Ostraca from the Harvard excavations, 1910.",
    order: -770,
    full_text: `Published readings of the Samaria ostraca record shipments of wine and oil and personal names with the divine element “Yaw” (YHWH), from the capital of the northern kingdom. They are administrative notes, not narrative history. They place Yahwistic names in Samaria in the 8th century BC.`,
  }),
  ev({
    title: "Arad ostraca (House of YHWH)",
    evidence_type: "inscription",
    scripture_reference: "Numbers 6; 1 Kings 12; 2 Kings 23",
    era: "early 6th century BC",
    location: "Tel Arad",
    holding: "Israel Museum. Ostraca from Yohanan Aharoni’s excavations.",
    order: -597,
    full_text: `Published English of Arad Ostracon 18 (selected):

“… to my lord Eliashib: may YHWH seek your welfare. … and as to the matter which you commanded me — it is well; he is in the house of YHWH.”

The ostraca are military supply notes from a Judahite fortress in the Negev, using the name YHWH.`,
  }),
  ev({
    title: "Hezekiah royal bulla",
    evidence_type: "artifact",
    scripture_reference: "2 Kings 18–20; Isaiah 36–39",
    era: "late 8th century BC",
    location: "Ophel, Jerusalem (published 2015)",
    holding: "Eilat Mazar excavations, Ophel. Israel.",
    order: -715,
    full_text: `Published Hebrew of the impression:

“Belonging to Hezekiah [son of] Ahaz, king of Judah.”

A winged sun and ankh-like symbols appear on the seal. 2 Kings 18:1 names Hezekiah the son of Ahaz king of Judah.`,
  }),
  ev({
    title: "Bar-Kokhba letters (Nahal Hever / Wadi Murabbaʿat)",
    evidence_type: "scroll",
    scripture_reference: "— (second-century Judean revolt; not a New Testament event)",
    era: "AD 132–135",
    location: "Judaean Desert caves",
    holding: "Israel Antiquities Authority.",
    order: 132,
    full_text: `Published letters of Simeon bar Kosiba (Bar Kokhba) give orders about supplies, keep the sabbath, and name places in Judea during the revolt against Rome under Hadrian. They are Hebrew, Aramaic, and Greek documents of a later Jewish war, not of the Gospels. They show Hebrew still written as a living administrative language in the second century AD.`,
  }),
  ev({
    title: "Nazareth inscription (imperial edict on tombs)",
    evidence_type: "inscription",
    scripture_reference: "Matthew 28:11–15",
    era: "published as 1st century BC – 1st century AD; marble of unknown find-spot, acquired 1878",
    location: "Unknown (named “Nazareth” from the collection, not a proven excavation)",
    holding: "Bibliothèque nationale de France, Paris.",
    order: 40,
    full_text: `Published English of the Greek imperial edict:

“Ordinance of Caesar. It is my pleasure that graves and tombs remain undisturbed in perpetuity for those who have made them for the cult of their ancestors or children or members of their house. If, however, any man lay information that another has either demolished them, or has in any other way extracted the buried, or has maliciously transferred them to other places in order to wrong them, or has displaced the sealing or other stones, against such a one I order that a trial be instituted … Let it be absolutely forbidden for anyone to disturb them. In case of contravention I desire that the offender be sentenced to capital punishment.”

The stone’s find-spot is not recorded. It is an imperial warning against tomb robbery. Matthew 28 records a claim that the disciples stole the body. This inscription does not name Jesus, Nazareth as a provenience, or that event.`,
  }),
  ev({
    title: "Mount Sodom salt diapir (Jebel Usdum)",
    evidence_type: "geological_record",
    scripture_reference: "Genesis 19:24–26",
    era: "Mapped salt body of the Dead Sea rift",
    location: "Jebel Usdum, south-west of the Dead Sea",
    holding: "Published geology of the Mount Sodom salt diapir. NASA public-domain photograph of the Dead Sea stored in this app.",
    local_image: "/evidence/dead-sea.jpg",
    image_caption: "NASA JPL PIA01916 (public domain): the Dead Sea. Empirical image of the basin that holds the salt mountain.",
    order: -1900,
    verification_note: "Empirical holding: a mapped salt diapir and NASA imagery of the sea. A tourist name for a pillar is not stored as evidence.",
    full_text: `Published geology: Jebel Usdum (Mount Sodom) is a salt diapir on the south-west shore of the Dead Sea. Salt, gypsum, and marl of the basin are mapped.

NASA PIA01916 (public domain, stored here) shows the Dead Sea from space.

Genesis 19:26 names a pillar of salt. That verse is Scripture. It is not a laboratory identification of a particular standing rock.`,
  }),
  ev({
    title: "Bab edh-Dhra and Numeira: excavated burn layers",
    evidence_type: "archaeological_site",
    scripture_reference: "Genesis 19:24–29",
    era: "Early Bronze III destruction; excavated 1960s–1980s",
    location: "Southeastern Dead Sea plain (Jordan)",
    holding: "Walter E. Rast and R. Thomas Schaub, Expedition to the Dead Sea Plain. Published field reports.",
    local_image: "/evidence/dead-sea.jpg",
    image_caption: "NASA public-domain view of the Dead Sea basin in which these excavated towns sit.",
    order: -2500,
    verification_note: "Empirical holding: published ash, burned brick, and cemetery. No inscription from the sites names Sodom.",
    full_text: `Published excavation: Bab edh-Dhra and Numeira show Early Bronze occupation and destruction by fire — ash, burned brick, and a large cemetery at Bab edh-Dhra.

The excavators published the burning. They did not recover a labeled city name matching Genesis 19.`,
  }),
  ev({
    title: "Tutankhamun’s chariots (KV62)",
    evidence_type: "artifact",
    scripture_reference: "Exodus 14:6–9",
    era: "18th Dynasty (c. 14th century BC); tomb opened 1922",
    location: "Valley of the Kings, Egypt",
    holding: "Egyptian Museum, Cairo. Chariots from the tomb of Tutankhamun, published excavation of Howard Carter.",
    order: -1323,
    verification_note: "Empirical holding: New Kingdom chariots in a royal tomb catalog. Not wrecks from a sea crossing.",
    full_text: `Published objects: several complete and fragmentary chariots were found in tomb KV62 and are held in Cairo. They are 18th Dynasty Egyptian war and state vehicles — wood, leather, and gold — from a dated royal burial.

Exodus 14 names Egyptian chariots. These museum chariots establish the vehicle of that kingdom. They are not a find from Yam Suph.`,
  }),
  ev({
    title: "Sinai Peninsula, Gulf of Suez, and Gulf of Aqaba",
    evidence_type: "geological_record",
    scripture_reference: "Exodus 13:18; Exodus 14:2",
    era: "Present landforms; NASA photograph 1984 (41-G)",
    location: "Sinai Peninsula and the two northern gulfs of the Red Sea",
    holding: "NASA 41g-120-180 and ISS iss071e183804, public domain, stored in this app.",
    local_image: "/evidence/sinai-red-sea.jpg",
    image_caption: "NASA public-domain panoramic photograph of the Sinai Peninsula and the Red Sea.",
    order: -1446,
    verification_note: "Empirical holding: measured landforms and NASA photography. No route is marked.",
    full_text: `The Sinai Peninsula lies between the Gulf of Suez and the Gulf of Aqaba. NASA crew photography (stored here) records those three bodies of land and water as they are.

A second NASA ISS frame of the two gulfs is also stored in this app (/evidence/gulf-of-aqaba.jpg).`,
  }),
  ev({
    title: "Deir Alla plaster text (Balaam son of Beor)",
    evidence_type: "inscription",
    scripture_reference: "Numbers 22–24; Deuteronomy 23:4–5; Joshua 24:9–10; Micah 6:5; 2 Peter 2:15; Jude 11",
    era: "c. 800 BC (published palaeographic date of the plaster)",
    location: "Tell Deir Alla, Jordan Valley",
    holding: "Excavated 1967 (Hoftijzer / van der Kooij publication). Fragments in Jordan.",
    order: -800,
    full_text: `Published English of the opening of the Deir Alla plaster inscription:

“This is the warning of the book of Balaam son of Beor. He was a seer of the gods. The gods came to him at night, and he saw a vision like an oracle of El.”

Numbers 22:5: “He sent messengers therefore unto Balaam the son of Beor to Pethor, which is by the river of the land of the children of his people, to call him.”

The inscription is not the Numbers narrative. It names Balaam son of Beor as a seer in a Transjordanian text of the Iron Age.`,
  }),
  ev({
    title: "Ekron royal inscription",
    evidence_type: "inscription",
    scripture_reference: "Joshua 13:3; 1 Samuel 5–6; 2 Kings 1:2; Amos 1:8",
    era: "early 7th century BC",
    location: "Tel Miqne (Ekron)",
    holding: "Israel Museum. Found 1996 in the temple complex.",
    order: -675,
    full_text: `Published English of the Ekron dedication:

“The temple which Achish son of Padi, son of Ysd, son of Ada, son of Ya’ir, ruler of Ekron, built for Ptgyh his lady. May she bless him, and keep him, and prolong his days, and bless his land.”

1 Samuel 5:10: “Therefore they sent the ark of God to Ekron. And it came to pass, as the ark of God came to Ekron, that the Ekronites cried out, saying, They have brought about the ark of the God of Israel to us, to slay us and our people.”

The stone names Ekron and a ruler Achish (Ikausu), a name also used of a Philistine king in 1 Samuel 21; 27. It does not narrate the ark.`,
  }),
  ev({
    title: "Nabonidus cylinder and Belshazzar as king’s son in Babylon",
    evidence_type: "inscription",
    scripture_reference: "Daniel 5; Daniel 7:1; Daniel 8:1",
    era: "mid-6th century BC (Nabonidus, last king of Babylon)",
    location: "Ur / Babylonian sites",
    holding: "British Museum and other collections. Cylinders of Nabonidus; Verse Account of Nabonidus.",
    order: -553,
    full_text: `Published situation of the tablets: Nabonidus is the last native king of Babylon in the cuneiform king lists. His son Bel-sharra-usur (Belshazzar) is named in the Verse Account and in administrative texts as the king’s son who remained in Babylon while Nabonidus was in Tema.

Daniel 5:1: “Belshazzar the king made a great feast to a thousand of his lords, and drank wine before the thousand.”

Daniel calls Belshazzar king at the fall of the city. The cuneiform record calls Nabonidus king and Belshazzar the son exercising authority in the city. Both names are in the published record. This app quotes both. It does not flatten them into one office.`,
  }),
  ev({
    title: "Shishak / Shoshenq I at Karnak (Bubastite Portal)",
    evidence_type: "inscription",
    scripture_reference: "1 Kings 14:25–26; 2 Chronicles 12:2–9",
    era: "c. 925 BC (campaign of Shoshenq I)",
    location: "Karnak, Thebes, Egypt",
    holding: "Relief still on the Bubastite Portal, Karnak. Published drawings of the name-rings.",
    order: -925,
    full_text: `Published English of 1 Kings 14:25–26: “And it came to pass in the fifth year of king Rehoboam, that Shishak king of Egypt came up against Jerusalem: And he took away the treasures of the house of the LORD, and the treasures of the king’s house; he even took away all: and he took away all the shields of gold which Solomon had made.”

The Karnak relief of Shoshenq I lists towns in a Levantine campaign. Jerusalem is not clearly preserved among the surviving name-rings. Towns in the Negev and the hill country appear in the published lists. The relief is a real Egyptian campaign record of that king. It is not a line-by-line copy of 1 Kings 14.`,
  }),
];

export const SCIENCE = [
  sci({
    title: "USGS: the water cycle",
    scientific_field: "Hydrology",
    scripture_reference: "Ecclesiastes 1:7; Job 36:27–28; Amos 5:8",
    publication: "U.S. Geological Survey, Water Science School (public-domain U.S. government text)",
    date: "USGS public domain",
    full_text: `USGS (public domain): “The water cycle describes how water evaporates from the surface of the earth, rises into the atmosphere, cools and condenses into rain or snow in clouds, and falls again to the surface as precipitation. … Water is always on the move.”

Ecclesiastes 1:7: “All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.”

Job 36:27–28: “For he maketh small the drops of water: they pour down rain according to the vapour thereof: Which the clouds do drop and distil upon man abundantly.”

The USGS describes the modern measured cycle. This app does not add a verdict.`,
  }),
  sci({
    title: "NOAA: hydrothermal vents (springs of the sea)",
    scientific_field: "Oceanography",
    scripture_reference: "Job 38:16; Genesis 7:11; Proverbs 8:24–28",
    publication: "NOAA Ocean Exploration (U.S. government, public domain)",
    date: "NOAA public domain",
    full_text: `NOAA (public domain): “Hydrothermal vents are like geysers, or hot springs, on the ocean floor. Along mid-ocean ridges where tectonic plates spread apart, magma rises and heats seawater that has seeped into the crust. The superheated water then rises and vents at the seafloor, carrying dissolved minerals.”

Job 38:16: “Hast thou entered into the springs of the sea? or hast thou walked in the search of the depth?”

Genesis 7:11: “the same day were all the fountains of the great deep broken up, and the windows of heaven were opened.”

NOAA describes measured seafloor springs. This app does not decide the meaning of Job or Genesis.`,
  }),
  sci({
    title: "NASA: Earth as a globe",
    scientific_field: "Astronomy",
    scripture_reference: "Isaiah 40:22; Job 26:7; Luke 17:34–36",
    publication: "NASA Earth Observatory / NASA public-domain imagery notes",
    date: "NASA public domain",
    full_text: `NASA (public domain): Earth is an oblate spheroid. Photographs from Apollo and later spacecraft show the whole disk of Earth. Gravity holds the oceans to a curved surface.

Isaiah 40:22: “It is he that sitteth upon the circle of the earth, and the inhabitants thereof are as grasshoppers; that stretcheth out the heavens as a curtain, and spreadeth them out as a tent to dwell in.”

Job 26:7: “He stretcheth out the north over the empty place, and hangeth the earth upon nothing.”

The Hebrew word in Isaiah 40:22 is chug (circle/circuit). This app quotes the verse and the NASA description side by side. It does not decide a later scientific reading for the prophet.`,
  }),
  sci({
    title: "NIH / anatomy: the life of the flesh is in the blood",
    scientific_field: "Medicine",
    scripture_reference: "Leviticus 17:11; Genesis 9:4; Deuteronomy 12:23",
    publication: "U.S. National Institutes of Health / National Library of Medicine (public-domain summaries)",
    date: "NIH public domain",
    full_text: `NIH / NLM (public-domain medical summary): Blood carries oxygen and nutrients to tissues, removes carbon dioxide and wastes, and is required for life. Loss of blood volume causes death. Blood cells and plasma perform immune and clotting functions.

Leviticus 17:11: “For the life of the flesh is in the blood: and I have given it to you upon the altar to make an atonement for your souls: for it is the blood that maketh an atonement for the soul.”

The statute is sacrificial. The medical description is about circulation. This app does not collapse the two into one claim.`,
  }),
  sci({
    title: "CDC: isolation of disease",
    scientific_field: "Public health",
    scripture_reference: "Leviticus 13–15; Numbers 5:1–4",
    publication: "U.S. Centers for Disease Control and Prevention (public-domain guidance language)",
    date: "CDC public domain",
    full_text: `CDC (public domain): Isolation separates people who have a contagious disease from people who are not sick. Quarantine separates people who were exposed to a contagious disease to see if they become sick.

Leviticus 13:46: “All the days wherein the plague shall be in him he shall be defiled; he is unclean: he shall dwell alone; without the camp shall his habitation be.”

The Mosaic chapters concern ritual uncleanness and skin disease. CDC language concerns modern infection control. This app quotes both. It does not claim Leviticus is a modern medical manual.`,
  }),
  sci({
    title: "Published radiocarbon ranges for Qumran manuscripts",
    scientific_field: "Archaeometry",
    scripture_reference: "Isaiah 1–66; Habakkuk 1–2",
    publication: "Radiocarbon measurements reported in the official editions and in Bonani et al. / Jull et al. laboratory publications",
    date: "1991–1995 laboratory reports",
    full_text: `Published laboratory work on Qumran samples (Zurich ETH and Arizona AMS, among others) placed many of the tested manuscripts in a range from about the third century BC to the first century AD, consistent with the palaeographic dates assigned by the editors.

These are measured ages of the parchment and linen, not a verdict on inspiration. The English of Isaiah and of Pesher Habakkuk can be read in this app.`,
  }),
  sci({
    title: "Jericho: published excavation conclusions (Garstang and Kenyon)",
    scientific_field: "Archaeology",
    scripture_reference: "Joshua 6",
    publication: "John Garstang, 1930s field reports; Kathleen Kenyon, Digging Up Jericho (1957) and excavation volumes",
    date: "1930–1958",
    full_text: `Garstang published that City IV at Jericho was destroyed in the Late Bronze Age and associated that destruction with Joshua. Kenyon later published that the destruction she dated belonged to the end of the Early Bronze / Intermediate period and that the Late Bronze city was small or poorly preserved; she dated a collapse to about 1550 BC.

Joshua 6 describes the fall of Jericho’s wall. The two published excavation accounts do not agree on the date of the relevant destruction. This app stores both conclusions. It does not pick one.`,
  }),
  sci({
    title: "USGS: mid-ocean ridges and the deep",
    scientific_field: "Geology",
    scripture_reference: "Jonah 2:3–6; 2 Samuel 22:16; Psalm 18:15",
    publication: "U.S. Geological Survey (public domain)",
    date: "USGS public domain",
    full_text: `USGS (public domain): Mid-ocean ridges are underwater mountain chains formed where tectonic plates separate and new seafloor is created. The ocean floor has canyons, plains, and volcanic ridges.

Jonah 2:5–6: “The waters compassed me about, even to the soul: the depth closed me round about, the weeds were wrapped about my head. I went down to the bottoms of the mountains; the earth with her bars was about me for ever.”

The psalm and Jonah are prayers. USGS describes measured seafloor topography. This app does not turn the prayer into a geology paper.`,
  }),
  sci({
    title: "NOAA: ocean currents",
    scientific_field: "Oceanography",
    scripture_reference: "Psalm 8:8; Psalm 107:23–25; Isaiah 43:16",
    publication: "NOAA (U.S. government, public domain)",
    date: "NOAA public domain",
    full_text: `NOAA (public domain): Ocean currents are continuous, directed movements of seawater generated by wind, the Coriolis effect, breaking waves, temperature and salinity, and tides. The global conveyor moves water between ocean basins.

Psalm 8:8: “The fowl of the air, and the fish of the sea, and whatsoever passeth through the paths of the seas.”

NOAA describes measured currents. This app quotes the psalm beside that description.`,
  }),
  sci({
    title: "NASA: expansion of space (Hubble–Lemaître)",
    scientific_field: "Astronomy",
    scripture_reference: "Isaiah 42:5; Isaiah 45:12; Jeremiah 10:12",
    publication: "NASA / Hubble Site public-domain explanations of measured redshift",
    date: "NASA public domain",
    full_text: `NASA (public domain explanation of the measured fact): Distant galaxies show redshift. The farther the galaxy, the greater the redshift. Space between bound systems is expanding.

Isaiah 42:5: “Thus saith God the LORD, he that created the heavens, and stretched them out; he that spread forth the earth, and that which cometh out of it.”

The prophet’s wording is “stretched them out.” NASA describes a 20th-century measurement. This app does not declare that Isaiah is a cosmology textbook.`,
  }),
  sci({
    title: "USGS: marine fossils in rocks now high above the sea",
    scientific_field: "Geology",
    scripture_reference: "Genesis 7:17–20; Genesis 8:3–5; Psalm 104:6–9; Job 12:8",
    publication: "U.S. Geological Survey (public-domain education on sedimentary rocks, marine fossils, and uplift)",
    date: "USGS public domain",
    local_image: "/evidence/himalayas.jpg",
    image_caption: "NASA ISS public-domain photograph of the Himalayas and Mount Everest, whose marine limestone is a published Tethyan deposit.",
    verification_note: "Empirical holding: marine fossils in uplifted sedimentary rock, as published by geological surveys.",
    full_text: `USGS (public-domain teaching): Sedimentary rock forms from sediment. Marine fossils are remains of sea life buried in those sediments. Mountain belts have been raised, so marine beds now stand far above present sea level. Tethyan marine sediments are mapped in the Himalaya. Western Interior Seaway marine fossils are mapped in the high country of western North America.

Fish bones and shells in mountain rock are a measured fact. The stored NASA photograph is the Himalaya range, not a photograph of a single fossil bed.`,
  }),
  sci({
    title: "Salt, gypsum, sulfur, and bitumen of the Dead Sea rift",
    scientific_field: "Geology",
    scripture_reference: "Genesis 14:10; Genesis 19:24–28",
    publication: "Published basin geology of the Dead Sea; NASA public-domain imagery",
    date: "NASA / published Dead Sea geology",
    local_image: "/evidence/dead-sea.jpg",
    image_caption: "NASA public-domain photograph of the Dead Sea, the basin of these mapped minerals.",
    verification_note: "Empirical holding: mapped salt, gypsum, native sulfur, and bitumen seeps. Not a labeled brimstone event.",
    full_text: `Published geology of the Dead Sea rift: thick salt (including Mount Sodom), gypsum, occurrences of native sulfur, and bitumen / oil seeps in the plain.

The NASA photograph stored here is the sea itself. Burned town layers on the eastern plain are a separate excavated record (Bab edh-Dhra, Numeira).`,
  }),
];

export const GOVERNMENT = [
  gov({
    title: "Balfour Declaration (2 November 1917)",
    document_type: "published_document",
    agency: "British Foreign Office",
    country: "United Kingdom",
    scripture_reference: "Ezekiel 36–37; Isaiah 11:11–12",
    date: "1917-11-02",
    full_text: `Foreign Office
November 2nd, 1917

Dear Lord Rothschild,

I have much pleasure in conveying to you, on behalf of His Majesty's Government, the following declaration of sympathy with Jewish Zionist aspirations which has been submitted to, and approved by, the Cabinet.

“His Majesty's Government view with favour the establishment in Palestine of a national home for the Jewish people, and will use their best endeavours to facilitate the achievement of this object, it being clearly understood that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities in Palestine, or the rights and political status enjoyed by Jews in any other country.”

I should be grateful if you would bring this declaration to the knowledge of the Zionist Federation.

Yours sincerely,
Arthur James Balfour

This is a British government letter. This app does not decide prophecy.`,
  }),
  gov({
    title: "Truman recognition of the State of Israel (14 May 1948)",
    document_type: "published_document",
    agency: "President of the United States",
    country: "United States",
    scripture_reference: "Ezekiel 37; Isaiah 66:8",
    date: "1948-05-14",
    full_text: `This Government has been informed that a Jewish state has been proclaimed in Palestine, and recognition has been requested by the provisional government thereof.

The United States recognizes the provisional government as the de facto authority of the new State of Israel.

Harry Truman
Approved May 14, 1948

Released as a White House statement the same day the provisional government declared independence. This app stores the government wording. It does not add a prophetic verdict.`,
  }),
  gov({
    title: "United Nations General Assembly Resolution 181 (II) — excerpt",
    document_type: "published_document",
    agency: "United Nations General Assembly",
    country: "United Nations",
    scripture_reference: "Ezekiel 37",
    date: "1947-11-29",
    full_text: `Resolution 181 (II), 29 November 1947 (excerpt of the adopted plan):

“The General Assembly, … Recommends to the United Kingdom, as the mandatory Power for Palestine, and to all other Members of the United Nations the adoption and implementation, with regard to the future government of Palestine, of the Plan of Partition with Economic Union set out below; …”

The plan provided for an Arab State, a Jewish State, and a Special International Regime for the City of Jerusalem. This is a UN resolution. This app does not decide prophecy.`,
  }),
  gov({
    title: "Pliny the Younger to Trajan on the Christians (Letters 10.96–97)",
    document_type: "published_document",
    agency: "Imperial Roman provincial government (Bithynia-Pontus)",
    country: "Roman Empire",
    scripture_reference: "Acts 11:26; 1 Peter 4:16; Revelation 1:9",
    date: "c. AD 112",
    full_text: `Pliny to the Emperor Trajan (published English of the Whiston-era / Loeb public-domain sense):

“It is my custom, Sir, to refer to you all matters concerning which I am in doubt. … I have never been present at any trials of the Christians. … Meanwhile, in the case of those who were denounced to me as Christians, I have observed the following procedure. I interrogated them whether they were Christians; if they confessed I interrogated them a second and a third time, threatening them with punishment; if they persisted, I ordered them to be executed. … They asserted, however, that the sum and substance of their fault or error had been that they were accustomed to meet on a fixed day before dawn and sing a hymn to Christ as to a god, and to bind themselves by oath, not to some crime, but not to commit theft, robbery, or adultery, not to break their word, … After this they had used to depart and then reassemble to partake of food — but food of an ordinary and innocent kind.”

Trajan’s reply: “You have followed the right course of procedure, my dear Pliny. … They are not to be sought out; if they are denounced and proved guilty, they are to be punished, with this reservation, that whoever denies that he is a Christian and really proves it — that is, by worshipping our gods — even though he was under suspicion in the past, shall obtain pardon through repentance.”`,
  }),
  gov({
    title: "Tacitus, Annals 15.44 (Neronian persecution)",
    document_type: "historical_record",
    agency: "Roman senatorial history (official imperial narrative of Nero’s reign)",
    country: "Roman Empire",
    scripture_reference: "Acts 18:2; Romans 13; 1 Peter 4:12–16",
    date: "written c. AD 116; event AD 64",
    full_text: `Published English (Church and Brodribb, public domain):

“Consequently, to get rid of the report, Nero fastened the guilt and inflicted the most exquisite tortures on a class hated for their abominations, called Christians by the populace. Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of one of our procurators, Pontius Pilatus, and a most mischievous superstition, thus checked for the moment, again broke out not only in Judaea, the first source of the evil, but even in Rome, where all things hideous and shameful from every part of the world find their centre and become popular.”

Tacitus is a Roman historian writing of Nero. He names Christus, Tiberius, and Pontius Pilatus. This app quotes him. It does not add Church commentary.`,
  }),
  gov({
    title: "Edict of Milan (AD 313) — Lactantius text",
    document_type: "published_document",
    agency: "Constantine and Licinius",
    country: "Roman Empire",
    scripture_reference: "— (later imperial policy toward the churches)",
    date: "AD 313",
    full_text: `Lactantius, On the Deaths of the Persecutors 48 (public-domain English):

“When we, Constantine and Licinius, emperors, had an interview at Milan, … we thought that, among those things that are profitable to mankind in general, the reverence paid to the Divinity merited our first and chief attention, and that it was proper that the Christians and all others should have liberty to follow that mode of religion which to each of them appeared best; so that that God, who is seated in heaven, might be benign and propitious to us, and to every one under our government.”`,
  }),
];

export const VATICAN = [
  vat({
    title: "Codex Vaticanus (Vat. gr. 1209)",
    document_type: "manuscript",
    evidence_type: "manuscript",
    agency: "Biblioteca Apostolica Vaticana",
    country: "Holy See",
    scripture_reference: "Matthew 1–28; Mark 1:1–16:8; John 1–21",
    date: "4th century manuscript; held in the Vatican Library",
    verification_note: "Empirical holding: a catalogued 4th-century parchment Bible. Not a doctrinal decree.",
    full_text: `Published description of Codex Vaticanus Graecus 1209:

A 4th-century Greek uncial Bible on parchment, kept in the Vatican Library. It contains most of the Greek Old Testament (Septuagint order) and the New Testament through Hebrews 9:14. The Pastoral Epistles, Philemon, and Revelation are absent from the surviving leaves. Mark ends at 16:8 in this copy. John 7:53–8:11 is absent.

This is a physical manuscript in a published library catalog. Papal bulls and conciliar canons are not stored in this archive.`,
  }),
];

export const MODERN = [
  mod({
    title: "Proclamation of the State of Israel (14 May 1948)",
    fulfillment_type: "historical_event",
    scripture_reference: "Ezekiel 37; Isaiah 66:8",
    prophecy_reference: "Ezekiel 37; Isaiah 66:8",
    modern_date: "1948-05-14",
    location: "Tel Aviv",
    date: "1948-05-14",
    full_text: `Published English of the opening of the Declaration of the Establishment of the State of Israel (14 May 1948):

“The Land of Israel was the birthplace of the Jewish people. Here their spiritual, religious and political identity was shaped. Here they first attained to statehood, created cultural values of national and universal significance and gave to the world the eternal Book of Books. … Accordingly we, members of the People’s Council, representatives of the Jewish Community of Eretz-Israel and of the Zionist Movement, … hereby declare the establishment of a Jewish state in Eretz-Israel, to be known as the State of Israel.”

The United States recognition of the same day is stored under Government documents. This app quotes the published declaration. It does not add a prophetic verdict.`,
  }),
  mod({
    title: "Balfour Declaration stored as a dated state paper",
    fulfillment_type: "historical_event",
    scripture_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    prophecy_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    modern_date: "1917-11-02",
    location: "London",
    date: "1917-11-02",
    full_text: `The full letter of 2 November 1917 is stored under Government documents in this app (Balfour to Lord Rothschild). It is a British Cabinet-approved declaration concerning a national home for the Jewish people in Palestine, with a clause protecting the civil and religious rights of existing non-Jewish communities.`,
  }),
];

export const ALL_ARCHIVE = [...ARCHAEOLOGY, ...SCIENCE, ...GOVERNMENT, ...VATICAN, ...MODERN];

export function archiveByKind(kind) {
  if (kind === "archaeology") return ARCHAEOLOGY;
  if (kind === "science") return SCIENCE;
  if (kind === "government") return [...GOVERNMENT, ...VATICAN];
  if (kind === "vatican") return VATICAN;
  if (kind === "modern") return MODERN;
  return ALL_ARCHIVE;
}

export function searchArchive(query, kind) {
  const q = String(query || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const pool = archiveByKind(kind);
  if (!q) return pool;
  const words = q.split(" ").filter((w) => w.length > 2);
  return pool.filter((item) => {
    const hay = `${item.title} ${item.full_text} ${item.scripture_reference} ${item.holding} ${item.agency}`.toLowerCase();
    if (hay.includes(q)) return true;
    return words.every((w) => hay.includes(w));
  });
}
