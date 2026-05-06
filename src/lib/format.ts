// Formatierungs-Utilities (Deutsch)

export function formatMinutes(mins: number): string {
  const m = Math.max(0, Math.round(mins));
  if (m < 60) return `${m} Min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} Std` : `${h} Std ${r} Min`;
}

export function formatDateDE(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}

export function formatWeekdayShort(d: Date): string {
  return d.toLocaleDateString("de-DE", { weekday: "short" });
}

export function lastNDates(n: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d);
  }
  return out;
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function rankSuffix(n: number): string {
  return `${n}.`;
}
