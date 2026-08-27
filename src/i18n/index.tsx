import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { dictionaries } from "./dict";
import { initialLang, langFromCountry, langFromNavigator, readStoredLang, storeLang } from "./detect";
import type { Lang } from "./types";
import { LANGS } from "./types";
import { getVisitorGeo } from "@/lib/geo";

export type { Lang };
export { LANGS };

export const LANG_LABELS: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
};

export const LANG_FLAGS: Record<Lang, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  es: "🇪🇸",
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Übersetzt einen Schlüssel; fällt auf Deutsch (Quelltext) zurück. */
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function interpolate(value: string, vars?: Record<string, string | number>) {
  if (!vars) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang());
  const explicit = useRef<boolean>(!!readStoredLang());

  // Standortbasierte Verfeinerung, wenn keine explizite Wahl/Browser-Sprache vorliegt.
  useEffect(() => {
    if (explicit.current || langFromNavigator()) return;
    let cancelled = false;
    getVisitorGeo().then((geo) => {
      if (cancelled) return;
      setLangState(langFromCountry(geo.country_code));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    explicit.current = true;
    storeLang(l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = dictionaries[lang]?.[key] ?? dictionaries.de[key] ?? key;
      return interpolate(value, vars);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback, damit Komponenten außerhalb des Providers nicht crashen.
    return {
      lang: "de",
      setLang: () => undefined,
      t: (key: string, vars?: Record<string, string | number>) =>
        interpolate(dictionaries.de[key] ?? key, vars),
    };
  }
  return ctx;
}

/** Kurzform: const t = useT(); t("hero.title") */
export function useT() {
  return useI18n().t;
}

/** Liste aus einem Schlüssel: Werte sind mit " | " getrennt. */
export function useTList() {
  const { t } = useI18n();
  return (key: string) =>
    t(key)
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
}
