import React, { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { BIBLICAL_PLACES, PLACE_LAYERS, SCRIPTURE_PEOPLE } from "@/data/biblicalPlaces";
import {
  BIBLE_ROUTES,
  ERA_COLOR,
  KINGDOM_POLYGONS,
  MAP_VIEWS,
  boundsForPlaces,
  placeColor,
} from "@/data/biblicalAtlas";
import { libraryHref } from "@/lib/libraryLinks";
import { earthViewHref, streetViewHref } from "@/lib/placeLinks";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import "leaflet/dist/leaflet.css";

const ERA_LAYERS = new Set(["patriarchs", "exodus", "kingdoms", "exile", "nt"]);

const OSM =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SAT =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SAT_ATTR =
  "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

function MapChrome() {
  const map = useMap();
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

function FitView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 9, animate: true });
  }, [map, bounds]);
  return null;
}

function FlyToPlace({ place }) {
  const map = useMap();
  useEffect(() => {
    if (!place) return;
    map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 9), { duration: 0.7 });
  }, [map, place]);
  return null;
}

function PlaceGlobeLinks({ place, compact }) {
  const walk = streetViewHref(place);
  const earth = earthViewHref(place);
  if (!walk && !earth) return null;
  const primary = compact
    ? "inline-flex items-center gap-1 text-xs text-[#7a2e2e] hover:underline"
    : "inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-full bg-[#2b2620] text-[#f3e9c8] text-sm hover:bg-[#3a3328]";
  const secondary = compact
    ? "inline-flex items-center gap-1 text-xs text-[#7a2e2e] hover:underline"
    : "inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-full border border-[#e8ddc7] bg-white text-sm text-[#2b2620] hover:bg-[#f3e9c8]/50";
  return (
    <div className={compact ? "flex flex-wrap gap-x-3 gap-y-1 mt-2" : "mt-3"}>
      <div className={compact ? "contents" : "flex flex-wrap gap-2"}>
        {walk ? (
          <a href={walk} target="_blank" rel="noopener noreferrer" className={primary}>
            <ExternalLink className="w-3.5 h-3.5" />
            Walk around (Street View)
          </a>
        ) : null}
        {earth ? (
          <a href={earth} target="_blank" rel="noopener noreferrer" className={secondary}>
            <ExternalLink className="w-3.5 h-3.5" />
            Stand in Google Earth
          </a>
        ) : null}
      </div>
      {compact ? null : (
        <p className="text-xs text-[#8a7f6f] mt-2">
          Street View lets you walk if Google photographed the street. Earth opens standing at the
          stored pin so you can turn and move on the ground. Remote wilderness often has no street
          photos.
        </p>
      )}
    </div>
  );
}

function ZoomWatch({ onZoom }) {
  const map = useMap();
  useEffect(() => {
    const report = () => onZoom(map.getZoom());
    report();
    map.on("zoomend", report);
    return () => map.off("zoomend", report);
  }, [map, onZoom]);
  return null;
}

