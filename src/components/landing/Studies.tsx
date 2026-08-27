import { BookOpen, Brain, HeartPulse, Smartphone } from "lucide-react";
import { useT } from "@/i18n";

export default function Studies() {
  const t = useT();

  const studies = [
    {
      icon: Brain,
      stat: t("landing.studies.study1.stat"),
      headline: t("landing.studies.study1.headline"),
      body: t("landing.studies.study1.body"),
      source: t("landing.studies.study1.source"),
      href: "https://neurosciencenews.com/smartphone-notifications-cognition-22048/",
    },
    {
      icon: HeartPulse,
      stat: t("landing.studies.study2.stat"),
      headline: t("landing.studies.study2.headline"),
      body: t("landing.studies.study2.body"),
      source: t("landing.studies.study2.source"),
      href: "https://www.frontiersin.org/articles/10.3389/fpsyt.2019.00821/full",
    },
    {
      icon: Smartphone,
      stat: t("landing.studies.study3.stat"),
      headline: t("landing.studies.study3.headline"),
      body: t("landing.studies.study3.body"),
      source: t("landing.studies.study3.source"),
      href: "https://www.dak.de/dak/bundesthemen/gesundheitsreport-2023-2553990.html",
    },
    {
      icon: BookOpen,
      stat: t("landing.studies.study4.stat"),
      headline: t("landing.studies.study4.headline"),
      body: t("landing.studies.study4.body"),
      source: t("landing.studies.study4.source"),
      href: "https://en.wikipedia.org/wiki/Nudge_theory",
    },
  ];

  return (
    <section id="studien" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.studies.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.studies.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          {t("landing.studies.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {studies.map((s, i) => (
          <article key={s.headline} className="glow-card p-6 md:p-7 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary grid place-items-center shadow-sm">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-3xl md:text-4xl font-semibold text-gradient leading-none mb-1">{s.stat}</div>
                <h3 className="font-semibold text-base md:text-lg leading-tight">{s.headline}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{s.body}</p>
            <p className="text-[11px] text-muted-foreground italic mt-4 pt-4 border-t border-border/50">
              {t("landing.studies.source_label")}{" "}
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 not-italic hover:text-foreground">
                {s.source}
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
