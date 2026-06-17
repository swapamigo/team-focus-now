import desktopImg from "@/assets/interruption-cycle-desktop.png.asset.json";
import mobileImg from "@/assets/interruption-cycle-mobile-v2.png.asset.json";

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
        <p className="mt-4">
          <a href={SRC_RECOVERY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold px-4 py-2 text-sm hover:bg-primary/20 transition-colors">
            Bewiesen in dieser Studie.
          </a>
        </p>
      </div>
      <div className="mt-10 max-w-5xl mx-auto">
        <img
          src={desktopImg.url}
          alt="Ablauf einer Unterbrechung: 1 Sekunde am Handy führt zu 23 Minuten verlorener Fokuszeit"
          className="hidden md:block w-full h-auto rounded-xl"
          loading="lazy"
        />
        <img
          src={mobileImg.url}
          alt="Ablauf einer Unterbrechung (mobile Ansicht): 1 Sekunde am Handy führt zu 23 Minuten verlorener Fokuszeit"
          className="md:hidden w-full h-auto rounded-xl mx-auto max-w-sm"
          loading="lazy"
        />
      </div>
      <p className="mt-6 text-center max-w-3xl mx-auto">
        <a href={SRC_RECOVERY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold px-4 py-2 text-sm hover:bg-primary/20 transition-colors">
          Studie!
        </a>
      </p>
    </section>
  );
}
