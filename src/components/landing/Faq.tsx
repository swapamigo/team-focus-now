import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    q: "Was genau wird gemessen?",
    a: "Die private Bildschirm- bzw. Ablenkungszeit während der Arbeitszeit. Keine Inhalte, keine Screenshots, keine Tastatureingaben – nur Zeitdaten. Das Team mit der wenigsten Ablenkungszeit gewinnt.",
  },
  {
    q: "Werden einzelne Mitarbeitende überwacht?",
    a: "Nein. Führungskräfte sehen nur Team-Aggregate. Wir nutzen k-Anonymität (k = 5): Team-Ergebnisse werden erst angezeigt, wenn ein Team groß genug ist, um Rückschlüsse auf Einzelpersonen auszuschließen.",
  },
  {
    q: "Ist das DSGVO-konform?",
    a: "Ja. Privacy-by-Design, ausdrückliche Einwilligung der Mitarbeitenden, EU-Hosting und Datenminimierung sind von Anfang an eingebaut.",
  },
  {
    q: "Was kostet es nach den 30 Tagen?",
    a: "7 € pro Mitarbeitendem pro Monat. Monatlich kündbar, keine Setup-Gebühr.",
  },
  {
    q: "Was bekommt das Gewinner-Team?",
    a: "Die Belohnung legt die Führungskraft frei fest. TeamFocus schlägt zeitliche (z. B. späterer Arbeitsbeginn), monetäre (z. B. Gutscheine, Team-Lunch) oder symbolische (z. B. Fokus-Champion-Badge) Belohnungen vor.",
  },
  {
    q: "Wie schnell ist es eingerichtet?",
    a: "In rund 5 Minuten – ohne IT-Abteilung. Workspace anlegen, Einladungslink teilen, loslegen.",
  },
  {
    q: "Funktioniert das auch für hybride/remote Teams?",
    a: "Ja. TeamFocus ist standortunabhängig und funktioniert genauso für Büro-, Hybrid- und Remote-Teams.",
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
