import { useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFocusText, type FocusKey } from "@/i18n/focus";
import { calculateEmployerRoi, ROI_EXAMPLE, type RoiAssumptions } from "@/lib/employerRoi";
import { useScrollDepth } from "@/hooks/useScrollDepth";

const ranges: { key: keyof RoiAssumptions; label: FocusKey; min: number; max: number; step: number }[] = [
  { key: "employees", label: "roiPeople", min: 5, max: 250, step: 1 },
  { key: "fewerUnlocks", label: "roiUnlocks", min: 0, max: 30, step: 1 },
  { key: "valuePerUnlock", label: "roiValue", min: 0, max: 2, step: 0.05 },
];

const costs: { key: keyof RoiAssumptions; label: FocusKey; max: number; min: number; step: number }[] = [
  { key: "workdays", label: "roiWorkdays", min: 1, max: 31, step: 1 },
  { key: "rewardsPerPerson", label: "roiRewards", min: 0, max: 1000, step: 0.01 },
  { key: "softwarePerPerson", label: "roiSoftware", min: 0, max: 1000, step: 0.01 },
  { key: "otherCosts", label: "roiOther", min: 0, max: 100000, step: 0.01 },
];

export default function EmployerRoiCalculator() {
  const { t, number, lang } = useFocusText();
  const resultScene = useRef<HTMLDivElement>(null);
  useScrollDepth(resultScene);
  const [assumptions, setAssumptions] = useState<RoiAssumptions>({ ...ROI_EXAMPLE });
  // Keep a draft while typing; an empty or invalid field never produces a misleading result.
  const [drafts, setDrafts] = useState<Partial<Record<keyof RoiAssumptions, string>>>({});
  const invalid = costs.some(({ key, min, max, step }) => {
    const value = drafts[key];
    if (value === undefined) return false;
    const parsed = Number(value);
    return value.trim() === "" || !Number.isFinite(parsed) || parsed < min || parsed > max || (step === 1 && !Number.isInteger(parsed));
  });
  const result = invalid ? null : calculateEmployerRoi(assumptions);
  const money = (value: number, signed = false) => new Intl.NumberFormat(lang, {
    style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value);
  const reset = () => { setAssumptions({ ...ROI_EXAMPLE }); setDrafts({}); };
  const ids = [...ranges, ...costs].map(({ key }) => `roi-${key}`).join(" ");
  const ratio = result ? Math.max(result.benefit, result.cost, 1) : 1;

  return <section id="roi" aria-labelledby="roi-title" className="roi-section scroll-mt-28" data-testid="employer-roi">
    <div className="mb-7 sm:mb-9">
      <p className="text-xs font-semibold tracking-[.16em] uppercase text-primary">{t("roiEyebrow")}</p>
      <h2 id="roi-title" className="text-3xl sm:text-4xl font-semibold tracking-tight mt-3">{t("roiTitle")}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-3">{t("roiIntro")}</p>
    </div>
    <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 items-start">
      <div className="min-w-0">
        <div className="roi-mobile-summary lg:hidden" data-positive={result ? result.net >= 0 : undefined} aria-hidden="true">
          <span className="text-xs leading-snug max-w-[60%]">{t("roiResult")}</span>
          <strong className="text-lg tabular-nums text-right leading-snug">{result ? money(result.net, true) : "—"}</strong>
        </div>
        <div className="space-y-6">
          {ranges.map(({ key, label, min, max, step }) => <div key={key}>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor={`roi-${key}`} className="text-sm font-medium leading-snug max-w-[70%]">{t(label)}</label>
              <span className="text-xl font-semibold tabular-nums shrink-0">{key === "valuePerUnlock" ? money(assumptions[key]) : number(assumptions[key])}</span>
            </div>
            <input id={`roi-${key}`} type="range" min={min} max={max} step={step} value={assumptions[key]}
              onChange={(event) => setAssumptions({ ...assumptions, [key]: Number(event.target.value) })}
              aria-describedby={key === "valuePerUnlock" ? "roi-value-help" : undefined}
              aria-valuetext={key === "valuePerUnlock" ? money(assumptions[key]) : undefined}
              className="focus-range w-full mt-1" style={{ "--range-fill": `${(assumptions[key] - min) / (max - min) * 100}%` } as CSSProperties} />
            {key === "valuePerUnlock" && <p id="roi-value-help" className="text-xs text-muted-foreground leading-relaxed">{t("roiValueHelp")}</p>}
          </div>)}
        </div>
        <details className="roi-assumptions mt-6" id="roi-assumptions">
          <summary className="flex items-center justify-between gap-3 cursor-pointer text-sm font-medium py-4">
            <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />{t("roiAssumptions")}</span><ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          </summary>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 pb-4">
            {costs.map(({ key, label, min, max, step }) => <div key={key}>
              <label htmlFor={`roi-${key}`} className="block text-xs font-medium leading-relaxed mb-2">{t(label)}</label>
              <Input id={`roi-${key}`} type="number" min={min} max={max} step={step} inputMode={step === 1 ? "numeric" : "decimal"}
                value={drafts[key] ?? assumptions[key]} className="h-11 rounded-xl bg-card"
                aria-describedby="roi-cost-help" aria-invalid={drafts[key] !== undefined && (drafts[key] === "" || !Number.isFinite(Number(drafts[key])) || Number(drafts[key]) < min || Number(drafts[key]) > max || (step === 1 && !Number.isInteger(Number(drafts[key]))))}
                onChange={(event) => {
                  const value = event.target.value;
                  setDrafts({ ...drafts, [key]: value });
                  setAssumptions({ ...assumptions, [key]: Number(value) });
                }} />
            </div>)}
          </div>
          <p id="roi-cost-help" className="text-xs text-muted-foreground leading-relaxed pb-4">{t("roiCostHelp")}</p>
        </details>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3">{invalid ? t("roiInvalid") : t("roiCostSummary", { days: number(assumptions.workdays), rewards: money(assumptions.rewardsPerPerson), software: money(assumptions.softwarePerPerson), other: money(assumptions.otherCosts) })}</p>
        <Button type="button" variant="ghost" size="sm" className="mt-3 -ml-3 text-xs text-muted-foreground" onClick={reset}><RotateCcw aria-hidden="true" />{t("roiReset")}</Button>
      </div>
      <div ref={resultScene} className="roi-depth-scene"><div className="roi-result" data-positive={result ? result.net >= 0 : undefined}>
        <div className="relative">
          <div className="flex justify-between items-start gap-5"><p id="roi-result-label" className="text-sm leading-relaxed text-white/80 max-w-[75%]">{t("roiResult")}</p><ArrowUpRight className="h-6 w-6 text-white/60 shrink-0" aria-hidden="true" /></div>
          <output htmlFor={ids} aria-labelledby="roi-result-label" aria-live="polite" aria-atomic="true" className="block mt-5" data-testid="roi-net">
            <span className="roi-amount tabular-nums">{result ? money(result.net, true) : "—"}</span><span className="block text-sm text-white/70 mt-2">{t("roiPerMonth")}</span>
          </output>
          <div className="mt-7 space-y-5">
            {[{ label: "roiBenefit" as const, value: result?.benefit, tone: "benefit" }, { label: "roiCosts" as const, value: result?.cost, tone: "cost" }].map(({ label, value, tone }) => <div key={label}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm"><span className="text-white/75">{t(label)}</span><span className="font-medium tabular-nums" data-testid={`roi-${tone}`}>{value === undefined ? "—" : money(value)}</span></div>
              <div className="roi-bar mt-2" aria-hidden="true"><div data-tone={tone} style={{ width: `${(value ?? 0) / ratio * 100}%` }} /></div>
            </div>)}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-5 mt-6"><span className="text-sm text-white/75">{t("roiReturn")}</span><span className="font-semibold text-xl tabular-nums" data-testid="roi-percent">{result?.roi === null || result?.roi === undefined ? "—" : `${new Intl.NumberFormat(lang, { maximumFractionDigits: 1, signDisplay: "exceptZero" }).format(result.roi)} %`}</span></div>
          <p className="text-sm leading-relaxed mt-5 text-white/85" data-testid="roi-break-even">{result ? result.breakEvenUnlocks === null ? t("roiNoBreakEven") : result.cost === 0 ? t("roiNoCosts") : t("roiBreakEven", { count: number(Math.ceil(result.breakEvenUnlocks)) }) : t("roiInvalid")}</p>
        </div>
      </div></div>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed mt-6" id="roi-scope">{t("roiScope")}</p>
    <details className="roi-method mt-3">
      <summary className="cursor-pointer text-xs font-medium inline-flex items-center gap-2">{t("roiMethod")}<ArrowDown className="h-3 w-3" aria-hidden="true" /></summary>
      <p className="text-xs text-muted-foreground leading-relaxed mt-3 max-w-3xl">{t("roiFormula")}</p>
    </details>
  </section>;
}
