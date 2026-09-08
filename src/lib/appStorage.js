/** App document vault capacity: 1 tebibyte on this device. */
export const APP_STORAGE_BYTES = 1024 * 1024 * 1024 * 1024;
export const APP_STORAGE_LABEL = "1 TB";
const DB_NAME = "the_truth_vault_v1";
const STORE = "documents";

export function formatStorageBytes(bytes) {
  const n = Math.max(0, Number(bytes) || 0);
  const tb = 1024 ** 4;
  const gb = 1024 ** 3;
  const mb = 1024 ** 2;
  const kb = 1024;
  if (n >= tb) return `${(n / tb).toFixed(n >= 10 * tb ? 0 : 2)} TB`;
  if (n >= gb) return `${(n / gb).toFixed(n >= 10 * gb ? 0 : 2)} GB`;
  if (n >= mb) return `${(n / mb).toFixed(n >= 10 * mb ? 0 : 1)} MB`;
  if (n >= kb) return `${(n / kb).toFixed(0)} KB`;
  return `${Math.round(n)} B`;
}

export function wouldExceedCapacity(usedBytes, addBytes, cap = APP_STORAGE_BYTES) {
  return Number(usedBytes || 0) + Number(addBytes || 0) > cap;
}

export async function requestPersistentStorage() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function browserStorageEstimate() {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return { usage: 0, quota: 0, persistent: false };
  }
  try {
    const estimate = await navigator.storage.estimate();
    const persistent = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    return {
      usage: Number(estimate.usage) || 0,
      quota: Number(estimate.quota) || 0,
      persistent: Boolean(persistent),
    };
  } catch {
    return { usage: 0, quota: 0, persistent: false };
  }
}

function openVault() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This browser cannot hold the 1 TB document vault."));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Could not open document vault."));
  });
}

function vaultOp(mode, fn) {
  return openVault().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

export async function listVaultDocuments() {
  const rows = (await vaultOp("readonly", (store) => store.getAll())) || [];
  return rows.sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
}

export async function vaultUsageBytes() {
  const rows = await listVaultDocuments();
  return rows.reduce((sum, row) => sum + (Number(row.size) || 0), 0);
}

export async function putVaultDocument(doc) {
  await vaultOp("readwrite", (store) => store.put(doc));
  return doc;
}

export async function getVaultDocument(id) {
  return vaultOp("readonly", (store) => store.get(id));
}

export async function deleteVaultDocument(id) {
  await vaultOp("readwrite", (store) => store.delete(id));
}

export async function appStorageStatus() {
  const used = await vaultUsageBytes().catch(() => 0);
  const browser = await browserStorageEstimate();
  await requestPersistentStorage();
  const persistent = browser.persistent || (typeof navigator !== "undefined" && navigator.storage?.persisted
    ? await navigator.storage.persisted().catch(() => false)
    : false);
  return {
    used,
    capacity: APP_STORAGE_BYTES,
    remaining: Math.max(0, APP_STORAGE_BYTES - used),
    label: APP_STORAGE_LABEL,
    persistent: Boolean(persistent),
    browserQuota: browser.quota,
    browserUsage: browser.usage,
  };
}
