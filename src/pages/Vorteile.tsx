import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Lock, Brain, Trophy, EyeOff, Heart, Clock, Users,
  Gift, Sparkles, CheckCircle2, ShieldCheck, Server,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { useState } from "react";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import calmImg from "@/assets/calm-employee.jpg";
import familyImg from "@/assets/happy-family-dinner.jpg";
import giftImg from "@/assets/monthly-gift.jpg";
import societyImg from "@/assets/smartphone-gesellschaftliches-problem.png.asset.json";
import k5Img from "@/assets/anonymisierung-k5.png.asset.json";

const benefits = [
  {
    icon: Gift,
    eyebrow: "Jeden Monat",
    title: "Ein echtes Geschenk gewinnen",
    desc: "Am Monatsende gewinnt das fokussierteste Team gemeinsam ein Geschenk – Team-Lunch, Gutschein, früher Feierabend. Du gewinnst mit deinem Team, nie auf Kosten anderer.",
    img: giftImg,
    accent: "from-amber-500/30 to-orange-500/10",
  },
  {
    icon: Brain,
    eyebrow: "Bei der Arbeit",
    title: "Weniger Stress, klarer Kopf",
    desc: "Weniger ständige Unterbrechungen heißt: ruhigerer Kopf, weniger Hetze und das gute Gefühl, deine Aufgaben tatsächlich zu schaffen – statt abends zu denken, der Tag sei verpufft.",
    img: calmImg,
    accent: "from-sky-500/30 to-blue-500/10",
  },
  {
    icon: Heart,
    eyebrow: "Zu Hause",
    title: "Mehr Gelassenheit, glücklichere Familie",
    desc: "Die Gewohnheit, das Handy nicht alle paar Minuten zu zücken, nimmst du mit nach Hause: präsenter bei Familie und Freund*innen, weniger Doomscrolling am Abend, ruhigerer Schlaf.",
    img: familyImg,
    accent: "from-pink-500/30 to-rose-500/10",
  },
];

const privacyPillars = [
  {
    icon: ShieldCheck,
    title: "100 % DSGVO-konform",
    desc: "Hosting in Deutschland. Verarbeitung streng nach DSGVO. Auftragsverarbeitungsvertrag inklusive.",
  },
  {
    icon: EyeOff,
    title: "k = 5 Anonymität",
    desc: "Werte werden erst ab mindestens 5 Personen vermischt. Dich einzeln herauszulesen ist technisch unmöglich.",
  },
  {
    icon: Lock,
    title: "Keine Inhalte, nie",
    desc: "Keine Screenshots, keine Nachrichten, kein Standort. Nur die Dauer privater Handynutzung – sonst nichts.",
  },
  {
    icon: Clock,
    title: "Nur Arbeitszeit",
    desc: "Pause, Feierabend, Wochenende, Urlaub: Es wird nichts gemessen. Eingehende Anrufe zählen grundsätzlich nie.",
  },
];

const faqs = [
  { q: "Kann mein Chef meine Bildschirmzeit sehen?", a: "Nein. Deine Werte werden ab mindestens fünf Personen zu einem Team-Durchschnitt zusammengefasst. Sichtbar sind ausschließlich Team-Werte – nie eine einzelne Person." },
  { q: "Werden meine Nachrichten oder Inhalte gelesen?", a: "Nein. Erfasst wird nur die Nutzungsdauer. Niemals Inhalte, Nachrichten, Fotos, Tastatureingaben oder dein Standort." },
  { q: "Muss ich mein Handy abgeben oder werden Apps gesperrt?", a: "Nein. Dein Handy bleibt vollständig deins. Es wird nichts gesperrt und nichts verboten – TeamFokus zählt nur mit." },
  { q: "Was passiert, wenn ich angerufen werde?", a: "Gar nichts. Eingehende Anrufe werden grundsätzlich nicht gewertet. Du bleibst für Familie, Schule oder Notfälle erreichbar." },
  { q: "Und wenn mein Team verliert – erfährt das jemand?", a: "Nein. Es gibt keine sichtbare Verliererliste. Nur das Gewinnerteam wird angezeigt." },
];

