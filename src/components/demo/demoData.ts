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
