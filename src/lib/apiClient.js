export async function analyzeQuestionImage(payload) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      ...payload,
      quickMode: payload.quickMode || false
    })
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "Analysis request failed");
  }

  return {
    question: body.question || "",
    answer: body.answer || "",
    explanation: body.explanation || "",
    type: body.type || "",
    references: Array.isArray(body.references) ? body.references : []
  };
}

export async function getReferences() {
  const response = await fetch("/api/references");
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Failed to list references");
  return body.documents || [];
}

export async function uploadReference(file) {
  const text = await file.text();
  const response = await fetch("/api/references", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: file.name, content: text })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Upload failed");
  return body.documents || [];
}

export async function deleteReference(id) {
  const response = await fetch(`/api/references?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Delete failed");
  return body.documents || [];
}
