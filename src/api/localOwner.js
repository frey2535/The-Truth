import {
  backfillOwnerDownloads,
  createCursorToken,
  fetchCursorTokens,
  fetchOwnerDownloads,
  ownerLogin,
  ownerLoginWithGoogle,
  revokeCursorToken,
  saveGoogleClientId,
} from "@/lib/installStats";
import { clearOwnerSession, readOwnerSession, writeOwnerSession } from "@/lib/ownerSession";

export const localOwner = {
  session() {
    return readOwnerSession();
  },

  async login(email, password) {
    const session = await ownerLogin(email, password);
    writeOwnerSession(session);
    return session;
  },

  async loginWithGoogle(tokens) {
    const session = await ownerLoginWithGoogle(tokens);
    writeOwnerSession(session);
    return session;
  },

  logout() {
    clearOwnerSession();
  },

  async downloads() {
    return fetchOwnerDownloads();
  },

  async backfill(downloads) {
    return backfillOwnerDownloads(downloads);
  },

  async connectGoogle(clientId) {
    return saveGoogleClientId(clientId);
  },

  async cursorTokens() {
    return fetchCursorTokens();
  },

  async createCursorToken(name) {
    return createCursorToken(name);
  },

  async revokeCursorToken(id) {
    return revokeCursorToken(id);
  },
};
