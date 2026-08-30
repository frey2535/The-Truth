/**
 * Approximate Jerusalem sunrise/sunset (31.778°N, 35.236°E).
 * NOAA-style solar geometry. Minutes can be off by a few; labeled reconstruction.
 */

export const JERUSALEM = { lat: 31.778, lon: 35.236, name: "Jerusalem" };

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function dayOfYear(year, month, day) {
  const n1 = Math.floor((275 * month) / 9);
  const n2 = Math.floor((month + 9) / 12);
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  return n1 - n2 * n3 + day - 30;
}

/** Hours east of UTC for Asia/Jerusalem on this civil date. */
export function jerusalemUtcOffsetHours(year, month, day) {
  const utcNoon = Date.UTC(year, month - 1, day, 12, 0, 0);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jerusalem",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(utcNoon))
      .map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUtc - utcNoon) / 3600000;
}

/** Jerusalem civil-clock sunrise/sunset. NOAA-style solar geometry, then Asia/Jerusalem offset. */
export function jerusalemSunTimes(year, month, day) {
  const n = dayOfYear(year, month, day);
  const lngHour = JERUSALEM.lon / 15;
  const lat = JERUSALEM.lat;
  const offset = jerusalemUtcOffsetHours(year, month, day);

  const eventHours = (isSet) => {
    const t = isSet ? n + (18 - lngHour) / 24 : n + (6 - lngHour) / 24;
    const m = 0.9856 * t - 3.289;
    let l = m + 1.916 * Math.sin(degToRad(m)) + 0.02 * Math.sin(degToRad(2 * m)) + 282.634;
    l = ((l % 360) + 360) % 360;
    let ra = radToDeg(Math.atan(0.91764 * Math.tan(degToRad(l))));
    ra = ((ra % 360) + 360) % 360;
    const lQuad = Math.floor(l / 90) * 90;
    const raQuad = Math.floor(ra / 90) * 90;
    ra = ra + (lQuad - raQuad);
    ra /= 15;
    const sinDec = 0.39782 * Math.sin(degToRad(l));
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH =
      (Math.cos(degToRad(90.833)) - sinDec * Math.sin(degToRad(lat))) /
      (cosDec * Math.cos(degToRad(lat)));
    if (cosH > 1 || cosH < -1) return null;
    let h = isSet ? radToDeg(Math.acos(cosH)) / 15 : (360 - radToDeg(Math.acos(cosH))) / 15;
    const utcHours = ((h + ra - 0.06571 * t - 6.622 - lngHour) % 24 + 24) % 24;
    return utcHours;
  };

  const sunriseUtc = eventHours(false);
  const sunsetUtc = eventHours(true);
  const toCivil = (utcHours) => (utcHours == null ? null : ((utcHours + offset) % 24 + 24) % 24);
  return {
    sunrise: toCivil(sunriseUtc),
    sunset: toCivil(sunsetUtc),
    sunriseUtc,
    sunsetUtc,
  };
}

export function formatClock(hours) {
  if (hours == null || Number.isNaN(hours)) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const hh = m === 60 ? h + 1 : h;
  const mm = m === 60 ? 0 : m;
  return `${String(hh % 24).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
