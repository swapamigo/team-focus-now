import type { Dict, Lang } from "./types";

import deCommon from "./locales/de/common";
import deLanding from "./locales/de/landing";
import dePages from "./locales/de/pages";
import deApp from "./locales/de/app";
import deDemo from "./locales/de/demo";

import enCommon from "./locales/en/common";
import enLanding from "./locales/en/landing";
import enPages from "./locales/en/pages";
import enApp from "./locales/en/app";
import enDemo from "./locales/en/demo";

import esCommon from "./locales/es/common";
import esLanding from "./locales/es/landing";
import esPages from "./locales/es/pages";
import esApp from "./locales/es/app";
import esDemo from "./locales/es/demo";

const merge = (...parts: Dict[]): Dict => Object.assign({}, ...parts);

export const dictionaries: Record<Lang, Dict> = {
  de: merge(deCommon, deLanding, dePages, deApp, deDemo),
  en: merge(enCommon, enLanding, enPages, enApp, enDemo),
  es: merge(esCommon, esLanding, esPages, esApp, esDemo),
};
