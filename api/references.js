import fs from "node:fs/promises";
import path from "node:path";
import { clearDocumentCache, getReferenceDocuments, USER_DOCUMENT_DIR } from "./_documentSearch.js";
import { readJson, sendJson } from "./_json.js";

const MAX_DOCUMENT_BYTES = 900_000;
const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".html", ".htm"]);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  try {
    if (req.method === "GET") {
      return sendJson(res, 200, { documents: await getReferenceDocuments() });
    }

    if (req.method === "POST") {
      const body = await readJson(req, 1_200_000);
      const name = sanitizeFileName(body?.name);
      const content = String(body?.content || "");
      const extension = path.extname(name).toLowerCase();

      if (!name || !SUPPORTED_EXTENSIONS.has(extension)) {
        return sendJson(res, 400, { error: "Upload a .md, .txt, .html, or .htm reference file." });
      }

      if (!content.trim()) {
        return sendJson(res, 400, { error: "Reference file is empty." });
      }

      if (Buffer.byteLength(content, "utf8") > MAX_DOCUMENT_BYTES) {
        return sendJson(res, 413, { error: "Reference file is too large. Keep it under 900 KB." });
      }

      await fs.mkdir(USER_DOCUMENT_DIR, { recursive: true });
      await fs.writeFile(path.join(USER_DOCUMENT_DIR, createDocumentId(name)), content, "utf8");
      clearDocumentCache();
      return sendJson(res, 201, { documents: await getReferenceDocuments() });
    }

    if (req.method === "DELETE") {
      const id = sanitizeFileName(new URL(req.url || "/", "http://localhost").searchParams.get("id"));
      if (!id) return sendJson(res, 400, { error: "Missing document id." });

      const target = path.join(USER_DOCUMENT_DIR, id);
      if (!target.startsWith(USER_DOCUMENT_DIR)) {
        return sendJson(res, 403, { error: "Invalid document id." });
      }

      await fs.unlink(target).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
      clearDocumentCache();
      return sendJson(res, 200, { documents: await getReferenceDocuments() });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Reference document operation failed."
    });
  }
}

function createDocumentId(name) {
  const parsed = path.parse(name);
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `${stamp}-${parsed.name.slice(0, 80)}${parsed.ext}`.replace(/\s+/g, "-");
}

function sanitizeFileName(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\.\.+/g, ".")
    .slice(0, 140);
}
