import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

export default function Footer() {
  const nav = useNavigate();

  // Versteckter Entwicklerzugriff: setzt das Flag und navigiert in den echten Produktbereich.
  const enterPrototype = () => {
    try { localStorage.setItem("prototype_access", "1"); } catch {}
    nav("/login");
  };

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
            <li><a href="#calculator" className="hover:text-foreground transition-colors">ROI-Rechner</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">Preise</a></li>
            <li><Link to="/demo/manager" className="hover:text-foreground transition-colors">Demo ansehen</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Rechtliches</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#privacy" className="hover:text-foreground transition-colors">Datenschutz</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Impressum</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">AGB</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">DSGVO</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Team Focus · Hosting in der EU</span>
          <div className="flex items-center gap-4">
            <span>Privacy-by-Design · DSGVO-konform</span>
            <button
              onClick={enterPrototype}
              className="opacity-40 hover:opacity-100 hover:text-foreground transition-opacity underline underline-offset-2"
              title="Interner Entwicklerzugang"
            >
              Prototyp
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
