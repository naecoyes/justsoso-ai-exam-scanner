const EMPTY_RESULT = {
  question: "",
  answer: "",
  explanation: "",
  type: "未知题型",
  references: [],
  isQuestionVisible: undefined,
  confidence: undefined,
  reason: "",
  rawText: ""
};

export function normalizeResult(input) {
  const isQuestionVisible = normalizeBoolean(input?.isQuestionVisible);
  const confidence = normalizeConfidence(input?.confidence);
  const reason = stringifyField(input?.reason);
  const result = {
    question: stringifyField(input?.question),
    answer: stringifyField(input?.answer),
    explanation: stringifyField(input?.explanation),
    type: stringifyField(input?.type) || "未知题型",
    references: normalizeReferences(input?.references),
    rawText: stringifyField(input?.rawText)
  };

  if (isQuestionVisible !== undefined) result.isQuestionVisible = isQuestionVisible;
  if (confidence !== undefined) result.confidence = confidence;
  if (reason) result.reason = reason;

  if (!result.question && !result.answer && !result.explanation && isQuestionVisible === undefined && !reason) {
    throw new Error("模型返回内容为空");
  }

  return result;
}

export function parseAssistantText(text) {
  const rawText = stringifyField(text);
  if (!rawText) {
    throw new Error("模型没有返回文本内容");
  }

  const jsonCandidate = extractJson(rawText);
  if (jsonCandidate) {
    try {
      return normalizeResult({ ...JSON.parse(jsonCandidate), rawText });
    } catch {
      // Fall through to section parsing.
    }
  }

  const question = pickSection(rawText, ["识别题目", "题目", "question"]);
  const answer = pickSection(rawText, ["答案", "answer"]);
  const explanation = pickSection(rawText, ["解析", "explanation"]);
  const type = pickSection(rawText, ["题型", "type"]);

  return normalizeResult({
    question: question || rawText,
    answer,
    explanation,
    type,
    rawText
  });
}

export function parseMimoPayload(payload) {
  const content = payload?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.type === "text") return part.text || "";
        return part?.text || "";
      })
      .join("\n")
      .trim();
    return parseAssistantText(text);
  }

  return parseAssistantText(content);
}

function stringifyField(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(stringifyField).filter(Boolean).join("\n");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

function normalizeReferences(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      file: stringifyField(item?.file),
      title: stringifyField(item?.title),
      excerpt: stringifyField(item?.excerpt)
    }))
    .filter((item) => item.file || item.title || item.excerpt);
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1", "可见", "是"].includes(normalized)) return true;
    if (["false", "no", "n", "0", "不可见", "否"].includes(normalized)) return false;
  }
  return undefined;
}

function normalizeConfidence(value) {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  return Math.max(0, Math.min(1, number));
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return text.slice(first, last + 1).trim();
  }

  return "";
}

function pickSection(text, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(?:【${escaped}】|${escaped}\\s*[:：])\\s*([\\s\\S]*?)(?=\\n\\s*(?:【[^】]+】|(?:识别题目|题目|答案|解析|题型|question|answer|explanation|type)\\s*[:：])|$)`,
      "i"
    );
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return "";
}

export { EMPTY_RESULT };
