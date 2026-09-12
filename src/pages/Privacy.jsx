import { Link } from "react-router-dom";
import LegalDoc, { LegalH2, LegalList, LegalP } from "@/components/LegalDoc";
import {
  ACCOUNT_DELETION_URL,
  DATA_SAFETY_URL,
  PLAY_CONSOLE_ANSWERS_URL,
  PLAY_HOST,
  PRIVACY_POLICY_URL,
} from "@/lib/playStore";
import { CONTACT_EMAIL } from "@/lib/contact";

export default function Privacy() {
  return (
    <LegalDoc kicker="Legal" title="Privacy policy" updated="Effective 7 September 2026">
      <LegalP>
        This policy is for <strong>The Truth</strong>, the Scripture research app at{" "}
        <a className="text-[#7a2e2e] underline" href={PRIVACY_POLICY_URL}>
          {PLAY_HOST}
        </a>
        . The same software may also be installed from Google Play as a Trusted Web Activity that
        opens this site.
      </LegalP>
      <LegalP>
        Current Flow Consulting operates the public site. Contact:{" "}
        <a className="text-[#7a2e2e] underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </LegalP>

      <LegalH2>What this app is</LegalH2>
      <LegalP>
        The Truth is a local-first study app. Research, Investigate, the Assistant, and Word Study
        search only texts and published records stored in the app. Study questions are not sent to
        the internet for answers, and the app does not invent missing archives.
      </LegalP>

      <LegalH2>Data stored on your device</LegalH2>
      <LegalList>
        <li>
          Optional reader account: email, a password hash (not the password itself), display name,
          and a session token in this browser’s storage.
        </li>
        <li>
          Optional Google sign-in: email, name, picture URL, and Google account id, stored in this
          browser after Google returns them.
        </li>
        <li>Notes, highlights, favorites, study plans, and conversations you create on this device.</li>
        <li>
          A random install device id used only to count home-screen or Play installs once per device.
        </li>
      </LegalList>
      <LegalP>
        These records live in this browser or installed app. They are not uploaded to a reader
        account server. Clearing site data for this origin removes them from the device.
      </LegalP>

      <LegalH2>Data that can leave the device</LegalH2>
      <LegalList>
        <li>
          <strong>Install count.</strong> When you install the app, this site may receive a random
          device id, platform (iOS, Android, or desktop), install source, and a timestamp. No name
          or email is sent with that report. The platform owner can see the list.
        </li>
        <li>
          <strong>Google sign-in (optional).</strong> If you tap Continue with Google, Google
          receives the OAuth request. We store only the profile fields listed above, on this device.
        </li>
        <li>
          <strong>Study search.</strong> Research, Investigate, the Assistant, and Word Study stay
          on the device. They search stored texts only and do not use a paid AI API.
        </li>
        <li>
          <strong>Listen.</strong> Read-aloud uses this device’s speech voices. The wording is not
          sent to the internet to be read.
        </li>
        <li>
          <strong>Hosting.</strong> Cloudflare (and the GitHub Pages mirror) see ordinary web
          request logs such as IP address, user agent, and the page requested.
        </li>
      </LegalList>

      <LegalH2>What we do not do</LegalH2>
      <LegalList>
        <li>The app is free. There is no paid download, in-app purchase, or subscription.</li>
        <li>No advertising SDK and no sale of personal information.</li>
        <li>No contacts, precise location, photos, or microphone access for study.</li>
        <li>Study search is not an internet search engine.</li>
      </LegalList>

      <LegalH2>Children</LegalH2>
      <LegalP>
        The app is not directed at children under 13. Scripture and related records include
        accounts of war, judgment, and adult religious subjects. A parent or guardian should decide
        whether it is appropriate.
      </LegalP>

      <LegalH2>Delete your account and data</LegalH2>
      <LegalP>
        Reader accounts exist only on the device that created them. Open{" "}
        <Link className="text-[#7a2e2e] underline" to="/account">
          Delete account
        </Link>{" "}
        ({ACCOUNT_DELETION_URL}) to remove the named account and, if you choose, notes and plans on
        this device. You can also clear site data in the browser or Android site settings. Google
        sign-in can be revoked in your Google account. Install counts are anonymous device events
        and are not tied to your email.
      </LegalP>

      <LegalH2>Play Store data safety</LegalH2>
      <LegalP>
        The Play Console answers that match this policy are on{" "}
        <Link className="text-[#7a2e2e] underline" to="/data-safety">
          Data safety
        </Link>{" "}
        ({DATA_SAFETY_URL}) and the full click-through pack is on{" "}
        <Link className="text-[#7a2e2e] underline" to="/play-console">
          Play Console answers
        </Link>{" "}
        ({PLAY_CONSOLE_ANSWERS_URL}).
      </LegalP>

      <LegalH2>Changes</LegalH2>
      <LegalP>
        If this policy changes, the updated date at the top of this page will change. Continued use
        of the public site or the Play listing after that date is use under the new policy.
      </LegalP>
    </LegalDoc>
  );
}
