/** The only usage measure is active unlocks in a complete 09:00–17:00 workday. */
export const DAILY_TARGET = 8;
export const DAILY_MAX = 200;
export const WEEKLY_MAX = 1000;
export const TOP_LIMIT = 10;
export const MAX_BONUS = 250;

// Continuous exponential curve: every unlock above the target changes the score.
// Keep precision during calculation; round only the final weekly credit.
export function dailyPoints(unlocks: number | null): number {
  if (unlocks === null || !Number.isSafeInteger(unlocks) || unlocks < 0) return 0;
  return DAILY_MAX * 2 ** (-Math.max(0, unlocks - DAILY_TARGET) / 8);
}

export const roundPoints = (points: number) => Math.round((points + Number.EPSILON) * 100) / 100;
export const bonusForRank = (rank: number) =>
  Number.isInteger(rank) && rank >= 1 && rank <= TOP_LIMIT ? roundPoints(MAX_BONUS * 0.8 ** (rank - 1)) : 0;

export interface UnlockDay { date: string; unlocks: number | null; complete: boolean }
export interface Contestant { id: string; alias: string; unlocks: number; ticket: string }
export interface RankedPlayer extends Contestant { rank: number; selected: boolean; bonus: number }
export interface RankingRow { alias: string; rank: number; bonus: number; isMe: boolean }
export interface Reward { id: string; title: string; description: string; points: number; kind: "voucher" | "wellbeing" | "time" | "merch"; active: boolean }
export interface Receipt {
  code: string; alias: string; title: string; description: string; created_at: string; fulfilled_at: string | null;
  // Real codes must be supplied by an authenticated server, never generated here.
  voucher?: { code: string; demo: boolean };
}
export interface EmployeeData {
  alias: string; balance: number; days: UnlockDay[]; previousDays: UnlockDay[];
  ranking: RankingRow[]; rankingWeek: string | null;
  ownRank: { rank: number; selected: boolean; bonus: number } | null;
  rewards: Reward[]; receipts: Receipt[];
}
export interface ManagerData {
  registered: number; trend: { week: string; average: number | null }[]; rewards: Reward[];
}

export function weekPoints(days: UnlockDay[]): number {
  return roundPoints(days.reduce((sum, day) => sum + (day.complete ? dailyPoints(day.unlocks) : 0), 0));
}

/** Dense ranks; at most ten PEOPLE. Tickets are drawn once and persisted per week. */
export function rankPlayers(players: Contestant[]): RankedPlayer[] {
  const seen = new Set<string>();
  const sorted = players.filter((p) => {
    if (seen.has(p.id) || !Number.isSafeInteger(p.unlocks) || p.unlocks < 0 || !p.ticket) return false;
    seen.add(p.id);
    return true;
  }).sort((a, b) => a.unlocks - b.unlocks || a.ticket.localeCompare(b.ticket) || a.id.localeCompare(b.id));
  let rank = 0;
  return sorted.map((p, index) => {
    if (index === 0 || p.unlocks !== sorted[index - 1].unlocks) rank++;
    return { ...p, rank, selected: index < TOP_LIMIT, bonus: index < TOP_LIMIT ? bonusForRank(rank) : 0 };
  });
}

export function validReward(reward: Omit<Reward, "id">): boolean {
  return reward.title.trim().length > 0 && reward.title.trim().length <= 100 &&
    reward.description.length <= 500 && Number.isSafeInteger(reward.points) && reward.points > 0 && reward.points <= 1000000 &&
    ["voucher", "wellbeing", "time", "merch"].includes(reward.kind) && typeof reward.active === "boolean";
}
