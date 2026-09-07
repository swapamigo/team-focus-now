// Mock-Daten für die Demo-Sicht. Gemessen und angezeigt wird die gesammelte Fokuszeit.
// Labels are passed in translated (see MONTH_KEYS / DAY_KEYS consumed via t() in the components).
export const MONTH_KEYS = [
  "demo.data.month.jan", "demo.data.month.feb", "demo.data.month.mar", "demo.data.month.apr",
  "demo.data.month.may", "demo.data.month.jun", "demo.data.month.jul", "demo.data.month.aug",
  "demo.data.month.sep", "demo.data.month.oct", "demo.data.month.nov", "demo.data.month.dec",
];

export const DAY_KEYS = [
  "demo.data.day.mon", "demo.data.day.tue", "demo.data.day.wed", "demo.data.day.thu",
  "demo.data.day.fri", "demo.data.day.sat", "demo.data.day.sun",
];

export function genYear(seed = 0, monthLabels: string[] = MONTH_KEYS) {
  // 12 Monate: Fokuszeit steigt von ~270 min auf ~385 min pro Tag
  const now = new Date();
  return Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const p = i / 11;
    const noise = ((Math.sin((i + seed) * 1.7) + 1) / 2 - 0.5) * 12;
    const avg = Math.round(270 + p * 115 + noise);
    return { label: `${monthLabels[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, avgMinutes: avg };
  });
}

export function genWeek(seed = 0, dayLabels: string[] = DAY_KEYS) {
  return Array.from({ length: 7 }).map((_, i) => {
    const offset = 6 - i;
    const d = new Date(); d.setDate(d.getDate() - offset);
    const base = 360 + (Math.sin((i + seed) * 1.3) + 1) * 14;
    return { label: dayLabels[(d.getDay() + 6) % 7], mins: Math.round(base) };
  });
}

// avgMin = Ø gesammelte Fokusminuten pro Tag (mehr ist besser)
// `name` is kept stable as an internal identifier (used for matching/logic); display the
// translated label via `demoTeamNameKey(id)` + t() in components.
export const demoTeams = [
  { id: "1", name: "Team Alpha", color: "#6366f1", avgMin: 392, members: 9 },
  { id: "2", name: "Team Beta", color: "#8b5cf6", avgMin: 378, members: 8 },
  { id: "3", name: "Team Gamma", color: "#10b981", avgMin: 365, members: 9, isOwn: true },
  { id: "4", name: "Team Delta", color: "#f59e0b", avgMin: 346, members: 9 },
];

/** Translation key for a demo team's display name (falls back to the raw name if unknown). */
export function demoTeamNameKey(id: string): string {
  return `demo.data.team.${id}.name`;
}

export const demoStats = {
  memberCount: 35,
  todayMin: 384,
  yesterdayMin: 362,
  todayPenalty: 14,
  activeChallenge: "Fokus-Woche · Belohnung: Tankgutschein 50 €",
};

// ---------------------------------------------------------------------------
// Gestaffelte Gewinne: nicht linear, aber so, dass Aufsteigen motiviert und
// auch der letzte Platz noch etwas bekommt.
const TIER_CURVE = [1, 0.8, 0.5, 0.24, 0.12, 0.08, 0.04];

export function prizeTiers(topPrize: number, places: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < places; i++) {
    const t = places === 1 ? 0 : (i / (places - 1)) * (TIER_CURVE.length - 1);
    const lo = Math.floor(t), hi = Math.min(TIER_CURVE.length - 1, lo + 1);
    const frac = TIER_CURVE[lo] + (TIER_CURVE[hi] - TIER_CURVE[lo]) * (t - lo);
    out.push(Math.max(2, Math.round(topPrize * frac)));
  }
  return out;
}

/** Ø Handy-Bildschirmzeit pro Person und Tag (Minuten) – sinkt über die Monate. */
export function genScreenTime(seed = 0, monthLabels: string[] = MONTH_KEYS) {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const p = i / 5;
    const noise = ((Math.sin((i + seed) * 2.1) + 1) / 2 - 0.5) * 8;
    return {
      label: `${monthLabels[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      minutes: Math.round(192 - p * 66 + noise),
    };
  });
}

/** Anonyme Anzeigenamen – so sehen Kolleg:innen einander in der App. */
export const demoAnonNames = [
  { alias: "Blauer Falke", teamId: "3", isMe: true },
  { alias: "Stiller Kaktus", teamId: "3" },
  { alias: "Nordlicht", teamId: "3" },
  { alias: "Turbo-Otter", teamId: "1" },
  { alias: "Kaffee-Komet", teamId: "1" },
  { alias: "Leise Welle", teamId: "2" },
  { alias: "Bergfuchs", teamId: "2" },
  { alias: "Sonnendeck", teamId: "4" },
];
