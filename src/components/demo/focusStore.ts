import { useEffect, useState } from "react";
import { z } from "zod";
import { rankPlayers, validReward, weekPoints, roundPoints, type EmployeeData, type ManagerData, type Receipt, type Reward } from "@/lib/focusGame";

const KEY = "teamfokus-demo-v3";
const CHANGED = "teamfokus-demo-changed";
const rewardSchema = z.object({ id: z.string(), title: z.string().min(1).max(100), description: z.string().max(500), points: z.number().int().positive().max(1000000), kind: z.enum(["voucher", "wellbeing", "time"]), active: z.boolean() });
const receiptSchema = z.object({ code: z.string(), alias: z.string(), title: z.string(), description: z.string(), created_at: z.string(), fulfilled_at: z.string().nullable(), requestId: z.string() });
const schema = z.object({ unlocks: z.number().int().min(0).max(40).default(8), roundSettled: z.boolean().default(false), alias: z.string().min(1).max(30), balance: z.number().finite().nonnegative(), rewards: z.array(rewardSchema), receipts: z.array(receiptSchema) });
type State = { unlocks: number; roundSettled: boolean; alias: string; balance: number; rewards: Reward[]; receipts: (Receipt & { requestId: string })[] };

function initial(): State {
  return { unlocks: 8, roundSettled: false, alias: "Blauer Falke", balance: 1600, receipts: [], rewards: [
    { id: "amazon", title: "Amazon-Gutschein · 10 €", description: "Ein kleiner Wunsch, erfüllt.", points: 1000, kind: "voucher", active: true },
    { id: "massage", title: "Massage-Gutschein · 20 €", description: "Eine Pause nur für dich.", points: 2000, kind: "wellbeing", active: true },
    { id: "time", title: "2 Stunden früher Feierabend", description: "Termin mit deinem Manager vereinbaren.", points: 3000, kind: "time", active: true },
  ] };
}

function localizedReward(reward: Reward): Reward {
  const lang = document.documentElement.lang;
  const defaults = initial().rewards.find((r) => r.id === reward.id);
  const titles = lang === "en" ? ["Amazon voucher · €10", "Massage voucher · €20", "Leave work 2 hours early"] : lang === "es" ? ["Vale de Amazon · 10 €", "Vale de masaje · 20 €", "Salir del trabajo 2 horas antes"] : null;
  const descriptions = lang === "en" ? ["A little wish, fulfilled.", "A break just for you.", "Arrange the date with your manager."] : lang === "es" ? ["Un pequeño deseo cumplido.", "Un descanso solo para ti.", "Acuerda la fecha con tu responsable."] : null;
  const index = ["amazon", "massage", "time"].indexOf(reward.id);
  if (!defaults || !titles || !descriptions || index < 0) return reward;
  return { ...reward, title: reward.title === defaults.title ? titles[index] : reward.title, description: reward.description === defaults.description ? descriptions[index] : reward.description };
}

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? schema.safeParse(JSON.parse(raw)) : null;
    if (parsed?.success) return parsed.data as State;
  } catch { /* A demo can start again if its optional browser storage is invalid. */ }
  return initial();
}

let pending: Promise<unknown> = Promise.resolve();
async function change<T>(mutate: (state: State) => T): Promise<T> {
  const run = () => {
    const state = read();
    const result = mutate(state);
    // Publish only after a successful save; storage errors must not look like purchases.
    localStorage.setItem(KEY, JSON.stringify(schema.parse(state)));
    window.dispatchEvent(new Event(CHANGED));
    return result;
  };
  if (navigator.locks) return navigator.locks.request(KEY, run);
  const next = pending.then(run, run);
  pending = next.catch(() => undefined);
  return next;
}

export function useDemoState() {
  const [state, setState] = useState(read);
  useEffect(() => {
    const reload = () => setState(read());
    window.addEventListener(CHANGED, reload);
    window.addEventListener("storage", reload);
    return () => { window.removeEventListener(CHANGED, reload); window.removeEventListener("storage", reload); };
  }, []);
  return state;
}

