import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

const navItems = [
  { href: "#calculator", label: "ROI" },
  { href: "#how", label: "So funktioniert's" },
  { href: "#habits", label: "Features" },
  { href: "#privacy", label: "Datenschutz" },
  { href: "#pricing", label: "Preise" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingHeader({ onDemo }: { onDemo: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center shrink-0"><Logo withWordmark /></Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">
              {n.label === "Datenschutz" ? (
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />{n.label}</span>
              ) : n.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Anmelden</Link></Button>
          <Button size="sm" className="shadow-sm" onClick={onDemo}>Demo starten</Button>
        </div>

        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menü öffnen"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-6">
                {navItems.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg hover:bg-secondary text-sm font-medium">
                    {n.label}
                  </a>
                ))}
                <div className="border-t border-border my-3" />
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link to="/login">Anmelden</Link>
                </Button>
                <Button onClick={() => { setOpen(false); onDemo(); }}>Demo starten</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
