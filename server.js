import http from "node:http";
import { existsSync, statSync, createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = process.env.PORT || 3000;

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

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
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
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server xatosi");
  }
});

const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Miron.uz running on http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});
