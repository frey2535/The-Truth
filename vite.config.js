import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { completeChat } from "./scripts/openaiProxy.js";
import { exchangeGoogleCode } from "./scripts/googleToken.js";
import { installsDevPlugin } from "./scripts/installsDevPlugin.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const ebibleProxy = {
  "/ebible": {
    target: "https://ebible.org",
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/ebible/, ""),
  },
};

function lanAddresses() {
  const out = [];
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const a of addrs || []) {
      if ((a.family === "IPv4" || a.family === 4) && !a.internal) out.push(a.address);
    }
  }
  return out;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function openaiProxyPlugin() {
  const handle = async (req, res, next) => {
    const url = (req.url || "").split("?")[0];
    if (url !== "/api/openai") {
      next();
      return;
    }
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method === "GET") {
      const configured = Boolean(
        (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "").trim()
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ configured }));
      return;
    }
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }
    try {
      const raw = await readBody(req);
      const payload = JSON.parse(raw.toString("utf8") || "{}");
      if (!payload?.messages) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "messages are required" }));
        return;
      }
      const data = await completeChat(payload);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } catch (error) {
      res.statusCode = error.status || 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message || "AI request failed" }));
    }
  };
  return {
    name: "openai-proxy",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

function googleTokenPlugin() {
  const handle = async (req, res, next) => {
    const url = (req.url || "").split("?")[0];
    if (url !== "/api/google-token") {
      next();
      return;
    }
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method === "GET") {
      const clientId = String(
        process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ""
      ).trim();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ configured: Boolean(clientId), clientId }));
      return;
    }
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }
    try {
      const raw = await readBody(req);
      const payload = JSON.parse(raw.toString("utf8") || "{}");
      const data = await exchangeGoogleCode({
        code: payload.code,
        redirectUri: payload.redirect_uri,
        codeVerifier: payload.code_verifier,
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ id_token: data.id_token }));
    } catch (error) {
      res.statusCode = error.status || 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message || "Google sign-in failed" }));
    }
  };
  return {
    name: "google-token",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

function truthVersionPlugin(id) {
  return {
    name: "truth-version",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ id }),
      });
    },
  };
}

function lanInfoPlugin() {
  const handler = (getPort) => (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ port: getPort(), addresses: lanAddresses() }));
  };
  return {
    name: "lan-info",
    configureServer(server) {
      server.middlewares.use(
        "/__lan.json",
        handler(() => server.config.server.port)
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use(
        "/__lan.json",
        handler(() => server.config.preview.port)
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  if (env.VITE_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.VITE_OPENAI_API_KEY;
  }
  if (env.OPENAI_MODEL) process.env.OPENAI_MODEL = env.OPENAI_MODEL;
  if (env.VITE_OPENAI_MODEL && !process.env.OPENAI_MODEL) {
    process.env.OPENAI_MODEL = env.VITE_OPENAI_MODEL;
  }

  if (env.VITE_GOOGLE_CLIENT_ID) process.env.VITE_GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;
  if (env.GOOGLE_CLIENT_ID) process.env.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
  if (env.GOOGLE_CLIENT_SECRET) process.env.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
  if (env.PLATFORM_OWNER_EMAIL) process.env.PLATFORM_OWNER_EMAIL = env.PLATFORM_OWNER_EMAIL;
  if (env.PLATFORM_OWNER_PASSWORD) process.env.PLATFORM_OWNER_PASSWORD = env.PLATFORM_OWNER_PASSWORD;

  const truthBuildId = new Date().toISOString();
  const pagesRepo = process.env.GITHUB_REPOSITORY || "frey2535/The-Truth";
  const pagesBase =
    process.env.GITHUB_PAGES === "true" ? `/${pagesRepo.split("/")[1] || "The-Truth"}/` : "/";

  return {
    base: pagesBase,
    define: {
      "import.meta.env.VITE_TRUTH_BUILD": JSON.stringify(truthBuildId),
    },
    plugins: [react(), truthVersionPlugin(truthBuildId), lanInfoPlugin(), openaiProxyPlugin(), googleTokenPlugin(), installsDevPlugin(rootDir)],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "./src"),
      },
    },
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      allowedHosts: true,
      headers: {
        "Cache-Control": "no-store",
        "X-The-Truth-App": "searchingfortruth",
      },
      proxy: ebibleProxy,
    },
    preview: {
      host: true,
      port: 4174,
      strictPort: true,
      proxy: ebibleProxy,
    },
  };
});
