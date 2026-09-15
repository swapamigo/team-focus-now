import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Mail, Scale } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

const company = {
  name: "Joel Schöppe",
  email: "joel@teamfokus.app",
};

// A verified service address can be added once supplied by the owner.

export default function Impressum() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.impressum.seo.title")}
        description={t("pages.impressum.seo.description")}
        path="/impressum"
      />

      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> {t("pages.impressum.back")}
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
            <Scale className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">{t("pages.impressum.title")}</h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("pages.impressum.subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          <section className="surface-card p-6 md:p-7 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="font-semibold mb-1">{t("pages.impressum.provider")}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{company.name}</strong><br />
                  TeamFokus
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{t("pages.impressum.contact")}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${company.email}`} className="hover:text-foreground transition-colors">{company.email}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-card p-6 md:p-7">
            <h2 className="font-semibold mb-3">{t("pages.impressum.liabilityTitle")}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>{t("pages.impressum.liability.p1")}</p>
              <p>{t("pages.impressum.liability.p2")}</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
