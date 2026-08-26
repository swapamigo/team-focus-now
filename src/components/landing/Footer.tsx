import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function Footer() {

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <Logo withWordmark />
          <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
            Motivation statt Kontrolle – für mehr Fokus, weniger Stress und höheren Umsatz.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Produkt</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#how" className="hover:text-foreground transition-colors">So funktioniert's</a></li>
            <li><a href="#roi" className="hover:text-foreground transition-colors">ROI-Rechner</a></li>
            <li><Link to="/demo/manager" className="hover:text-foreground transition-colors">Demo ansehen</Link></li>
            <li><Link to="/fuer-betriebsrat" className="hover:text-foreground transition-colors">Betriebsrat-Akzeptanz</Link></li>
            <li><Link to="/fuer-mitarbeitende" className="hover:text-foreground transition-colors">Vorteile für Mitarbeiter</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Kontakt</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="mailto:joel@teamfokus.app" className="hover:text-foreground transition-colors">joel@teamfokus.app</a>
            </li>
            <li><Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz &amp; Sicherheit</Link></li>
            <li><Link to="/fuer-betriebsrat" className="hover:text-foreground transition-colors">Betriebsrat-Akzeptanz</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} TeamFokus · Hosting in der EU</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>Privacy-by-Design · DSGVO-konform</span>
            <Link to="/datenschutz" className="hover:text-foreground transition-colors underline underline-offset-2">Trust &amp; Security</Link>
            <Link to="/impressum" className="hover:text-foreground transition-colors underline underline-offset-2">Impressum</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
