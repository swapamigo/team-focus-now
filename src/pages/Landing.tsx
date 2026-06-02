import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, BarChart3, TrendingUp, Brain, Heart, Zap,
  ArrowRight, Check, X, Star, Clock, Smile, Rocket, Eye, KeyRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import mockup from "@/assets/landing-mockup.jpg";

const kpis = [
  { value: "+27%", label: "produktive Stunden" },
  { value: "−42%", label: "Smartphone-Zeit" },
  { value: "9.1 / 10", label: "Mitarbeiter-Score" },
  { value: "5 Min", label: "Setup-Zeit" },
];

const comparison = {
  others: {
    title: "Klassische Bossware",
    badge: "Kontrolle",
    color: "destructive",
    items: [
      { icon: Eye, text: "Screenshots & Bildschirm-Aufzeichnungen" },
      { icon: KeyRound, text: "Tastatureingaben werden mitgeschnitten" },
      { icon: X, text: "Mitarbeiter fühlen sich überwacht" },
      { icon: X, text: "Mehr Stress, höhere Fluktuation" },
      { icon: X, text: "Reine Bestrafung, keine Verbesserung" },
    ],
  },
  us: {
    title: "Team Focus",
    badge: "Motivation",
    color: "primary",
    items: [
      { icon: Shield, text: "Keine Screenshots, keine Inhalte – nur Zeitdaten" },
      { icon: Lock, text: "Erfassung nur während der Arbeitszeit" },
      { icon: Trophy, text: "Belohnungen statt Bestrafung" },
      { icon: Heart, text: "Mitarbeiter lieben es – nachweislich" },
      { icon: TrendingUp, text: "Monatliche Verbesserung statt Stillstand" },
    ],
  },
};

const setupSteps = [
  { icon: Rocket, title: "Workspace anlegen", desc: "Eine Minute. Name eingeben, fertig.", time: "1 Min" },
  { icon: Users, title: "Mitarbeiter einladen", desc: "Einen Link teilen – kein App-Store, kein IT-Aufwand.", time: "2 Min" },
  { icon: Sparkles, title: "Loslegen", desc: "Sofort sichtbare Team-Statistiken & erste Challenges starten.", time: "2 Min" },
];

const benefits = [
  { icon: Brain, title: "Weniger Stress", desc: "Klare Fokus-Phasen statt ständiger Erreichbarkeit." },
  { icon: Heart, title: "Mitarbeiter-freundlich", desc: "Belohnungssystem schafft echte Motivation – nicht Druck." },
  { icon: Zap, title: "Mehr Fokus", desc: "Bis zu 30 % mehr produktive Zeit pro Tag." },
  { icon: TrendingUp, title: "Stetige Verbesserung", desc: "Monat für Monat messbar weniger Ablenkung." },
  { icon: Smile, title: "Höhere Zufriedenheit", desc: "Mitarbeitende gehen entspannter nach Hause." },
  { icon: Trophy, title: "Team-Wettbewerbe", desc: "Faire Challenges, gewinnbare Rewards." },
];

const features = [
  { icon: Trophy, title: "Belohnungssystem", desc: "Echte Anreize für fokussierte Arbeit – vom Manager frei definierbar." },
  { icon: Users, title: "Team-Challenges", desc: "Teams treten in fairen Wettbewerben gegeneinander an." },
  { icon: BarChart3, title: "Anonyme Aggregate", desc: "Manager sehen nur Team-Trends – nie individuelle Werte." },
  { icon: Clock, title: "Nur Arbeitszeit", desc: "Erfasst wird ausschließlich während definierter Arbeitszeiten." },
  { icon: Shield, title: "Privacy-by-Design", desc: "Keine Screenshots, keine Keylogger, keine Inhalte." },
  { icon: Sparkles, title: "Fokus-Zeiten", desc: "Definiere High-Focus-Phasen mit speziellen Regeln." },
];

