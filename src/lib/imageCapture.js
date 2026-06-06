const MAX_EDGE = 1024;
const THUMB_EDGE = 260;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.8;

export async function captureVideoFrame(video, cropElement) {
  if (!video || !video.videoWidth || !video.videoHeight) {
    throw new Error("摄像头画面尚未准备好");
  }

  const crop = getVideoCropRect(video, cropElement);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const context = canvas.getContext("2d");
  context.drawImage(
    video,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvasToPayload(canvas, "camera");
}

export async function fileToImagePayload(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件");
  }

  const bitmap = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0);

  return canvasToPayload(canvas, "upload");
}

async function canvasToPayload(sourceCanvas, mode) {
  validateCanvasQuality(sourceCanvas, mode);

  const dataUrl = resizeCanvas(sourceCanvas, MAX_EDGE).toDataURL(MIME_TYPE, QUALITY);
  const thumbnailDataUrl = resizeCanvas(sourceCanvas, THUMB_EDGE).toDataURL(MIME_TYPE, 0.72);

  return {
    dataUrl,
    thumbnailDataUrl,
    mimeType: MIME_TYPE,
    imageBase64: dataUrlToBase64(dataUrl)
  };
}

function resizeCanvas(sourceCanvas, maxEdge) {
  const { width, height } = sourceCanvas;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const target = document.createElement("canvas");
  target.width = Math.max(1, Math.round(width * scale));
  target.height = Math.max(1, Math.round(height * scale));

  const context = target.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, target.width, target.height);
  return target;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(image.src);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error("图片读取失败"));
    };
    image.src = URL.createObjectURL(file);
  });
}

function dataUrlToBase64(dataUrl) {
  return dataUrl.split(",")[1] || "";
}

function validateCanvasQuality(sourceCanvas, mode) {
  const sampleCanvas = resizeCanvas(sourceCanvas, 160);
  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
  const metrics = analyzeImagePixels(imageData);
  const assessment = assessImageQuality(metrics, mode);

  if (!assessment.ok) {
    throw new Error(assessment.message);
  }
}

export function analyzeImagePixels(imageData) {
  const { data, width, height } = imageData;
  const pixels = width * height;
  const luminance = new Float32Array(pixels);
  let sum = 0;
  let sumSquares = 0;
  let darkPixels = 0;
  let brightPixels = 0;

  for (let pixel = 0, offset = 0; pixel < pixels; pixel += 1, offset += 4) {
    const value = 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2];
    luminance[pixel] = value;
    sum += value;
    sumSquares += value * value;
    if (value < 30) darkPixels += 1;
    if (value > 245) brightPixels += 1;
  }

  const mean = sum / pixels;
  const variance = Math.max(0, sumSquares / pixels - mean * mean);
  const stdDev = Math.sqrt(variance);
  let edgeSum = 0;
  let edgeCount = 0;

  for (let y = 1; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      const index = y * width + x;
      edgeSum += Math.abs(luminance[index] - luminance[index - 1]);
      edgeSum += Math.abs(luminance[index] - luminance[index - width]);
      edgeCount += 2;
    }
  }

  return {
    mean,
    stdDev,
    edgeScore: edgeCount ? edgeSum / edgeCount : 0,
    darkRatio: darkPixels / pixels,
    brightRatio: brightPixels / pixels
  };
}

export function assessImageQuality(metrics, mode = "camera") {
  const isUpload = mode === "upload";
  const lowContrastStdDev = isUpload ? 5.5 : 8;
  const lowEdgeScore = isUpload ? 1.6 : 2.4;

  if (metrics.mean < 18 || metrics.darkRatio > 0.88) {
    return { ok: false, message: "画面过暗，请重新拍摄" };
  }

  if (metrics.mean > 247 && metrics.brightRatio > 0.94 && metrics.stdDev < 7) {
    return { ok: false, message: "画面过亮或空白，请重新拍摄" };
  }

  if (metrics.stdDev < lowContrastStdDev && metrics.edgeScore < lowEdgeScore) {
    return { ok: false, message: "画面无明显文字或对比度过低，请把题目放入横向取景框" };
  }

  return { ok: true, message: "" };
}

function getVideoCropRect(video, cropElement) {
  if (!cropElement) {
    return {
      x: 0,
      y: 0,
      width: video.videoWidth,
      height: video.videoHeight
    };
  }

  const videoRect = video.getBoundingClientRect();
  const cropRect = cropElement.getBoundingClientRect();
  if (!videoRect.width || !videoRect.height || !cropRect.width || !cropRect.height) {
    return {
      x: 0,
      y: 0,
      width: video.videoWidth,
      height: video.videoHeight
    };
  }

  const scale = Math.max(videoRect.width / video.videoWidth, videoRect.height / video.videoHeight);
  const renderedWidth = video.videoWidth * scale;
  const renderedHeight = video.videoHeight * scale;
  const offsetX = (videoRect.width - renderedWidth) / 2;
  const offsetY = (videoRect.height - renderedHeight) / 2;

  const cropLeft = cropRect.left - videoRect.left;
  const cropTop = cropRect.top - videoRect.top;
  const sourceX = (cropLeft - offsetX) / scale;
  const sourceY = (cropTop - offsetY) / scale;
  const sourceWidth = cropRect.width / scale;
  const sourceHeight = cropRect.height / scale;

  const x = clamp(Math.round(sourceX), 0, video.videoWidth - 1);
  const y = clamp(Math.round(sourceY), 0, video.videoHeight - 1);
  const right = clamp(Math.round(sourceX + sourceWidth), x + 1, video.videoWidth);
  const bottom = clamp(Math.round(sourceY + sourceHeight), y + 1, video.videoHeight);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
