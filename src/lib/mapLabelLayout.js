/** Keep map pin labels from stacking on top of each other. */

const MAJOR_PRIORITY = {
  jerusalem: 100,
  rome: 92,
  babylon: 90,
  nineveh: 88,
  damascus: 84,
  antioch: 82,
  alexandria: 80,
  athens: 78,
  corinth: 76,
  ephesus: 75,
  nazareth: 74,
  bethlehem: 73,
  hebron: 72,
  samaria: 71,
  jericho: 70,
  beersheba: 68,
  shechem: 66,
  sinai: 65,
  goshen: 64,
  megiddo: 62,
  dan: 60,
  tyre: 58,
  sidon: 56,
  gaza: 55,
  capernaum: 54,
  caesarea: 53,
  joppa: 52,
  tarsus: 51,
  philippi: 50,
  thessalonica: 49,
  galileesea: 48,
  deadsea: 47,
  jordanr: 46,
  ur: 45,
  haran: 44,
  susa: 43,
  memphis: 42,
  noamon: 40,
};

const SHORT_NAME = {
  galileesea: "Galilee",
  deadsea: "Salt Sea",
  jordanr: "Jordan",
  olives: "Olives",
  "horeb-rock": "Horeb",
};

const SLOTS = [
  { direction: "top", offset: [0, -8] },
  { direction: "right", offset: [10, 0] },
  { direction: "bottom", offset: [0, 10] },
  { direction: "left", offset: [-10, 0] },
];

const MARKER_R = 9;
const MIN_LABELED_SEP = 70;
const BOX_PAD = 6;

export function pinLabel(place) {
  if (place?.id && SHORT_NAME[place.id]) return SHORT_NAME[place.id];
  const raw = String(place?.ancient || "").trim();
  if (!raw) return "";
  return raw.split(" / ")[0].replace(/\s+\(.*\)$/, "").trim();
}

export function placeLabelPriority(place, selectedId) {
  if (!place) return 0;
  if (place.id === selectedId) return 1000;
  return MAJOR_PRIORITY[place.id] || 20;
}

export function mercatorPoint(lat, lng, zoom) {
  const scale = 256 * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  return { x, y };
}

function estimateSize(text, twoLine) {
  const width = Math.min(168, Math.max(36, 10 + text.length * 6.4));
  return { width, height: twoLine ? 28 : 16 };
}

function boxForSlot(x, y, width, height, slot) {
  const gap = 9;
  if (slot.direction === "top") {
    return { left: x - width / 2, right: x + width / 2, top: y - gap - height, bottom: y - 5 };
  }
  if (slot.direction === "bottom") {
    return { left: x - width / 2, right: x + width / 2, top: y + 5, bottom: y + gap + height };
  }
  if (slot.direction === "right") {
    return { left: x + gap, right: x + gap + width, top: y - height / 2, bottom: y + height / 2 };
  }
  return { left: x - gap - width, right: x - gap, top: y - height / 2, bottom: y + height / 2 };
}

function markerBox(x, y, r = MARKER_R) {
  return { left: x - r, right: x + r, top: y - r, bottom: y + r };
}

function overlaps(a, b, pad = BOX_PAD) {
  return a.left < b.right + pad && a.right + pad > b.left && a.top < b.bottom + pad && a.bottom + pad > b.top;
}

function tooClose(a, b, min = MIN_LABELED_SEP) {
  return Math.hypot(a.x - b.x, a.y - b.y) < min;
}

/**
 * Pick a non-overlapping slot for each place that can keep a standing label.
 * Nearby pins stay visible; only the name is hidden until there is room or the user hovers.
 */
export function layoutPlaceLabels(places, { zoom, selectedId, showModern = false } = {}) {
  const list = places || [];
  const points = list.map((place) => ({ place, ...mercatorPoint(place.lat, place.lng, zoom ?? 8) }));
  const byId = new Map(points.map((row) => [row.place.id, row]));
  const ranked = [...points].sort((a, b) => {
    const byRank = placeLabelPriority(b.place, selectedId) - placeLabelPriority(a.place, selectedId);
    if (byRank) return byRank;
    return pinLabel(a.place).length - pinLabel(b.place).length;
  });

  const labelBoxes = [];
  const labeledPts = [];
  const layout = new Map();

  for (const row of ranked) {
    const text = pinLabel(row.place);
    if (!text) continue;
    const twoLine = Boolean(showModern && row.place.modern && row.place.modern !== row.place.ancient);
    const { width, height } = estimateSize(text, twoLine);
    const preferSelected = row.place.id === selectedId;
    const crowded = labeledPts.some((other) => tooClose(row, other));
    if (crowded && !preferSelected) continue;

    let chosen = null;
    for (const slot of SLOTS) {
      const box = boxForSlot(row.x, row.y, width, height, slot);
      const hitsLabel = labelBoxes.some((other) => overlaps(box, other));
      const hitsPin = points.some((other) => {
        if (other.place.id === row.place.id) return false;
        return overlaps(box, markerBox(other.x, other.y));
      });
      if (hitsLabel || hitsPin) continue;
      chosen = { slot, box };
      break;
    }

    if (!chosen && preferSelected) {
      chosen = { slot: SLOTS[0], box: boxForSlot(row.x, row.y, width, height, SLOTS[0]) };
    }
    if (!chosen) continue;

    layout.set(row.place.id, {
      direction: chosen.slot.direction,
      offset: chosen.slot.offset,
      text,
      twoLine,
    });
    labelBoxes.push(chosen.box);
    labeledPts.push(row);
  }

  // selected is always in the map if it was in the pool
  if (selectedId && byId.has(selectedId) && !layout.has(selectedId)) {
    const row = byId.get(selectedId);
    const text = pinLabel(row.place);
    layout.set(selectedId, { direction: "top", offset: [0, -8], text, twoLine: false });
  }

  return layout;
}
