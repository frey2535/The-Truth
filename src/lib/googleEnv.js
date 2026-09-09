const CLIENT_ID_KEYS = [
  "GOOGLE_CLIENT_ID",
  "VITE_GOOGLE_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_ID",
  "OAUTH_CLIENT_ID",
  "GOOGLE_ID",
];

const CLIENT_SECRET_KEYS = [
  "GOOGLE_CLIENT_SECRET",
  "VITE_GOOGLE_CLIENT_SECRET",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "GOOGLE_SECRET",
];

export function normalizeGoogleClientId(value) {
  return String(value || "")
    .trim()
    .replace(/(\.apps\.googleusercontent\.com)+$/i, ".apps.googleusercontent.com");
}

export function looksLikeGoogleClientId(value) {
  return /\.apps\.googleusercontent\.com$/i.test(normalizeGoogleClientId(value));
}

function readKeys(env, keys) {
  const bag = env || {};
  for (const name of keys) {
    const value = String(bag[name] || "").trim();
    if (value) return value;
  }
  return "";
}

export function googleClientIdFromEnv(env) {
  const named = normalizeGoogleClientId(readKeys(env, CLIENT_ID_KEYS));
  if (named) return named;
  const bag = env || {};
  for (const value of Object.values(bag)) {
    if (typeof value === "string" && looksLikeGoogleClientId(value)) {
      return normalizeGoogleClientId(value);
    }
  }
  return "";
}

export function googleClientSecretFromEnv(env) {
  return readKeys(env, CLIENT_SECRET_KEYS);
}
