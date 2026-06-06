import { createContext, useContext, useState, useEffect } from "react";
import translations from "../lib/translations.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const stored = localStorage.getItem("app_language");
      if (stored && (stored === "zh" || stored === "en")) return stored;
    } catch (e) {}
    return navigator.language.startsWith("zh") ? "zh" : "en";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || translations.en[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}