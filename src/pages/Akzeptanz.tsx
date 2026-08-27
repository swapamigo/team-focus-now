import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Gift, Users, UserCheck, ShieldCheck, MousePointerClick,
  Sparkles, Copy, Check, Clock, Heart, Lock,
  Trophy, ChevronRight, Quote, Brain,
} from "lucide-react";
import { useState } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import LegalBasis from "@/components/landing/LegalBasis";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/i18n";

export default function Akzeptanz() {
  const t = useT();
  const [demoOpen, setDemoOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const principles = [
    { icon: Gift, title: t("pages.akzeptanz.principle1.title"), desc: t("pages.akzeptanz.principle1.desc"), color: "from-amber-500/20 to-orange-500/10", ring: "ring-amber-500/30" },
    { icon: Users, title: t("pages.akzeptanz.principle2.title"), desc: t("pages.akzeptanz.principle2.desc"), color: "from-sky-500/20 to-blue-500/10", ring: "ring-sky-500/30" },
    { icon: UserCheck, title: t("pages.akzeptanz.principle3.title"), desc: t("pages.akzeptanz.principle3.desc"), color: "from-violet-500/20 to-purple-500/10", ring: "ring-violet-500/30" },
    { icon: ShieldCheck, title: t("pages.akzeptanz.principle4.title"), desc: t("pages.akzeptanz.principle4.desc"), color: "from-emerald-500/20 to-green-500/10", ring: "ring-emerald-500/30" },
    { icon: MousePointerClick, title: t("pages.akzeptanz.principle5.title"), desc: t("pages.akzeptanz.principle5.desc"), color: "from-pink-500/20 to-rose-500/10", ring: "ring-pink-500/30" },
  ];

  const subjects = [
    { letter: "A", text: t("pages.akzeptanz.subjectA.text"), note: t("pages.akzeptanz.subjectA.note"), recommended: true },
    { letter: "B", text: t("pages.akzeptanz.subjectB.text"), note: t("pages.akzeptanz.subjectB.note") },
    { letter: "C", text: t("pages.akzeptanz.subjectC.text"), note: t("pages.akzeptanz.subjectC.note") },
  ];

  const emailBody = t("pages.akzeptanz.emailBody");

  const benefitsBullets = [
    { icon: Heart, text: t("pages.akzeptanz.benefitBullet1") },
    { icon: Lock, text: t("pages.akzeptanz.benefitBullet2") },
    { icon: ShieldCheck, text: t("pages.akzeptanz.benefitBullet3") },
    { icon: Brain, text: t("pages.akzeptanz.benefitBullet4") },
    { icon: Sparkles, text: t("pages.akzeptanz.benefitBullet5") },
    { icon: Trophy, text: t("pages.akzeptanz.benefitBullet6") },
  ];

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    toast({ title: t("pages.akzeptanz.toast.title"), description: t("pages.akzeptanz.toast.desc") });
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.akzeptanz.seo.title")}
        description={t("pages.akzeptanz.seo.description")}
        path="/fuer-betriebsrat"
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
              {t("pages.akzeptanz.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              {t("pages.akzeptanz.hero.title1")}<br />
              <span className="text-gradient animate-gradient-x">{t("pages.akzeptanz.hero.title2")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed px-2">
              {t("pages.akzeptanz.hero.desc")}
            </p>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-foreground/90 font-medium mb-8 leading-relaxed px-2 border-l-2 border-primary/60 pl-4 italic text-left sm:text-center sm:border-l-0 sm:pl-0">
              {t("pages.akzeptanz.hero.quote")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
              <Button size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto" onClick={copyEmail}>
                {copied ? <><Check className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copied")}</> : <><Copy className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copy")}</>}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto" asChild>
                <a href="#prinzipien">{t("pages.akzeptanz.hero.cta2")} <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>

        {/* Rechtliche Grundlagen – DACH */}
        <LegalBasis />


        {/* Hintergrund / Key Stat */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.background.eyebrow")}</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-5">
                {t("pages.akzeptanz.background.title.pre")} <span className="text-gradient">{t("pages.akzeptanz.background.title.highlight")}</span> {t("pages.akzeptanz.background.title.post")}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
                {t("pages.akzeptanz.background.p1")}
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t("pages.akzeptanz.background.p2.pre")} <strong className="text-foreground">{t("pages.akzeptanz.background.p2.strong")}</strong>{t("pages.akzeptanz.background.p2.post")}
              </p>
            </div>
            <div className="relative">
              <div className="surface-card-elevated p-8 md:p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
                <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                  <Clock className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-6xl md:text-7xl font-semibold tracking-tight text-gradient mb-3">{t("pages.akzeptanz.stat.value")}</p>
                <p className="text-lg font-medium mb-2">{t("pages.akzeptanz.stat.label")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("pages.akzeptanz.stat.desc")}
                  <span className="block mt-2 italic">
                    —{" "}
                    <a
                      href="https://neurosciencenews.com/smartphone-notifications-cognition-22048/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="not-italic underline underline-offset-2 hover:text-foreground"
                    >
                      {t("pages.akzeptanz.stat.source")}
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto surface-card p-6 md:p-8 border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-lg md:text-xl font-medium leading-relaxed mb-2">
                  {t("pages.akzeptanz.quote2.title")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("pages.akzeptanz.quote2.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Prinzipien */}
        <section id="prinzipien" className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.principles.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.akzeptanz.principles.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("pages.akzeptanz.principles.desc")}
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
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{t("pages.akzeptanz.templateCard.title")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t("pages.akzeptanz.templateCard.desc")}
                </p>
              </div>
              <Button onClick={copyEmail} className="w-full" variant="outline">
                {copied ? <><Check className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copied")}</> : <><Copy className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copy")}</>}
              </Button>
            </div>
          </div>
        </section>

        {/* Betreff Optionen */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.subjects.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.akzeptanz.subjects.title")}
            </h2>
            <p className="text-muted-foreground">{t("pages.akzeptanz.subjects.desc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {subjects.map((s) => (
              <div
                key={s.letter}
                className={`surface-card p-6 md:p-7 relative ${s.recommended ? "ring-2 ring-primary shadow-glow bg-primary/[0.04]" : ""}`}
              >
                {s.recommended && (
                  <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow">
                    {t("pages.akzeptanz.subjects.recommended")}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center font-semibold ${s.recommended ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                    {s.letter}
                  </div>
                  <span className="text-xs text-muted-foreground">{s.text.length} {t("pages.akzeptanz.subjects.charsSuffix")}</span>
                </div>
                <p className="text-base font-medium mb-2 leading-snug">„{s.text}"</p>
                <p className="text-xs text-muted-foreground italic">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-8 surface-card p-5 border-dashed border border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("pages.akzeptanz.subjects.previewLabel")}</p>
            <p className="text-sm text-foreground/90 font-medium">
              {t("pages.akzeptanz.subjects.previewText")}
            </p>
          </div>
        </section>

        {/* E-Mail Mockup */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.mail.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.akzeptanz.mail.title")}
            </h2>
            <p className="text-muted-foreground">{t("pages.akzeptanz.mail.hint.pre")} <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">{t("pages.akzeptanz.mail.hint.highlight")}</span> {t("pages.akzeptanz.mail.hint.post")}</p>
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
                  {t("pages.akzeptanz.mail.from")}
                </p>
              </div>

              <div className="px-6 md:px-8 py-6 space-y-1 border-b border-border/40">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("pages.akzeptanz.mail.subjectLabel")}</p>
                <p className="text-lg font-semibold tracking-tight">{t("pages.akzeptanz.mail.subjectText")}</p>
              </div>

              <div className="px-6 md:px-8 py-6">
                <pre className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed font-sans text-foreground/90">{emailBody}</pre>
              </div>

              <div className="border-t border-border/60 bg-secondary/20 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <p className="text-xs text-muted-foreground">{t("pages.akzeptanz.mail.tip")}</p>
                <Button onClick={copyEmail} size="sm">
                  {copied ? <><Check className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copied")}</> : <><Copy className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copy")}</>}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What's in it for them */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.benefits.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.akzeptanz.benefits.title")}
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
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.akzeptanz.steps.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              {t("pages.akzeptanz.steps.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { n: 1, t: t("pages.akzeptanz.step1.t"), d: t("pages.akzeptanz.step1.d") },
              { n: 2, t: t("pages.akzeptanz.step2.t"), d: t("pages.akzeptanz.step2.d") },
              { n: 3, t: t("pages.akzeptanz.step3.t"), d: t("pages.akzeptanz.step3.d") },
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
                {t("pages.akzeptanz.cta.title")}
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                {t("pages.akzeptanz.cta.desc")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={copyEmail}>
                  {copied ? <><Check className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copied")}</> : <><Copy className="mr-1 h-4 w-4" /> {t("pages.akzeptanz.hero.copy")}</>}
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                  <Link to="/waitlist">{t("pages.akzeptanz.cta.btn2")} <ChevronRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-6 w-full sm:w-auto">
                  <Link to="/fuer-mitarbeitende"><Heart className="mr-1.5 h-4 w-4" />{t("pages.akzeptanz.cta.btn3")}</Link>
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
