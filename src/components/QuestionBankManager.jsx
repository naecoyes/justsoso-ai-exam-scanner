import { useState, useEffect, useRef } from "react";
import { FolderUp, Trash2, FileText, Loader2, BookOpen, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";

const STORAGE_KEY = "question_banks";

export default function QuestionBankManager() {
  const { t } = useLanguage();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBanks(JSON.parse(stored));
    } catch (e) {
      setBanks([]);
    }
  };

  const saveBanks = (newBanks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBanks));
    setBanks(newBanks);
  };

  const handleUploadClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const content = await file.text();
      let questions = [];

      if (file.name.endsWith(".json")) {
        questions = parseJSON(content, file.name);
      } else if (file.name.endsWith(".csv")) {
        questions = parseCSV(content, file.name);
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        questions = parseText(content, file.name);
      } else {
        throw new Error(t("unsupportedFormat"));
      }

      if (questions.length === 0) {
        throw new Error(t("noValidQuestions"));
      }

      const newBank = {
        id: Date.now().toString(),
        name: file.name,
        count: questions.length,
        createdAt: Date.now(),
        questions
      };

      saveBanks([...banks, newBank]);
      setSuccess(t("importSuccess", { count: questions.length }));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("importFailed"));
    } finally {
      setLoading(false);
    }
  };

  const parseJSON = (content, fileName) => {
    const data = JSON.parse(content);
    const arr = Array.isArray(data) ? data : data.questions || data.items || [];
    return arr.map((q, i) => ({
      id: `${fileName}-${i}`,
      question: q.question || q.title || q.q || "",
      answer: q.answer || q.a || "",
      explanation: q.explanation || q.explain || q.解析 || "",
      options: q.options || q.choices || []
    })).filter(q => q.question);
  };

  const parseCSV = (content, fileName) => {
    const lines = content.split("\n").filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const qIdx = headers.findIndex(h => ["question", "title", "题目", "问题"].includes(h));
    const aIdx = headers.findIndex(h => ["answer", "答案", "正确答案"].includes(h));
    const eIdx = headers.findIndex(h => ["explanation", "explain", "解析", "解释"].includes(h));
    if (qIdx === -1) return [];
    return lines.slice(1).map((line, i) => {
      const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      return {
        id: `${fileName}-${i}`,
        question: cols[qIdx] || "",
        answer: aIdx >= 0 ? cols[aIdx] : "",
        explanation: eIdx >= 0 ? cols[eIdx] : "",
        options: []
      };
    }).filter(q => q.question);
  };

  const parseText = (content, fileName) => {
    const blocks = content.split(/\n\s*\n/).filter(b => b.trim());
    return blocks.map((block, i) => {
      const lines = block.trim().split("\n");
      const question = lines[0]?.replace(/^\d+[\.\)、]\s*/, "").trim() || "";
      const answer = lines.find(l => /^答案[：:]/.test(l))?.replace(/^答案[：:]\s*/, "").trim() || "";
      const explanation = lines.find(l => /^解析[：:]/.test(l))?.replace(/^解析[：:]\s*/, "").trim() || "";
      const options = lines.slice(1).filter(l => /^[A-Da-d][\.\)、]/.test(l)).map(l => l.trim());
      return { id: `${fileName}-${i}`, question, answer, explanation, options };
    }).filter(q => q.question);
  };

  const handleDelete = (id) => {
    const newBanks = banks.filter(b => b.id !== id);
    saveBanks(newBanks);
  };

  const totalQuestions = banks.reduce((sum, b) => sum + b.count, 0);

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <BookOpen className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">{t("myQuestionBank")}</h2>
            <p className="text-xs text-slate-400">{totalQuestions} {t("questions")}</p>
          </div>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FolderUp className="h-3.5 w-3.5" />}
          {t("importBank")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
          <Check className="h-3.5 w-3.5 shrink-0" />
          {success}
        </div>
      )}

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {banks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BookOpen className="h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-2 text-xs text-slate-400">{t("noBank")}</p>
            <p className="mt-1 text-[10px] text-slate-300">{t("supportedFormats")}</p>
          </div>
        ) : (
          banks.map((bank) => (
            <div
              key={bank.id}
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                  <FileText className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-xs font-medium text-slate-700" title={bank.name}>
                    {bank.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {bank.count} {t("questions")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(bank.id)}
                className="ml-2 rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                title={t("delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}