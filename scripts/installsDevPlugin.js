import fs from "node:fs";
import path from "node:path";
import { emptyLedger } from "../src/lib/installLedger.js";
import { handleInstallsRequest, handleOwnerLogin, readOwnerCredentials } from "../src/lib/installsApi.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (status === 204) {
    res.end();
    return;
  }
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export function installsDevPlugin(rootDir) {
  const file = path.join(rootDir, ".data", "installs.json");

  function load() {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return emptyLedger();
    }
  }

  function save(ledger) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(ledger, null, 2));
  }

  function credentials() {
    return readOwnerCredentials(process.env, !String(process.env.PLATFORM_OWNER_PASSWORD || "").trim());
  }

  const handle = async (req, res, next) => {
    const url = (req.url || "").split("?")[0];
    if (url !== "/api/installs" && url !== "/api/owner-login") {
      next();
      return;
    }
    if (req.method === "OPTIONS") {
      send(res, 204, {});
      return;
    }
    let body = {};
    if (req.method === "POST") {
      try {
        body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      } catch {
        send(res, 400, { error: "Invalid JSON body" });
        return;
      }
    }
    try {
      const result =
        url === "/api/owner-login"
          ? await handleOwnerLogin({
              body,
              credentials: credentials(),
              load,
              save,
            })
          : await handleInstallsRequest({
              method: req.method,
              body,
              authorization: req.headers.authorization,
              credentials: credentials(),
              load,
              save,
            });
      send(res, result.status, result.body);
    } catch (error) {
      send(res, 500, { error: error.message || "Install stats failed" });
    }
  };

  return {
    name: "installs-api",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}
