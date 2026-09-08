import assert from "node:assert/strict";
import {
  PUBLISHED_APP_URL,
  isLocalInstallOrigin,
  isLoopbackInstallOrigin,
  metricsApiOrigin,
} from "../src/lib/appOrigin.js";
import {
  detectInstallSource,
  displayLooksInstalled,
  launchedFromAndroidApp,
} from "../src/lib/installDisplay.js";
import { handleInstallHit, handleOwnerLogin, persistRecordedDevice } from "../src/lib/installsApi.js";
import { emptyLedger, OWNER_EMAIL_DEFAULT } from "../src/lib/installLedger.js";
import { loadInstallLedger, saveInstallLedger } from "../src/lib/installStore.js";

assert.equal(isLoopbackInstallOrigin("truth.localhost"), true);
assert.equal(isLoopbackInstallOrigin("192.168.1.20"), false);
assert.equal(isLocalInstallOrigin("192.168.1.20"), true);
assert.equal(isLocalInstallOrigin("10.0.0.4"), true);
assert.equal(metricsApiOrigin("truth.localhost"), "");
assert.equal(metricsApiOrigin("127.0.0.1"), "");
assert.equal(metricsApiOrigin("192.168.1.20"), PUBLISHED_APP_URL);
assert.equal(metricsApiOrigin("thetruth.currentflowconsulting.org"), PUBLISHED_APP_URL);
assert.equal(metricsApiOrigin("frey2535.github.io"), PUBLISHED_APP_URL);

assert.equal(launchedFromAndroidApp("android-app://org.currentflowconsulting.thetruth"), true);
assert.equal(launchedFromAndroidApp("https://thetruth.currentflowconsulting.org/"), false);
assert.equal(
  displayLooksInstalled({
    matchMedia: (query) => ({ matches: query.includes("minimal-ui") }),
    standalone: false,
  }),
  true
);
assert.equal(
  displayLooksInstalled({
    matchMedia: () => ({ matches: false }),
    standalone: false,
  }),
  false
);
assert.equal(
  detectInstallSource({
    referrer: "android-app://org.currentflowconsulting.thetruth",
    matchMedia: () => ({ matches: false }),
    standalone: false,
  }),
  "play"
);
assert.equal(
  detectInstallSource({
    referrer: "",
    matchMedia: (query) => ({ matches: query.includes("standalone") }),
  }),
  "standalone"
);

const memory = { ledger: emptyLedger(), writes: 0 };
const flaky = {
  async load() {
    return structuredClone(memory.ledger);
  },
  async save(ledger) {
    memory.writes += 1;
    if (memory.writes === 1) return;
    memory.ledger = structuredClone(ledger);
  },
};
const first = await persistRecordedDevice({
  body: { device: "device-retry-aaaa", platform: "ios", source: "homescreen" },
  load: flaky.load,
  save: flaky.save,
});
assert.equal(first.status, 200);
assert.equal(first.body.recorded, true);
assert.equal(Boolean(memory.ledger.devices["device-retry-aaaa"]), true);

class MemoryKV {
  constructor() {
    this.map = new Map();
  }
  async get(key, { type } = {}) {
    const raw = this.map.get(key);
    if (raw == null) return null;
    return type === "json" ? JSON.parse(raw) : raw;
  }
  async put(key, value) {
    this.map.set(key, value);
  }
  async list({ prefix }) {
    return {
      keys: [...this.map.keys()].filter((name) => name.startsWith(prefix)).map((name) => ({ name })),
    };
  }
}

const env = { INSTALLS: new MemoryKV() };
await saveInstallLedger(env, {
  devices: {
    "device-kv-1111": { at: "2026-09-08T12:00:00.000Z", platform: "android", source: "play" },
  },
  sessions: {},
});
assert.equal(Boolean(env.INSTALLS.map.get("device:device-kv-1111")), true);
const loaded = await loadInstallLedger(env);
assert.equal(loaded.devices["device-kv-1111"].source, "play");

env.INSTALLS.map.delete("ledger");
const recovered = await loadInstallLedger(env);
assert.equal(recovered.devices["device-kv-1111"].platform, "android");

const login = await handleOwnerLogin({
  body: { email: OWNER_EMAIL_DEFAULT, password: "owner-secret" },
  credentials: { configured: true, email: OWNER_EMAIL_DEFAULT, password: "owner-secret" },
});
assert.equal(login.status, 200);
assert.ok(login.body.token.startsWith("own2."));

const hitStore = { ledger: emptyLedger() };
const hit = await handleInstallHit({
  query: { device: "device-hit-9999", platform: "ios", source: "appinstalled", standalone: "1" },
  load: async () => hitStore.ledger,
  save: async (ledger) => {
    hitStore.ledger = ledger;
  },
});
assert.equal(hit.status, 200);
assert.equal(hit.body.recorded, true);
assert.equal(Boolean(hitStore.ledger.devices["device-hit-9999"]), true);

console.log("install metrics ok");
