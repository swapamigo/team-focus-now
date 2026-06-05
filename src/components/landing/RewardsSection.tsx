import { Clock, Utensils, Car, Award, Coffee, Gift } from "lucide-react";

const rewards = [
  {
    icon: Clock,
    title: "1 Stunde früher Feierabend (Freitag)",
    desc: "Best Practice – am Freitag ist der Fokus in der letzten Stunde ohnehin am schwächsten.",
    highlight: true,
  },
  { icon: Clock, title: "1 Stunde später Start am Montag", desc: "Entspannter Wochenstart für das Gewinner-Team." },
  { icon: Utensils, title: "Essensgutschein", desc: "Restaurant, Lieferdienst oder lokaler Anbieter." },
  { icon: Car, title: "Bevorzugter Firmenwagen", desc: "Der bessere Wagen für eine Woche oder einen Monat." },
  { icon: Coffee, title: "Bezahlter Team-Lunch", desc: "Gemeinsames Mittag- oder Kaffee/Eis-Runde aufs Haus." },
  { icon: Award, title: "Fokus-Champion-Badge", desc: "Anerkennung im Team-Meeting + symbolische Auszeichnung." },
];

export default function RewardsSection() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="rewards">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
          <Gift className="h-3.5 w-3.5" /> Empfohlene Belohnungen
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was das Gewinner-Team bekommt.</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          Sie wählen die Belohnung – wir liefern bewährte Ideen, die Mitarbeitende wirklich motivieren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {rewards.map((r) => (
          <div
            key={r.title}
            className={
              "glow-card p-6 " +
              (r.highlight ? "border-primary/40 ring-1 ring-primary/30 bg-primary/[0.03]" : "")
            }
          >
            <div className={"h-11 w-11 rounded-xl grid place-items-center mb-4 " + (r.highlight ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary")}>
              <r.icon className="h-5 w-5" />
            </div>
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-base leading-snug">{r.title}</h3>
              {r.highlight && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary px-2 py-0.5 rounded-full bg-primary/15 shrink-0 mt-0.5">
                  Top
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Belohnungszyklus frei wählbar: <span className="text-foreground font-medium">wöchentlich bis monatlich</span>.
      </p>
    </section>
  );
}
