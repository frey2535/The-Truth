import assert from "node:assert/strict";
import {
  createOwnerSession,
  emptyLedger,
  mergeDevices,
  OWNER_EMAIL_DEFAULT,
  ownerCredentials,
  ownerSession,
  ownerStats,
  passwordsMatch,
  recordDevice,
} from "../src/lib/installLedger.js";

assert.equal(passwordsMatch("owner-local", "owner-local"), true);
assert.equal(passwordsMatch("owner-local", "other"), false);
assert.equal(passwordsMatch("", ""), false);

const local = ownerCredentials({}, { allowLocalFallback: true });
assert.equal(local.email, OWNER_EMAIL_DEFAULT);
assert.equal(local.password, "owner-local");
assert.equal(local.configured, true);

const live = ownerCredentials({}, { allowLocalFallback: false });
assert.equal(live.configured, false);

let ledger = emptyLedger();
const first = recordDevice(ledger, {
  device: "device-aaaa-1111",
  platform: "ios",
  source: "standalone",
  standalone: true,
  at: "2026-09-07T12:00:00.000Z",
});
assert.equal(first.added, true);
ledger = first.ledger;

const again = recordDevice(ledger, { device: "device-aaaa-1111", platform: "ios" });
assert.equal(again.added, false);

const second = recordDevice(ledger, {
  device: "device-bbbb-2222",
  platform: "android",
  source: "appinstalled",
  at: "2026-09-07T13:00:00.000Z",
});
assert.equal(second.added, true);
ledger = second.ledger;

const stats = ownerStats(ledger);
assert.equal(stats.total, 2);
assert.equal(stats.byPlatform.ios, 1);
assert.equal(stats.byPlatform.android, 1);
assert.equal(stats.downloads[0].device, "device-b");

const withPrior = mergeDevices(ledger, [
  {
    device: "prior-ios-home",
    platform: "ios",
    source: "prior",
    at: "2026-08-01T12:00:00.000Z",
    note: "Installed before the counter",
  },
  { device: "device-aaaa-1111", platform: "ios" },
]);
assert.equal(withPrior.added, 1);
const priorStats = ownerStats(withPrior.ledger);
assert.equal(priorStats.total, 3);
assert.equal(priorStats.prior, 1);
assert.equal(priorStats.downloads.find((row) => row.source === "prior").note, "Installed before the counter");

const session = createOwnerSession(ledger, OWNER_EMAIL_DEFAULT, 1_000);
assert.ok(session.token.startsWith("own_"));
assert.ok(ownerSession(session.ledger, session.token, 1_000));
assert.equal(ownerSession(session.ledger, session.token, session.exp + 1), null);

console.log("install ledger ok");
