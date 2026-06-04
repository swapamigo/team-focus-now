import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, BarChart3, TrendingUp, Brain, Heart, Zap,
  ArrowRight, Check, X, Clock, Smile, Rocket, Eye, KeyRound, UserCheck, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";
import InterruptionCycle from "@/components/landing/InterruptionCycle";
import SocietyHealth from "@/components/landing/SocietyHealth";
import SocialProof from "@/components/landing/SocialProof";
import Faq from "@/components/landing/Faq";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import mockup from "@/assets/landing-mockup.jpg";

// Konsistente Leitzahlen – siehe internes Dashboard (193 → 125 min/Tag ≈ 35 %)
const kpis = [
  { value: "−35%", label: "Smartphone-Zeit" },
  { value: "+22%", label: "produktive Stunden" },
  { value: "8.7 / 10", label: "Mitarbeiter-Score" },
  { value: "5 Min", label: "Setup-Zeit" },
];

const comparison = {
  others: {
    title: "Klassische Bossware",
    badge: "Kontrolle",
    items: [
      { icon: Eye, text: "Screenshots & Bildschirm-Aufzeichnungen" },
      { icon: KeyRound, text: "Tastatureingaben werden mitgeschnitten" },
      { icon: X, text: "Mitarbeitende fühlen sich überwacht" },
      { icon: X, text: "Mehr Stress, höhere Fluktuation" },
      { icon: X, text: "Reine Bestrafung, keine Verbesserung" },
    ],
  },
  us: {
    title: "TeamFocus",
    badge: "Motivation",
    items: [
      { icon: Shield, text: "Keine Screenshots, keine Inhalte – nur Zeitdaten" },
      { icon: Lock, text: "Erfassung nur während der Arbeitszeit" },
      { icon: Trophy, text: "Belohnungen statt Bestrafung" },
      { icon: Heart, text: "Mitarbeitende lieben es – nachweislich" },
      { icon: TrendingUp, text: "Monatliche Verbesserung statt Stillstand" },
    ],
  },
};

const setupSteps = [
  { icon: Rocket, title: "Workspace anlegen", desc: "Eine Minute. Namen eingeben, fertig.", time: "1 Min" },
  { icon: Users, title: "Mitarbeitende einladen", desc: "Einen Link teilen – kein App-Store, kein IT-Aufwand.", time: "2 Min" },
  { icon: Sparkles, title: "Loslegen", desc: "Sofort sichtbare Team-Statistiken & erste Challenges starten.", time: "2 Min" },
];

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

const pricingPerks = [
  "Unbegrenzte Teams & Challenges",
  "Anonyme Team-Statistiken (k-Anonymität)",
  "Belohnungssystem inklusive",
  "Erfassung nur während Arbeitszeit",
  "DSGVO-konform, EU-Hosting",
  "Setup in 5 Minuten – ohne IT",
];

const trustLine = "Keine Kreditkarte · Setup in 5 Minuten · monatlich kündbar";

