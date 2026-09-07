import { Link } from "react-router-dom";
import LegalDoc, { LegalH2, LegalList, LegalP } from "@/components/LegalDoc";
import { ACCOUNT_DELETION_URL, PRIVACY_POLICY_URL } from "@/lib/playStore";

export default function DataSafety() {
  return (
    <LegalDoc
      kicker="Google Play"
      title="Data safety"
      updated="Use these answers on the Play Console Data safety form. Updated 7 September 2026."
    >
      <LegalP>
        This page is for the store listing, not a second privacy policy. The public policy is{" "}
        <Link className="text-[#7a2e2e] underline" to="/privacy">
          {PRIVACY_POLICY_URL}
        </Link>
        .
      </LegalP>

      <LegalH2>Overview</LegalH2>
      <LegalList>
        <li>The app is free. No paid download, in-app purchases, or subscriptions.</li>
        <li>Does the app collect required user data to work? No. Reading works without an account.</li>
        <li>Data is encrypted in transit (HTTPS).</li>
        <li>Users can request deletion of the on-device account: {ACCOUNT_DELETION_URL}</li>
        <li>Data is not sold.</li>
        <li>No independent security review to declare.</li>
      </LegalList>

      <LegalH2>Data collected — declare these</LegalH2>
      <LegalList>
        <li>
          <strong>Personal info → Email address, Name</strong> — optional, if the reader creates a
          local account or continues with Google. Stored on the device. Purpose: App functionality
          (sign-in).
        </li>
        <li>
          <strong>Photos and videos</strong> — only the Google profile picture URL, if they use
          Google sign-in. Stored on the device. Purpose: App functionality.
        </li>
        <li>
          <strong>App info and performance → Other app performance data</strong> — optional install
          event (random device id, platform, source, timestamp) sent to this site so the operator
          can count installs. Purpose: Analytics. Not linked to the reader’s name or email.
        </li>
        <li>
          <strong>Device or other IDs</strong> — the random install device id above, and ordinary
          user-agent on web requests. Purpose: Analytics / App functionality.
        </li>
      </LegalList>

      <LegalH2>Do not declare</LegalH2>
      <LegalList>
        <li>Location</li>
        <li>Financial info (the app is free; it never takes a payment)</li>
        <li>Health and fitness</li>
        <li>Messages, contacts, calendar</li>
        <li>Files and docs as a collected type (reader uploads stay on the device if used)</li>
        <li>Audio, microphone, camera</li>
        <li>Advertising or marketing IDs</li>
      </LegalList>

      <LegalH2>Data shared with other companies</LegalH2>
      <LegalList>
        <li>
          <strong>Google</strong> — only if the reader taps Continue with Google (OAuth). Shared
          data: email, name, and profile picture as Google returns them.
        </li>
        <li>
          <strong>OpenAI</strong> — only if the reader uses an extra AI tool and the operator has
          configured a key. Shared data: the prompt text for that request. Ordinary study search is
          not sent.
        </li>
        <li>Cloudflare hosts the site and sees ordinary request logs.</li>
      </LegalList>

      <LegalH2>Security practices</LegalH2>
      <LegalList>
        <li>Data encrypted in transit: Yes</li>
        <li>Users can request that data be deleted: Yes (on-device account page)</li>
        <li>Committed to Play Families Policy: No — not a designed-for-families app</li>
        <li>Follows Families Policy: leave unchecked unless you later enroll</li>
      </LegalList>

      <LegalH2>Content rating (IARC)</LegalH2>
      <LegalP>
        Recommend answering the questionnaire as a reference / educational app. The library includes
        Scripture that describes violence and judgment. Typical outcome is Teen. It is not a
        children’s game and should not be submitted as Designed for Families.
      </LegalP>
    </LegalDoc>
  );
}
