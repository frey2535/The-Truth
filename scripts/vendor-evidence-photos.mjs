#!/usr/bin/env node
/**
 * Download named public-domain / Commons photographs for Evidence cards.
 * Only stores a picture of the named object, site, or manuscript.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "TheTruthApp/1.0 (self-hosted archive; evidence photographs)";

const NASA = [
  {
    dest: "public/evidence/dead-sea.jpg",
    url: "https://images-assets.nasa.gov/image/PIA01916/PIA01916~orig.jpg",
  },
  {
    dest: "public/evidence/sinai-red-sea.jpg",
    url: "https://images-assets.nasa.gov/image/41g-120-180/41g-120-180~medium.jpg",
  },
  {
    dest: "public/evidence/gulf-of-aqaba.jpg",
    url: "https://images-assets.nasa.gov/image/iss071e183804/iss071e183804~medium.jpg",
  },
  {
    dest: "public/evidence/himalayas.jpg",
    url: "https://images-assets.nasa.gov/image/iss069e003192/iss069e003192~medium.jpg",
  },
];

const COMMONS = [
  { dest: "public/evidence/artifacts/ketef-hinnom.jpg", file: "Ketef hinom scrolls.JPG" },
  { dest: "public/evidence/artifacts/siloam-tunnel.jpg", file: "Hezekiah's Tunnel III.jpg" },
  { dest: "public/evidence/artifacts/babylonian-chronicle.jpg", file: "Nebuchadnezzar Chronicle.JPG" },
  { dest: "public/evidence/artifacts/jehoiachin-rations.jpg", file: "Jehoiachin Ration Tablet.JPG" },
  { dest: "public/evidence/artifacts/lachish-letter.jpg", file: "Lachish Letter III.jpg" },
  { dest: "public/evidence/artifacts/elephantine.jpg", file: "Cowley 30.jpg" },
  { dest: "public/evidence/artifacts/pool-siloam.jpg", file: "Pool of Siloam 2019.jpg" },
  { dest: "public/evidence/artifacts/ekron.jpg", file: "Ekron inscription.jpg" },
  { dest: "public/evidence/artifacts/nabonidus.jpg", file: "Nabonidus Cylinder Sippar BM.jpg" },
  { dest: "public/evidence/artifacts/shoshenq-karnak.jpg", file: "Bubastite Portal.jpg" },
  { dest: "public/evidence/artifacts/deir-alla.jpg", file: "Deir Alla inscription.jpg" },
  { dest: "public/evidence/artifacts/tutankhamun-chariot.jpg", file: "Tutankhamun chariot.jpg" },
  { dest: "public/evidence/artifacts/magdala.jpg", file: "Magdala stone.jpg" },
  { dest: "public/evidence/artifacts/bethesda.jpg", file: "Pool of Bethesda.jpg" },
  { dest: "public/evidence/artifacts/beni-hasan.jpg", file: "Beni Hasan Asiatics.jpg" },
  { dest: "public/evidence/artifacts/rekhmire-bricks.jpg", file: "Rekhmire tomb brickmaking.jpg" },
  { dest: "public/evidence/artifacts/nazareth-inscription.jpg", file: "Nazareth Inscription.jpg" },
  { dest: "public/evidence/artifacts/arad-ostracon.jpg", file: "Arad ostracon 18.jpg" },
  { dest: "public/evidence/artifacts/mount-sodom.jpg", file: "Mount Sodom.jpg" },
  { dest: "public/evidence/artifacts/bab-edh-dhra.jpg", file: "Bab edh-Dhra.jpg" },
  { dest: "public/evidence/artifacts/bar-kokhba.jpg", file: "Bar Kokhba letter.jpg" },
  { dest: "public/evidence/artifacts/samaria-ostracon.jpg", file: "Samaria Ostracon.jpg" },
];

const FALLBACKS = {
  "Cowley 30.jpg": ["Papyrus Amherst 63.jpg", "Elephantine papyri.jpg", "Brooklyn Papyrus 47.218.89.jpg"],
  "Nebuchadnezzar Chronicle.JPG": [
    "ABC 5.jpg",
    "Babylonian Chronicle for year 605-595.jpg",
    "BM 21946.jpg",
    "Jerusalem Chronicle.jpg",
  ],
  "Lachish Letter III.jpg": ["Lachish Letter IV.JPG", "Lachish ostracon.jpg", "Lachish letter 4.jpg"],
  "Pool of Siloam 2019.jpg": ["Pool of Siloam.jpg", "Siloam Pool 2005.jpg"],
  "Ekron inscription.jpg": ["Ekron Royal Dedicatory Inscription.jpg"],
  "Nabonidus Cylinder Sippar BM.jpg": ["Nabonidus cylinder from Sippar.jpg", "Cilindro de Nabonido.jpg"],
  "Bubastite Portal.jpg": ["Shoshenq I Karnak.jpg", "Shoshenq list.jpg"],
  "Deir Alla inscription.jpg": ["Deir Alla plaster.jpg", "Balaam inscription.jpg"],
  "Tutankhamun chariot.jpg": ["Chariot of Tutankhamun.jpg", "Tutankhamun's chariot.jpg"],
  "Magdala stone.jpg": ["Magdala synagogue.jpg", "Migdal synagogue stone.jpg"],
  "Pool of Bethesda.jpg": ["Bethesda pools Jerusalem.jpg", "Piscina Probatica.jpg"],
  "Beni Hasan Asiatics.jpg": ["Khnumhotep II Asiatics.jpg", "Beni Hassan procession.jpg"],
  "Rekhmire tomb brickmaking.jpg": ["TT100 brickmaking.jpg", "Rekhmire bricks.jpg"],
  "Nazareth Inscription.jpg": ["Nazareth edict.jpg", "Nazareth Decree.jpg"],
  "Arad ostracon 18.jpg": ["Arad Ostracon 18.jpg", "Tel Arad ostracon.jpg"],
  "Mount Sodom.jpg": ["Jebel Usdum.jpg", "Mount Sedom.jpg"],
  "Bab edh-Dhra.jpg": ["Bab edh Dhra.jpg", "Bab edh-Dhra cemetery.jpg"],
  "Bar Kokhba letter.jpg": ["Bar Kokhba papyrus.jpg", "Nahal Hever letter.jpg"],
  "Samaria Ostracon.jpg": ["Samaria ostraca.jpg", "Samaria ostracon 1.jpg"],
  "Hezekiah's Tunnel III.jpg": ["Hezekiahs Tunnel.jpg", "Hezekiah's tunnel.jpg"],
};

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function commonsUrl(title) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("titles", title.startsWith("File:") ? title : `File:${title}`);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|extmetadata|size");
  api.searchParams.set("iiurlwidth", "1600");
  api.searchParams.set("format", "json");
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`commons api ${res.status}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing != null || !page.imageinfo?.[0]) return null;
  const info = page.imageinfo[0];
  return {
    url: info.thumburl || info.url,
    license: info.extmetadata?.LicenseShortName?.value || "",
    artist: String(info.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 120),
  };
}

async function save(rel, buf) {
  const dest = join(root, rel);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`ok  ${rel} (${buf.length} bytes)`);
}

async function downloadNasa() {
  for (const item of NASA) {
    try {
      await save(item.dest, await fetchBuffer(item.url));
    } catch (err) {
      console.error(`fail ${item.dest}: ${err.message}`);
    }
  }
}

async function downloadCommons() {
  for (const item of COMMONS) {
    const names = [item.file, ...(FALLBACKS[item.file] || [])];
    let got = null;
    for (const name of names) {
      try {
        const meta = await commonsUrl(name);
        if (!meta) continue;
        const buf = await fetchBuffer(meta.url);
        if (buf.length < 8000) continue;
        got = { ...meta, name };
        await save(item.dest, buf);
        console.log(`    ← ${name}  ${meta.license}  ${meta.artist}`);
        break;
      } catch (err) {
        console.error(`    skip ${name}: ${err.message}`);
      }
    }
    if (!got) console.error(`fail ${item.dest}: no Commons file`);
  }
}

await downloadNasa();
await downloadCommons();
