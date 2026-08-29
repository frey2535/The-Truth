const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function apiKey() {
  return (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "").trim();
}

function openaiErrorMessage(status, text) {
  const raw = String(text || "");
  try {
    const err = JSON.parse(raw)?.error;
    const type = String(err?.type || "");
    const msg = String(err?.message || "");
    if (
      status === 429 ||
      type === "insufficient_quota" ||
      /quota|rate limit/i.test(`${type} ${msg}`)
    ) {
      if (type === "insufficient_quota" || /quota|billing/i.test(msg)) {
        return "OpenAI quota is exhausted. Add billing or credits at platform.openai.com, then try again.";
      }
      return "OpenAI rate limit. Wait about a minute, then try one search at a time.";
    }
    if (msg) return msg;
  } catch {
    /* not JSON */
  }
  return `AI request failed (${status}): ${raw.slice(0, 200)}`;
}

export async function handler(event) {
  const method = event.httpMethod || "GET";
  if (method === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }
  if (method === "GET") {
    return json(200, { configured: Boolean(apiKey()) });
  }
  if (method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  if (!payload?.messages) {
    return json(400, { error: "messages are required" });
  }

  const key = apiKey();
  if (!key) {
    return json(503, {
      error:
        "AI is not configured. Add OPENAI_API_KEY in .env.local for local use, or in the Netlify environment for the public site.",
    });
  }

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || process.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
        messages: payload.messages,
        temperature: payload.temperature ?? 0.2,
        ...(payload.response_format ? { response_format: payload.response_format } : {}),
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      return json(res.status, { error: openaiErrorMessage(res.status, text) });
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (error) {
    return json(500, { error: error.message || "AI request failed" });
  }
}
