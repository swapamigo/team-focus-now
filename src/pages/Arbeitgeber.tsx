import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, Clock, Gauge,
  ShieldCheck, Sparkles, Target, TrendingUp, Users, XCircle,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import RoiCalculator from "@/components/landing/RoiCalculator";
import { openCallBooking, trackClick } from "@/lib/track";
import heroImg from "@/assets/team-meeting-office.png.asset.json";
import { useT } from "@/i18n";

export default function Arbeitgeber() {
  const t = useT();
  const [demoOpen, setDemoOpen] = useState(false);

  const goals = [
    { icon: ClipboardCheck, title: t("pages.arbeitgeber.goal1.title"), desc: t("pages.arbeitgeber.goal1.desc") },
    { icon: XCircle, title: t("pages.arbeitgeber.goal2.title"), desc: t("pages.arbeitgeber.goal2.desc") },
    { icon: Clock, title: t("pages.arbeitgeber.goal3.title"), desc: t("pages.arbeitgeber.goal3.desc") },
    { icon: Gauge, title: t("pages.arbeitgeber.goal4.title"), desc: t("pages.arbeitgeber.goal4.desc") },
  ];

  const notVisible = [
    t("pages.arbeitgeber.notvisible1"),
    t("pages.arbeitgeber.notvisible2"),
    t("pages.arbeitgeber.notvisible3"),
    t("pages.arbeitgeber.notvisible4"),
  ];

  const visible = [
    t("pages.arbeitgeber.visible1"),
    t("pages.arbeitgeber.visible2"),
    t("pages.arbeitgeber.visible3"),
  ];

  const steps = [
    { n: "1", t: t("pages.arbeitgeber.step1.t"), d: t("pages.arbeitgeber.step1.d") },
    { n: "2", t: t("pages.arbeitgeber.step2.t"), d: t("pages.arbeitgeber.step2.d") },
    { n: "3", t: t("pages.arbeitgeber.step3.t"), d: t("pages.arbeitgeber.step3.d") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.arbeitgeber.seo.title")}
        description={t("pages.arbeitgeber.seo.description")}
        path="/fuer-arbeitgeber"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t("pages.arbeitgeber.seo.breadcrumb.start"), item: "https://teamfokus.app/" },
            { "@type": "ListItem", position: 2, name: t("pages.arbeitgeber.seo.breadcrumb.arbeitgeber"), item: "https://teamfokus.app/fuer-arbeitgeber" },
          ],
        }}
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none" style={{ backgroundImage: `url(${heroImg.url})` }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-14 md:pb-20 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
              <ShieldCheck className="h-4 w-4" />
              {t("pages.arbeitgeber.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              {t("pages.arbeitgeber.hero.title1")}<br />
              <span className="text-gradient animate-gradient-x">{t("pages.arbeitgeber.hero.title2")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("pages.arbeitgeber.hero.desc")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("arbeitgeber")}>
                <CalendarClock className="mr-1.5 h-4 w-4" />{t("pages.arbeitgeber.hero.cta1")}
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto" onClick={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }}>
                <Sparkles className="mr-1.5 h-4 w-4" />{t("pages.arbeitgeber.hero.cta2")}
              </Button>
            </div>
          </div>
        </section>

        {/* Betriebliche Ziele */}
        <section className="container py-14 md:py-20" id="ziele">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.arbeitgeber.goals.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("pages.arbeitgeber.goals.title")}</h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              {t("pages.arbeitgeber.goals.desc")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
            {goals.map((g) => (
              <div key={g.title} className="surface-card p-6 md:p-7">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Was Sie sehen / nicht sehen */}
        <section className="container py-14 md:py-20 border-t border-border/40" id="datenzugriff">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.arbeitgeber.access.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("pages.arbeitgeber.access.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <div className="glow-card p-6 md:p-7 border-destructive/20 bg-destructive/[0.02]">
              <h3 className="font-semibold mb-4 text-muted-foreground">{t("pages.arbeitgeber.access.neverTitle")}</h3>
              <ul className="space-y-3">
                {notVisible.map((tx) => (
                  <li key={tx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />{tx}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glow-card p-6 md:p-7 border-primary/30 ring-1 ring-primary/20 bg-primary/[0.02]">
              <h3 className="font-semibold mb-4 text-gradient">{t("pages.arbeitgeber.access.alwaysTitle")}</h3>
              <ul className="space-y-3">
                {visible.map((tx) => (
                  <li key={tx} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-success" />{tx}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("pages.arbeitgeber.access.detailsPrefix")}{" "}
            <Link to="/datenschutz" className="text-primary underline underline-offset-2">{t("pages.arbeitgeber.access.detailsLink")}</Link>
          </p>
        </section>

        {/* Ablauf */}
        <section className="container py-14 md:py-20 border-t border-border/40" id="ablauf">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.arbeitgeber.flow.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("pages.arbeitgeber.flow.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.n} className="surface-card p-6">
                <div className="h-9 w-9 rounded-full gradient-primary text-primary-foreground grid place-items-center font-semibold mb-4">{s.n}</div>
                <h3 className="font-semibold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link to="/einfuehrung"><Users className="mr-1.5 h-4 w-4" />{t("pages.arbeitgeber.flow.cta")}</Link>
            </Button>
          </div>
        </section>

        {/* ROI */}
        <RoiCalculator />

        {/* CTA */}
        <section className="container py-14 md:py-20">
          <div className="surface-card-elevated p-8 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">{t("pages.arbeitgeber.cta.title")}</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                {t("pages.arbeitgeber.cta.desc")}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("arbeitgeber-cta")}>
                  <CalendarClock className="mr-1.5 h-4 w-4" />{t("pages.arbeitgeber.cta.btn1")}
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto">
                  <Link to="/fuer-betriebsrat"><TrendingUp className="mr-1.5 h-4 w-4" />{t("pages.arbeitgeber.cta.btn2")}<ArrowRight className="ml-1 h-4 w-4" /></Link>
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
