import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CheckCircle2, Gift, LayoutDashboard, Plus, ReceiptText, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFocusText } from "@/i18n/focus";
import { validReward, type ManagerData, type Receipt, type Reward } from "@/lib/focusGame";
import { cn } from "@/lib/utils";
import { errorKey, FocusHeader, PrivacyNote } from "./Shared";

export interface ManagerActions {
  invite: () => Promise<string>;
  saveReward: (reward: Omit<Reward, "id"> & { id?: string }) => Promise<unknown>;
  lookup: (code: string) => Promise<Receipt>;
  fulfill: (code: string) => Promise<Receipt>;
  reset?: () => Promise<unknown>;
  signOut?: () => void;
}
const blank = { title: "", description: "", points: 1000, kind: "voucher" as Reward["kind"], active: true };

export default function ManagerExperience({ data, actions, demo, view = "overview" }: { data: ManagerData; actions: ManagerActions; demo: boolean; view?: string }) {
  const { t, number, date } = useFocusText();
  const base = demo ? "/demo/manager" : "/manager";
  const [editor, setEditor] = useState<(Omit<Reward, "id"> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [checkedCode, setCheckedCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const invite = async () => {
    if (busy) return; setBusy(true);
    try { setInviteCode(await actions.invite()); } catch (error) { toast.error(t(errorKey(error))); } finally { setBusy(false); }
  };
  const tabs = [{ id: "overview", label: t("overview"), icon: LayoutDashboard, to: base }, { id: "rewards", label: t("rewards"), icon: Gift, to: `${base}/rewards` }, { id: "verify", label: t("verify"), icon: ReceiptText, to: `${base}/verify` }];
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!editor || busy) return;
    if (!validReward(editor)) return toast.error(t("invalid_reward"));
    setBusy(true);
    try { await actions.saveReward(editor); setEditor(null); toast.success(t("rewardSaved")); }
    catch (error) { toast.error(t(errorKey(error))); } finally { setBusy(false); }
  };
  const lookup = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy || !code.trim()) return;
    setBusy(true); setReceipt(null); setCheckedCode("");
    const requestedCode = code.trim().toUpperCase();
    try { setReceipt(await actions.lookup(requestedCode)); setCheckedCode(requestedCode); }
    catch (error) { toast.error(t(errorKey(error))); } finally { setBusy(false); }
  };
  const fulfill = async () => {
    if (!receipt || busy || receipt.fulfilled_at || receipt.code !== checkedCode) return;
    setBusy(true);
    try { setReceipt(await actions.fulfill(checkedCode)); }
    catch (error) { toast.error(t(errorKey(error))); } finally { setBusy(false); }
  };
  const visibleTrend = data.trend.filter((p) => p.average !== null);
  const chartMax = Math.max(1, ...visibleTrend.map((p) => p.average!));
  return <div className="min-h-screen break-words bg-background pb-12">
    <FocusHeader demo={demo} manager onSignOut={actions.signOut} onReset={() => actions.reset?.().catch(() => toast.error(t("error")))} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <header className="pt-8 pb-6"><p className="text-sm text-muted-foreground">TeamFokus · {t("manager")}</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">{t(view === "rewards" ? "rewardTitle" : view === "verify" ? "checkTitle" : "teamTrend")}</h1></header>
      <nav aria-label={t("manager")} className="grid grid-cols-3 gap-1 rounded-2xl border bg-card p-1.5 mb-6">{tabs.map((tab) => <NavLink key={tab.id} to={tab.to} end className={cn("flex flex-col sm:flex-row justify-center items-center gap-1.5 py-3 px-1 rounded-xl text-xs sm:text-sm font-medium", view === tab.id ? "text-primary bg-primary/10" : "text-muted-foreground")}><tab.icon className="h-4 w-4" />{tab.label}</NavLink>)}</nav>
      {view === "overview" && <div className="space-y-4">
        <section className="surface-card p-6 flex items-center gap-5"><span className="h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Users className="w-6 h-6" /></span><div><p className="text-4xl font-semibold">{number(data.registered)}</p><h2 className="text-sm text-muted-foreground mt-1">{t("registered")}</h2></div></section>
        <section className="surface-card p-6"><h2 className="font-semibold">{t("average")}</h2>
          <div className="space-y-4 mt-6" aria-label={t("teamTrend")}>{data.trend.map((point) => <div key={point.week} className="flex gap-3 items-center text-sm"><span className="w-16 shrink-0 text-muted-foreground">{date(point.week)}</span><div className="flex-1 h-7 rounded-md bg-secondary overflow-hidden"><div className="h-full bg-primary/75 rounded-md" style={{ width: `${(point.average ?? 0) / chartMax * 100}%` }} /></div><span className="tabular-nums w-10 text-right">{point.average === null ? "—" : number(point.average)}</span></div>)}</div>
          <p className="text-sm text-muted-foreground mt-5">{t("trendNote")}</p>
        </section>
        <PrivacyNote manager />
        <p className="text-xs text-muted-foreground px-1">{t("managerPlay")}</p>
        <details className="surface-card p-5"><summary className="text-sm font-medium cursor-pointer">{t("invite")}</summary><p className="text-sm text-muted-foreground my-3">{t("inviteNote")}</p><Button size="sm" onClick={invite} disabled={busy}>{t(busy ? "saving" : "invite")}</Button>{inviteCode && <Input className="mt-3 font-mono" aria-label={t("invite")} readOnly value={inviteCode} onFocus={(e) => e.target.select()} />}</details>
      </div>}
      {view === "rewards" && <div className="space-y-4">
        <div className="flex justify-end"><Button onClick={() => setEditor({ ...blank })}><Plus className="w-4 h-4 mr-2" />{t("newReward")}</Button></div>
        {data.rewards.map((reward) => <article key={reward.id} className={cn("surface-card p-5 flex flex-wrap items-center justify-between gap-4", !reward.active && "opacity-65")}>
          <div className="flex-1 min-w-0"><h2 className="font-semibold break-words">{reward.title}</h2><p className="text-sm text-muted-foreground mt-1">{reward.description}</p><p className="text-sm text-primary font-medium mt-2">{number(reward.points)} {t("points")}{!reward.active && ` · ${t("inactive")}`}</p></div>
          <Button variant="outline" size="sm" onClick={() => setEditor({ ...reward })}>{t("edit")}</Button>
        </article>)}
        {!data.rewards.length && <p className="surface-card p-6 text-sm text-muted-foreground">{t("noRewards")}</p>}
      </div>}
      {view === "verify" && <div className="space-y-4">
        <section className="surface-card p-6"><p className="text-sm text-muted-foreground mb-5">{t("checkHelp")}</p><form onSubmit={lookup} className="space-y-3"><Label htmlFor="receipt-code">{t("code")}</Label><Input id="receipt-code" value={code} onChange={(e) => { setCode(e.target.value); setReceipt(null); }} required maxLength={80} autoComplete="off" /><Button type="submit" disabled={busy}>{t(busy ? "loading" : "verify")}</Button></form></section>
        {receipt && receipt.code === code.trim().toUpperCase() && <section className="surface-card p-6 space-y-4" data-testid="verified-receipt">
          {demo && <p className="text-xs text-primary font-semibold">{t("receiptDemo")}</p>}
          <h2 className="text-xl font-semibold">{receipt.title}</h2><p className="text-sm text-muted-foreground">{receipt.description}</p>
          <dl className="text-sm grid grid-cols-2 gap-2"><dt className="text-muted-foreground">{t("alias")}</dt><dd>{receipt.alias}</dd><dt className="text-muted-foreground">{t("receiptDate")}</dt><dd>{date(receipt.created_at)}</dd></dl>
          {receipt.fulfilled_at ? <p className="text-primary flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4" />{t("fulfilled")}</p> : <Button disabled={busy} onClick={fulfill}>{t(busy ? "saving" : "giveReward")}</Button>}
        </section>}
      </div>}
    </div>
    <Dialog open={!!editor} onOpenChange={(open) => { if (!open && !busy) setEditor(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto break-words"><DialogHeader><DialogTitle>{t(editor?.id ? "edit" : "newReward")}</DialogTitle><DialogDescription>{t("shopNote")}</DialogDescription></DialogHeader>{editor && <form onSubmit={save} className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="reward-title">{t("rewardName")}</Label><Input id="reward-title" required maxLength={100} value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} /></div>
      <div className="space-y-1.5"><Label htmlFor="reward-description">{t("description")}</Label><Textarea id="reward-description" maxLength={500} value={editor.description} onChange={(e) => setEditor({ ...editor, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="reward-points">{t("price")}</Label><Input id="reward-points" type="number" min={1} max={1000000} step={1} required value={Number.isNaN(editor.points) ? "" : editor.points} onChange={(e) => setEditor({ ...editor, points: e.target.valueAsNumber })} /></div><div className="space-y-1.5"><Label htmlFor="reward-kind">{t("category")}</Label><select id="reward-kind" className="w-full h-10 border rounded-md bg-background px-2 text-sm" value={editor.kind} onChange={(e) => setEditor({ ...editor, kind: e.target.value as Reward["kind"] })}>{["voucher", "wellbeing", "time", "merch"].map((kind) => <option key={kind} value={kind}>{t(kind as Reward["kind"])}</option>)}</select></div></div>
      <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={editor.active} onChange={(e) => setEditor({ ...editor, active: e.target.checked })} />{t("active")}</label>
      <Button disabled={busy} type="submit">{t(busy ? "saving" : "save")}</Button>
    </form>}</DialogContent></Dialog>
  </div>;
}
