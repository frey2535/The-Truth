#!/usr/bin/env python3
"""Build the 1200x630 Facebook / Open Graph card from the app icon."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ICON = ROOT / "public" / "icon-512.png"
OUT = ROOT / "public" / "og-share.png"

W, H = 1200, 630
BG = (18, 12, 8)
PANEL = (43, 38, 32)
GOLD = (232, 201, 122)
CREAM = (243, 233, 200)
MUTED = (184, 141, 60)


def font(size, bold=False):
    name = "DejaVuSerif-Bold.ttf" if bold else "DejaVuSerif.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)


def rounded(im, radius):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *im.size), radius, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def main():
    canvas = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((40, 40, W - 40, H - 40), 36, fill=(*PANEL, 255))
    draw.rounded_rectangle((40, 40, W - 40, H - 40), 36, outline=(*MUTED, 255), width=2)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((60, 125, 440, 505), fill=(232, 201, 122, 50))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(32)))

    icon = Image.open(ICON).convert("RGBA").resize((280, 280), Image.Resampling.LANCZOS)
    icon = rounded(icon, 56)
    canvas.paste(icon, (110, (H - 280) // 2), icon)

    text = ImageDraw.Draw(canvas)
    text.text((460, 188), "The Truth", font=font(72, bold=True), fill=CREAM)
    text.text((460, 286), "Read  ·  Investigate  ·  Learn", font=font(28), fill=GOLD)
    text.text((460, 356), "Tap to open. Then install it on your phone.", font=font(24), fill=MUTED)

    canvas.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
