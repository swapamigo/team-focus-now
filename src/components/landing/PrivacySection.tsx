import { Shield, Clock, Lock, Server, Trash2, Users, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n";

export default function PrivacySection() {
  const t = useT();

  const dsgvoPoints = [
    { icon: Shield, title: t("landing.privacy.point1.title"), article: t("landing.privacy.point1.article"), desc: t("landing.privacy.point1.desc") },
    { icon: FileCheck, title: t("landing.privacy.point2.title"), article: t("landing.privacy.point2.article"), desc: t("landing.privacy.point2.desc") },
    { icon: Users, title: t("landing.privacy.point3.title"), article: t("landing.privacy.point3.article"), desc: t("landing.privacy.point3.desc") },
    { icon: Server, title: t("landing.privacy.point4.title"), article: t("landing.privacy.point4.article"), desc: t("landing.privacy.point4.desc") },
    { icon: Trash2, title: t("landing.privacy.point5.title"), article: t("landing.privacy.point5.article"), desc: t("landing.privacy.point5.desc") },
    { icon: Lock, title: t("landing.privacy.point6.title"), article: t("landing.privacy.point6.article"), desc: t("landing.privacy.point6.desc") },
  ];

  return (
    <section id="privacy" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.privacy.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
          {t("landing.privacy.title")}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          {t("landing.privacy.subtitle")}
        </p>
      </div>

      {/* Hervorgehobene Box */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="surface-card-elevated rounded-3xl p-8 md:p-10 relative overflow-hidden ring-1 ring-primary/30">
          <div className="absolute -top-12 -right-12 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest font-semibold text-primary mb-5">
            <Server className="h-3.5 w-3.5" /> {t("landing.privacy.box.eyebrow")}
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">{t("landing.privacy.box.title")}</h3>

          <div className="max-w-md mx-auto mb-2">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-center">
              <Clock className="h-7 w-7 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">{t("landing.privacy.box.label")}</p>
              <p className="text-3xl font-semibold tracking-tight">{t("landing.privacy.box.example")}</p>
              <p className="mt-2 text-sm text-success font-medium">{t("landing.privacy.box.delta")}</p>
            </div>
          </div>
        </div>
      </div>


      {/* DSGVO Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-10">
        {dsgvoPoints.map((p) => (
          <div key={p.title} className="surface-card p-6 rounded-2xl">
            <div className="inline-flex h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mb-3">
              <p.icon className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">{p.title}</h4>
            <p className="text-[11px] uppercase tracking-wider text-primary/80 font-semibold mb-2">{p.article}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Mitbestimmung */}
      <div className="max-w-4xl mx-auto surface-card rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.privacy.codetermination.eyebrow")}</p>
        <h3 className="text-xl md:text-2xl font-semibold mb-3">{t("landing.privacy.codetermination.title")}</h3>
        <p className="text-muted-foreground text-sm md:text-base mb-5">
          {t("landing.privacy.codetermination.desc")}
        </p>

        <Link
          to="/fuer-betriebsrat"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <FileCheck className="h-4 w-4" />
          {t("landing.privacy.codetermination.link")}
        </Link>
      </div>
    </section>
  );
}
