/**
 * Store public-domain collected editions used by the library.
 * Does not invent lost books. Does not download copyrighted modern translations.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function ccel(id) {
  return `https://ccel.org/ccel/s/schaff/${id}/cache/${id}.txt`;
}

const FILES = [
  { rel: "public/corpus/fathers/ante-nicene-vol2.txt", url: ccel("anf02") },
  { rel: "public/corpus/fathers/ante-nicene-vol3.txt", url: ccel("anf03") },
  { rel: "public/corpus/fathers/ante-nicene-vol4.txt", url: ccel("anf04") },
  { rel: "public/corpus/fathers/ante-nicene-vol5.txt", url: ccel("anf05") },
  { rel: "public/corpus/fathers/ante-nicene-vol6.txt", url: ccel("anf06") },
  { rel: "public/corpus/fathers/ante-nicene-vol7.txt", url: ccel("anf07") },
  { rel: "public/corpus/fathers/ante-nicene-vol8.txt", url: ccel("anf08") },
  { rel: "public/corpus/fathers/ante-nicene-vol9.txt", url: ccel("anf09") },
  { rel: "public/corpus/fathers/josephus-apion.txt", url: "https://www.gutenberg.org/files/2849/2849.txt" },
  { rel: "public/corpus/catalog/pistis-sophia.txt", url: "https://www.gutenberg.org/ebooks/76266.txt.utf-8" },
  { rel: "public/corpus/catalog/forgotten-books-of-eden.txt", url: "https://www.gutenberg.org/ebooks/398.txt.utf-8" },
  { rel: "public/corpus/catalog/imitation-of-christ.txt", url: "https://www.gutenberg.org/files/1653/1653-0.txt" },
  { rel: "public/corpus/catalog/tacitus-annals.txt", url: "https://www.gutenberg.org/ebooks/7841.txt.utf-8" },
  { rel: "public/corpus/catalog/pliny-letters.txt", url: "https://www.gutenberg.org/ebooks/2811.txt.utf-8" },
  { rel: "public/corpus/fathers/npnf101.txt", url: ccel("npnf101") },
  { rel: "public/corpus/fathers/npnf102.txt", url: ccel("npnf102") },
  { rel: "public/corpus/fathers/npnf201.txt", url: ccel("npnf201") },
  { rel: "public/corpus/fathers/npnf204.txt", url: ccel("npnf204") },
  { rel: "public/corpus/fathers/npnf214.txt", url: ccel("npnf214") },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (const item of FILES) {
    const path = join(root, item.rel);
    if (await exists(path)) {
      skip += 1;
      console.log("skip", item.rel);
      continue;
    }
    try {
      const res = await fetch(item.url, { redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status} ${item.url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error(`too small (${buf.length}) ${item.url}`);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, buf);
      ok += 1;
      console.log("saved", item.rel, buf.length);
    } catch (err) {
      fail += 1;
      console.error("FAIL", item.rel, err.message);
    }
  }
  console.log({ ok, skip, fail, total: FILES.length });
  if (fail) process.exitCode = 1;
}

main();
