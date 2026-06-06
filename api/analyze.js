import { parseMimoPayload } from "./_parseMimoResult.js";
import { formatReferencesForPrompt, getReferenceSnippets } from "./_documentSearch.js";
import { readJson, sendJson } from "./_json.js";

const DEFAULT_BASE_URL = "https://token-plan-sgp.xiaomimimo.com/v1";
const DEFAULT_MODEL = "mimo-v2.5";
const MAX_BASE64_LENGTH = 1_600_000;
const MIN_OCR_CONFIDENCE = 0.45;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "只支持 POST /api/analyze" });
  }

  try {
    const body = await readJson(req);
    const imageBase64 = sanitizeBase64(body?.imageBase64);
    const mimeType = sanitizeMimeType(body?.mimeType);
    const modelConfig = sanitizeModelConfig(body?.modelConfig);
    const quickMode = body?.quickMode === true;

    if (!imageBase64) {
      return sendJson(res, 400, { error: "缺少 imageBase64" });
    }

    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return sendJson(res, 413, { error: "图片过大，请重新拍摄或压缩后上传" });
    }

    const apiKey = modelConfig.apiKey || process.env.MIMO_API_KEY;
    if (!apiKey) {
      return sendJson(res, 500, { error: "Missing MiMo API key. Add one in Settings." });
    }

    const client = createMimoClient({
      apiKey,
      baseUrl: trimTrailingSlash(modelConfig.baseUrl || process.env.MIMO_BASE_URL || DEFAULT_BASE_URL),
      model: modelConfig.model || process.env.MIMO_MODEL || DEFAULT_MODEL
    });
    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

    const recognition = await client.complete([
      {
        role: "system",
        content:
          "你是 OCR 识题答题助手。识别图片中的题目并直接给出答案。只返回严格 JSON：{\"question\":\"题目全文和选项\",\"answer\":\"最终答案\",\"explanation\":\"简要解析\",\"type\":\"题型\",\"isQuestionVisible\":true,\"confidence\":0.0到1.0}。黑屏、过暗、空白、模糊时返回 {\"isQuestionVisible\":false,\"question\":\"\",\"answer\":\"\",\"explanation\":\"\",\"type\":\"\",\"confidence\":0}。"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "请识别图片中的题目并直接给出答案。"
          },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }
    ]);

    const recognized = parseMimoPayload(recognition);
    const visibilityProblem = getVisibilityProblem(recognized);
    if (visibilityProblem) {
      return sendJson(res, 422, {
        error: visibilityProblem,
        question: recognized.question || "",
        type: recognized.type || "",
        reason: recognized.reason || visibilityProblem,
        confidence: recognized.confidence ?? 0,
        references: []
      });
    }

    if (quickMode) {
      return sendJson(res, 200, {
        question: recognized.question || "",
        answer: recognized.answer || "",
        explanation: "",
        type: recognized.type || "",
        references: []
      });
    }

    const references = await getReferenceSnippets(recognized.question || "");
    const referenceContext = formatReferencesForPrompt(references);

    let result = recognized;
    if (referenceContext) {
      const finalPayload = await client.complete([
        {
          role: "system",
          content:
            "你是严谨的备考答题助手。根据参考资料优化答案。只返回严格 JSON：{\"question\":\"题目\",\"answer\":\"最终答案\",\"explanation\":\"解析\",\"type\":\"题型\"}。"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "已识别题目：",
                recognized.question,
                "",
                "参考资料：",
                referenceContext
              ].join("\n")
            }
          ]
        }
      ]);
      result = parseMimoPayload(finalPayload);
    }

    return sendJson(res, 200, {
      question: result.question || recognized.question,
      answer: result.answer || recognized.answer,
      explanation: result.explanation || recognized.explanation,
      type: result.type || recognized.type,
      references
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "分析失败"
    });
  }
}

function sanitizeModelConfig(value) {
  const config = value && typeof value === "object" ? value : {};
  return {
    apiKey: String(config.apiKey || "").trim(),
    baseUrl: String(config.baseUrl || "").trim(),
    model: String(config.model || "").trim()
  };
}

export function getVisibilityProblem(recognized) {
  if (recognized.isQuestionVisible !== true) {
    return recognized.reason || "画面中未检测到清晰题目，请重新拍摄";
  }

  if (typeof recognized.confidence !== "number" || recognized.confidence < MIN_OCR_CONFIDENCE) {
    return "题目识别置信度过低，请把题目放入横向取景框后重拍";
  }

  if (!looksLikeQuestionText(recognized.question)) {
    return "未检测到完整题目文字，请重新拍摄";
  }

  return "";
}

export function looksLikeQuestionText(value) {
  const text = String(value || "").trim();
  const lettersAndNumbers = text.match(/[a-zA-Z0-9\u4e00-\u9fff]/g) || [];
  return text.length >= 8 && lettersAndNumbers.length >= 6;
}

function createMimoClient({ apiKey, baseUrl, model }) {
  return {
    async complete(messages) {
      const upstream = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          messages
        })
      });

      const payload = await readUpstreamJson(upstream);
      if (!upstream.ok) {
        throw new Error(payload?.error?.message || payload?.message || "MiMo API 请求失败");
      }
      return payload;
    }
  };
}

async function readUpstreamJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function sanitizeBase64(value) {
  const text = String(value || "").trim();
  return text.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
}

function sanitizeMimeType(value) {
  const mimeType = String(value || "image/jpeg").trim().toLowerCase();
  if (!/^image\/(jpeg|jpg|png|webp)$/.test(mimeType)) {
    return "image/jpeg";
  }
  return mimeType === "image/jpg" ? "image/jpeg" : mimeType;
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}
