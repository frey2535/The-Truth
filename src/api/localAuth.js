import {
  getSessionToken,
  httpError,
  loadDb,
  newId,
  publicUser,
  saveDb,
  setSessionToken,
} from "./localDb";
import {
  googleLocalBounceUrl,
  requestGoogleProfile,
  shouldBounceGoogleToLoopback,
} from "@/lib/googleIdentity";
import { loginUrl } from "@/lib/publicUrl";

export const GUEST_EMAIL = "guest@local";

function bytesToB64(bytes) {
  let binary = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary);
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function hashPassword(password, saltB64) {
  const enc = new TextEncoder();
  const encoded = enc.encode(password || "");
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const material = new Uint8Array(salt.length + encoded.length);
  material.set(salt, 0);
  material.set(encoded, salt.length);
  const digest = await crypto.subtle.digest("SHA-256", material);
  return bytesToB64(digest);
}

function findUserByEmail(db, email) {
  const needle = String(email || "").trim().toLowerCase();
  return db.users.find((u) => String(u.email || "").toLowerCase() === needle);
}

function currentUserFromDb(db) {
  const token = getSessionToken();
  if (!token) return null;
  return db.users.find((u) => u.sessionToken === token) || null;
}

export function requireUser() {
  let db = loadDb();
  let user = currentUserFromDb(db);
  if (!user) {
    ensureGuest();
    db = loadDb();
    user = currentUserFromDb(db);
  }
  if (!user) throw httpError("Authentication required", 401);
  return { db, user };
}

export function requireAdmin() {
  const { db, user } = requireUser();
  if (user.role !== "admin") throw httpError("Admin access required", 403);
  return { db, user };
}

function issueSession(db, user) {
  const token = newId("sess");
  user.sessionToken = token;
  saveDb(db);
  setSessionToken(token);
  return token;
}

function buildUser(db, { email, passwordHash, passwordSalt, full_name, isGuest, auth_provider, google_id, picture }) {
  const namedUsers = db.users.filter((u) => u.email !== GUEST_EMAIL);
  const isFirstUser = namedUsers.length === 0 && !isGuest;
  return {
    id: newId("user"),
    email,
    full_name: full_name || email.split("@")[0],
    role: isFirstUser ? "admin" : "user",
    is_guest: !!isGuest,
    created_date: new Date().toISOString(),
    auth_provider: auth_provider || (isGuest ? "guest" : "password"),
    google_id: google_id || "",
    picture: picture || "",
    passwordHash,
    passwordSalt,
    sessionToken: null,
  };
}

async function createAndSignIn(db, email, password) {
  const salt = bytesToB64(randomBytes(16));
  const user = buildUser(db, {
    email,
    passwordHash: await hashPassword(password, salt),
    passwordSalt: salt,
  });
  db.users.push(user);
  delete db.pendingRegistrations[email.toLowerCase()];
  const access_token = issueSession(db, user);
  return { access_token, user: publicUser(user) };
}

export function ensureGuest() {
  const db = loadDb();
  const existingSession = currentUserFromDb(db);
  if (existingSession) return publicUser(existingSession);

  let guest = findUserByEmail(db, GUEST_EMAIL);
  if (!guest) {
    guest = buildUser(db, {
      email: GUEST_EMAIL,
      full_name: "Local guest",
      isGuest: true,
      passwordHash: "",
      passwordSalt: "",
    });
    db.users.push(guest);
  }
  issueSession(db, guest);
  return publicUser(guest);
}

