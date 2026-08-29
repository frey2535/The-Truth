import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import { BIBLICAL_PLACES, PLACE_LAYERS } from "@/data/biblicalPlaces";
import "leaflet/dist/leaflet.css";

const ERA_LAYERS = new Set(["patriarchs", "exodus", "kingdoms", "exile", "nt"]);

const ESRI_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

const STACK = [
  {
    id: "lands",
    label: "Lands",
    tiles: [
      {
        zIndex: 200,
        attribution: "&copy; OpenStreetMap, &copy; CARTO",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      },
    ],
  },
  {
    id: "satellite",
    label: "Satellite",
    tiles: [
      {
        zIndex: 300,
        attribution: ESRI_ATTR,
        url: ESRI_SATELLITE,
      },
    ],
  },
  {
    id: "modern",
    label: "Today's map",
    tiles: [
      {
        zIndex: 380,
        attribution: ESRI_ATTR,
        url: ESRI_SATELLITE,
      },
      {
        zIndex: 400,
        attribution: "&copy; OpenStreetMap contributors",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
    ],
  },
];

function FitOnce({ places }) {
  const map = useMap();
  const done = React.useRef(false);
  React.useEffect(() => {
    if (done.current || !places.length) return;
    done.current = true;
    const lats = places.map((p) => p.lat);
    const lngs = places.map((p) => p.lng);
    map.fitBounds(
      [
        [Math.min(...lats) - 0.8, Math.min(...lngs) - 0.8],
        [Math.max(...lats) + 0.8, Math.max(...lngs) + 0.8],
      ],
      { padding: [30, 30] }
    );
  }, [map, places]);
  return null;
}

export default function MapExplore() {
  const [layers, setLayers] = useState({
    lands: true,
    modern: true,
    satellite: true,
    names: true,
    patriarchs: true,
    exodus: true,
    kingdoms: true,
    exile: true,
    nt: true,
  });
  const [opacity, setOpacity] = useState({
    lands: 0.45,
    satellite: 0.5,
    modern: 0.42,
  });
  const [placeQuery, setPlaceQuery] = useState("");

  function toggle(id) {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const shown = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    return BIBLICAL_PLACES.filter((p) => {
      if (!p.layers.some((layer) => ERA_LAYERS.has(layer) && layers[layer])) return false;
      if (!q) return true;
      return `${p.ancient} ${p.modern} ${p.scripture} ${p.note}`.toLowerCase().includes(q);
    });
  }, [layers, placeQuery]);

  const anyBase = STACK.some((layer) => layers[layer.id]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Lands of the texts</h1>
        <p className="text-[#5b5142] max-w-2xl">
          Lands, satellite, and today&apos;s map sit on top of one another. Today&apos;s map is a hybrid —
          today&apos;s satellite under today&apos;s streets — faded so you can see it with the other layers
          at the same time. Ancient and modern names stay on top. This is geography for study, not a modern
          border claim.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-3">
        {PLACE_LAYERS.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => toggle(layer.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              layers[layer.id]
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm text-[#5b5142]">
        {STACK.filter((layer) => layers[layer.id]).map((layer) => (
          <label key={layer.id} className="flex items-center gap-3">
            {layer.label}
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={opacity[layer.id]}
              onChange={(e) =>
                setOpacity((prev) => ({ ...prev, [layer.id]: Number(e.target.value) }))
              }
              className="w-36"
            />
          </label>
        ))}
      </div>
      <input
        value={placeQuery}
        onChange={(e) => setPlaceQuery(e.target.value)}
        placeholder="Find a place (ancient or today's name)"
        className="h-9 mb-4 w-full max-w-md rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
      />

      <div className="h-[62vh] min-h-[420px] rounded-2xl overflow-hidden border border-[#e8ddc7] shadow-sm">
        <MapContainer center={[31.8, 35.2]} zoom={6} className="h-full w-full" scrollWheelZoom>
          {!anyBase && (
            <TileLayer
              opacity={0.25}
              attribution="&copy; OpenStreetMap, &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />
          )}
          {STACK.filter((layer) => layers[layer.id]).flatMap((layer) =>
            layer.tiles.map((tile, i) => (
              <TileLayer
                key={`${layer.id}-${i}`}
                opacity={opacity[layer.id]}
                zIndex={tile.zIndex}
                attribution={tile.attribution}
                url={tile.url}
              />
            ))
          )}
          <FitOnce places={shown} />
          {shown.map((place) => (
            <CircleMarker
              key={place.id}
              center={[place.lat, place.lng]}
              radius={8}
              pathOptions={{ color: "#7a2e2e", fillColor: "#b08d3c", fillOpacity: 0.7, weight: 2 }}
            >
              {layers.names && (
                <Tooltip permanent direction="top" offset={[0, -8]} className="place-tip">
                  <span className="font-display">{place.ancient}</span>
                  {place.modern !== place.ancient && (
                    <span className="block text-[10px] text-[#5b5142]">{place.modern}</span>
                  )}
                </Tooltip>
              )}
              <Popup>
                <p className="font-display text-lg text-[#2b2620]">{place.ancient}</p>
                <p className="text-sm text-[#5b5142]">Today: {place.modern}</p>
                <p className="text-xs text-[#8a7f6f] mt-1">{place.era} · {place.scripture}</p>
                <p className="text-sm text-[#3a3328] mt-2">{place.note}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-[#2b2620] mb-3">Names that changed</h2>
        <div className="overflow-x-auto rounded-2xl border border-[#e8ddc7] bg-white/70">
          <table className="w-full text-sm">
            <thead className="bg-[#f3e9c8]/70 text-[#5b5142]">
              <tr>
                <th className="text-left px-4 py-2 font-medium">In the texts</th>
                <th className="text-left px-4 py-2 font-medium">Called today</th>
                <th className="text-left px-4 py-2 font-medium">Passage</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="border-t border-[#e8ddc7]">
                  <td className="px-4 py-2 text-[#2b2620]">{p.ancient}</td>
                  <td className="px-4 py-2 text-[#5b5142]">{p.modern}</td>
                  <td className="px-4 py-2 text-[#7a2e2e]">{p.scripture}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
