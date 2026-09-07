import { backfillOwnerDownloads, fetchOwnerDownloads, ownerLogin } from "@/lib/installStats";
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

  logout() {
    clearOwnerSession();
  },

  async downloads() {
    return fetchOwnerDownloads();
  },

  async backfill(downloads) {
    return backfillOwnerDownloads(downloads);
  },
};
