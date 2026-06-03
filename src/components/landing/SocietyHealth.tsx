import { Globe, HeartPulse, Handshake } from "lucide-react";

const cards = [
  {
    icon: Globe,
    title: "Mehr als ein Arbeitsplatz-Thema.",
    desc: "Smartphone-Ablenkung ist ein gesellschaftliches Phänomen, kein rein betriebliches. Schon bei hoher Nutzungsfrequenz – nicht erst bei klinischer Diagnose – entwickeln Menschen ähnliche Kontrollverlust-Muster.",
    note: "Vgl. Forschung von Duke & Montag zur problematischen Smartphone-Nutzung.",
  },
  {
    icon: HeartPulse,
    title: "Weniger Sog = weniger Stress.",
    desc: "Wer den ständigen Griff zum Handy reduziert, trägt dazu bei, das Stresslevel zu senken und gesundheitlichen Belastungen vorzubeugen. TeamFocus setzt an der Gewohnheit an – nicht an der Person.",
  },
  {
    icon: Handshake,
    title: "Gut für Mitarbeitende. Gut fürs Unternehmen.",
    desc: "Mitarbeitende gewinnen Ruhe, Fokus und Erholung; das Unternehmen gewinnt Konzentration, weniger Fehler und zufriedenere Teams. Ein echtes Win-win statt eines Kontrollinstruments.",
  },
];

export default function SocietyHealth() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Über den Werkstor hinaus</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein Problem, das nicht am Werkstor endet.</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {cards.map((c) => (
          <div key={c.title} className="glow-card p-7">
            <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mb-4 shadow-sm">
              <c.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-1.5 text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            {c.note && <p className="text-[11px] text-muted-foreground italic mt-3">{c.note}</p>}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 surface-card p-7 text-center border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02]">
        <p className="text-lg md:text-xl font-medium leading-relaxed">
          Helfen Sie Ihren Mitarbeitenden, die Handynutzung wieder <span className="text-gradient">in den Griff</span> zu bekommen.
        </p>
      </div>
    </section>
  );
}
