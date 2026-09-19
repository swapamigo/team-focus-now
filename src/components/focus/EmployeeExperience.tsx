import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowDownRight, ChartNoAxesCombined, Check, Gift, Home, Leaf, Pencil, Shirt, Smartphone, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFocusText } from "@/i18n/focus";
import { dailyPoints, weekPoints, type EmployeeData, type Receipt, type Reward } from "@/lib/focusGame";
import { errorKey, FocusHeader, PrivacyNote, ReceiptView } from "./Shared";
import { cn } from "@/lib/utils";

export interface EmployeeActions {
  setUnlocks?: (value: number) => Promise<unknown>;
  settleWeek?: () => Promise<unknown>;
  redeem: (id: string, expectedPrice: number, requestId: string) => Promise<Receipt>;
  alias: (alias: string) => Promise<unknown>;
  reset?: () => Promise<unknown>;
  signOut?: () => void;
}

export default function EmployeeExperience({ data, actions, demo, view = "today", demoRound }: { data: EmployeeData; actions: EmployeeActions; demo: boolean; view?: string; demoRound?: { unlocks: number; settled: boolean } }) {
  const { t, number, date } = useFocusText();
  const base = demo ? "/demo/employee" : "/app";
  const [selected, setSelected] = useState<{ reward: Reward; requestId: string } | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [busy, setBusy] = useState(false);
  const [aliasOpen, setAliasOpen] = useState(false);
  const [alias, setAlias] = useState(data.alias);
  const completed = data.days.filter((d) => d.complete && d.unlocks !== null);
  const previous = data.previousDays.filter((d) => d.complete && d.unlocks !== null);
  const current = demo ? data.days[data.days.length - 1] : data.days.find((d) => d.date === new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date()));
  const average = completed.length ? completed.reduce((sum, d) => sum + d.unlocks!, 0) / completed.length : null;
  const previousAverage = previous.length ? previous.reduce((sum, d) => sum + d.unlocks!, 0) / previous.length : null;
  const fullComparison = completed.length === 5 && previous.length === 5;
  const improvement = fullComparison && previousAverage! > 0 ? (previousAverage! - average!) / previousAverage! * 100 : null;
  const personal = weekPoints(data.days);
  const tabs = [
    { id: "today", to: base, icon: Home, label: t("today") },
    { id: "progress", to: `${base}/progress`, icon: ChartNoAxesCombined, label: t("progress") },
    { id: "ranking", to: `${base}/ranking`, icon: Trophy, label: t("ranking") },
    { id: "shop", to: `${base}/shop`, icon: Gift, label: t("shop") },
  ];
  const purchase = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try { const result = await actions.redeem(selected.reward.id, selected.reward.points, selected.requestId); setSelected(null); setReceipt(result); }
    catch (error) { toast.error(t(errorKey(error))); }
    finally { setBusy(false); }
  };
  const saveAlias = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy || !alias.trim()) return; setBusy(true);
    try { await actions.alias(alias.trim()); setAliasOpen(false); }
    catch (error) { toast.error(t(errorKey(error))); } finally { setBusy(false); }
  };

  return <div className="min-h-screen break-words bg-background pb-24 sm:pb-12">
    <FocusHeader demo={demo} onSignOut={actions.signOut} onReset={() => actions.reset?.().catch(() => toast.error(t("error")))} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <header className="pt-7 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><p>{t("greeting", { alias: data.alias })}</p><button aria-label={t("editAlias")} onClick={() => { setAlias(data.alias); setAliasOpen(true); }}><Pencil className="w-3.5 h-3.5" /></button></div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">{t(view === "shop" ? "shopTitle" : view === "ranking" ? "rankTitle" : view === "progress" ? "progressTitle" : "todayTitle")}</h1>
      </header>
      <nav aria-label={t("employee")} className="fixed bottom-0 inset-x-0 z-40 border-t bg-card/95 backdrop-blur sm:static sm:border sm:rounded-2xl sm:mb-6 safe-bottom">
        <div className="grid grid-cols-4 max-w-3xl mx-auto p-1.5 gap-1">{tabs.map((tab) => <NavLink key={tab.id} to={tab.to} end className={cn("flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 py-3 rounded-xl text-[11px] sm:text-sm font-medium", view === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground")}><tab.icon className="h-4 w-4" />{tab.label}</NavLink>)}</div>
      </nav>

      {view === "today" && <div className="space-y-4">
        <section className="surface-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary/5" />
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Smartphone className="h-4 w-4" />{t("unlocks")}</p>
          <p className="text-7xl font-semibold tracking-tight mt-4 tabular-nums">{current?.unlocks ?? "—"}</p>
          <p className="text-sm text-muted-foreground mt-3">{t(demo ? "lastDay" : "workHours")}</p>
          <p className="mt-5 text-sm font-medium flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-primary" />{t("goal")}</p>
          {current?.complete && current.unlocks !== null && current.unlocks <= 8 && <p className="text-sm text-primary mt-2 flex items-center gap-1"><Check className="h-4 w-4" />{t("targetMet")}</p>}
          {current?.unlocks != null && !current.complete && <p className="text-xs mt-2 text-muted-foreground">{t("pending")}</p>}
          {current?.unlocks == null && <p className="text-sm text-muted-foreground mt-4">{t("noDataBody")}</p>}
        </section>
        <section className="surface-card p-6">
          <div className="flex flex-wrap justify-between gap-2 mb-3"><h2 className="font-semibold">{t("personalWeek")}</h2><span className="text-primary text-sm font-medium">{t("weeklyGoal", { points: number(personal) })}</span></div>
          <div className="h-2.5 rounded-full bg-primary/10 overflow-hidden" role="progressbar" aria-valuenow={personal} aria-valuemin={0} aria-valuemax={1000} aria-label={t("personalWeek")}><div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, personal / 10)}%` }} /></div>
          <p className="text-sm text-muted-foreground mt-3">{t("weeklyRule")}</p>
        </section>
        {demo && demoRound && <details className="surface-card p-5"><summary className="font-medium cursor-pointer">{t("simulate")}</summary><div className="space-y-4 mt-4"><label htmlFor="demo-unlocks" className="text-sm block">{t("simulateDay")}: <strong>{demoRound.unlocks}</strong></label><input id="demo-unlocks" type="range" min={0} max={40} step={1} value={demoRound.unlocks} disabled={demoRound.settled || busy} className="w-full h-11 accent-primary" onChange={(e) => { void actions.setUnlocks?.(Number(e.target.value)).catch(() => toast.error(t("error"))); }} /><p className="text-sm text-primary" aria-live="polite">{t("weekCredit", { points: number(personal + (data.ownRank?.bonus ?? 0)) })}</p>{demoRound.settled ? <p role="status" className="text-sm">{t("weekSettled")}</p> : <Button disabled={busy} onClick={async () => { setBusy(true); try { await actions.settleWeek?.(); } catch { toast.error(t("error")); } finally { setBusy(false); } }}>{t("settleWeek")}</Button>}</div></details>}
        <section className="rounded-2xl gradient-primary text-white p-6 flex flex-wrap justify-between items-center gap-4">
          <div><p className="text-sm text-white/85">{t("balance")}</p><p className="text-3xl font-semibold mt-1">{number(data.balance)} <span className="text-base font-normal">{t("points")}</span></p></div>
          <Button asChild variant="secondary"><NavLink to={`${base}/shop`}>{t("openShop")}</NavLink></Button>
        </section>
        <PrivacyNote />
      </div>}

      {view === "progress" && <div className="space-y-4">
        {improvement !== null && improvement > 0 && <div className="rounded-2xl bg-primary/5 p-5 text-primary flex items-center gap-2 font-medium"><ArrowDownRight className="w-5 h-5" />{t("fewer", { percent: number(Math.round(improvement)) })}</div>}
        {!fullComparison && <p className="text-sm text-muted-foreground">{t("comparisonPending")}</p>}
        <section className="surface-card p-6">
          <h2 className="font-semibold">{t("weekChart")}</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-6">{t("unlocks")}</p>
          <div className="grid grid-cols-5 gap-3 items-end">{data.days.map((day, i) => {
            const old = data.previousDays[i]; const max = Math.max(8, ...data.days.map((d) => d.unlocks ?? 0), ...data.previousDays.map((d) => d.unlocks ?? 0));
            return <div key={day.date} className="text-center min-w-0"><div className="h-36 flex items-end justify-center gap-1.5">
              <div title={`${t("previousWeek")}: ${old?.unlocks ?? "—"}`} className="bg-primary/20 rounded-t-lg w-5 sm:w-8 min-h-0" style={{ height: `${(old?.unlocks ?? 0) / max * 100}%` }} />
              <div title={`${t("week")}: ${day.unlocks ?? "—"}`} className="bg-primary rounded-t-lg w-5 sm:w-8 min-h-0" style={{ height: `${(day.unlocks ?? 0) / max * 100}%` }} />
            </div><p className="text-sm font-medium mt-3">{date(day.date, true)}</p><p className="text-xs text-muted-foreground mt-1">{old?.unlocks ?? "—"} / {day.unlocks ?? "—"}</p></div>;
          })}</div>
          <div className="flex justify-center gap-5 mt-5 text-xs text-muted-foreground"><span>◼ {t("previousWeek")}</span><span className="text-primary">◼ {t("week")}</span></div>
        </section>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="surface-card p-5"><p className="text-sm text-muted-foreground">{t("average")}</p><p className="text-3xl font-semibold mt-2">{average === null ? "—" : number(average)}</p></div>
          <div className="surface-card p-5"><p className="text-sm text-muted-foreground">{t("personalBest")}</p><p className="text-3xl font-semibold mt-2">{completed.length + previous.length ? Math.min(...[...completed, ...previous].map((d) => d.unlocks!)) : "—"}</p></div>
        </div>
        <details className="surface-card p-5"><summary className="font-medium cursor-pointer">{t("rules")}</summary><p className="text-sm text-muted-foreground mt-3">{t("curveRule")}</p>
          <div className="max-h-60 overflow-y-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-left"><th className="py-2">{t("unlocks")}</th><th className="text-right">{t("points")}</th></tr></thead><tbody>{Array.from({ length: 33 }, (_, i) => i + 8).map((n) => <tr key={n} className="border-t"><td className="py-2">{n === 8 ? "≤ 8" : n}</td><td className="text-right tabular-nums">{number(dailyPoints(n))}</td></tr>)}</tbody></table></div>
        </details>
      </div>}

      {view === "ranking" && <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{t("rankIntro")}</p>
        {data.rankingWeek && <p className="text-sm text-muted-foreground">{t("rankingPeriod", { date: date(data.rankingWeek) })}</p>}
        {data.ownRank && <div className="surface-card p-6 grid grid-cols-2 gap-3"><div><p className="text-sm text-muted-foreground">{t("yourRank")}</p><p className="text-3xl font-semibold mt-1">{data.ownRank.rank}.</p></div><div><p className="text-sm text-muted-foreground">{t("bonus")}</p><p className="text-3xl font-semibold mt-1">+{number(data.ownRank.bonus)}</p></div></div>}
        {data.ownRank && !data.ownRank.selected && <p className="text-sm text-muted-foreground">{t("notSelected")}</p>}
        <section className="surface-card p-2 sm:p-4">
          {data.ranking.length ? <ol className="space-y-1">{data.ranking.map((row, i) => <li key={`${row.alias}-${i}`} className={cn("flex items-center gap-4 rounded-xl p-4", row.isMe ? "bg-primary/10" : "bg-secondary/40")}>
            <span className="text-lg font-semibold text-primary w-7 tabular-nums">{row.rank}.</span><span className="font-medium flex-1 min-w-0">{row.alias} {row.isMe && <span className="text-xs text-primary">· {t("you")}</span>}</span>{row.rank === 1 && <Trophy className="w-5 h-5 text-primary" />}
          </li>)}</ol> : <p className="p-4 text-sm text-muted-foreground">{t("rankingEmpty")}</p>}
        </section>
        <details className="surface-card p-5"><summary className="cursor-pointer font-medium">{t("rules")}</summary><p className="text-sm text-muted-foreground mt-3 leading-relaxed">{t("rankRules")}</p></details>
      </div>}

      {view === "shop" && <div className="space-y-6">
        <section className="rounded-2xl bg-primary/5 border border-primary/10 p-6"><p className="text-sm text-muted-foreground">{t("balance")}</p><p className="text-4xl font-semibold text-primary mt-2" data-testid="balance">{number(data.balance)} <span className="text-lg">{t("points")}</span></p><p className="text-sm mt-2 text-muted-foreground">{t("neverExpire")}</p></section>
        <p className="text-sm text-muted-foreground">{t("shopNote")}</p>
        <div className="grid sm:grid-cols-2 gap-4">{data.rewards.map((reward) => {
          const Icon = reward.kind === "time" ? Home : reward.kind === "wellbeing" ? Leaf : reward.kind === "merch" ? Shirt : Gift;
          return <article key={reward.id} className="surface-card p-6 flex flex-col" data-testid="shop-reward"><div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5"><Icon className="w-6 h-6" /></div><h2 className="font-semibold text-lg">{reward.title}</h2><p className="text-sm text-muted-foreground mt-2 mb-5 flex-1">{reward.description}</p><p className="font-semibold mb-3">{number(reward.points)} {t("points")}</p><Button disabled={data.balance < reward.points} onClick={() => setSelected({ reward, requestId: crypto.randomUUID() })}>{data.balance < reward.points ? t("missing", { points: number(reward.points - data.balance) }) : t("redeem")}</Button></article>;
        })}</div>
        {!data.rewards.length && <p className="surface-card p-6 text-sm text-muted-foreground">{t("noRewards")}</p>}
        {data.receipts.length > 0 && <section><h2 className="font-semibold mb-3">{t("receipts")}</h2><ul className="space-y-2">{data.receipts.map((r) => <li key={r.code}><button className="surface-card p-4 w-full text-left flex justify-between gap-3" onClick={() => setReceipt(r)}><span><span className="block font-medium">{r.title}</span><span className="text-xs text-muted-foreground">{date(r.created_at)}</span></span><span className="text-xs text-primary shrink-0">{t(r.fulfilled_at ? "fulfilled" : "issued")}</span></button></li>)}</ul></section>}
      </div>}
    </div>
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open && !busy) setSelected(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto break-words"><DialogHeader><DialogTitle>{t("confirmPurchase")}</DialogTitle><DialogDescription>{selected?.reward.title}</DialogDescription></DialogHeader><p className="text-2xl font-semibold">{number(selected?.reward.points ?? 0)} {t("points")}</p><p className="text-sm text-muted-foreground">{t("remaining", { points: number(Math.max(0, data.balance - (selected?.reward.points ?? 0))) })}</p><div className="flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={() => setSelected(null)}>{t("cancel")}</Button><Button disabled={busy} onClick={purchase}>{t(busy ? "saving" : "confirm")}</Button></div></DialogContent></Dialog>
    <Dialog open={!!receipt} onOpenChange={(open) => { if (!open) setReceipt(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto break-words"><DialogHeader><DialogTitle>{t("receiptTitle")}</DialogTitle><DialogDescription>{receipt?.title}</DialogDescription></DialogHeader>{receipt && <ReceiptView receipt={receipt} demo={demo} />}</DialogContent></Dialog>
    <Dialog open={aliasOpen} onOpenChange={setAliasOpen}><DialogContent className="max-h-[90dvh] overflow-y-auto break-words"><DialogHeader><DialogTitle>{t("editAlias")}</DialogTitle><DialogDescription>{t("privacyShort")}</DialogDescription></DialogHeader><form onSubmit={saveAlias} className="space-y-4"><Label htmlFor="focus-alias">{t("alias")}</Label><Input id="focus-alias" required maxLength={30} value={alias} onChange={(e) => setAlias(e.target.value)} /><Button type="submit" disabled={busy}>{t(busy ? "saving" : "save")}</Button></form></DialogContent></Dialog>
  </div>;
}
