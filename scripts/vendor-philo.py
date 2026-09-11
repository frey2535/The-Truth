#!/usr/bin/env python3
"""Store C. D. Yonge's public-domain English of Philo of Alexandria."""
from __future__ import annotations

import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path("/tmp/pd-src/philo-ccel.txt")
DEST = ROOT / "public/corpus/fathers/philo-yonge.txt"
URL = "https://www.ccel.org/ccel/p/philo/works/cache/works.txt"
UA = "TheTruthCorpusVendor/1.0 (public-domain text archival)"

HEADER = """# The Works of Philo Judaeus

Public-domain English stored in this app. C. D. Yonge, London, H. G. Bohn, 1854–1890.

Philo of Alexandria is a first-century Jewish philosopher, not Scripture. This is not Pseudo-Philo (Biblical Antiquities).
"""


def download() -> str:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    if not CACHE.exists() or CACHE.stat().st_size < 1_000_000:
        req = urllib.request.Request(URL, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=120) as res:
            CACHE.write_bytes(res.read())
        print(f"downloaded {CACHE} {CACHE.stat().st_size}")
    return CACHE.read_text(encoding="utf-8", errors="replace")


HEADINGS = [
    ("ON THE CREATION", "On the Creation"),
    ("ALLEGORICAL INTERPRETATION, I", "Allegorical Interpretation I"),
    ("ALLEGORICAL INTERPRETATION, II", "Allegorical Interpretation II"),
    ("ALLEGORICAL INTERPRETATION, III", "Allegorical Interpretation III"),
    ("THE CHERUBIM", "On the Cherubim"),
    ("ON THE BIRTH OF ABEL AND THE SACRIFICES", "Sacrifices of Abel and Cain"),
    ("THAT THE WORSE IS WONT TO ATTACK THE BETTER", "The Worse Attacks the Better"),
    ("ON THE POSTERITY OF CAIN AND HIS EXILE", "Posterity of Cain"),
    ("ON THE GIANTS", "On the Giants"),
    ("ON THE UNCHANGABLENESS OF GOD", "Unchangeableness of God"),
    ("ON HUSBANDRY", "On Husbandry"),
    ("CONCERNING NOAH'S WORK AS A PLANTER", "Noah as a Planter"),
    ("ON DRUNKENNESS", "On Drunkenness"),
    ("ON THE PRAYERS AND CURSES UTTERED BY NOAH WHEN HE BECAME SOBER", "On Sobriety"),
    ("ON THE CONFUSION OF TONGUES", "Confusion of Tongues"),
    ("ON THE MIGRATION OF ABRAHAM", "Migration of Abraham"),
    ("WHO IS THE HEIR OF DIVINE THINGS", "Who Is the Heir"),
    ("ON MATING WITH THE PRELIMINARY STUDIES", "Preliminary Studies"),
    ("ON FLIGHT AND FINDING", "Flight and Finding"),
    ("ON THE CHANGE OF NAMES", "Change of Names"),
    ("ON DREAMS, THAT THEY ARE GOD-SENT", "On Dreams"),
    ("ON ABRAHAM", "On Abraham"),
    ("ON JOSEPH", "On Joseph"),
    ("ON THE LIFE OF MOSES, I", "Life of Moses I"),
    ("ON THE LIFE OF MOSES, II", "Life of Moses II"),
    ("THE DECALOGUE", "The Decalogue"),
    ("THE SPECIAL LAWS, I", "Special Laws I"),
    ("THE SPECIAL LAWS, II", "Special Laws II"),
    ("THE SPECIAL LAWS, III", "Special Laws III"),
    ("THE SPECIAL LAWS, IV", "Special Laws IV"),
    ("ON THE VIRTUES", "On the Virtues"),
    ("ON REWARDS AND PUNISHMENTS", "Rewards and Punishments"),
    ("EVERY GOOD MAN IS FREE", "Every Good Man Is Free"),
    ("ON THE CONTEMPLATIVE LIFE OR SUPPLIANTS", "Contemplative Life"),
    ("ON THE ETERNITY OF THE WORLD", "Eternity of the World"),
    ("FLACCUS", "Flaccus"),
    ("HYPOTHETICA", "Hypothetica"),
    ("ON PROVIDENCE (Fragment I)", "On Providence"),
    ("ON THE EMBASSY TO GAIUS", "Embassy to Gaius"),
    ("QUESTIONS AND ANSWERS ON GENESIS, I", "Questions on Genesis I"),
    ("QUESTIONS AND ANSWERS ON GENESIS, II", "Questions on Genesis II"),
    ("QUESTIONS AND ANSWERS ON GENESIS, III", "Questions on Genesis III"),
    ("A TREATISE CONCERNING THE WORLD", "Concerning the World"),
]


def clean(raw: str) -> str:
    text = raw.replace("\r", "")
    text = text.replace("ALLGORICAL INTERPRETATION, II", "ALLEGORICAL INTERPRETATION, II")
    start = text.find("ON THE CREATION")
    if start < 0:
        raise RuntimeError("missing ON THE CREATION")
    text = text[start:]
    cut = text.find("   1. file://")
    if cut > 0:
        text = text[:cut]
    text = re.sub(r"[ \t]*_{10,}[ \t]*", "", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    for needle, title in HEADINGS:
        text = re.sub(
            rf"(?m)^({re.escape(needle)})",
            rf"\n\n## {title}\n\n\1",
            text,
            count=1,
        )
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def main() -> None:
    body = clean(download())
    if "FLACCUS" not in body or "ON THE EMBASSY TO GAIUS" not in body:
        raise RuntimeError("Philo file looks incomplete")
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(f"{HEADER}\n{body}\n", encoding="utf-8")
    print(f"wrote {DEST.relative_to(ROOT)} {DEST.stat().st_size}")


if __name__ == "__main__":
    main()
