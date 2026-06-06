import { History, Trash2 } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";

export default function HistoryStrip({ items, onSelect, onClear, compact = false }) {
  const { t, language } = useLanguage();
  
  if (compact) {
    return (
      <section className="rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-sm p-3 shadow-sm h-full flex flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-slate-500" />
          <h2 className="text-[10px] font-semibold text-slate-800">{t("history")}</h2>
          <span className="ml-auto text-[10px] text-slate-400">{items.length}</span>
        </div>
        {items.length ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="group w-16 shrink-0 text-left"
                onClick={() => onSelect(item)}
              >
                <span className="block overflow-hidden rounded-lg border border-slate-200/60 bg-slate-100">
                  <img src={item.thumbnail} alt="" className="h-10 w-full object-cover" />
                </span>
                <span className="mt-1 block truncate text-[9px] text-emerald-600">
                  {item.result?.answer || "-"}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-400">{t("noHistory")}</p>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-700">
          <History className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold text-slate-800">{t("history")}</h2>
        <span className="ml-auto text-xs text-slate-400">{items.length} {t("records")}</span>
        {items.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            title={t("clearHistory")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {items.length ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className="group w-28 shrink-0 text-left"
              onClick={() => onSelect(item)}
            >
              <span className="block overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 transition group-hover:border-teal-500 group-hover:shadow-sm">
                <img src={item.thumbnail} alt="" className="h-20 w-full object-cover" />
              </span>
              <span className="mt-2 block truncate text-xs font-medium text-slate-600">
                {formatTime(item.createdAt, language)}
              </span>
              <span className="block truncate text-xs text-emerald-600">
                {item.result?.answer || t("noAnswerFound")}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t("noHistory")}</p>
      )}
    </section>
  );
}

function formatTime(timestamp, language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(timestamp);
}
