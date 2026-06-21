import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Gift, Users, UserCheck, ShieldCheck, MousePointerClick,
  Mail, MessageSquareQuote, Sparkles, Copy, Check, Clock, Heart, Lock,
  Trophy, ChevronRight, Quote, Brain,
} from "lucide-react";
import { useState } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import { toast } from "@/hooks/use-toast";

const principles = [
  {
    icon: Gift,
    title: "Als Geschenk rahmen",
    desc: "Stell in den Vordergrund, was die Person bekommt – nicht, was sie tun soll.",
    color: "from-amber-500/20 to-orange-500/10",
    ring: "ring-amber-500/30",
  },
  {
    icon: Users,
    title: "Gemeinsam statt allein",
    desc: "„Das ganze Unternehmen macht mit" – der Team-Wettbewerb erzeugt sozialen Rückenwind.",
    color: "from-sky-500/20 to-blue-500/10",
    ring: "ring-sky-500/30",
  },
  {
    icon: UserCheck,
    title: "Selbst vorangehen",
    desc: "Mach sichtbar mit und schreib das auch. Vorbild wirkt stärker als jede Aufforderung.",
    color: "from-violet-500/20 to-purple-500/10",
    ring: "ring-violet-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Sorgen sofort ausräumen",
    desc: "Anonymität und „nichts wird verboten" früh nennen – das nimmt den häufigsten Einwand vorweg.",
    color: "from-emerald-500/20 to-green-500/10",
    ring: "ring-emerald-500/30",
  },
  {
    icon: MousePointerClick,
    title: "Nur eine, einfache Handlung",
    desc: "Ein klarer Aufruf, in zwei Minuten erledigt. Weniger Aufwand = mehr Teilnahme.",
    color: "from-pink-500/20 to-rose-500/10",
    ring: "ring-pink-500/30",
  },
  {
    icon: Mail,
    title: "Betreff: kurz, persönlich, Nutzen",
    desc: "Unter ca. 50 Zeichen, mit Vorname und konkretem Vorteil statt Pflichtgefühl.",
    color: "from-cyan-500/20 to-teal-500/10",
    ring: "ring-cyan-500/30",
  },
  {
    icon: MessageSquareQuote,
    title: "Das P.S. nutzen",
    desc: "Es wird überdurchschnittlich gelesen – wiederhole dort Kernnutzen und Aufruf.",
    color: "from-indigo-500/20 to-blue-500/10",
    ring: "ring-indigo-500/30",
  },
];

const subjects = [
  {
    letter: "A",
    text: "[Vorname], 2 Minuten für weniger Handystress",
    note: "persönlich + Nutzen + niedrige Hürde",
    recommended: true,
  },
  {
    letter: "B",
    text: "Unser Geschenk an dich: mehr Fokus, weniger Stress",
    note: "Geschenk-Rahmung (Reziprozität)",
  },
  {
    letter: "C",
    text: "[Vorname], dein Team kann diesen Monat gewinnen",
    note: "Neugier + Wettbewerb",
  },
];

const emailBody = `Hi [Vorname],

das Handy zieht uns alle ständig aus der Konzentration – das ist kein persönliches Problem, sondern von den Apps genau so gewollt. Weil es uns alle betrifft, möchten wir dir etwas an die Hand geben, das wirklich dir hilft. Ab [Startdatum] starten wir mit TeamFocus.

Kurz, was es ist: ein anonymes Team-Spiel. Dein Team tritt gegen die anderen an, am Monatsende gewinnt das Team mit dem besten Fokus – ihr macht das gemeinsam, als ganzes Unternehmen.

Was du davon hast:
• Weniger Stress, mehr geschafft – ein Feierabend, der wirklich dir gehört.
• 100 % anonym und datenschutzkonform: Niemand sieht deine Bildschirmzeit. Auch ich nicht.
• Nichts wird verboten: Dein Handy bleibt deins, eingehende Anrufe zählen nie.
• Gut für dich: weniger Stress, beugt Burnout vor – oft mit besserem Schlaf.
• Wenn du magst: optionale Helfer wie ein kurzer Timer vor Instagram oder TikTok.
• Fair: Bekannt wird immer nur das Gewinnerteam – wer hinten liegt, bleibt unsichtbar.

Und das Beste: Das Gewinnerteam bekommt [Belohnung, z. B. ein gemeinsames Team-Essen].

In 2 Minuten dabei:
1. App laden: [Link / QR-Code]
2. Team-Code eingeben: [Team-Code]
3. Fertig – Start ist am [Startdatum].

Ich freue mich darauf, dir – und unserem ganzen Unternehmen – dabei zu helfen, dass Arbeit und Privatleben für alle entspannter werden. Ich bin selbst dabei. Fragen? Komm jederzeit gern auf mich zu.

[Dein Name]

P.S. Zwei Minuten genügen – und je mehr aus deinem Team mitmachen, desto größer eure Gewinnchance. Sei am [Startdatum] dabei.`;

