import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, Users, Sparkles, Lock, BarChart3 } from "lucide-react";

const features = [
  { icon: Trophy, title: "Team-Wettbewerbe", desc: "Teams treten in fairen Challenges um die geringste Ablenkungszeit an." },
  { icon: Shield, title: "Datenschutz zuerst", desc: "Keine Inhalte, keine Screenshots, keine Tastatureingaben. Nur aggregierte Zeitwerte." },
  { icon: Sparkles, title: "High-Focus-Zeiten", desc: "Definiere fokussierte Zeitfenster, in denen private Nutzung doppelt zählt." },
  { icon: Users, title: "Anonyme Teams", desc: "Mitarbeitende sehen nur Team-Aggregate – nie individuelle Werte anderer." },
  { icon: BarChart3, title: "Klare Statistiken", desc: "Wochenverlauf, Heatmap und persönliche Fortschritte auf einen Blick." },
  { icon: Lock, title: "Freiwillige Teilnahme", desc: "DSGVO-konform mit expliziter Zustimmung und jederzeitigem Widerruf." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl gradient-primary shadow-glow grid place-items-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Team Focus</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Anmelden</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Kostenlos starten</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="container relative py-20 md:py-32 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Privacy-by-Design · DSGVO-konform
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
            Fokus, der sich <span className="text-gradient">wie ein Spiel</span><br />anfühlt.
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
            Team Focus ist das gamifizierte Produktivitätssystem für moderne Teams.
            Weniger Smartphone-Ablenkung, mehr Teamgeist – ganz ohne Überwachung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-2xl h-12 px-8 shadow-glow">
              <Link to="/register">Workspace erstellen</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl h-12 px-8">
              <Link to="/login">Mit Einladung beitreten</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">7 € / Mitarbeiter / Monat · 30 Tage gratis testen</p>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="surface-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-11 w-11 rounded-2xl bg-secondary grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy CTA */}
      <section className="container pb-24">
        <div className="surface-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Keine Bossware. Keine Überwachung.</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
              Wir tracken keine Inhalte, machen keine Screenshots und speichern keine Tastatureingaben.
              Nur Zeitdaten – und auch nur, wenn Mitarbeitende explizit zustimmen.
            </p>
            <Button asChild size="lg" className="rounded-2xl">
              <Link to="/register">Jetzt starten</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="container py-8 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} Team Focus · Bachelorarbeit-Demo
      </footer>
    </div>
  );
}
