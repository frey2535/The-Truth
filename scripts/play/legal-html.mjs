/** Shared markup for crawler-readable Play legal pages (no JavaScript). */
export const LEGAL_CONTACT_EMAIL = "owner@thetruth.currentflowconsulting.org";
export const LEGAL_HOST = "thetruth.currentflowconsulting.org";
export const LEGAL_ORIGIN = `https://${LEGAL_HOST}`;

export const LEGAL_PAGES = {
  privacy: {
    path: "/privacy.html",
    title: "Privacy policy — The Truth",
    heading: "Privacy policy",
    updated: "Effective 10 September 2026",
    body: `
<p>This policy is for <strong>The Truth</strong>, the Scripture research app at
<a href="${LEGAL_ORIGIN}/">${LEGAL_HOST}</a>. The same software may also be installed from Google Play
as a Trusted Web Activity that opens this site.</p>
<p>Current Flow Consulting operates the public site. Contact:
<a href="mailto:${LEGAL_CONTACT_EMAIL}">${LEGAL_CONTACT_EMAIL}</a>.</p>
<h2>What this app is</h2>
<p>The Truth is a local-first study app. Research, Investigate, the Assistant, and Word Study
search only texts and published records stored in the app. Study questions are not sent to
the internet for answers, and the app does not invent missing archives.</p>
<h2>Data stored on your device</h2>
<ul>
<li>Optional reader account: email, a password hash (not the password itself), display name, and a session token in this browser’s storage.</li>
<li>Optional Google sign-in: email, name, picture URL, and Google account id, stored in this browser after Google returns them.</li>
<li>Notes, highlights, favorites, study plans, and conversations you create on this device.</li>
<li>A random install device id used only to count home-screen or Play installs once per device.</li>
</ul>
<p>These records live in this browser or installed app. They are not uploaded to a reader account server. Clearing site data for this origin removes them from the device.</p>
<h2>Data that can leave the device</h2>
<ul>
<li><strong>Install count.</strong> When you install the app, this site may receive a random device id, platform (iOS, Android, or desktop), install source, and a timestamp. No name or email is sent with that report.</li>
<li><strong>Google sign-in (optional).</strong> If you tap Continue with Google, Google receives the OAuth request. We store only the profile fields listed above, on this device.</li>
<li><strong>Extra AI tools (optional).</strong> Ordinary study search stays on the device. If the site operator has configured an OpenAI key, some extra tools may send a prompt to OpenAI and receive a reply. Do not put secrets in those prompts.</li>
<li><strong>Hosting.</strong> Cloudflare (and the GitHub Pages mirror) see ordinary web request logs such as IP address, user agent, and the page requested.</li>
</ul>
<h2>What we do not do</h2>
<ul>
<li>The app is free. There is no paid download, in-app purchase, or subscription.</li>
<li>No advertising SDK and no sale of personal information.</li>
<li>No contacts, precise location, photos, or microphone access for study.</li>
<li>Study search is not an internet search engine.</li>
</ul>
<h2>Children</h2>
<p>The app is not directed at children under 13. Scripture and related records include accounts of war, judgment, and adult religious subjects. A parent or guardian should decide whether it is appropriate.</p>
<h2>Delete your account and data</h2>
<p>Reader accounts exist only on the device that created them. Open
<a href="${LEGAL_ORIGIN}/account">Delete account</a> to remove the named account and, if you choose, notes and plans on this device. You can also clear site data in the browser or Android site settings. Google sign-in can be revoked in your Google account.</p>
<h2>Play Store data safety</h2>
<p>The Play Console answers that match this policy are on
<a href="${LEGAL_ORIGIN}/data-safety">Data safety</a>.</p>
<h2>Changes</h2>
<p>If this policy changes, the updated date at the top of this page will change. Continued use of the public site or the Play listing after that date is use under the new policy.</p>
`,
  },
  "data-safety": {
    path: "/data-safety.html",
    title: "Data safety — The Truth",
    heading: "Data safety",
    updated: "Play Console answers. Updated 10 September 2026.",
    body: `
<p>This page is for the store listing, not a second privacy policy. The public policy is
<a href="${LEGAL_ORIGIN}/privacy">${LEGAL_ORIGIN}/privacy</a>.</p>
<h2>Overview</h2>
<ul>
<li>The app is free. No paid download, in-app purchases, or subscriptions.</li>
<li>Does the app collect required user data to work? No. Reading works without an account.</li>
<li>Data is encrypted in transit (HTTPS).</li>
<li>Users can request deletion of the on-device account: <a href="${LEGAL_ORIGIN}/account">${LEGAL_ORIGIN}/account</a></li>
<li>Data is not sold.</li>
<li>No independent security review to declare.</li>
</ul>
<h2>Data collected — declare these</h2>
<ul>
<li><strong>Personal info → Email address, Name</strong> — optional, if the reader creates a local account or continues with Google. Stored on the device. Purpose: App functionality (sign-in).</li>
<li><strong>Photos and videos</strong> — only the Google profile picture URL, if they use Google sign-in. Stored on the device. Purpose: App functionality.</li>
<li><strong>App info and performance → Other app performance data</strong> — optional install event (random device id, platform, source, timestamp) sent to this site so the operator can count installs. Purpose: Analytics. Not linked to the reader’s name or email.</li>
<li><strong>Device or other IDs</strong> — the random install device id above, and ordinary user-agent on web requests. Purpose: Analytics / App functionality.</li>
</ul>
<h2>Do not declare</h2>
<ul>
<li>Location</li>
<li>Financial info (the app is free; it never takes a payment)</li>
<li>Health and fitness</li>
<li>Messages, contacts, calendar</li>
<li>Files and docs as a collected type (readers do not upload files)</li>
<li>Audio, microphone, camera</li>
<li>Advertising or marketing IDs</li>
</ul>
<h2>Data shared with other companies</h2>
<ul>
<li><strong>Google</strong> — only if the reader taps Continue with Google (OAuth). Shared data: email, name, and profile picture as Google returns them.</li>
<li><strong>OpenAI</strong> — only if the reader uses an extra AI tool and the operator has configured a key. Shared data: the prompt text for that request. Ordinary study search is not sent.</li>
<li>Cloudflare hosts the site and sees ordinary request logs.</li>
</ul>
<h2>Security practices</h2>
<ul>
<li>Data encrypted in transit: Yes</li>
<li>Users can request that data be deleted: Yes (on-device account page)</li>
<li>Committed to Play Families Policy: No — not a designed-for-families app</li>
</ul>
<h2>Content rating (IARC)</h2>
<p>Recommend answering the questionnaire as a reference / educational app. The library includes Scripture that describes violence and judgment. Typical outcome is Teen. It is not a children’s game and should not be submitted as Designed for Families.</p>
`,
  },
  account: {
    path: "/account.html",
    title: "Delete account — The Truth",
    heading: "Delete account",
    updated: "Google Play account-deletion URL",
    body: `
<p>Reader accounts for The Truth live in this browser or installed app, not on a central membership server. Deleting here removes the named account from <em>this device</em>.</p>
<p>If you opened this page from Google Play, use the in-app Delete account screen (same address) while signed in, or clear site data for ${LEGAL_HOST} in Chrome or Android settings.</p>
<h2>In the app</h2>
<ol>
<li>Open The Truth and sign in if you created a named account.</li>
<li>Open <a href="${LEGAL_ORIGIN}/account">${LEGAL_ORIGIN}/account</a>.</li>
<li>Choose whether to also erase notes, highlights, favorites, and study plans on this device.</li>
<li>Tap <strong>Delete this device’s account</strong>.</li>
</ol>
<h2>No named account</h2>
<p>Guest reading does not create an email account. There is nothing to delete except optional notes you typed, which you can erase from Notebook or by clearing site data.</p>
<h2>Google sign-in</h2>
<p>Revoke access at <a href="https://myaccount.google.com/permissions">Google account permissions</a>.</p>
<p>Install counts are anonymous device events and are not tied to your email.</p>
`,
  },
};

