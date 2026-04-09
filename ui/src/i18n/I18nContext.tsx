import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { I18nContextValue, Locale } from "./types";
import { es } from "./es";

const LOCALE_STORAGE_KEY = "paperclip.locale";

const dictionaries: Record<string, Record<string, string>> = { es };

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {}
  return "en";
}

function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  let value = dictionaries[locale]?.[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replaceAll(`{${k}}`, String(v));
    }
  }
  return value;
}

const defaultI18nContext: I18nContextValue = {
  locale: "en",
  setLocale: () => {},
  t: (key, params) => translate("en", key, params),
};

const I18nContext = createContext<I18nContextValue>(defaultI18nContext);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => translate(locale, key, params),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
