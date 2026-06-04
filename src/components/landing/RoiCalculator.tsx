import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Info, Sparkles, ArrowRight } from "lucide-react";

const REDUCTION = 0.35;
const WORKING_DAYS = 250;

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fmtPerDay = (hoursPerYear: number) => {
  const totalMin = Math.round((hoursPerYear / WORKING_DAYS) * 60);
  if (totalMin >= 60) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `≈ ${h} Std ${m} Min pro Tag`;
  }
  return `≈ ${totalMin} Min pro Tag`;
};

const SRC_720H = "https://steeringpoint.ie/worklife/how-does-smartphone-use-impact-the-workplace/";
const SRC_LOSS = "https://www.prnewswire.com/news-releases/screen-educations-smartphone-distraction--workplace-safety-survey-finds-us-employees-distracted-2-5-hours-each-workday-by-digital-content-unrelated-to-their-jobs-301120969.html";

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [hoursPerYear, setHoursPerYear] = useState(720);

  const { wastedHours, lossPerYear, savingsPerYear, savingsPerMonth } = useMemo(() => {
    const wasted = employees * hoursPerYear;
    const loss = wasted * hourlyCost;
    const savings = loss * REDUCTION;
    return { wastedHours: wasted, lossPerYear: loss, savingsPerYear: savings, savingsPerMonth: savings / 12 };
  }, [employees, hourlyCost, hoursPerYear]);

  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="calculator">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Schritt 1 · Lohnt sich das?</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was kostet Ablenkung Ihr Unternehmen?</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Je nach Studie verliert ein:e Mitarbeitende:r <strong className="text-foreground">154 bis 720 Arbeitsstunden pro Jahr</strong> durch Ablenkung.
          Stellen Sie den Wert für Ihr Unternehmen ein.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface-card p-7 md:p-8 space-y-7">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Mitarbeitende</Label>
              <span className="text-2xl font-semibold tabular-nums">{employees}</span>
            </div>
            <Slider value={[employees]} min={1} max={500} step={1} onValueChange={(v) => setEmployees(v[0])} />
            <Input type="number" min={1} max={5000} value={employees}
              onChange={(e) => setEmployees(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Kosten pro Mitarbeitendem / Stunde</Label>
              <span className="text-2xl font-semibold tabular-nums">{fmtEUR(hourlyCost)}</span>
            </div>
            <Slider value={[hourlyCost]} min={10} max={150} step={1} onValueChange={(v) => setHourlyCost(v[0])} />
            <Input type="number" min={1} max={500} value={hourlyCost}
              onChange={(e) => setHourlyCost(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Verschwendete Arbeitszeit / Mitarbeitendem / Jahr</Label>
              <span className="text-2xl font-semibold tabular-nums">{hoursPerYear} h</span>
            </div>
            <Slider value={[hoursPerYear]} min={154} max={720} step={1} onValueChange={(v) => setHoursPerYear(v[0])} />
            <p className="text-xs text-muted-foreground">
              {fmtPerDay(hoursPerYear)} <span className="opacity-70">(bei 250 Arbeitstagen/Jahr)</span>
            </p>
          </div>

          <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Spanne 154–720 h/Jahr je nach Studie. Oberwert (720 h):{" "}
              <a href={SRC_720H} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                Quelle
              </a>
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="surface-card p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-destructive/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Aktueller Verlust / Jahr</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-destructive">{fmtEUR(lossPerYear)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≙ <strong className="text-foreground">{wastedHours.toLocaleString("de-DE")} Stunden</strong> verlorener Arbeitszeit.
              </p>
              <a href={SRC_LOSS} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground">
                Studie ansehen
              </a>
            </div>
          </div>

          <div className="surface-card p-7 relative overflow-hidden border-primary/30 ring-1 ring-primary/20">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">Ihre Ersparnis mit TeamFocus</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{fmtEUR(savingsPerYear)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≈ <strong className="text-foreground">{fmtEUR(savingsPerMonth)} / Monat</strong> – bei rund 35 % weniger Bildschirmzeit.
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                In der Praxis meist höher: weniger Fehler, mehr Konzentration.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <Button asChild size="lg" className="h-12 px-8 shadow-glow group">
          <Link to="/register">
            Kostenlos starten <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">Keine Kreditkarte · Setup in 5 Minuten · monatlich kündbar</p>
      </div>
    </section>
  );
}
