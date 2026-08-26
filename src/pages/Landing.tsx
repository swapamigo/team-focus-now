import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, TrendingUp, Brain, Heart, Zap,
  ArrowRight, Check, X, Clock, Rocket, Eye, KeyRound, ShieldCheck, CalendarClock, Smartphone,
} from "lucide-react";

import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import ContactSection from "@/components/landing/ContactSection";

import InterruptionCycle from "@/components/landing/InterruptionCycle";
import SocietyHealth from "@/components/landing/SocietyHealth";
import Faq, { faqItems } from "@/components/landing/Faq";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import { openCallBooking, trackClick } from "@/lib/track";

import RewardsSection from "@/components/landing/RewardsSection";
import HabitFeatures from "@/components/landing/HabitFeatures";

import LandingHeader from "@/components/landing/LandingHeader";
import Studies from "@/components/landing/Studies";
import WorksCouncil from "@/components/landing/WorksCouncil";
import PrivacySection from "@/components/landing/PrivacySection";
import focusedImg from "@/assets/employee-focused.jpg";
import stressedImg from "@/assets/employee-stressed.jpg";
import heroPhonesBg from "@/assets/team-throwing-phones.png.asset.json";
import step1Img from "@/assets/tf_step1.png.asset.json";
import step2Img from "@/assets/tf_step2.png.asset.json";
import step3Img from "@/assets/tf_step_teamdaten.png.asset.json";
import step4Img from "@/assets/tf_step_belohnung.png.asset.json";



const comparison = {
  others: {
    title: "Klassische Bossware", badge: "Kontrolle",
    items: [
      { icon: Eye, text: "Screenshots & Bildschirm-Aufzeichnungen" },
      { icon: KeyRound, text: "Tastatureingaben werden mitgeschnitten" },
      { icon: X, text: "Mitarbeitende fühlen sich überwacht" },
      { icon: X, text: "Mehr Stress, höhere Fluktuation" },
      { icon: X, text: "Reine Bestrafung, keine Verbesserung" },
    ],
  },
  us: {
    title: "TeamFokus", badge: "Motivation",
    items: [
      { icon: Shield, text: "Keine Screenshots, keine Inhalte – nur Zeitdaten" },
      { icon: Clock, text: "Erfassung ausschließlich während der Arbeitszeit – danach nie" },
      { icon: Trophy, text: "Belohnungen statt Bestrafung" },
      { icon: Heart, text: "Mitarbeitende lieben es – nachweislich" },
      { icon: TrendingUp, text: "Monatliche Verbesserung statt Stillstand" },
    ],
  },
};

const benefits = [
  { icon: Brain, title: "Weniger Stress", desc: "Klare Fokus-Phasen statt ständiger Erreichbarkeit." },
  { icon: Zap, title: "Mehr Fokus", desc: "Rund 22 % mehr produktive Zeit pro Tag." },
  { icon: Heart, title: "Mitarbeiter-freundlich", desc: "Belohnung statt Druck – echte Motivation." },
  { icon: TrendingUp, title: "Messbare Wirkung", desc: "Monat für Monat mehr gesammelte Fokuszeit." },
];


const trustLine = "Freiwillige Teilnahme · Setup in 5 Minuten · anonym ab 5 Personen";

