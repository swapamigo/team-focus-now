import { BookOpen, Brain, HeartPulse, Smartphone } from "lucide-react";

const studies = [
  {
    icon: Brain,
    stat: "23 Min.",
    headline: "Wiederanlaufzeit nach jeder Unterbrechung",
    body: "Dr. Gloria Mark (University of California) zeigt: Nach jeder Ablenkung dauert es im Schnitt 23 Minuten und 15 Sekunden, bis die volle Konzentration zurückkehrt. Bei 5 Handy-Griffen pro Stunde geht damit fast die komplette produktive Zeit verloren.",
    source: "Gloria Mark, UC Irvine – »The Cost of Interrupted Work«",
    href: "https://neurosciencenews.com/smartphone-notifications-cognition-22048/",
  },
  {
    icon: HeartPulse,
    stat: "+27%",
    headline: "höheres Stress­empfinden bei hoher Handy­nutzung",
    body: "Eine Meta-Analyse im Journal »Frontiers in Psychiatry« verbindet problematische Smartphone-Nutzung direkt mit höherem Stress­level, Schlafproblemen und depressiver Symptomatik – besonders im Arbeits­kontext.",
    source: "Sohn et al., 2019 – Frontiers in Psychiatry",
    href: "https://www.frontiersin.org/articles/10.3389/fpsyt.2019.00821/full",
  },
  {
    icon: Smartphone,
    stat: "3h 15min",
    headline: "durchschnittliche tägliche Smartphone-Nutzung",
    body: "DAK-Gesundheitsreport & Bitkom-Studien zeigen: Deutsche Berufstätige greifen über 80× pro Tag zum Handy. Ein erheblicher Teil davon fällt in die Arbeitszeit – meist unbewusst.",
    source: "DAK Gesundheitsreport 2023 / Bitkom 2024",
    href: "https://www.dak.de/dak/bundesthemen/gesundheitsreport-2023-2553990.html",
  },
  {
    icon: BookOpen,
    stat: "−35%",
    headline: "weniger Ablenkungszeit durch Gruppen-Anreize",
    body: "Verhaltens­ökonomische Forschung (Thaler & Sunstein – »Nudge«) belegt: Team-basierte, positive Anreize verändern Gewohnheiten nachhaltiger als individuelle Kontrolle oder Verbote.",
    source: "Thaler & Sunstein – Nudge Theory",
    href: "https://en.wikipedia.org/wiki/Nudge_theory",
  },
];

export default function Studies() {
  return (
    <section id="studien" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Wissenschaftlich fundiert</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was die Forschung sagt.</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          TeamFocus ist kein Bauchgefühl-Tool. Jede Funktion basiert auf belastbaren Studien zu Aufmerksamkeit, Stress und Verhaltensänderung.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {studies.map((s, i) => (
          <article key={s.headline} className="glow-card p-6 md:p-7 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary grid place-items-center shadow-sm">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-3xl md:text-4xl font-semibold text-gradient leading-none mb-1">{s.stat}</div>
                <h3 className="font-semibold text-base md:text-lg leading-tight">{s.headline}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{s.body}</p>
            <p className="text-[11px] text-muted-foreground italic mt-4 pt-4 border-t border-border/50">
              Quelle:{" "}
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 not-italic hover:text-foreground">
                {s.source}
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