export default function Landing() {
  const { session, profile, role, loading } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  if (!loading && session) {
    const target = profile && !profile.onboarded ? "/onboarding/role" : role === "manager" ? "/manager" : "/app";
    return <Navigate to={target} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#calculator" className="hover:text-foreground transition-colors">ROI</a>
            <a href="#how" className="hover:text-foreground transition-colors">So funktioniert's</a>
            <a href="#why" className="hover:text-foreground transition-colors">Warum anders</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Anmelden</Link></Button>
            <Button asChild size="sm" className="shadow-sm"><Link to="/register">Kostenlos starten</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="container relative pt-24 pb-12 md:pt-32 md:pb-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Die mitarbeiterfreundlichste Bossware
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
            Mehr Fokus. Weniger Stress.<br />
            <span className="text-gradient animate-gradient-x">Höherer Umsatz.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            TeamFocus motiviert Ihre Mitarbeitenden – statt sie zu überwachen.
            Monat für Monat messbar weniger Smartphone-Ablenkung, mehr Konzentration und echte Eigenverantwortung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow group">
              <Link to="/register">Kostenlos starten <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60" onClick={() => setDemoOpen(true)}>
              Demo ansehen
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{trustLine} · 30 Tage gratis · 7 € / Mitarbeitendem / Monat</p>
        </div>

        {/* Product mockup */}
        <div className="container relative pb-12">
          <div className="relative mx-auto max-w-5xl animate-float">
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-[2rem]" />
            <div className="relative surface-card-elevated overflow-hidden rounded-2xl ring-1 ring-border/40">
              <img src={mockup} alt="TeamFocus Dashboard – Mockup" width={1920} height={1080} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-y border-border/40 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <div key={k.label} className="text-center">
              <div className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">{k.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 1) ROI Calculator – früh platzieren */}
      <RoiCalculator />

      {/* 2) Gesellschaftliche & gesundheitliche Dimension */}
      <SocietyHealth />

      {/* 3) Unterbrechungszyklus */}
      <InterruptionCycle />

      {/* 4) Warum anders */}
      <section className="container py-20 md:py-24 border-t border-border/40" id="why">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Warum TeamFocus anders ist</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Motivation schlägt Kontrolle.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Andere Bossware bestraft. TeamFocus belohnt. Das ist die Zukunft moderner Produktivität.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="glow-card p-7 border-destructive/20 bg-destructive/[0.02]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-muted-foreground">{comparison.others.title}</h3>
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">{comparison.others.badge}</span>
            </div>
            <ul className="space-y-3">
              {comparison.others.items.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-destructive/10 text-destructive grid place-items-center">
                    <X className="h-3 w-3" />
                  </span>
                  {it.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="glow-card p-7 border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02] relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gradient">{comparison.us.title}</h3>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">{comparison.us.badge}</span>
              </div>
              <ul className="space-y-3">
                {comparison.us.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center">
                      <Check className="h-3 w-3" />
                    </span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5) So funktioniert TeamFocus */}
      <HowItWorks />

      {/* 6) Setup */}
      <section className="container py-20 md:py-24 border-t border-border/40" id="setup">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 5 Minuten startklar</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Unglaublich einfach. Sofort einsatzbereit.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Keine IT, keine Schulungen, keine Verträge. Workspace anlegen, Link teilen, fertig.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {setupSteps.map((s, i) => (
            <div key={s.title} className="glow-card p-7 relative">
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full gradient-primary text-primary-foreground grid place-items-center text-sm font-semibold shadow-md">{i + 1}</div>
              <div className="flex items-start justify-between mb-4">
                <s.icon className="h-6 w-6 text-primary" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold bg-secondary px-2 py-0.5 rounded-full">{s.time}</span>
              </div>
              <h3 className="font-semibold mb-1.5 text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7) Benefits */}
      <section className="container py-20 md:py-24 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Vorteile auf einen Blick</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was Sie wirklich gewinnen.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div key={b.title} className="glow-card p-6 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mb-4 shadow-[var(--shadow-sm)]">
                <b.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1.5 text-lg">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8) Datenschutz */}
      <section className="container py-20 md:py-24 border-t border-border/40" id="privacy">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Datenschutz & Vertrauen</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Produktivität statt Überwachung.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Sechs Prinzipien, mit denen TeamFocus auch durch jede Betriebsratsprüfung kommt.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {privacyPoints.map((p) => (
            <div key={p.title} className="glow-card p-6">
              <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center mb-4">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5 text-lg">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9) Social Proof */}
      <SocialProof />

      {/* 10) Pricing */}
      <section className="container py-20 md:py-24 border-t border-border/40" id="pricing">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Einfache Preise</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein Plan. Alles dabei.</h2>
        </div>
        <div className="max-w-xl mx-auto glow-card p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">TeamFocus Pro</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-semibold tracking-tight">7&nbsp;€</span>
              <span className="text-muted-foreground">/ Mitarbeitendem / Monat</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">30 Tage gratis testen · monatlich kündbar · ohne Setup-Gebühr</p>
            <ul className="space-y-3 mb-8">
              {pricingPerks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="w-full h-12 shadow-glow"><Link to="/register">Kostenlos starten</Link></Button>
            <p className="text-center text-xs text-muted-foreground mt-3">{trustLine}</p>
          </div>
        </div>
      </section>

      {/* 11) FAQ */}
      <Faq />

      {/* 12) Final CTA */}
      <section className="container pb-24">
        <div className="surface-card-elevated p-10 md:p-16 text-center relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Bereit für mehr Fokus im Team?</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-lg leading-relaxed">
              Starten Sie 30 Tage gratis. Keine Kreditkarte, kein Risiko – nur fokussiertere Teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow"><Link to="/register">Kostenlos starten</Link></Button>
              <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60" onClick={() => setDemoOpen(true)}>
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
