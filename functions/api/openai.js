const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function json(status, body) {
  return Response.json(body, { status });
}

function apiKey(env) {
  return String(env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY || "").trim();
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

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestGet({ env }) {
  return json(200, { configured: Boolean(apiKey(env)) });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  if (!payload?.messages) {
    return json(400, { error: "messages are required" });
  }

  const key = apiKey(env);
  if (!key) {
    return json(503, {
      error:
        "AI is not configured. Add OPENAI_API_KEY in Cloudflare Pages secrets, or in .env.local on this computer.",
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
        model: env.OPENAI_MODEL || env.VITE_OPENAI_MODEL || "gpt-4o-mini",
        messages: payload.messages,
        temperature: payload.temperature ?? 0.2,
        ...(payload.response_format ? { response_format: payload.response_format } : {}),
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      return json(res.status, { error: openaiErrorMessage(res.status, text) });
    }
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return json(500, { error: error.message || "AI request failed" });
  }
}
