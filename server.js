import http from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, createReadStream, mkdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = process.env.PORT || 3000;
const dataDir = join(root, "data");
const stateFile = join(dataDir, "state.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  return join(root, normalized === "/" ? "/index.html" : normalized);
}

function ensureStateFile() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  if (!existsSync(stateFile)) {
    writeFileSync(stateFile, JSON.stringify({ articles: [] }, null, 2), "utf8");
  }
}

function readStateFile() {
  try {
    return JSON.parse(readFileSync(stateFile, "utf8"));
  } catch {
    return { articles: [] };
  }
}

function writeStateFile(state) {
  writeFileSync(stateFile, JSON.stringify(state, null, 2), "utf8");
}

ensureStateFile();

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
  if (requestUrl.pathname === "/api/state") {
    if (req.method === "GET") {
      const state = readStateFile();
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(state));
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          writeStateFile(parsed);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ status: "ok" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "Invalid JSON body" }));
        }
      });
      return;
    }

    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const filePath = safePath(requestUrl.pathname);
  let target = filePath;

  if (existsSync(target) && statSync(target).isDirectory()) {
    target = join(target, "index.html");
  }

  if (!existsSync(target)) {
    target = join(root, "index.html");
  }

  try {
    const type = mimeTypes[extname(target)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    createReadStream(target).pipe(res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server xatosi");
  }
});

const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Miron.uz running on http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});
