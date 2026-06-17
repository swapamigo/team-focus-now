import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const faqItems = [
  {
    q: "Wie steht der Betriebsrat zu TeamFocus?",
    a: "Sehr positiv – weil TeamFocus genau die Punkte erfüllt, die der Betriebsrat prüft: freiwillige Teilnahme, keine Einzeldaten (nur Team-Durchschnitte mit k-Anonymität k=5), keine Inhalte/Screenshots/Keystrokes, EU-Hosting, klare Zweckbindung. Wir stellen Mustervorlagen für Betriebsvereinbarung, DSFA und Einwilligungstexte bereit.",
  },
  {
    q: "Wie hilft das den Mitarbeitenden konkret?",
    a: "Weniger Smartphone-Stress, bessere Konzentration, echte Pausen statt ständiger Mikro-Ablenkung. Studien (z. B. Sohn et al., 2019) zeigen einen direkten Zusammenhang zwischen problematischer Smartphone-Nutzung und höherem Stresslevel sowie Schlafproblemen. TeamFocus reduziert genau diese Belastung – freiwillig und spielerisch.",
  },
  {
    q: "Was genau wird gemessen?",
    a: "Nur die private Bildschirm- bzw. Ablenkungszeit während der Arbeitszeit. Keine Inhalte, keine Screenshots, keine Tastatureingaben – ausschließlich Zeitdaten. Das Team mit der wenigsten Ablenkungszeit gewinnt.",
  },
  {
    q: "Werden einzelne Mitarbeitende überwacht?",
    a: "Nein. Niemand – auch nicht die Geschäftsführung – sieht individuelle Bildschirmzeiten. Nur die Person selbst sieht ihre eigenen Daten. Führungskräfte sehen ausschließlich Team-Aggregate, und auch das erst ab Teamgröße 5 (k-Anonymität).",
  },
  {
    q: "Ist die Teilnahme freiwillig?",
    a: "Ja, vollständig. Jede:r Mitarbeitende entscheidet selbst über Teilnahme und über jede einzelne Anti-Sucht-Funktion (Timer, Graustufen, NFC-Sperre). Keine Nachteile bei Nicht-Teilnahme – das ist Voraussetzung für die Akzeptanz im Betrieb.",
  },
  {
    q: "Ist das DSGVO-konform?",
    a: "Ja. Privacy-by-Design, ausdrückliche Einwilligung der Mitarbeitenden, EU-Hosting, Datenminimierung und klare Zweckbindung sind von Anfang an eingebaut. Eine DSFA-Vorlage liegt bei.",
  },
  {
    q: "Was kostet es?",
    a: "2,99 € pro Mitarbeitendem pro Monat. Mit Jahresabo nur 1,99 € pro Mitarbeitendem pro Monat. Monatlich kündbar, keine Setup-Gebühr, 30 Tage gratis testen.",
  },
  {
    q: "Was bekommt das Gewinner-Team?",
    a: "Die Belohnung legt die Führungskraft frei fest. Bewährte Beispiele: 1 Stunde früher Feierabend am Freitag, 1 Stunde später Start am Montag, Essensgutschein, Team-Lunch oder ein Fokus-Champion-Badge. Wichtig: Es wird nie ein Einzelner bestraft, nur ein Team belohnt.",
  },
  {
    q: "Wie schnell ist es eingerichtet?",
    a: "In rund 5 Minuten – ohne IT-Abteilung. Workspace anlegen, Einladungslink teilen, loslegen. Für die Einführung mit Betriebsrat planen Sie typischerweise 2–4 Wochen ein.",
  },
];

export default function Faq() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="faq">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">FAQ</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Häufige Fragen.</h2>
      </div>

      <div className="max-w-3xl mx-auto surface-card p-3 md:p-5">
        <Accordion type="single" collapsible>
          {items.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium px-3">{it.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-3">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
