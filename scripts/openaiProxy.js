const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export function getOpenAIKey() {
  return (
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    ""
  ).trim();
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || process.env.VITE_OPENAI_MODEL || "gpt-4o-mini";
}

export async function completeChat(payload) {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    const error = new Error(
      "AI is not configured. Add OPENAI_API_KEY in .env.local for local use, or in the Netlify environment for the public site."
    );
    error.status = 503;
    throw error;
  }

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      messages: payload.messages,
      temperature: payload.temperature ?? 0.2,
      ...(payload.response_format ? { response_format: payload.response_format } : {}),
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    let message = `AI request failed (${res.status}): ${text.slice(0, 200)}`;
    if (res.status === 429 || /quota|rate limit/i.test(text)) {
      message = /quota|billing/i.test(text)
        ? "OpenAI quota is exhausted. Add billing or credits at platform.openai.com, then try again."
        : "OpenAI rate limit. Wait about a minute, then try one search at a time.";
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return JSON.parse(text);
}
