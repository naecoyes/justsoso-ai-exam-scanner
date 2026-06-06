import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import analyzeHandler from "./api/analyze.js";
import referencesHandler from "./api/references.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const app = async (req, res) => {
  try {
    if (req.url?.startsWith("/api/analyze")) {
      await analyzeHandler(req, res);
      return;
    }

    if (req.url?.startsWith("/api/references")) {
      await referencesHandler(req, res);
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "服务器内部错误" }));
  }
};

const server = createServer(app);
server.listen(port, host, () => {
  const protocol = server instanceof https.Server ? "https" : "http";
  console.log(`Server ready: ${protocol}://${host}:${port}`);
});

function createServer(handler) {
  if (process.env.USE_HTTPS === "1") {
    const keyPath = process.env.HTTPS_KEY_PATH || path.join(__dirname, "certs/dev-server.key");
    const certPath = process.env.HTTPS_CERT_PATH || path.join(__dirname, "certs/dev-server.crt");
    return https.createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      },
      handler
    );
  }

  return http.createServer(handler);
}

function serveStatic(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  const extension = path.extname(filePath);
  res.statusCode = 200;
  res.setHeader("content-type", mimeTypes[extension] || "application/octet-stream");

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("cache-control", "no-cache");
  }

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}
