import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Building2 } from "lucide-react";

const companies = [
  { name: "Nordlicht Logistik", initials: "NL" },
  { name: "Brunner & Reuter", initials: "BR" },
  { name: "Steinmann Industrie", initials: "SI" },
  { name: "Kanzlei Holzmann", initials: "KH" },
  { name: "Pixelhaus Agentur", initials: "PA" },
  { name: "ferrum.io", initials: "FE" },
];

const testimonials = [
  {
    quote: "Seit TeamFocus ist die Stimmung im Büro spürbar ruhiger. Die Teams treiben sich gegenseitig an – ohne Kontrolle.",
    name: "Sandra K.", role: "Teamleiterin · Nordlicht Logistik",
  },
  {
    quote: "Endlich ein System, das Mitarbeitende nicht überwacht, sondern motiviert. Unser Vertrieb hat sichtbar mehr Fokus.",
    name: "Markus B.", role: "Vertriebsleiter · Brunner & Reuter",
  },
  {
    quote: "Der Betriebsrat war von Anfang an an Bord – weil keine Einzeldaten sichtbar sind. Das war entscheidend.",
    name: "Julia M.", role: "HR-Leitung · Steinmann Industrie",
  },
];

export default function SocialProofStrip() {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-b border-border/40 bg-secondary/20">
      <div className="container py-8 md:py-10">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-5">
          Vertraut von wachsenden Teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {companies.map((c) => (
            <div key={c.name} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-card/80 border border-border/60 backdrop-blur">
              <div className="h-7 w-7 rounded-md gradient-primary grid place-items-center text-[10px] font-bold text-primary-foreground">
                {c.initials}
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground/80 whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Button variant="link" size="sm" onClick={() => setOpen(true)} className="text-primary">
            Bewertungen ansehen →
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Stimmen aus der Praxis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="surface-card p-5">
                <div className="flex gap-0.5 mb-2 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed mb-3">„{t.quote}"</p>
                <p className="text-xs text-muted-foreground">{t.name} — {t.role}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
