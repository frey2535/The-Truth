/**
 * Dated public records, ongoing measurements, and present conditions
 * stored beside restoration and latter-day passages.
 * This is not a fulfillment verdict and not a date-setting chart.
 */

const NOTICE =
  "This app stores the dated public record beside the verse. It does not declare that the prophecy is fulfilled.";

function redWater(fields) {
  return {
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "disputed_identification",
    scripture_reference: "Exodus 7:20–21; Revelation 16:4",
    prophecy_reference: "Exodus 7:20–21; Revelation 16:4",
    verification_note: NOTICE,
    ...fields,
  };
}

export const PROPHECY_WATCH = [
  // ——— Dated events ———
  {
    title: "Balfour Declaration (2 November 1917)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    prophecy_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    modern_date: "1917-11-02",
    location: "London",
    date: "1917-11-02",
    local_image: "/evidence/prophecy/balfour.jpg",
    image_caption:
      "Photograph of the Balfour Declaration letter of 2 November 1917. British Cabinet-approved state paper. Public-domain scan.",
    source_url: "https://www.nationalarchives.gov.uk/",
    verification_note: NOTICE,
    full_text: `King James, Ezekiel 36:24: “For I will take you from among the heathen, and gather you out of all countries, and will bring you into your own land.”

Isaiah 11:12: “And he shall set up an ensign for the nations, and shall assemble the outcasts of Israel, and gather together the dispersed of Judah from the four corners of the earth.”

Published wording of the British Foreign Office letter to Lord Rothschild, 2 November 1917 (full letter stored under State papers):

“His Majesty's Government view with favour the establishment in Palestine of a national home for the Jewish people, and will use their best endeavours to facilitate the achievement of this object, it being clearly understood that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities in Palestine, or the rights and political status enjoyed by Jews in any other country.”

This is a Cabinet-approved British letter. It is not a biblical decree. Readers set it beside the gathering texts. This app does not decide prophecy.`,
  },
  {
    title: "League of Nations Mandate for Palestine (24 July 1922)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    prophecy_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    modern_date: "1922-07-24",
    location: "Geneva / London",
    date: "1922-07-24",
    local_image: "/evidence/prophecy/mandate.jpg",
    image_caption:
      "Published map of the Mandate for Palestine and Trans-Jordan, 1923. Catalogued plate of the League land named in the 1922 paper.",
    source_url: "https://avalon.law.yale.edu/20th_century/palmanda.asp",
    verification_note: NOTICE,
    full_text: `The Mandate (League of Nations, 24 July 1922) put the Balfour policy into an international instrument. Article 2 (published English):

“The Mandatory shall be responsible for placing the country under such political, administrative and economic conditions as will secure the establishment of the Jewish national home, as laid down in the preamble, and the development of self-governing institutions, and also for safeguarding the civil and religious rights of all the inhabitants of Palestine, irrespective of race and religion.”

Article 4 recognized a Jewish agency. Article 6 required the Administration to facilitate Jewish immigration and close settlement on the land, while ensuring that the rights and position of other sections of the population were not prejudiced.

This is a League of Nations mandate text. The full excerpt is also stored under State papers. This app does not decide prophecy.`,
  },
  {
    title: "United Nations Resolution 181 (II) — 29 November 1947",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 37:21–22",
    prophecy_reference: "Ezekiel 37:21–22",
    modern_date: "1947-11-29",
    location: "Flushing Meadows, New York",
    date: "1947-11-29",
    local_image: "/evidence/prophecy/un-181.jpg",
    image_caption:
      "Published 1947 UN partition plan for Palestine, the map attached to Resolution 181 (II). Not a photograph of the voting hall.",
    source_url: "https://www.un.org/unispal/",
    verification_note: NOTICE,
    full_text: `King James, Ezekiel 37:21–22: “Behold, I will take the children of Israel from among the heathen, whither they be gone, and will gather them on every side, and bring them into their own land: And I will make them one nation in the land upon the mountains of Israel.”

UN General Assembly Resolution 181 (II), 29 November 1947 (excerpt stored in full under State papers):

“The General Assembly … Recommends to the United Kingdom, as the mandatory Power for Palestine, and to all other Members of the United Nations the adoption and implementation, with regard to the future government of Palestine, of the Plan of Partition with Economic Union set out below.”

The adopted plan provided for an Arab State, a Jewish State, and a Special International Regime for the City of Jerusalem. The vote is a dated UN act. This app does not decide prophecy.`,
  },
  {
    title: "Proclamation of the State of Israel (14 May 1948)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 37:21–22; Isaiah 66:8",
    prophecy_reference: "Ezekiel 37:21–22; Isaiah 66:8",
    modern_date: "1948-05-14",
    location: "Tel Aviv",
    date: "1948-05-14",
    local_image: "/evidence/prophecy/israel-independence.jpg",
    image_caption:
      "14 May 1948: David Ben-Gurion reads the Declaration of the Establishment of the State of Israel in the Tel Aviv Museum (Independence Hall). Government Press Office of Israel photograph.",
    source_url: "https://www.mfa.gov.il/",
    verification_note: NOTICE,
    full_text: `King James, Isaiah 66:8: “Who hath heard such a thing? who hath seen such things? Shall the earth be made to bring forth in one day? or shall a nation be born at once? for as soon as Zion travailed, she brought forth her children.”

Ezekiel 37:21: “I will take the children of Israel from among the heathen … and bring them into their own land.”

Published English of the opening of the Declaration of the Establishment of the State of Israel (14 May 1948):

“The Land of Israel was the birthplace of the Jewish people. Here their spiritual, religious and political identity was shaped. Here they first attained to statehood, created cultural values of national and universal significance and gave to the world the eternal Book of Books. … Accordingly we, members of the People’s Council, representatives of the Jewish Community of Eretz-Israel and of the Zionist Movement, … hereby declare the establishment of a Jewish state in Eretz-Israel, to be known as the State of Israel.”

The United States recognition of the same day is stored under State papers. Isaiah 66:8 is a travail-and-birth text about Zion. Readers set the dated proclamation beside it. This app does not add a prophetic verdict.`,
  },
  {
    title: "Truman recognition of Israel (14 May 1948)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 37:21–22; Isaiah 66:8",
    prophecy_reference: "Ezekiel 37:21–22; Isaiah 66:8",
    modern_date: "1948-05-14",
    location: "Washington, D.C.",
    date: "1948-05-14",
    local_image: "/evidence/prophecy/truman-israel.jpg",
    image_caption:
      "Harry S. Truman, 1945 official portrait (NARA, public domain). The recognition statement of 14 May 1948 is quoted below; a scan of the signed slip is not stored.",
    source_url: "https://www.trumanlibrary.gov/",
    verification_note: NOTICE,
    full_text: `Released as a White House statement the same day the provisional government declared independence (full text stored under State papers):

“This Government has been informed that a Jewish state has been proclaimed in Palestine, and recognition has been requested by the provisional government thereof.

The United States recognizes the provisional government as the de facto authority of the new State of Israel.

Harry Truman
Approved May 14, 1948”

This is a U.S. presidential act. This app quotes the government wording. It does not add a prophetic verdict.`,
  },
  {
    title: "Israel Law of Return (5 July 1950)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Ezekiel 36:24; Jeremiah 31:10; Isaiah 11:12",
    prophecy_reference: "Ezekiel 36:24; Jeremiah 31:10; Isaiah 11:12",
    modern_date: "1950-07-05",
    location: "Jerusalem (Knesset)",
    date: "1950-07-05",
    local_image: "/evidence/prophecy/law-of-return.jpg",
    image_caption:
      "Yemenite olim at registration after arrival. Catalogued PikiWiki photograph of the gathering the 1950 Law of Return later named in statute.",
    source_url: "https://www.knesset.gov.il/laws/special/eng/return.htm",
    verification_note: NOTICE,
    full_text: `King James, Ezekiel 36:24: “For I will take you from among the heathen, and gather you out of all countries, and will bring you into your own land.”

Jeremiah 31:10: “Hear the word of the LORD, O ye nations, and declare it in the isles afar off, and say, He that scattered Israel will gather him, and keep him, as a shepherd doth his flock.”

Published English of the Law of Return, 5710–1950, section 1:

“Every Jew has the right to come to this country as an oleh.”

Section 2 defines an oleh’s visa. Later amendments (1970) defined who is a Jew for the purpose of the law and extended rights to children and grandchildren. The statute is still in force. The gathering texts are older. This app stores both. It does not declare fulfillment.`,
  },
  {
    title: "Hebrew restored as a public spoken language",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established_contextual",
    scripture_reference: "Zephaniah 3:9; Jeremiah 31:23; Nehemiah 13:24",
    prophecy_reference: "Zephaniah 3:9; Jeremiah 31:23",
    modern_date: "1922–1948",
    location: "Land of Israel",
    date: "1922-07-24",
    local_image: "/evidence/prophecy/hebrew.jpg",
    image_caption:
      "Eliezer Ben-Yehuda (1858–1922), whose dictionaries and language work stand behind the modern revival of spoken Hebrew. Public-domain portrait.",
    source_url: "https://hebrew-academy.org.il/",
    verification_note:
      "Empirical holding: Hebrew is again a living public language. Zephaniah 3:9 (“a pure language”) is often applied here and is disputed. This app does not fix that identification.",
    full_text: `King James, Zephaniah 3:9: “For then will I turn to the people a pure language, that they may all call upon the name of the LORD, to serve him with one consent.”

Jeremiah 31:23: “Thus saith the LORD of hosts, the God of Israel; As yet they shall use this speech in the land of Judah and in the cities thereof, when I shall bring again their captivity.”

Dated public facts: under the 1922 Mandate, English, Arabic, and Hebrew were official languages. The Academy of the Hebrew Language continues the language committee begun in Ben-Yehuda’s generation. From 1948 Hebrew has been the principal public language of the State of Israel — courts, schools, newspapers, and the street.

What is established is the language revival. What is not established is that Zephaniah’s “pure language” is modern Hebrew. Some readers apply it; others read a future, worldwide confession. This app stores the dated fact beside the verse. It does not decide the identification.`,
  },
  {
    title: "Jerusalem Old City taken in the Six-Day War (7 June 1967)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Luke 21:24; Zechariah 8:7–8; Zechariah 12:2–3",
    prophecy_reference: "Luke 21:24; Zechariah 8:7–8; Zechariah 12:2–3",
    modern_date: "1967-06-07",
    location: "Jerusalem",
    date: "1967-06-07",
    local_image: "/evidence/prophecy/western-wall.jpg",
    image_caption:
      "The Western Wall in the Old City of Jerusalem, the remaining Herodian retaining wall of the Temple Mount. Catalogued site photograph.",
    source_url: "https://www.un.org/securitycouncil/content/resolutions-0",
    verification_note: NOTICE,
    full_text: `King James, Luke 21:24: “And they shall fall by the edge of the sword, and shall be led away captive into all nations: and Jerusalem shall be trodden down of the Gentiles, until the times of the Gentiles be fulfilled.”

Zechariah 8:7–8: “Behold, I will save my people from the east country, and from the west country; And I will bring them, and they shall dwell in the midst of Jerusalem.”

Dated public facts: from 1948 to 1967 the Old City and the Western Wall were under Jordanian administration; Jews were barred from the Wall. On 7 June 1967 Israeli forces entered the Old City during the Six-Day War. The Temple Mount itself was left under the Islamic waqf for worship. UN Security Council Resolution 242 (22 November 1967) later called for withdrawal from territories occupied in the conflict and for acknowledgment of every state in the area to live in peace — excerpt stored under State papers.

Luke 21:24 is a first-century word of Jesus about Jerusalem trodden down “until.” Readers debate whether 1967 ends that “until,” only changes who holds the city, or is not the meaning at all. The war and the change of administration are dated facts. This app does not close the “until.”`,
  },
  {
    title: "Ethiopian Jewish airlifts (Operations Moses and Solomon)",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established",
    scripture_reference: "Isaiah 11:11–12; Zephaniah 3:10",
    prophecy_reference: "Isaiah 11:11–12; Zephaniah 3:10",
    modern_date: "1984–1991",
    location: "Ethiopia / Sudan / Israel",
    date: "1991-05-24",
    local_image: "/evidence/prophecy/ethiopian-aliyah.jpg",
    image_caption:
      "Beta Israel arriving in Israel. Government Press Office photograph of the Ethiopian gathering named in Operations Moses and Solomon.",
    source_url: "https://www.gov.il/",
    verification_note: NOTICE,
    full_text: `King James, Isaiah 11:11: “And it shall come to pass in that day, that the Lord shall set his hand again the second time to recover the remnant of his people, which shall be left, from Assyria, and from Egypt, and from Pathros, and from Cush, and from Elam, and from Shinar, and from Hamath, and from the islands of the sea.”

Zephaniah 3:10: “From beyond the rivers of Ethiopia my suppliants, even the daughter of my dispersed, shall bring mine offering.”

Dated public facts: Operation Moses (late 1984–early 1985) brought Beta Israel out of Sudanese camps. Operation Solomon (24–25 May 1991) airlifted more than fourteen thousand Ethiopian Jews from Addis Ababa to Israel in about thirty-six hours — a published Israeli government and press record.

Cush in the prophets is the Nile-south region later called Ethiopia. The airlifts are a dated gathering from that region. Isaiah 11:11 lists many lands, not Ethiopia only. This app stores the Cush line beside the airlift record. It does not declare the “second time” finished.`,
  },
  {
    title: "Gathering from the north — post-Soviet aliyah",
    fulfillment_type: "historical_event",
    watch_stage: "dated_event",
    evidence_status: "established_contextual",
    scripture_reference: "Jeremiah 16:14–15; Jeremiah 23:7–8; Isaiah 11:12",
    prophecy_reference: "Jeremiah 16:14–15; Jeremiah 23:7–8",
    modern_date: "1989–2001",
    location: "Former Soviet Union / Israel",
    date: "1990",
    local_image: "/evidence/prophecy/soviet-aliyah.jpg",
    image_caption:
      "New immigrants from the Soviet Union at Lod airport. Catalogued photograph of the post-Soviet aliyah wave.",
    source_url: "https://www.cbs.gov.il/",
    verification_note: NOTICE,
    full_text: `King James, Jeremiah 16:14–15: “Therefore, behold, the days come, saith the LORD, that it shall no more be said, The LORD liveth, that brought up the children of Israel out of the land of Egypt; But, The LORD liveth, that brought up the children of Israel from the land of the north, and from all the lands whither he had driven them: and I will bring them again into their land that I gave unto their fathers.”

Dated public facts: after the Soviet exit gates opened (from 1989) and the USSR dissolved (1991), more than a million people from the former Soviet Union immigrated to Israel under the Law of Return — a published Central Bureau of Statistics series.

Jeremiah’s “land of the north” in the sixth century named the Mesopotamian/Babylonian axis more than Moscow. Many readers still set the 1990s wave beside the verse because it was the largest modern movement from the north. The census numbers are established. The geographic identification is contextual. This app does not collapse them into one verdict.`,
  },

  // ——— In process ———
  {
    title: "Ongoing return under the Law of Return",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established",
    scripture_reference: "Ezekiel 36:24; Ezekiel 37:21; Isaiah 11:12; Jeremiah 30:3",
    prophecy_reference: "Ezekiel 36:24; Ezekiel 37:21; Isaiah 11:12; Jeremiah 30:3",
    modern_date: "1950–present",
    location: "Israel",
    date: "1950-07-05",
    local_image: "/evidence/prophecy/ongoing-aliyah.jpg",
    image_caption:
      "Ben Gurion Airport arrivals hall, the public gate of continuing aliyah under the Law of Return.",
    source_url: "https://www.cbs.gov.il/",
    verification_note:
      "The statute and the continuing immigration series are public. The gathering texts are not closed by a last flight. This app does not declare fulfillment finished.",
    full_text: `King James, Ezekiel 37:21: “I will take the children of Israel from among the heathen, whither they be gone, and will gather them on every side, and bring them into their own land.”

Isaiah 11:12: “gather together the dispersed of Judah from the four corners of the earth.”

Jeremiah 30:3: “I will cause them to return to the land that I gave to their fathers, and they shall possess it.”

The Law of Return remains Israeli statute. Published immigration statistics still record olim from many countries each year. Jews also remain in large numbers outside the land. The process matches the wording “from all countries” as an unfinished public fact, not as a closed ledger.

This card is the living statute and the continuing count. It is not a claim that every exile has come home.`,
  },
  {
    title: "Jerusalem as a burdensome stone in the nations",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Zechariah 12:2–3; Zechariah 12:9",
    prophecy_reference: "Zechariah 12:2–3",
    modern_date: "1947–present",
    location: "Jerusalem / United Nations",
    date: "1947-11-29",
    local_image: "/evidence/prophecy/un-headquarters.jpg",
    image_caption:
      "United Nations Headquarters, New York — the house that still debates the status of Jerusalem. Catalogued photograph of the named buildings.",
    source_url: "https://www.un.org/unispal/",
    verification_note:
      "UN and state papers about Jerusalem are established. Zechariah 12 describes a future siege and a stone that cuts the nations. This app does not say that siege has begun.",
    full_text: `King James, Zechariah 12:2–3: “Behold, I will make Jerusalem a cup of trembling unto all the people round about, when they shall be in the siege both against Judah and against Jerusalem. And in that day will I make Jerusalem a burdensome stone for all people: all that burden themselves with it shall be cut in pieces, though all the people of the earth be gathered together against it.”

Dated public facts: Resolution 181 already set Jerusalem under a Special International Regime. After 1967 the city’s status became a standing UN and embassy question. UN General Assembly and UNESCO texts repeatedly treat Jerusalem as an international problem. States disagree over capitals, embassies, and sovereignty.

What is established is that the nations have not been able to set the city down. What is not established is that Zechariah’s siege “in that day” is already the present debate. The verse names trembling, siege, and the stone cutting those who burden themselves with it. The UN file is the public record of the burden. This app does not declare the day.`,
  },
  {
    title: "Waste land rebuilt; desert cultivated",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Ezekiel 36:8; Ezekiel 36:33–35; Isaiah 35:1; Isaiah 35:6–7; Isaiah 43:19–20; Amos 9:14; Isaiah 27:6",
    prophecy_reference: "Ezekiel 36:33–35; Isaiah 35:1; Isaiah 35:6–7; Isaiah 43:19–20; Amos 9:14–15",
    modern_date: "1948–present",
    location: "Land of Israel",
    date: "1948-05-14",
    local_image: "/evidence/prophecy/waste-land.jpg",
    image_caption:
      "Yatir Forest on the edge of the Negev: planted woodland against arid hills. Catalogued ground photograph of the cultivated waste.",
    source_url: "https://www.kkl-jnf.org/",
    verification_note:
      "Afforestation, irrigated agriculture, and rebuilt towns are measured. Ezekiel 36:33 ties the rebuilt wastes to a day of cleansing. This app does not declare that day.",
    full_text: `King James, Ezekiel 36:35: “And they shall say, This land that was desolate is become like the garden of Eden; and the waste and desolate and ruined cities are become fenced, and are inhabited.”

Isaiah 35:1: “The wilderness and the solitary place shall be glad for them; and the desert shall rejoice, and blossom as the rose.”

Isaiah 35:6–7: “for in the wilderness shall waters break out, and streams in the desert. And the parched ground shall become a pool.”

Isaiah 43:19: “I will even make a way in the wilderness, and rivers in the desert.”

Amos 9:14: “they shall build the waste cities, and inhabit them; and they shall plant vineyards, and drink the wine thereof.”

Dated public facts: JNF-KKL and state forestry planted hundreds of millions of trees on mapped lands, including the Yatir Forest on the Negev edge. Drip irrigation (a published Israeli agricultural method), pipelines, and desalination have put water and export produce in portions of the Negev. Cities that were ruin or swamp in the nineteenth-century surveys are inhabited.

Irrigation and desalination are ordinary engineering. Isaiah 35 also names the lame leaping and the tongue of the dumb singing. Those clauses are not a pipeline. This card stores the water and the rebuilt towns beside the verses. It does not close the prophecy.`
  },
  {
    title: "Gospel published among the nations",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Matthew 24:14; Mark 13:10; Revelation 14:6",
    prophecy_reference: "Matthew 24:14; Mark 13:10",
    modern_date: "19th century–present",
    location: "Worldwide",
    date: "1804",
    local_image: "/evidence/prophecy/gospel-nations.jpg",
    image_caption:
      "Title page of the 1611 King James Bible. Catalogued plate of the English Scripture still published among the nations.",
    source_url: "https://www.biblegateway.com/",
    verification_note:
      "Bible translation and global media are established. Matthew 24:14 ends “and then shall the end come.” This app does not announce that end.",
    full_text: `King James, Matthew 24:14: “And this gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the end come.”

Mark 13:10: “And the gospel must first be published among all nations.”

Dated public facts: Bible societies from the nineteenth century onward printed and translated the Scriptures on a scale no earlier century had. Wycliffe and allied catalogues now list thousands of languages with at least a portion of the Bible. Radio, satellite, and the public internet carry the wording into places a first-century preacher walked to on foot.

“All nations” as a finished witness is not a number this app can close. Whole peoples still have no full Bible; many have never heard. The process is public. The “then” of Matthew 24:14 is not a date in a table. This card stores the publishing fact beside the verse.`,
  },
  {
    title: "Many running to and fro; knowledge increased",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Daniel 12:4",
    prophecy_reference: "Daniel 12:4",
    modern_date: "20th–21st century",
    location: "Worldwide",
    date: "1903",
    local_image: "/evidence/prophecy/knowledge-increased.jpg",
    image_caption:
      "The New York Public Library Rose Main Reading Room — stored knowledge in one hall. Catalogued interior photograph. Not a picture of Daniel’s sealed book.",
    source_url: "",
    verification_note:
      "Travel and recorded knowledge have increased by every public measure. Whether Daniel 12:4 names that increase, or the unsealing of the book itself, is debated. This app does not close the verse.",
    full_text: `King James, Daniel 12:4: “But thou, O Daniel, shut up the words, and seal the book, even to the time of the end: many shall run to and fro, and knowledge shall be increased.”

Dated public facts: powered flight, global shipping, and scheduled air travel made “to and fro” a civilian commonplace. Print, then radio, then the public internet made recorded knowledge searchable in seconds.

Some readers apply the clause to travel and science. Others read it as people searching the newly opened book. Both readings can be stated. Neither is a laboratory proof that the sealed book is now fully open. The measurements of travel and stored knowledge are established. The identification with Daniel’s “time of the end” is contextual.`,
  },
  {
    title: "Wars, rumours, famine, and earthquakes — Matthew 24 signs",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Matthew 24:6–8; Mark 13:7–8; Luke 21:9–11",
    prophecy_reference: "Matthew 24:6–8; Luke 21:9–11",
    modern_date: "ongoing",
    location: "Worldwide",
    date: "1914",
    local_image: "/evidence/prophecy/wars-nations.jpg",
    image_caption:
      "Australian gunners on a duckboard through Chateau Wood, Ypres, 29 October 1917 (Frank Hurley). Public-domain war photograph. Jesus said the end is not yet.",
    verification_note:
      "Wars, famine reports, and earthquakes are published facts in every century. Jesus said “the end is not yet.” This card does not treat any single war as that end.",
    full_text: `King James, Matthew 24:6–8: “And ye shall hear of wars and rumours of wars: see that ye be not troubled: for all these things must come to pass, but the end is not yet. For nation shall rise against nation, and kingdom against kingdom: and there shall be famines, and pestilences, and earthquakes, in divers places. All these are the beginning of sorrows.”

Luke 21:9: “the end is not by and by.”

Dated public facts: the twentieth and twenty-first centuries published two world wars, regional wars without number, famine series (FAO), pandemic records (including COVID-19), and seismic catalogues (USGS). USGS does not find a sustained worldwide rise in major earthquakes; better instruments and denser cities change what is counted. Luke 21:11 adds pestilences. A named disease is not “the” pestilence of the end.

Jesus named these as the beginning of sorrows, and forbade being troubled into a false clock. This card stores the standing condition beside His words. It does not baptize a headline as the last trumpet.`
  },
  {
    title: "Nations parting the land",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Joel 3:2; Daniel 11:39",
    prophecy_reference: "Joel 3:2",
    modern_date: "1947–present",
    location: "United Nations / the land",
    date: "1947-11-29",
    local_image: "/evidence/prophecy/nations-parting.jpg",
    image_caption:
      "The United Nations General Assembly hall, where later partition plans for the land have been debated. Catalogued photograph of that house.",
    source_url: "https://www.un.org/unispal/",
    verification_note:
      "Partition plans are established state papers. Joel 3:2 is a latter-day pleading in the valley of Jehoshaphat. This app does not say that valley court has sat.",
    full_text: `King James, Joel 3:2: “I will also gather all nations, and will bring them down into the valley of Jehoshaphat, and will plead with them there for my people and for my heritage Israel, whom they have scattered among the nations, and parted my land.”

Dated public facts: Resolution 181 recommended a Jewish State, an Arab State, and an international Jerusalem. Later UN resolutions, U.S. peace plans, and regional talks have again drawn lines through the same land. The diplomatic project of “two states” is a published, unfinished partition.

Joel names a gathering of all nations for judgment over scattering and parting. A map conference is not that court. The parting papers are real. The valley scene is not claimed here as already present.`,
  },
  {
    title: "Dead Sea springs and microbes — not Ezekiel’s healed sea",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Ezekiel 47:8–10",
    prophecy_reference: "Ezekiel 47:8–10",
    modern_date: "21st century",
    location: "Dead Sea",
    date: "2011",
    local_image: "/evidence/prophecy/dead-sea-springs.jpg",
    image_fit: "contain",
    image_caption:
      "Published PLOS ONE photographs (2012) of underwater freshwater springs in the Dead Sea, including cobble with visible biofilms. This is microbial life at a spring, not Ezekiel’s healed sea of fish.",
    extra_images: [
      {
        local_image: "/evidence/prophecy/ein-feshkha.jpg",
        image_caption:
          "Einot Tzukim (Ein Feshkha) on the north-west Dead Sea shore: reeds and fresh water beside the salt basin. Catalogued reserve photograph.",
      },
    ],
    source_url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0038319",
    verification_note:
      "Freshwater springs and microbes in the Dead Sea are published. Ezekiel 47 describes the sea healed and fishers from Engedi to Eneglaim. That has not occurred.",
    full_text: `King James, Ezekiel 47:8–10: “These waters issue out toward the east country, and go down into the desert, and go into the sea: which being brought forth into the sea, the waters shall be healed. … the fishers shall stand upon it from Engedi even unto Eneglaim; they shall be a place to spread forth nets; their fish shall be according to their kinds, as the fish of the great sea, exceeding many.”

Dated public facts: Ionescu and colleagues published underwater freshwater springs in the Dead Sea in PLOS ONE (5 June 2012), with photographs of the shafts and of biofilms on cobble. Ein Feshkha / Einot Tzukim is a mapped freshwater reserve on the north-west shore, with reeds and pools.

What is not established: that the sea has become fresh, or that commercial nets now stand from Engedi to Eneglaim. Microbes at a spring, and reeds at a reserve, are not Ezekiel’s multitude of fish. This card stores the discovery beside the vision. It does not close the chapter.`,
  },
  {
    title: "Persecution for His name — still the standing condition",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established",
    scripture_reference: "Matthew 24:9; John 15:20; Revelation 6:9–11",
    prophecy_reference: "Matthew 24:9; John 15:20",
    modern_date: "first century–present",
    location: "Worldwide",
    date: "c. AD 112",
    local_image: "/evidence/prophecy/persecution.jpg",
    image_caption:
      "The Colosseum, Rome — a named place of public killing in the empire that first put Christians to death for the name. Catalogued site photograph.",
    verification_note:
      "Persecution of Christians is a published fact from Pliny to the present. Matthew 24:9 does not let a reader date the end from any one country’s report.",
    full_text: `King James, Matthew 24:9: “Then shall they deliver you up to be afflicted, and shall kill you: and ye shall be hated of all nations for my name’s sake.”

John 15:20: “If they have persecuted me, they will also persecute you.”

Dated public facts stored in this app: Pliny’s letter to Trajan (c. AD 112) and Tacitus on Nero already name Christians put to death for the name. Modern foreign-ministry and church reports still list imprisonments and killings in more than one country.

This is the standing condition Jesus named, not a new clock. Persecution has not been absent since the first century. This card stores the wording and the long record. It does not treat the latest report as the last tribulation.`,
  },
  {
    title: "A falling away, and many offended",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "2 Thessalonians 2:3; 1 Timothy 4:1; Matthew 24:10–13",
    prophecy_reference: "2 Thessalonians 2:3; 1 Timothy 4:1; Matthew 24:10–13",
    modern_date: "ongoing",
    location: "Worldwide",
    date: "present",
    local_image: "/evidence/prophecy/falling-away.jpg",
    image_caption:
      "Nave of St Oswald’s, Filey: pews and a quiet house. Catalogued church interior. Not a census of “the” falling away.",
    verification_note:
      "Paul said a falling away comes first. Census religion and empty profession are public. This app does not fix the day of the man of sin from a poll.",
    full_text: `King James, 2 Thessalonians 2:3: “Let no man deceive you by any means: for that day shall not come, except there come a falling away first, and that man of sin be revealed, the son of perdition.”

1 Timothy 4:1: “Now the Spirit speaketh expressly, that in the latter times some shall depart from the faith, giving heed to seducing spirits, and doctrines of devils.”

Matthew 24:10: “And then shall many be offended, and shall betray one another, and shall hate one another.”

Dated public facts: large churches in lands that once named Christ now report empty pews and open denial of the resurrection. Other lands report growth. Measurement of “the” falling away is disputed — some read it as first-century departure, some as a last concentrated rebellion.

What is stored is the wording and the visible cooling in once-Christian nations. What is not stored is a date for the man of sin. The falling away is a watch, not a finished ledger.`,
  },
  {
    title: "False christs and false prophets",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established",
    scripture_reference: "Matthew 24:5; Matthew 24:11; Matthew 24:24",
    prophecy_reference: "Matthew 24:5; Matthew 24:11; Matthew 24:24",
    modern_date: "first century–present",
    location: "Worldwide",
    date: "present",
    local_image: "/evidence/prophecy/false-christs.jpg",
    image_caption:
      "Luca Signorelli, Sermon and Deeds of the Antichrist (Orvieto, San Brizio). Catalogued fresco of the deception Jesus named. Not a living claimant.",
    verification_note:
      "Claimants who take the name of Christ, and prophets who deceive, are a published recurring fact. Matthew 24 also warns of a more concentrated deception still ahead.",
    full_text: `King James, Matthew 24:5: “For many shall come in my name, saying, I am Christ; and shall deceive many.”

Matthew 24:11: “And many false prophets shall rise, and shall deceive many.”

Matthew 24:24: “For there shall arise false Christs, and false prophets, and shall shew great signs and wonders; insomuch that, if it were possible, they shall deceive the very elect.”

Dated public facts: from Simon Magus in Acts 8 to modern messianic claimants and miracle-sellers, the name has been taken. The app’s pagan traditions and names shelves already identify some of those trades.

Jesus said this must come to pass and that a sharper deception is still possible. This card stores the recurring sign. It does not name a living man as the last false christ.`,
  },
  {
    title: "Scoffers asking where the promise of His coming is",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established",
    scripture_reference: "2 Peter 3:3–4; Matthew 24:48–51",
    prophecy_reference: "2 Peter 3:3–4",
    modern_date: "ongoing",
    location: "Worldwide",
    date: "present",
    local_image: "/evidence/prophecy/scoffers.jpg",
    image_caption:
      "Pieter Claesz, Still Life with a Skull and a Writing Quill (1628). Catalogued vanitas of time passing while the fathers sleep. Not a date for the coming.",
    verification_note:
      "The scoff Peter named is public. The passage gives no date. This app does not treat mockery itself as a calendar.",
    full_text: `King James, 2 Peter 3:3–4: “Knowing this first, that there shall come in the last days scoffers, walking after their own lusts, And saying, Where is the promise of his coming? for since the fathers fell asleep, all things continue as they were from the beginning of the creation.”

Dated public fact: the question is asked in print and on the public internet every day — that the fathers died, and the world goes on.

Peter’s next lines answer with the flood and with a coming fire, and with the Lord’s longsuffering. This card stores the scoff beside the warning. It does not date the coming from the volume of the mockery.`,
  },
  {
    title: "Lovers of their own selves — 2 Timothy 3",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "2 Timothy 3:1–5",
    prophecy_reference: "2 Timothy 3:1–5",
    modern_date: "ongoing",
    location: "Worldwide",
    date: "present",
    local_image: "/evidence/prophecy/lovers-of-selves.jpg",
    image_caption:
      "Caravaggio, Narcissus — a man in love with his own image. Catalogued painting. Not a statistic of 2 Timothy 3.",
    verification_note:
      "Paul’s list is a moral description, not a statistic. Headlines about pride and money cannot close the chapter.",
    full_text: `King James, 2 Timothy 3:1–2, 5: “This know also, that in the last days perilous times shall come. For men shall be lovers of their own selves, covetous, boasters, proud, blasphemers, disobedient to parents, unthankful, unholy, … Having a form of godliness, but denying the power thereof: from such turn away.”

The list is public enough: self as gospel, money as honour, religion as costume. It was already readable in Paul’s century. It is still readable.

This card stores the wording as a watch on the present. It does not turn a fashion season into a fulfilled last-days clock.`,
  },
  {
    title: "As the days of Noah and of Lot — ordinary life until sudden judgment",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "disputed_identification",
    scripture_reference: "Matthew 24:37–39; Luke 17:26–30; Ezekiel 16:49–50",
    prophecy_reference: "Matthew 24:37–39; Luke 17:26–30",
    modern_date: "ongoing",
    location: "Worldwide",
    date: "present",
    local_image: "/evidence/prophecy/days-of-noah.jpg",
    image_caption:
      "John Martin, The Destruction of Sodom and Gomorrah (1852). Catalogued painting of the sudden day Jesus named. Not a caption on this century.",
    verification_note:
      "Jesus compared the coming to ordinary eating, drinking, marrying, buying, and building until the day broke. Mapping every vice of a city onto “Sodom” is a later reading and is marked disputed.",
    full_text: `King James, Matthew 24:37–38: “But as the days of Noe were, so shall also the coming of the Son of man be. For as in the days that were before the flood they were eating and drinking, marrying and giving in marriage, until the day that Noe entered into the ark.”

Luke 17:28–29: “Likewise also as it was in the days of Lot; they did eat, they drank, they bought, they sold, they planted, they builded; But the same day that Lot went out of Sodom it rained fire and brimstone from heaven, and destroyed them all.”

Ezekiel 16:49 names Sodom’s iniquity as pride, fulness of bread, abundance of idleness, and neglect of the poor, and then abominations.

The sign Jesus named is ordinary life continuing until a sudden day — not a reader’s ability to stamp this year as Sodom. Genesis 6 also names violence and corruption; some add that. This card stores the comparison. It does not baptize a headline as the flood or the fire.`
  },

  // ——— End-time setup ———
  {
    title: "Temple Mount without a Jewish temple",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established",
    scripture_reference: "Matthew 24:15; Daniel 9:27; 2 Thessalonians 2:3–4; Revelation 11:1–2",
    prophecy_reference: "Matthew 24:15; 2 Thessalonians 2:3–4; Revelation 11:1–2",
    modern_date: "present",
    location: "Temple Mount, Jerusalem",
    date: "1967-06-07",
    local_image: "/evidence/prophecy/temple-mount.jpg",
    image_caption:
      "The Temple Mount / Haram al-Sharif from the Mount of Olives: Dome of the Rock and al-Aqsa, with no Jewish temple standing. Catalogued site photograph.",
    verification_note:
      "The empty Jewish temple platform is a photographed fact. A future abomination in a holy place is not a present measurement. This app does not announce a third temple.",
    full_text: `King James, Matthew 24:15: “When ye therefore shall see the abomination of desolation, spoken of by Daniel the prophet, stand in the holy place, (whoso readeth, let him understand:)”

2 Thessalonians 2:3–4: “that man of sin be revealed, the son of perdition; Who opposeth and exalteth himself above all that is called God, or that is worshipped; so that he as God sitteth in the temple of God, shewing himself that he is God.”

Revelation 11:1–2: John is told to measure the temple of God and the altar; the court without is given to the Gentiles, who tread the holy city forty and two months.

Dated public facts: the Herodian Temple was destroyed in AD 70. Since 1967 the platform has been administered for Islamic worship (Dome of the Rock, al-Aqsa) under the waqf, with Israeli security around the compound. No Jewish house stands on the mount.

This is setup, not the abomination. Paul speaks of a man sitting in the temple of God. John measures a temple. Those texts are future or contested in application. The photograph is the present platform. Red-heifer arrivals and furniture workshops are stored on the next cards as preparations, not as a standing temple.`
  },
  {
    title: "The whole earth can see an event at once",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established_contextual",
    scripture_reference: "Revelation 11:9–10; Matthew 24:27",
    prophecy_reference: "Revelation 11:9–10",
    modern_date: "late 20th century–present",
    location: "Worldwide",
    date: "1969",
    local_image: "/evidence/prophecy/whole-earth-see.jpg",
    image_caption:
      "Raisting earth station dishes — machines that can send one scene to many nations at once. Catalogued ground photograph. Not the two witnesses of Revelation 11.",
    source_url: "",
    verification_note:
      "Global live image is a measured capability. Revelation 11 names a specific three-and-a-half-day sight of two witnesses. This app does not say those witnesses have appeared.",
    full_text: `King James, Revelation 11:9: “And they of the people and kindreds and tongues and nations shall see their dead bodies three days and an half, and shall not suffer their dead bodies to be put in graves.”

Matthew 24:27: “For as the lightning cometh out of the east, and shineth even unto the west; so shall also the coming of the Son of man be.”

Dated public facts: satellite television and the public internet made a single street scene visible to “peoples and kindreds and tongues” in the same hour. That capability did not exist when John wrote.

Setup is not fulfillment. Revelation 11 is a dated scene of two witnesses. Lightning from east to west is the coming of the Son of man, not a news channel. This card stores the capability beside the wording. It does not invent the witnesses.`,
  },
  {
    title: "Buy-and-sell control is now technically possible",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established_contextual",
    scripture_reference: "Revelation 13:16–17",
    prophecy_reference: "Revelation 13:16–17",
    modern_date: "present",
    location: "Worldwide",
    date: "2000",
    local_image: "/evidence/prophecy/buy-sell.jpg",
    image_caption:
      "A published payment terminal that can accept or refuse a card. Capability only — not the mark of the beast.",
    verification_note:
      "Digital payments and identity systems exist. They are not the mark of the beast. This app will not name a card, chip, vaccine, or currency as that mark.",
    full_text: `King James, Revelation 13:16–17: “And he causeth all, both small and great, rich and poor, free and bond, to receive a mark in their right hand, or in their foreheads: And that no man might buy or sell, save he that had the mark, or the name of the beast, or the number of his name.”

Dated public facts: card networks, mobile payments, and state digital-identity programmes can already permit or refuse a purchase at a terminal. That is a measured capability of the present economy.

What this is not: the mark. John names the beast, the number of his name, the right hand or the forehead, worship, and a worldwide compulsion. A patent application (including Microsoft WO2020060606), a laboratory enzyme named luciferase, a quantum-dot vaccine patch, a barcode, a vaccine, or a microchip does not satisfy that whole text. Those items are stored here only as things this app refuses to baptize as 666.

The setup is only this: a world in which “no man might buy or sell” can be administered by machine is no longer unimaginable.`
  },
  {
    title: "The Euphrates River is drying up",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established_contextual",
    scripture_reference: "Revelation 16:12; Isaiah 11:15",
    prophecy_reference: "Revelation 16:12",
    modern_date: "1970s–present",
    location: "Euphrates basin",
    date: "1990",
    local_image: "/evidence/prophecy/euphrates.jpg",
    image_caption:
      "Aerial photograph of a drying Euphrates reach in Syria: exposed bed and remaining channels.",
    source_url: "https://phys.org/news/2021-08-euphrates-threatens-disaster-syria.html",
    verification_note:
      "Dams and drought have reduced reaches of the Euphrates. Revelation 16:12 is the sixth vial, poured by an angel. This app does not say that vial has been poured.",
    full_text: `King James, Revelation 16:12: “And the sixth angel poured out his vial upon the great river Euphrates; and the water thereof was dried up, that the way of the kings of the east might be prepared.”

Dated public facts: Turkey’s Atatürk Dam and other basin works have long held the headwaters. In 2021 published reporting from northeast Syria described the river contracted to a sliver, Tishrin reservoir down by metres, and engineers warning that turbines were near dead level. UN and basin-state papers record the low flow into Syria and the dry reaches downstream.

The text names an angel’s vial that prepares a way for the kings of the east. The reduced river is stored as the present measurement. This app does not say that vial has been poured.`,
  },
  {
    title: "Rivers and lagoons in the Moroccan Sahara",
    fulfillment_type: "prophecy_fulfillment",
    watch_stage: "in_process",
    evidence_status: "established_contextual",
    scripture_reference: "Isaiah 43:19–20; Isaiah 35:6–7",
    prophecy_reference: "Isaiah 43:19–20; Isaiah 35:6–7",
    modern_date: "2024-09",
    location: "Merzouga / Moroccan Sahara",
    date: "2024-09",
    local_image: "/evidence/prophecy/sahara-lagoons.jpg",
    image_caption:
      "Floodwaters and palms at the dune line in the Moroccan Sahara after the September 2024 rains.",
    source_url:
      "https://apnews.com/article/sahara-flooding-oasis-rain-morocco-2b6c28d2487a0ef370aff60775d0245d",
    verification_note:
      "The September 2024 rains and the lagoons they left are a published weather record. Isaiah 43 names rivers in the desert as the Lord’s new thing. This app does not declare that verse fulfilled.",
    full_text: `King James, Isaiah 43:19: “I will even make a way in the wilderness, and rivers in the desert.”

Isaiah 43:19–20: “Behold, I will do a new thing; now it shall spring forth; shall ye not know it? I will even make a way in the wilderness, and rivers in the desert. The beast of the field shall honour me, the dragons and the owls: because I give waters in the wilderness, and rivers in the desert, to give drink to my people, my chosen.”

Isaiah 35:6–7: “for in the wilderness shall waters break out, and streams in the desert. And the parched ground shall become a pool, and the thirsty land springs of water.”

Dated public facts: in September 2024 a rare deluge fell on southeastern Morocco. Morocco’s meteorology service told the Associated Press that some desert stations took more rain in two days than they usually see in a year; Houssine Youabeb said it had been thirty to fifty years since so much rain had fallen in so short a space. Water collected between the dunes at Merzouga. Lake Iriqui, dry for about fifty years after the Mansour Eddahbi Dam, filled again. Palms stood in the flood at the dune line.

The photograph stored here is that published scene. The verses name waters the Lord gives in the wilderness. This card stores the dated rain and the lagoons beside those words. It does not close the prophecy.`,
  },
  redWater({
    title: "Blood Falls",
    modern_date: "mapped present waters",
    location: "Taylor Glacier, Antarctica",
    date: "2006-11-26",
    local_image: "/evidence/prophecy/blood-falls.jpg",
    image_caption:
      "Blood Falls at Taylor Glacier, Antarctica (NSF / Peter Rejcek). Public-domain government photograph.",
    source_url: "https://photolibrary.usap.gov/",
    full_text: `King James, Revelation 16:4: “And the third angel poured out his vial upon the rivers and fountains of waters; and they became blood.”

Dated public facts: a subglacial brine leaks from Taylor Glacier into Lake Bonney. The iron reddens when it meets air. The National Science Foundation published this photograph.`,
  }),
  redWater({
    title: "Caño Cristales",
    modern_date: "wet season, each year",
    location: "Serranía de la Macarena, Meta, Colombia",
    date: "2010",
    local_image: "/evidence/prophecy/cano-cristales.jpg",
    image_caption:
      "Caño Cristales (Los Ocho): the wet-season riverbed running red. Catalogued site photograph.",
    source_url: "https://commons.wikimedia.org/wiki/Category:Ca%C3%B1o_Cristales",
    full_text: `King James, Revelation 16:4: “And the third angel poured out his vial upon the rivers and fountains of waters; and they became blood.”

Dated public facts: Caño Cristales in Colombia turns a brilliant red in the wet months because an endemic aquatic plant, Macarenia clavigera, covers the bed. The same reach also shows green, yellow, blue, and black.`,
  }),
  {
    title: "Abraham Accords and published “peace and safety” papers",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "disputed_identification",
    scripture_reference: "1 Thessalonians 5:3; Daniel 9:27; Ezekiel 38:11",
    prophecy_reference: "1 Thessalonians 5:3; Daniel 9:27",
    modern_date: "2020-09-15",
    location: "Washington, D.C.",
    date: "2020-09-15",
    local_image: "/evidence/prophecy/abraham-accords.jpg",
    image_caption:
      "White House South Lawn, 15 September 2020: the Abraham Accords signing. Official U.S. government photograph of the paper named below.",
    source_url: "https://www.whitehouse.gov/",
    verification_note:
      "The Accords are a dated state paper. Applying them to Daniel’s covenant or to Paul’s “peace and safety” is a disputed reading. This app does not make that identification.",
    full_text: `King James, 1 Thessalonians 5:3: “For when they shall say, Peace and safety; then sudden destruction cometh upon them, as travail upon a woman with child; and they shall not escape.”

Daniel 9:27: “And he shall confirm the covenant with many for one week.”

Published English of the Abraham Accords Declaration (White House, 15 September 2020), opening sense: the United Arab Emirates, Bahrain, and Israel, witnessed by the United States, announced normalization of relations and a desire to advance peace in the Middle East. Later papers added Sudan and Morocco. The ceremony photograph stored here is a U.S. government work.

What is established is the dated diplomacy. What is disputed is calling this Daniel’s covenant with many, or the last “peace and safety” before destruction. Paul is warning watchful believers, not captioning a lawn signing. Ezekiel 38:11 speaks of a land “at rest” before a northern invasion — another text readers sometimes force onto a treaty. This card stores the paper. It does not start a seven-year clock.`,
  },
  {
    title: "Persia and northern partners named in Ezekiel 38",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "disputed_identification",
    scripture_reference: "Ezekiel 38:1–8; Ezekiel 38:5; Ezekiel 39:1–2",
    prophecy_reference: "Ezekiel 38:1–8; Ezekiel 38:5",
    modern_date: "present",
    location: "Iran / the north / the land",
    date: "1979",
    local_image: "/evidence/prophecy/persia-ezekiel.jpg",
    image_caption:
      "The Gate of All Nations at Persepolis, in the land Ezekiel 38:5 names as Persia. Catalogued site photograph. Not a flag for Magog.",
    verification_note:
      "Iran is the heir of Persia, which Ezekiel 38:5 names. Magog, Meshech, Tubal, Gomer, and Togarmah are historic names whose modern flags are debated. This app does not identify Gog with a living government.",
    full_text: `King James, Ezekiel 38:8: “After many days thou shalt be visited: in the latter years thou shalt come into the land that is brought back from the sword, and is gathered out of many people, against the mountains of Israel, which have been always waste: but it is brought forth out of the nations, and they shall dwell safely all of them.”

Ezekiel 38:5: “Persia, Ethiopia, and Libya with them.”

Dated public facts: a Jewish state now exists on the mountains of Israel, gathered out of many peoples — the dated cards above. The Islamic Republic of Iran is the modern state on the land of Persia and publishes hostility toward that state. Russia, Turkey, and Iran have in this century held published military and diplomatic positions in the same Syrian theatre.

What this app will not do: name Magog as Moscow, or declare that Ezekiel’s war has started. Josephus and later geographers placed Magog among northern peoples; that is a reading, not a UN caption. Ethiopia and Libya in 38:5 are likewise historic names. Setup is only this: the land is gathered, Persia is a named hostile power, and northern coalitions are no longer unimaginable. The invasion itself is not stored as present.`,
  },
  {
    title: "U.S. embassy opened in Jerusalem (14 May 2018)",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established",
    scripture_reference: "Zechariah 12:2–3; Zechariah 8:3",
    prophecy_reference: "Zechariah 12:2–3; Zechariah 8:3",
    modern_date: "2018-05-14",
    location: "Jerusalem",
    date: "2018-05-14",
    local_image: "/evidence/prophecy/us-embassy-jerusalem.jpg",
    image_caption:
      "Dedication of the U.S. embassy in Jerusalem, May 2018. Official photograph of that dated act.",
    source_url: "https://il.usembassy.gov/",
    verification_note: NOTICE,
    full_text: `King James, Zechariah 8:3: “Thus saith the LORD; I am returned unto Zion, and will dwell in the midst of Jerusalem: and Jerusalem shall be called a city of truth.”

Zechariah 12:3: “I will make Jerusalem a burdensome stone for all people.”

Dated public facts: the U.S. Jerusalem Embassy Act of 1995 (Public Law 104–45) recognized Jerusalem as Israel’s capital and directed the embassy to move. On 14 May 2018 — seventy years to the day from the 1948 proclamation — the United States opened its embassy in Jerusalem. Other states followed or refused. The city’s status remained a UN quarrel.

An embassy is not the LORD dwelling in Zion. It is a dated act that raised the city’s political temperature, which is why it sits under setup beside Zechariah 12, not under a closed fulfillment.`,
  },
  {
    title: "Red heifers brought to the land (September 2022)",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "disputed_identification",
    scripture_reference: "Numbers 19:2–9",
    prophecy_reference: "Numbers 19:2–9",
    modern_date: "2022-09",
    location: "Israel",
    date: "2022-09",
    local_image: "/evidence/prophecy/red-heifers.jpg",
    image_caption:
      "Catalogued red heifers (Red Poll). These are the kind of unblemished red cattle Numbers 19 names. They are not a photograph of the five Texas animals flown in 2022; those press pictures are not freely stored.",
    extra_images: [
      {
        local_image: "/evidence/prophecy/red-heifer-ordinance.jpg",
        image_caption:
          "Phillip Medhurst Picture Torah: the sacrifice of the red heifer (Numbers 19:2). Historical engraving of the ordinance, not a modern news picture.",
      },
    ],
    source_url: "https://templeinstitute.org/",
    verification_note:
      "Five red heifers arriving from the United States in September 2022 is a published fact. Numbers 19 is a Torah ordinance for purification ashes, not an explicit last-days clock. Connecting them to a rebuilt temple is a later reading.",
    full_text: `King James, Numbers 19:2: “Speak unto the children of Israel, that they bring thee a red heifer without spot, wherein is no blemish, and upon which never came yoke.”

Numbers 19:9: the ashes are kept “for a water of separation: it is a purification for sin.”

Dated public facts: in September 2022 five red heifers were flown from Texas to Israel and received in public ceremonies reported by the Temple Institute and the press. Numbers 19 is a commandment for purification, used when there is a priesthood and a sanctuary to approach.

What this is not: a verse that says “when five heifers land, the week begins.” Some readers treat a qualified heifer as a necessary step before renewed temple worship. Others note that the ordinance is older than any modern end-times chart. The photographs stored here are catalogued red heifers and the historical engraving of the ordinance. They are not a claim that a heifer has been approved, or that a temple has begun.`,
  },
  {
    title: "Temple vessels and garments prepared — no house stands",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "established",
    scripture_reference: "2 Thessalonians 2:4; Revelation 11:1–2; Daniel 9:27; Matthew 24:15",
    prophecy_reference: "2 Thessalonians 2:4; Revelation 11:1–2; Daniel 9:27; Matthew 24:15",
    modern_date: "1980s–present",
    location: "Jerusalem",
    date: "1987",
    local_image: "/evidence/prophecy/temple-menorah.jpg",
    image_caption:
      "The Temple Institute’s golden menorah in the Jewish Quarter of Jerusalem, made for a future house. Catalogued public photograph of the article itself.",
    extra_images: [
      {
        local_image: "/evidence/prophecy/temple-menorah-cardo.jpg",
        image_caption:
          "The same Temple Institute menorah when it stood in the Cardo. A second catalogued view of the prepared vessel.",
      },
    ],
    source_url: "https://templeinstitute.org/",
    verification_note:
      "Published workshops have made vessels, garments, and architectural drawings. The golden menorah is photographed in the Jewish Quarter. No Third Temple has been built, and no daily sacrifice is offered on the mount.",
    full_text: `King James, 2 Thessalonians 2:4: “so that he as God sitteth in the temple of God, shewing himself that he is God.”

Revelation 11:1: John is told to measure the temple of God and the altar.

Exodus 25:31: “And thou shalt make a candlestick of pure gold.”

Dated public facts: the Temple Institute (founded 1987) and related workshops publish priestly garments, utensils, and plans for a house on the mount. The golden menorah stored in these photographs is their public article in the Jewish Quarter. Other vessels — incense altar, table of showbread, priestly garments — are shown at their museum. Indoor museum pictures of those remaining articles are not freely catalogued, so they are not invented here.

Preparations are not a functioning temple. Daniel’s abomination, Paul’s man sitting in the temple, and John’s measuring reed all assume a holy place in use. This card stores the prepared menorah beside those verses. It does not announce that the house has been raised.`,
  },
  {
    title: "The fig-tree reading of 1948 — stored as a dispute",
    fulfillment_type: "end_time_setup",
    watch_stage: "setup",
    evidence_status: "disputed_identification",
    scripture_reference: "Matthew 24:32–34; Mark 13:28–30; Luke 21:29–32",
    prophecy_reference: "Matthew 24:32–34; Luke 21:29–32",
    modern_date: "1948–present",
    location: "—",
    date: "1948-05-14",
    local_image: "/evidence/prophecy/fig-tree.jpg",
    image_caption:
      "A fig tree with fruit. The parable names the tree; the 1948 identification is stored as a dispute, not as this photograph.",
    verification_note:
      "Jesus gave a parable about nearness, not a published calendar. Identifying the fig tree as the 1948 state is a common reading and is not stored as established fact.",
    full_text: `King James, Matthew 24:32–34: “Now learn a parable of the fig tree; When his branch is yet tender, and putteth forth leaves, ye know that summer is nigh: So likewise ye, when ye shall see all these things, know that it is near, even at the doors. Verily I say unto you, This generation shall not pass, till all these things be fulfilled.”

Luke 21:29 adds: “Behold the fig tree, and all the trees.”

Many modern teachers say: Israel’s 1948 statehood is the fig tree leafing, therefore the generation that saw 1948 must see the end. Others note that Luke says “all the trees,” that “this generation” in Matthew often means the hearers of AD 30–70, and that date-setting from 1948 has already failed more than once.

This app stores the parable and the 1948 paper on the same shelf so the reader can hold them together. It does not start a generation clock. “It is not for you to know the times or the seasons” (Acts 1:7) remains in the same library.`,
  },
];

