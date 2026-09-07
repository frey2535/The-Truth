const DB_KEY = "searchingfortruth_db_v1";
const SESSION_KEY = "searchingfortruth_session";

const EMPTY_DB = () => ({
  users: [],
  pendingRegistrations: {},
  resetTokens: {},
  files: {},
  entities: {
    Evidence: [],
    ScientificConfirmation: [],
    GovernmentDocument: [],
    StudyVerse: [],
    Conversation: [],
    WordStudy: [],
    Lesson: [],
    StudyPath: [],
    StudyPlan: [],
    ModernFulfillment: [],
    Note: [],
    Highlight: [],
    Favorite: [],
    Topic: [],
  },
  seeded: false,
});

export function loadDb() {
  if (typeof window === "undefined") return EMPTY_DB();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) {
      const initial = EMPTY_DB();
      saveDb(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_DB(),
      ...parsed,
      entities: {
        ...EMPTY_DB().entities,
        ...(parsed.entities || {}),
      },
    };
  } catch {
    const initial = EMPTY_DB();
    try {
      saveDb(initial);
    } catch {
      /* ignore quota errors during recovery */
    }
    return initial;
  }
}

export function saveDb(db) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    throw httpError("Could not save data in this browser. Clear site data for localhost and try again.");
  }
}

export function getSessionToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(SESSION_KEY, token);
  else window.localStorage.removeItem(SESSION_KEY);
}

export function emptyStudyEntities() {
  return EMPTY_DB().entities;
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, passwordSalt, sessionToken, ...safe } = user;
  return safe;
}

export function newId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function httpError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}
