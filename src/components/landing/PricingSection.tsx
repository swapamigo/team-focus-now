import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";


const perks = [
  "Unbegrenzte Teams & Challenges",
  "Anonyme Team-Statistiken (k-Anonymität)",
  "Belohnungssystem inklusive",
  "Erfassung nur während Arbeitszeit",
  "DSGVO-konform, EU-Hosting",
  "Setup in 5 Minuten – ohne IT",
];

interface Props {
  onBookCall?: () => void;
  onDemo?: () => void;
}

export default function PricingSection({ onBookCall, onDemo }: Props) {
  const primary = onDemo ?? onBookCall;
  return (
    <section className="container py-16 md:py-20 border-t border-border/40" id="pricing">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Preise</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein fairer Preis pro Mitarbeitendem.</h2>
        <p className="mt-4 text-muted-foreground">30 Tage gratis · monatlich kündbar · keine Setup-Gebühr</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <div className="glow-card p-8 relative">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Monatlich</p>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-5xl font-semibold tracking-tight">4,99&nbsp;€</span>
            <span className="text-sm text-muted-foreground">/ MA / Monat</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Volle Flexibilität, jederzeit kündbar.</p>
          <Button variant="outline" className="w-full h-11" onClick={primary}>
            <Sparkles className="mr-1.5 h-4 w-4" />Demo ansehen
          </Button>
        </div>

        <div className="glow-card p-8 relative border-primary/40 ring-1 ring-primary/30 bg-primary/[0.03] overflow-hidden">
          <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-bold text-primary px-2.5 py-1 rounded-full bg-primary/15">
            −20 % sparen
          </span>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Jährlich</p>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-5xl font-semibold tracking-tight text-gradient">3,99&nbsp;€</span>
            <span className="text-sm text-muted-foreground">/ MA / Monat</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Jährlich abgerechnet. Bester Preis.</p>
          <Button className="w-full h-11 shadow-glow" onClick={primary}>
            <Sparkles className="mr-1.5 h-4 w-4" />Demo ansehen
          </Button>
        </div>

      </div>

      <div className="max-w-3xl mx-auto mt-8 surface-card p-6">
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center">
                <Check className="h-3.5 w-3.5" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
