import { Smartphone, Swords, Gift, ArrowRight } from "lucide-react";
import { useT } from "@/i18n";

export default function HowItWorks() {
  const t = useT();

  const steps = [
    {
      icon: Smartphone,
      title: t("landing.how_it_works.step1.title"),
      desc: t("landing.how_it_works.step1.desc"),
      accent: "from-primary/20 to-primary/5",
    },
    {
      icon: Swords,
      title: t("landing.how_it_works.step2.title"),
      desc: t("landing.how_it_works.step2.desc"),
      accent: "from-accent/20 to-accent/5",
    },
    {
      icon: Gift,
      title: t("landing.how_it_works.step3.title"),
      desc: t("landing.how_it_works.step3.desc"),
      accent: "from-success/20 to-success/5",
    },
  ];

  return (
    <section className="container py-20 md:py-28 border-t border-border/40" id="how">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.how_it_works.eyebrow")}</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">{t("landing.how_it_works.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          {t("landing.how_it_works.subtitle")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 md:gap-6 relative">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <div className={`glow-card p-7 md:p-8 text-center h-full bg-gradient-to-br ${s.accent}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-background border-2 border-primary text-primary grid place-items-center text-sm font-bold shadow-md">
                {i + 1}
              </div>
              <div className="h-20 w-20 rounded-2xl gradient-primary grid place-items-center mx-auto mb-5 mt-2 shadow-glow">
                <s.icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border border-border items-center justify-center">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
