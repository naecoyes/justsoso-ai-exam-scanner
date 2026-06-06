import { BookOpen, FileText, ImageIcon, ListChecks } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";

export default function ResultPanel({ result, preview, isAnalyzing }) {
  const { t } = useLanguage();
  const hasResult = Boolean(result?.question || result?.answer || result?.explanation);

  return (
    <div className="space-y-4 p-5">
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100">
          <img src={preview} alt="Captured Image" className="h-40 w-full object-cover" />
        </div>
      ) : (
        <div className="grid h-40 place-items-center rounded-xl border border-dashed border-slate-300/60 bg-slate-50/50 text-slate-400">
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8" aria-hidden="true" />
            <p className="mt-2 text-sm">{t("waitingForImage")}</p>
          </div>
        </div>
      )}

      {isAnalyzing ? <SkeletonResult /> : null}

      {!isAnalyzing && hasResult ? (
        <>
          <ResultBlock icon={FileText} title={t("question")}>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.question}</p>
          </ResultBlock>

          <ResultBlock icon={ListChecks} title={t("answer")}>
            <p className="whitespace-pre-wrap text-2xl font-bold leading-9 text-emerald-600">
              {result.answer || t("noAnswer")}
            </p>
            {result.type ? (
              <p className="mt-2 inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {result.type}
              </p>
            ) : null}
          </ResultBlock>

          <ResultBlock icon={BookOpen} title={t("explanation")}>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {result.explanation || t("noExplanation")}
            </p>
          </ResultBlock>

          <References references={result.references || []} />
        </>
      ) : null}

      {!isAnalyzing && !hasResult ? (
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-5 text-sm leading-6 text-slate-500">
          {t("resultHint")}
        </div>
      ) : null}
    </div>
  );
}

function ResultBlock({ icon: Icon, title, children }) {
  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function References({ references }) {
  const { t } = useLanguage();
  
  if (!references.length) {
    return (
      <section className="rounded-xl border border-slate-200/60 bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-teal-600" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-800">{t("references")}</h3>
        </div>
        <p className="text-sm text-slate-500">{t("noReferences")}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-teal-600" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-800">{t("references")}</h3>
      </div>
      <div className="space-y-3">
        {references.map((reference, index) => (
          <article key={`${reference.file}-${index}`} className="border-l-4 border-teal-500 pl-3">
            <p className="text-xs font-semibold text-slate-800">
              {reference.title || reference.file}
            </p>
            <p className="mt-1 text-xs text-slate-400">{reference.file}</p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {reference.excerpt}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkeletonResult() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-xl border border-slate-200/60 bg-white p-4">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 space-y-2">
            <div className="h-3 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-3 w-4/5 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
