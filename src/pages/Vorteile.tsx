import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Phone, Smile, Moon, HeartHandshake, Lock,
  Brain, Sparkles, Trophy, Eye, EyeOff, Coffee, Sun, Hourglass,
  BellOff, MapPin, Palette, CheckCircle2, XCircle, Users, MessageCircle,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { useState } from "react";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";

const benefits = [
  {
    icon: EyeOff,
    title: "Komplett anonym",
    desc: "Niemand sieht deine Bildschirmzeit – nicht deine Führungskraft, nicht deine Kolleg*innen, nicht einmal TeamFocus selbst. Deine Werte verschwinden in der Masse deines Teams.",
    color: "from-emerald-500/20 to-green-500/10",
    ring: "ring-emerald-500/30",
  },
  {
    icon: Brain,
    title: "Weniger Stress bei der Arbeit",
    desc: "Weniger ständige Unterbrechungen heißt: ruhigerer Kopf, weniger Hetze und das Gefühl, deine Aufgaben tatsächlich zu schaffen – statt abends zu denken, der Tag sei „irgendwie verpufft\".",
    color: "from-sky-500/20 to-blue-500/10",
    ring: "ring-sky-500/30",
  },
  {
    icon: Heart,
    title: "Ein besseres Privatleben",
    desc: "Die Gewohnheit, das Handy nicht alle paar Minuten zu zücken, nimmst du mit nach Hause: präsenter bei Familie und Freund*innen, weniger Doomscrolling am Abend, oft auch ruhigerer Schlaf.",
    color: "from-pink-500/20 to-rose-500/10",
    ring: "ring-pink-500/30",
  },
  {
    icon: Lock,
    title: "Nichts wird verboten",
    desc: "Dein Handy bleibt jederzeit deins. Keine Sperren, keine App-Blocker, keine Verbote. Du darfst es nutzen, wann immer du willst – TeamFocus zwingt dich zu nichts.",
    color: "from-amber-500/20 to-orange-500/10",
    ring: "ring-amber-500/30",
  },
  {
    icon: Phone,
    title: "Eingehende Anrufe zählen nie",
    desc: "Du musst erreichbar bleiben – für Familie, Schule, Notfälle. Eingehende Anrufe werden grundsätzlich nicht gewertet. Niemand bestraft dich dafür, ans Telefon zu gehen.",
    color: "from-violet-500/20 to-purple-500/10",
    ring: "ring-violet-500/30",
  },
  {
    icon: Trophy,
    title: "Kein Bloßstellen, nur Feiern",
    desc: "Niemand erfährt je, wer im „Verlierer\"-Team war – diese Info gibt es schlicht nicht. Sichtbar wird nur das Gewinnerteam, das gemeinsam feiert.",
    color: "from-cyan-500/20 to-teal-500/10",
    ring: "ring-cyan-500/30",
  },
];

import { Heart } from "lucide-react";

const helpers = [
  { icon: Hourglass, title: "Kurzer Timer vor dem Öffnen", desc: "Bevor sich Instagram & Co. öffnen, läuft ein kurzer Countdown (z. B. 30 Sek.). Oft reicht das, um zu merken: Das wollte ich gar nicht." },
  { icon: BellOff, title: "Sanfte Erinnerung", desc: "Bist du länger als ein paar Minuten in einer App, bekommst du einen freundlichen Hinweis. Kein Zwang – nur ein kleiner Stups." },
  { icon: Palette, title: "Graustufen während der Arbeit", desc: "Dein Bildschirm wird in Grautönen dargestellt. Ohne bunte Farben verlieren viele Apps spürbar ihren Sog." },
  { icon: MapPin, title: "Ortsbasierte App-Sperre", desc: "Lege fest, dass bestimmte Apps nur an einem Ort funktionieren – etwa in der Pause in der Küche. Ortserkennung läuft nur auf deinem Gerät." },
];

const never = [
  "Eingehende Anrufe – immer erlaubt, nie gezählt",
  "Pausen und Mittagszeit",
  "Feierabend, Wochenende und Urlaub",
  "Freigegebene Arbeits-Apps (Whitelist)",
  "Inhalte, Nachrichten, Fotos, dein Standort",
];

