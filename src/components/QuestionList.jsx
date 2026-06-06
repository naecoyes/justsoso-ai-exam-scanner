import { useState, useEffect } from "react";
import { BookOpen, Trash2, ChevronDown, ChevronUp, FileText, Download } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { getQuestions, deleteQuestion, clearQuestions } from "../lib/apiClient.js";

export default function QuestionList({ compact = false }) {
  const { t, language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (e) {
      console.error("Failed to delete question:", e);
    }
  };

  const handleClear = async () => {
    if (!confirm(t("confirmClear"))) return;
    try {
      await clearQuestions();
      setQuestions([]);
    } catch (e) {
      console.error("Failed to clear questions:", e);
    }
  };

  const handleExport = () => {
    const data = questions.map(q => ({
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
      type: q.type
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `questions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(timestamp);
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </section>
    );
  }

  if (compact) {
    return (
      <section className="rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-800">{t("questionList")}</span>
            <span className="text-[10px] text-slate-400">({questions.length})</span>
          </div>
          {questions.length > 0 && (
            <div className="flex gap-1">
              <button onClick={handleExport} className="rounded p-1 text-slate-400 hover:text-teal-600" title={t("export")}>
                <Download className="h-3 w-3" />
              </button>
              <button onClick={handleClear} className="rounded p-1 text-slate-400 hover:text-rose-600" title={t("clearAll")}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <div className="max-h-48 space-y-1.5 overflow-y-auto">
          {questions.length === 0 ? (
            <p className="text-center text-[10px] text-slate-400 py-4">{t("noQuestions")}</p>
          ) : (
            questions.slice(0, 20).map((q) => (
              <div key={q.id} className="rounded-lg border border-slate-100 bg-slate-50/50 px-2 py-1.5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] font-medium text-slate-700 line-clamp-2 flex-1">{q.question}</p>
                  <span className="shrink-0 rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-semibold text-emerald-700">{q.answer || "-"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">{t("questionList")}</h2>
            <p className="text-[10px] text-slate-400">{questions.length} {t("questions")}</p>
          </div>
        </div>
        {questions.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-3 w-3" />
              {t("export")}
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3 w-3" />
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-400">{t("noQuestions")}</p>
            <p className="mt-1 text-[10px] text-slate-300">{t("autoSaveHint")}</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-100 bg-white transition hover:border-slate-200">
              <div
                className="flex cursor-pointer items-start gap-3 p-3"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 line-clamp-2">{q.question}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    {q.answer && (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {q.answer}
                      </span>
                    )}
                    {q.type && (
                      <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">
                        {q.type}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{formatTime(q.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                    className="rounded p-1 text-slate-400 opacity-0 transition hover:text-rose-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  {expandedId === q.id ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
              {expandedId === q.id && q.explanation && (
                <div className="border-t border-slate-100 px-3 py-2.5">
                  <p className="text-[10px] font-medium text-slate-500 mb-1">{t("explanation")}:</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}