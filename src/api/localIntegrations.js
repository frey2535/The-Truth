import { httpError, loadDb, newId, saveDb } from "./localDb";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function readLocalFile(fileUrl) {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("data:")) return { dataUrl: fileUrl, name: "upload" };
  if (fileUrl.startsWith("local-file://")) {
    const id = fileUrl.replace("local-file://", "");
    const db = loadDb();
    return db.files[id] || null;
  }
  return { dataUrl: fileUrl, name: "remote" };
}

function extractMessageText(payload) {
  const choice = payload.choices?.[0]?.message;
  if (!choice) return "";
  if (typeof choice.content === "string") return choice.content;
  if (Array.isArray(choice.content)) {
    return choice.content.map((part) => part.text || "").join("\n");
  }
  return "";
}

function describeAiFailure(status, text) {
  const raw = String(text || "");
  if (status === 401 && /login redirect|edge-access/i.test(raw)) {
    return "The public site is still locked on Netlify. Open Project configuration → General → Visitor access → Project visibility and choose Public.";
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) return String(parsed.error);
  } catch {
    /* not JSON */
  }
  if (status === 429 || /quota|rate limit/i.test(raw)) {
    if (/quota|billing/i.test(raw)) {
      return "OpenAI quota is exhausted. Add billing or credits at platform.openai.com, then try again.";
    }
    return "OpenAI rate limit. Wait about a minute, then try one search at a time.";
  }
  if (status === 404) {
    return "The AI service route was not found. Hard-refresh the page, then try again.";
  }
  if (status === 503 || /not configured/i.test(raw)) {
    return "AI is not configured. Add OPENAI_API_KEY in Netlify environment variables (public site) or .env.local (this computer).";
  }
  return `AI request failed (${status}): ${raw.slice(0, 200)}`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postOpenAI(payload) {
  const paths = ["/api/openai", "/.netlify/functions/openai-chat"];
  let last = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    last = null;
    for (const path of paths) {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      last = res;
      if (res.status === 404) continue;
      if (res.status !== 429) return res;
      break;
    }
    if (!last || last.status !== 429 || attempt === 2) return last;
    const retryAfter = Number(last.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 4000 * (attempt + 1);
    await sleep(Math.min(waitMs, 12000));
  }
  return last;
}

export const localIntegrations = {
  Core: {
    async UploadFile({ file }) {
      if (!file) throw httpError("No file provided");
      const dataUrl = await fileToDataUrl(file);
      const db = loadDb();
      const id = newId("file");
      db.files[id] = {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        created_date: new Date().toISOString(),
      };
      saveDb(db);
      return { file_url: `local-file://${id}` };
    },

    async InvokeLLM({ prompt, file_urls, response_json_schema, add_context_from_internet }) {
      let textPrompt = String(prompt || "");
      if (add_context_from_internet) {
        textPrompt +=
          "\n\nUse well-established primary and scholarly sources from your training data. Prefer official archives, museums, peer-reviewed work, and canonical texts. If a URL cannot be verified, return an empty string rather than a fabricated link.";
      }

      const content = [{ type: "text", text: textPrompt }];
      if (Array.isArray(file_urls)) {
        for (const url of file_urls) {
          const stored = await readLocalFile(url);
          if (stored?.dataUrl?.startsWith("data:image/")) {
            content.push({ type: "image_url", image_url: { url: stored.dataUrl } });
          } else if (stored?.dataUrl) {
            content.push({
              type: "text",
              text: `\n[Attached file: ${stored.name || "upload"}]`,
            });
          }
        }
      }

      if (response_json_schema) {
        const keys = Object.keys(response_json_schema.properties || {});
        content[0].text += keys.length
          ? `\n\nRespond with JSON only. Include these keys: ${keys.join(", ")}.`
          : `\n\nRespond with JSON only.`;
      }

      const res = await postOpenAI({
        messages: [{ role: "user", content }],
        temperature: 0.2,
        ...(response_json_schema ? { response_format: { type: "json_object" } } : {}),
      });

      if (!res.ok) {
        const text = await res.text();
        throw httpError(describeAiFailure(res.status, text), res.status);
      }

      const payload = await res.json();
      const text = extractMessageText(payload);
      if (!response_json_schema) return text;
      try {
        return JSON.parse(text);
      } catch {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start >= 0 && end > start) {
          try {
            return JSON.parse(text.slice(start, end + 1));
          } catch {
            /* fall through */
          }
        }
        return { error: "The model returned invalid JSON.", raw: text };
      }
    },
  },
};
