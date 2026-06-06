import assert from "node:assert/strict";
import { parseAssistantText, parseMimoPayload } from "../api/_parseMimoResult.js";
import { chunkText, getReferenceSnippets } from "../api/_documentSearch.js";
import { getVisibilityProblem } from "../api/analyze.js";
import { analyzeImagePixels, assessImageQuality } from "../src/lib/imageCapture.js";

const jsonPayload = {
  choices: [
    {
      message: {
        content:
          '{"question":"1+1 等于几？","answer":"2","explanation":"基础加法。","type":"计算题"}'
      }
    }
  ]
};

assert.deepEqual(parseMimoPayload(jsonPayload), {
  question: "1+1 等于几？",
  answer: "2",
  explanation: "基础加法。",
  type: "计算题",
  references: [],
  rawText:
    '{"question":"1+1 等于几？","answer":"2","explanation":"基础加法。","type":"计算题"}'
});

const sectionResult = parseAssistantText(
  "【识别题目】\n选择正确答案\n【答案】\nB\n【解析】\n根据题干可知。\n【题型】\n选择题"
);

assert.equal(sectionResult.question, "选择正确答案");
assert.equal(sectionResult.answer, "B");
assert.equal(sectionResult.explanation, "根据题干可知。");
assert.equal(sectionResult.type, "选择题");

const chunks = chunkText(
  "# Demo\nIntro\n\n## Question 9\nWhich type of threat intelligence provides long-term risk insight?\n\n**Answer: Strategic Threat Intelligence**",
  "demo.md"
);
assert.equal(chunks.length, 2);
assert.equal(chunks[1].title, "Question 9");

const references = await getReferenceSnippets(
  "Senior management is concerned about long-term financial and reputational damage. Which type of threat intelligence are you seeking?"
);
assert.ok(references.length > 0);
assert.match(references[0].excerpt, /Strategic Threat Intelligence|long-term/i);

const invisibleRecognition = parseMimoPayload({
  choices: [
    {
      message: {
        content:
          '{"question":"","type":"","isQuestionVisible":false,"confidence":0.08,"reason":"black screen"}'
      }
    }
  ]
});
assert.equal(invisibleRecognition.isQuestionVisible, false);
assert.equal(invisibleRecognition.confidence, 0.08);
assert.match(getVisibilityProblem(invisibleRecognition), /black screen/);

const lowConfidenceRecognition = parseMimoPayload({
  choices: [
    {
      message: {
        content:
          '{"question":"Which SOC workflow sequence is correct? A. Collect Ingest Validate Document Report Respond","type":"选择题","isQuestionVisible":true,"confidence":0.3,"reason":"blurred"}'
      }
    }
  ]
});
assert.match(getVisibilityProblem(lowConfidenceRecognition), /置信度/);

const visibleRecognition = parseMimoPayload({
  choices: [
    {
      message: {
        content:
          '{"question":"Which SOC workflow sequence is correct? A. Collect Ingest Validate Document Report Respond","type":"选择题","isQuestionVisible":true,"confidence":0.91,"reason":"clear"}'
      }
    }
  ]
});
assert.equal(getVisibilityProblem(visibleRecognition), "");

assert.equal(assessImageQuality(analyzeImagePixels(solidImage(32, 32, 0)), "camera").ok, false);
assert.match(
  assessImageQuality(analyzeImagePixels(solidImage(32, 32, 255)), "camera").message,
  /空白|过亮/
);
assert.equal(assessImageQuality(analyzeImagePixels(solidImage(32, 32, 128)), "camera").ok, false);
assert.equal(assessImageQuality(analyzeImagePixels(textLikeImage(64, 64)), "camera").ok, true);

console.log("API parse tests passed");

function solidImage(width, height, value) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
    data[index + 3] = 255;
  }
  return { data, width, height };
}

function textLikeImage(width, height) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let pixel = 0, offset = 0; pixel < width * height; pixel += 1, offset += 4) {
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const isInk =
      (y >= 12 && y <= 16 && x >= 8 && x <= 54) ||
      (y >= 26 && y <= 30 && x >= 8 && x <= 48) ||
      (y >= 40 && y <= 44 && x >= 8 && x <= 58) ||
      (x >= 10 && x <= 12 && y >= 10 && y <= 48);
    const value = isInk ? 18 : 248;
    data[offset] = value;
    data[offset + 1] = value;
    data[offset + 2] = value;
    data[offset + 3] = 255;
  }
  return { data, width, height };
}
