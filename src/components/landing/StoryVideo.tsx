import { useFocusText } from "@/i18n/focus";

type StoryVideoProps = {
  audience: "employee" | "employer";
};

export default function StoryVideo({ audience }: StoryVideoProps) {
  const { t } = useFocusText();
  const employer = audience === "employer";
  const titleId = `${audience}-video-title`;
  const descriptionId = `${audience}-video-description`;
  const source = `/videos/teamfokus-${audience}.mp4`;

  return (
    <section aria-labelledby={titleId} className="grid lg:grid-cols-[0.7fr_1.3fr] items-center gap-6 lg:gap-10">
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("videoEyebrow")}</p>
        <h2 id={titleId} className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {t(employer ? "employerVideoTitle" : "employeeVideoTitle")}
        </h2>
        <p id={descriptionId} className="mt-4 text-muted-foreground leading-relaxed">
          {t(employer ? "employerVideoBody" : "employeeVideoBody")}
        </p>
      </div>
      <div className="min-w-0">
        <video
          controls
          playsInline
          preload="none"
          poster={`/videos/teamfokus-${audience}.jpg`}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="block aspect-video w-full rounded-2xl border border-border/60 bg-black shadow-lg"
        >
          <source src={source} type="video/mp4" />
          <a href={source}>{t("videoOpen")}</a>
        </video>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-muted-foreground">
          <span>{employer ? "1:06" : "0:48"} · {t("videoLanguage")}</span>
          <a href={source} className="underline underline-offset-4 hover:text-primary">
            {t("videoOpen")}
          </a>
        </div>
      </div>
    </section>
  );
}
