import React, { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BIBLICAL_PLACES, PLACE_LAYERS } from "@/data/biblicalPlaces";

export default function BibleMap() {
  const [modern, setModern] = useState(true);
  const [names, setNames] = useState(true);
  const [opacity, setOpacity] = useState(0.72);
  const [active, setActive] = useState(["names", "patriarchs", "exodus", "kingdoms", "exile", "nt"]);
  const [q, setQ] = useState("");

  function toggleLayer(id) {
    setActive((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const places = useMemo(() => {
    const s = q.trim().toLowerCase();
    return BIBLICAL_PLACES.filter((p) => {
      if (s && !`${p.ancient} ${p.modern} ${p.scripture} ${p.note}`.toLowerCase().includes(s)) return false;
      return (p.layers || []).some((l) => active.includes(l));
    });
  }, [q, active]);

  return (
    <div>
      <header className="text-center mb-6">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Biblical map</h1>
        <p className="text-[#5b5142] max-w-2xl mx-auto">
          Ancient names and today's names on the same map. Turn layers on together and fade the modern map
          so both can be read at once.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 items-center justify-center mb-4 text-sm">
        <label className="truth-chip">
          <input type="checkbox" checked={modern} onChange={(e) => setModern(e.target.checked)} className="mr-1.5" />
          Today's map
        </label>
        {PLACE_LAYERS.filter((l) => l.id !== "modern").map((l) => (
          <label key={l.id} className="truth-chip">
            <input
              type="checkbox"
              checked={active.includes(l.id)}
              onChange={() => toggleLayer(l.id)}
              className="mr-1.5"
            />
            {l.label}
          </label>
        ))}
        <label className="truth-chip">
          <input type="checkbox" checked={names} onChange={(e) => setNames(e.target.checked)} className="mr-1.5" />
          Show both names
        </label>
        <label className="inline-flex items-center gap-2 text-[#5b5142]">
          Modern fade
          <input
            type="range"
            min="0.15"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            disabled={!modern}
          />
        </label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a place"
          className="h-9 rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm w-44"
        />
      </div>

      <div className="h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-[#e8ddc7] shadow-md">
        <MapContainer center={[31.7, 35.2]} zoom={7} className="h-full w-full" scrollWheelZoom>
          {modern && (
            <TileLayer
              opacity={opacity}
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {!modern && (
            <TileLayer
              opacity={0.4}
              attribution="Carto light"
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />
          )}
          {places.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={7}
              pathOptions={{ color: "#7a2e2e", fillColor: "#b08d3c", fillOpacity: 0.9, weight: 2 }}
            >
              {names && (
                <Tooltip permanent direction="top" offset={[0, -8]} className="biblical-name-tip">
                  <span className="font-semibold">{p.ancient}</span>
                  <span className="opacity-80"> · {p.modern}</span>
                </Tooltip>
              )}
              <Popup>
                <p className="font-display text-lg m-0">{p.ancient}</p>
                <p className="text-sm m-0">Today: {p.modern}</p>
                <p className="text-xs mt-1">{p.scripture}</p>
                <p className="text-xs mt-1">{p.note}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <p className="text-xs text-[#8a7f6f] mt-3 text-center">
        Modern map tiles need a network connection. Place-names are stored in the app. Disputed identifications are marked in the note.
      </p>
    </div>
  );
}
