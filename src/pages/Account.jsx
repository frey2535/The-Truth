import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { GUEST_EMAIL } from "@/api/localAuth";
import { Button } from "@/components/ui/button";
import LegalDoc, { LegalH2, LegalP } from "@/components/LegalDoc";
import { CONTACT_EMAIL, reportMailto } from "@/lib/contact";

export default function Account() {
  const { user, deleteLocalAccount } = useAuth();
  const named = user && !user.is_guest && user.email !== GUEST_EMAIL;
  const [wipeStudy, setWipeStudy] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const deleteMail = reportMailto({
    path: "/account",
    title: "Delete account",
    message: "Please help me delete my The Truth account and any data you hold for this email:",
  });

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
        This page is how you delete a The Truth reader account. Accounts live in this browser or
        the installed Play app, not on a central membership server. There is nothing to cancel and
        no paid subscription.
      </LegalP>

      {done ? (
        <p className="rounded-xl border border-[#cfe3c8] bg-[#f3faf0] px-4 py-3 text-sm text-[#2e6b3a]">
          The named account on this device is gone. You can keep reading as a guest.
        </p>
      ) : named ? (
        <>
          <LegalH2>Delete the account on this device</LegalH2>
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
          <LegalH2>How to delete if you are not signed in here</LegalH2>
          <LegalP>
            This browser or Play install is using the guest session, so there is no named account
            on this device to erase. If you created an account on a phone or computer, open this
            same page while signed in on that device and tap Delete. You can also clear site data
            for thetruth.currentflowconsulting.org in Chrome or Android settings.
          </LegalP>
        </>
      )}

      <LegalH2>Request deletion by email</LegalH2>
      <LegalP>
        Anyone can request help deleting an account without installing the app. Email{" "}
        <a className="text-[#7a2e2e] underline" href={deleteMail}>
          {CONTACT_EMAIL}
        </a>{" "}
        with the address you used. Reader accounts are stored on the device that created them. We
        do not keep a central membership list. Install counts are anonymous device events and are
        not tied to your email.
      </LegalP>

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
        .
      </p>
    </LegalDoc>
  );
}