export default function Vorteile() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Vorteile für Mitarbeiter – TeamFokus"
        description="100 % DSGVO-konform und komplett anonym (k=5). Gewinne jeden Monat ein Geschenk mit deinem Team – weniger Stress, mehr Gelassenheit, glücklichere Familie."
        path="/vorteile"
      />
      <LandingHeader onDemo={() => setDemoOpen(true)} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-14 md:pb-20 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
              <ShieldCheck className="h-4 w-4" />
              100 % DSGVO · k = 5 Anonymität · Hosting in DE
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
              Deine Daten bleiben deins.<br />
              <span className="text-gradient animate-gradient-x">Der Gewinn ist deiner.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              Niemand sieht je deine persönliche Bildschirmzeit. Dafür gewinnst du jeden Monat
              mit deinem Team ein echtes Geschenk – und ganz nebenbei einen klareren Kopf.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5" /> Nur Arbeitszeit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                <EyeOff className="h-3.5 w-3.5" /> 0 Einzelwerte sichtbar
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-foreground px-3 py-1 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5" /> Keine Inhalte
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto">
                <a href="#datenschutz"><ShieldCheck className="mr-1.5 h-4 w-4" />So bleiben deine Daten privat</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                <a href="#vorteile"><Heart className="mr-1.5 h-4 w-4 text-primary" />Was du davon hast</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Datenschutz – 4 Säulen */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="datenschutz">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Dein Schutz</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Niemand sieht deine Daten. Punkt.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              TeamFokus ist von Grund auf datensparsam gebaut. Vier Garantien, auf die du dich verlassen kannst.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
            {privacyPillars.map((p, i) => (
              <div key={i} className="surface-card p-6 text-center relative overflow-hidden hover:-translate-y-0.5 transition-transform">
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                <div className="relative inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-4">
                  <p.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="relative text-base font-semibold mb-2">{p.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* k=5 Visualisierung */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 surface-card p-3">
              <img
                src={k5Img.url}
                alt="Anonymisierung mit k = 5 – Werte werden mit anderen Teammitgliedern vermischt"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                <Server className="h-3.5 w-3.5" /> Wie es technisch funktioniert
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Du bist nie eine einzelne Zahl.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Deine Werte werden mit denen von mindestens 4 Kolleg*innen verrechnet,
                <strong className="text-foreground"> bevor sie überhaupt jemand sieht</strong>.
                Dein persönlicher Wert verlässt dein Gerät erst gar nicht als Einzelwert.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />Kein Name, keine ID, keine Zuordnung</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />Rohdaten werden nach 24 h gelöscht</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />Auch die Geschäftsführung sieht nur Team-Werte</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Drei große Vorteile mit Bildern */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="vorteile">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Was du davon hast</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Drei Dinge, die wirklich besser werden.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Es geht um dich. Um deinen Arbeitstag, deinen Feierabend, dein Leben.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="surface-card overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={typeof b.img === "string" ? b.img : (b.img as any).url ?? b.img}
                    alt={b.title}
                    width={1024}
                    height={832}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${b.accent} mix-blend-overlay pointer-events-none`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary">
                    <b.icon className="h-3.5 w-3.5" /> {b.eyebrow}
                  </div>
                </div>
                <div className="p-6 md:p-7 flex-1">
                  <h3 className="text-xl font-semibold tracking-tight mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gesellschaftliches Problem */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Es liegt nicht an dir</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
                Handysucht ist ein gesellschaftliches Problem.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
                Apps werden von ganzen Teams gezielt darauf optimiert, dich immer wieder zurückzuholen.
                Dagegen anzukommen ist schwer – für fast alle. Gemeinsam im Team gelingt es leichter.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="surface-card p-4">
                  <div className="text-3xl font-bold text-gradient">23 min</div>
                  <p className="text-xs text-muted-foreground mt-1">bis du nach einer Unterbrechung wieder voll fokussiert bist</p>
                </div>
                <div className="surface-card p-4">
                  <div className="text-3xl font-bold text-gradient">Dutzende</div>
                  <p className="text-xs text-muted-foreground mt-1">Male am Tag greifen wir unbewusst zum Handy</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-3">
              <img
                src={societyImg.url}
                alt="Smartphone-Sucht als gesellschaftliches Problem"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Ehrliche Antworten</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Was du dich wahrscheinlich fragst.
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="surface-card p-5 md:p-6 group">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold">
                  <span>{f.q}</span>
                  <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-16 md:py-24">
          <div className="surface-card-elevated p-8 md:p-16 text-center relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-5xl font-semibold tracking-tight mb-4">
                Mit deinem Team gewinnen – ohne deine Privatsphäre zu verlieren.
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                App laden, mit dem Team-Code beitreten, fertig. Keine Inhalte, keine Einzelwerte, kein Verbot.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto">
                  <a href="#datenschutz"><ShieldCheck className="mr-1.5 h-4 w-4" />Datenschutz im Detail</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                  <Link to="/akzeptanz"><Users className="mr-1.5 h-4 w-4" />Betriebsrat-Akzeptanz</Link>
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