export default function MapExplore() {
  const [layers, setLayers] = useState({
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
  const [placeQuery, setPlaceQuery] = useState("");
  const [personId, setPersonId] = useState("");
  const [selectedId, setSelectedId] = useState("jerusalem");
  const [viewId, setViewId] = useState("land");
  const [viewBounds, setViewBounds] = useState(MAP_VIEWS[0].bounds);
  const [focus, setFocus] = useState(null);
  const [zoom, setZoom] = useState(8);

  function pick(place) {
    setSelectedId(place.id);
    setFocus(place);
  }

  function toggle(id) {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const person = SCRIPTURE_PEOPLE.find((p) => p.id === personId) || null;
  const personIds = useMemo(() => (person ? new Set(person.placeIds) : null), [person]);

  const shown = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    return BIBLICAL_PLACES.filter((p) => {
      if (personIds && !personIds.has(p.id)) return false;
      if (!personIds && !p.layers.some((layer) => ERA_LAYERS.has(layer) && layers[layer])) return false;
      if (!q) return true;
      return `${p.ancient} ${p.modern} ${p.scripture} ${p.note}`.toLowerCase().includes(q);
    });
  }, [layers, placeQuery, personIds]);

  const selected = shown.find((p) => p.id === selectedId) || shown[0] || null;
  const routes = useMemo(
    () => BIBLE_ROUTES.filter((r) => layers.routes && r.layers.some((layer) => layers[layer])),
    [layers]
  );
  const showAllNames = layers.names && zoom >= 8;

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-4xl text-[#2b2620] mb-2">Biblical map</h1>
        <p className="text-[#5b5142] max-w-3xl">
          Places named in the stored texts, on today&apos;s globe. Choose a person to see the
          major sites tied to them. Walk around in Street View, or stand at the pin in Google Earth
          and turn — the same stored coordinates, not a new claim.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-wide text-[#8a7f6f] self-center mr-1">Person</span>
        <button
          type="button"
          onClick={() => {
            setPersonId("");
            setViewId("land");
            setViewBounds(MAP_VIEWS[0].bounds);
            setFocus(null);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
            !personId
              ? "bg-[#7a2e2e] text-[#f3e9c8] border-[#7a2e2e]"
              : "bg-white text-[#5b5142] border-[#e8ddc7]"
          }`}
        >
          All
        </button>
        {SCRIPTURE_PEOPLE.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPersonId(p.id);
              const theirs = BIBLICAL_PLACES.filter((place) => p.placeIds.includes(place.id));
              const next = boundsForPlaces(theirs);
              if (next) {
                setViewId("");
                setViewBounds(next);
              }
              setFocus(null);
              if (theirs[0]) setSelectedId(theirs[0].id);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              personId === p.id
                ? "bg-[#7a2e2e] text-[#f3e9c8] border-[#7a2e2e]"
                : "bg-white text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {MAP_VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => {
              setPersonId("");
              setViewId(v.id);
              setViewBounds(v.bounds);
              setFocus(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              viewId === v.id
                ? "bg-[#7a2e2e] text-[#f3e9c8] border-[#7a2e2e]"
                : "bg-white text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { id: "satellite", label: "Satellite" },
          { id: "names", label: "Names on the map" },
          { id: "outlines", label: "Israel and Judah" },
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

      <input
        value={placeQuery}
        onChange={(e) => setPlaceQuery(e.target.value)}
        placeholder="Find a place (ancient or today's name)"
        className="h-10 mb-4 w-full max-w-md rounded-lg border border-[#e8ddc7] bg-white px-3 text-sm"
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem] gap-4 items-start">
        <div className="bible-map-frame h-[62vh] min-h-[420px] rounded-2xl overflow-hidden border border-[#e8ddc7] shadow-sm">
          <MapContainer
            center={[31.78, 35.24]}
            zoom={8}
            className="h-full w-full"
            scrollWheelZoom
          >
            <MapChrome />
            <FitView bounds={viewBounds} />
            <FlyToPlace place={focus} />
            <ZoomWatch onZoom={setZoom} />
            {layers.satellite ? (
              <TileLayer attribution={SAT_ATTR} url={SAT} />
            ) : (
              <TileLayer attribution="&copy; OpenStreetMap contributors" url={OSM} />
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
                    fillOpacity: 0.1,
                  }}
                >
                  <Popup>
                    <p className="font-display text-lg m-0">{poly.name}</p>
                    <p className="text-xs mt-1">{poly.scripture}</p>
                    <p className="text-xs mt-1 text-[#8a7f6f]">
                      Traditional study outline. Not a surveyed border.
                    </p>
                  </Popup>
                </Polygon>
              ))}
            {routes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.positions}
                pathOptions={{ color: route.color, weight: 3, dashArray: "8 7", opacity: 0.85 }}
              >
                <Popup>
                  <p className="font-display text-lg m-0">{route.name}</p>
                  <p className="text-xs mt-1">{route.scripture}</p>
                </Popup>
              </Polyline>
            ))}
            {shown.map((place) => {
              const color = placeColor(place);
              const isSel = selected?.id === place.id;
              return (
                <CircleMarker
                  key={place.id}
                  center={[place.lat, place.lng]}
                  radius={isSel ? 10 : 6}
                  eventHandlers={{ click: () => pick(place) }}
                  pathOptions={{
                    color: isSel ? "#2b2620" : color,
                    fillColor: color,
                    fillOpacity: isSel ? 1 : 0.88,
                    weight: isSel ? 3 : 2,
                  }}
                >
                  {(showAllNames || isSel) && (
                    <Tooltip permanent direction="top" offset={[0, -8]} className="place-tip">
                      <span className="font-display">{place.ancient}</span>
                      {layers.names && place.modern !== place.ancient && (
                        <span className="block text-[10px] text-[#5b5142]">{place.modern}</span>
                      )}
                    </Tooltip>
                  )}
                  <Popup>
                    <p className="font-display text-lg text-[#2b2620] m-0">{place.ancient}</p>
                    <p className="text-sm text-[#5b5142]">Today: {place.modern}</p>
                    <p className="text-xs text-[#8a7f6f] mt-1">
                      {place.era} · {place.scripture}
                    </p>
                    <p className="text-sm text-[#3a3328] mt-2">{place.note}</p>
                    <PlaceGlobeLinks place={place} compact />
                    {place.scripture ? (
                      <Link
                        to={libraryHref({ reference: place.scripture })}
                        className="inline-block mt-2 text-xs text-[#7a2e2e] underline"
                      >
                        Open the stored wording
                      </Link>
                    ) : null}
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <aside className="rounded-2xl border border-[#e8ddc7] bg-white/80 max-h-[62vh] min-h-[220px] overflow-y-auto">
          <p className="sticky top-0 bg-white/95 px-3 py-2 text-xs uppercase tracking-wide text-[#8a7f6f] border-b border-[#e8ddc7]">
            {shown.length} places
          </p>
          <ul>
            {shown.map((place) => (
              <li
                key={place.id}
                className={`border-b border-[#e8ddc7]/70 ${
                  selected?.id === place.id ? "bg-[#f3e9c8]/80" : "hover:bg-[#faf6ef]"
                }`}
              >
                <button type="button" onClick={() => pick(place)} className="w-full text-left px-3 pt-2.5 pb-1">
                  <span className="block font-display text-[#2b2620] leading-tight">{place.ancient}</span>
                  <span className="block text-xs text-[#5b5142]">{place.modern}</span>
                </button>
                <a
                  href={streetViewHref(place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 pb-2 text-[11px] text-[#7a2e2e] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Walk around
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {selected ? (
        <div className="mt-4 rounded-2xl border border-[#e8ddc7] bg-white/80 p-4">
          <p className="font-display text-2xl text-[#2b2620]">{selected.ancient}</p>
          <p className="text-sm text-[#5b5142]">Today: {selected.modern}</p>
          <p className="text-xs text-[#8a7f6f] mt-1">
            {selected.era} · {selected.scripture}
          </p>
          <p className="text-sm text-[#3a3328] mt-2 leading-relaxed">{selected.note}</p>
          <PlaceGlobeLinks place={selected} />
          {selected.scripture ? (
            <Link
              to={libraryHref({ reference: selected.scripture })}
              className="inline-block mt-3 text-sm text-[#7a2e2e] underline"
            >
              Open the stored wording
            </Link>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs text-[#8a7f6f] mt-3">
        Streets and satellite tiles need a network connection. Place-names are stored in this app.
        Disputed identifications are marked in the note. Color marks the era:{" "}
        <span style={{ color: ERA_COLOR.patriarchs }}>patriarchs</span>,{" "}
        <span style={{ color: ERA_COLOR.exodus }}>exodus</span>,{" "}
        <span style={{ color: ERA_COLOR.kingdoms }}>kingdoms</span>,{" "}
        <span style={{ color: ERA_COLOR.exile }}>exile</span>,{" "}
        <span style={{ color: ERA_COLOR.nt }}>New Testament</span>.
      </p>
    </div>
  );
}
