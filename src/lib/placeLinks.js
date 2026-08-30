/** Open a stored coordinate so the reader can look around at ground level. */

function coords(place) {
  const lat = Number(place.lat);
  const lng = Number(place.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

/** Google Earth standing at the pin, looking forward, so you can turn and move. */
export function earthViewHref(place) {
  const c = coords(place);
  if (!c) return "";
  return `https://earth.google.com/web/@${c.lat},${c.lng},2.4a,0d,80y,0h,0t,0r`;
}

/** Street View walk, if Google has coverage at or near the pin. */
export function streetViewHref(place) {
  const c = coords(place);
  if (!c) return "";
  const q = new URLSearchParams({
    api: "1",
    map_action: "pano",
    viewpoint: `${c.lat},${c.lng}`,
  });
  return `https://www.google.com/maps/@?${q}`;
}

export function mapsViewHref(place) {
  const c = coords(place);
  if (!c) return "";
  return `https://www.google.com/maps/@${c.lat},${c.lng},18z`;
}
