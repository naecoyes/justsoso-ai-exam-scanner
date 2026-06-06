import fs from "node:fs/promises";
import path from "node:path";

const DOCUMENT_DIR = path.join(process.cwd(), "Document");
export const USER_DOCUMENT_DIR = process.env.REFERENCE_DOCUMENT_DIR || path.join(process.cwd(), "user-documents");
const MAX_CHUNK_LENGTH = 1800;
const MAX_REFERENCES = 5;
const MAX_CONTEXT_LENGTH = 6200;
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "which",
  "what",
  "when",
  "where",
  "will",
  "would",
  "should",
  "could",
  "into",
  "their",
  "they",
  "them",
  "your",
  "you",
  "are",
  "was",
  "were",
  "has",
  "have",
  "had",
  "not",
  "his",
  "her",
  "its",
  "who",
  "why",
  "how",
  "following",
  "which",
  "analyst",
  "organization",
  "company"
]);

let cachedChunks = null;

export function clearDocumentCache() {
  cachedChunks = null;
}

export async function getReferenceDocuments() {
  const builtIn = await listDocuments(DOCUMENT_DIR, "built-in");
  const uploaded = await listDocuments(USER_DOCUMENT_DIR, "uploaded");
  return [...uploaded, ...builtIn].map(({ path: _path, ...document }) => document);
}

export async function getReferenceSnippets(query, limit = MAX_REFERENCES) {
  const chunks = await loadDocumentChunks();
  const queryText = normalizeText(query);
  const tokens = tokenize(queryText);

  if (!tokens.length && queryText.length < 6) return [];

  const scored = chunks
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, queryText, tokens)
    }))
    .filter((chunk) => chunk.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((chunk) => ({
    file: chunk.file,
    title: chunk.title,
    excerpt: createExcerpt(chunk.text, queryText, tokens),
    score: Number(chunk.score.toFixed(2))
  }));
}

export function formatReferencesForPrompt(references) {
  const sections = [];
  let totalLength = 0;

  for (const [index, reference] of references.entries()) {
    const section = [
      `[${index + 1}] ${reference.title || "Untitled"} (${reference.file})`,
      reference.excerpt
    ].join("\n");

    if (totalLength + section.length > MAX_CONTEXT_LENGTH) break;
    sections.push(section);
    totalLength += section.length;
  }

  return sections.join("\n\n");
}

export async function loadDocumentChunks() {
  if (cachedChunks) return cachedChunks;

  const chunks = [];
  const documents = await listAllDocumentsWithPaths();
  for (const document of documents) {
    const raw = await fs.readFile(document.path, "utf8");
    const text = /\.html?$/i.test(document.name) ? htmlToText(raw) : raw;
    chunks.push(...chunkText(text, `${document.source}/${document.name}`));
  }

  cachedChunks = chunks;
  return cachedChunks;
}

async function listAllDocumentsWithPaths() {
  const builtIn = await listDocuments(DOCUMENT_DIR, "built-in");
  const uploaded = await listDocuments(USER_DOCUMENT_DIR, "uploaded");
  return [...uploaded, ...builtIn];
}

async function listDocuments(directory, source) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = entries
    .filter((entry) => entry.isFile() && /\.(md|txt|html?)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

  const documents = [];
  for (const name of files) {
    const absolutePath = path.join(directory, name);
    const stat = await fs.stat(absolutePath);
    documents.push({
      id: name,
      name,
      source,
      size: stat.size,
      updatedAt: stat.mtimeMs,
      path: absolutePath
    });
  }

  return documents;
}

export function chunkText(text, file) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\t/g, "  ");
  const lines = normalized.split("\n");
  const chunks = [];
  let title = path.basename(file);
  let buffer = [];

  const flush = () => {
    const content = cleanChunk(buffer.join("\n"));
    buffer = [];
    if (!content) return;

    for (const part of splitLongChunk(content)) {
      chunks.push({
        file,
        title,
        text: part,
        normalizedText: normalizeText(part)
      });
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading = /^#{1,4}\s+/.test(trimmed);
    const isQuestionHeading = /^##\s+\**Question\s+\d+/i.test(trimmed);
    const isChineseQuestion = /^\*\*?\d+[.、]/.test(trimmed);

    if ((isHeading || isQuestionHeading || isChineseQuestion) && buffer.length) {
      flush();
    }

    if (isHeading || isQuestionHeading || isChineseQuestion) {
      title = trimmed
        .replace(/^#{1,4}\s+/, "")
        .replace(/\*\*/g, "")
        .trim()
        .slice(0, 120);
    }

    buffer.push(line);
  }

  flush();
  return chunks;
}

function splitLongChunk(content) {
  if (content.length <= MAX_CHUNK_LENGTH) return [content];

  const paragraphs = content.split(/\n{2,}/);
  const parts = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (current.length + paragraph.length + 2 > MAX_CHUNK_LENGTH && current) {
      parts.push(current.trim());
      current = "";
    }
    current += `${paragraph}\n\n`;
  }

  if (current.trim()) parts.push(current.trim());
  return parts.length ? parts : [content.slice(0, MAX_CHUNK_LENGTH)];
}

function scoreChunk(chunk, queryText, tokens) {
  const text = chunk.normalizedText;
  let score = 0;

  for (const token of tokens) {
    if (text.includes(token)) {
      score += token.length >= 6 ? 2.2 : 1;
    }
  }

  const phrases = extractPhrases(queryText);
  for (const phrase of phrases) {
    if (text.includes(phrase)) score += Math.min(14, phrase.length / 4);
  }

  const questionNumber = queryText.match(/\bquestion\s*(\d{1,3})\b/i)?.[1];
  if (questionNumber && text.includes(`question ${questionNumber}`)) {
    score += 20;
  }

  for (const option of queryText.match(/\b[a-d]\.\s+[a-z0-9][^.\n]{4,80}/gi) || []) {
    const normalizedOption = normalizeText(option.replace(/^[a-d]\.\s*/i, ""));
    if (normalizedOption && text.includes(normalizedOption.slice(0, 40))) {
      score += 5;
    }
  }

  return score;
}

function createExcerpt(text, queryText, tokens) {
  const normalized = normalizeText(text);
  let bestIndex = -1;

  for (const phrase of extractPhrases(queryText)) {
    bestIndex = normalized.indexOf(phrase);
    if (bestIndex >= 0) break;
  }

  if (bestIndex < 0) {
    const token = tokens.find((item) => normalized.includes(item));
    bestIndex = token ? normalized.indexOf(token) : 0;
  }

  const start = Math.max(0, bestIndex - 220);
  const excerpt = text.slice(start, start + 760).replace(/\s+\n/g, "\n").trim();
  return `${start > 0 ? "... " : ""}${excerpt}${start + 760 < text.length ? " ..." : ""}`;
}

function tokenize(text) {
  const latin = text
    .match(/[a-z0-9+#.-]{2,}/g)
    ?.filter((token) => !STOP_WORDS.has(token) && token.length <= 40);
  const cjk = text.match(/[\u4e00-\u9fff]{2,}/g) || [];
  return [...new Set([...(latin || []), ...cjk])];
}

function extractPhrases(text) {
  const sentences = text
    .split(/[?？。!！\n]/)
    .map((sentence) => normalizeText(sentence))
    .filter((sentence) => sentence.length >= 24 && sentence.length <= 220);
  return sentences.slice(0, 6);
}

function cleanChunk(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(h[1-6]|p|div|section|article|tr|li|table)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[：]/g, ":")
    .replace(/[，。？！、；（）【】]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
