import { Users, Smartphone, Zap, Trophy } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Teams werden automatisch zusammengewürfelt.",
    desc: "Mitarbeitende werden zufällig in Teams aufgeteilt – motiviert durch eine gemeinsame Belohnung. Teilnahme ist freiwillig.",
  },
  {
    icon: Smartphone,
    title: "Gezählt wird die Ablenkungszeit.",
    desc: "Gemessen wird die private Bildschirmzeit während der Arbeit – keine Inhalte, keine Screenshots, nur Zeitdaten. Wer am wenigsten am Handy ist, sammelt die wenigsten Ablenkungsminuten.",
  },
  {
    icon: Zap,
    title: "High-Focus per Manager-Klick.",
    desc: "In besonders wichtigen Phasen aktiviert die Führungskraft mit einem Button eine Fokuszeit. In dieser Zeit zählen Ablenkungsminuten doppelt – so wird genau dann fokussiert gearbeitet, wenn es darauf ankommt.",
    badge: "×2 Strafminuten",
  },
  {
    icon: Trophy,
    title: "Team gewinnt, Team wird belohnt.",
    desc: "Verglichen wird nur auf Team-Ebene. Am Ende jedes Zyklus (wöchentlich, 2-, 3-wöchentlich oder monatlich – frei wählbar) gewinnt das Team mit der geringsten Ablenkungszeit. Nur beim Gewinner-Team wird bekannt gegeben, wer mitgespielt hat. Die Belohnung legt die Führungskraft frei fest.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="how">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Schritt 2 · So funktioniert's</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein Team-Spiel um Fokus – ohne Zwang.</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Freiwillig, anonymisiert, mit echter Belohnung am Ende jedes Zyklus.
        </p>
      </div>

      {/* Team-Duell Visual */}
      <div className="max-w-3xl mx-auto mb-14 surface-card p-7 md:p-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5 text-center">Team-Duell: weniger Ablenkung gewinnt</p>
        <div className="space-y-5">
          <TeamBar name="Team Alpha" minutes={68} percent={32} winner />
          <TeamBar name="Team Beta" minutes={142} percent={68} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Kürzerer Balken = weniger Ablenkungsminuten. Team Alpha führt.
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.title} className="glow-card p-7 relative">
            <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full gradient-primary text-primary-foreground grid place-items-center text-sm font-semibold shadow-md">{i + 1}</div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center shadow-sm">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              {s.badge && (
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold animate-pulse">
                  {s.badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-1.5 text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamBar({ name, minutes, percent, winner }: { name: string; minutes: number; percent: number; winner?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {name}
          {winner && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold">
              <Trophy className="h-3 w-3" /> Führend
            </span>
          )}
        </div>
        <span className="tabular-nums text-muted-foreground">{minutes} min Ablenkung</span>
      </div>
      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <div
          className={"h-full rounded-full transition-all duration-700 " + (winner ? "gradient-primary" : "bg-destructive/60")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
