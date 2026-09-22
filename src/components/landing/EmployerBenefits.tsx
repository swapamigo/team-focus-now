import { ArrowUpRight, Brain, Gift, Heart, ShieldCheck, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";
import DepthCard from "./DepthCard";
import EmployerRoiCalculator from "./EmployerRoiCalculator";
import SpatialPanel from "./SpatialPanel";
import { useFocusText } from "@/i18n/focus";

const sources = [
  { title: "Iqbal & Horvitz · CHI, 2007", href: "https://www.microsoft.com/en-us/research/publication/disruption-recovery-computing-tasks-field-study-analysis-directions/", note: "employerFocusStudy" },
  { title: "Altmann, Trafton & Hambrick · 2014", href: "https://doi.org/10.1037/a0030986", note: "employerErrorStudy" },
  { title: "Brailovskaia et al. · Acta Psychologica, 2024", href: "https://doi.org/10.1016/j.actpsy.2024.104494", note: "employerWellbeingStudy" },
  { title: "Harbach et al. · SOUPS, 2014", href: "https://www.usenix.org/system/files/conference/soups2014/soups14-paper-harbach.pdf", note: "employerUnlockStudy" },
  { title: "Harbach, De Luca & Egelman · CHI, 2016", href: "https://research.google/pubs/the-anatomy-of-smartphone-unlocking-a-field-study-of-android-lock-screens/" },
  { title: "Destatis · 2026", href: "https://www.destatis.de/DE/Presse/Pressemitteilungen/Zahl-der-Woche/2025/PD25_50_p002.html", note: "employerWorkdaysStudy" },
] as const;

export default function EmployerBenefits() {
  const { t } = useFocusText();
  const openResearch = () => document.getElementById("employer-research")?.setAttribute("open", "");
  return <div data-testid="employer-benefits" className="mt-10 sm:mt-14 mb-9 space-y-10 sm:space-y-14">
    <div className="grid md:grid-cols-3 gap-5">
      <Reveal><DepthCard className="p-6 sm:p-7">
        <Brain className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">{t("employerFocusTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerFocusBody")}</p>
        <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-4">{t("employerSource")} · Iqbal & Horvitz</a>
      </DepthCard></Reveal>
      <Reveal delay={70}><DepthCard className="p-6 sm:p-7">
        <TrendingUp className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">{t("employerRoiTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerRoiBody")}</p>
        <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-4">{t("employerSource")} · Altmann et al.</a>
      </DepthCard></Reveal>
      <Reveal delay={140}><DepthCard className="p-6 sm:p-7">
        <Gift className="h-6 w-6 text-primary mb-5" aria-hidden="true" />
        <h2 className="text-xl font-semibold tracking-tight">{t("employerBudgetTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerBudgetBody")}</p>
      </DepthCard></Reveal>
    </div>
    <Reveal><div className="max-w-2xl"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("employerProfitTitle")}</h2><p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-4">{t("employerProfitBody")}</p></div></Reveal>
    <Reveal><EmployerRoiCalculator /></Reveal>
    <Reveal><section><SpatialPanel icon={Heart} tone="mint">
      <h2 className="text-xl font-semibold tracking-tight">{t("employerWellbeingTitle")}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t("employerWellbeingBody")}</p>
      <p className="text-sm leading-relaxed mt-3">{t("employerHabits")}</p>
      <a href="#employer-research" onClick={openResearch} className="inline-block text-xs text-primary underline underline-offset-4 mt-3">{t("employerSource")} · Ruhr-Universität Bochum</a>
    </SpatialPanel></section></Reveal>
    <div className="flex items-start gap-3 px-1 py-2"><ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" /><p className="text-sm text-muted-foreground leading-relaxed">{t("employerPrivacy")}</p></div>
    <details id="employer-research" className="group border-y py-4 scroll-mt-24">
      <summary className="cursor-pointer text-sm font-medium">{t("employerResearch")}</summary>
      <ul className="space-y-4 mt-4">{sources.map((source) => <li key={source.href}>
        <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1 items-start text-sm text-primary underline underline-offset-4"><span>{source.title}</span><ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
        {"note" in source && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{t(source.note)}</p>}
      </li>)}</ul>
      <p className="text-xs text-muted-foreground leading-relaxed mt-4">{t("employerStudyScope")}</p>
    </details>
  </div>;
}
