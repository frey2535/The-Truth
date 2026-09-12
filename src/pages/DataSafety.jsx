import { Link } from "react-router-dom";
import LegalDoc, { LegalH2, LegalList, LegalP } from "@/components/LegalDoc";
import { ACCOUNT_DELETION_URL, PLAY_CONSOLE_ANSWERS_URL, PRIVACY_POLICY_URL } from "@/lib/playStore";
import { PLAY_DATA_SAFETY, PLAY_IARC } from "@/lib/playConsole";

export default function DataSafety() {
  return (
    <LegalDoc
      kicker="Google Play"
      title="Data safety"
      updated="Use these answers on the Play Console Data safety form. Updated 11 September 2026."
    >
      <LegalP>
        This page is for the store listing, not a second privacy policy. The public policy is{" "}
        <Link className="text-[#7a2e2e] underline" to="/privacy">
          {PRIVACY_POLICY_URL}
        </Link>
        . Every other Play Console question — ads, IARC, target audience, AI, permissions — is on{" "}
        <Link className="text-[#7a2e2e] underline" to="/play-console">
          {PLAY_CONSOLE_ANSWERS_URL}
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

      <LegalH2>Data collected or shared — declare these</LegalH2>
      <LegalList>
        {PLAY_DATA_SAFETY.collected.map((row) => (
          <li key={row.type}>
            <strong>{row.type}</strong>
            {" — "}
            {row.collected ? "collected" : "not collected by our servers"}
            {row.shared ? "; shared as noted" : "; not shared with other companies"}
            {". "}
            {row.optional ? "Optional. " : "Required for that event. "}
            Purpose: {row.purpose}. {row.stored}
          </li>
        ))}
      </LegalList>

      <LegalH2>Do not declare</LegalH2>
      <LegalList>
        {PLAY_DATA_SAFETY.doNotDeclare.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </LegalList>

      <LegalH2>Data shared with other companies</LegalH2>
      <LegalList>
        {PLAY_DATA_SAFETY.shared.map((item) => (
          <li key={item}>{item}</li>
        ))}
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
        Answer the questionnaire as {PLAY_IARC.category} Expected rating: {PLAY_IARC.expectedRating}.
        It is not a children’s game and should not be submitted as Designed for Families. Use the
        click-through answers on{" "}
        <Link className="text-[#7a2e2e] underline" to="/play-console">
          Play Console answers
        </Link>
        .
      </LegalP>
    </LegalDoc>
  );
}
