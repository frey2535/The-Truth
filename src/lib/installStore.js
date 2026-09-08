/** Durable install ledger for Cloudflare Pages (KV when bound, else Cache). */

import { emptyLedger, mergeDevices } from "./installLedger.js";

export const INSTALL_LEDGER_KEY = "ledger";
export const INSTALL_LEDGER_CACHE_URL = "https://thetruth.currentflowconsulting.org/__install-ledger";
export const INSTALL_DEVICE_CACHE_PREFIX = "https://thetruth.currentflowconsulting.org/__install-device/";

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=31536000",
    },
  });
}

function asLedger(value) {
  if (!value || typeof value !== "object") return emptyLedger();
  return {
    devices: value.devices && typeof value.devices === "object" ? value.devices : {},
    sessions: value.sessions && typeof value.sessions === "object" ? value.sessions : {},
  };
}

async function loadDeviceKeys(env) {
  if (!env?.INSTALLS?.list) return [];
  try {
    const listed = await env.INSTALLS.list({ prefix: "device:" });
    const extras = [];
    for (const item of listed?.keys || []) {
      const device = String(item.name || "").slice("device:".length);
      if (!device) continue;
      const row = await env.INSTALLS.get(item.name, { type: "json" });
      if (row && typeof row === "object") extras.push({ device, ...row });
    }
    return extras;
  } catch {
    return [];
  }
}

export async function loadInstallLedger(env) {
  if (env?.INSTALLS) {
    const blob = asLedger(await env.INSTALLS.get(INSTALL_LEDGER_KEY, { type: "json" }));
    const extras = await loadDeviceKeys(env);
    if (!extras.length) return blob;
    return mergeDevices(blob, extras).ledger;
  }
  const cache = globalThis.caches?.default;
  if (!cache) return emptyLedger();
  const hit = await cache.match(INSTALL_LEDGER_CACHE_URL);
  return hit ? asLedger(await hit.json()) : emptyLedger();
}

export async function saveInstallLedger(env, ledger) {
  const next = asLedger(ledger);
  const raw = JSON.stringify(next);
  if (env?.INSTALLS) {
    await env.INSTALLS.put(INSTALL_LEDGER_KEY, raw);
    await Promise.all(
      Object.entries(next.devices).map(([device, row]) =>
        env.INSTALLS.put(`device:${device}`, JSON.stringify(row))
      )
    );
    return;
  }
  const cache = globalThis.caches?.default;
  if (!cache) return;
  await cache.put(INSTALL_LEDGER_CACHE_URL, jsonResponse(next));
  await Promise.all(
    Object.entries(next.devices).map(([device, row]) =>
      cache.put(`${INSTALL_DEVICE_CACHE_PREFIX}${encodeURIComponent(device)}`, jsonResponse(row))
    )
  );
}
