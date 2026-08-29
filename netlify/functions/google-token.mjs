import { exchangeGoogleCode } from "../../scripts/googleToken.js";

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const method = event.httpMethod || "GET";
  if (method === "OPTIONS") return { statusCode: 204, body: "" };
  if (method !== "POST") return json(405, { error: "Method not allowed" });

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  try {
    const data = await exchangeGoogleCode({
      code: payload.code,
      redirectUri: payload.redirect_uri,
      codeVerifier: payload.code_verifier,
    });
    return json(200, { id_token: data.id_token });
  } catch (error) {
    return json(error.status || 500, { error: error.message || "Google sign-in failed" });
  }
}
