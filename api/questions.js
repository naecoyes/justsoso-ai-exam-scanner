import { readJson, sendJson } from "./_json.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, "..", "user-documents", "questions");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getQuestionsFile() {
  ensureDir(QUESTIONS_DIR);
  return path.join(QUESTIONS_DIR, "questions.json");
}

function readQuestions() {
  const file = getQuestionsFile();
  if (!fs.existsSync(file)) return [];
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeQuestions(questions) {
  const file = getQuestionsFile();
  ensureDir(QUESTIONS_DIR);
  fs.writeFileSync(file, JSON.stringify(questions, null, 2), "utf-8");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  try {
    if (req.method === "GET") {
      const questions = readQuestions();
      return sendJson(res, 200, { questions });
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const { question, answer, explanation, type, source } = body;

      if (!question) {
        return sendJson(res, 400, { error: "问题不能为空" });
      }

      const questions = readQuestions();
      const newQuestion = {
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        question: String(question).trim(),
        answer: String(answer || "").trim(),
        explanation: String(explanation || "").trim(),
        type: String(type || "").trim(),
        source: String(source || "scan").trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const existingIndex = questions.findIndex(q => 
        q.question === newQuestion.question && q.answer === newQuestion.answer
      );

      if (existingIndex >= 0) {
        questions[existingIndex] = {
          ...questions[existingIndex],
          ...newQuestion,
          id: questions[existingIndex].id,
          createdAt: questions[existingIndex].createdAt,
          updatedAt: Date.now()
        };
      } else {
        questions.unshift(newQuestion);
      }

      writeQuestions(questions);
      return sendJson(res, 200, { success: true, question: newQuestion, count: questions.length });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url, "http://localhost");
      const id = url.searchParams.get("id");

      if (id) {
        let questions = readQuestions();
        questions = questions.filter(q => q.id !== id);
        writeQuestions(questions);
        return sendJson(res, 200, { success: true, count: questions.length });
      }

      writeQuestions([]);
      return sendJson(res, 200, { success: true, count: 0 });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "操作失败"
    });
  }
}