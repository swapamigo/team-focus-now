import { Focus, BellRing, Split, Hourglass, Brain, ArrowRight } from "lucide-react";

const nodes = [
  { icon: Focus, label: "Fokussierte Arbeit", sub: "Flow-Zustand", tone: "primary" },
  { icon: BellRing, label: "Stimulus", sub: "Notification, Griff zum Gerät", tone: "warning" },
  { icon: Split, label: "Aufmerksamkeitsverlust", sub: "Switching Cost", tone: "destructive" },
  { icon: Hourglass, label: "Wiederanlaufphase", sub: "Ø ~23 Min", tone: "destructive" },
  { icon: Brain, label: "Reduzierte Verfügbarkeit", sub: "Konzentration sinkt", tone: "muted" },
];

const toneClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  muted: "bg-secondary text-muted-foreground border-border/60",
};

export default function InterruptionCycle() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Der versteckte Kostentreiber</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Eine Unterbrechung kostet mehr als die Sekunde am Handy.</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Nach jeder Unterbrechung dauert es im Schnitt rund <strong className="text-foreground">23 Minuten</strong>, bis wieder volle Konzentration erreicht ist – genau hier setzt TeamFocus an.
        </p>
      </div>

      <div className="max-w-5xl mx-auto surface-card p-7 md:p-10">
        <div className="flex flex-wrap items-stretch justify-center gap-3">
          {nodes.map((n, i) => (
            <div key={n.label} className="flex items-center gap-3">
              <div className={`flex flex-col items-center text-center gap-2 rounded-2xl border px-4 py-4 w-40 ${toneClasses[n.tone]}`}>
                <n.icon className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{n.label}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{n.sub}</p>
                </div>
              </div>
              {i < nodes.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic text-center mt-6">
          Quelle: Forschung von Gloria Mark zur Wiederaufnahme nach Unterbrechungen.
        </p>
      </div>
    </section>
  );
}
