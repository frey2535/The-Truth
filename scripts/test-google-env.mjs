import assert from "node:assert/strict";
import { googleClientIdFromEnv, googleClientSecretFromEnv, looksLikeGoogleClientId } from "../src/lib/googleEnv.js";
import { loadGoogleOAuth, saveGoogleOAuth } from "../src/lib/googleStore.js";

assert.equal(looksLikeGoogleClientId("123-abc.apps.googleusercontent.com"), true);
assert.equal(looksLikeGoogleClientId("not-a-client-id"), false);

assert.equal(
  googleClientIdFromEnv({ GOOGLE_OAUTH_CLIENT_ID: "123-abc.apps.googleusercontent.com" }),
  "123-abc.apps.googleusercontent.com"
);
assert.equal(
  googleClientIdFromEnv({ OTHER: "123-abc.apps.googleusercontent.com" }),
  "123-abc.apps.googleusercontent.com"
);
assert.equal(googleClientSecretFromEnv({ GOOGLE_SECRET: "s3cret" }), "s3cret");

const fromEnv = await loadGoogleOAuth({ VITE_GOOGLE_CLIENT_ID: "999.apps.googleusercontent.com" });
assert.equal(fromEnv.clientId, "999.apps.googleusercontent.com");

await assert.rejects(
  () => saveGoogleOAuth({}, { clientId: "nope" }),
  /not a Google client ID/
);

const saved = await saveGoogleOAuth({}, { clientId: "888.apps.googleusercontent.com" });
assert.equal(saved.configured, true);
assert.equal(saved.clientId, "888.apps.googleusercontent.com");

console.log("google env ok");
