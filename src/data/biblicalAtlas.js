/** Traditional study outlines and journey lines. Approximate drawings, not surveyed borders. */

export const KINGDOM_POLYGONS = [
  {
    id: "judah",
    name: "Judah",
    scripture: "1 Kings 12:17; 2 Chronicles 11:5–12",
    color: "#7a2e2e",
    positions: [
      [31.22, 34.72],
      [31.35, 34.55],
      [31.72, 34.62],
      [31.92, 35.05],
      [31.88, 35.42],
      [31.55, 35.48],
      [31.28, 35.38],
      [31.15, 35.05],
    ],
  },
  {
    id: "israel",
    name: "Israel (northern kingdom)",
    scripture: "1 Kings 12:19–20; 16:24",
    color: "#2f4a6b",
    positions: [
      [31.95, 34.78],
      [32.35, 34.82],
      [32.72, 34.88],
      [33.22, 35.12],
      [33.28, 35.72],
      [32.85, 35.68],
      [32.35, 35.52],
      [31.98, 35.42],
      [31.92, 35.12],
    ],
  },
];

export const BIBLE_ROUTES = [
  {
    id: "exodus-route",
    name: "Wilderness road (traditional line)",
    scripture: "Exodus 12–19; Numbers 33; Joshua 3",
    color: "#8a5a12",
    layers: ["exodus"],
    positions: [
      [30.7, 31.8],
      [30.0, 32.55],
      [28.539, 33.975],
      [30.642, 34.427],
      [31.4, 35.35],
      [31.871, 35.444],
    ],
  },
  {
    id: "paul-1",
    name: "Paul — first journey",
    scripture: "Acts 13–14",
    color: "#7a2e2e",
    layers: ["nt"],
    positions: [
      [36.202, 36.161],
      [34.76, 32.41],
      [36.96, 30.85],
      [38.3, 31.19],
      [37.872, 32.492],
      [37.596, 32.342],
      [37.35, 33.42],
      [36.202, 36.161],
    ],
  },
  {
    id: "paul-2",
    name: "Paul — second journey",
    scripture: "Acts 15:40–18:22",
    color: "#3d5a3a",
    layers: ["nt"],
    positions: [
      [36.202, 36.161],
      [36.917, 34.896],
      [37.872, 32.492],
      [39.75, 26.158],
      [41.012, 24.286],
      [40.64, 22.944],
      [40.521, 22.204],
      [37.972, 23.726],
      [37.906, 22.88],
      [37.941, 27.342],
      [32.501, 34.892],
    ],
  },
  {
    id: "paul-rome",
    name: "Paul — voyage to Rome",
    scripture: "Acts 27–28",
    color: "#4a3a6b",
    layers: ["nt"],
    positions: [
      [32.501, 34.892],
      [33.563, 35.369],
      [36.26, 29.98],
      [35.03, 24.75],
      [35.9, 14.45],
      [37.07, 15.29],
      [38.24, 15.64],
      [40.83, 14.12],
      [41.89, 12.48],
    ],
  },
];

export const MAP_VIEWS = [
  {
    id: "land",
    label: "The land",
    bounds: [
      [29.4, 33.9],
      [33.5, 36.4],
    ],
  },
  {
    id: "exodus",
    label: "Egypt and Sinai",
    bounds: [
      [27.8, 30.2],
      [32.2, 36.2],
    ],
  },
  {
    id: "exile",
    label: "Exile cities",
    bounds: [
      [29.8, 42.8],
      [37.2, 48.8],
    ],
  },
  {
    id: "apostles",
    label: "Apostles",
    bounds: [
      [30.8, 10.2],
      [43.2, 37.5],
    ],
  },
];

export const ERA_COLOR = {
  patriarchs: "#b08d3c",
  exodus: "#8a5a12",
  kingdoms: "#7a2e2e",
  exile: "#4a5560",
  nt: "#5e2222",
};

export function placeColor(place) {
  const layer = (place.layers || []).find((id) => ERA_COLOR[id]);
  return ERA_COLOR[layer] || "#7a2e2e";
}

export function boundsForPlaces(places) {
  if (!places?.length) return null;
  const lats = places.map((p) => p.lat);
  const lngs = places.map((p) => p.lng);
  const pad = places.length === 1 ? 0.35 : 0.15;
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad],
  ];
}
