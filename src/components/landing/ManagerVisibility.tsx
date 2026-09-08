import { Eye, EyeOff, Info } from "lucide-react";
import { useT } from "@/i18n";

export default function ManagerVisibility() {
  const t = useT();

  return (
    <section className="container py-12 md:py-16 border-b border-border/40" id="was-dein-chef-sieht">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("landing.boss.title")}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        <article className="surface-card p-6 md:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{t("landing.boss.card1.title")}</h3>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("landing.boss.card1.body")}</p>
        </article>

        <article className="glow-card p-6 md:p-7 border-success/40 ring-1 ring-success/25 bg-success/[0.04] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-success/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-success/15 grid place-items-center">
                <EyeOff className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-lg font-semibold">{t("landing.boss.card2.title")}</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed">{t("landing.boss.card2.body")}</p>
          </div>
        </article>
      </div>

      <div className="max-w-5xl mx-auto mt-4 flex items-start gap-2 px-1">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">{t("landing.boss.exception")}</p>
      </div>
    </section>
  );
}
