import smartphoneProblemImg from "@/assets/smartphone-gesellschaftliches-problem.png.asset.json";

const RUB_STUDY = "https://news.rub.de/presseinformationen/wissenschaft/2024-09-17-psychologie-mehr-arbeitszufriedenheit-durch-weniger-smartphone";

export default function SocietyHealth() {
  return (
    <section className="container py-16 md:py-20 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Handysucht ist ein gesellschaftliches Problem.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Helfen Sie Ihren Mitarbeitenden, die Handynutzung wieder in den Griff zu bekommen.
        </p>
      </div>

      <div className="max-w-4xl mx-auto surface-card p-4 md:p-6">
        <img
          src={smartphoneProblemImg.url}
          alt="Infografik: Zu viel Smartphone führt zu gesellschaftlichen Problemen wie Produktivitätsverlust, steigende Kosten, psychische Belastungen, weniger soziale Verbindung und schwächere Zukunftsperspektiven"
          className="w-full h-auto rounded-xl"
          loading="lazy"
        />
      </div>

      <p className="mt-6 text-center max-w-3xl mx-auto">
        <a
          href={RUB_STUDY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
        >
          Studie: Mehr Arbeitszufriedenheit durch weniger Smartphone
        </a>
      </p>
    </section>
  );
}
