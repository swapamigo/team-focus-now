import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, X } from "lucide-react";

export default function DemoBanner() {
  const loc = useLocation();
  if (!loc.pathname.startsWith("/demo")) return null;
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md">
      <div className="container flex items-center justify-between gap-3 py-2.5 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span className="font-medium truncate">Demo-Modus aktiv – Daten sind simuliert.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="secondary" className="h-8">
            <Link to="/waitlist"><Mail className="h-3.5 w-3.5 mr-1" /> Vormerken</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8 text-primary-foreground hover:bg-white/10">
            <Link to="/"><X className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
