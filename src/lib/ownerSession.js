const KEY = "the_truth_owner_session";

export function readOwnerSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || (parsed.exp && parsed.exp < Date.now())) {
      window.sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeOwnerSession(session) {
  if (typeof window === "undefined") return;
  if (!session?.token) {
    window.sessionStorage.removeItem(KEY);
    return;
  }
  window.sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearOwnerSession() {
  writeOwnerSession(null);
}
