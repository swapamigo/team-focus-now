import { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Building2, Wallet, FileText, ArrowLeft, ShieldCheck } from "lucide-react";

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

const methods = [
  { id: "card", icon: CreditCard, label: "Kreditkarte", desc: "Visa, Mastercard, Amex" },
  { id: "sepa", icon: Building2, label: "SEPA-Lastschrift", desc: "Bequem vom Konto einziehen" },
  { id: "paypal", icon: Wallet, label: "PayPal", desc: "Mit PayPal-Konto bezahlen" },
  { id: "invoice", icon: FileText, label: "Rechnung", desc: "14 Tage Zahlungsziel (Firmen)" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialPlan = (params.get("plan") as "monthly" | "yearly") ?? "yearly";
  const [plan, setPlan] = useState<"monthly" | "yearly">(initialPlan);
  const [employees, setEmployees] = useState(15);
  const [method, setMethod] = useState("card");

  const { perMA, monthlyTotal, yearlyTotal } = useMemo(() => {
    const perMA = plan === "yearly" ? 3.99 : 4.99;
    const monthlyTotal = perMA * employees;
    const yearlyTotal = monthlyTotal * 12;
    return { perMA, monthlyTotal, yearlyTotal };
  }, [plan, employees]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Sichere Bezahlung · SSL-verschlüsselt
          </span>
        </div>
      </header>

      <div className="container py-8 md:py-12 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Bestellung abschließen</h1>
        <p className="text-sm text-muted-foreground mb-8">Wählen Sie Plan, Anzahl der Mitarbeitenden und Zahlungsart.</p>

        <div className="grid lg:grid-cols-[1fr,360px] gap-6">
          <div className="space-y-6">
            {/* Plan */}
            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold mb-4">1 · Plan wählen</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(["monthly", "yearly"] as const).map((p) => {
                  const active = plan === p;
                  return (
                    <button key={p} onClick={() => setPlan(p)}
                      className={"text-left p-5 rounded-xl border-2 transition-all " + (active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{p === "monthly" ? "Monatlich" : "Jährlich"}</span>
                        {p === "yearly" && <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/15">−20 %</span>}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-semibold">{p === "monthly" ? "4,99 €" : "3,99 €"}</span>
                        <span className="text-xs text-muted-foreground">/ MA / Monat</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{p === "monthly" ? "Jederzeit kündbar" : "Jährliche Abrechnung · bester Preis"}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Employees */}
            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold mb-4">2 · Anzahl Mitarbeitende</h2>
              <div className="flex items-end justify-between mb-3">
                <Label className="text-sm">Mitarbeitende</Label>
                <span className="text-3xl font-semibold tabular-nums">{employees}</span>
              </div>
              <Slider value={[employees]} min={1} max={500} step={1} onValueChange={(v) => setEmployees(v[0])} />
              <div className="mt-3">
                <Input type="number" min={1} max={5000} value={employees}
                  onChange={(e) => setEmployees(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))} className="h-10 max-w-[140px]" />
              </div>
            </section>

            {/* Payment method */}
            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold mb-4">3 · Zahlungsart</h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {methods.map((m) => {
                  const active = method === m.id;
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)}
                      className={"flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all " + (active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                      <div className={"h-10 w-10 rounded-lg grid place-items-center " + (active ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary")}>
                        <m.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{m.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="surface-card p-6">
              <h2 className="font-semibold mb-4">Zusammenfassung</h2>
              <div className="space-y-2.5 text-sm">
                <Row label="Plan" value={plan === "monthly" ? "Monatlich" : "Jährlich"} />
                <Row label="Preis / MA / Monat" value={fmtEUR(perMA)} />
                <Row label="Mitarbeitende" value={employees.toString()} />
                <hr className="border-border/60 my-2" />
                <Row label="Monatlich" value={fmtEUR(monthlyTotal)} />
                {plan === "yearly" && <Row label="Jährlich" value={fmtEUR(yearlyTotal)} bold />}
                {plan === "monthly" && <Row label="Erste Abbuchung" value={fmtEUR(monthlyTotal)} bold />}
              </div>

              <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                {["30 Tage gratis testen", "Jederzeit kündbar", "DSGVO-konform · EU-Hosting"].map((p) => (
                  <li key={p} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-success" /> {p}</li>
                ))}
              </ul>

              <Button className="w-full h-12 mt-6 shadow-glow"
                onClick={() => navigate(`/checkout/success?plan=${plan}&employees=${employees}`)}>
                Jetzt kostenpflichtig bestellen
              </Button>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Mit Klick stimmen Sie unseren AGB und der Datenschutzerklärung zu.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold text-base" : "font-medium"}>{value}</span>
    </div>
  );
}
