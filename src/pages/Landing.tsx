import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Trophy, Users, Sparkles, Lock, TrendingUp, Brain, Heart, Zap,
  ArrowRight, Check, X, Clock, Rocket, Eye, KeyRound, ShieldCheck, CalendarClock, Smartphone,
} from "lucide-react";

import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import ContactSection from "@/components/landing/ContactSection";

import InterruptionCycle from "@/components/landing/InterruptionCycle";
import SocietyHealth from "@/components/landing/SocietyHealth";
import Faq, { useFaqItems } from "@/components/landing/Faq";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import { openCallBooking, trackClick } from "@/lib/track";

import RewardsSection from "@/components/landing/RewardsSection";
import HabitFeatures from "@/components/landing/HabitFeatures";

import LandingHeader from "@/components/landing/LandingHeader";
import Studies from "@/components/landing/Studies";
import WorksCouncil from "@/components/landing/WorksCouncil";
import PrivacySection from "@/components/landing/PrivacySection";
import focusedImg from "@/assets/employee-focused.jpg";
import stressedImg from "@/assets/employee-stressed.jpg";
import heroPhonesBg from "@/assets/team-throwing-phones.png.asset.json";
import step1Img from "@/assets/tf_step1.png.asset.json";
import step2Img from "@/assets/tf_step2.png.asset.json";
import step3Img from "@/assets/tf_step_teamdaten.png.asset.json";
import step4Img from "@/assets/tf_step_belohnung.png.asset.json";



const benefits = [
  { icon: Brain, title: "Weniger Stress", desc: "Klare Fokus-Phasen statt ständiger Erreichbarkeit." },
  { icon: Zap, title: "Mehr Fokus", desc: "Rund 22 % mehr produktive Zeit pro Tag." },
  { icon: Heart, title: "Mitarbeiter-freundlich", desc: "Belohnung statt Druck – echte Motivation." },
  { icon: TrendingUp, title: "Messbare Wirkung", desc: "Monat für Monat mehr gesammelte Fokuszeit." },
];


