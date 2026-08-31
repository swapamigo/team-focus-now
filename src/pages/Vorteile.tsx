import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Lock, Brain, Trophy, EyeOff, Heart, Clock, Users,
  Gift, Sparkles, CheckCircle2, ShieldCheck, Server, Target, Smartphone,
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
import { useT } from "@/i18n";

export default function Vorteile() {
  const t = useT();
  const [demoOpen, setDemoOpen] = useState(false);

  const benefits = [
    {
      icon: Gift,
      eyebrow: t("pages.vorteile.benefit1.eyebrow"),
      title: t("pages.vorteile.benefit1.title"),
      desc: t("pages.vorteile.benefit1.desc"),
      img: giftImg,
      accent: "from-amber-500/30 to-orange-500/10",
    },
    {
      icon: Brain,
      eyebrow: t("pages.vorteile.benefit2.eyebrow"),
      title: t("pages.vorteile.benefit2.title"),
      desc: t("pages.vorteile.benefit2.desc"),
      img: calmImg,
      accent: "from-sky-500/30 to-blue-500/10",
    },
    {
      icon: Heart,
      eyebrow: t("pages.vorteile.benefit3.eyebrow"),
      title: t("pages.vorteile.benefit3.title"),
      desc: t("pages.vorteile.benefit3.desc"),
      img: familyImg,
      accent: "from-pink-500/30 to-rose-500/10",
    },
  ];

  const privacyPillars = [
    { icon: ShieldCheck, title: t("pages.vorteile.pillar1.title"), desc: t("pages.vorteile.pillar1.desc") },
    { icon: EyeOff, title: t("pages.vorteile.pillar2.title"), desc: t("pages.vorteile.pillar2.desc") },
    { icon: Lock, title: t("pages.vorteile.pillar3.title"), desc: t("pages.vorteile.pillar3.desc") },
    { icon: Clock, title: t("pages.vorteile.pillar4.title"), desc: t("pages.vorteile.pillar4.desc") },
  ];

  const faqs = [
    { q: t("pages.vorteile.faq1.q"), a: t("pages.vorteile.faq1.a") },
    { q: t("pages.vorteile.faq2.q"), a: t("pages.vorteile.faq2.a") },
    { q: t("pages.vorteile.faq3.q"), a: t("pages.vorteile.faq3.a") },
    { q: t("pages.vorteile.faq4.q"), a: t("pages.vorteile.faq4.a") },
    { q: t("pages.vorteile.faq5.q"), a: t("pages.vorteile.faq5.a") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.vorteile.seo.title")}
        description={t("pages.vorteile.seo.description")}
        path="/fuer-mitarbeitende"
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
              {t("pages.vorteile.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
              {t("pages.vorteile.hero.title1")}<br />
              <span className="text-gradient animate-gradient-x">{t("pages.vorteile.hero.title2")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              {t("pages.vorteile.hero.desc")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5" /> {t("pages.vorteile.hero.tag1")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                <EyeOff className="h-3.5 w-3.5" /> {t("pages.vorteile.hero.tag2")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-foreground px-3 py-1 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5" /> {t("pages.vorteile.hero.tag3")}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto">
                <a href="#datenschutz"><ShieldCheck className="mr-1.5 h-4 w-4" />{t("pages.vorteile.hero.cta1")}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                <a href="#vorteile"><Heart className="mr-1.5 h-4 w-4 text-primary" />{t("pages.vorteile.hero.cta2")}</a>
              </Button>
            </div>
          </div>
        </section>

        {/* So funktioniert der Fokus */}
        <section className="container py-16 md:py-20 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.vorteile.focus.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.vorteile.focus.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("pages.vorteile.focus.desc")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Clock, text: t("pages.vorteile.focus.point1") },
              { icon: Smartphone, text: t("pages.vorteile.focus.point2") },
              { icon: Target, text: t("pages.vorteile.focus.point3") },
            ].map((p, i) => (
              <div key={i} className="surface-card p-6 flex items-start gap-4">
                <div className="inline-flex h-10 w-10 rounded-xl gradient-primary items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="text-sm md:text-base leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Datenschutz – 4 Säulen */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="datenschutz">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.vorteile.privacy.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.vorteile.privacy.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("pages.vorteile.privacy.desc")}
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
                alt={t("pages.vorteile.k5.imgAlt")}
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                <Server className="h-3.5 w-3.5" /> {t("pages.vorteile.k5.badge")}
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {t("pages.vorteile.k5.title")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("pages.vorteile.k5.desc").split("{{strong_start}}")[0]}
                <strong className="text-foreground"> {t("pages.vorteile.k5.desc").split("{{strong_start}}")[1]?.split("{{strong_end}}")[0]}</strong>
                {t("pages.vorteile.k5.desc").split("{{strong_end}}")[1]}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />{t("pages.vorteile.k5.point1")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />{t("pages.vorteile.k5.point2")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />{t("pages.vorteile.k5.point3")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Drei große Vorteile mit Bildern */}
        <section className="container py-16 md:py-24 border-b border-border/40" id="vorteile">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.vorteile.vorteile.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t("pages.vorteile.vorteile.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("pages.vorteile.vorteile.desc")}
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
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.vorteile.society.eyebrow")}</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
                {t("pages.vorteile.society.title")}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
                {t("pages.vorteile.society.desc")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="surface-card p-4">
                  <div className="text-3xl font-bold text-gradient">{t("pages.vorteile.society.stat1.value")}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t("pages.vorteile.society.stat1.label")}</p>
                </div>
                <div className="surface-card p-4">
                  <div className="text-3xl font-bold text-gradient">{t("pages.vorteile.society.stat2.value")}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t("pages.vorteile.society.stat2.label")}</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-3">
              <img
                src={societyImg.url}
                alt={t("pages.vorteile.society.imgAlt")}
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-16 md:py-24 border-b border-border/40">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.vorteile.faq.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              {t("pages.vorteile.faq.title")}
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
                {t("pages.vorteile.cta.title")}
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                {t("pages.vorteile.cta.desc")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto">
                  <a href="#datenschutz"><ShieldCheck className="mr-1.5 h-4 w-4" />{t("pages.vorteile.cta.btn1")}</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 backdrop-blur bg-card/60 w-full sm:w-auto">
                  <Link to="/fuer-betriebsrat"><Users className="mr-1.5 h-4 w-4" />{t("pages.vorteile.cta.btn2")}</Link>
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
