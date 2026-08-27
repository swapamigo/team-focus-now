import { Timer, ScanLine, MoonStar, Sparkles } from "lucide-react";
import { useT } from "@/i18n";

export default function HabitFeatures() {
  const t = useT();

  const items = [
    {
      icon: Timer,
      title: t("landing.habit_features.item1.title"),
      desc: t("landing.habit_features.item1.desc"),
    },
    {
      icon: ScanLine,
      title: t("landing.habit_features.item2.title"),
      desc: t("landing.habit_features.item2.desc"),
      tag: t("landing.habit_features.item2.tag"),
    },
    {
      icon: MoonStar,
      title: t("landing.habit_features.item3.title"),
      desc: t("landing.habit_features.item3.desc"),
    },
    {
      icon: Sparkles,
      title: t("landing.habit_features.item4.title"),
      desc: t("landing.habit_features.item4.desc"),
    },
  ];

  return (
    <section id="habits" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.habit_features.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.habit_features.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          {t("landing.habit_features.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {items.map((it, i) => (
          <div key={it.title} className="glow-card p-6 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary grid place-items-center shadow-sm">
                <it.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{it.title}</h3>
                  {it.tag && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{it.tag}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
        {t("landing.habit_features.footnote")}
      </p>
    </section>
  );
}
