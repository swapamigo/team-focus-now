const SRC_RECOVERY = "https://neurosciencenews.com/smartphone-notifications-cognition-22048/";

export default function InterruptionCycle() {
  return (
    <section className="container py-16 md:py-20 border-t border-border/40">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Der versteckte Kostentreiber</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Eine Unterbrechung kostet mehr als die Sekunde am Handy.
        </h2>
        <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">
          Nach jeder Unterbrechung dauert es im Schnitt rund{" "}
          <strong className="text-foreground">23 Minuten</strong>, bis wieder volle Konzentration erreicht ist – genau hier setzt TeamFocus an.
        </p>
        <p className="text-[11px] text-muted-foreground italic mt-5">
          Forschung von Gloria Mark zur Wiederaufnahme nach Unterbrechungen.{" "}
          <a href={SRC_RECOVERY} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 not-italic hover:text-foreground">
            Mehr Infos zur Wiederanlaufphase
          </a>
        </p>
      </div>
    </section>
  );
}
