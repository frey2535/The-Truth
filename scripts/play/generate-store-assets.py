#!/usr/bin/env python3
"""Build Play listing graphics, maskable PWA icon, and Android mipmaps."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ICON = ROOT / "public" / "icon-512.png"
STORE = ROOT / "store" / "play"
SHOTS = STORE / "screenshots"
PUBLIC_SHOTS = ROOT / "public" / "screenshots"
ANDROID_RES = ROOT / "android" / "app" / "src" / "main" / "res"

BG = (18, 12, 8)
PANEL = (43, 38, 32)
GOLD = (232, 201, 122)
CREAM = (243, 233, 200)
MUTED = (184, 141, 60)
PAPER = (250, 246, 239)
INK = (43, 38, 32)
WINE = (122, 46, 46)


def font(size, bold=False):
    name = "DejaVuSerif-Bold.ttf" if bold else "DejaVuSerif.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)


def rounded(im, radius):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *im.size), radius, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def save_rgb(im, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


def feature_graphic(icon):
    w, h = 1024, 500
    canvas = Image.new("RGBA", (w, h), (*BG, 255))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((28, 28, w - 28, h - 28), 28, fill=(*PANEL, 255))
    draw.rounded_rectangle((28, 28, w - 28, h - 28), 28, outline=(*MUTED, 255), width=2)
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((40, 90, 360, 410), fill=(232, 201, 122, 48))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(24)))
    badge = rounded(icon.resize((220, 220), Image.Resampling.LANCZOS), 44)
    canvas.paste(badge, (90, (h - 220) // 2), badge)
    text = ImageDraw.Draw(canvas)
    text.text((360, 150), "The Truth", font=font(56, bold=True), fill=CREAM)
    text.text((360, 230), "Read  ·  Investigate  ·  Learn", font=font(22), fill=GOLD)
    text.text((360, 290), "Scripture research from texts stored in the app.", font=font(18), fill=MUTED)
    save_rgb(canvas, STORE / "feature-graphic.png")


def play_icon(icon):
    save_rgb(icon.convert("RGB"), STORE / "icon-512.png")


def maskable(icon):
    canvas = Image.new("RGB", (512, 512), INK)
    inner = icon.resize((360, 360), Image.Resampling.LANCZOS).convert("RGBA")
    canvas.paste(inner, ((512 - 360) // 2, (512 - 360) // 2), inner)
    out = ROOT / "public" / "icon-maskable-512.png"
    canvas.save(out, "PNG", optimize=True)
    print(f"wrote {out.relative_to(ROOT)}")


def phone_shot(icon, title, lines, out_name, dark=True, size=(1080, 1920), extra_dirs=()):
    w, h = size
    bg = BG if dark else PAPER
    ink = CREAM if dark else INK
    sub = GOLD if dark else WINE
    canvas = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(canvas)
    inset = 48 if min(w, h) >= 1000 else 32
    draw.rounded_rectangle((inset, inset, w - inset, h - inset), 48, outline=GOLD if dark else MUTED, width=3)
    badge_size = 220 if h >= 1600 else 180
    badge = rounded(icon.resize((badge_size, badge_size), Image.Resampling.LANCZOS), 48)
    canvas.paste(badge, ((w - badge_size) // 2, int(h * 0.12)), badge)
    title_y = int(h * 0.28)
    draw.text((w // 2, title_y), "The Truth", font=font(72 if h >= 1600 else 56, bold=True), fill=ink, anchor="mm")
    draw.text((w // 2, title_y + 100), title, font=font(36 if h >= 1600 else 28), fill=sub, anchor="mm")
    y = title_y + 260
    for line in lines:
        draw.text((w // 2, y), line, font=font(28 if h >= 1600 else 24), fill=ink, anchor="mm")
        y += 56
    destinations = [SHOTS / out_name]
    if size == (1080, 1920):
        destinations.append(PUBLIC_SHOTS / out_name)
    for folder in extra_dirs:
        destinations.append(Path(folder) / out_name)
    for dest in destinations:
        save_rgb(canvas, dest)


def android_icons(icon):
    sizes = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    rgb = icon.convert("RGB")
    for density, size in sizes.items():
        folder = ANDROID_RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        im = rgb.resize((size, size), Image.Resampling.LANCZOS)
        im.save(folder / "ic_launcher.png", "PNG")
        im.save(folder / "ic_launcher_round.png", "PNG")
    fg = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    inner = icon.resize((288, 288), Image.Resampling.LANCZOS).convert("RGBA")
    fg.paste(inner, ((432 - 288) // 2, (432 - 288) // 2), inner)
    drawable = ANDROID_RES / "drawable"
    drawable.mkdir(parents=True, exist_ok=True)
    fg.save(drawable / "ic_launcher_foreground.png", "PNG")
    splash = icon.resize((288, 288), Image.Resampling.LANCZOS).convert("RGBA")
    splash.save(drawable / "splash.png", "PNG")
    print("wrote android mipmaps and splash")


def main():
    icon = Image.open(ICON).convert("RGBA")
    STORE.mkdir(parents=True, exist_ok=True)
    feature_graphic(icon)
    play_icon(icon)
    maskable(icon)
    fastlane = ROOT / "fastlane" / "metadata" / "android" / "en-US" / "images"
    phone_dir = fastlane / "phoneScreenshots"
    seven_dir = fastlane / "sevenInchScreenshots"
    ten_dir = fastlane / "tenInchScreenshots"
    phone_shot(
        icon,
        "Read",
        ["King James and stored writings", "Search only what ships in the app", "No invented verses"],
        "phone-read.png",
        dark=True,
        extra_dirs=(phone_dir,),
    )
    phone_shot(
        icon,
        "Investigate",
        ["Build a dossier from stored texts", "Quote the wording that is here", "Primary records, not the web"],
        "phone-investigate.png",
        dark=False,
        extra_dirs=(phone_dir,),
    )
    phone_shot(
        icon,
        "Learn",
        ["Guided study paths", "Notes stay on this device", "Sign-in is optional"],
        "phone-learn.png",
        dark=True,
        extra_dirs=(phone_dir,),
    )
    phone_shot(
        icon,
        "Read",
        ["The same library on a tablet", "Search only stored texts", "Free. No in-app purchases"],
        "seven-read.png",
        dark=True,
        size=(1200, 1920),
        extra_dirs=(seven_dir, STORE / "screenshots"),
    )
    phone_shot(
        icon,
        "Investigate",
        ["Build a dossier from stored texts", "Primary records, not the web"],
        "seven-investigate.png",
        dark=False,
        size=(1200, 1920),
        extra_dirs=(seven_dir, STORE / "screenshots"),
    )
    phone_shot(
        icon,
        "Read",
        ["Scripture research on a large screen", "Texts stored in the app", "Sign-in is optional"],
        "ten-read.png",
        dark=True,
        size=(1920, 1200),
        extra_dirs=(ten_dir, STORE / "screenshots"),
    )
    phone_shot(
        icon,
        "Learn",
        ["Guided study paths", "Notes stay on this device"],
        "ten-learn.png",
        dark=False,
        size=(1920, 1200),
        extra_dirs=(ten_dir, STORE / "screenshots"),
    )
    android_icons(icon)
    save_rgb(Image.open(STORE / "icon-512.png"), fastlane / "icon.png")
    save_rgb(Image.open(STORE / "feature-graphic.png"), fastlane / "featureGraphic.png")


if __name__ == "__main__":
    main()
