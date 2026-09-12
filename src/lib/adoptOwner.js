import { isPlatformOwnerEmail } from "@/lib/installLedger";

/** After Google proves the owner Gmail, open the platform-owner session too. */
export async function adoptOwnerFromGoogle(loginWithGoogle, profile = {}, idToken = "") {
  if (typeof loginWithGoogle !== "function") return false;
  if (!isPlatformOwnerEmail(profile?.email)) return false;
  const token = idToken || profile.idToken || "";
  const access = profile.access_token || profile.accessToken || "";
  if (!token && !access) return false;
  await loginWithGoogle({ idToken: token, accessToken: access });
  return true;
}
