import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, BarChart3, TrendingUp, Brain, Target, Zap, Euro, Smile,
  ArrowRight, Check, Star, Clock, LineChart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import mockup from "@/assets/landing-mockup.jpg";

const kpis = [
  { value: "+27%", label: "produktive Stunden" },
  { value: "−42%", label: "Smartphone-Zeit" },
  { value: "9.1 / 10", label: "Mitarbeiter-Score" },
  { value: "100%", label: "DSGVO-konform" },
];

const benefits = [
  { icon: Brain, title: "Weniger Stress", desc: "Klare Fokus-Phasen entlasten Mitarbeitende und reduzieren Reizüberflutung." },
  { icon: Target, title: "Weniger Fehler", desc: "Höhere Konzentration senkt nachweislich Fehlerraten in Fach- und Wissensarbeit." },
  { icon: Zap, title: "Fokussiertere Teams", desc: "Spielerische Anreize statt Kontrolle erzeugen intrinsische Motivation." },
  { icon: TrendingUp, title: "Höhere Effizienz", desc: "Bis zu 30 % mehr produktive Zeit pro Tag durch reduzierte Ablenkung." },
  { icon: Smile, title: "Zufriedenheit", desc: "Mitarbeitende erleben mehr Flow – und gehen entspannter nach Hause." },
  { icon: Euro, title: "Umsatzsteigerung", desc: "Fokussierte Stunden zahlen direkt auf Ergebnis, Umsatz und Marge ein." },
];

const features = [
  { icon: Trophy, title: "Team-Wettbewerbe", desc: "Teams treten in fairen Challenges um die geringste Ablenkungszeit an." },
  { icon: Shield, title: "Privacy-by-Design", desc: "Keine Inhalte, keine Screenshots, keine Tastatureingaben – nur aggregierte Zeitwerte." },
  { icon: Sparkles, title: "High-Focus-Zeiten", desc: "Definiere fokussierte Zeitfenster, in denen private Nutzung doppelt zählt." },
  { icon: Users, title: "Anonyme Teams", desc: "Mitarbeitende sehen nur Team-Aggregate – nie individuelle Werte anderer." },
  { icon: BarChart3, title: "Klare Statistiken", desc: "Wochenverlauf, Heatmap und persönliche Fortschritte auf einen Blick." },
  { icon: Lock, title: "Freiwillige Teilnahme", desc: "DSGVO-konform mit expliziter Zustimmung und jederzeitigem Widerruf." },
];

const steps = [
  { icon: Users, title: "Workspace anlegen", desc: "In 2 Minuten Team einrichten, Mitarbeitende per Code einladen." },
  { icon: Clock, title: "Fokuszeiten definieren", desc: "Arbeitszeiten, Pausen, Whitelist und High-Focus-Fenster konfigurieren." },
  { icon: LineChart, title: "Fortschritt messen", desc: "Anonyme Team-KPIs zeigen Woche für Woche mehr Fokus und mehr Output." },
];

const testimonials = [
  { quote: "Team Focus hat unsere Meetings ruhiger und unsere Deep-Work-Phasen produktiver gemacht. Nach 3 Monaten messbar mehr Output.", name: "Lena R.", role: "Head of Operations" },
  { quote: "Endlich ein Tool, das Datenschutz ernst meint. Kein Mikromanagement, sondern echte Eigenverantwortung im Team.", name: "Jonas K.", role: "CTO, B2B-SaaS" },
  { quote: "Die Challenges sind Gold wert. Plötzlich wollen alle die fokussierteste Stunde der Woche.", name: "Maria S.", role: "Team Lead" },
];

const proofs = ["Mustermann GmbH", "Nordlicht AG", "Studio Helix", "Atlas Logistik", "Codeberg & Co.", "Linea Beratung"];

const pricingPerks = [
  "Unbegrenzte Mitarbeitende & Teams",
  "Anonyme Team-Statistiken & Heatmaps",
  "High-Focus-Zeiten & Whitelist",
  "Challenges & Rewards-System",
  "DSGVO-konform, Hosting in der EU",
  "E-Mail-Support innerhalb von 24 h",
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
            <a href="#features" className="hover:text-foreground transition-colors">Funktionen</a>
            <a href="#how" className="hover:text-foreground transition-colors">So funktioniert's</a>
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
            Privacy-by-Design · DSGVO-konform · Hosting in der EU
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
            Mehr Fokus, <span className="text-gradient animate-gradient-x">mehr Umsatz.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Team Focus ist das Produktivitätssystem für moderne Unternehmen.
            Weniger Smartphone-Ablenkung, mehr Konzentration, messbar mehr Ergebnis – ganz ohne Überwachung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow group">
              <Link to="/register">Workspace erstellen <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60"><Link to="/login">Mit Einladung beitreten</Link></Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">7 € / Mitarbeiter / Monat · 30 Tage gratis testen · keine Kreditkarte</p>
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

      {/* Social Proof */}
      <section className="border-b border-border/40">
        <div className="container py-12">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Vertraut von fokussierten Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 opacity-60">
            {proofs.map((p) => (
              <span key={p} className="text-sm font-semibold text-foreground/80 hover:opacity-100 transition-opacity">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="container py-24" id="features">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Mehrwert für Unternehmen</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Fokus zahlt sich aus.</h2>
          <p className="mt-4 text-muted-foreground text-lg">Konzentrierte Mitarbeitende treffen bessere Entscheidungen, machen weniger Fehler und liefern messbar mehr Wert pro Arbeitsstunde.</p>
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

      {/* How it works */}
      <section className="container py-24 border-t border-border/40" id="how">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 3 Schritten startklar</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Heute einrichten, morgen messen.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="glow-card p-7 relative">
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full gradient-primary text-primary-foreground grid place-items-center text-sm font-semibold shadow-md">{i + 1}</div>
              <s.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-semibold mb-1.5 text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-24 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">So funktioniert es</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Klar. Fair. Datensparsam.</h2>
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
              Keine Inhalte. Keine Screenshots. Keine Tastatureingaben. Nur Zeitdaten – und auch nur, wenn Mitarbeitende explizit zustimmen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow"><Link to="/register">Workspace erstellen</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60"><Link to="/login">Demo ansehen</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Logo />
            <span>© {new Date().getFullYear()} Team Focus</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-foreground transition-colors">Impressum</a>
            <a href="#" className="hover:text-foreground transition-colors">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
