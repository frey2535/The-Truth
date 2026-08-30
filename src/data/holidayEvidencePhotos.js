/** Stored public-domain photographs of catalogued objects. No drawings, no invented pictures. */

function photo(file, caption, credit, page) {
  return {
    src: `/evidence/holidays/${file}`,
    caption,
    credit,
    page,
  };
}

const MET = "Metropolitan Museum of Art, Open Access (public domain)";

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
    "radiate-crown.jpg",
    "The same radiate crown on Aurelian’s coin is the solar light later icons moved behind a holy head. Met 08.170.375.",
    MET,
    "https://www.metmuseum.org/art/collection/search/248055"
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
  "serpent-dragon": photo(
    "uraeus.jpg",
    "Gold and electrum uraeus (rearing cobra), Egypt, ca. 945–721 BC. Met 50.198.3.",
    MET,
    "https://www.metmuseum.org/art/collection/search/546039"
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
};

const CUSTOM_PHOTO = {
  crosses: "latin-cross",
  halloween: "skull",
  valentines: "cupid-heart",
  "sunday-sabbath": "sun-disk",
  images: "radiate-crown",
  "luck-charms": "eye-of-horus",
  easter: "ankh",
  christmas: "sun-disk",
  "christmas-trees": "evergreen",
  "wedding-rings": "circle-ring",
  horoscopes: "zodiac-wheel",
  "may-day": "maypole",
  "queen-of-heaven": "crescent-moon",
};

const NAME_PHOTO = {
  baal: "baal",
  "golden-calf": "golden-calf",
  "serpent-dragon": "serpent-dragon",
  dagon: "dagon",
  "queen-heaven": "crescent-moon",
};

export function evidencePhotoFor(id) {
  return HOLIDAY_EVIDENCE_PHOTOS[id] || null;
}

export function evidencePhotoIdForCustom(customId, relatedSymbolIds = []) {
  const mapped = CUSTOM_PHOTO[customId];
  if (mapped && HOLIDAY_EVIDENCE_PHOTOS[mapped]) return mapped;
  return relatedSymbolIds.find((id) => HOLIDAY_EVIDENCE_PHOTOS[id]) || "";
}

export function evidencePhotoIdForName(nameId) {
  const mapped = NAME_PHOTO[nameId];
  if (mapped && HOLIDAY_EVIDENCE_PHOTOS[mapped]) return mapped;
  return HOLIDAY_EVIDENCE_PHOTOS[nameId] ? nameId : "";
}

export function photoIdForHolidayItem(kind, item) {
  if (kind === "symbol") return item.id;
  if (kind === "custom") {
    const mapped = CUSTOM_PHOTO[item.id];
    return mapped && HOLIDAY_EVIDENCE_PHOTOS[mapped] ? mapped : "";
  }
  if (kind === "name") return evidencePhotoIdForName(item.id);
  return "";
}
