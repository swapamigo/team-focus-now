import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingDown, TrendingUp, Info, Sparkles } from "lucide-react";

const HOURS_WASTED_PER_YEAR = 720;
const REDUCTION = 0.3;

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(35);

  const { wastedHours, lossPerYear, savingsPerYear, savingsPerMonth } = useMemo(() => {
    const wasted = employees * HOURS_WASTED_PER_YEAR;
    const loss = wasted * hourlyCost;
    const savings = loss * REDUCTION;
    return {
      wastedHours: wasted,
      lossPerYear: loss,
      savingsPerYear: savings,
      savingsPerMonth: savings / 12,
    };
  }, [employees, hourlyCost]);

  return (
    <section className="container py-24 border-t border-border/40" id="calculator">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">ROI-Rechner</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was kostet Ablenkung Ihr Unternehmen?</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Im Durchschnitt verschwendet jeder Mitarbeiter <strong className="text-foreground">720 Arbeitsstunden pro Jahr</strong> am Smartphone –
          mit Folgen für Fokus, Stresslevel und Umsatz.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface-card p-7 md:p-8 space-y-7">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Mitarbeiter</Label>
              <span className="text-2xl font-semibold tabular-nums">{employees}</span>
            </div>
            <Slider value={[employees]} min={1} max={500} step={1} onValueChange={(v) => setEmployees(v[0])} />
            <Input
              type="number"
              min={1}
              max={5000}
              value={employees}
              onChange={(e) => setEmployees(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))}
              className="h-10"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Kosten pro Mitarbeiter / Stunde</Label>
              <span className="text-2xl font-semibold tabular-nums">{fmtEUR(hourlyCost)}</span>
            </div>
            <Slider value={[hourlyCost]} min={10} max={150} step={1} onValueChange={(v) => setHourlyCost(v[0])} />
            <Input
              type="number"
              min={1}
              max={500}
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              className="h-10"
            />
          </div>

          <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Basis: 720 Stunden Smartphone-Ablenkung pro Mitarbeiter / Jahr (Branchendurchschnitt).
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
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Aktueller Verlust / Jahr
                </p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-destructive">{fmtEUR(lossPerYear)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Entspricht <strong className="text-foreground">{wastedHours.toLocaleString("de-DE")} Stunden</strong> verlorener Arbeitszeit.
              </p>
              <p className="text-xs text-muted-foreground italic mt-3 leading-relaxed">
                In der Praxis ist der tatsächliche Verlust höher – Fehler durch geringeren Fokus, Stress und Qualitätsprobleme nicht eingerechnet.
              </p>
            </div>
          </div>

          <div className="surface-card p-7 relative overflow-hidden border-primary/30 ring-1 ring-primary/20">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Ihre Ersparnis mit Team Focus
                </p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{fmtEUR(savingsPerYear)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≈ <strong className="text-foreground">{fmtEUR(savingsPerMonth)} / Monat</strong> – bei nur 30 % weniger Bildschirmzeit.
              </p>
              <p className="text-xs text-muted-foreground italic mt-3 leading-relaxed flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                In der Praxis ist der Gewinn deutlich höher: weniger teure Fehler, höhere Konzentration, effizienteres Arbeiten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
