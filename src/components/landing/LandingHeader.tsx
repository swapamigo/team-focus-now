import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, CalendarClock } from "lucide-react";
import Logo from "@/components/Logo";
import { openCallBooking } from "@/lib/track";

const navItems = [
  { href: "#how", label: "So funktioniert's" },
  { href: "/fuer-mitarbeitende", label: "Vorteile für Mitarbeiter", route: true as const },
];

export default function LandingHeader({ onDemo, onBookCall }: { onDemo: () => void; onBookCall?: () => void }) {
  const [open, setOpen] = useState(false);
  const handleBookCall = onBookCall ?? (() => openCallBooking("header"));
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center shrink-0"><Logo withWordmark /></Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          {navItems.map((n) => (
            "route" in n ? (
              <Link key={n.href} to={n.href} className="hover:text-foreground transition-colors">{n.label}</Link>
            ) : (
              <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">{n.label}</a>
            )
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBookCall}>
            <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
          </Button>
          <Button size="sm" className="shadow-sm" onClick={onDemo}>Demo ansehen</Button>
        </div>


        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menü öffnen"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-6">
                {navItems.map((n) => (
                  "route" in n ? (
                    <Link key={n.href} to={n.href} onClick={() => setOpen(false)}
                      className="px-3 py-3 rounded-lg hover:bg-secondary text-sm font-medium">
                      {n.label}
                    </Link>
                  ) : (
                    <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                      className="px-3 py-3 rounded-lg hover:bg-secondary text-sm font-medium">
                      {n.label}
                    </a>
                  )
                ))}
                <div className="border-t border-border my-3" />
                <Button variant="ghost" onClick={() => { setOpen(false); handleBookCall(); }}>
                  <CalendarClock className="mr-1.5 h-4 w-4" />Call vereinbaren
                </Button>
                <Button onClick={() => { setOpen(false); onDemo(); }}>Demo ansehen</Button>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
