import { readJson, sendJson } from "./_json.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_DIR = path.join(__dirname, "..", "user-documents", "history");
const IMAGES_DIR = path.join(HISTORY_DIR, "images");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getHistoryFile() {
  ensureDir(HISTORY_DIR);
  return path.join(HISTORY_DIR, "history.json");
}

function readHistory() {
  const file = getHistoryFile();
  if (!fs.existsSync(file)) return [];
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeHistory(history) {
  const file = getHistoryFile();
  ensureDir(HISTORY_DIR);
  fs.writeFileSync(file, JSON.stringify(history, null, 2), "utf-8");
}

function saveBase64Image(id, dataUrl) {
  ensureDir(IMAGES_DIR);
  if (!dataUrl || !dataUrl.startsWith("data:image/")) return dataUrl;

  const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return dataUrl;

  const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const fileName = `${id}.${extension}`;
  const filePath = path.join(IMAGES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);

  return `/api/history/image?file=${fileName}`;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  try {
    const url = new URL(req.url, "http://localhost");

    if (req.method === "GET" && url.pathname === "/api/history/image") {
      const fileName = url.searchParams.get("file");
      if (!fileName) return sendJson(res, 400, { error: "Missing file parameter" });

      const safePath = path.normalize(fileName).replace(/^(\.\.[/\\])+/, "");
      const filePath = path.join(IMAGES_DIR, safePath);

      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end("Not Found");
        return;
      }

      const ext = path.extname(filePath);
      const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      
      res.statusCode = 200;
      res.setHeader("content-type", mime);
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    if (req.method === "GET") {
      const history = readHistory();
      return sendJson(res, 200, { history });
    }

    if (req.method === "POST" && url.pathname === "/api/history/bulk") {
      const body = await readJson(req, 100_000_000); // Allow up to 100MB for bulk migration
      const { items } = body;
      
      if (!Array.isArray(items)) {
        return sendJson(res, 400, { error: "Items array is required" });
      }

      let history = readHistory();
      const existingIds = new Set(history.map(h => h.id));

      for (const item of items) {
        if (!existingIds.has(item.id)) {
          if (item.thumbnail && item.thumbnail.startsWith("data:image/")) {
            item.thumbnail = saveBase64Image(item.id, item.thumbnail);
          }
          history.push(item);
          existingIds.add(item.id);
        }
      }

      history = history.sort((a, b) => b.createdAt - a.createdAt);
      writeHistory(history);
      return sendJson(res, 200, { success: true, count: history.length });
    }

    if (req.method === "POST") {
      const item = await readJson(req, 10_000_000);
      
      if (!item || !item.id) {
        return sendJson(res, 400, { error: "Invalid item" });
      }

      if (item.thumbnail && item.thumbnail.startsWith("data:image/")) {
        item.thumbnail = saveBase64Image(item.id, item.thumbnail);
      }

      const history = readHistory();
      const existingIndex = history.findIndex(h => h.id === item.id);
      
      if (existingIndex >= 0) {
        history[existingIndex] = { ...history[existingIndex], ...item };
      } else {
        history.unshift(item);
      }

      // Sort by createdAt descending
      history.sort((a, b) => b.createdAt - a.createdAt);
      writeHistory(history);
      return sendJson(res, 200, { success: true, item, count: history.length });
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");

      if (id) {
        let history = readHistory();
        history = history.filter(h => h.id !== id);
        writeHistory(history);
        return sendJson(res, 200, { success: true, count: history.length });
      }

      writeHistory([]);
      return sendJson(res, 200, { success: true, count: 0 });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
}
