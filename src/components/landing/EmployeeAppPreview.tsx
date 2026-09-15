import { useRef, useState } from "react";
import { Gift, Smartphone } from "lucide-react";
import { useFocusText } from "@/i18n/focus";
import { bonusForRank, dailyPoints, roundPoints } from "@/lib/focusGame";

export default function EmployeeAppPreview() {
  const { t, number } = useFocusText();
  const [unlocks, setUnlocks] = useState(16);
  const personal = roundPoints(dailyPoints(unlocks) * 5);
  // Illustrative team ranks, not a prediction of an actual company leaderboard.
  const bonus = unlocks < 8 ? bonusForRank(unlocks + 1) : 0;
  const points = roundPoints(personal + bonus);
  const phone = useRef<HTMLDivElement>(null);
  function tilt(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    phone.current?.style.setProperty("--phone-x", `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 8}deg`);
    phone.current?.style.setProperty("--phone-y", `${(event.clientX - rect.left - rect.width / 2) / rect.width * 10}deg`);
  }
  function resetTilt() {
    phone.current?.style.removeProperty("--phone-x");
    phone.current?.style.removeProperty("--phone-y");
  }
  return <div className="hero-phone-stage w-full max-w-sm mx-auto" onPointerMove={tilt} onPointerLeave={resetTilt}>
    <div ref={phone} className="hero-phone rounded-[2rem] border border-border/70 bg-card p-5 sm:p-6"><div className="hero-phone-camera" aria-hidden="true" />
      <div className="flex justify-between items-center py-2 mb-4"><span className="font-semibold">TeamFokus</span><Smartphone className="h-5 w-5 text-primary" /></div>
      <div className="rounded-2xl bg-primary/5 p-5"><label htmlFor="preview-unlocks" className="text-sm text-muted-foreground">{t("previewControl")}</label><p className="text-6xl font-semibold tracking-tight mt-3 tabular-nums">{unlocks}</p><input id="preview-unlocks" type="range" min={0} max={40} step={1} value={unlocks} onChange={(e) => setUnlocks(Number(e.target.value))} className="w-full mt-3 h-11 accent-primary" /></div>
      <div className="py-6"><div className="flex justify-between gap-3 text-sm mb-3"><span>{t("previewTotal")}</span><output htmlFor="preview-unlocks" aria-live="polite" className="text-primary font-semibold tabular-nums">{number(points)}</output></div><div className="h-2 rounded-full bg-primary/10 overflow-hidden"><div className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${points / 12.5}%` }} /></div><div className="grid grid-cols-2 gap-2 mt-4 text-xs"><div className="rounded-xl bg-primary/5 p-3">{t("personalWeek")}<strong className="block mt-1 tabular-nums">{number(personal)}</strong></div><div className="rounded-xl bg-violet-500/10 p-3">{t("previewBonus")}<strong className="block mt-1 tabular-nums">+{number(bonus)}</strong></div></div><p className="text-xs text-muted-foreground mt-3 leading-relaxed">{t("previewRule")} {bonus > 0 && t("previewRank", { rank: unlocks + 1 })}</p></div>
      <div className="rounded-2xl bg-primary/5 p-4 flex items-center gap-3"><Gift className="w-5 h-5 text-primary shrink-0" /><div><p className="text-sm font-medium">{number(points / 100)} € · {t("previewValue")}</p><p className="text-xs text-muted-foreground mt-1">{t("previewDisclaimer")}</p></div></div>
    </div><p className="text-center text-xs text-muted-foreground mt-4">{t("preview")}</p>
  </div>;
}
