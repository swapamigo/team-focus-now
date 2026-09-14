// Demo-Spiellogik: gezählt wird ausschließlich, WIE OFT das Handy während der
// Arbeitszeit entsperrt wird. Keine Dauer, keine Inhalte, keine App-Namen.
//
// Punktelogik der Demo:
// - Jeder spielt zuerst gegen sich selbst: bis zu 4.000 Punkte = 40 € pro Monat.
// - Die letzten 10 € werden über das Wochen-Ranking im Betrieb verteilt (1–10 €).

import { DAY_KEYS, MONTH_KEYS } from "./demoData";

export const PERSONAL_MAX_EUR = 40;
export const RANKING_POOL_EUR = 10;
export const POINTS_PER_EUR = 100;
export const PERSONAL_MAX_POINTS = PERSONAL_MAX_EUR * POINTS_PER_EUR;

/** Punkte für einen Tag anhand der Griffe pro Arbeitsstunde. */
export function pointsForRate(rate: number): number {
  if (rate <= 1) return 200;
  if (rate <= 2) return 160;
  if (rate <= 3) return 120;
  if (rate <= 4) return 90;
  if (rate <= 5) return 60;
  if (rate <= 7) return 35;
  if (rate <= 10) return 15;
  if (rate <= 15) return 5;
  return 0;
}

/** Bonus in Euro für einen Platz im Wochen-Ranking (Pool: 10 €). */
export function rankingBonusEur(place: number): number {
  const table = [10, 7, 5, 4, 3, 2, 2, 1, 1, 1];
  return table[place - 1] ?? 1;
}

export interface UnlockDay {
  label: string;
  unlocks: number;
  hours: number;
  rate: number;
  points: number;
}

/** Woche: Entsperrungen pro Tag + daraus abgeleitete Punkte. */
export function genUnlockWeek(seed = 0, dayLabels: string[] = DAY_KEYS): UnlockDay[] {
  return Array.from({ length: 7 }).map((_, i) => {
    const offset = 6 - i;
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const hours = 8;
    const raw = 2.6 + (Math.sin((i + seed) * 1.35) + 1) * 0.9;
    const rate = Math.round(raw * 10) / 10;
    const unlocks = Math.round(rate * hours);
    return {
      label: dayLabels[(d.getDay() + 6) % 7],
      unlocks,
      hours,
      rate,
      points: pointsForRate(rate),
    };
  });
}

/** Ø Griffe pro Person und Arbeitsstunde im Betrieb – über die letzten 6 Monate. */
export function genCompanyUnlockTrend(seed = 0, monthLabels: string[] = MONTH_KEYS) {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const p = i / 5;
    const noise = ((Math.sin((i + seed) * 2.1) + 1) / 2 - 0.5) * 0.25;
    return {
      label: `${monthLabels[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      rate: Math.max(0.8, Math.round((4.1 - p * 1.8 + noise) * 10) / 10),
    };
  });
}

/** Anonymes Wochen-Ranking im Betrieb (Punkte der Woche). */
export const demoWeeklyRanking = [
  { alias: "Blaufuchs", points: 1240 },
  { alias: "Nordlicht", points: 1180 },
  { alias: "Du", points: 1105, isMe: true },
  { alias: "Kolibri", points: 1040 },
  { alias: "Stiller Kaktus", points: 980 },
  { alias: "Turbo-Otter", points: 910 },
  { alias: "Leise Welle", points: 860 },
  { alias: "Bergfuchs", points: 780 },
];

// ---------------------------------------------------------------------------
// Prämienkatalog – der Manager pflegt ihn, Mitarbeitende lösen dort Punkte ein.
// In der Demo wird er im Browser (localStorage) geteilt.

export interface ShopItem {
  id: string;
  name: string;
  points: number;
}

export const defaultShopItems: ShopItem[] = [
  { id: "v5", name: "Gutschein 5 €", points: 500 },
  { id: "v10", name: "Gutschein 10 €", points: 1000 },
  { id: "v20", name: "Tankgutschein 20 €", points: 2000 },
  { id: "v40", name: "Sachbezugskarte 40 €", points: 4000 },
  { id: "massage", name: "Massage-Gutschein", points: 3500 },
  { id: "lunch", name: "Team-Mittagessen", points: 2500 },
  { id: "hour", name: "Eine Stunde früher Feierabend", points: 7000 },
  { id: "halfday", name: "Ein halber freier Tag", points: 12000 },
];

const STORAGE_KEY = "tf_demo_shop_items";

export function loadShopItems(): ShopItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultShopItems;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((i) => i && typeof i.name === "string")) return parsed;
  } catch {
    /* Demo-Daten sind optional */
  }
  return defaultShopItems;
}

export function saveShopItems(items: ShopItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** Bestätigungscode, den Mitarbeitende dem Manager schicken. */
export function redemptionCode(itemId: string): string {
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TF-${itemId.slice(0, 4).toUpperCase()}-${rnd}`;
}
