import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { GUEST_EMAIL } from "@/api/localAuth";
import { Button } from "@/components/ui/button";
import LegalDoc, { LegalH2, LegalP } from "@/components/LegalDoc";

export default function Account() {
  const { user, deleteLocalAccount } = useAuth();
  const named = user && !user.is_guest && user.email !== GUEST_EMAIL;
  const [wipeStudy, setWipeStudy] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!named || busy) return;
    const ok = window.confirm(
      wipeStudy
        ? "Delete this device’s account and erase notes, plans, and highlights stored here?"
        : "Delete this device’s sign-in? Notes and plans will stay on this device."
    );
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await deleteLocalAccount({ wipeStudyData: wipeStudy });
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not delete the account on this device.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <LegalDoc kicker="Your data" title="Delete account" updated="Google Play account-deletion URL">
      <LegalP>
        Reader accounts for The Truth live in this browser or installed app, not on a central
        membership server. Deleting here removes the named account from <em>this device</em>.
      </LegalP>

      {done ? (
        <p className="rounded-xl border border-[#cfe3c8] bg-[#f3faf0] px-4 py-3 text-sm text-[#2e6b3a]">
          The named account on this device is gone. You can keep reading as a guest.
        </p>
      ) : named ? (
        <>
          <LegalH2>Account on this device</LegalH2>
          <p className="text-sm text-[#5b5142]">
            Signed in as <strong className="text-[#2b2620]">{user.email}</strong>
            {user.full_name ? ` (${user.full_name})` : ""}.
            {user.auth_provider === "google" ? " This session used Google." : ""}
          </p>
          <label className="flex items-start gap-2 text-sm text-[#3a3328]">
            <input
              type="checkbox"
              className="mt-1"
              checked={wipeStudy}
              onChange={(event) => setWipeStudy(event.target.checked)}
            />
            Also erase notes, highlights, favorites, and study plans stored on this device.
          </label>
          {error ? <p className="text-sm text-[#7a2e2e]">{error}</p> : null}
          <Button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="h-11 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]"
          >
            {busy ? "Deleting…" : "Delete this device’s account"}
          </Button>
        </>
      ) : (
        <>
          <LegalH2>No named account here</LegalH2>
          <LegalP>
            This device is using the local guest session. There is no email account to delete.
            Create one from{" "}
            <Link className="text-[#7a2e2e] underline" to="/register">
              Create account
            </Link>{" "}
            only if you want a name on this device.
          </LegalP>
        </>
      )}

      <LegalH2>Other ways to clear data</LegalH2>
      <p className="text-sm text-[#5b5142] leading-relaxed">
        Chrome or the Play wrapper: site settings → clear data for thetruth.currentflowconsulting.org.
        If you used Google, revoke access at{" "}
        <a
          className="text-[#7a2e2e] underline"
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google account permissions
        </a>
        . Install counts are anonymous and are not tied to your email.
      </p>
    </LegalDoc>
  );
}