const benefitsBullets = [
  { icon: Heart, text: "Weniger Stress, ein Feierabend der wirklich dir gehört" },
  { icon: Lock, text: "100 % anonym – niemand sieht deine Bildschirmzeit" },
  { icon: ShieldCheck, text: "Nichts wird verboten – Anrufe zählen nie" },
  { icon: Brain, text: "Beugt Burnout vor, oft mit besserem Schlaf" },
  { icon: Sparkles, text: "Optionale Helfer wie Timer vor Instagram/TikTok" },
  { icon: Trophy, text: "Fair: nur das Gewinnerteam wird bekannt gegeben" },
];

export default function Akzeptanz() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    toast({ title: "E-Mail kopiert", description: "Du kannst sie jetzt einfügen und anpassen." });
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Mitarbeiter-Akzeptanz – TeamFocus richtig einführen"
        description="Wie du TeamFocus erfolgreich ankündigst: Sieben Überzeugungs-Prinzipien und eine fertige E-Mail-Vorlage für maximale Mitarbeiter-Akzeptanz."
        path="/akzeptanz"
      />
      <LandingHeader onDemo={() => setDemoOpen(true)} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="container relative pt-16 pb-14 md:pt-24 md:pb-20 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Manager-Leitfaden · Mitarbeiter-Akzeptanz
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              So lädst du dein Team<br />
              <span className="text-gradient animate-gradient-x">zu TeamFocus ein.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed px-2">
              Wie du TeamFocus ankündigst, entscheidet über die Akzeptanz. Hier findest du die wirksamsten Überzeugungs-Prinzipien und eine sofort einsetzbare E-Mail-Vorlage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
              <Button size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto" onClick={copyEmail}>
                {copied ? <><Check className="mr-1 h-4 w-4" /> Kopiert</> : <><Copy className="mr-1 h-4 w-4" /> E-Mail kopieren</>}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto" asChild>
                <a href="#prinzipien">7 Prinzipien ansehen <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>

        {/* Hintergrund / Key Stat */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Hintergrund</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-5">
                Es geht um die <span className="text-gradient">Mitarbeitenden</span> – nicht um das Unternehmen.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
                Smartphones ziehen uns alle ständig aus der Konzentration. Das ist kein persönliches Versagen, sondern ein gesellschaftliches Problem: Apps sind gezielt darauf ausgelegt, Aufmerksamkeit zu binden.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                TeamFocus setzt auf <strong className="text-foreground">Unterstützung statt Kontrolle</strong>: ein anonymes Team-Spiel, bei dem Mitarbeitende ihre Ablenkung selbst reduzieren – weil ihr Team gewinnen will.
              </p>
            </div>
            <div className="relative">
              <div className="surface-card-elevated p-8 md:p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
                <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                  <Clock className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-6xl md:text-7xl font-semibold tracking-tight text-gradient mb-3">23 Min.</p>
                <p className="text-lg font-medium mb-2">bis zur vollen Konzentration</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nach jeder Unterbrechung dauert es im Schnitt rund 23 Minuten bis zur vollen Konzentration zurück.
                  <span className="block mt-2 italic">— G. Mark, University of California, Irvine</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto surface-card p-6 md:p-8 border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-lg md:text-xl font-medium leading-relaxed mb-2">
                  Hilfe, nicht Kontrolle.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Wer das Gefühl hat, etwas geschenkt zu bekommen und selbst zu entscheiden, macht freiwillig und gern mit – Druck erzeugt das Gegenteil.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Prinzipien */}
        <section id="prinzipien" className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Die richtige Ansprache</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Sieben Prinzipien, mit denen du dein Team gewinnst.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Bewährte Überzeugungs-Mechaniken aus Kommunikations- und Verhaltensforschung – konkret auf TeamFocus angewendet.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {principles.map((p, i) => (
              <div key={i} className={`surface-card p-6 md:p-7 relative overflow-hidden ring-1 ${p.ring} hover:-translate-y-1 transition-transform`}>
                <div className={`absolute -top-12 -right-12 h-32 w-32 bg-gradient-to-br ${p.color} blur-2xl rounded-full pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                      <p.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
            <div className="surface-card p-6 md:p-7 relative overflow-hidden ring-1 ring-primary/40 bg-primary/[0.04] flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-glow mb-4">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">Alles drin in einer Vorlage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wir haben die sieben Prinzipien in eine fertige E-Mail gegossen. Nur anpassen, nicht neu schreiben.
                </p>
              </div>
              <Button onClick={copyEmail} className="w-full" variant="outline">
                {copied ? <><Check className="mr-1 h-4 w-4" /> Kopiert</> : <><Copy className="mr-1 h-4 w-4" /> E-Mail kopieren</>}
              </Button>
            </div>
          </div>
        </section>

        {/* Betreff Optionen */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Schritt 1 · Betreff wählen</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Wähle deinen Betreff.
            </h2>
            <p className="text-muted-foreground">Drei getestete Varianten – A ist empfohlen.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {subjects.map((s) => (
              <div
                key={s.letter}
                className={`surface-card p-6 md:p-7 relative ${s.recommended ? "ring-2 ring-primary shadow-glow bg-primary/[0.04]" : ""}`}
              >
                {s.recommended && (
                  <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow">
                    Empfohlen
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center font-semibold ${s.recommended ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                    {s.letter}
                  </div>
                  <span className="text-xs text-muted-foreground">{s.text.length} Zeichen</span>
                </div>
                <p className="text-base font-medium mb-2 leading-snug">„{s.text}"</p>
                <p className="text-xs text-muted-foreground italic">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-8 surface-card p-5 border-dashed border border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Preview-Text</p>
            <p className="text-sm text-foreground/90 font-medium">
              100 % anonym, in 2 Minuten startklar – und dein Team kann gewinnen.
            </p>
          </div>
        </section>

        {/* E-Mail Mockup */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Schritt 2 · E-Mail versenden</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Die fertige Vorlage.
            </h2>
            <p className="text-muted-foreground">Nur die <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">[markierten Stellen]</span> anpassen – fertig.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="surface-card-elevated rounded-2xl overflow-hidden">
              {/* Mail header */}
              <div className="border-b border-border/60 bg-secondary/30 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-destructive/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
                </div>
                <p className="text-xs text-muted-foreground ml-2 font-mono truncate">
                  Von: [Dein Name] &lt;[name@unternehmen.at]&gt; → An: Team
                </p>
              </div>

              <div className="px-6 md:px-8 py-6 space-y-1 border-b border-border/40">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Betreff</p>
                <p className="text-lg font-semibold tracking-tight">[Vorname], 2 Minuten für weniger Handystress</p>
              </div>

              <div className="px-6 md:px-8 py-6">
                <pre className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed font-sans text-foreground/90">{emailBody}</pre>
              </div>

              <div className="border-t border-border/60 bg-secondary/20 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <p className="text-xs text-muted-foreground">Tipp: Versende morgens dienstags–donnerstags für höchste Öffnungsrate.</p>
                <Button onClick={copyEmail} size="sm">
                  {copied ? <><Check className="mr-1 h-4 w-4" /> Kopiert</> : <><Copy className="mr-1 h-4 w-4" /> E-Mail kopieren</>}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What's in it for them */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Was Mitarbeitende davon haben</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Die Vorteile auf einen Blick.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {benefitsBullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4 p-5 surface-card">
                <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 pt-1">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2-Minuten-Schritte */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">In 2 Minuten dabei</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Drei Schritte für jedes Teammitglied.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { n: 1, t: "App laden", d: "Link oder QR-Code aus der E-Mail antippen." },
              { n: 2, t: "Team-Code eingeben", d: "Der vom Manager bereitgestellte Code." },
              { n: 3, t: "Fertig", d: "Am Startdatum geht's automatisch los." },
            ].map((s) => (
              <div key={s.n} className="surface-card p-7 md:p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 gradient-primary opacity-10 blur-3xl rounded-full" />
                <div className="text-6xl font-semibold text-gradient leading-none mb-4">{s.n}</div>
                <h3 className="text-lg font-semibold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-16 md:py-24">
          <div className="surface-card-elevated p-8 md:p-16 text-center relative overflow-hidden rounded-3xl max-w-5xl mx-auto">
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-5xl font-semibold tracking-tight mb-4">
                Bereit, dein Team zu begeistern?
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                Kopiere die Vorlage, passe die markierten Stellen an – und beobachte, wie aus Skepsis Teamgeist wird.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={copyEmail}>
                  {copied ? <><Check className="mr-1 h-4 w-4" /> Kopiert</> : <><Copy className="mr-1 h-4 w-4" /> E-Mail kopieren</>}
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                  <Link to="/waitlist">TeamFocus starten <ChevronRight className="ml-1 h-4 w-4" /></Link>
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
