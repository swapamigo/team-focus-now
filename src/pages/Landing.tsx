import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Fuel, Gift, Leaf, LockKeyhole, Sparkles, Sun, Trophy } from "lucide-react";
import Seo from "@/components/Seo";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import EmployeeAppPreview from "@/components/landing/EmployeeAppPreview";
import ShareCompany from "@/components/focus/ShareCompany";
import { useFocusText } from "@/i18n/focus";

export default function Landing() {
  const { t, number } = useFocusText();
  const navigate = useNavigate();
  const questions = [["faq1", "answer1"], ["faq2", "answer2"], ["faq3", "answer3"], ["faq4", "answer4"]] as const;
  return <div className="min-h-screen bg-background">
    <Seo title={`TeamFokus · ${t("hero1")} ${t("hero2")}`} description={t("heroBody")} path="/" />
    <LandingHeader onDemo={() => navigate("/demo/employee")} />
    <main>
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
        <div className="container relative max-w-6xl py-14 md:py-24 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-2 mb-6"><Sparkles className="w-3.5 h-3.5" />{t("heroBadge")}</p>
            <h1 className="text-[2.35rem] sm:text-5xl xl:text-6xl leading-[1.04] tracking-tight font-semibold">{t("hero1")}<br /><span className="text-gradient">{t("hero2")}</span></h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed mt-6">{t("heroBody")}</p>
            <p className="font-semibold text-primary mt-5 mb-7">{t("weeklyValue")}</p>
            <ShareCompany /><p className="text-xs text-muted-foreground mt-4 max-w-md leading-relaxed">{t("fourWeekNote")}</p>
            <Link to="/demo/employee" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-5">{t("demo")}<ArrowRight className="w-4 h-4" /></Link>
          </div>
          <EmployeeAppPreview />
        </div>
      </section>
      <section className="container max-w-5xl py-12 md:py-16 grid md:grid-cols-2 gap-5">
        {[{ icon: Sparkles, title: "personalCard", body: "personalBody", value: 1000 }, { icon: Trophy, title: "bonusCard", body: "bonusBody", value: 250 }].map((card) => <article key={card.title} className="surface-card p-7 md:p-8">
          <div className="flex justify-between gap-3 mb-5"><card.icon className="w-6 h-6 text-primary" /><span className="text-primary text-sm font-semibold">{card.title === "bonusCard" ? "+" : ""}{number(card.value)} {t("points")}</span></div>
          <h2 className="text-xl font-semibold">{t(card.title as "personalCard" | "bonusCard")}</h2><p className="text-muted-foreground text-sm leading-relaxed mt-3">{t(card.body as "personalBody" | "bonusBody")}</p>
        </article>)}
      </section>
      <section id="rewards" className="container max-w-5xl pb-14 md:pb-20 scroll-mt-24">
        <h2 className="text-3xl font-semibold tracking-tight">{t("rewardSection")}</h2><p className="text-sm text-muted-foreground mt-3">{t("rewardExamples")}</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-7">{[{ icon: Gift, key: "giftExample", value: 50, points: 5000 }, { icon: Leaf, key: "massageExample", value: 50, points: 5000 }, { icon: Fuel, key: "fuelExample", value: 50, points: 4000 }].map(({ icon: Icon, key, value, points }) => <article key={key} className="reward-showcase rounded-2xl border bg-card p-6"><div className="h-24 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center mb-5"><Icon className="h-9 w-9 text-primary" strokeWidth={1.5} /></div><h3 className="font-medium leading-snug">{key === "fuelExample" ? t("fuelExample") : `${t(key as "giftExample" | "massageExample")} · ${value} €`}</h3><p className="text-primary font-semibold mt-3">{number(points)} {t("points")}</p>{key === "fuelExample" && <p className="text-xs text-muted-foreground mt-2">{t("dealExample")}</p>}</article>)}</div>
      </section>
      <section className="container max-w-5xl pb-14 md:pb-20"><div className="rounded-3xl bg-primary/5 border border-primary/10 p-7 md:p-10 flex gap-5 items-start"><LockKeyhole className="w-7 h-7 text-primary shrink-0 mt-1" /><div><h2 className="text-2xl font-semibold tracking-tight">{t("privateTitle")}</h2><p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mt-3">{t("privateBody")}</p><Link to="/datenschutz" className="inline-flex gap-2 items-center text-primary text-sm mt-4">{t("privacy")}<ArrowRight className="w-4 h-4" /></Link></div></div></section>
      <section className="container max-w-3xl pb-14 md:pb-20"><h2 className="text-3xl font-semibold tracking-tight mb-6">{t("faq")}</h2><div className="divide-y border-y">{questions.map(([q, a]) => <details key={q} className="py-5"><summary className="font-medium cursor-pointer">{t(q)}</summary><p className="text-sm text-muted-foreground leading-relaxed mt-3 pr-4">{t(a)}</p></details>)}</div><p className="text-xs text-muted-foreground mt-6 leading-relaxed">{t("rewardFootnote")}</p></section>
    </main>
    <Footer />
  </div>;
}
