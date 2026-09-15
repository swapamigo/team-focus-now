import { useState } from "react";
import { Gift, Smartphone } from "lucide-react";
import { useFocusText } from "@/i18n/focus";
import { dailyPoints, roundPoints } from "@/lib/focusGame";

export default function EmployeeAppPreview() {
  const { t, number } = useFocusText();
  const [unlocks, setUnlocks] = useState(16);
  const points = roundPoints(dailyPoints(unlocks) * 5);
  return <div className="w-full max-w-sm mx-auto">
    <div className="rounded-[2rem] border border-border/70 bg-card p-5 sm:p-6 shadow-xl shadow-primary/10">
      <div className="flex justify-between items-center py-2 mb-4"><span className="font-semibold">TeamFokus</span><Smartphone className="h-5 w-5 text-primary" /></div>
      <div className="rounded-2xl bg-primary/5 p-5"><label htmlFor="preview-unlocks" className="text-sm text-muted-foreground">{t("previewControl")}</label><p className="text-6xl font-semibold tracking-tight mt-3 tabular-nums">{unlocks}</p><input id="preview-unlocks" type="range" min={0} max={40} step={1} value={unlocks} onChange={(e) => setUnlocks(Number(e.target.value))} className="w-full mt-3 h-11 accent-primary" /></div>
      <div className="py-6"><div className="flex justify-between gap-3 text-sm mb-3"><span>{t("personalWeek")}</span><output htmlFor="preview-unlocks" aria-live="polite" className="text-primary font-semibold tabular-nums">{number(points)}</output></div><div className="h-2 rounded-full bg-primary/10 overflow-hidden"><div className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${points / 10}%` }} /></div><p className="text-xs text-muted-foreground mt-3 leading-relaxed">{t("previewRule")}</p></div>
      <div className="rounded-2xl bg-primary/5 p-4 flex items-center gap-3"><Gift className="w-5 h-5 text-primary shrink-0" /><div><p className="text-sm font-medium">{t("voucher")} · 10 €</p><p className="text-xs text-muted-foreground mt-1">{points >= 1000 ? t("targetMet") : t("missing", { points: number(1000 - points) })}</p></div></div>
    </div><p className="text-center text-xs text-muted-foreground mt-4">{t("preview")}</p>
  </div>;
}
