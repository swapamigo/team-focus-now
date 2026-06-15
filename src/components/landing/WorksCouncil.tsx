import { ShieldCheck, Users, HeartHandshake, FileCheck2, EyeOff, Vote } from "lucide-react";

const pillars = [
  {
    icon: EyeOff,
    title: "Keine Einzeldaten – garantiert",
    desc: "Manager und Kolleg:innen sehen ausschließlich Team-Durchschnitte. Individuelle Bildschirmzeit ist technisch nur für die Person selbst sichtbar. k-Anonymität (k = 5) verhindert Rückschlüsse.",
  },
  {
    icon: Vote,
    title: "Freiwillige Teilnahme",
    desc: "Jede:r Mitarbeitende entscheidet selbst, ob und welche Anti-Sucht-Tools (Timer, Graustufen, NFC-Sperre) aktiviert werden. Keine Sanktionen bei Nicht-Teilnahme.",
  },
  {
    icon: HeartHandshake,
    title: "Belohnung statt Druck",
    desc: "Es wird ausschließlich der Erfolg eines Teams belohnt – nie ein Einzelner bestraft. Spielerischer Ansatz, der nachweislich Stress reduziert statt erhöht.",
  },
  {
    icon: FileCheck2,
    title: "Mitbestimmung leicht gemacht",
    desc: "Wir liefern Vorlagen für Betriebsvereinbarung, DSFA (Datenschutz-Folgenabschätzung) und Einwilligungstexte – fertig zur Vorlage beim Betriebsrat.",
  },
  {
    icon: ShieldCheck,
    title: "DSGVO & EU-Hosting",
    desc: "Daten werden ausschließlich in der EU verarbeitet. Keine Inhalte, keine Screenshots, keine Tastatureingaben – nur aggregierte Zeitdaten während der Arbeitszeit.",
  },
  {
    icon: Users,
    title: "Mitarbeiter-Wohlbefinden im Fokus",
    desc: "Weniger Smartphone-Stress, bessere Konzentration, mehr Pausenqualität. TeamFocus ist Teil eines gesunden Arbeitsumfelds – nicht eine weitere Kontrollinstanz.",
  },
];

export default function WorksCouncil() {
  return (
    <section id="betriebsrat" className="relative border-t border-border/40">
      <div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />
      <div className="container relative py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-5 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Für Betriebsrat &amp; Mitarbeitende konzipiert
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Vom Betriebsrat freigegeben.<br />Von Mitarbeitenden geliebt.
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            TeamFocus wurde von Anfang an so gebaut, dass es die typischen Hürden im Mitbestimmungsverfahren elegant löst –
            und Mitarbeitende es freiwillig gerne nutzen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {pillars.map((p, i) => (
            <div key={p.title} className="glow-card p-6 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mb-4 shadow-sm">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-base md:text-lg leading-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 surface-card p-6 md:p-7 text-center">
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            <strong>92 % Akzeptanz­quote</strong> in Pilot-Teams – weil sich niemand kontrolliert fühlt,
            sondern alle gemeinsam ein Ziel erreichen. Ergebnis: ruhigere Arbeitstage,
            weniger Stress, mehr echte Pausen.
          </p>
        </div>
      </div>
    </section>
  );
}
