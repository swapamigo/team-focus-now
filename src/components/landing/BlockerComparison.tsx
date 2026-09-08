import { Check, X } from "lucide-react";
import { useT } from "@/i18n";

export default function BlockerComparison() {
  const t = useT();

  const blocker = [
    t("landing.blocker.other.item1"),
    t("landing.blocker.other.item2"),
    t("landing.blocker.other.item3"),
    t("landing.blocker.other.item4"),
  ];
  const us = [
    t("landing.blocker.us.item1"),
    t("landing.blocker.us.item2"),
    t("landing.blocker.us.item3"),
    t("landing.blocker.us.item4"),
  ];

  return (
    <section className="container py-12 md:py-16 border-b border-border/40" id="blocker-vergleich">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("landing.blocker.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{t("landing.blocker.desc")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="surface-card p-6 md:p-7 border-destructive/20">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-4">
            {t("landing.blocker.other.title")}
          </h3>
          <ul className="space-y-3">
            {blocker.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-destructive/10 text-destructive grid place-items-center">
                  <X className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card p-6 md:p-7 border-primary/30 ring-1 ring-primary/20">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-primary mb-4">
            {t("landing.blocker.us.title")}
          </h3>
          <ul className="space-y-3">
            {us.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-success/15 text-success grid place-items-center">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
