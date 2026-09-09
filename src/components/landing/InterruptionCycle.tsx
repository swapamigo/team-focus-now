import { useT } from "@/i18n";

const SRC_MARK = "https://ics.uci.edu/~gmark/chi08-mark.pdf";

export default function InterruptionCycle() {
  const t = useT();
  return (
    <section className="container py-16 md:py-20 border-t border-border/40">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.interruption.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.interruption.title")}</h2>
        <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">{t("landing.interruption.body")}</p>
        <p className="mt-6 text-[11px] text-muted-foreground italic">{t("landing.interruption.source")}</p>
        <p className="mt-4">
          <a
            href={SRC_MARK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
          >
            {t("landing.interruption.study")}
          </a>
        </p>
      </div>
    </section>
  );
}
