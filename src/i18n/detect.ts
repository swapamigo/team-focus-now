import type { Lang } from "./types";
import { LANGS } from "./types";

export const STORAGE_KEY = "tf_lang";

// DACH → Deutsch
const DE_COUNTRIES = ["DE", "AT", "CH", "LI"];
// Spanischsprachige Länder → Spanisch (zusätzlicher Benefit)
const ES_COUNTRIES = [
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO",
  "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
];

export function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && (LANGS as string[]).includes(v) ? (v as Lang) : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

/** Sprache aus den Browser-Einstellungen (stärkstes Signal für Präferenz). */
export function langFromNavigator(): Lang | null {
  if (typeof navigator === "undefined") return null;
  const list = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean) as string[];
  for (const raw of list) {
    const code = raw.toLowerCase();
    if (code.startsWith("de")) return "de";
    if (code.startsWith("es") || code.startsWith("ca") || code.startsWith("gl")) return "es";
    if (code.startsWith("en")) return "en";
  }
  return null;
}

export function langFromCountry(countryCode?: string | null): Lang {
  const cc = (countryCode ?? "").toUpperCase();
  if (DE_COUNTRIES.includes(cc)) return "de";
  if (ES_COUNTRIES.includes(cc)) return "es";
  return "en";
}

/** Synchroner Erstwert – wird ggf. durch Geo-Lookup verfeinert. */
export function initialLang(): Lang {
  return readStoredLang() ?? langFromNavigator() ?? "en";
}
