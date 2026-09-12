import assert from "node:assert/strict";
import {
  createOwnerSession,
  emptyLedger,
  isPlatformOwnerEmail,
  mergeDevices,
  OWNER_EMAIL_DEFAULT,
  ownerCredentials,
  ownerSession,
  ownerStats,
  passwordsMatch,
  recordDevice,
  signOwnerToken,
  verifyOwnerToken,
} from "../src/lib/installLedger.js";

assert.equal(passwordsMatch("owner-local", "owner-local"), true);
assert.equal(passwordsMatch("owner-local", "other"), false);
assert.equal(passwordsMatch("", ""), false);

const local = ownerCredentials({}, { allowLocalFallback: true });
assert.equal(OWNER_EMAIL_DEFAULT, "currenflowconsultingllc@gmail.com");
assert.equal(local.email, OWNER_EMAIL_DEFAULT);
assert.equal(local.password, "owner-local");
assert.equal(local.configured, true);
assert.equal(isPlatformOwnerEmail("currenflowconsultingllc@gmail.com"), true);
assert.equal(isPlatformOwnerEmail("someone@example.com"), false);
assert.equal(
  isPlatformOwnerEmail("old@example.com", { email: "old@example.com" }),
  true
);

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

const play = recordDevice(ledger, {
  device: "device-play-3333",
  platform: "android",
  source: "play",
  at: "2026-09-08T14:00:00.000Z",
});
assert.equal(play.added, true);
ledger = play.ledger;

const stats = ownerStats(ledger);
assert.equal(stats.total, 3);
assert.equal(stats.byPlatform.ios, 1);
assert.equal(stats.byPlatform.android, 2);
assert.equal(stats.downloads[0].device, "device-p");
assert.equal(stats.downloads[0].source, "play");

const detailed = recordDevice(emptyLedger(), {
  device: "device-detail-01",
  platform: "android",
  source: "appinstalled",
  standalone: true,
  at: "2026-09-12T12:00:00.000Z",
  language: "en-US",
  timezone: "America/Denver",
  browser: "Chrome on Android",
  share: "facebook",
});
assert.equal(detailed.added, true);
const seen = recordDevice(detailed.ledger, {
  device: "device-detail-01",
  platform: "android",
  lastSeen: "2026-09-12T13:00:00.000Z",
  language: "en-US",
});
assert.equal(seen.added, false);
assert.equal(seen.updated, true);
const detailStats = ownerStats(seen.ledger);
assert.equal(detailStats.downloads[0].share, "facebook");
assert.equal(detailStats.downloads[0].browser, "Chrome on Android");
assert.equal(detailStats.downloads[0].lastSeen, "2026-09-12T13:00:00.000Z");
assert.equal(detailStats.downloads[0].at, "2026-09-12T12:00:00.000Z");

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
assert.equal(priorStats.total, 4);
assert.equal(priorStats.prior, 1);
assert.equal(priorStats.downloads.find((row) => row.source === "prior").note, "Installed before the counter");

const session = createOwnerSession(ledger, OWNER_EMAIL_DEFAULT, 1_000);
assert.ok(session.token.startsWith("own_"));
assert.ok(ownerSession(session.ledger, session.token, 1_000));
assert.equal(ownerSession(session.ledger, session.token, session.exp + 1), null);

const signed = await signOwnerToken(OWNER_EMAIL_DEFAULT, "owner-secret", 1_000);
assert.ok(signed.token.startsWith("own2."));
assert.equal((await verifyOwnerToken(signed.token, "owner-secret", 1_000)).email, OWNER_EMAIL_DEFAULT);
assert.equal(await verifyOwnerToken(signed.token, "wrong-secret", 1_000), null);
assert.equal(await verifyOwnerToken(signed.token, "owner-secret", signed.exp + 1), null);

console.log("install ledger ok");
