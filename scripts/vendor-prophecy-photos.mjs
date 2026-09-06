#!/usr/bin/env node
/**
 * Download named public-domain / Commons photographs for Prophecy watch cards.
 * Uses Special:FilePath (not the query API) and sleeps between requests.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "TheTruthApp/1.0 (self-hosted archive; prophecy-watch photographs)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DIRECT = [
  {
    dest: "public/evidence/prophecy/israel-from-space.jpg",
    url: "https://eol.jsc.nasa.gov/DatabaseImages/ESC/large/ISS040/ISS040-E-74022.JPG",
  },
  {
    dest: "public/evidence/prophecy/ezekiel-nations.jpg",
    url: "https://eol.jsc.nasa.gov/DatabaseImages/ESC/large/ISS053/ISS053-E-50422.JPG",
  },
  {
    dest: "public/evidence/prophecy/euphrates.jpg",
    url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/36000/36972/euphrates_tmo_2009009_lrg.jpg",
  },
];

const COMMONS = [
  {
    dest: "public/evidence/prophecy/cano-cristales.jpg",
    files: [
      "Caño Cristales 01.jpg",
      "Caño Cristales, Colombia.jpg",
      "Los Ocho en Caño Cristales.jpg",
      "Cascadas Manto de La Virgen - Caño Cristales - La Macarena - Meta - Colombia.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/norilsk-red.jpg",
    files: [
      "Norilsk oil spill may 31 2020 sentinel-2 esa.jpg",
      "Leaked diesel fuel in the River Ambarnaya, near Norilsk, Siberia, Krasnoyarsk Krai, Russia, on May 31st and June 1st, 2020. (49982094662).jpg",
      "Diesel oil spill in Arctic Circle.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/yangtze-chongqing.jpg",
    files: [
      "Yangtze River Cruise Chongqing 20181122.jpg",
      "Dafosi Yangtze River Bridge in Chongqing city.jpg",
      "Industry on the river at Chongqing in 1988.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/gardon.jpg",
    files: [
      "Gardon near Pont du Gard 05.jpg",
      "View of Gardon from Pont du Gard 02.jpg",
      "Gardon at Colias.JPG",
    ],
  },
  {
    dest: "public/evidence/prophecy/riachuelo.jpg",
    files: [
      "Buenos Aires - Riachuelo, La Boca.jpg",
      "Buenos Aires Riachuelo 3.jpg",
      "Buenos Aires Riachuelo 2.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/jian-river.jpg",
    files: [
      "20260503 Jian River near Hangu Pass.jpg",
      "Industry on the river at Chongqing in 1988.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/animas-gold-king.jpg",
    files: [
      "Animas River spill 2015-08-06.JPG",
      "Gold King Mine - August 14, 2015 (20442774009).jpg",
      "Gold King Mine - November 2015 (23011362543).jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/little-colorado.jpg",
    files: [
      "Muddy Little Colorado River (50533480408).jpg",
      "USA little colorado pano AZ.jpg",
      "Little Colorado River confluence with Big Canyon.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/bermejo.jpg",
    files: [
      "Bermejo river seen to the North of the bridge Mansilla-Eva Perón.JPG",
      "Rio Bermejo - panoramio.jpg",
      "Rio bermejo(pcia. roca -chaco)-.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/hong-red-river.jpg",
    files: [
      "Vietnam, Hanoi, Red River.jpg",
      "Vietnam, Hanoi, Panoramic view of Red River.jpg",
      "Along the Red River in Hanoi 24.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/red-heifers.jpg",
    files: [
      "Red Poll heifers.JPG",
      "Red Angus Heifer.jpg",
      "Red angus cows oregon.jpg",
      "(Red Angus cattle at Till Farm in Orangeburg) 20191022-OSEC-LSC-1089.jpg",
      "Red Angus Cow.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/red-heifer-ordinance.jpg",
    files: [
      "The Phillip Medhurst Picture Torah 556. The sacrifice of the red heifer. Numbers cap 19 v 2. Heuman.jpg",
      "The Phillip Medhurst Picture Torah 557. Purification by the red heifer. Numbers cap 19 vv 1-10. Caspar Luyken.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/rio-tinto.jpg",
    files: [
      "Rio tinto river CarolStoker NASA Ames Research Center.jpg",
      "Rio Tinto (river).jpg",
      "Rio Tinto - Red river - Spain.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/blood-falls.jpg",
    files: [
      "Blood Falls by Peter Rejcek.jpg",
      "Blood Falls in the McMurdo Dry Valleys in Antarctica (30877662646).jpg",
      "Blood Falls, Taylor Glacier.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/dead-sea-springs.jpg",
    files: [
      "Underwater Fresh Water Springs in the Dead Sea, 2012.jpg",
      "PikiWiki Israel 34293 Einot Tsukim nature reserve.JPG",
      "Dead Sea sinkholes.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/ein-feshkha.jpg",
    files: [
      "PikiWiki Israel 34293 Einot Tsukim nature reserve.JPG",
      "Einot Tsukim.jpg",
      "Ain Feshkha.jpg",
      "Ein Feshkha nature reserve.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/temple-menorah.jpg",
    files: [
      "The Golden Menorah replica in Jerusalem.jpg",
      "Menora.JPG",
      "Old Jerusalem Golden Menorah replica.jpg",
      "Model of the Menorah Temple - next to the Temple Institute.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/temple-menorah-cardo.jpg",
    files: [
      "Old Jerusalem Golden Menorah replica in the Cardo.jpg",
      "Old Jerusalem Golden Menorah replica.jpg",
      "Menora.JPG",
    ],
  },
  {
    dest: "public/evidence/prophecy/hebrew.jpg",
    files: ["Portrait of Eliezer Ben-Yehuda (cropped).jpg", "Portrait of Eliezer Ben-Yehuda (id.34235240).jpg"],
  },
  {
    dest: "public/evidence/prophecy/temple-mount.jpg",
    files: [
      "Jerusalem Temple Mount view from Mount of Olives (6035890417).jpg",
      "View of Jerusalem from Mount of Olives.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/euphrates.jpg",
    files: ["Euphrates river - panoramio.jpg", "Bridge over the Euphrates (16860250421).jpg"],
  },
  {
    dest: "public/evidence/prophecy/truman-israel.jpg",
    files: [
      "Harry S Truman, bw half-length photo portrait, facing front, 1945.jpg",
      "TRUMAN 58-766-06.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/gospel-nations.jpg",
    files: [
      "King-James-Version-Bible.jpg",
      "1611 King James Bible.jpg",
      "Holy-Bible.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/un-headquarters.jpg",
    files: [
      "UN Headquarters.jpg",
      "United Nations HQ.jpg",
      "ONU New York.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/ongoing-aliyah.jpg",
    files: [
      "Ben Gurion International Airport (1).jpg",
      "TLV Airport.jpg",
      "Ben Gurion Airport terminal 3.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/abraham-accords.jpg",
    files: [
      "Abraham Accords 2020.jpg",
      "Abraham Accords signing.jpg",
      "Abraham Accords White House ceremony.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/us-embassy-jerusalem.jpg",
    files: [
      "US Embassy in Jerusalem.jpg",
      "American Embassy Jerusalem.jpg",
      "Embassy of the United States, Jerusalem.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/mandate.jpg",
    files: [
      "Map of Mandatory Palestine.jpg",
      "Mandatory Palestine map.jpg",
      "Palestine 1920 map.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/law-of-return.jpg",
    files: [
      "Jewish refugees ship Israel.jpg",
      "Immigrants arriving in Israel.jpg",
      "Ma'abarot 1950.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/ethiopian-aliyah.jpg",
    files: [
      "Beta Israel women.jpg",
      "Ethiopian Jews Israel.jpg",
      "Operation Solomon aircraft.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/soviet-aliyah.jpg",
    files: [
      "Olim from Soviet Union.jpg",
      "FSU immigrants Israel.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/buy-sell.jpg",
    files: ["Payment terminal in a shop.jpg", "Card payment terminal.jpg"],
  },
];

const LEGACY = [
  {
    dest: "public/evidence/prophecy/balfour.jpg",
    files: ["Balfour declaration unmarked.jpg"],
  },
  {
    dest: "public/evidence/prophecy/mandate.jpg",
    files: [
      "Mandate for Palestine map.jpg",
      "Palestine Mandate map 1922.jpg",
      "Map of Mandate for Palestine.jpg",
      "British Mandate of Palestine 1920.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/un-181.jpg",
    files: [
      "UN Partition Plan For Palestine 1947.svg",
      "1947-UN-Partition-Plan-1949-Armistice-Comparison.svg",
      "United Nations General Assembly hall.jpg",
      "UN General Assembly.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/israel-independence.jpg",
    files: [
      "Declaration of State of Israel 1948.jpg",
      "Flickr - Government Press Office (GPO) - David Ben Gurion reading the Declaration of Independence.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/truman-israel.jpg",
    files: [
      "Press release announcing US recognition of Israel.jpg",
      "Truman Recognizes Israel.jpg",
      "Harry Truman 1948.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/law-of-return.jpg",
    files: [
      "Immigrants to Israel 1948.jpg",
      "Haifa immigrants 1949.jpg",
      "Jewish immigrants Israel 1950.jpg",
      "Atlit Detention Camp.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/hebrew.jpg",
    files: ["Eliezer Ben-Yehuda.jpg"],
  },
  {
    dest: "public/evidence/prophecy/western-wall.jpg",
    files: ["Western Wall, Jerusalem.jpg", "Western Wall Jerusalem.jpg", "Kotel.JPG"],
  },
  {
    dest: "public/evidence/prophecy/ethiopian-aliyah.jpg",
    files: [
      "Beta Israel.jpg",
      "Ethiopian Jewish women Israel.jpg",
      "Operation Moses.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/soviet-aliyah.jpg",
    files: [
      "Soviet olim Israel.jpg",
      "Russian immigrants Israel 1991.jpg",
      "Aliyah 1990s.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/ongoing-aliyah.jpg",
    files: ["Ben Gurion Airport.jpg", "Ben-Gurion International Airport.jpg"],
  },
  {
    dest: "public/evidence/prophecy/un-headquarters.jpg",
    files: [
      "United Nations Headquarters in New York City, 8. Feb 2013.jpg",
      "UN Headquarters New York.jpg",
      "United Nations HQ New York.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/gospel-nations.jpg",
    files: ["Authorized King James Version.jpg", "King James Bible.jpg", "Open Bible 1769.jpg"],
  },
  {
    dest: "public/evidence/prophecy/wars-nations.jpg",
    files: ["UN Security Council chamber.jpg", "United Nations Security Council.jpg"],
  },
  {
    dest: "public/evidence/prophecy/temple-mount.jpg",
    files: [
      "Temple Mount (Aerial view, 2007) 1.jpg",
      "Jerusalem-2013(2)-Aerial-Temple Mount-Temple Mount (south exposure).jpg",
      "View of Temple Mount from Mount of Olives.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/buy-sell.jpg",
    files: ["Credit card payment terminal.jpg", "POS-Terminal.jpg", "EC-Cash Terminal.jpg"],
  },
  {
    dest: "public/evidence/prophecy/abraham-accords.jpg",
    files: [
      "Abraham Accords - Trump, Abdullah, Netanyahu, Al Zayani (50363274738).jpg",
      "President Trump and the First Lady Participate in an Abraham Accords Signing Ceremony (50339970843).jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/us-embassy-jerusalem.jpg",
    files: [
      "US Embassy Jerusalem May 2018.jpg",
      "United States Embassy in Jerusalem.jpg",
      "U.S. Embassy Jerusalem opening.jpg",
    ],
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const type = res.headers.get("content-type") || "";
  if (type.includes("text/html")) throw new Error(`html ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function filePathUrl(name) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1600`;
}

async function save(rel, buf) {
  const dest = join(root, rel);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`ok  ${rel} (${buf.length} bytes)`);
}

async function exists(rel) {
  try {
    await access(join(root, rel));
    return true;
  } catch {
    return false;
  }
}

async function downloadDirect() {
  for (const item of DIRECT) {
    if (await exists(item.dest)) {
      console.log(`have ${item.dest}`);
      continue;
    }
    try {
      const buf = await fetchBuffer(item.url);
      if (buf.length < 8000) throw new Error("too small");
      await save(item.dest, buf);
    } catch (err) {
      console.error(`fail ${item.dest}: ${err.message}`);
    }
    await sleep(800);
  }
}

async function downloadCommons() {
  for (const item of COMMONS) {
    if (await exists(item.dest)) {
      console.log(`have ${item.dest}`);
      continue;
    }
    let got = false;
    for (const name of item.files) {
      await sleep(1600);
      try {
        const buf = await fetchBuffer(filePathUrl(name));
        if (buf.length < 8000) {
          console.error(`    skip ${name}: too small`);
          continue;
        }
        await save(item.dest, buf);
        console.log(`    ← ${name}`);
        got = true;
        break;
      } catch (err) {
        console.error(`    skip ${name}: ${err.message}`);
      }
    }
    if (!got) console.error(`fail ${item.dest}: no Commons file`);
  }
}

await downloadDirect();
await downloadCommons();
