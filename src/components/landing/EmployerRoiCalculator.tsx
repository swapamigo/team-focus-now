import { useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFocusText, type FocusKey } from "@/i18n/focus";
import { calculateEmployerRoi, ROI_EXAMPLE, ROI_WORKDAYS, type RoiAssumptions } from "@/lib/employerRoi";
import { useScrollDepth } from "@/hooks/useScrollDepth";

type Field = keyof RoiAssumptions;
const fields: Record<Field, { label: FocusKey; min: number; max: number; step: number }> = {
  employees: { label: "roiPeople", min: 5, max: 1000, step: 1 },
  currentUnlocks: { label: "roiCurrent", min: 0, max: 150, step: 1 },
  targetUnlocks: { label: "roiTarget", min: 0, max: 150, step: 1 },
  valuePerUnlock: { label: "roiValue", min: 0, max: 10, step: 0.01 },
  rewardsPerPerson: { label: "roiRewards", min: 0, max: 50, step: 0.01 },
  softwarePerPerson: { label: "roiSoftware", min: 0, max: 1000, step: 0.01 },
};
const validValue = (key: Field, value: string) => {
  const { min, max, step } = fields[key];
  const parsed = Number(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max && (step !== 1 || Number.isInteger(parsed));
};

export default function EmployerRoiCalculator() {
  const { t, number, lang } = useFocusText();
  const resultScene = useRef<HTMLDivElement>(null);
  useScrollDepth(resultScene);
  const [assumptions, setAssumptions] = useState<RoiAssumptions>({ ...ROI_EXAMPLE });
  // Preserve incomplete edits; never display a result from an invalid scenario.
  const [drafts, setDrafts] = useState<Partial<Record<Field, string>>>({});
  const invalidField = (key: Field) => drafts[key] !== undefined && !validValue(key, drafts[key]!);
  const invalid = (Object.keys(fields) as Field[]).some(invalidField);
  const invalidTarget = assumptions.targetUnlocks > assumptions.currentUnlocks;
  const result = invalid || invalidTarget ? null : calculateEmployerRoi(assumptions);
  const money = (value: number, signed = false) => new Intl.NumberFormat(lang, {
    style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value);
  const reset = () => { setAssumptions({ ...ROI_EXAMPLE }); setDrafts({}); };
  const error = invalid ? t("roiInvalid") : invalidTarget ? t("roiInvalidTarget") : undefined;
  const ids = (Object.keys(fields) as Field[]).map((key) => `roi-${key}`).join(" ");
  const ratio = result ? Math.max(result.benefit, result.cost, 1) : 1;
  const netText = result ? money(result.net, true) : "—";
  const breakEven = !result ? error : result.cost === 0 ? t("roiNoCosts")
    : result.breakEvenUnlocks === null ? t("roiNoBreakEven")
    : result.breakEvenUnlocks > assumptions.currentUnlocks ? t("roiUnreachable")
    : t("roiBreakEven", { count: number(Math.ceil(result.breakEvenUnlocks)) });

  const input = (key: Field, helpId?: string) => {
    const { min, max, step } = fields[key];
    return <div className="roi-number-wrap">
      <input id={`roi-${key}`} type="number" min={min} max={max} step={step}
        inputMode={step === 1 ? "numeric" : "decimal"} value={drafts[key] ?? assumptions[key]}
        aria-describedby={[helpId, error ? "roi-input-error" : undefined].filter(Boolean).join(" ") || undefined}
        aria-invalid={invalidField(key) || (key === "targetUnlocks" && invalidTarget)}
        onChange={(event) => {
          const value = event.target.value;
          setDrafts((previous) => ({ ...previous, [key]: value }));
          if (validValue(key, value)) setAssumptions((previous) => ({ ...previous, [key]: Number(value) }));
        }} />
      {step !== 1 && <span aria-hidden="true">€</span>}
    </div>;
  };
  const slider = (key: Field, helpId?: string) => {
    const { label, min, max, step } = fields[key];
    return <input id={`roi-${key}-range`} type="range" min={min} max={max} step={step} value={assumptions[key]}
      aria-label={t(label)} aria-describedby={helpId} aria-valuetext={step === 1 ? number(assumptions[key]) : money(assumptions[key])}
      onChange={(event) => {
        setDrafts((previous) => ({ ...previous, [key]: undefined }));
        setAssumptions((previous) => ({ ...previous, [key]: Number(event.target.value) }));
      }} className="focus-range w-full" style={{ "--range-fill": `${(assumptions[key] - min) / (max - min) * 100}%` } as CSSProperties} />;
  };

  return <section id="roi" aria-labelledby="roi-title" className="roi-section scroll-mt-28" data-testid="employer-roi">
    <div className="mb-8 sm:mb-10">
      <p className="text-xs font-semibold tracking-[.16em] uppercase text-primary">{t("roiEyebrow")}</p>
      <h2 id="roi-title" className="text-3xl sm:text-4xl font-semibold tracking-tight mt-3">{t("roiTitle")}</h2>
      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mt-3">{t("roiIntro")}</p>
    </div>
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
      <div className="min-w-0">
        <div className="roi-mobile-summary lg:!hidden" data-positive={result ? result.net >= 0 : undefined} aria-hidden="true">
          <span className="text-xs leading-snug max-w-[50%]">{t("roiResult")}</span>
          <strong className="text-2xl tabular-nums text-right leading-snug">{netText}</strong>
        </div>
        <div className="space-y-7">
          <div>
            <div className="roi-control-heading"><label htmlFor="roi-employees">{t("roiPeople")}</label>{input("employees")}</div>
            {slider("employees")}
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true"><span>5</span><span>{number(1000)}</span></div>
          </div>

          <fieldset className="roi-unlocks">
            <legend className="font-medium text-base mb-1">{t("roiUnlocks")}</legend>
            <p className="text-sm text-muted-foreground mb-4" id="roi-unlocks-help">{t("roiUnlocksHelp")}</p>
            <div className="grid grid-cols-2 gap-4">
              {(["currentUnlocks", "targetUnlocks"] as const).map((key) => <div key={key} className="min-w-0">
                <label htmlFor={`roi-${key}`} className="block text-sm font-medium mb-2">{t(fields[key].label)}</label>
                {input(key, "roi-unlocks-help roi-unlocks-study")}
                {slider(key, "roi-unlocks-help")}
              </div>)}
            </div>
            <p className="roi-reduction" data-testid="roi-reduction"><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />{result ? t("roiReduction", { count: number(result.fewerUnlocks) }) : "—"}</p>
            <p id="roi-unlocks-study" className="text-xs text-muted-foreground leading-relaxed mt-3">{t("roiStudyHint")} <a href="#employer-research" onClick={() => document.getElementById("employer-research")?.setAttribute("open", "")} className="text-primary underline underline-offset-4">{t("employerSource")}</a></p>
          </fieldset>

          <div>
            <div className="roi-control-heading"><label htmlFor="roi-valuePerUnlock">{t("roiValue")}</label>{input("valuePerUnlock", "roi-value-help")}</div>
            {slider("valuePerUnlock", "roi-value-help")}
            <p id="roi-value-help" className="text-sm text-muted-foreground leading-relaxed mt-1">{t("roiValueHelp")}</p>
            <p className="roi-value-example mt-3">{t("roiValueExample")}</p>
          </div>

          <div className="roi-cost-inputs">
            <h3 className="font-semibold text-base mb-4">{t("roiAssumptions")}</h3>
            <div className="roi-control-heading"><label htmlFor="roi-rewardsPerPerson">{t("roiRewards")}</label>{input("rewardsPerPerson", "roi-rewards-help")}</div>
            <p id="roi-rewards-help" className="text-sm text-muted-foreground leading-relaxed mt-3">{t("roiRewardsHelp")}</p>
            <div className="roi-control-heading mt-5"><label htmlFor="roi-softwarePerPerson">{t("roiSoftware")}</label>{input("softwarePerPerson", "roi-software-help")}</div>
            <p id="roi-software-help" className="text-xs text-muted-foreground leading-relaxed mt-2">{t("roiSoftwareHelp")}</p>
            <p className="flex items-center gap-2 text-sm font-medium mt-5"><CalendarDays className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />{t("roiWorkdays", { days: number(ROI_WORKDAYS) })}</p>
          </div>
        </div>
        {error && <p id="roi-input-error" role="alert" className="text-sm text-destructive mt-4">{error}</p>}
        <Button type="button" variant="ghost" size="sm" className="mt-3 -ml-3 text-xs text-muted-foreground" onClick={reset}><RotateCcw aria-hidden="true" />{t("roiReset")}</Button>
      </div>

      <div ref={resultScene} className="roi-depth-scene lg:sticky lg:top-28">
        <div className="roi-result" data-positive={result ? result.net >= 0 : undefined}>
          <div className="relative">
            <p className="roi-scenario-label">{t("roiScenario")}</p>
            <div className="flex justify-between items-start gap-4 mt-5"><p id="roi-result-label" className="text-lg leading-snug font-medium text-white/90">{t("roiResult")}</p><ArrowUpRight className="h-6 w-6 text-white/60 shrink-0" aria-hidden="true" /></div>
            <output htmlFor={ids} aria-labelledby="roi-result-label" aria-live="polite" aria-atomic="true" className="block mt-4" data-testid="roi-net">
              <span className="roi-amount tabular-nums" data-long={netText.length > 12}>{netText}</span><span className="block text-sm text-white/70 mt-2">{t("roiPerMonth")}</span>
            </output>

            <div className="mt-8 space-y-5">
              {[{ label: "roiBenefit" as const, value: result?.benefit, tone: "benefit" }, { label: "roiCosts" as const, value: result?.cost, tone: "cost" }].map(({ label, value, tone }) => <div key={label}>
                <div className="flex flex-wrap justify-between items-end gap-x-3 gap-y-1"><span className="text-sm text-white/75">{t(label)}</span><span className="font-semibold text-2xl tabular-nums" data-testid={`roi-${tone}`}>{value === undefined ? "—" : money(value)}</span></div>
                <div className="roi-bar mt-2" aria-hidden="true"><div data-tone={tone} style={{ width: `${(value ?? 0) / ratio * 100}%` }} /></div>
              </div>)}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 mt-6"><span className="text-sm text-white/75">{t("roiReturn")}</span><span className="font-semibold text-3xl tabular-nums" data-testid="roi-percent">{result?.roi === null || result?.roi === undefined ? "—" : `${new Intl.NumberFormat(lang, { maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(result.roi)} %`}</span></div>
            <p className="text-xs text-white/65 leading-relaxed mt-2">{t("roiReturnHelp")}</p>
            <p className="roi-break-even" data-testid="roi-break-even">{breakEven}</p>
            <div className="border-t border-white/15 pt-5 mt-6 text-sm text-white/75 leading-relaxed" data-testid="roi-calculation">
              <p>{t("roiCalculationTitle")}</p>
              <p className="mt-2 text-white font-medium">{result ? t("roiCalculation", { people: number(assumptions.employees), count: number(result.fewerUnlocks), days: number(ROI_WORKDAYS), value: money(assumptions.valuePerUnlock), total: money(result.benefit) }) : "—"}</p>
              <p className="mt-2">{result ? t("roiCostCalculation", { people: number(assumptions.employees), rewards: money(assumptions.rewardsPerPerson), software: money(assumptions.softwarePerPerson), total: money(result.cost) }) : "—"}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-5" id="roi-scope">{t("roiScope")}</p>
      </div>
    </div>
    <details className="roi-method mt-5">
      <summary className="cursor-pointer text-sm font-medium inline-flex items-center gap-2">{t("roiMethod")}<ArrowDown className="h-3 w-3" aria-hidden="true" /></summary>
      <div className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl space-y-3"><p>{t("roiFormula")}</p><p>{t("roiWorkdaysHelp")}</p><p>{t("roiMethodScope")}</p></div>
    </details>
  </section>;
}
