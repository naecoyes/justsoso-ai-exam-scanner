import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, TimerReset } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";

const INTERVAL_SECONDS = 60;

export default function AutoScanTimer({
  enabled,
  isAnalyzing,
  cameraReady,
  onEnabledChange,
  onExpire
}) {
  const { t } = useLanguage();
  const deadlineRef = useRef(0);
  const firingRef = useRef(false);
  const [remaining, setRemaining] = useState(INTERVAL_SECONDS);

  useEffect(() => {
    if (!enabled || isAnalyzing) {
      deadlineRef.current = 0;
      setRemaining(INTERVAL_SECONDS);
      return;
    }

    deadlineRef.current = Date.now() + INTERVAL_SECONDS * 1000;
    setRemaining(INTERVAL_SECONDS);
  }, [enabled, isAnalyzing]);

  useEffect(() => {
    if (!enabled || isAnalyzing) return undefined;

    const tick = async () => {
      const deadline = deadlineRef.current || Date.now() + INTERVAL_SECONDS * 1000;
      deadlineRef.current = deadline;
      const nextRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(nextRemaining);

      if (nextRemaining === 0 && !firingRef.current) {
        firingRef.current = true;
        await onExpire();
        firingRef.current = false;
        deadlineRef.current = Date.now() + INTERVAL_SECONDS * 1000;
        setRemaining(INTERVAL_SECONDS);
      }
    };

    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [enabled, isAnalyzing, onExpire]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && enabled && !isAnalyzing) {
        deadlineRef.current = Date.now() + INTERVAL_SECONDS * 1000;
        setRemaining(INTERVAL_SECONDS);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, isAnalyzing]);

  const progress = useMemo(() => {
    return Math.max(0, Math.min(1, remaining / INTERVAL_SECONDS));
  }, [remaining]);

  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference * (1 - progress);

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
            <TimerReset className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">{t("autoScan")}</h2>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          className={`relative h-7 w-12 rounded-full transition ${
            enabled ? "bg-gradient-to-r from-teal-500 to-emerald-500" : "bg-slate-300"
          } ${!cameraReady || isAnalyzing ? "opacity-60" : ""}`}
          onClick={() => onEnabledChange(!enabled)}
          disabled={!cameraReady || isAnalyzing}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              enabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="text-amber-500 transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">{enabled ? remaining : 60}</div>
              <div className="text-xs font-medium text-slate-400">{t("seconds")}</div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
        <RefreshCw className={`h-4 w-4 ${enabled && !isAnalyzing ? "animate-spin" : ""}`} />
        {cameraReady ? (enabled ? t("waitingNext") : t("readyForCapture")) : t("enableCamera")}
      </p>
    </section>
  );
}
