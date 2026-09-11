#!/usr/bin/env python3
"""
Store public-domain English of catalogued works that were listed but not stored.

Does not invent wording. Does not download modern copyrighted translations
(Meqabyan / Qalementos have no pre-1929 English in this set).
"""
from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path("/tmp/pd-src")
DEST = ROOT / "public" / "corpus" / "manuscripts"

UA = "TheTruthCorpusVendor/1.0 (public-domain text archival)"


def fetch(url: str, dest: Path, min_size: int = 8000) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size >= min_size:
        return dest
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as res:
        data = res.read()
    if len(data) < min_size:
        raise RuntimeError(f"too small ({len(data)}) {url}")
    dest.write_bytes(data)
    print(f"downloaded {dest.name} {len(data)}")
    return dest


def ia_txt(ident: str, filename: str | None = None) -> Path:
    name = filename or f"{ident}_djvu.txt"
    return fetch(
        f"https://archive.org/download/{ident}/{name}",
        CACHE / f"{ident}.txt",
    )


def collapse(text: str) -> str:
    text = text.replace("\r", "").replace("\u00ad", "")
    text = re.sub(r"(\w)-[ \t]*\n[ \t]*", r"\1", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text


def strip_junk(text: str) -> str:
    keep = []
    for line in text.split("\n"):
        t = line.strip()
        if not t:
            keep.append("")
            continue
        if re.fullmatch(r"\d{1,4}", t):
            continue
        if re.fullmatch(r"[ivxlcIVXLC.]{1,7}", t):
            continue
        letters = len(re.findall(r"[A-Za-z]", t))
        if len(t) > 12 and letters / max(len(t), 1) < 0.28:
            continue
        if re.fullmatch(r"[A-Z0-9][A-Z0-9 \.,'’\-:]{8,60}\s+\d{1,3}", t):
            continue
        keep.append(t)
    out = re.sub(r"\n{3,}", "\n\n", "\n".join(keep)).strip()
    return out


def find_flex(text: str, needle: str, pos: int = 0) -> int:
    pat = re.compile(re.escape(needle).replace(r"\ ", r"\s+"), re.I)
    m = pat.search(text, pos)
    return m.start() if m else -1


def slice_between(text: str, start: str, end: str | None, start_occ: int = 0) -> str:
    idx = -1
    pos = 0
    for _ in range(start_occ + 1):
        idx = find_flex(text, start, pos)
        if idx < 0:
            raise RuntimeError(f"start not found: {start!r}")
        pos = idx + 1
    stop = len(text)
    if end:
        end_at = find_flex(text, end, idx + max(len(start), 8))
        if end_at < 0:
            raise RuntimeError(f"end not found: {end!r}")
        stop = end_at
    return text[idx:stop].strip()


def chapter_md(text: str) -> str:
    def repl(match: re.Match) -> str:
        raw = match.group(1)
        num = re.sub(r"[^0-9IVXLCDM]", "", raw.upper())
        return f"\n\n## Chapter {raw.strip()}\n\n"

    text = re.sub(
        r"(?m)^(CHAPTER|Chapter|BOOK|Book|ODE|Ode|Statute)\s+([IVXLCDM0-9]+[A-Z]?)\.?\s*$",
        lambda m: f"\n\n## {m.group(1).title()} {m.group(2)}\n\n",
        text,
    )
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def wrap(title: str, credit: str, body: str) -> str:
    body = chapter_md(strip_junk(body))
    body = re.sub(r"([.!?\"'])\n(\d+[.:]?\s)", r"\1\n\n\2", body)
    if len(body) < 1500:
        raise RuntimeError(f"{title}: extracted body too small ({len(body)})")
    return (
        f"# {title}\n\n"
        f"{credit}\n\n"
        "Public-domain English stored from a printed edition. "
        "The scan was cleaned for reading; wording was not invented.\n\n"
        f"{body}\n"
    )


def write_md(slug: str, contents: str) -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    path = DEST / f"{slug}.md"
    path.write_text(contents, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} {len(contents)}")


def odes_from_harris(text: str) -> str:
    m = re.search(r"ODE I\s+1 The Lord is upon my head", text, re.I)
    if not m:
        raise RuntimeError("Odes start missing")
    start = m.start()
    end_m = re.search(r"\nODE XLII\b", text[start:], re.I)
    if not end_m:
        raise RuntimeError("Ode XLII missing")
    end = start + end_m.start()
    after = text.find("\nODE ", end + 10)
    if after > 0:
        end = after
    else:
        end = min(len(text), end + 12000)
    chunk = text[start:end]
    parts = re.split(r"(?=\nODE [IVXL]+)", "\n" + chunk)
    kept = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        part = re.split(r"\nExpository Notes\.", part, maxsplit=1)[0].strip()
        if part:
            kept.append(part)
    return "\n\n".join(kept)


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)

    apot = collapse(ia_txt("apocryphapseudep02charuoft").read_text(errors="replace"))
    baruch1896 = collapse(ia_txt("theapocalypseofb00charuoft").read_text(errors="replace"))
    isaiah = collapse(ia_txt("cu31924014590529").read_text(errors="replace"))
    odes = collapse(ia_txt("odespsalmsofsolo0000rend").read_text(errors="replace"))
    terry = collapse(ia_txt("cu31924028930200").read_text(errors="replace"))
    aseneth = collapse(ia_txt("josephasenathcon00broo").read_text(errors="replace"))
    jobvol = collapse(ia_txt("semiticstudiesin00kohurich").read_text(errors="replace"))
    philo = collapse(ia_txt("biblicalantiquit00pseurich").read_text(errors="replace"))
    abraham = collapse(ia_txt("apocalypseofabrabgh00boxg").read_text(errors="replace"))
    cave = collapse(
        fetch(
            "https://archive.org/download/bookofcaveoftrea0000eawa/bookofcaveoftrea0000eawa_djvu.txt",
            CACHE / "cave-of-treasures.txt",
        ).read_text(errors="replace")
    )
    enoch3 = collapse(ia_txt("3enochorhebrewbo00unse").read_text(errors="replace"))
    didasc = collapse(ia_txt("cu31924096083336").read_text(errors="replace"))
    horner = collapse(ia_txt("statutesapostle00unkngoog").read_text(errors="replace"))
    cooper = collapse(ia_txt("cu31924029296170").read_text(errors="replace"))
    issa = collapse(ia_txt("cu31924091353445").read_text(errors="replace"))

    write_md(
        "2-baruch",
        wrap(
            "2 Baruch (Syriac Apocalypse of Baruch)",
            "English: R. H. Charles, *The Apocrypha and Pseudepigrapha of the Old Testament*, vol. 2 (Oxford, 1913).",
            slice_between(
                apot,
                "And it came to pass in the twenty-fifth year of Jeconiah, king of Judah",
                "THE GREEK APOCALYPSE OF BARUCH",
            ),
        ),
    )
    write_md(
        "3-baruch",
        wrap(
            "3 Baruch (Greek Apocalypse of Baruch)",
            "English: H. M. Hughes, in R. H. Charles, *APOT* vol. 2 (Oxford, 1913).",
            slice_between(
                apot,
                "A narrative and revelation of Baruch, concerning those ineffable things",
                "THE FOURTH BOOK OF EZRA",
            ),
        ),
    )
    write_md(
        "4-baruch",
        wrap(
            "4 Baruch (Paraleipomena of Jeremiah)",
            "English: Jacques Issaverdens, *The Uncanonical Writings of the Old Testament found in the Armenian MSS. of the Library of St. Lazarus* (Venice, 1901). Armenian recension of 4 Baruch / the Rest of the Words of Baruch.",
            slice_between(
                issa,
                "When God determined to deliver up Jerusalem into captivity",
                "CONCERNING THE TESTAMENTS",
            ),
        ),
    )
    write_md(
        "assumption-of-moses",
        wrap(
            "Assumption of Moses (Testament of Moses)",
            "English: R. H. Charles, *APOT* vol. 2 (Oxford, 1913), from his 1897 edition.",
            slice_between(
                apot,
                "1. The Testament of Moses even the things which he commanded",
                "THE BOOK OF THE SECRETS OF ENOCH",
            ),
        ),
    )
    # Charles 1900 mixes notes; take the translation opening through the Ethiopic-text appendix.
    try:
        isa_body = slice_between(
            isaiah,
            "1, And it came to pass in the twenty-sixth year",
            "ETHIOPIC VERSION",
            start_occ=0,
        )
    except RuntimeError:
        isa_body = slice_between(
            isaiah,
            "And it came to pass in the twenty-sixth year",
            None,
        )[:120000]
    if len(strip_junk(isa_body)) < 4000:
        # First hit is a short quotation; take a longer span from there.
        idx = isaiah.lower().find("and it came to pass in the twenty-sixth year")
        isa_body = isaiah[idx : idx + 160000]
    write_md(
        "ascension-of-isaiah",
        wrap(
            "Ascension of Isaiah",
            "English: R. H. Charles, *The Ascension of Isaiah* (London, 1900). Includes the Martyrdom and the Vision.",
            isa_body,
        ),
    )
    write_md(
        "odes-of-solomon",
        wrap(
            "Odes of Solomon",
            "English: J. Rendel Harris and Alphonse Mingana, *The Odes and Psalms of Solomon*, vol. 2 (Manchester / London, 1920). These are the Syriac Odes, not the Septuagint canticle list.",
            odes_from_harris(odes),
        ),
    )
    write_md(
        "sibylline-oracles",
        wrap(
            "Sibylline Oracles",
            "English: Milton S. Terry, *The Sibylline Oracles translated from the Greek into English blank verse* (New York / Cincinnati, 1890/1899).",
            slice_between(
                terry,
                "Of mortal men down to the very last",
                None,
            ),
        ),
    )
    write_md(
        "joseph-and-aseneth",
        wrap(
            "Joseph and Aseneth",
            "English: E. W. Brooks, *Joseph and Asenath: The Confession and Prayer of Asenath* (London: SPCK, 1918).",
            slice_between(
                aseneth,
                "In the first year of plenty, in the second",
                "I. (After p.",
            )
            if "I. (After p." in aseneth
            else slice_between(aseneth, "In the first year of plenty, in the second", None),
        ),
    )
    write_md(
        "testament-of-job",
        wrap(
            "Testament of Job",
            "English: Kaufmann Kohler, in *Semitic Studies in Memory of Rev. Dr. Alexander Kohut* (Berlin, 1897).",
            slice_between(
                jobvol,
                "On the day he became sick and (he) knew that he",
                "Aegyptische",
            ),
        ),
    )
    write_md(
        "pseudo-philo",
        wrap(
            "Pseudo-Philo (Biblical Antiquities)",
            "English: M. R. James, *The Biblical Antiquities of Philo* (London: SPCK, 1917).",
            slice_between(
                philo,
                "Adam begat three sons and one daughter",
                None,
            ),
        ),
    )
    write_md(
        "apocalypse-of-abraham",
        wrap(
            "Apocalypse of Abraham",
            "English: G. H. Box, *The Apocalypse of Abraham* (London: SPCK, 1918).",
            slice_between(
                abraham,
                "I. On the day when I planed the gods of my father",
                None,
            ),
        ),
    )
    write_md(
        "cave-of-treasures",
        wrap(
            "Cave of Treasures",
            "English: E. A. Wallis Budge, *The Book of the Cave of Treasures* (London, 1927).",
            slice_between(
                cave,
                "In the beginning, on the First Day, which was",
                None,
            )[:380000],
        ),
    )
    ridx = enoch3.lower().find("rabbi ishmael said:")
    if ridx < 0:
        raise RuntimeError("3 Enoch start missing")
    p3 = enoch3.lower().rfind("part iii")
    if p3 <= ridx:
        p3 = len(enoch3)
    write_md(
        "3-enoch",
        wrap(
            "3 Enoch (Hebrew Enoch / Sefer Hekhalot)",
            "English: Hugo Odeberg, *3 Enoch or The Hebrew Book of Enoch* (Cambridge, 1928).",
            enoch3[ridx:p3],
        ),
    )

    write_md(
        "ethiopic-didascalia",
        wrap(
            "Ethiopic Didascalia",
            "English: J. M. Harden, *The Ethiopic Didascalia* (London: SPCK, 1920).",
            slice_between(
                didasc,
                "THE DOCTRINE OF THE DIDASCALIA OF THE FATHERS",
                None,
            ),
        ),
    )
    write_md(
        "sinodos",
        wrap(
            "Sinodos",
            "English: George Horner, *The Statutes of the Apostles or Canones Ecclesiastici*, translated from the Ethiopic (London, 1904). This is the Ethiopic Sinodos church-order collection.",
            slice_between(
                horner,
                "This is the Sinodos of the fathers, the Apostles, which they ordered",
                "TRANSLATION OF THE ARABIC",
            ),
        ),
    )
    write_md(
        "book-of-the-covenant-eth",
        wrap(
            "Book of the Covenant (Ethiopic) / Testament of Our Lord",
            "English: James Cooper and Arthur John Maclean, *The Testament of Our Lord* (Edinburgh: T. & T. Clark, 1902). The Ethiopian Book of the Covenant (Mäṣḥafä kidan) is the church-order received as this Testamentum Domini.",
            slice_between(
                cooper,
                "after our Lord rose from the dead, and appeared unto us",
                None,
            ),
        ),
    )

    # 2 Baruch fallback from the 1896 standalone if APOT extract is thin.
    two = DEST / "2-baruch.md"
    if two.exists() and two.stat().st_size < 8000:
        write_md(
            "2-baruch",
            wrap(
                "2 Baruch (Syriac Apocalypse of Baruch)",
                "English: R. H. Charles, *The Apocalypse of Baruch* (London, 1896).",
                slice_between(
                    baruch1896,
                    "AND it came to pass in the twenty-fifth year",
                    None,
                )[:200000],
            ),
        )

    print("done")


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print("FAIL", err, file=sys.stderr)
        raise
