import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Seit wir TeamFocus nutzen, ist die Stimmung im Büro spürbar ruhiger. Die Teams treiben sich gegenseitig an – ohne dass ich kontrollieren muss.",
    name: "Sandra K.",
    role: "Teamleiterin, Logistikunternehmen (~45 Mitarbeitende)",
  },
  {
    quote: "Endlich ein System, das Mitarbeitende nicht überwacht, sondern motiviert. Unser Vertrieb hat sichtbar mehr Fokus, gerade in den wichtigen Stunden.",
    name: "Markus B.",
    role: "Vertriebsleiter, B2B-Industrieanbieter (~80 Mitarbeitende)",
  },
  {
    quote: "Der Betriebsrat war von Anfang an an Bord – weil eben keine Einzeldaten sichtbar sind. Das war für uns der entscheidende Punkt.",
    name: "Julia M.",
    role: "HR-Leitung, mittelständisches Dienstleistungsunternehmen",
  },
];

const badges = [
  "Logistik & Spedition",
  "Industriebetrieb",
  "Steuerkanzlei",
  "Agentur",
  "Handwerk",
  "IT-Dienstleister",
];

export default function SocialProof() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Stimmen aus der Praxis</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Teams, die wieder Fokus haben.</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {testimonials.map((t) => (
          <figure key={t.name} className="glow-card p-7 flex flex-col">
            <div className="flex gap-0.5 mb-4 text-warning">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">„{t.quote}"</blockquote>
            <figcaption className="mt-5 pt-5 border-t border-border/60">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-5">
          Vertraut von Teams aus
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {badges.map((b) => (
            <span key={b} className="px-4 py-2 rounded-full bg-secondary/70 border border-border/60 text-xs text-muted-foreground">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
