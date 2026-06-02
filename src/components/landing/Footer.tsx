import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <Logo withWordmark />
          <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
            Die mitarbeiterfreundlichste Bossware. Motivation statt Kontrolle – für mehr Fokus, weniger Stress und höheren Umsatz.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Produkt</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground transition-colors">Funktionen</a></li>
            <li><a href="#calculator" className="hover:text-foreground transition-colors">ROI-Rechner</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">Preise</a></li>
            <li><Link to="/login" className="hover:text-foreground transition-colors">Anmelden</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Rechtliches</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Datenschutz</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Impressum</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">AGB</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">DSGVO</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Team Focus · Hosting in der EU</span>
          <span>Privacy-by-Design · DSGVO-konform</span>
        </div>
      </div>
    </footer>
  );
}
