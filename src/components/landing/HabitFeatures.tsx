import { Timer, ScanLine, MoonStar, Sparkles } from "lucide-react";

const items = [
  {
    icon: Timer,
    title: "30-Sek Öffnungs-Timer",
    desc: "Bevor sich Instagram, TikTok & Co öffnen, läuft ein kurzer Timer. Der Reflex bricht, die bewusste Entscheidung gewinnt.",
  },
  {
    icon: ScanLine,
    title: "Physische NFC-Sperre",
    desc: "Kompatibel mit Geräten wie Brick: Social-Apps öffnen sich nur, wenn der Mitarbeitende einen physischen NFC-Chip aktiv berührt.",
    tag: "Brick kompatibel",
  },
  {
    icon: MoonStar,
    title: "Graustufen-Modus",
    desc: "Während der Arbeitszeit wird das Handy automatisch grau. Bunte Reize verlieren ihre Anziehungskraft.",
  },
  {
    icon: Sparkles,
    title: "Freiwillig & individuell",
    desc: "Jeder Mitarbeitende entscheidet selbst, welche Anti-Sucht-Tools er nutzt. Kein Zwang, nur Unterstützung.",
  },
];

export default function HabitFeatures() {
  return (
    <section id="habits" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Mehr als nur ein Tracker</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Werkzeuge gegen die Handy-Sucht.</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          Freiwillig einschaltbare Werkzeuge – jeder Mitarbeitende aktiviert nur, was zu ihm passt.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {items.map((it, i) => (
          <div key={it.title} className="glow-card p-6 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary grid place-items-center shadow-sm">
                <it.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{it.title}</h3>
                  {it.tag && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{it.tag}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
        Hinweis: Individuelle Bildschirmzeiten bleiben privat – Manager sehen ausschließlich Team-Durchschnitte.
      </p>
    </section>
  );
}
