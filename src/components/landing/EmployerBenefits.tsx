import { ArrowUpRight, Brain, Heart, ShieldCheck, TrendingUp } from "lucide-react";
import { useFocusText } from "@/i18n/focus";

const sources = [
  { title: "Iqbal & Horvitz · CHI, 2007", href: "https://www.microsoft.com/en-us/research/publication/disruption-recovery-computing-tasks-field-study-analysis-directions/", note: "employerFocusStudy" },
  { title: "Altmann, Trafton & Hambrick · 2014", href: "https://doi.org/10.1037/a0030986", note: "employerErrorStudy" },
  { title: "Brailovskaia et al. · Acta Psychologica, 2024", href: "https://doi.org/10.1016/j.actpsy.2024.104494", note: "employerWellbeingStudy" },
] as const;

export default function EmployerBenefits() {
  const { t } = useFocusText();
  const openResearch = () => document.getElementById("employer-research")?.setAttribute("open", "");
  return <div data-testid="employer-benefits" className="my-9 space-y-5">
    <div className="grid md:grid-cols-2 gap-5">
      <section className="surface-card p-6 sm:p-7">
        <Brain className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">{t("employerFocusTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerFocusBody")}</p>
        <div className="rounded-2xl bg-primary/5 p-4 mt-5">
          <p className="text-3xl font-semibold tracking-tight text-primary">{t("employerFocusStat")}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">{t("employerFocusStatContext")}</p>
          <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-3">{t("employerSource")} · Iqbal & Horvitz</a>
        </div>
      </section>
      <section className="surface-card p-6 sm:p-7">
        <TrendingUp className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">{t("employerRoiTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerRoiBody")}</p>
        <p className="font-medium text-sm leading-relaxed mt-5">{t("employerRoiEquation")}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3">{t("employerRoiContext")}</p>
        <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-3">{t("employerSource")} · Altmann et al.</a>
      </section>
    </div>
    <section className="rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-7">
      <Heart className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
      <h2 className="text-xl font-semibold tracking-tight">{t("employerWellbeingTitle")}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerWellbeingBody")}</p>
      <p className="text-sm leading-relaxed mt-3">{t("employerHabits")}</p>
      <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-3">{t("employerSource")} · Ruhr-Universität Bochum</a>
    </section>
    <div className="flex items-start gap-3 px-1 py-2"><ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" /><p className="text-sm text-muted-foreground leading-relaxed">{t("employerPrivacy")}</p></div>
    <details id="employer-research" className="group border-y py-4 scroll-mt-24">
      <summary className="cursor-pointer text-sm font-medium">{t("employerResearch")}</summary>
      <ul className="space-y-4 mt-4">{sources.map((source) => <li key={source.href}>
        <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1 items-start text-sm text-primary underline underline-offset-4"><span>{source.title}</span><ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{t(source.note)}</p>
      </li>)}</ul>
      <p className="text-xs text-muted-foreground leading-relaxed mt-4">{t("employerStudyScope")}</p>
    </details>
  </div>;
}
