import { publicUrl } from "@/lib/publicUrl";

/** One stored photograph per Holidays item. Catalogued objects, plates, and published pages — not invented portraits. */

function photo(file, caption, credit, page) {
  return {
    src: publicUrl(`/evidence/holidays/${file}`),
    caption,
    credit,
    page,
  };
}

const MET = "Metropolitan Museum of Art, Open Access (public domain)";
const COMMONS = "Wikimedia Commons (public-domain or freely licensed catalog record)";
const commons = (name) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`;

export const HOLIDAY_EVIDENCE_PHOTOS = {
  "eye-of-horus": photo(
    "eye-of-horus.jpg",
    "Wedjat (Eye of Horus) faience amulet from the palace of Amenhotep III at Malqata. Met 11.215.130. MMA excavations, 1910–11.",
    MET,
    "https://www.metmuseum.org/art/collection/search/551468"
  ),
  ankh: photo(
    "ankh.jpg",
    "Faience ring fragment with an ankh, from Malqata, reign of Amenhotep III. Met 11.215.108. MMA excavations, 1910–11.",
    MET,
    "https://www.metmuseum.org/art/collection/search/551457"
  ),
  "crescent-moon": photo(
    "crescent-moon.jpg",
    "Faience crescent-moon amulet from Malqata, reign of Amenhotep III. Met 11.215.212. MMA excavations, 1910–11.",
    MET,
    "https://www.metmuseum.org/art/collection/search/551377"
  ),
  "sun-disk": photo(
    "sun-disk.jpg",
    "Akhenaten offering a duck under the rays of the Aten. Painted limestone, ca. 1347–1330 BC. Met 1985.328.2.",
    MET,
    "https://www.metmuseum.org/art/collection/search/544056"
  ),
  "radiate-crown": photo(
    "radiate-crown.jpg",
    "Silver antoninianus of Aurelian, AD 270–275, with the radiate crown of Sol. Met 08.170.375.",
    MET,
    "https://www.metmuseum.org/art/collection/search/248055"
  ),
  "halo-nimbus": photo(
    "halo-nimbus.jpg",
    "Justinian’s court mosaic in San Vitale, Ravenna: gold nimbi behind imperial and saintly heads. Sixth-century tesserae, not a modern halo drawing.",
    COMMONS,
    commons("Meister von San Vitale in Ravenna 004.jpg")
  ),
  obelisk: photo(
    "obelisk.jpg",
    "Sandstone obelisk, Ptolemaic Egypt (332–30 BC), from the Cledat and Clermont-Ganneau excavations, 1907. Met 11.154.9.",
    MET,
    "https://www.metmuseum.org/art/collection/search/565085"
  ),
  skull: photo(
    "skull.jpg",
    "Ivory rosary terminal with lovers and a death’s head, ca. 1500–1525. Met 17.190.305.",
    MET,
    "https://www.metmuseum.org/art/collection/search/464299"
  ),
  "latin-cross": photo(
    "latin-cross.jpg",
    "The Cloisters Cross, walrus ivory, ca. 1150–60. Met 63.12.",
    MET,
    "https://www.metmuseum.org/art/collection/search/470305"
  ),
  "cupid-heart": photo(
    "cupid-heart.jpg",
    "Roman bronze statuette of Cupid, ca. 1st–2nd century AD. Met 19.192.54.",
    MET,
    "https://www.metmuseum.org/art/collection/search/250787"
  ),
  "winged-sun": photo(
    "winged-sun.jpg",
    "Glass inlay, a wing from a winged sun or falcon. Ptolemaic–Roman Egypt, ca. 200 BC–AD 100. Met 26.7.1201.",
    MET,
    "https://www.metmuseum.org/art/collection/search/551581"
  ),
  evergreen: photo(
    "evergreen.jpg",
    "Painted limestone relief of an acacia tree shading water jars, Egypt, ca. 2051–2030 BC. Met 26.3.353c. A catalogued tree image, not a German parlour Christmas tree.",
    MET,
    "https://www.metmuseum.org/art/collection/search/552052"
  ),
  "nazar-eye": photo(
    "nazar-eye.jpg",
    "Eastern Mediterranean glass eye bead, ca. 4th century BC. Met 17.194.805.",
    MET,
    "https://www.metmuseum.org/art/collection/search/250031"
  ),
  "masonic-square": photo(
    "masonic-square.jpg",
    "American Masonic armchair, 1775–90, painted with lodge emblems. Met 2000.192.",
    MET,
    "https://www.metmuseum.org/art/collection/search/4985"
  ),
  maypole: photo(
    "maypole.jpg",
    "English needlework picture with a maypole scene, ca. 1700. Met 64.101.1355.",
    MET,
    "https://www.metmuseum.org/art/collection/search/229052"
  ),
  caduceus: photo(
    "caduceus.jpg",
    "French gilt figure of Cupid as a messenger holding Mercury’s caduceus, ca. 1730. Met 07.225.255.",
    MET,
    "https://www.metmuseum.org/art/collection/search/189526"
  ),
  "zodiac-wheel": photo(
    "zodiac-wheel.jpg",
    "Capricorn, a section of a zodiac frieze, 1582. Met 2004.440.1.",
    MET,
    "https://www.metmuseum.org/art/collection/search/231027"
  ),
  ouroboros: photo(
    "ouroboros.jpg",
    "Italian drawing: a dragon biting its own tail around a ram’s head, 1572–85. Met 48.148(78b).",
    MET,
    "https://www.metmuseum.org/art/collection/search/367239"
  ),
  "circle-ring": photo(
    "circle-ring.jpg",
    "Jewish betrothal ring, gold and enamel, 17th or 19th century. Met 17.190.996.",
    MET,
    "https://www.metmuseum.org/art/collection/search/193714"
  ),
  hamsa: photo(
    "hamsa.jpg",
    "Egyptian carnelian hand amulet, ca. 2150–1950 BC. Met 59.103.6. Later hamsa amulets are the same class of object: a hand worn for protection. This piece is Egyptian, not a North African hamsa.",
    MET,
    "https://www.metmuseum.org/art/collection/search/555583"
  ),
  baal: photo(
    "baal.jpg",
    "Canaanite bronze enthroned deity with gold foil, 14th–13th century BC. Met 32.161.45. The catalog names the type, not a lettered biblical Baal.",
    MET,
    "https://www.metmuseum.org/art/collection/search/322889"
  ),
  "golden-calf": photo(
    "golden-calf.jpg",
    "Egyptian bronze bull, 664–30 BC. Met 30.8.103. Israel’s calf was this form of image; this object is Egyptian, not the Sinai calf.",
    MET,
    "https://www.metmuseum.org/art/collection/search/570743"
  ),
  dagon: photo(
    "dagon.jpg",
    "Cloisters game piece: the blinded Samson led to the Philistine temple of Dagon, ca. 1150. Met 1988.158. Medieval ivory of the Judges 16 scene, not a Philistine cult statue.",
    MET,
    "https://www.metmuseum.org/art/collection/search/469912"
  ),

  "sunday-sabbath": photo(
    "sunday-sabbath.jpg",
    "Copper nummus of Constantine I with reverse SOLI INVICTO COMITI — Sol as Constantine’s companion. Portable Antiquities Scheme FindID 814587. The coin names the Unconquered Sun, not a church Sabbath.",
    COMMONS,
    commons("'SOLI INVICTO COMITI' nummus of Constantine I (FindID 814587).jpg")
  ),
  christmas: photo(
    "christmas.jpg",
    "Gerard van Honthorst, Adoration of the Shepherds, 1622. Public-domain painting of the nativity scene later tied to 25 December.",
    COMMONS,
    commons("Gerard van Honthorst - Adoration of the Shepherds (1622).jpg")
  ),
  "christmas-trees": photo(
    "christmas-trees.jpg",
    "A decorated Weihnachtsbaum — a German indoor Christmas tree as later households still raise it.",
    COMMONS,
    commons("Weihnachtsbaum.jpg")
  ),
  easter: photo(
    "easter.jpg",
    "A pysanka, a decorated Easter egg. Catalogued folk object, not a claim that the egg is commanded in Scripture.",
    COMMONS,
    commons("Pysanka.jpg")
  ),
  birthdays: photo(
    "birthdays.jpg",
    "A birthday cake with candles — the ordinary modern feast form.",
    COMMONS,
    commons("Birthday cake.jpg")
  ),
  "wedding-rings": photo(
    "wedding-rings.jpg",
    "A pair of gold wedding rings. This is the later household custom, not a Torah command.",
    COMMONS,
    commons("Wedding rings.jpg")
  ),
  mistletoe: photo(
    "mistletoe.jpg",
    "Viscum album, European mistletoe, photographed as the living plant.",
    COMMONS,
    commons("Viscum album 002.JPG")
  ),
  crosses: photo(
    "crosses.jpg",
    "The Gero Cross (Gerokreuz) in Cologne Cathedral, a monumental medieval crucifix.",
    COMMONS,
    commons("Gerokreuz full 20050903.jpg")
  ),
  halloween: photo(
    "halloween.jpg",
    "A carved jack-o’-lantern, 31 October 2003. The later household face of All Hallows’ Eve.",
    COMMONS,
    commons("Jack-o'-Lantern 2003-10-31.jpg")
  ),
  "new-year": photo(
    "new-year.jpg",
    "Marble bust of two-faced Janus in the Vatican Museums. January is named for this doorway god.",
    COMMONS,
    commons("Janus-Vatican.JPG")
  ),
  "lent-carnival": photo(
    "lent-carnival.jpg",
    "Masks and costume at the Venice Carnival — the feast immediately before Lent.",
    COMMONS,
    commons("Venice Carnival.jpg")
  ),
  valentines: photo(
    "valentines.jpg",
    "Boxed nineteenth-century Valentine’s Day card. Metropolitan Museum photograph on Commons (MET DP821159).",
    COMMONS,
    commons("Boxed Valentine's Day Card MET DP821159.jpg")
  ),
  santa: photo(
    "santa.jpg",
    "Thomas Nast, Merry Old Santa Claus, Harper’s Weekly, 1 January 1881. Public-domain wood engraving.",
    COMMONS,
    commons("MerryOldSanta.jpg")
  ),
  weekdays: photo(
    "weekdays.jpg",
    "Mars and his children, from the medieval Hausbuch of Wolfegg (after 1480). Planetary gods are how the weekday names were pictured.",
    COMMONS,
    commons("Hausbuch Wolfegg 13r Mars.jpg")
  ),
  months: photo(
    "months.jpg",
    "November page from the Chronograph of 354, the Roman calendar that also lists 25 December as Natalis Invicti.",
    COMMONS,
    commons("Chronography of 354 Mensis November.png")
  ),
  images: photo(
    "images.jpg",
    "Christ mosaic from Ravenna. A catalogued likeness used in worship, stored here as the class of image the second commandment names.",
    COMMONS,
    commons("Christus Ravenna Mosaic.jpg")
  ),
  horoscopes: photo(
    "horoscopes.jpg",
    "Johannes Vermeer, The Astronomer, 1668. A globe and chart on the table — the later household face of reading the heavens.",
    COMMONS,
    commons("Johannes Vermeer - The Astronomer - 1668.jpg")
  ),
  "luck-charms": photo(
    "luck-charms.jpg",
    "An iron horseshoe (Hufeisen), the ordinary luck-charm still nailed over doors.",
    COMMONS,
    commons("Hufeisen.jpg")
  ),
  "talking-boards": photo(
    "talking-boards.jpg",
    "Kennard Novelty Company Ouija board. Published talking-board plate, not a photograph of a spirit.",
    COMMONS,
    commons("Ouija board - Kennard Novelty Company.png")
  ),
  "may-day": photo(
    "may-day.jpg",
    "Maypole dancing on an English village green (geograph 1628839). A different photograph from the Met needlework used for the maypole symbol.",
    COMMONS,
    commons("Maypole Dancing on Village Green - geograph.org.uk - 1628839.jpg")
  ),
  "queen-of-heaven": photo(
    "queen-of-heaven.jpg",
    "The Burney Relief, or Queen of the Night, British Museum 2003,0718.1. Old Babylonian terracotta often discussed as Ishtar, Ereshkigal, or Lilitu — not a portrait of Jeremiah’s Queen of Heaven.",
    COMMONS,
    commons("British Museum Queen of the Night.jpg")
  ),

  "sun-cross": photo(
    "sun-cross.jpg",
    "A sun-cross, or solar wheel: equal-armed cross in a circle. Diagram of the sign, not a excavated cult object.",
    COMMONS,
    commons("Sun cross.svg")
  ),
  "oak-mistletoe": photo(
    "oak-mistletoe.jpg",
    "Viscum album growing on a host tree. A second plant photograph, distinct from the close-up used for the mistletoe custom.",
    COMMONS,
    commons("Viscum album 003.JPG")
  ),
  "pentagram-up": photo(
    "pentagram-up.jpg",
    "A five-pointed star, point up. Diagram of the sign.",
    COMMONS,
    commons("Pentagram.svg")
  ),
  "pentagram-down": photo(
    "pentagram-down.jpg",
    "An inverted five-pointed star. Diagram of the sign.",
    COMMONS,
    commons("Inverted pentagram.svg")
  ),
  pentacle: photo(
    "pentacle.jpg",
    "A pentagram enclosed in a circle. Diagram of the sign.",
    COMMONS,
    commons("Pentacle 2.svg")
  ),
  hexagram: photo(
    "hexagram.jpg",
    "A hexagram of two interlaced triangles. Diagram of the sign.",
    COMMONS,
    commons("Hexagram.svg")
  ),
  "unicursal-hexagram": photo(
    "unicursal-hexagram.jpg",
    "Unicursal hexagram, the one-line six-pointed star used in later Thelemic print.",
    COMMONS,
    commons("Unicursal hexagram.png")
  ),
  "chaos-star": photo(
    "chaos-star.jpg",
    "Eight arrows from a common centre — the modern chaos-star diagram.",
    COMMONS,
    commons("Symbol of Chaos.svg")
  ),
  "inverted-cross": photo(
    "inverted-cross.jpg",
    "The Cross of Saint Peter: a Latin cross inverted. Diagram of the sign.",
    COMMONS,
    commons("Saint Peter's Cross.svg")
  ),
  "leviathan-cross": photo(
    "leviathan-cross.jpg",
    "Alchemical sulfur sign later nicknamed the Leviathan cross. Diagram, not a photographed idol.",
    COMMONS,
    commons("Leviathan Cross.svg")
  ),
  "all-seeing-eye": photo(
    "all-seeing-eye.jpg",
    "The Eye of Providence as engraved on the reverse of the Great Seal on a United States one-dollar bill.",
    COMMONS,
    commons("All seeing eye.jpg")
  ),
  "baphomet-pentagram": photo(
    "baphomet-pentagram.jpg",
    "Éliphas Lévi’s 1856 Baphomet plate. A nineteenth-century occult drawing, not an ancient god-statue.",
    COMMONS,
    commons("Baphomet.png")
  ),
  "thor-hammer": photo(
    "thor-hammer.jpg",
    "Amulet copy of a Mjölnir find from Skåne, photographed 2010. Museum-type hammer pendant, not Thor himself.",
    COMMONS,
    commons("Amulet Thor's hammer (copy of find from Skåne) 2010-07-10.jpg")
  ),
  valknut: photo(
    "valknut.jpg",
    "The valknut: three locked triangles. Diagram of the sign.",
    COMMONS,
    commons("Valknut.svg")
  ),
  "triple-moon": photo(
    "triple-moon.jpg",
    "Triple-moon (waxing, full, waning) goddess sign. Modern diagram.",
    COMMONS,
    commons("Triple Goddess Symbol.svg")
  ),
  "pyramid-eye": photo(
    "pyramid-eye.jpg",
    "Reverse of the Great Seal of the United States: unfinished pyramid and eye. Official US diagram, distinct from the dollar-bill crop used for the all-seeing eye.",
    COMMONS,
    commons("Great Seal of the United States (reverse).svg")
  ),
  "number-666": photo(
    "number-666.jpg",
    "Papyrus 115 (P. Oxy. LXVI 4499), Revelation 13:18. A catalogued manuscript of the number, not a modern barcode.",
    COMMONS,
    commons("P. Oxy. LXVI 4499.jpg")
  ),
  "egg-hare": photo(
    "egg-hare.jpg",
    "An Osterhase, a German Easter hare with eggs. Folk figure, distinct from the pysanka used for the Easter custom.",
    COMMONS,
    commons("Osterhase.jpg")
  ),
  "janus-door": photo(
    "janus-door.jpg",
    "The Arch of Janus (Ianus Quadrifrons) in the Forum Boarium, Rome. A four-faced doorway monument, distinct from the Vatican Janus bust used for New Year.",
    COMMONS,
    commons("Arco di Giano.jpg")
  ),

  satan: photo(
    "satan.jpg",
    "John Martin, Satan Arousing the Fallen Angels (Paradise Lost, Book 1). Nineteenth-century Milton plate — not a photograph of Satan.",
    COMMONS,
    commons("John Martin - Satan Arousing the Fallen Angels, Book 1, line 314, from John Milton, Paradise Lost - Google Art Project.jpg")
  ),
  "serpent-dragon": photo(
    "serpent-dragon.jpg",
    "Lucas Cranach the Elder, Adam and Eve. Public-domain painting of the Genesis serpent, not a living dragon.",
    COMMONS,
    commons("Lucas Cranach the Elder - Adam and Eve - Google Art Project.jpg")
  ),
  devil: photo(
    "devil.jpg",
    "Michael Pacher, the Devil presenting St Augustine with the book of vices (c. 1480). Medieval altar painting.",
    COMMONS,
    commons("Michael Pacher 004.jpg")
  ),
  lucifer: photo(
    "lucifer.jpg",
    "Gustave Doré, Lucifer as king of Hell (Inferno). Engraving of Dante’s figure, not Isaiah’s fallen day-star as a portrait.",
    COMMONS,
    commons("Dore Lucifer.jpg")
  ),
  beelzebub: photo(
    "beelzebub.jpg",
    "Beelzebub plate from later infernal dictionaries. A printed catalog figure, not a photograph of the being.",
    COMMONS,
    commons("Beelzebub.png")
  ),
  belial: photo(
    "belial.jpg",
    "Belial as engraved in later occult catalogs. Printed plate only.",
    COMMONS,
    commons("Belial.jpg")
  ),
  abaddon: photo(
    "abaddon.jpg",
    "Thomas Stothard, Apollyon Defeated by Christian, about 1788 (Hood Museum P.960.47.2.1). Bunyan’s Apollyon, the English name of Abaddon.",
    COMMONS,
    commons("Pilgrim's Progress, Apollyon Defeated by Christian, by Thomas Stothard, about 1788, from the Hood Museum of Art - P.960.47.2.1.jpg")
  ),
  legion: photo(
    "legion.jpg",
    "Briton Rivière, The Miracle of the Gadarene Swine. Painting of Mark 5 / Luke 8, not a portrait of Legion.",
    COMMONS,
    commons("The Miracle of the Gadarene Swine - Google Art Project.jpg")
  ),
  python: photo(
    "python.jpg",
    "Apollo slaying Python, sculptural group photographed in the Netherlands. Classical Python of Delphi, the name Acts 16 still uses.",
    COMMONS,
    commons("Netherlands-4043 - Apollo slays Python - 1850 (11649049414).jpg")
  ),
  azazel: photo(
    "azazel.jpg",
    "William Holman Hunt, The Scapegoat. The Leviticus 16 goat sent to Azazel — a painting of the rite, not of a demon.",
    COMMONS,
    commons("William Holman Hunt - The Scapegoat.jpg")
  ),
  seirim: photo(
    "seirim.jpg",
    "Marble statue of Pan (Met DT6835). Goat-legged rustic god; stored as the later visual class of seirim, not a Leviticus photograph.",
    COMMONS,
    commons("Marble statue of Pan MET DT6835.jpg")
  ),
  lilith: photo(
    "lilith.jpg",
    "John Collier, Lilith (1892). A Victorian painting of the later folklore figure, not Isaiah 34:14 as a portrait.",
    COMMONS,
    commons("Lilith (John Collier painting).jpg")
  ),
  asmodeus: photo(
    "asmodeus.jpg",
    "Asmodeus as engraved in later infernal catalogs. Printed plate; Tobit names the spirit, this is not his photograph.",
    COMMONS,
    commons("Asmodeus.jpg")
  ),
  "familiar-spirits": photo(
    "familiar-spirits.jpg",
    "The Witch of Endor. Public-domain painting of 1 Samuel 28, the necromancer scene Scripture already records.",
    COMMONS,
    commons("Witch of Endor.jpg")
  ),
  mammon: photo(
    "mammon.jpg",
    "George Frederic Watts, Mammon, 1884–85. Tate N01630. Allegorical painting of wealth as a tyrant, not a cult statue.",
    COMMONS,
    commons("Watts – Mammon.jpg")
  ),
  leviathan: photo(
    "leviathan.jpg",
    "Gustave Doré, Destruction of Leviathan. Engraving of the Isaiah / Job sea-monster, not a living animal.",
    COMMONS,
    commons("Destruction of Leviathan.png")
  ),
  "prince-persia": photo(
    "prince-persia.jpg",
    "Relief from Persepolis. Achaemenid stonework from the land Daniel names; not a portrait of the prince of Persia.",
    COMMONS,
    commons("Persepolis relief.jpg")
  ),
  ashtoreth: photo(
    "ashtoreth.jpg",
    "Terracotta votary figurines from the sanctuary of Astarte at Kamelarga, Cyprus, 600–500 BC. Ashmolean. The goddess type Scripture names Ashtoreth; these are Cypriot offerings, not Israel’s groves.",
    COMMONS,
    commons("Terracotta votary figurine(s) from sanctuary of Astarte at Kamelarga, Cyprus 600-500 BCE Ashmolean Museum 17.jpg")
  ),
  molech: photo(
    "molech.jpg",
    "Foster Bible Pictures: Offering to Molech. A nineteenth-century Bible illustration of the rite, not a surviving cult statue.",
    COMMONS,
    commons("Foster Bible Pictures 0074-1 Offering to Molech.jpg")
  ),
  chemosh: photo(
    "chemosh.jpg",
    "The Mesha Stele (Louvre AO 5066). Moab’s king boasts in Chemosh’s name. The stone is the catalogued object; it is not a statue of Chemosh.",
    COMMONS,
    commons("F4171 Louvre stele de Mesha AO5066 rwk.jpg")
  ),
  tammuz: photo(
    "tammuz.jpg",
    "Terracotta tablet from Nippur: Inanna prefers the farmer; Dumuzi (Tammuz) is named in the myth. Ancient Orient Museum, Istanbul.",
    COMMONS,
    commons("Inanna prefers the farmer. Enkimdu and Damuzi were mentioned. Terracotta tablet from Nippur, Iraq. 1st half of the 2nd millennium BCE. Ancient Orient Museum, Istanbul.jpg")
  ),
  "queen-heaven": photo(
    "queen-heaven.jpg",
    "Glazed-brick lion from the Processional Way of the Ishtar Gate, Pergamon Museum, Babylon ca. 575 BC. Ishtar’s animal on the gate; not a portrait of Jeremiah’s Queen of Heaven.",
    COMMONS,
    commons("A lion on the Ishtar Gate of Babylon reconstructed with original bricks at the Pergamon Museum in Berlin 575 BCE (3) (32577951406).jpg")
  ),
  "gad-meni": photo(
    "gad-meni.jpg",
    "Marble head of Fortuna Huiusce Diei (Fortune of This Day). Museum bust of the Roman fortune-goddess; Isaiah 65 names Gad and Meni, this is not their portrait.",
    COMMONS,
    commons("Fortuna huiusce diei - Head.jpg")
  ),
  "binsfeld-princes": photo(
    "binsfeld-princes.jpg",
    "Title page of Peter Binsfeld’s 1591 Tractat von Bekanntnuß der Zauberer und Hexen. The treatise that later lists seven princes; this is the printed book, not the princes.",
    COMMONS,
    "https://commons.wikimedia.org/wiki/Category:Peter_Binsfeld"
  ),
  "goetia-note": photo(
    "goetia-note.jpg",
    "Title design of The Book of the Goetia of Solomon the King (Mathers / Crowley, 1904). Internet Archive scan of the published grimoire. Identified, not reproduced as a working rite.",
    "Internet Archive, public-domain 1904 edition",
    "https://archive.org/details/ac_goetia"
  ),
  plancy: photo(
    "plancy.jpg",
    "Portrait of Jacques Collin de Plancy, compiler of the Dictionnaire Infernal. Historical photograph of the author, not a spirit.",
    COMMONS,
    "https://commons.wikimedia.org/wiki/Category:Jacques_Collin_de_Plancy"
  ),
  "crowley-aiwass": photo(
    "crowley-aiwass.jpg",
    "The Stele of Ankh-ef-en-Khonsu (Stele of Revealing), Cairo Museum, with the modern ‘666’ tag in the display. Egyptian funerary stele later used by Crowley; not a photograph of Aiwass.",
    COMMONS,
    commons("666-Stele of revealing- tag from Cairo Museum.jpg")
  ),
  "watchers-genesis": photo(
    "watchers-genesis.jpg",
    "Pieter Bruegel the Elder, The Fall of the Rebel Angels. Painting of rebel angels; Genesis 6 names the sons of God, this is later art, not a photograph of the Watchers.",
    COMMONS,
    commons("Pieter Bruegel the Elder - The Fall of the Rebel Angels - Google Art Project.jpg")
  ),
  semjaza: photo(
    "semjaza.jpg",
    "Gustave Doré, Paradise Lost, the rebel host. Engraving of Milton’s fallen angels; 1 Enoch names Semjaza, this is not his portrait.",
    COMMONS,
    commons("Paradise Lost 1.jpg")
  ),
  "enoch-teachings": photo(
    "enoch-teachings.jpg",
    "Cover of R. H. Charles, The Book of Enoch (1917, Translations of Early Documents). The published English of 1 Enoch, not a Ge’ez leaf.",
    COMMONS,
    commons("The book of Enoch. Robert Charles. 1917 (IA bookofenoch0000unse).pdf")
  ),
  "jude-watchers": photo(
    "jude-watchers.jpg",
    "Jude the Apostle as later Christian art pictures him. The epistle cites Enoch; this is not a photograph of the Watchers.",
    COMMONS,
    commons("Jude the Apostle.jpg")
  ),
  "peter-tartarus": photo(
    "peter-tartarus.jpg",
    "Saint Peter as later Christian art pictures him. 2 Peter names tartarus; this is not a picture of that prison.",
    COMMONS,
    commons("Saint Peter.jpg")
  ),
  "rev-dragon-angels": photo(
    "rev-dragon-angels.jpg",
    "William Blake, The Great Red Dragon and the Woman Clothed with the Sun. Watercolour of Revelation 12, not a photograph of the dragon.",
    COMMONS,
    commons("William Blake 003.jpg")
  ),
  mastema: photo(
    "mastema.jpg",
    "Title page of R. H. Charles, The Book of Jubilees or The Little Genesis (London, 1902). Jubilees is the book that names Mastema; this is the published title, not a portrait.",
    "Internet Archive, public-domain 1902 edition",
    "https://archive.org/details/bookofjubileesor00char"
  ),
  shedim: photo(
    "shedim.jpg",
    "Assyrian Pazuzu figurine. A Mesopotamian wind-demon type later compared with shedim; Deuteronomy 32:17 names shedim, this object is not lettered with that word.",
    COMMONS,
    commons("Pazuzu.jpg")
  ),
  rahab: photo(
    "rahab.jpg",
    "William Blake, Behemoth and Leviathan, 1825 (NGA 819). Isaiah uses Rahab as a sea-monster name; this is Blake’s Job plate, not a portrait of Rahab of Jericho or of the dragon.",
    COMMONS,
    commons("William Blake, Behemoth and Leviathan, 1825, NGA 819.jpg")
  ),
};

export function evidencePhotoFor(id) {
  return HOLIDAY_EVIDENCE_PHOTOS[id] || null;
}

export function evidencePhotoIdForCustom(customId) {
  return HOLIDAY_EVIDENCE_PHOTOS[customId] ? customId : "";
}

export function evidencePhotoIdForName(nameId) {
  return HOLIDAY_EVIDENCE_PHOTOS[nameId] ? nameId : "";
}

export function photoIdForHolidayItem(_kind, item) {
  return item?.id && HOLIDAY_EVIDENCE_PHOTOS[item.id] ? item.id : "";
}
