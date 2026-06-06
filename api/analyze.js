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
          "你是 OCR 识题助手。只判断图片中是否清楚可见考试题目，并识别题目、选项和题型。严禁根据常识、题库、上下文或猜测补全题目；黑屏、过暗、空白、纯色、模糊、没有完整题干时必须返回 isQuestionVisible:false。只返回严格 JSON：{\"question\":\"题目全文和选项；不可见时为空字符串\",\"type\":\"题型；不可见时为空字符串\",\"isQuestionVisible\":true,\"confidence\":0.0到1.0,\"reason\":\"可见或不可见原因\"}。"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "请只基于图片可见内容识别题目。若图片中没有清楚完整的题目，请返回 isQuestionVisible:false，question 为空，不要猜。"
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

    const references = await getReferenceSnippets(recognized.question || recognized.rawText);
    const referenceContext = formatReferencesForPrompt(references);

    const finalPayload = await client.complete([
      {
        role: "system",
        content:
          "你是严谨的 CSA 312-39 备考答题助手。优先依据提供的备考资料片段作答；资料不足时再结合题目常识判断。只返回严格 JSON，不要 Markdown，不要额外文字。JSON schema: {\"question\":\"识别出的题目全文\",\"answer\":\"最终答案\",\"explanation\":\"解析，说明是否参考了备考资料\",\"type\":\"题型\"}。"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              "请解答图片中的题目。",
              "",
              "已识别题目：",
              recognized.question,
              "",
              referenceContext
                ? `本地备考资料相关片段：\n${referenceContext}`
                : "本地备考资料未命中高相关片段。"
            ].join("\n")
          },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }
    ]);

    const result = parseMimoPayload(finalPayload);
    return sendJson(res, 200, {
      ...result,
      question: result.question || recognized.question,
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
