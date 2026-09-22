import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Gift, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import Seo from "@/components/Seo";
import LandingHeader from "@/components/landing/LandingHeader";
import EmployerBenefits from "@/components/landing/EmployerBenefits";
import Reveal from "@/components/landing/Reveal";
import DepthCard from "@/components/landing/DepthCard";
import SpatialPanel from "@/components/landing/SpatialPanel";
import Footer from "@/components/landing/Footer";
import ShareCompany from "@/components/focus/ShareCompany";
import { Button } from "@/components/ui/button";
import { useFocusText, type FocusKey } from "@/i18n/focus";

export default function FocusInfo() {
  const { t } = useFocusText();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const privacy = pathname === "/datenschutz" || pathname === "/fuer-betriebsrat";
  const employer = pathname === "/fuer-arbeitgeber";
  const employee = pathname === "/fuer-mitarbeitende";
  const title: FocusKey = privacy ? "privateTitle" : employee ? "hero2" : employer ? "employerHero" : "companyBenefit";
  const body: FocusKey = privacy ? "privateBody" : employee ? "heroBody" : employer ? "employerIntro" : "companyDetail";
  const items: { icon: typeof Gift; title: FocusKey; body: FocusKey }[] = privacy ? [
    { icon: Smartphone, title: "faq1", body: "answer1" }, { icon: ShieldCheck, title: "privacy", body: "privacyShort" }, { icon: Gift, title: "receiptTitle", body: "answer3" },
  ] : [{ icon: Smartphone, title: "personalCard", body: "personalBody" }, { icon: Gift, title: "rewardSection", body: "shopNote" }, { icon: ShieldCheck, title: "privacy", body: "privateBody" }];
  return <div className="marketing-site min-h-screen">
    <Seo title={`TeamFokus · ${t(title)}`} description={t(body)} path={pathname} />
    <LandingHeader onDemo={() => navigate(employee ? "/demo/employee" : "/demo/manager")} />
    <main className={`container ${employer ? "max-w-6xl" : "max-w-4xl"} py-14 md:py-20`}>
      <Reveal><SpatialPanel variant="intro" icon={privacy ? ShieldCheck : employer ? TrendingUp : Gift}>
        <h1 className={`${employer ? "text-4xl sm:text-6xl max-w-3xl" : "text-4xl sm:text-5xl max-w-2xl"} font-semibold tracking-tight text-balance`}>{t(title)}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mt-5">{t(body)}</p>
        {employer && <div className="flex flex-wrap gap-3 mt-7">
          <Button asChild size="lg"><a href="#roi">{t("employerCalculate")}<ArrowDown aria-hidden="true" /></a></Button>
          <Button asChild size="lg" variant="outline"><Link to="/demo/manager">{t("demo")}</Link></Button>
        </div>}
      </SpatialPanel></Reveal>
      {employer ? <EmployerBenefits /> : <div className="grid md:grid-cols-3 gap-4 my-9">{items.map((item) => <Reveal key={item.title}><DepthCard className="p-6"><item.icon className="h-6 w-6 text-primary mb-5" /><h2 className="font-semibold">{t(item.title)}</h2><p className="text-sm text-muted-foreground leading-relaxed mt-3">{t(item.body)}</p></DepthCard></Reveal>)}</div>}
      {employee ? <ShareCompany /> : employer ? <section><SpatialPanel icon={Gift}>
        <h2 className="text-2xl font-semibold tracking-tight">{t("employerCtaTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-3">{t("employerCtaBody")}</p>
        <div className="flex flex-wrap gap-3 mt-6"><Button asChild><a href="mailto:joel@teamfokus.app">{t("employerCta")}<ArrowUpRight aria-hidden="true" /></a></Button><Button asChild variant="outline"><Link to="/demo/manager">{t("demo")}</Link></Button></div>
      </SpatialPanel></section> : <div className="flex flex-wrap gap-3"><Button asChild><Link to="/demo/manager">{t("demo")}</Link></Button><Button asChild variant="outline"><a href="mailto:joel@teamfokus.app">{t("contactJoel")}</a></Button></div>}
    </main>
    <Footer />
  </div>;
}