export function renderLegalHtml(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${page.title}</title>
  <meta name="description" content="${page.heading} for The Truth, a free Scripture research app." />
  <link rel="canonical" href="${LEGAL_ORIGIN}${page.path.replace(".html", "")}" />
  <style>
    body { margin: 0; font-family: Georgia, "Times New Roman", serif; background: #faf6ef; color: #2b2620; }
    main { max-width: 42rem; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
    p.kicker { letter-spacing: 0.25em; text-transform: uppercase; font-size: 0.7rem; color: #b08d3c; }
    h1 { font-size: 2rem; margin: 0.25rem 0 0.5rem; }
    .updated { font-size: 0.8rem; color: #8a7f6f; margin-bottom: 1.5rem; }
    article { background: #fff; border: 1px solid #e8ddc7; border-radius: 1rem; padding: 1.25rem 1.5rem; line-height: 1.6; }
    h2 { font-size: 1.35rem; margin-top: 1.5rem; }
    a { color: #7a2e2e; }
    nav { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.95rem; }
  </style>
</head>
<body>
  <main>
    <p class="kicker">The Truth</p>
    <h1>${page.heading}</h1>
    <p class="updated">${page.updated}</p>
    <article>
      ${page.body.trim()}
    </article>
    <nav>
      <a href="/privacy">Privacy</a>
      <a href="/data-safety">Data safety</a>
      <a href="/account">Delete account</a>
      <a href="/">The Truth</a>
    </nav>
  </main>
</body>
</html>
`;
}
