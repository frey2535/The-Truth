import assert from "node:assert/strict";
import { fitHeaderBar } from "../src/lib/fitHeaderBar.js";

function fakeBar({ clientWidth, full, icons, tight }) {
  let mode = "full";
  const classes = new Set();
  let scale = "1";
  const el = {
    clientWidth,
    classList: {
      remove(...names) {
        names.forEach((name) => classes.delete(name));
        mode = "full";
      },
      add(name) {
        classes.add(name);
        if (name === "truth-header--icons") mode = "icons";
        if (name === "truth-header--tight") mode = "tight";
      },
    },
    style: {
      setProperty(name, value) {
        if (name === "--truth-header-scale") scale = value;
      },
    },
    get scrollWidth() {
      if (mode === "tight") return tight;
      if (mode === "icons") return icons;
      return full;
    },
  };
  const applied = fitHeaderBar(el);
  return { classes, scale, applied };
}

const wide = fakeBar({ clientWidth: 1200, full: 900, icons: 700, tight: 520 });
assert.equal(wide.scale, "1");
assert.equal(wide.classes.size, 0);

const mid = fakeBar({ clientWidth: 900, full: 1100, icons: 820, tight: 600 });
assert.ok(mid.classes.has("truth-header--icons"));
assert.equal(mid.scale, "1");

const narrow = fakeBar({ clientWidth: 400, full: 1100, icons: 720, tight: 520 });
assert.ok(narrow.classes.has("truth-header--icons"));
assert.ok(narrow.classes.has("truth-header--tight"));
assert.ok(Number(narrow.scale) < 1);
assert.ok(Number(narrow.scale) >= 0.5);

console.log("fit header: ok");
