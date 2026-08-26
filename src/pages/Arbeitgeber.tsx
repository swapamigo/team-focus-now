import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, Clock, Gauge,
  ShieldCheck, Sparkles, Target, TrendingUp, Users, XCircle,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import RoiCalculator from "@/components/landing/RoiCalculator";
import { openCallBooking, trackClick } from "@/lib/track";
import heroImg from "@/assets/team-meeting-office.png.asset.json";

const goals = [
  {
    icon: ClipboardCheck,
    title: "Weniger Korrekturen und Nacharbeiten",
    desc: "Unterbrochene Arbeit erzeugt Nacharbeit. Längere ungestörte Fokusblöcke reduzieren die Anzahl notwendiger Korrekturen.",
  },
  {
    icon: XCircle,
    title: "Niedrigere Fehler- und Ausnahmequote",
    desc: "Weniger Kontextwechsel bedeutet weniger Übertragungs-, Eingabe- und Prüffehler – und damit weniger Ausnahmen im Prozess.",
  },
  {
    icon: Clock,
    title: "Kürzere durchschnittliche Bearbeitungszeit",
    desc: "Aufgaben werden in einem Zug fertig statt in vielen Anläufen. Die Durchlaufzeit pro Auftrag sinkt messbar.",
  },
  {
    icon: Gauge,
    title: "Bessere Einhaltung interner Fristen",
    desc: "Planbare Fokuszeiten machen Zusagen realistischer – interne Termine werden zuverlässiger gehalten.",
  },
];

const notVisible = [
  "Keine individuellen Fokus- oder Nutzungswerte",
  "Keine App-Verläufe, Nachrichten, Screenshots oder Tastatureingaben",
  "Keine Standortdaten, keine Auswertung außerhalb der Arbeitszeit",
  "Kein Ranking einzelner Mitarbeitender – auch nicht für die Geschäftsführung",
];

const visible = [
  "Welches Team eine vereinbarte Belohnung freigeschaltet hat",
  "Die von Ihnen selbst definierten Team-Ziele und Belohnungen",
  "Ob eine Challenge läuft, wann sie endet und wie viele Teams teilnehmen",
];

const steps = [
  { n: "1", t: "Ziel und Belohnung festlegen", d: "Sie definieren pro Team ein gemeinsames Fokusziel und die Belohnung bei Erreichen." },
  { n: "2", t: "Teams entscheiden freiwillig", d: "Mitarbeitende nehmen freiwillig teil. Arbeits-Apps und -Programme werden freigegeben." },
  { n: "3", t: "Belohnung wird freigeschaltet", d: "Erreicht ein Team das Ziel, sehen Sie ausschließlich diese Freischaltung – keine Einzeldaten." },
];

export default function Arbeitgeber() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="TeamFokus für Unternehmensführung – weniger Fehler, kürzere Durchlaufzeiten"
        description="Kein pauschales Handyverbot, keine persönlichen Nutzungsdaten für den Arbeitgeber. Weniger Nacharbeit, niedrigere Fehlerquote, kürzere Bearbeitungszeiten und zuverlässigere interne Fristen."
        path="/fuer-arbeitgeber"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: "https://teamfokus.app/" },
            { "@type": "ListItem", position: 2, name: "Für Unternehmensführung", item: "https://teamfokus.app/fuer-arbeitgeber" },
          ],
        }}
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none" style={{ backgroundImage: `url(${heroImg.url})` }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-14 md:pb-20 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
              <ShieldCheck className="h-4 w-4" />
              Kein Handyverbot · Keine persönlichen Nutzungsdaten · Echte Team-Belohnungen
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              Fokussierter arbeiten –<br />
              <span className="text-gradient animate-gradient-x">ohne Kontrolle, ohne Verbote.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Handyverbote werden nicht eingehalten und erzeugen Frustration, ohne die Nutzung nachweislich zu senken
              (Whelan &amp; Turel, 2024). TeamFokus setzt stattdessen auf freiwillige Fokus-Challenges mit
              Team-Belohnungen – und liefert Ihnen genau das, was betrieblich zählt.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("arbeitgeber")}>
                <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
                <Sparkles className="mr-1.5 h-4 w-4" />Demo ansehen
              </Button>
            </div>
          </div>
        </section>

        {/* Betriebliche Ziele */}
        <section className="container py-14 md:py-20" id="ziele">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Wirkung, die zählt</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Vier Ziele, die messbar besser werden.</h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              TeamFokus verbessert nicht „Anwesenheit“, sondern die Qualität der Arbeitszeit.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
            {goals.map((g) => (
              <div key={g.title} className="surface-card p-6 md:p-7">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Was Sie sehen / nicht sehen */}
        <section className="container py-14 md:py-20 border-t border-border/40" id="datenzugriff">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Ihr Datenzugriff</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Sie erfahren nur das Ergebnis.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <div className="glow-card p-6 md:p-7 border-destructive/20 bg-destructive/[0.02]">
              <h3 className="font-semibold mb-4 text-muted-foreground">Das sehen Sie nie</h3>
              <ul className="space-y-3">
                {notVisible.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glow-card p-6 md:p-7 border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02]">
              <h3 className="font-semibold mb-4 text-gradient">Das sehen Sie</h3>
              <ul className="space-y-3">
                {visible.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-success" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Details zur Architektur:{" "}
            <Link to="/datenschutz" className="text-primary underline underline-offset-2">Datenschutz &amp; Sicherheit</Link>
          </p>
        </section>

        {/* Ablauf */}
        <section className="container py-14 md:py-20 border-t border-border/40" id="ablauf">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">So läuft es bei Ihnen</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Drei Schritte, kein IT-Projekt.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.n} className="surface-card p-6">
                <div className="h-9 w-9 rounded-full gradient-primary text-primary-foreground grid place-items-center font-semibold mb-4">{s.n}</div>
                <h3 className="font-semibold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link to="/einfuehrung"><Users className="mr-1.5 h-4 w-4" />Einführung &amp; Kommunikation ansehen</Link>
            </Button>
          </div>
        </section>

        {/* ROI */}
        <RoiCalculator />

        {/* CTA */}
        <section className="container py-14 md:py-20">
          <div className="surface-card-elevated p-8 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">Passt TeamFokus zu Ihren Prozessen?</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                In einem kurzen Gespräch klären wir Ihre Ausgangslage, sinnvolle Ziele pro Team und die
                Einführung mit Betriebsrat.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("arbeitgeber-cta")}>
                  <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto">
                  <Link to="/fuer-betriebsrat"><TrendingUp className="mr-1.5 h-4 w-4" />Betriebsrat-Akzeptanz<ArrowRight className="ml-1 h-4 w-4" /></Link>
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
