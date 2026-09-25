import { useEffect, useState } from "react";
import { Check, Instagram, LockKeyhole, Music2, ShieldCheck, Sparkles, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFocusText } from "@/i18n/focus";
import { FOCUS_APPS, FOCUS_DURATIONS, type FocusApp, type FocusSettings } from "@/lib/focusTools";
import { demoActions } from "./focusStore";
import { cn } from "@/lib/utils";

const icons = { Instagram, TikTok: Music2, YouTube: Youtube };

export default function DemoFocusTools({ settings }: { settings: FocusSettings }) {
  const { t } = useFocusText();
  const [now, setNow] = useState(Date.now);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<FocusApp | null>(null);
  const remaining = Math.max(0, Math.ceil(((settings.until ?? 0) - now) / 1000));
  const running = remaining > 0;
  const blocked = !!preview && running && settings.apps.includes(preview);
  const clock = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  useEffect(() => {
    setNow(Date.now());
    if (!settings.until || settings.until <= Date.now()) return;
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [settings.until, running]);

  const act = async (action: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    try { await action(); setNow(Date.now()); }
    catch { toast.error(t("error")); }
    finally { setBusy(false); }
  };

  return <div className="space-y-5">
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{t("focusOptional")}</p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("focusControl")}</p>
    </div>
    <p className="text-sm text-muted-foreground" role="note">{t("focusDemoNote")}</p>
    <section className="surface-card p-5 sm:p-7">
      <h2 className="font-semibold text-lg">{t("focusChooseApps")}</h2>
      <ul className="divide-y mt-4">{FOCUS_APPS.map((app) => {
        const Icon = icons[app];
        return <li key={app} className="flex gap-3 items-center py-4">
          <div className="w-11 h-11 rounded-2xl bg-secondary border grid place-items-center shrink-0 shadow-sm"><Icon className="h-5 w-5" aria-hidden="true" /></div>
          <div className="min-w-0 flex-1"><label htmlFor={`focus-${app}`} className="font-medium cursor-pointer">{app}</label><button className="block text-xs text-primary underline underline-offset-4 mt-1 py-1 text-left" onClick={() => setPreview(app)}>{t("focusPreview", { app })}</button></div>
          <Switch id={`focus-${app}`} aria-label={t("focusSelectApp", { app })} checked={settings.apps.includes(app)} disabled={busy} onCheckedChange={(selected) => void act(() => demoActions.selectFocusApp(app, selected))} />
        </li>;
      })}</ul>
    </section>
    <section className="surface-card p-5 sm:p-7">
      <fieldset disabled={running || busy}>
        <legend className="font-semibold text-lg">{t("focusDuration")}</legend>
        <div className="grid grid-cols-3 gap-2 mt-4">{FOCUS_DURATIONS.map((minutes) => <label key={minutes} className={cn("relative text-center cursor-pointer rounded-xl border px-2 py-3 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary", settings.minutes === minutes ? "border-primary/40 bg-primary/10 text-primary" : "bg-secondary/30", running && "opacity-60 cursor-default")}>
          <input className="sr-only" type="radio" name="focus-duration" value={minutes} checked={settings.minutes === minutes} onChange={() => void act(() => demoActions.setFocusDuration(minutes))} />{t("focusMinutes", { minutes })}
        </label>)}</div>
      </fieldset>
      <div className="focus-session mt-6" data-running={running}>
        <div className="focus-session-orbit" aria-hidden="true"><Sparkles className="h-6 w-6" /></div>
        <p className="font-medium mt-3" role="status">{t(running ? "focusRunning" : settings.until ? "focusEnded" : "focusReady")}</p>
        <p className="text-5xl sm:text-6xl font-semibold tracking-tight tabular-nums my-4" role="timer" aria-label={t("focusRemaining")} aria-live="off">{running ? clock : settings.until ? "00:00" : `${String(settings.minutes).padStart(2, "0")}:00`}</p>
        <Button className="w-full sm:w-auto h-auto min-h-10 whitespace-normal" disabled={busy || (!running && !settings.apps.length)} onClick={() => void act(running ? demoActions.stopFocus : demoActions.startFocus)}>{t(running ? "focusStop" : "focusStart")}</Button>
        {!settings.apps.length && <p className="text-xs text-muted-foreground mt-3">{t("focusChooseHint")}</p>}
      </div>
    </section>
    <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">{blocked ? <LockKeyhole className="h-7 w-7" /> : <Check className="h-7 w-7" />}</div>
      <DialogHeader><DialogTitle>{t(blocked ? "focusBlocked" : "focusAvailable", { app: preview ?? "" })}</DialogTitle><DialogDescription>{t(blocked ? "focusBlockedBody" : "focusAvailableBody")}</DialogDescription></DialogHeader>
      <p className="text-xs text-muted-foreground">{t("focusDemoNote")}</p>
      <div className="flex flex-wrap gap-2"><Button onClick={() => setPreview(null)}>{t("focusBack")}</Button>{blocked && <Button variant="outline" disabled={busy} onClick={() => void act(demoActions.stopFocus)}>{t("focusStop")}</Button>}</div>
    </DialogContent></Dialog>
  </div>;
}
