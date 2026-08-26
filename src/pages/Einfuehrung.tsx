import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, Check, Copy, Mail, ShieldCheck, Users } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import { openCallBooking, trackClick } from "@/lib/track";
import { toast } from "@/hooks/use-toast";

const employeeMail = `Betreff: Genug vom Handyverbot bei {{Unternehmen}}?

Du findest, dass ein pauschales Handyverbot mehr Stress als Nutzen verursacht? Wir auch!

TeamFokus ersetzt Kontrolle durch Eigenverantwortung.
Ihr könnt freiwillig gemeinsame Fokuszeiten vereinbaren und als Team attraktive Belohnungen freischalten.

Wichtig: Dein Arbeitgeber erhält keine persönlichen Nutzungsdaten, App-Verläufe oder Inhalte. Er erfährt ausschließlich, welches Team eine Belohnung freigeschaltet hat.

Wenn du dir so eine Lösung bei euch vorstellen kannst, schicke ich dir gerne eine kurze E-Mail mit allen Informationen.`;

const managementMail = `Betreff: Wie gehen Sie aktuell bei {{Unternehmen}} mit privater Smartphone-Nutzung während der Arbeitszeit um?

Handyverbote lösen das Problem nicht – sie werden nicht eingehalten und erzeugen Frustration, ohne die Nutzung nachweislich zu senken (Whelan & Turel, 2024).

Mit TeamFokus haben wir eine Lösung entwickelt, die Mitarbeitende durch gemeinsame Fokus-Challenges motiviert, fokussierter und produktiver zu arbeiten – komplett ohne Handyverbot und ohne individuelle Überwachung.

Worauf wir dabei einzahlen:
- Verringerung der Anzahl notwendiger Korrekturen und Nacharbeiten
- Senkung der Fehler- beziehungsweise Ausnahmequote
- Verkürzung der durchschnittlichen Bearbeitungszeit
- Bessere Einhaltung interner Fristen

Sie erhalten dabei keine persönlichen Nutzungsdaten Ihrer Mitarbeitenden – nur die Information, welches Team eine vereinbarte Belohnung freigeschaltet hat.

Soll ich Ihnen eine kurze Übersicht zum Ablauf zusenden?`;

const phases = [
  {
    n: "1",
    t: "Führung ausrichten",
    d: "Ziele festlegen: weniger Nacharbeit, niedrigere Fehlerquote, kürzere Bearbeitungszeiten, zuverlässigere interne Fristen. Belohnung pro Team definieren.",
  },
  {
    n: "2",
    t: "Betriebsrat einbinden",
    d: "Freiwilligkeit, k-Anonymität ab 5 Personen, keine Inhalte, EU-Hosting und Zweckbindung sind dokumentiert. Vorlagen für Betriebsvereinbarung, VVT und DSFA liegen bereit.",
  },
  {
    n: "3",
    t: "Mitarbeitende informieren",
    d: "Mit der E-Mail unten offen kommunizieren: freiwillige Teilnahme, keine Einzeldaten für den Arbeitgeber, echte Team-Belohnungen.",
  },
  {
    n: "4",
    t: "Starten und auswerten",
    d: "Workspace anlegen, Einladungslink teilen, Challenge starten. Sichtbar wird ausschließlich, welches Team seine Belohnung freigeschaltet hat.",
  },
];

function MailCard({ title, hint, body, id }: { title: string; hint: string; body: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      trackClick(`copy:mail:${id}`, title);
      toast({ title: "In die Zwischenablage kopiert" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Kopieren nicht möglich", description: "Bitte den Text manuell markieren." });
    }
  };
  return (
    <div className="surface-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />{title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{hint}</p>
        </div>
        <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? "Kopiert" : "Kopieren"}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-secondary/40 rounded-xl p-4 font-sans">
        {body}
      </pre>
    </div>
  );
}

export default function Einfuehrung() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="TeamFokus einführen – Ablauf, Betriebsrat und Kommunikationsvorlagen"
        description="So führen Sie TeamFokus ein: Ziele festlegen, Betriebsrat einbinden, Mitarbeitende offen informieren, starten. Inklusive fertiger E-Mail-Vorlagen für Mitarbeitende und Unternehmensführung."
        path="/einfuehrung"
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} />

      <main>
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-12 md:pb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
              <ShieldCheck className="h-4 w-4" />
              Freiwillig · Anonym ab 5 Personen · Ohne Handyverbot
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              TeamFokus einführen –<br />
              <span className="text-gradient animate-gradient-x">transparent von Tag eins.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Akzeptanz entsteht durch offene Kommunikation. Hier ist der komplette Ablauf – inklusive
              der E-Mails, die Sie direkt übernehmen können.
            </p>
          </div>
        </section>

        <section className="container py-14 md:py-20" id="ablauf">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Ablauf</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">In vier Phasen zum Start.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
            {phases.map((p) => (
              <div key={p.n} className="surface-card p-6">
                <div className="h-9 w-9 rounded-full gradient-primary text-primary-foreground grid place-items-center font-semibold mb-4">{p.n}</div>
                <h3 className="font-semibold mb-2">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-14 md:py-20 border-t border-border/40" id="vorlagen">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Kommunikationsvorlagen</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Fertige E-Mails zum Übernehmen.</h2>
            <p className="mt-4 text-muted-foreground">
              Platzhalter <code className="text-primary">{"{{Unternehmen}}"}</code> ersetzen, senden – fertig.
            </p>
          </div>
          <div className="grid gap-5 max-w-4xl mx-auto">
            <MailCard
              id="mitarbeitende"
              title="E-Mail an Mitarbeitende"
              hint="Nimmt die häufigste Sorge direkt vorweg: keine persönlichen Nutzungsdaten für den Arbeitgeber."
              body={employeeMail}
            />
            <MailCard
              id="fuehrung"
              title="E-Mail an die Unternehmensführung"
              hint="Argumentiert über Nacharbeit, Fehlerquote, Bearbeitungszeit und interne Fristen."
              body={managementMail}
            />
          </div>
        </section>

        <section className="container pb-20 md:pb-24">
          <div className="surface-card-elevated p-8 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">Einführung gemeinsam planen</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("einfuehrung")}>
                  <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto">
                  <Link to="/fuer-betriebsrat">Betriebsrat-Akzeptanz<ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <DemoLeadDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
