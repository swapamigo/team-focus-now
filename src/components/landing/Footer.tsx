import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useT } from "@/i18n";

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <Logo withWordmark />
          <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
            {t("common.footer.tagline")}
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">{t("common.footer.pages")}</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/fuer-mitarbeitende" className="hover:text-foreground transition-colors">{t("common.nav.employees")}</Link></li>
            <li><Link to="/fuer-arbeitgeber" className="hover:text-foreground transition-colors">{t("common.nav.employers")}</Link></li>
            <li><Link to="/fuer-betriebsrat" className="hover:text-foreground transition-colors">{t("common.nav.works_council")}</Link></li>
            <li><Link to="/datenschutz" className="hover:text-foreground transition-colors">{t("common.footer.privacy_security")}</Link></li>
            <li><Link to="/einfuehrung" className="hover:text-foreground transition-colors">{t("common.nav.onboarding")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">{t("common.footer.product_contact")}</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/demo/manager" className="hover:text-foreground transition-colors">{t("common.buttons.demo")}</Link></li>
            <li><Link to="/#roi" className="hover:text-foreground transition-colors">{t("common.nav.roi")}</Link></li>
            <li>
              <a href="mailto:joel@teamfokus.app" className="hover:text-foreground transition-colors">joel@teamfokus.app</a>
            </li>
          </ul>
        </div>

      </div>
      <div className="border-t border-border/40">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("common.footer.copyright", { year: new Date().getFullYear() })}</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>{t("common.footer.privacy_by_design")}</span>
            <Link to="/datenschutz" className="hover:text-foreground transition-colors underline underline-offset-2">{t("common.footer.trust_security")}</Link>
            <Link to="/impressum" className="hover:text-foreground transition-colors underline underline-offset-2">{t("common.footer.impressum")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