export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);
  // Der Sprung in die App erfolgt nur über den expliziten Header-Button.

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    // Warte, bis alle Sektionen gerendert sind (Bilder, Dialoge etc.)
    const timer = setTimeout(scrollToHash, 100);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="TeamFokus – Fokuszeit im Team ohne Handyverbot | DSGVO-konform"
        description="Kein pauschales Handyverbot. Keine persönlichen Nutzungsdaten für den Arbeitgeber. Echte Team-Belohnungen – freiwillig, anonym ab 5 Personen, Hosting in Deutschland."

        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }}
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} onBookCall={() => openCallBooking("landing")} />

      <main>
      {/* Hero — Eigenverantwortung statt Handyverbot */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
          style={{ backgroundImage: `url(${heroPhonesBg.url})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/85 to-background pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
        <div className="container relative pt-16 pb-12 md:pt-24 md:pb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
            <Sparkles className="h-4 w-4" />
            Genug vom Handyverbot?
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
            Eigenverantwortung<br />
            <span className="text-gradient animate-gradient-x">statt Handyverbot.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed px-2">
            Du findest, dass ein pauschales Handyverbot mehr Stress als Nutzen verursacht? Wir auch.
            TeamFokus ersetzt Kontrolle durch Eigenverantwortung: Ihr vereinbart freiwillig gemeinsame
            Fokuszeiten und schaltet als Team attraktive Belohnungen frei.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 mt-8">
            <Button size="lg" className="h-14 px-8 text-base shadow-glow w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
              <Sparkles className="mr-2 h-5 w-5" />
              Demo ansehen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto">
              <Link to="/fuer-mitarbeitende">
                <Heart className="mr-2 h-5 w-5" />
                Was habe ich davon?
              </Link>
            </Button>
          </div>

          {/* Trust-Leiste direkt unter den CTAs */}
          <div className="mt-8 max-w-3xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-start gap-3 rounded-2xl border border-success/30 bg-success/5 backdrop-blur px-5 py-3 text-left">
              <Lock className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                <strong>Wichtig:</strong> Dein Arbeitgeber erhält keine persönlichen Nutzungsdaten, keine
                App-Verläufe und keine Inhalte. Er erfährt ausschließlich, welches Team eine Belohnung
                freigeschaltet hat.
              </p>
            </div>
            <div className="inline-flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur px-5 py-3 text-left">
              <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                <strong>Kein Verbot, keine Abgabe:</strong> Dein Handy bleibt bei dir. Arbeits-Apps und
                -Websites (Teams, Outlook, Scanner, Navigation) sind freigegeben und stoppen die Fokuszeit nie –
                gemessen wird ausschließlich während der Arbeitszeit.
              </p>
            </div>
          </div>

        </div>
      </section>



      {/* Einstiege je Zielgruppe */}
      <section className="container py-10 md:py-14 border-b border-border/40" id="einstiege">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { to: "/fuer-mitarbeitende", t: "Für Mitarbeitende", d: "Kein Handyverbot, keine Einzeldaten – echte Team-Belohnungen." },
            { to: "/fuer-arbeitgeber", t: "Für Unternehmen", d: "Weniger Nacharbeit, weniger Fehler, kürzere Bearbeitungszeiten." },
            { to: "/fuer-betriebsrat", t: "Für Betriebsrat", d: "Freiwilligkeit, k-Anonymität, Vorlagen für die Mitbestimmung." },
            { to: "/einfuehrung", t: "Einführung", d: "Ablauf in vier Phasen inklusive fertiger Kommunikationsvorlagen." },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="surface-card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <p className="font-semibold flex items-center gap-1.5">{c.t}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Produktbeschreibung */}
      <section className="container py-10 md:py-14 border-b border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Jeder weiß es: Ein Handyverbot funktioniert nicht. Es erzeugt Frustration, wird umgangen und löst das eigentliche Problem nicht. TeamFokus dreht das Prinzip deshalb um: Statt Ablenkung zu bestrafen, sammelt jedes Team Fokuszeit. Solange konzentriert gearbeitet wird, läuft die Fokus-Uhr weiter – greift jemand privat zum Handy oder zur privaten Website am PC, stoppt sie und in High-Focus-Phasen wird sogar Zeit abgezogen. Alles anonym, freiwillig und nur während der Arbeitszeit. Sichtbar wird am Ende ausschließlich, welches Team seine vereinbarte Belohnung freigeschaltet hat.
          </p>
        </div>
      </section>

      {/* Betriebliche Wirkung */}
      <section className="container py-12 md:py-16 border-b border-border/40" id="wirkung">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Für die Unternehmensführung</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Was sich betrieblich verbessert.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            "Weniger notwendige Korrekturen und Nacharbeiten",
            "Niedrigere Fehler- beziehungsweise Ausnahmequote",
            "Kürzere durchschnittliche Bearbeitungszeit",
            "Bessere Einhaltung interner Fristen",
          ].map((t) => (
            <div key={t} className="surface-card p-5 flex items-start gap-3">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-success" />
              <p className="text-sm leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link to="/fuer-arbeitgeber">Details für Unternehmen<ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ROI Calculator */}
      <RoiCalculator />


      {/* Visuelle Übersicht — So funktioniert TeamFokus */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="how">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">So funktioniert TeamFokus</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            In 4 Schritten zu mehr Fokus im Team.
          </h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[
            { img: step1Img, alt: "Schritt 1: Fokuszeit sichtbar machen – keine Inhalte, keine Screenshots, keine Überwachung." },
            { img: step2Img, alt: "Schritt 2: Teams treten freiwillig an – die meiste gesammelte Fokuszeit gewinnt." },
            { img: step3Img, alt: "Schritt 3: Nur anonyme Teamdaten – keine Namen, keine Inhalte, keine Einzelkontrolle." },
            { img: step4Img, alt: "Schritt 4: Gewinnerteam wird belohnt – Team-Lunch, Gutschein, Tankgutschein oder Event-Tickets." },
          ].map((s, i) => (
            <div key={i} className="surface-card p-5 md:p-7">
              <img src={s.img.url} alt={s.alt} loading="lazy" className="w-full h-auto rounded-xl block" />
            </div>
          ))}
        </div>
      </section>

      {/* Betriebsrat & Mitarbeitende */}
      <WorksCouncil />

      {/* Unterbrechungszyklus */}
      <InterruptionCycle />


      {/* Warum anders */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="why">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Warum TeamFokus anders ist</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Motivation schlägt Kontrolle.</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Andere Bossware bestraft. TeamFokus belohnt. Entwickelt mit ADHS-Experte und Buchautor{" "}
            <a href="https://www.amazon.es/Leading-yourself-ADHD-fighting-yourself/dp/B0GX9F2LGX" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Chris Sorg</a>.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <div className="glow-card overflow-hidden border-destructive/20 bg-destructive/[0.02]">
            <div className="relative h-44 md:h-56 overflow-hidden">
              <img src={stressedImg} alt="Gestresster Mitarbeitender" loading="lazy" className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-semibold backdrop-blur">{comparison.others.badge}</span>
            </div>
            <div className="p-6 md:p-7">
              <h3 className="text-lg font-semibold text-muted-foreground mb-4">{comparison.others.title}</h3>
              <ul className="space-y-3">
                {comparison.others.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-destructive/10 text-destructive grid place-items-center"><X className="h-3 w-3" /></span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="glow-card overflow-hidden border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02] relative">
            <div className="absolute -top-16 -right-16 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative h-44 md:h-56 overflow-hidden">
              <img src={focusedImg} alt="Glücklicher fokussierter Mitarbeitender" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold backdrop-blur">{comparison.us.badge}</span>
            </div>
            <div className="p-6 md:p-7 relative">
              <h3 className="text-lg font-semibold text-gradient mb-4">{comparison.us.title}</h3>
              <ul className="space-y-3">
                {comparison.us.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center"><Check className="h-3 w-3" /></span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Studies />
      <PrivacySection />
      <SocietyHealth />
      <HabitFeatures />
      <RewardsSection />


      {/* Setup */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="setup">
        <div className="max-w-3xl mx-auto surface-card p-7 md:p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 5 Minuten startklar</p>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">Sofort einsatzbereit.</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-3">
            <Button size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
              <Sparkles className="mr-1.5 h-4 w-4" />Demo ansehen <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => openCallBooking("landing")}>
              <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{trustLine}</p>

        </div>
      </section>


      
      <Faq />

      <ContactSection />

      {/* Final CTA */}
      <section className="container pb-20 md:pb-24">
        <div className="surface-card-elevated p-8 md:p-16 text-center relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-5xl font-semibold tracking-tight mb-4">Bereit für mehr Fokus im Team?</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
              Kein pauschales Handyverbot. Keine persönlichen Nutzungsdaten für den Arbeitgeber. Echte Team-Belohnungen.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
                <Sparkles className="mr-1.5 h-4 w-4" />Demo ansehen
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => openCallBooking("landing")}>
                <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">{trustLine}</p>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <DemoLeadDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
