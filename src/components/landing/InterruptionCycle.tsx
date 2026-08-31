import desktopImg from "@/assets/interruption-cycle-desktop.png.asset.json";
import mobileImg from "@/assets/interruption-cycle-mobile-v2.png.asset.json";
import { useT } from "@/i18n";

const SRC_RECOVERY = "https://neurosciencenews.com/smartphone-notifications-cognition-22048/";

export default function InterruptionCycle() {
  const t = useT();
  return (
    <section className="container py-16 md:py-20 border-t border-border/40">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.interruption.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {t("landing.interruption.title")}
        </h2>
        <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">
          {t("landing.interruption.desc_prefix")}{" "}
          <strong className="text-foreground">{t("landing.interruption.minutes")}</strong>
          {t("landing.interruption.desc_suffix")}
        </p>
        <p className="mt-4">
          <a href={SRC_RECOVERY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold px-4 py-2 text-sm hover:bg-primary/20 transition-colors">
            {t("landing.interruption.study")}
          </a>
        </p>
      </div>
      <div className="mt-10 max-w-5xl mx-auto">
        <img
          src={desktopImg.url}
          alt={t("landing.interruption.alt_desktop")}
          className="hidden md:block w-full h-auto rounded-xl"
          loading="lazy"
        />
        <img
          src={mobileImg.url}
          alt={t("landing.interruption.alt_mobile")}
          className="md:hidden w-full h-auto rounded-xl mx-auto max-w-sm"
          loading="lazy"
        />
      </div>
    </section>
  );
}