export const localAuth = {
  async me() {
    const { user } = requireUser();
    return publicUser(user);
  },

  ensureGuest,

  async loginViaEmailPassword(email, password) {
    const db = loadDb();
    const normalized = String(email || "").trim();
    if (!normalized || !password) throw httpError("Email and password are required");

    const user = findUserByEmail(db, normalized);
    if (user) {
      if (user.auth_provider === "google" && !user.passwordSalt) {
        throw httpError("This account uses Google. Continue with Google.");
      }
      if (!user.passwordSalt) throw httpError("This local guest account has no password. Create an email account instead.");
      const hash = await hashPassword(password, user.passwordSalt);
      if (hash !== user.passwordHash) throw httpError("Invalid email or password");
      issueSession(db, user);
      return publicUser(user);
    }

    throw httpError("No local account for this email. Create one — Base44 logins were not imported.");
  },

  async register({ email, password }) {
    const db = loadDb();
    const normalized = String(email || "").trim();
    if (!normalized || !password) throw httpError("Email and password are required");
    if (password.length < 6) throw httpError("Password must be at least 6 characters");
    if (findUserByEmail(db, normalized)) {
      throw httpError("An account with this email already exists. Log in instead.");
    }
    return createAndSignIn(db, normalized, password);
  },

  async verifyOtp({ email, otpCode }) {
    const db = loadDb();
    const key = String(email || "").trim().toLowerCase();
    const pending = db.pendingRegistrations[key];
    if (!pending) {
      const existing = findUserByEmail(db, email);
      if (existing?.sessionToken) {
        setSessionToken(existing.sessionToken);
        return { access_token: existing.sessionToken, user: publicUser(existing) };
      }
      throw httpError("No pending registration for this email");
    }
    if (pending.otp && pending.otp !== String(otpCode || "").trim()) {
      throw httpError("Invalid verification code");
    }
    const user = buildUser(db, pending);
    db.users.push(user);
    delete db.pendingRegistrations[key];
    const access_token = issueSession(db, user);
    return { access_token, user: publicUser(user) };
  },

  async resendOtp(email) {
    const db = loadDb();
    const key = String(email || "").trim().toLowerCase();
    const pending = db.pendingRegistrations[key];
    if (!pending) throw httpError("No pending registration for this email");
    pending.otp = String(Math.floor(100000 + Math.random() * 900000));
    saveDb(db);
    return { otp: pending.otp };
  },

  setToken(token) {
    setSessionToken(token);
  },

  logout(redirectUrl) {
    const db = loadDb();
    const token = getSessionToken();
    if (token) {
      const user = db.users.find((u) => u.sessionToken === token);
      if (user) user.sessionToken = null;
      saveDb(db);
    }
    setSessionToken(null);
    ensureGuest();
    if (typeof window !== "undefined") {
      window.location.href = typeof redirectUrl === "string" && redirectUrl.startsWith("/")
        ? redirectUrl
        : "/";
    }
  },

  redirectToLogin() {
    if (typeof window !== "undefined") window.location.assign(loginUrl());
  },

  async signInWithGoogle(profile) {
    const email = String(profile?.email || "").trim();
    if (!email) throw httpError("Google did not share an email address.");
    if (profile?.email_verified === false) {
      throw httpError("Google has not verified this email.");
    }

    const db = loadDb();
    let user = findUserByEmail(db, email);
    if (!user) {
      user = buildUser(db, {
        email,
        full_name: profile.full_name,
        passwordHash: "",
        passwordSalt: "",
        auth_provider: "google",
        google_id: profile.google_id,
        picture: profile.picture,
      });
      db.users.push(user);
    } else if (user.is_guest || user.email === GUEST_EMAIL) {
      throw httpError("The guest account cannot be linked to Google. Sign in again.");
    } else {
      user.auth_provider = user.auth_provider === "password" ? "password" : "google";
      if (profile.google_id) user.google_id = profile.google_id;
      if (profile.full_name && (!user.full_name || user.full_name === user.email.split("@")[0])) {
        user.full_name = profile.full_name;
      }
      if (profile.picture) user.picture = profile.picture;
    }

    issueSession(db, user);
    return publicUser(user);
  },

  async loginWithProvider(provider, fromUrl = "/") {
    if (provider !== "google") {
      throw httpError("Only Google sign-in is available.");
    }
    if (shouldBounceGoogleToLoopback()) {
      window.location.assign(googleLocalBounceUrl(fromUrl));
      return;
    }
    const dest =
      typeof fromUrl === "string" && fromUrl.startsWith("/") && !fromUrl.startsWith("//")
        ? fromUrl
        : "/";
    const profile = await requestGoogleProfile();
    await this.signInWithGoogle(profile);
    window.location.assign(dest);
  },

  async resetPasswordRequest(email) {
    const db = loadDb();
    const user = findUserByEmail(db, email);
    if (!user || user.is_guest) return { ok: true };
    const token = newId("reset");
    db.resetTokens[token] = {
      userId: user.id,
      expires: Date.now() + 1000 * 60 * 60,
    };
    saveDb(db);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return { ok: true, reset_url: `${origin}/reset-password?token=${token}` };
  },

  async resetPassword({ resetToken, newPassword }) {
    const db = loadDb();
    const rec = db.resetTokens[resetToken];
    if (!rec || rec.expires < Date.now()) throw httpError("This reset link is invalid or has expired");
    if (!newPassword || newPassword.length < 6) throw httpError("Password must be at least 6 characters");
    const user = db.users.find((u) => u.id === rec.userId);
    if (!user) throw httpError("User not found");
    const salt = bytesToB64(randomBytes(16));
    user.passwordSalt = salt;
    user.passwordHash = await hashPassword(newPassword, salt);
    user.sessionToken = null;
    delete db.resetTokens[resetToken];
    saveDb(db);
    return { ok: true };
  },
};
