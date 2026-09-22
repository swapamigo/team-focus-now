import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "@/components/Logo";
import { useFocusText } from "@/i18n/focus";
import { useScrollDepth } from "@/hooks/useScrollDepth";

export default function Footer() {
  const { t } = useFocusText();
  const scene = useRef<HTMLElement>(null);
  useScrollDepth(scene);
  const backToTop = () => {
    document.querySelector<HTMLAnchorElement>("header a")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <footer ref={scene} className="footer-stage border-t border-border/50 bg-card">
    <div className="footer-horizon" aria-hidden="true"><span /></div>
    <div className="container max-w-6xl py-9 relative flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-between gap-7 text-sm">
      <div>
        <Link to="/"><Logo withWordmark /></Link>
        <p className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} Joel Schöppe</p>
      </div>
      <nav className="footer-links flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground">
        <Link to="/fuer-arbeitgeber">{t("companies")}</Link>
        <Link to="/datenschutz">{t("privacy")}</Link>
        <Link to="/impressum">{t("legalNotice")}</Link>
        <a href="mailto:joel@teamfokus.app">joel@teamfokus.app</a>
      </nav>
      <button className="back-to-top" type="button" onClick={backToTop} aria-label={t("backToTop")} title={t("backToTop")}>
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  </footer>;
}
