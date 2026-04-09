export type Locale = "en" | "es";

export type TranslationDictionary = Record<string, string | Record<string, string | Record<string, string>>>;

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}
