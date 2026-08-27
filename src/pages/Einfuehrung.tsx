import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, Check, Copy, Mail, ShieldCheck, Users } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import DemoLeadDialog from "@/components/landing/DemoLeadDialog";
import { openCallBooking, trackClick } from "@/lib/track";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/i18n";

function MailCard({ title, hint, body, id, copiedLabel, copyLabel, copiedToastTitle, errorToastTitle, errorToastDesc }: { title: string; hint: string; body: string; id: string; copiedLabel: string; copyLabel: string; copiedToastTitle: string; errorToastTitle: string; errorToastDesc: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      trackClick(`copy:mail:${id}`, title);
      toast({ title: copiedToastTitle });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: errorToastTitle, description: errorToastDesc });
    }
  };
  return (
    <div className="surface-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />{title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{hint}</p>
        </div>
        <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-secondary/40 rounded-xl p-4 font-sans">
        {body}
      </pre>
    </div>
  );
}

export default function Einfuehrung() {
  const t = useT();
  const [demoOpen, setDemoOpen] = useState(false);

  const employeeMail = t("pages.einfuehrung.employeeMail");
  const managementMail = t("pages.einfuehrung.managementMail");

  const phases = [
    { n: "1", t: t("pages.einfuehrung.phase1.t"), d: t("pages.einfuehrung.phase1.d") },
    { n: "2", t: t("pages.einfuehrung.phase2.t"), d: t("pages.einfuehrung.phase2.d") },
    { n: "3", t: t("pages.einfuehrung.phase3.t"), d: t("pages.einfuehrung.phase3.d") },
    { n: "4", t: t("pages.einfuehrung.phase4.t"), d: t("pages.einfuehrung.phase4.d") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.einfuehrung.seo.title")}
        description={t("pages.einfuehrung.seo.description")}
        path="/einfuehrung"
      />
      <LandingHeader onDemo={() => { trackClick("cta:demo", "Demo ansehen"); setDemoOpen(true); }} />

      <main>
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="container relative pt-16 md:pt-24 pb-12 md:pb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur px-5 py-2 text-sm font-semibold text-primary mb-6 shadow-glow">
              <ShieldCheck className="h-4 w-4" />
              {t("pages.einfuehrung.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
              {t("pages.einfuehrung.hero.title1")}<br />
              <span className="text-gradient animate-gradient-x">{t("pages.einfuehrung.hero.title2")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("pages.einfuehrung.hero.desc")}
            </p>
          </div>
        </section>

        <section className="container py-14 md:py-20" id="ablauf">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.einfuehrung.ablauf.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("pages.einfuehrung.ablauf.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
            {phases.map((p) => (
              <div key={p.n} className="surface-card p-6">
                <div className="h-9 w-9 rounded-full gradient-primary text-primary-foreground grid place-items-center font-semibold mb-4">{p.n}</div>
                <h3 className="font-semibold mb-2">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-14 md:py-20 border-t border-border/40" id="vorlagen">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("pages.einfuehrung.vorlagen.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("pages.einfuehrung.vorlagen.title")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("pages.einfuehrung.vorlagen.desc.pre")} <code className="text-primary">{"{{Unternehmen}}"}</code> {t("pages.einfuehrung.vorlagen.desc.post")}
            </p>
          </div>
          <div className="grid gap-5 max-w-4xl mx-auto">
            <MailCard
              id="mitarbeitende"
              title={t("pages.einfuehrung.mail.employee.title")}
              hint={t("pages.einfuehrung.mail.employee.hint")}
              body={employeeMail}
              copiedLabel={t("pages.einfuehrung.mailcard.copied")}
              copyLabel={t("pages.einfuehrung.mailcard.copy")}
              copiedToastTitle={t("pages.einfuehrung.toast.copied.title")}
              errorToastTitle={t("pages.einfuehrung.toast.error.title")}
              errorToastDesc={t("pages.einfuehrung.toast.error.desc")}
            />
            <MailCard
              id="fuehrung"
              title={t("pages.einfuehrung.mail.management.title")}
              hint={t("pages.einfuehrung.mail.management.hint")}
              body={managementMail}
              copiedLabel={t("pages.einfuehrung.mailcard.copied")}
              copyLabel={t("pages.einfuehrung.mailcard.copy")}
              copiedToastTitle={t("pages.einfuehrung.toast.copied.title")}
              errorToastTitle={t("pages.einfuehrung.toast.error.title")}
              errorToastDesc={t("pages.einfuehrung.toast.error.desc")}
            />
          </div>
        </section>

        <section className="container pb-20 md:pb-24">
          <div className="surface-card-elevated p-8 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero opacity-70 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">{t("pages.einfuehrung.cta.title")}</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto" onClick={() => openCallBooking("einfuehrung")}>
                  <CalendarClock className="mr-1.5 h-4 w-4" />{t("pages.einfuehrung.cta.btn1")}
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto">
                  <Link to="/fuer-betriebsrat">{t("pages.einfuehrung.cta.btn2")}<ArrowRight className="ml-1 h-4 w-4" /></Link>
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
