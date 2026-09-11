import { Download, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { trackClick } from "@/lib/track";
import p1 from "@/assets/plakat-1.jpg.asset.json";
import p2 from "@/assets/plakat-2.jpg.asset.json";
import p3 from "@/assets/plakat-3.jpg.asset.json";
import p4 from "@/assets/plakat-4.jpg.asset.json";
import p5 from "@/assets/plakat-5.jpg.asset.json";
import posterPdf from "@/assets/plakate.pdf.asset.json";

type Props = {
  /** "employee" = Ansprache an Mitarbeitende, "employer" = Vermarktung im Betrieb */
  variant?: "employee" | "employer";
};

export default function PosterGallery({ variant = "employee" }: Props) {
  const t = useT();
  const isEmployer = variant === "employer";

  const posters = [
    { img: p1, alt: t("landing.posters.alt1") },
    { img: p5, alt: t("landing.posters.alt5") },
    { img: p3, alt: t("landing.posters.alt3") },
    { img: p2, alt: t("landing.posters.alt2") },
    { img: p4, alt: t("landing.posters.alt4") },
  ];

  return (
    <section className="container py-14 md:py-20 border-t border-border/40" id="plakate">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
          {isEmployer ? t("landing.posters.employer_eyebrow") : t("landing.posters.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEmployer ? t("landing.posters.employer_title") : t("landing.posters.title")}
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {isEmployer ? t("landing.posters.employer_desc") : t("landing.posters.desc")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {posters.map((p, i) => (
          <figure
            key={i}
            className="surface-card overflow-hidden p-0 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <img
              src={p.img.url}
              alt={p.alt}
              loading="lazy"
              className="w-full h-auto block"
            />
          </figure>
        ))}

        {isEmployer && (
          <div className="surface-card rounded-2xl p-6 flex flex-col justify-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <p className="font-semibold leading-snug">{t("landing.posters.kit_title")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("landing.posters.kit_desc")}</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Button asChild size="lg" variant="outline" className="h-12 px-8">
          <a
            href={posterPdf.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("download:plakate", "Plakate A3 PDF")}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("landing.posters.download")}
          </a>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">{t("landing.posters.download_note")}</p>
      </div>
    </section>
  );
}