const promises = [
  { icon: EyeOff, title: "Anonym", desc: "Deine Bildschirmzeit ist für niemanden einzeln sichtbar – auch nicht für die Chefetage." },
  { icon: MessageCircle, title: "Keine Inhalte", desc: "Erfasst wird nur die Dauer. Nie Nachrichten, Fotos, dein Standort oder sonstige Inhalte." },
  { icon: Shield, title: "Datenschutzkonform", desc: "Deine Daten werden jederzeit nach DSGVO verarbeitet – Hosting in der EU." },
];

const faqs = [
  { q: "Kann mein Chef oder meine Chefin meine Bildschirmzeit sehen?", a: "Nein. Deine Werte werden ab mindestens fünf Personen zu einem Team-Durchschnitt zusammengefasst, bevor sie überhaupt jemand sieht. Sichtbar sind ausschließlich Team-Durchschnitte." },
  { q: "Muss ich mein Handy abgeben oder werden Apps gesperrt?", a: "Nein. Es wird nichts gesperrt und nichts verboten. Dein Handy bleibt vollständig deins, TeamFocus zählt nur mit." },
  { q: "Was passiert, wenn ich angerufen werde?", a: "Gar nichts. Eingehende Anrufe werden grundsätzlich nicht gewertet. Du bleibst für Familie, Schule oder Notfälle erreichbar." },
  { q: "Und wenn mein Team verliert – erfährt das jemand?", a: "Nein. Es gibt keine sichtbare Verliererliste. Nur das Gewinnerteam wird angezeigt." },
  { q: "Werden meine Nachrichten oder Inhalte gelesen?", a: "Nein. Erfasst wird nur die Nutzungsdauer. Niemals Inhalte, Nachrichten, Fotos, Tastatureingaben oder dein Standort." },
];

