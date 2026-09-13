import assert from "node:assert/strict";
import { BIBLICAL_PLACES } from "../src/data/biblicalPlaces.js";
import { layoutPlaceLabels, pinLabel } from "../src/lib/mapLabelLayout.js";

assert.equal(pinLabel({ ancient: "Jerusalem / Jebus / Zion" }), "Jerusalem");
assert.equal(pinLabel({ ancient: "Hebron / Kirjath-arba" }), "Hebron");
assert.equal(pinLabel({ ancient: "Israel (northern kingdom)" }), "Israel");
assert.equal(pinLabel({ ancient: "Nazareth" }), "Nazareth");
assert.equal(pinLabel({ id: "galileesea", ancient: "Sea of Chinnereth / Galilee / Tiberias" }), "Galilee");

const land = BIBLICAL_PLACES.filter((p) =>
  p.layers.some((layer) => ["patriarchs", "exodus", "kingdoms", "exile", "nt"].includes(layer))
);
const clusterIds = ["jerusalem", "olives", "bethany", "bethlehem", "hebron", "emmaus"];
const cluster = clusterIds.map((id) => land.find((p) => p.id === id));

const atLand = layoutPlaceLabels(land, { zoom: 7, selectedId: "jerusalem" });
assert.equal(atLand.has("jerusalem"), true, "Jerusalem keeps its name on the land view");
assert.equal(atLand.has("olives"), false, "Mount of Olives must not sit on Jerusalem at land zoom");
assert.equal(atLand.has("bethany"), false, "Bethany must not sit on Jerusalem at land zoom");
assert.equal(atLand.has("bethlehem"), false, "Bethlehem is too close for a standing name at land zoom");
assert.equal(atLand.has("hebron"), false, "Hebron waits until there is room");
assert.equal(atLand.has("rome"), true, "far cities can still keep a name");

const atHolyLand = layoutPlaceLabels(cluster, { zoom: 8, selectedId: "jerusalem" });
assert.equal(atHolyLand.has("jerusalem"), true);
assert.ok(
  [...atHolyLand.keys()].every((id) => id === "jerusalem" || id === "emmaus"),
  `Jerusalem cluster at zoom 8 should hide overlapping names, got ${[...atHolyLand.keys()]}`
);

const closeUp = layoutPlaceLabels(cluster, { zoom: 14, selectedId: "jerusalem" });
assert.equal(closeUp.has("jerusalem"), true);
assert.ok(closeUp.has("olives"), "Olives can sit beside Jerusalem when zoomed in");
assert.ok(
  closeUp.size >= 4,
  `zooming in should reveal more of the Jerusalem cluster, got ${[...closeUp.keys()]}`
);

const jesus = ["bethlehem", "nazareth", "capernaum", "cana", "sychar", "bethany", "jerusalem", "olives", "jericho"]
  .map((id) => land.find((p) => p.id === id));
const jesusView = layoutPlaceLabels(jesus, { zoom: 8, selectedId: "jerusalem" });
assert.equal(jesusView.has("jerusalem"), true);
assert.equal(jesusView.has("olives"), false);
assert.ok(jesusView.has("nazareth") || jesusView.has("capernaum"), "Galilee still gets one name");

console.log("map labels: ok");
