import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Server, FileCheck, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

export default function Trust() {
  const t = useT();

  const sections = [
    { icon: Shield, title: t("pages.trust.s1.title"), body: t("pages.trust.s1.body") },
    { icon: Lock, title: t("pages.trust.s2.title"), body: t("pages.trust.s2.body") },
    { icon: Eye, title: t("pages.trust.s3.title"), body: t("pages.trust.s3.body") },
    { icon: Server, title: t("pages.trust.s4.title"), body: t("pages.trust.s4.body") },
    { icon: FileCheck, title: t("pages.trust.s5.title"), body: t("pages.trust.s5.body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.trust.seo.title")}
        description={t("pages.trust.seo.description")}
        path="/datenschutz"
      />
      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> {t("pages.trust.back")}
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">{t("pages.trust.title")}</h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("pages.trust.desc")}
          </p>
        </div>

        <div className="grid gap-4">
          {sections.map((s) => (
            <div key={s.title} className="surface-card p-6 md:p-7 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold mb-1">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card p-6 md:p-7 mt-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            {t("pages.trust.security.pre")}{" "}
            <a href="mailto:security@teamfokus.app" className="text-primary hover:underline">security@teamfokus.app</a>.
            {" "}{t("pages.trust.security.post")}
          </p>
        </div>
      </main>
    </div>
  );
}
