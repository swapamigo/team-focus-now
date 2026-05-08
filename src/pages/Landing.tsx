import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, Users, Sparkles, Lock, BarChart3, TrendingUp, Brain, Target, Zap, Euro, Smile } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import mockup from "@/assets/landing-mockup.jpg";

const benefits = [
  { icon: Brain, title: "Weniger Stress", desc: "Klare Fokus-Phasen entlasten Mitarbeitende und reduzieren Reizüberflutung." },
  { icon: Target, title: "Weniger Fehler", desc: "Höhere Konzentration senkt nachweislich Fehlerraten in Fach- und Wissensarbeit." },
  { icon: Zap, title: "Fokussiertere Teams", desc: "Spielerische Anreize statt Kontrolle erzeugen intrinsische Motivation." },
  { icon: TrendingUp, title: "Höhere Effizienz", desc: "Bis zu 30 % mehr produktive Zeit pro Tag durch reduzierte Ablenkung." },
  { icon: Smile, title: "Produktivitätssteigerung", desc: "Mitarbeitende erleben mehr Flow – und gehen zufriedener nach Hause." },
  { icon: Euro, title: "Umsatzsteigerung", desc: "Fokussierte Stunden zahlen direkt auf Ergebnis, Umsatz und Marge ein." },
];

const features = [
  { icon: Trophy, title: "Team-Wettbewerbe", desc: "Teams treten in fairen Challenges um die geringste Ablenkungszeit an." },
  { icon: Shield, title: "Datenschutz zuerst", desc: "Keine Inhalte, keine Screenshots, keine Tastatureingaben. Nur aggregierte Zeitwerte." },
  { icon: Sparkles, title: "High-Focus-Zeiten", desc: "Definiere fokussierte Zeitfenster, in denen private Nutzung doppelt zählt." },
  { icon: Users, title: "Anonyme Teams", desc: "Mitarbeitende sehen nur Team-Aggregate – nie individuelle Werte anderer." },
  { icon: BarChart3, title: "Klare Statistiken", desc: "Wochenverlauf, Heatmap und persönliche Fortschritte auf einen Blick." },
  { icon: Lock, title: "Freiwillige Teilnahme", desc: "DSGVO-konform mit expliziter Zustimmung und jederzeitigem Widerruf." },
];

const proofs = ["Mustermann GmbH", "Nordlicht AG", "Studio Helix", "Atlas Logistik", "Codeberg & Co.", "Linea Beratung"];

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
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Anmelden</Link></Button>
            <Button asChild size="sm"><Link to="/register">Kostenlos starten</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="container relative pt-20 pb-12 md:pt-28 md:pb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Privacy-by-Design · DSGVO-konform
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
            Mehr Fokus. <span className="text-gradient">Bessere Ergebnisse.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
            Team Focus ist das Produktivitätssystem für moderne Unternehmen.
            Weniger Smartphone-Ablenkung, mehr Konzentration, mehr Ergebnis – ganz ohne Überwachung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow"><Link to="/register">Workspace erstellen</Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8"><Link to="/login">Mit Einladung beitreten</Link></Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">7 € / Mitarbeiter / Monat · 30 Tage gratis testen</p>
        </div>
        {/* Product mockup */}
        <div className="container relative pb-16">
          <div className="surface-card-elevated overflow-hidden mx-auto max-w-5xl">
            <img src={mockup} alt="Team Focus Dashboard – Mockup" width={1920} height={1080} className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border/40 bg-secondary/40">
        <div className="container py-10">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Vertraut von fokussierten Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 opacity-70">
            {proofs.map((p) => (
              <span key={p} className="text-sm font-semibold text-foreground/80">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="container py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Mehrwert für Unternehmen</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Fokus zahlt sich aus.</h2>
          <p className="mt-4 text-muted-foreground">Konzentrierte Mitarbeitende treffen bessere Entscheidungen, machen weniger Fehler und liefern messbar mehr Wert pro Arbeitsstunde.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={b.title} className="surface-card p-6 hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center mb-4">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">So funktioniert es</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Klar. Fair. Datensparsam.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="surface-card p-6">
              <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy CTA */}
      <section className="container pb-24">
        <div className="surface-card-elevated p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Produktivität statt Überwachung.</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
              Wir tracken keine Inhalte, machen keine Screenshots und speichern keine Tastatureingaben.
              Nur Zeitdaten – und auch nur, wenn Mitarbeitende explizit zustimmen. So entsteht Vertrauen statt Druck.
            </p>
            <Button asChild size="lg"><Link to="/register">Jetzt starten</Link></Button>
          </div>
        </div>
      </section>

      <footer className="container py-8 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} Team Focus · Bachelorarbeit-Demo
      </footer>
    </div>
  );
}
