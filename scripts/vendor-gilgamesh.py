#!/usr/bin/env python3
"""Store Jastrow & Clay's 1920 public-domain Old Babylonian Gilgamesh."""
from __future__ import annotations

import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path("/tmp/pd-src/gilgamesh-jastrow-1920.txt")
DEST = ROOT / "public/corpus/manuscripts/epic-of-gilgamesh.md"
URL = "https://www.gutenberg.org/files/11000/11000-0.txt"
UA = "TheTruthCorpusVendor/1.0 (public-domain text archival)"

HEADER = """# The Epic of Gilgamesh

**English stored here:** Morris Jastrow Jr. and Albert T. Clay, *An Old Babylonian Version of the Gilgamesh Epic*, Yale University Press, 1920 (public domain).

This is the Old Babylonian Pennsylvania and Yale tablet recension. It is a Mesopotamian poem, **not Scripture**. A later twelve-tablet Standard Babylonian edition exists on cuneiform tablets; this app stores the 1920 public-domain English, not a modern copyrighted retelling.

"""


def download() -> str:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    if not CACHE.exists() or CACHE.stat().st_size < 20_000:
        req = urllib.request.Request(URL, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=120) as res:
            CACHE.write_bytes(res.read())
        print(f"downloaded {CACHE} {CACHE.stat().st_size}")
    return CACHE.read_text(encoding="utf-8", errors="replace")


def strip_gutenberg(text: str) -> str:
    start = re.search(r"\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG", text, re.I)
    end = re.search(r"\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG", text, re.I)
    body = text[start.end() :] if start else text
    if end:
        body = text[start.end() : end.start()] if start else text[: end.start()]
    body = re.sub(r"^Produced by.*\n", "", body, flags=re.I | re.M)
    return body.strip()


def main() -> None:
    raw = strip_gutenberg(download())
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(HEADER + raw + "\n", encoding="utf-8")
    print(f"wrote {DEST} {DEST.stat().st_size}")


if __name__ == "__main__":
    main()
