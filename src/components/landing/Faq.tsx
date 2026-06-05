import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    q: "Was genau wird gemessen?",
    a: "Nur die private Bildschirm- bzw. Ablenkungszeit während der Arbeitszeit. Keine Inhalte, keine Screenshots, keine Tastatureingaben – ausschließlich Zeitdaten. Das Team mit der wenigsten Ablenkungszeit gewinnt.",
  },
  {
    q: "Werden einzelne Mitarbeitende überwacht?",
    a: "Nein. Führungskräfte sehen nur Team-Aggregate. Wir nutzen k-Anonymität (k = 5): Team-Ergebnisse erscheinen erst, wenn ein Team groß genug ist, um Rückschlüsse auf Einzelpersonen auszuschließen.",
  },
  {
    q: "Ist das DSGVO-konform?",
    a: "Ja. Privacy-by-Design, ausdrückliche Einwilligung der Mitarbeitenden, EU-Hosting und Datenminimierung sind von Anfang an eingebaut.",
  },
  {
    q: "Was kostet es?",
    a: "4,99 € pro Mitarbeitendem pro Monat. Mit Jahresabo nur 3,99 € pro Mitarbeitendem pro Monat. Monatlich kündbar, keine Setup-Gebühr, 30 Tage gratis testen.",
  },
  {
    q: "Was bekommt das Gewinner-Team?",
    a: "Die Belohnung legt die Führungskraft frei fest. Bewährte Beispiele: 1 Stunde früher Feierabend am Freitag (Top-Empfehlung – Fokus ist dort sowieso am geringsten), 1 Stunde später Start am Montag, Essensgutschein, bevorzugter Firmenwagen, Team-Lunch oder ein Fokus-Champion-Badge.",
  },
  {
    q: "Wie oft wechselt der Belohnungszyklus?",
    a: "Frei wählbar – wöchentlich bis monatlich. Sie steuern Rhythmus und Belohnung pro Challenge.",
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
