import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, Clock3, Sparkles, BookOpen, Globe } from "lucide-react";
import CameraScanner from "./components/CameraScanner.jsx";
import AutoScanTimer from "./components/AutoScanTimer.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import HistoryStrip from "./components/HistoryStrip.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import QuestionBankManager from "./components/QuestionBankManager.jsx";
import { analyzeQuestionImage } from "./lib/apiClient.js";
import { addHistoryItem, getHistoryItems } from "./lib/historyDb.js";
import { useLanguage } from "./lib/LanguageContext.jsx";

const INITIAL_RESULT = {
  question: "",
  answer: "",
  explanation: "",
  type: "",
  references: []
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const cameraRef = useRef(null);
  const [result, setResult] = useState(INITIAL_RESULT);
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [autoScan, setAutoScan] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [quickMode, setQuickMode] = useState(() => {
    try {
      return localStorage.getItem("app_quick_mode") === "true";
    } catch { return false; }
  });

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight && window.innerWidth > 768);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  useEffect(() => {
    getHistoryItems().then(setHistory).catch(() => setHistory([]));
  }, []);

  useEffect(() => {
    if (!cameraReady) setAutoScan(false);
  }, [cameraReady]);

  const handleQuickModeChange = useCallback((value) => {
    setQuickMode(value);
    try {
      localStorage.setItem("app_quick_mode", String(value));
    } catch {}
  }, []);

  const analyzePayload = useCallback(async (payload) => {
    if (!payload?.imageBase64) return;

    setError("");
    setIsAnalyzing(true);
    setPreview(payload.dataUrl);

    try {
      let modelConfig;
      try {
        const stored = localStorage.getItem("app_model_settings");
        if (stored) modelConfig = JSON.parse(stored);
      } catch (e) {}

      const nextResult = await analyzeQuestionImage({
        imageBase64: payload.imageBase64,
        mimeType: payload.mimeType,
        modelConfig,
        quickMode
      });

      setResult(nextResult);
      const nextHistory = await addHistoryItem({
        createdAt: Date.now(),
        thumbnail: payload.thumbnailDataUrl || payload.dataUrl,
        fullImage: payload.dataUrl,
        result: nextResult
      });
      setHistory(nextHistory);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("analysisFailed"));
    } finally {
      setIsAnalyzing(false);
    }
  }, [t, quickMode]);

  const handleAutoScan = useCallback(async () => {
    if (!cameraRef.current || isAnalyzing) return;

    try {
      const payload = await cameraRef.current.capture();
      await analyzePayload(payload);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("autoCaptureFailed"));
      setAutoScan(false);
    }
  }, [analyzePayload, isAnalyzing, t]);

  const selectHistoryItem = (item) => {
    setPreview(item.fullImage || item.thumbnail);
    setResult(item.result || INITIAL_RESULT);
    setError("");
  };

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  if (isLandscape) {
    return (
      <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 text-slate-950">
        <div className="flex h-full">
          <div className="flex w-[45%] flex-col gap-3 p-3">
            <header className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                  <BookOpen className="h-3.5 w-3.5 text-white" />
                </div>
                <h1 className="text-base font-bold text-slate-900">{t("appTitle")}</h1>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={toggleLanguage} className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-50">
                  <Globe className="h-3 w-3 inline mr-0.5" />
                  {language === "zh" ? "EN" : "中"}
                </button>
                <div className="flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">
                  <Sparkles className="h-3 w-3" />
                  MiMo
                </div>
              </div>
            </header>

            <div className="flex-1 min-h-0">
              <CameraScanner
                ref={cameraRef}
                disabled={isAnalyzing}
                onCapture={analyzePayload}
                onUpload={analyzePayload}
                onReadyChange={setCameraReady}
                compact
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200/60 bg-rose-50/80 px-3 py-2 text-xs text-rose-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AutoScanTimer
              enabled={autoScan}
              isAnalyzing={isAnalyzing}
              cameraReady={cameraReady}
              onEnabledChange={setAutoScan}
              onExpire={handleAutoScan}
              compact
            />
          </div>

          <div className="flex w-[55%] flex-col gap-3 overflow-y-auto border-l border-slate-200/60 bg-white/50 p-3">
            <div className="rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                <Camera className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-800">{t("question")}</h2>
                {isAnalyzing && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Clock3 className="h-3 w-3 animate-pulse" />
                    {t("analyzing")}
                  </span>
                )}
              </div>
              <ResultPanel result={result} preview={preview} isAnalyzing={isAnalyzing} compact />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <QuestionBankManager compact />
              <SettingsPanel quickMode={quickMode} onQuickModeChange={handleQuickModeChange} compact />
            </div>

            <HistoryStrip items={history} onSelect={selectHistoryItem} compact />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <section className="flex min-h-[620px] flex-col gap-5">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25">
                <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {t("appTitle")}
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  {t("appSubtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Globe className="h-3.5 w-3.5" />
                {language === "zh" ? "EN" : "中"}
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-teal-200/60 bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                MiMo v2.5
              </div>
            </div>
          </header>

          <CameraScanner
            ref={cameraRef}
            disabled={isAnalyzing}
            onCapture={analyzePayload}
            onUpload={analyzePayload}
            onReadyChange={setCameraReady}
          />

          {error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/80 backdrop-blur-sm px-5 py-4 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          <HistoryStrip items={history} onSelect={selectHistoryItem} />
        </section>

        <aside className="flex flex-col gap-5">
          <AutoScanTimer
            enabled={autoScan}
            isAnalyzing={isAnalyzing}
            cameraReady={cameraReady}
            onEnabledChange={setAutoScan}
            onExpire={handleAutoScan}
          />

          <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <Camera className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-800">{t("question")}</h2>
              {isAnalyzing ? (
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <Clock3 className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
                  {t("analyzing")}
                </span>
              ) : null}
            </div>
            <ResultPanel result={result} preview={preview} isAnalyzing={isAnalyzing} />
          </div>

          <QuestionBankManager />
          <SettingsPanel quickMode={quickMode} onQuickModeChange={handleQuickModeChange} />
        </aside>
      </div>
    </main>
  );
}