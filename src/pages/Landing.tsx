import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, BarChart3, TrendingUp, Brain, Heart, Zap,
  ArrowRight, Check, X, Clock, Rocket, Eye, KeyRound, UserCheck, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";
import InterruptionCycle from "@/components/landing/InterruptionCycle";
import SocietyHealth from "@/components/landing/SocietyHealth";
import Faq from "@/components/landing/Faq";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import SocialProofStrip from "@/components/landing/SocialProofStrip";
import RewardsSection from "@/components/landing/RewardsSection";
import PricingSection from "@/components/landing/PricingSection";
import LandingHeader from "@/components/landing/LandingHeader";
import focusedImg from "@/assets/employee-focused.jpg";
import stressedImg from "@/assets/employee-stressed.jpg";

const kpis = [
  { value: "−35%", label: "Smartphone-Zeit" },
  { value: "+43%", label: "produktive Stunden" },
  { value: "DSGVO", label: "konform" },
  { value: "5 Min", label: "Setup-Zeit" },
];

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
    title: "TeamFocus", badge: "Motivation",
    items: [
      { icon: Shield, text: "Keine Screenshots, keine Inhalte – nur Zeitdaten" },
      { icon: Lock, text: "Erfassung nur während der Arbeitszeit" },
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
  { icon: TrendingUp, title: "Messbare Wirkung", desc: "Monat für Monat weniger Ablenkung." },
];

const privacyPoints = [
  { icon: BarChart3, label: "Nur Team-Aggregate" },
  { icon: ShieldCheck, label: "k-Anonymität (k=5)" },
  { icon: Clock, label: "Nur Arbeitszeit" },
  { icon: Shield, label: "Keine Inhalte" },
  { icon: UserCheck, label: "Freiwillig & DSGVO" },
  { icon: Sparkles, label: "Privacy-by-Design" },
];

const trustLine = "Keine Kreditkarte · Setup in 5 Minuten · monatlich kündbar";

export default function Landing() {
  const { session, profile, role, loading } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  if (!loading && session) {
    const hasProto = (() => { try { return localStorage.getItem("prototype_access") === "1"; } catch { return false; } })();
    if (hasProto) {
      const target = profile && !profile.onboarded ? "/onboarding/role" : role === "manager" ? "/manager" : "/app";
      return <Navigate to={target} replace />;
    }
    // Eingeloggte Besucher dürfen die Landingpage normal anschauen.
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onDemo={() => setDemoOpen(true)} />

      {/* Hero — ohne Mockup-Bild */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="container relative pt-16 pb-12 md:pt-24 md:pb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            DSGVO-konform nach deutschem Datenschutzstandard
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
            Mehr Fokus. Weniger Stress.<br />
            <span className="text-gradient animate-gradient-x">Höherer Umsatz.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed px-2">
            TeamFocus motiviert Ihre Mitarbeitenden – statt sie zu überwachen.
            Monat für Monat messbar weniger Smartphone-Ablenkung, mehr Konzentration und echte Eigenverantwortung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto">
              <Link to="/register?next=/checkout">Kostenlos starten <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto" onClick={() => setDemoOpen(true)}>
              Demo ansehen
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{trustLine} · 30 Tage gratis · ab 2,99 € / MA / Monat</p>
        </div>
      </section>

      {/* Social Proof Strip — direkt nach Hero */}
      <SocialProofStrip />

      {/* ROI Calculator */}
      <RoiCalculator />

      {/* KPI strip */}
      <section className="border-y border-border/40 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <div key={k.label} className="text-center">
              <div className="text-2xl md:text-4xl font-semibold tracking-tight text-gradient">{k.value}</div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </div>
      </section>

      <InterruptionCycle />

      {/* Warum anders */}
      <section className="container py-16 md:py-24 border-t border-border/40" id="why">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Warum TeamFocus anders ist</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Motivation schlägt Kontrolle.</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Andere Bossware bestraft. TeamFocus belohnt. Entwickelt mit ADHS-Experte und Buchautor{" "}
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

      <HowItWorks />
      <SocietyHealth />
      <RewardsSection />

      {/* Setup */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="setup">
        <div className="max-w-3xl mx-auto surface-card p-7 md:p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 5 Minuten startklar</p>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">Sofort einsatzbereit.</h2>
          <Button asChild size="lg" className="h-12 px-8 shadow-glow group mt-3">
            <Link to="/register?next=/checkout">Jetzt ausprobieren <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">{trustLine}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-16 md:py-24 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Vorteile auf einen Blick</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Mehr Fokus, weniger Stress.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <div key={b.title} className="glow-card p-4 md:p-5 text-center animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl gradient-primary grid place-items-center mb-3 shadow-sm mx-auto">
                <b.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Datenschutz */}
      <section className="container py-16 md:py-24 border-t border-border/40" id="privacy">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Datenschutz & Vertrauen</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Produktivität statt Überwachung.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {privacyPoints.map((p) => (
            <div key={p.label} className="surface-card p-4 text-center">
              <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center mb-2 mx-auto">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-medium leading-tight">{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingSection />
      <Faq />

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
              Starten Sie 30 Tage gratis. Keine Kreditkarte, kein Risiko – nur fokussiertere Teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto"><Link to="/register?next=/checkout">Kostenlos starten</Link></Button>
              <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto" onClick={() => setDemoOpen(true)}>
                Demo ansehen
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">{trustLine}</p>
          </div>
        </div>
      </section>

      <Footer />
      <DemoLeadDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