export function demoEmployee(state: State): EmployeeData {
  const players = [20, 20, 34, 42, 48, 46 + state.unlocks, 58, 64, 64, 72, 72, 100].map((unlocks, i) => ({
    id: String(i), alias: i === 5 ? state.alias : ["Nordlicht", "Blaufuchs", "Kolibri", "Bergwind", "Goldfisch", "", "Sternstaub", "Leise Welle", "Waldkauz", "Silbermond", "Sonnenstrahl", "Kiesel"][i],
    unlocks, ticket: String(i).padStart(2, "0"), // Fixed example draw; real rounds use server-generated tickets.
  }));
  const ranked = rankPlayers(players);
  const own = ranked.find((p) => p.id === "5")!;
  return { alias: state.alias, balance: state.balance, rewards: state.rewards.filter((r) => r.active).map(localizedReward), receipts: state.receipts,
    days: [16, 12, 10, 8, state.unlocks].map((unlocks, i) => ({ date: `2026-09-${String(7 + i).padStart(2, "0")}`, unlocks, complete: true })),
    previousDays: [28, 24, 20, 18, 16].map((unlocks, i) => ({ date: i === 0 ? "2026-08-31" : `2026-09-0${i}`, unlocks, complete: true })),
    ranking: ranked.filter((p) => p.selected).map((p) => ({ alias: p.alias, rank: p.rank, bonus: p.bonus, isMe: p.id === "5" })),
    rankingWeek: "2026-09-07", ownRank: { rank: own.rank, selected: own.selected, bonus: own.bonus },
  };
}

export function demoManager(state: State): ManagerData {
  return { registered: 24, rewards: state.rewards.map(localizedReward), trend: [
    { week: "2026-08-03", average: 27.4 }, { week: "2026-08-10", average: 25.1 },
    { week: "2026-08-17", average: 23.6 }, { week: "2026-08-24", average: 20.5 },
    { week: "2026-08-31", average: 18.9 }, { week: "2026-09-07", average: 16.8 },
  ] };
}

export const demoActions = {
  setUnlocks: (unlocks: number) => change((s) => { if (!s.roundSettled) s.unlocks = z.number().int().min(0).max(40).parse(unlocks); }),
  settleWeek: () => change((s) => {
    if (s.roundSettled) return;
    const week = demoEmployee(s);
    s.balance = roundPoints(s.balance + weekPoints(week.days) + (week.ownRank?.bonus ?? 0));
    s.roundSettled = true;
  }),
  invite: async () => "DEMO-CODE",
  redeem: (id: string, expectedPrice: number, requestId: string): Promise<Receipt> => change((s) => {
    const previous = s.receipts.find((r) => r.requestId === requestId);
    if (previous) return previous;
    const reward = s.rewards.find((r) => r.id === id && r.active);
    if (!reward || reward.points !== expectedPrice) throw new Error("reward_changed");
    if (s.balance < reward.points) throw new Error("insufficient_points");
    const shown = localizedReward(reward);
    const receipt = { code: `TF-DEMO-${crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`, alias: s.alias, title: shown.title, description: shown.description, created_at: new Date().toISOString(), fulfilled_at: null, requestId };
    s.balance -= reward.points;
    s.receipts.unshift(receipt);
    return receipt;
  }),
  saveReward: (reward: Omit<Reward, "id"> & { id?: string }) => change((s) => {
    if (!validReward(reward)) throw new Error("invalid_reward");
    const value = { ...reward, title: reward.title.trim(), id: reward.id || crypto.randomUUID() } as Reward;
    const index = s.rewards.findIndex((r) => r.id === value.id);
    if (index < 0) s.rewards.push(value); else s.rewards[index] = value;
  }),
  lookup: async (code: string): Promise<Receipt> => {
    const receipt = read().receipts.find((r) => r.code === code.trim().toUpperCase());
    if (!receipt) throw new Error("receipt_not_found");
    const { requestId: _, ...safe } = receipt;
    return safe;
  },
  fulfill: (code: string): Promise<Receipt> => change((s) => {
    const receipt = s.receipts.find((r) => r.code === code.trim().toUpperCase());
    if (!receipt) throw new Error("receipt_not_found");
    if (!receipt.fulfilled_at) receipt.fulfilled_at = new Date().toISOString();
    return receipt;
  }),
  alias: (alias: string) => change((s) => { s.alias = z.string().trim().min(1).max(30).parse(alias); }),
  reset: () => change((s) => { Object.assign(s, initial()); }),
};
