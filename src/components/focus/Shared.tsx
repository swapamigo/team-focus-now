import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Download, LogOut, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useFocusText, type FocusKey } from "@/i18n/focus";
import type { Receipt } from "@/lib/focusGame";

export function errorKey(error: unknown): FocusKey {
  const message = error instanceof Error ? error.message : "";
  return (["receipt_not_found", "insufficient_points", "reward_changed", "invalid_reward"] as const).find((key) => message.includes(key)) ?? "error";
}

export function FocusHeader({ demo, manager = false, onReset, onSignOut }: { demo: boolean; manager?: boolean; onReset?: () => void; onSignOut?: () => void }) {
  const { t } = useFocusText();
  return <>
    {demo && <div className="bg-primary text-primary-foreground text-center px-4 py-2 text-xs font-medium">{t("demoLabel")}</div>}
    <header className="border-b border-border/60 bg-card/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" aria-label="TeamFokus"><Logo withWordmark /></Link>
        <div className="flex items-center gap-2 flex-wrap">
          <LanguageSwitcher compact />
          {demo ? <Button asChild variant="outline" size="sm"><Link to={manager ? "/demo/employee" : "/demo/manager"}>{t(manager ? "employee" : "manager")}</Link></Button> :
            <Button variant="ghost" size="sm" onClick={onSignOut}><LogOut className="h-4 w-4 mr-1" />{t("signOut")}</Button>}
        </div>
      </div>
    </header>
    {demo && <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
      <span>{t("demoNote")}</span><button className="underline underline-offset-4" onClick={() => { if (window.confirm(t("resetQuestion"))) onReset?.(); }}>{t("reset")}</button>
    </div>}
  </>;
}

export function PrivacyNote({ manager = false }: { manager?: boolean }) {
  const { t } = useFocusText();
  return <div className="rounded-2xl bg-primary/5 p-4 flex gap-3 text-sm text-muted-foreground">
    <ShieldCheck className="h-5 w-5 text-primary shrink-0" /><p>{t(manager ? "managerPrivate" : "privacyShort")}</p>
  </div>;
}

export function ReceiptView({ receipt, demo }: { receipt: Receipt; demo: boolean }) {
  const { t, date } = useFocusText();
  const content = [demo ? t("receiptDemo") : "TeamFokus", t("receiptTitle"), receipt.title, receipt.description, `${t("alias")}: ${receipt.alias}`, `${t("code")}: ${receipt.code}`, `${t("receiptDate")}: ${date(receipt.created_at)}`, receipt.fulfilled_at ? t("fulfilled") : t("issued")].filter(Boolean).join("\n");
  const copy = async () => { try { await navigator.clipboard.writeText(content); toast.success(t("copied")); } catch { toast.error(t("error")); } };
  const share = async () => {
    if (!navigator.share) return copy();
    try { await navigator.share({ title: t("receiptTitle"), text: content }); }
    catch (error) { if (!(error instanceof Error && error.name === "AbortError")) toast.error(t("error")); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `${receipt.code}.txt`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="space-y-4" data-testid="receipt">
    <p className="text-sm text-muted-foreground">{t("receiptHelp")}</p>
    <textarea aria-label={t("receiptTitle")} readOnly value={content} rows={9} className="w-full rounded-xl border border-border p-4 bg-secondary/30 text-sm resize-none" />
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={share}><Share2 className="h-4 w-4 mr-2" />{t("share")}</Button>
      <Button size="sm" variant="outline" onClick={copy}><Copy className="h-4 w-4 mr-2" />{t("copy")}</Button>
      <Button size="sm" variant="outline" onClick={download}><Download className="h-4 w-4 mr-2" />{t("download")}</Button>
    </div>
  </div>;
}

export function LoadState({ error, retry, notReady = false }: { error: boolean; retry: () => void; notReady?: boolean }) {
  const { t } = useFocusText();
  return <main className="min-h-screen grid place-items-center p-6"><div className="text-center space-y-4 max-w-sm">
    {notReady ? <><h1 className="text-2xl font-semibold">{t("setupTitle")}</h1><p>{t("setupBody")}</p><Button asChild><Link to="/demo/employee">{t("demo")}</Link></Button></> : <p role={error ? "alert" : "status"}>{t(error ? "unavailable" : "loading")}</p>}
    {error && <Button onClick={retry}>{t("retry")}</Button>}
    <div><Link className="text-sm text-primary inline-flex items-center gap-1" to="/"><ArrowLeft className="h-4 w-4" />{t("home")}</Link></div>
  </div></main>;
}
