import { useT } from "@/i18n";

const SRC_ANDREWS = "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0139004";
const SRC_HEITMAYER =
  "https://ualresearchonline.arts.ac.uk/id/eprint/21660/1/Why%20Are%20Smartphones%20Disruptive_compressed_Final_Submission.pdf";

export default function UnlockFacts() {
  const t = useT();

  const tiles = [
    { stat: t("landing.unlocks.tile1.stat"), text: t("landing.unlocks.tile1.text"), source: t("landing.unlocks.tile1.source"), href: SRC_ANDREWS },
    { stat: t("landing.unlocks.tile2.stat"), text: t("landing.unlocks.tile2.text"), source: t("landing.unlocks.tile2.source"), href: SRC_HEITMAYER },
    { stat: t("landing.unlocks.tile3.stat"), text: t("landing.unlocks.tile3.text"), source: t("landing.unlocks.tile3.source"), href: SRC_ANDREWS },
  ];

  return (
    <section className="container py-14 md:py-20 border-t border-border/40" id="unterbrechungen">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.unlocks.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{t("landing.unlocks.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {tiles.map((tile) => (
          <article key={tile.stat} className="glow-card p-6 md:p-7 flex flex-col">
            <div className="text-4xl md:text-5xl font-semibold text-gradient leading-none mb-4">{tile.stat}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tile.text}</p>
            <p className="text-[11px] text-muted-foreground italic mt-4 pt-4 border-t border-border/50">
              {t("landing.unlocks.source_label")}{" "}
              <a
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 not-italic hover:text-foreground"
              >
                {tile.source}
              </a>
            </p>
          </article>
        ))}
      </div>

      <p className="max-w-3xl mx-auto mt-10 text-center text-base md:text-lg leading-relaxed text-foreground/90">
        {t("landing.unlocks.outro")}
      </p>
    </section>
  );
}