const testimonials = [
  { quote: "Endlich eine Bossware, vor der sich niemand fürchtet. Das Team feiert die Challenges – produktiver waren wir noch nie.", name: "Lena R.", role: "Head of Operations" },
  { quote: "Datenschutz ernst gemeint. Kein Mikromanagement, sondern echte Eigenverantwortung. Wir haben fast keine Krankmeldungen mehr.", name: "Jonas K.", role: "CTO, B2B-SaaS" },
  { quote: "Die monatliche Verbesserung ist verblüffend. Mitarbeiter werden besser, nicht überwachter.", name: "Maria S.", role: "Geschäftsführerin" },
];

const pricingPerks = [
  "Unbegrenzte Teams & Challenges",
  "Anonyme Team-Statistiken",
  "Belohnungssystem inklusive",
  "Erfassung nur während Arbeitszeit",
  "DSGVO-konform, EU-Hosting",
  "Setup in 5 Minuten – ohne IT",
];

export default function Landing() {
  const { session, profile, role, loading } = useAuth();
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
            <a href="#why" className="hover:text-foreground transition-colors">Warum anders</a>
            <a href="#setup" className="hover:text-foreground transition-colors">Setup</a>
            <a href="#calculator" className="hover:text-foreground transition-colors">ROI</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
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
            Team Focus motiviert Ihre Mitarbeiter – statt sie zu überwachen.
            Monat für Monat messbar weniger Smartphone-Ablenkung, mehr Konzentration und echte Eigenverantwortung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow group">
              <Link to="/register">Kostenlos starten <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60"><Link to="/login">Mit Einladung beitreten</Link></Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">7 € / Mitarbeiter / Monat · 30 Tage gratis · Setup in 5 Minuten</p>
        </div>

        {/* Product mockup */}
        <div className="container relative pb-20">
          <div className="relative mx-auto max-w-5xl animate-float">
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-[2rem]" />
            <div className="relative surface-card-elevated overflow-hidden rounded-2xl ring-1 ring-border/40">
              <img src={mockup} alt="Team Focus Dashboard – Mockup" width={1920} height={1080} className="w-full h-auto" />
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

      {/* Why different – Vergleich */}
      <section className="container py-24" id="why">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Warum Team Focus anders ist</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Motivation schlägt Kontrolle.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Andere Bossware bestraft. Team Focus belohnt. Das ist die Zukunft moderner Produktivität.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Others */}
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
          {/* Us */}
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

      {/* Setup – so einfach */}
      <section className="container py-24 border-t border-border/40" id="setup">
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

      {/* Benefits */}
      <section className="container py-24 border-t border-border/40">
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

      {/* ROI Calculator */}
      <RoiCalculator />

      {/* Features */}
      <section className="container py-24 border-t border-border/40" id="features">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Funktionen</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Alles drin. Nichts überflüssig.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glow-card p-6">
              <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5 text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Stimmen aus der Praxis</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Teams, die wieder Fokus haben.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
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
      </section>

      {/* Pricing */}
      <section className="container py-24 border-t border-border/40" id="pricing">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Einfache Preise</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein Plan. Alles dabei.</h2>
        </div>
        <div className="max-w-xl mx-auto glow-card p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Team Focus Pro</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-semibold tracking-tight">7&nbsp;€</span>
              <span className="text-muted-foreground">/ Mitarbeiter / Monat</span>
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
            <Button asChild size="lg" className="w-full h-12 shadow-glow"><Link to="/register">Jetzt 30 Tage gratis testen</Link></Button>
          </div>
        </div>
      </section>

      {/* Privacy CTA */}
      <section className="container pb-24">
        <div className="surface-card-elevated p-10 md:p-16 text-center relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Produktivität statt Überwachung.</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-lg leading-relaxed">
              Keine Inhalte. Keine Screenshots. Keine Tastatureingaben. Erfasst wird ausschließlich während der Arbeitszeit – mit voller Zustimmung.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow"><Link to="/register">Workspace erstellen</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60"><Link to="/login">Demo ansehen</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