export default function Vorteile() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Vorteile für Mitarbeiter – TeamFocus"
        description="Was TeamFocus für dich tut: 100 % anonym, nichts wird verboten, eingehende Anrufe zählen nie. Weniger Stress bei der Arbeit, mehr Ruhe im Kopf und mehr von deinem Feierabend."
        path="/vorteile"
      />
      <LandingHeader onDemo={() => setDemoOpen(true)} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-16 md:pb-20 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <Heart className="h-3.5 w-3.5 text-primary" />
              Für dich gemacht – nicht über dich
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
              Weniger am Handy.<br />
              <span className="text-gradient animate-gradient-x">Mehr von deinem Leben.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              TeamFocus ist keine Überwachung und kein Verbot. Es ist ein komplett anonymes Team-Spiel,
              das dir hilft, dich bei der Arbeit weniger ablenken zu lassen – damit du entspannter durch
              den Tag kommst und nach der Arbeit wirklich frei hast. Dein Handy bleibt deins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow group">
                <a href="#vorteile">Was du davon hast <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60">
                <a href="#anonym">So bleibt alles anonym</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><EyeOff className="h-3.5 w-3.5 text-primary" />100 % anonym</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" />Nichts wird verboten</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" />Anrufe zählen nie</span>
            </div>
          </div>
        </section>

        {/* Gesellschaftliches Problem */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Es liegt nicht an dir</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Handysucht ist ein gesellschaftliches Problem – kein persönliches Versagen.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Social-Media-Apps, Messenger und Push-Nachrichten werden von ganzen Teams gezielt darauf optimiert,
              dich immer wieder zurückzuholen. Dagegen anzukommen ist schwer – für fast alle.
              Genau deshalb versteht dein Unternehmen es als seine Aufgabe, dich dabei zu unterstützen, statt dich zu kontrollieren.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
            <div className="surface-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">23 min</div>
              <p className="text-sm text-muted-foreground">dauert es im Schnitt, bis du nach einer Unterbrechung wieder voll konzentriert bist.</p>
            </div>
            <div className="surface-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">Dutzende</div>
              <p className="text-sm text-muted-foreground">Male am Tag greifen wir zum Handy – oft, ohne es bewusst zu merken.</p>
            </div>
            <div className="surface-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">Für dich</div>
              <p className="text-sm text-muted-foreground">TeamFocus ist die Hilfe deines Unternehmens: Hilfe statt Kontrolle.</p>
            </div>
          </div>
        </section>

        {/* Sechs Vorteile */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="vorteile">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Was du davon hast</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Sechs gute Gründe, einfach mitzumachen.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Es geht um dich: weniger Stress, mehr Ruhe im Kopf und ein Privatleben, das nicht ständig vom Handy unterbrochen wird.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className={`surface-card p-6 md:p-7 relative overflow-hidden hover:-translate-y-0.5 transition-transform`}>
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${b.color} blur-2xl pointer-events-none`} />
                <div className={`relative inline-flex h-11 w-11 rounded-xl bg-card ring-1 ${b.ring} items-center justify-center mb-4`}>
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="relative text-lg font-semibold mb-2">{b.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Anonymität */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="anonym">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Deine Daten, deine Sache</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              So bleibt deine Bildschirmzeit unsichtbar.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Deine Werte werden mit denen deiner Teamkolleg*innen vermischt, bevor irgendjemand sie sieht – ab mindestens fünf Personen.
              Dich einzeln herauszulesen, ist technisch nicht möglich.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <div className="surface-card p-7">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Nur auf deinem Handy</p>
              <h3 className="text-lg font-semibold mb-3">Deine Werte</h3>
              <div className="text-3xl font-bold mb-3">1:42 <span className="text-sm font-normal text-muted-foreground">Stunden</span></div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Instagram · 24 min</li>
                <li>WhatsApp · 18 min</li>
                <li>YouTube · 11 min</li>
              </ul>
              <p className="mt-4 text-xs text-primary font-medium">bleibt nur bei dir</p>
            </div>
            <div className="surface-card p-7 ring-1 ring-primary/20 bg-primary/[0.02]">
              <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-3">Anonymisierung</p>
              <div className="text-5xl font-bold text-gradient mb-2">k = 5</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Werte werden erst ab mindestens 5 Personen vermischt. Du bist einzeln nicht herauslesbar.
              </p>
            </div>
            <div className="surface-card p-7">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Was andere sehen</p>
              <h3 className="text-lg font-semibold mb-3">Nur Team-Werte</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-secondary/40"><span>Team Vertrieb</span><span className="font-semibold">#1</span></div>
                <div className="flex justify-between p-2 rounded-lg bg-primary/10"><span>Team Beta · dein Team</span><span className="font-semibold">#2</span></div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Kein Name. Keine einzelne Person. Keine Inhalte.</p>
            </div>
          </div>
        </section>

        {/* Was zählt / was nie */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Fair und nachvollziehbar</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Was zählt – und was garantiert nie.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <div className="glow-card p-7 border-destructive/20 bg-destructive/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-full bg-destructive/10 text-destructive grid place-items-center"><XCircle className="h-4 w-4" /></span>
                <h3 className="text-lg font-semibold">Zählt nie gegen dich</h3>
              </div>
              <ul className="space-y-3">
                {never.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glow-card p-7 border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02] relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
              <div className="relative flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center"><CheckCircle2 className="h-4 w-4" /></span>
                <h3 className="text-lg font-semibold">Das Einzige, was zählt</h3>
              </div>
              <ul className="relative space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Private Handynutzung während der Arbeitszeit</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Und auch das fließt nur in den Team-Durchschnitt ein – nie als dein persönlicher Wert.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Helfer */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Du hast die Kontrolle</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Werkzeuge, die dir wirklich helfen – wenn du willst.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Optionale Helfer, die du selbst einschaltest. Du entscheidest, welche du nutzt – und ab wann.
              Alle Helfer laufen direkt auf deinem Gerät: Es wird nichts mitgelesen und nichts übertragen.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {helpers.map((h, i) => (
              <div key={i} className="surface-card p-6 md:p-7 flex gap-4">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-primary/10 grid place-items-center">
                  <h.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Drei Versprechen */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Dein Schutz</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Drei Versprechen, auf die du dich verlassen kannst.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {promises.map((p, i) => (
              <div key={i} className="surface-card p-7 text-center">
                <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-4">
                  <p.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
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
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Sun className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-5xl font-semibold tracking-tight mb-4">
                Bereit, deinem Kopf eine Pause zu gönnen?
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                Wenn dein Team startet, machst du in wenigen Minuten mit: App laden, mit dem Team-Code beitreten, fertig.
                Kein Aufwand, kein Risiko – und vielleicht schon bald ein entspannterer Arbeitstag.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto">
                  <a href="#vorteile">Vorteile noch einmal ansehen</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                  <Link to="/akzeptanz"><Users className="mr-1.5 h-4 w-4" />Mitarbeiter-Akzeptanz</Link>
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
