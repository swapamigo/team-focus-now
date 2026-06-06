import { Smartphone, Laptop, Swords, Trophy } from "lucide-react";

const steps = [
  { icon: Smartphone, title: "Handy-Bildschirmzeit", desc: "Private Nutzung während der Arbeit wird gemessen." },
  { icon: Laptop, title: "Falsche Apps & Websites", desc: "Am Laptop zählt nur, was nicht zur Arbeit gehört." },
  { icon: Swords, title: "Teams batteln sich", desc: "Mitarbeitende werden in Teams aufgeteilt und vergleichen Ablenkungszeit." },
  { icon: Trophy, title: "Wenigste Ablenkung gewinnt", desc: "Nach 1 Woche bis 1 Monat: z. B. Freitag 1 Stunde früher Schluss." },
];

export default function HowItWorks() {
  return (
    <section className="container py-16 md:py-20 border-t border-border/40" id="how">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">So funktioniert's</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein Team-Spiel um Fokus.</h2>
        <p className="mt-3 text-muted-foreground">
          Keine Inhalte, keine Screenshots – nur Zeitdaten. Freiwillig, anonym, mit echter Belohnung.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.title} className="glow-card p-5 text-center relative">
            <div className="absolute -top-2.5 -left-2.5 h-7 w-7 rounded-full gradient-primary text-primary-foreground grid place-items-center text-xs font-semibold shadow-md">
              {i + 1}
            </div>
            <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mx-auto mb-3 shadow-sm">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
