import { useState, type CSSProperties } from "react";
import { Gift, Minus, Plus, Smartphone, Trophy } from "lucide-react";
import { useFocusText } from "@/i18n/focus";
import { bonusForRank, dailyPoints, roundPoints } from "@/lib/focusGame";
import { usePointerDepth } from "@/hooks/usePointerDepth";

export default function EmployeeAppPreview() {
  const { t, number } = useFocusText();
  const [unlocks, setUnlocks] = useState(16);
  const personal = roundPoints(dailyPoints(unlocks) * 5);
  // Illustrative team ranks, not a prediction of an actual company leaderboard.
  const bonus = unlocks < 8 ? bonusForRank(unlocks + 1) : 0;
  const points = roundPoints(personal + bonus);
  const pointer = usePointerDepth();
  return <div {...pointer} className="hero-phone-stage w-full max-w-sm mx-auto">
    <div className="phone-ground" aria-hidden="true" />
    <div className="hero-phone" data-bonus={bonus > 0}>
      <div className="phone-side-buttons" aria-hidden="true" />
      <div className="phone-screen">
        <div className="hero-phone-camera" aria-hidden="true"><i /></div>
        <div className="flex justify-between items-center mb-5"><span className="font-semibold tracking-tight">TeamFokus</span><Smartphone className="h-4 w-4 text-primary" aria-hidden="true" /></div>
        <div className="phone-readout">
          <label htmlFor="preview-unlocks" className="text-xs text-muted-foreground">{t("previewControl")}</label>
          <div className="flex items-center justify-between gap-4 mt-3">
            <p className="text-6xl font-semibold tracking-tight tabular-nums">{unlocks}</p>
            <div className="flex gap-2">
              <button type="button" className="preview-step" aria-label={t("previewLess")} disabled={unlocks === 0} onClick={() => setUnlocks((value) => Math.max(0, value - 1))}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" className="preview-step" aria-label={t("previewMore")} disabled={unlocks === 40} onClick={() => setUnlocks((value) => Math.min(40, value + 1))}><Plus className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
          <input id="preview-unlocks" type="range" min={0} max={40} step={1} value={unlocks} onChange={(e) => setUnlocks(Number(e.target.value))} aria-describedby="preview-context" className="focus-range w-full mt-3" style={{ "--range-fill": `${unlocks / 40 * 100}%` } as CSSProperties} />
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums -mt-1" aria-hidden="true"><span>0</span><span>40</span></div>
        </div>
        <div className="pt-6 pb-4">
          <div className="flex justify-between items-end gap-3 mb-3"><span className="text-xs text-muted-foreground max-w-[65%]">{t("previewTotal")}</span><output key={points} htmlFor="preview-unlocks" aria-live="polite" aria-atomic="true" className="points-feedback text-primary text-xl font-semibold tabular-nums">{number(points)}</output></div>
          <div className="points-track"><div className="points-fill" style={{ width: `${points / 12.5}%` }} /></div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="phone-metric"><span>{t("personalWeek")}</span><strong className="block mt-2 tabular-nums">{number(personal)}</strong></div>
            <div className="phone-metric bonus-metric" data-active={bonus > 0}><span>{t("previewBonus")}</span><strong className="flex gap-1.5 items-center mt-2 tabular-nums"><Trophy className="h-3 w-3" aria-hidden="true" />+{number(bonus)}</strong></div>
          </div>
          <p id="preview-context" className="preview-context text-muted-foreground mt-3">{t("previewRule")} {bonus > 0 ? t("previewRank", { rank: unlocks + 1 }) : t("previewExploreBonus")}</p>
        </div>
        <div className="phone-reward flex items-center gap-3"><div className="reward-token"><Gift className="w-5 h-5" aria-hidden="true" /></div><div><p className="text-sm font-semibold">{number(points / 100)} € · {t("previewValue")}</p><p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t("previewDisclaimer")}</p></div></div>
        <div className="phone-home-indicator" aria-hidden="true" />
      </div>
    </div>
    <p className="text-center text-xs text-muted-foreground mt-8">{t("preview")}</p>
  </div>;
}