export default function Landing() {
  const t = useT();
  const [demoOpen, setDemoOpen] = useState(false);
  const faqItems = useFaqItems();
  const trustLine = t("landing.setup.trust_line");
  const comparison = {
    others: {
      title: t("landing.why.comparison.others.title"), badge: t("landing.why.comparison.others.badge"),
      items: [
        { icon: Eye, text: t("landing.why.comparison.others.item1") },
        { icon: KeyRound, text: t("landing.why.comparison.others.item2") },
        { icon: X, text: t("landing.why.comparison.others.item3") },
        { icon: X, text: t("landing.why.comparison.others.item4") },
        { icon: X, text: t("landing.why.comparison.others.item5") },
      ],
    },
    us: {
      title: t("landing.why.comparison.us.title"), badge: t("landing.why.comparison.us.badge"),
      items: [
        { icon: Shield, text: t("landing.why.comparison.us.item1") },
        { icon: Clock, text: t("landing.why.comparison.us.item2") },
        { icon: Trophy, text: t("landing.why.comparison.us.item3") },
        { icon: Heart, text: t("landing.why.comparison.us.item4") },
        { icon: TrendingUp, text: t("landing.why.comparison.us.item5") },
      ],
    },
  };
  // Der Sprung in die App erfolgt nur über den expliziten Header-Button.

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    // Warte, bis alle Sektionen gerendert sind (Bilder, Dialoge etc.)
    const timer = setTimeout(scrollToHash, 100);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("landing.seo.title")}
        description={t("landing.seo.description")}

        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }}
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} onBookCall={() => openCallBooking("landing")} />

      <main>
      {/* Hero — Eigenverantwortung statt Handyverbot */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-80"
          style={{ backgroundImage: `url(${heroPhonesBg.url})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
        <div className="container relative pt-16 pb-12 md:pt-24 md:pb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
            <Sparkles className="h-4 w-4" />
            {t("landing.hero.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
            {t("landing.hero.title_line1")}<br />
            <span className="text-gradient animate-gradient-x">{t("landing.hero.title_line2")}</span>
          </h1>
          <p className="mx-auto max-w-xl text-base sm:text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed px-2">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 mt-8">
            <Button size="lg" className="h-14 px-8 text-base shadow-glow w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
              <Sparkles className="mr-2 h-5 w-5" />
              {t("common.buttons.demo")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto">
              <Link to="/fuer-mitarbeitende">
                <Heart className="mr-2 h-5 w-5" />
                {t("landing.hero.cta_employee_benefit")}
              </Link>
            </Button>
          </div>

          {/* Trust-Leiste direkt unter den CTAs */}
          <div className="mt-8 max-w-3xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 backdrop-blur px-5 py-3 text-left">
              <Lock className="h-5 w-5 text-success shrink-0" />
              <p className="text-sm md:text-base text-foreground/90">
                {t("landing.hero.trust1")}
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur px-5 py-3 text-left">
              <Smartphone className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm md:text-base text-foreground/90">
                {t("landing.hero.trust2")}
              </p>
            </div>
          </div>


        </div>
      </section>



      {/* Einstiege je Zielgruppe */}
      <section className="container py-10 md:py-14 border-b border-border/40" id="einstiege">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { to: "/fuer-mitarbeitende", t: t("landing.entries.employees.title"), d: t("landing.entries.employees.desc") },
            { to: "/fuer-betriebsrat", t: t("landing.entries.works_council.title"), d: t("landing.entries.works_council.desc") },
            { to: "/fuer-arbeitgeber", t: t("landing.entries.employers.title"), d: t("landing.entries.employers.desc") },
            { to: "/einfuehrung", t: t("landing.entries.onboarding.title"), d: t("landing.entries.onboarding.desc") },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="surface-card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <p className="font-semibold flex items-center gap-1.5">{c.t}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Produktbeschreibung — Sicht der Mitarbeitenden */}
      <section className="container py-12 md:py-16 border-b border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.product.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-5">
{t("landing.product.title")}
          </h2>
          <ul className="text-left space-y-3 max-w-lg mx-auto">
            {[
              t("landing.product.item1"),
              t("landing.product.item2"),
              t("landing.product.item3"),
              t("landing.product.item4"),
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="h-4 w-4 mt-1 shrink-0 text-success" />
                <span className="text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto">
              <Link to="/fuer-mitarbeitende">{t("landing.product.cta_employees")}<ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto">
              <Link to="/fuer-betriebsrat">{t("landing.product.cta_works_council")}</Link>
            </Button>
          </div>
        </div>
      </section>




      {/* Bereich für Unternehmen: Wirkung + ROI */}
      <section className="container py-12 md:py-16 border-b border-border/40" id="fuer-unternehmen">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.company.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("landing.company.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("landing.company.subtitle")}</p>

        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            t("landing.company.item1"),
            t("landing.company.item2"),
            t("landing.company.item3"),
            t("landing.company.item4"),
          ].map((item) => (
            <div key={item} className="surface-card p-5 flex items-start gap-3">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-success" />
              <p className="text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link to="/fuer-arbeitgeber">{t("landing.company.cta")}<ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ROI Calculator */}
      <RoiCalculator />


      {/* Visuelle Übersicht — So funktioniert TeamFokus */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="how">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.steps.eyebrow")}</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {t("landing.steps.title")}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[
            { img: step1Img, alt: t("landing.steps.step1_alt") },
            { img: step2Img, alt: t("landing.steps.step2_alt") },
            { img: step3Img, alt: t("landing.steps.step3_alt") },
            { img: step4Img, alt: t("landing.steps.step4_alt") },
          ].map((s, i) => (
            <div key={i} className="surface-card p-5 md:p-7">
              <img src={s.img.url} alt={s.alt} loading="lazy" className="w-full h-auto rounded-xl block" />
            </div>
          ))}
        </div>
      </section>

      {/* Betriebsrat & Mitarbeitende */}
      <WorksCouncil />

      {/* Unterbrechungszyklus */}
      <InterruptionCycle />


      {/* Warum anders */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="why">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.why.eyebrow")}</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.why.title")}</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            {t("landing.why.desc_prefix")}{" "}
            <a href="https://www.amazon.es/Leading-yourself-ADHD-fighting-yourself/dp/B0GX9F2LGX" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Chris Sorg</a>{t("landing.why.desc_suffix")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <div className="glow-card overflow-hidden border-destructive/20 bg-destructive/[0.02]">
            <div className="relative h-44 md:h-56 overflow-hidden">
              <img src={stressedImg} alt={t("landing.why.stressed_alt")} loading="lazy" className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-semibold backdrop-blur">{comparison.others.badge}</span>
            </div>
            <div className="p-6 md:p-7">
              <h3 className="text-lg font-semibold text-muted-foreground mb-4">{comparison.others.title}</h3>
              <ul className="space-y-3">
                {comparison.others.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-destructive/10 text-destructive grid place-items-center"><X className="h-3 w-3" /></span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="glow-card overflow-hidden border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02] relative">
            <div className="absolute -top-16 -right-16 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative h-44 md:h-56 overflow-hidden">
              <img src={focusedImg} alt={t("landing.why.focused_alt")} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold backdrop-blur">{comparison.us.badge}</span>
            </div>
            <div className="p-6 md:p-7 relative">
              <h3 className="text-lg font-semibold text-gradient mb-4">{comparison.us.title}</h3>
              <ul className="space-y-3">
                {comparison.us.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center"><Check className="h-3 w-3" /></span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Studies />
      <PrivacySection />
      <SocietyHealth />
      <HabitFeatures />
      <RewardsSection />


      {/* Setup */}
      <section className="container py-14 md:py-20 border-t border-border/40" id="setup">
        <div className="max-w-3xl mx-auto surface-card p-7 md:p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.setup.eyebrow")}</p>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t("landing.setup.title")}</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-3">
            <Button size="lg" className="h-12 px-8 shadow-glow group w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
              <Sparkles className="mr-1.5 h-4 w-4" />{t("common.buttons.demo")} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => openCallBooking("landing")}>
              <CalendarClock className="mr-1.5 h-4 w-4" />{t("common.buttons.book_call")}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{trustLine}</p>

        </div>
      </section>


      
      <Faq />

      <ContactSection />

      {/* Final CTA */}
      <section className="container pb-20 md:pb-24">
        <div className="surface-card-elevated p-8 md:p-16 text-center relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-5xl font-semibold tracking-tight mb-4">{t("landing.final_cta.title")}</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg">
              {t("landing.final_cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
                <Sparkles className="mr-1.5 h-4 w-4" />{t("common.buttons.demo")}
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => openCallBooking("landing")}>
                <CalendarClock className="mr-1.5 h-4 w-4" />{t("common.buttons.book_call")}
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">{trustLine}</p>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <DemoLeadDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
