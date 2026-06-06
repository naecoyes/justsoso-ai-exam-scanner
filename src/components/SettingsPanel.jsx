import { useState, useEffect } from "react";
import { Settings, Save, Check } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";

export default function SettingsPanel() {
  const { t } = useLanguage();
  const [config, setConfig] = useState({ apiKey: "", baseUrl: "", model: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("app_model_settings");
      if (stored) setConfig(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("app_model_settings", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800">
          <Settings className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold text-slate-800">{t("modelSettings")}</h2>
      </div>
      <div className="space-y-3.5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">{t("apiKey")}</label>
          <input
            type="password"
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
            placeholder="sk-..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">{t("baseUrl")}</label>
          <input
            type="text"
            name="baseUrl"
            value={config.baseUrl}
            onChange={handleChange}
            placeholder="https://api.openai.com/v1"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">{t("modelName")}</label>
          <input
            type="text"
            name="model"
            value={config.model}
            onChange={handleChange}
            placeholder="mimo-v2.5"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? t("saved") : t("saveSettings")}
        </button>
      </div>
    </section>
  );
}
