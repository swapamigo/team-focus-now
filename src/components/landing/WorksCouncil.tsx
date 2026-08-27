import { ShieldCheck, Users, HeartHandshake, FileCheck2 } from "lucide-react";
import anonymisierungImg from "@/assets/anonymisierung-k5.png.asset.json";
import { useT } from "@/i18n";

export default function WorksCouncil() {
  const t = useT();

  const pillars = [
    { icon: HeartHandshake, title: t("landing.works_council.pillar1.title"), desc: t("landing.works_council.pillar1.desc") },
    { icon: FileCheck2, title: t("landing.works_council.pillar2.title"), desc: t("landing.works_council.pillar2.desc") },
    { icon: ShieldCheck, title: t("landing.works_council.pillar3.title"), desc: t("landing.works_council.pillar3.desc") },
    { icon: Users, title: t("landing.works_council.pillar4.title"), desc: t("landing.works_council.pillar4.desc") },
  ];

  return (
    <section id="betriebsrat" className="relative border-t border-border/40">
      <div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />
      <div className="container relative py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-5 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {t("landing.works_council.badge")}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {t("landing.works_council.title_line1")}<br />{t("landing.works_council.title_line2")}
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            {t("landing.works_council.subtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-10 md:mb-14 surface-card p-3 md:p-5">
          <img
            src={anonymisierungImg.url}
            alt={t("landing.works_council.image_alt")}
            className="w-full h-auto rounded-xl"
            loading="lazy"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {pillars.map((p, i) => (
            <div key={p.title} className="glow-card p-6 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>

              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mb-4 shadow-sm">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-base md:text-lg leading-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 surface-card p-6 text-center">
          <p className="text-sm md:text-base text-foreground/90">
            <strong>{t("landing.works_council.acceptance_bold")}</strong>{t("landing.works_council.acceptance_rest")}
          </p>
        </div>

      </div>
    </section>
  );
}
