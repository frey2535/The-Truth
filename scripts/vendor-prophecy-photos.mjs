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

const DIRECT = [];

const COMMONS = [
  {
    dest: "public/evidence/prophecy/cano-cristales.jpg",
    files: [
      "Los Ocho en Caño Cristales.jpg",
      "Caño Cristales, Colombia.jpg",
      "Caño Cristales 01.jpg",
      "Cascadas Manto de La Virgen - Caño Cristales - La Macarena - Meta - Colombia.jpg",
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
    dest: "public/evidence/prophecy/truman-israel.jpg",
    files: [
      "Harry S Truman, bw half-length photo portrait, facing front, 1945.jpg",
      "TRUMAN 58-766-06.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/gospel-nations.jpg",
    files: [
      "King-James-Version-Bible-first-edition-title-page-1611.png",
      "King James Bible (1611) page A2v.png",
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
      "16-03-30-Ben Gurion International Airport-RalfR-DSCF7550.jpg",
      "16-03-30-Ben Gurion International Airport-RalfR-DSCF7547.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/abraham-accords.jpg",
    files: [
      "President Trump and The First Lady Participate in an Abraham Accords Signing Ceremony.jpg",
      "President Trump and The First Lady Participate in an Abraham Accords Signing Ceremony (50345635098).jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/us-embassy-jerusalem.jpg",
    files: [
      "US Embassy Jerusalem Dedication Ceremony, May 2018 (78).jpg",
      "US embassy in Jerusalem 2018-05-19 (41485240815).jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/mandate.jpg",
    files: [
      "Mandate for Palestine - AD 1923.png",
      "Map of the British Mandate of Palestine in 1947.png",
    ],
  },
  {
    dest: "public/evidence/prophecy/law-of-return.jpg",
    files: [
      "PikiWiki Israel 4738 olim (Immigrants) from Yemen.jpg",
      "PikiWiki Israel 6460 Immigration to Israel.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/ethiopian-aliyah.jpg",
    files: [
      "Flickr - Government Press Office (GPO) - Ethiopian immigrants coming off a Boeing jet.jpg",
      "Operation Solomon IDF Archives I.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/soviet-aliyah.jpg",
    files: [
      "New immigrants from the Soviet Union arrived at Lod airport today (FL61582361).jpg",
      "Another group of new immigrants from the Soviet Union arrived today (FL61732706).jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/buy-sell.jpg",
    files: [
      "Credit card terminal.jpg",
      "Payment terminal at self-checkout.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/waste-land.jpg",
    files: [
      "Yatir Forest, Israel no.1.jpg",
      "125840 negev agriculture and fields PikiWiki Israel.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/fig-tree.jpg",
    files: [
      "Ficus carica 001.jpg",
      "Common fig Ficus carica.jpg",
      "Fig tree.jpg",
      "Ficus carica.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/nations-parting.jpg",
    files: [
      "United Nations General Assembly hall.jpg",
      "UN General Assembly.jpg",
      "United Nations General Assembly.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/wars-nations.jpg",
    files: [
      "Chateau Wood Ypres 1917.jpg",
      "Chateau Wood near Ypres (2866720075).jpg",
      "Chateauwood.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/knowledge-increased.jpg",
    files: [
      "The Rose Main Reading Room NYC Public Library.jpg",
      "Reading room, Library of Congress, Washington, D.C., 1901.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/falling-away.jpg",
    files: [
      "Filey, St Oswald's church interior (33880566411).jpg",
      "St Andrew's church - the nave - geograph.org.uk - 1637048.jpg",
      "Killinghall Church 851.JPG",
    ],
  },
  {
    dest: "public/evidence/prophecy/false-christs.jpg",
    files: [
      "Luca Signorelli - Sermon and Deeds of the Antichrist - WGA21202.jpg",
      "Fra angelico luca signorelli orvieto.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/scoffers.jpg",
    files: [
      "Pieter Claesz, Still Life with a Skull and a Writing Quill.jpg",
      "Pieter Claesz - Vanitas Still Life - 943 - Mauritshuis.jpg",
      "Pieter Claesz - Vanitas, circa 1630.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/lovers-of-selves.jpg",
    files: [
      "Narcissus-Caravaggio (1594-96).jpg",
      "Caravaggio - Narcissus.jpg",
      "Narcissus by Caravaggio.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/whole-earth-see.jpg",
    files: [
      "Erdfunkstelle Raisting 05.jpg",
      "Erdfunkstelle Raisting 5.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/persia-ezekiel.jpg",
    files: [
      "Gate of All Nations, Persepolis.jpg",
      "Gate of All Nations Persepolis.jpg",
      "Apadana of Persepolis.jpg",
      "Persepolis Gate of Nations.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/persecution.jpg",
    files: [
      "The Christian Martyrs' Last Prayer - Jean-Léon Gérôme.jpg",
      "Jean-Léon Gérôme - The Christian Martyrs' Last Prayer.jpg",
      "Colosseum in Rome, Italy - April 2007.jpg",
      "Colosseum 2013.jpg",
    ],
  },
  {
    dest: "public/evidence/prophecy/days-of-noah.jpg",
    files: [
      "John Martin - Sodom and Gomorrah.jpg",
      "John Martin (1789-1854) - The Destruction of Sodom and Gomorrah - TWCMS , C6975 - Laing Art Gallery.jpg",
    ],
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
    files: ["Chateau Wood, Ypres, 29 October 1917.jpg", "The Taking of Vimy Ridge, Easter Monday 1917.jpg"],
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