export const PROPHECY_GOVERNMENT = [
  {
    title: "League of Nations Mandate for Palestine (24 July 1922) — excerpt",
    document_type: "published_document",
    agency: "League of Nations",
    country: "League of Nations",
    scripture_reference: "Ezekiel 36:24; Isaiah 11:11–12",
    date: "1922-07-24",
    full_text: `Mandate for Palestine (League of Nations, 24 July 1922), preamble and Article 2 (published English):

The preamble recites the Balfour Declaration of 2 November 1917 and the Allied purpose that a national home for the Jewish people be established in Palestine, without prejudice to the civil and religious rights of existing non-Jewish communities.

Article 2: “The Mandatory shall be responsible for placing the country under such political, administrative and economic conditions as will secure the establishment of the Jewish national home, as laid down in the preamble, and the development of self-governing institutions, and also for safeguarding the civil and religious rights of all the inhabitants of Palestine, irrespective of race and religion.”

This is a League instrument. This app does not decide prophecy.`,
  },
  {
    title: "Israel Law of Return (5 July 1950) — excerpt",
    document_type: "published_document",
    agency: "Knesset",
    country: "Israel",
    scripture_reference: "Ezekiel 36:24; Jeremiah 31:10",
    date: "1950-07-05",
    full_text: `Law of Return, 5710–1950 (published English of the opening sections):

“1. Every Jew has the right to come to this country as an oleh.

2. (a) Aliyah shall be by oleh’s visa.
(b) An oleh’s visa shall be granted to every Jew who has expressed his desire to settle in Israel, unless the Minister of Immigration is satisfied that the applicant is engaged in an activity directed against the Jewish people or is likely to endanger public health or the security of the State.”

Later amendment (1970) defined “Jew” for this law and extended rights to a child and grandchild. This is Israeli statute. This app does not decide prophecy.`,
  },
  {
    title: "UN Security Council Resolution 242 (22 November 1967) — excerpt",
    document_type: "published_document",
    agency: "United Nations Security Council",
    country: "United Nations",
    scripture_reference: "Luke 21:24; Zechariah 12:2–3",
    date: "1967-11-22",
    full_text: `Resolution 242 (1967), adopted 22 November 1967 (excerpt of the operative paragraphs):

The Security Council, … Affirms that the fulfillment of Charter principles requires the establishment of a just and lasting peace in the Middle East which should include the application of both the following principles:

(i) Withdrawal of Israel armed forces from territories occupied in the recent conflict;

(ii) Termination of all claims or states of belligerency and respect for and acknowledgment of the sovereignty, territorial integrity and political independence of every State in the area and their right to live in peace within secure and recognized boundaries free from threats or acts of force.

This is a UN Security Council resolution after the Six-Day War. This app does not decide prophecy.`,
  },
  {
    title: "Abraham Accords Declaration (15 September 2020) — excerpt",
    document_type: "published_document",
    agency: "United States / Israel / United Arab Emirates / Bahrain",
    country: "United States",
    scripture_reference: "1 Thessalonians 5:3; Daniel 9:27",
    date: "2020-09-15",
    full_text: `Abraham Accords Declaration (White House, 15 September 2020), published opening sense:

The signatories proclaimed a shared commitment to advance peace and prosperity in the Middle East, to normalize relations between Israel and the United Arab Emirates and between Israel and the Kingdom of Bahrain, and to continue the pursuit of a just and comprehensive peace.

The ceremony was a U.S. government event; the photograph stored on the Prophecy watch page is a public-domain White House picture. This is a diplomatic paper. Applying it to Daniel 9:27 is a disputed reading. This app does not start a prophetic week from the lawn.`,
  },
];
