import React, { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  ImageOverlay,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { BIBLICAL_PLACES, PLACE_LAYERS } from "@/data/biblicalPlaces";
import {
  ATLAS_PLATES,
  BIBLE_ROUTES,
  DEFAULT_PLATE_ID,
  KINGDOM_POLYGONS,
} from "@/data/biblicalAtlas";
import "leaflet/dist/leaflet.css";

const ERA_LAYERS = new Set(["patriarchs", "exodus", "kingdoms", "exile", "nt"]);

const ESRI_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

function ensurePanes(map) {
  if (!map.getPane("biblePlates")) {
    map.createPane("biblePlates").style.zIndex = "350";
  }
  if (!map.getPane("modernGlass")) {
    map.createPane("modernGlass").style.zIndex = "420";
  }
}

function MapChrome() {
  const map = useMap();
  ensurePanes(map);
  useEffect(() => {
    const fit = () => map.invalidateSize();
    fit();
    const t = window.setTimeout(fit, 200);
    window.addEventListener("resize", fit);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
  }, [map]);
  return null;
}

function FitPlate({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 9 });
  }, [map, bounds]);
  return null;
}

export default function MapExplore() {
  const [plateId, setPlateId] = useState(DEFAULT_PLATE_ID);
  const [layers, setLayers] = useState({
    modern: true,
    satellite: false,
    names: true,
    outlines: true,
    routes: true,
    patriarchs: true,
    kingdoms: true,
    exodus: true,
    exile: true,
    nt: true,
  });
  const [plateOpacity, setPlateOpacity] = useState(0.92);
  const [modernOpacity, setModernOpacity] = useState(0.38);
  const [placeQuery, setPlaceQuery] = useState("");

  const plate = ATLAS_PLATES.find((p) => p.id === plateId) || null;

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

  const routes = useMemo(
    () =>
      BIBLE_ROUTES.filter(
        (r) => layers.routes && r.layers.some((layer) => layers[layer])
      ),
    [layers]
  );

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Biblical map</h1>
        <p className="text-[#5b5142] max-w-3xl">
          The engraved Bible-atlas plate is the map. Today&apos;s streets fade over it so both
          can be read at once — the same comparison old printed Bibles asked the reader to make
          by turning from the plate to the world. This is geography for study, not a modern
          border claim.
        </p>
      </header>

      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wide text-[#8a7f6f] mb-1.5">Bible atlas plates</p>
        <div className="flex flex-wrap gap-2">
          {ATLAS_PLATES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlateId(p.id === plateId ? "" : p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                plateId === p.id
                  ? "bg-[#7a2e2e] text-[#f3e9c8] border-[#7a2e2e]"
                  : "bg-white text-[#5b5142] border-[#e8ddc7]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { id: "modern", label: "Today's map overlay" },
          { id: "satellite", label: "Satellite" },
          { id: "names", label: "Ancient and modern names" },
          { id: "outlines", label: "Israel and Judah outlines" },
          { id: "routes", label: "Journeys" },
          ...PLACE_LAYERS.filter((l) => ERA_LAYERS.has(l.id)),
        ].map((layer) => (
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
        {plate && (
          <label className="flex items-center gap-3">
            Plate fade
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.05"
              value={plateOpacity}
              onChange={(e) => setPlateOpacity(Number(e.target.value))}
              className="w-36"
            />
          </label>
        )}
        {layers.modern && (
          <label className="flex items-center gap-3">
            Today's overlay
            <input
              type="range"
              min="0.1"
              max="0.85"
              step="0.05"
              value={modernOpacity}
              onChange={(e) => setModernOpacity(Number(e.target.value))}
              className="w-36"
            />
          </label>
        )}
      </div>

      {plate && (
        <p className="text-sm text-[#5b5142] mb-3 max-w-3xl">
          <span className="font-medium text-[#2b2620]">{plate.title}</span>
          {` · ${plate.year} · ${plate.maker}. `}
          {plate.note}
        </p>
      )}

      <input
        value={placeQuery}
        onChange={(e) => setPlaceQuery(e.target.value)}
        placeholder="Find a place (ancient or today's name)"
        className="h-9 mb-4 w-full max-w-md rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
      />

      <div className="bible-map-frame h-[68vh] min-h-[480px] rounded-2xl overflow-hidden border border-[#e8ddc7] shadow-sm">
        <MapContainer
          center={[31.7, 35.2]}
          zoom={8}
          className="h-full w-full"
          scrollWheelZoom
        >
          <MapChrome />
          {plate && <FitPlate bounds={plate.bounds} />}
          <TileLayer
            opacity={layers.satellite ? 0.55 : 0.22}
            attribution="&copy; OpenStreetMap, &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          />
          {layers.satellite && (
            <TileLayer opacity={0.7} attribution={ESRI_ATTR} url={ESRI_SATELLITE} />
          )}
          {plate && (
            <ImageOverlay
              url={plate.url}
              bounds={plate.bounds}
              opacity={plateOpacity}
              zIndex={350}
              pane="biblePlates"
            />
          )}
          {layers.modern && (
            <TileLayer
              pane="modernGlass"
              opacity={modernOpacity}
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {layers.outlines &&
            KINGDOM_POLYGONS.map((poly) => (
              <Polygon
                key={poly.id}
                positions={poly.positions}
                pathOptions={{
                  color: poly.color,
                  weight: 2,
                  fillColor: poly.color,
                  fillOpacity: 0.12,
                }}
              >
                <Popup>
                  <p className="font-display text-lg m-0">{poly.name}</p>
                  <p className="text-xs mt-1">{poly.scripture}</p>
                  <p className="text-xs mt-1 text-[#8a7f6f]">
                    Traditional atlas outline for study. Not a surveyed border.
                  </p>
                </Popup>
              </Polygon>
            ))}
          {routes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{ color: route.color, weight: 3, dashArray: "7 6", opacity: 0.9 }}
            >
              <Popup>
                <p className="font-display text-lg m-0">{route.name}</p>
                <p className="text-xs mt-1">{route.scripture}</p>
              </Popup>
            </Polyline>
          ))}
          {shown.map((place) => (
            <CircleMarker
              key={place.id}
              center={[place.lat, place.lng]}
              radius={7}
              pathOptions={{ color: "#7a2e2e", fillColor: "#b08d3c", fillOpacity: 0.85, weight: 2 }}
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
                <p className="text-xs text-[#8a7f6f] mt-1">
                  {place.era} · {place.scripture}
                </p>
                <p className="text-sm text-[#3a3328] mt-2">{place.note}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <p className="text-xs text-[#8a7f6f] mt-3">
        Plates are stored in this app from the Library of Congress. Modern tiles need a network
        connection. Place-names are stored here. Disputed identifications are marked in the note.
        {plate ? ` Source: ${plate.source}.` : ""}
      </p>

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
