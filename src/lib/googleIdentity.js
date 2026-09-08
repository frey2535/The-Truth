import { publishedApiOrigin } from "@/lib/appOrigin";
import { loginUrl } from "@/lib/publicUrl";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const PKCE_KEY = "truth_google_pkce";
const REDIRECT_KEY = "truth_google_redirect";

let cachedClientId = "";

function normalizeClientId(value) {
  return String(value || "")
    .trim()
    .replace(/(\.apps\.googleusercontent\.com)+$/i, ".apps.googleusercontent.com");
}

export function getGoogleClientId() {
  return cachedClientId || normalizeClientId(import.meta.env.VITE_GOOGLE_CLIENT_ID);
}

export async function resolveGoogleClientId() {
  if (cachedClientId) return cachedClientId;
  const fromBuild = normalizeClientId(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  if (fromBuild) {
    cachedClientId = fromBuild;
    return cachedClientId;
  }
  try {
    const res = await fetch(`${publishedApiOrigin()}/api/google-token`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    const fromApi = normalizeClientId(data.clientId);
    if (fromApi) {
      cachedClientId = fromApi;
      return cachedClientId;
    }
  } catch {
    /* live site may not have the function yet */
  }
  return "";
}

export function googleSignInOriginHint() {
  if (typeof window === "undefined") return "";
  if (window.location.protocol === "http:" && window.location.hostname !== "127.0.0.1") {
    const port = window.location.port || "5174";
    return `Open http://127.0.0.1:${port}/login for Google. Also add that origin in Google Cloud → Credentials → Authorized JavaScript origins.`;
  }
  return "";
}

export function shouldBounceGoogleToLoopback() {
  if (typeof window === "undefined") return false;
  if (window.location.protocol !== "http:") return false;
  const host = window.location.hostname;
  return host !== "127.0.0.1" && (host === "localhost" || host.endsWith(".localhost"));
}

export function googleLocalBounceUrl(returnTo = "/") {
  const port = window.location.port || "5174";
  const dest =
    typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/";
  return `http://127.0.0.1:${port}/login?google_start=1&returnTo=${encodeURIComponent(dest)}`;
}

function decodeState(raw) {
  const b64 = String(raw || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function decodeJwtPayload(token) {
  const parts = String(token || "").split(".");
  if (parts.length < 2) throw new Error("Google did not return a valid sign-in token.");
  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function loginRedirectUri() {
  const path = loginUrl();
  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function profileFromIdToken(idToken) {
  const clientId = getGoogleClientId();
  const payload = decodeJwtPayload(idToken);
  if (!clientId || payload.aud !== clientId) {
    throw new Error("Google returned a token for a different app. Check VITE_GOOGLE_CLIENT_ID.");
  }
  if (!payload.email) throw new Error("Google did not share an email address.");
  if (payload.email_verified === false) throw new Error("Google has not verified this email.");
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("The Google sign-in token expired. Try again.");
  }
  return {
    email: String(payload.email).trim(),
    full_name: payload.name || String(payload.email).split("@")[0],
    google_id: payload.sub || "",
    picture: payload.picture || "",
    email_verified: payload.email_verified !== false,
  };
}

function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }
    const existing = document.querySelector('script[data-truth-gis="1"]');
    const onReady = () => {
      if (window.google?.accounts?.oauth2) resolve(window.google);
      else reject(new Error("Google sign-in failed to load."));
    };
    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Google sign-in.")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.dataset.truthGis = "1";
    script.onload = onReady;
    script.onerror = () => reject(new Error("Could not load Google sign-in."));
    document.head.appendChild(script);
  });
}

export async function requestGoogleProfile() {
  const clientId = await resolveGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google sign-in is not connected on this copy. On the live site the function reads GOOGLE_CLIENT_ID from the thetruth Pages environment. Locally set VITE_GOOGLE_CLIENT_ID in .env.local."
    );
  }
  const google = await loadGis();
  return new Promise((resolve, reject) => {
    const fail = (err) => {
      const type = err?.type || "";
      const message = String(err?.message || err?.type || "");
      if (type === "popup_closed" || type === "popup_failed_to_open") {
        reject(
          new Error(
            "Google sign-in popup was blocked or closed. Allow popups, or open this page in Chrome: http://127.0.0.1:5174/login"
          )
        );
        return;
      }
      if (/origin/i.test(message) || /idpiframe/i.test(message)) {
        reject(
          new Error(
            "Google rejected this page origin. In Google Cloud → Credentials, add Authorized JavaScript origin http://127.0.0.1:5174"
          )
        );
        return;
      }
      reject(new Error(err?.message || "Google sign-in failed."));
    };

    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: async (resp) => {
        if (resp.error) {
          fail({ message: resp.error_description || resp.error });
          return;
        }
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${resp.access_token}` },
          });
          if (!res.ok) throw new Error("Google did not return a profile.");
          const profile = await res.json();
          if (!profile.email) throw new Error("Google did not share an email address.");
          if (profile.email_verified === false) {
            throw new Error("Google has not verified this email.");
          }
          resolve({
            email: String(profile.email).trim(),
            full_name: profile.name || String(profile.email).split("@")[0],
            google_id: profile.sub || "",
            picture: profile.picture || "",
            email_verified: profile.email_verified !== false,
          });
        } catch (error) {
          fail(error);
        }
      },
      error_callback: fail,
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}

function readCallbackParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const fromHash = new URLSearchParams(hash);
  if (fromHash.get("id_token") || fromHash.get("error") || fromHash.get("code")) return fromHash;
  return new URLSearchParams(window.location.search);
}

function clearGoogleCallbackFromUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  ["id_token", "access_token", "code", "state", "error", "error_description", "nonce", "authuser", "prompt", "scope", "session_state", "google_start"].forEach(
    (key) => url.searchParams.delete(key)
  );
  window.history.replaceState(null, "", url.pathname + url.search);
}

async function exchangeCode(code) {
  const codeVerifier = sessionStorage.getItem(PKCE_KEY);
  const redirectUri = sessionStorage.getItem(REDIRECT_KEY) || loginRedirectUri();
  sessionStorage.removeItem(PKCE_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  if (!codeVerifier) {
    throw new Error("Google sign-in was interrupted. Try Continue with Google again.");
  }
  const res = await fetch("/api/google-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
  return data.id_token;
}

export async function consumeGoogleRedirect() {
  const params = readCallbackParams();
  const error = params.get("error");
  const idToken = params.get("id_token");
  const code = params.get("code");
  if (!error && !idToken && !code) return null;

  let state = {};
  try {
    state = decodeState(params.get("state") || "");
  } catch {
    state = {};
  }

  clearGoogleCallbackFromUrl();

  if (error) {
    if (error === "access_denied") throw new Error("Google sign-in was cancelled.");
    if (error === "redirect_uri_mismatch" || /redirect/i.test(params.get("error_description") || "")) {
      throw new Error(
        "Google Error 400 is a redirect URI mismatch. In Google Cloud → Credentials, add Authorized redirect URI http://127.0.0.1:5174/login exactly."
      );
    }
    throw new Error(params.get("error_description") || `Google sign-in failed (${error}).`);
  }

  const token = idToken || (await exchangeCode(code));
  const returnTo =
    typeof state.r === "string" && state.r.startsWith("/") && !state.r.startsWith("//")
      ? state.r
      : "/";
  return { returnTo, profile: profileFromIdToken(token) };
}
