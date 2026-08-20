import { Smartphone, Swords, Gift, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Messen",
    desc: "Handy-Zeit & nicht-erlaubte Apps werden während der Arbeit erfasst.",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: Swords,
    title: "Battlen",
    desc: "Teams treten gegeneinander an: wer hat am wenigsten Ablenkung?",
    accent: "from-accent/20 to-accent/5",
  },
  {
    icon: Gift,
    title: "Belohnen",
    desc: "Das Sieger-Team gewinnt – z. B. Tankgutschein, Team-Lunch oder Event-Tickets.",
    accent: "from-success/20 to-success/5",
  },
];

export default function HowItWorks() {
  return (
    <section className="container py-20 md:py-28 border-t border-border/40" id="how">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 3 Schritten</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">So funktioniert's.</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          Keine Inhalte, keine Screenshots – nur Zeitdaten. Freiwillig, anonym, mit echter Belohnung.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 md:gap-6 relative">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <div className={`glow-card p-7 md:p-8 text-center h-full bg-gradient-to-br ${s.accent}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-background border-2 border-primary text-primary grid place-items-center text-sm font-bold shadow-md">
                {i + 1}
              </div>
              <div className="h-20 w-20 rounded-2xl gradient-primary grid place-items-center mx-auto mb-5 mt-2 shadow-glow">
                <s.icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border border-border items-center justify-center">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
