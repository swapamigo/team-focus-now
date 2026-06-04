import { Heart, Building2, Smartphone } from "lucide-react";

export default function SocietyHealth() {
  return (
    <section className="container py-20 md:py-24 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Über den Werkstor hinaus</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ein gesellschaftliches Problem.</h2>
        <p className="mt-3 text-muted-foreground">
          Helfen Sie Ihren Mitarbeitenden, die Handynutzung wieder in den Griff zu bekommen.
        </p>
      </div>

      {/* Bildliche Darstellung */}
      <div className="max-w-4xl mx-auto surface-card p-8 md:p-10">
        <div className="grid grid-cols-3 items-center gap-4 md:gap-8">
          <Tile icon={Heart} label="Gut für Mitarbeitende" tone="primary" />
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 grid place-items-center mb-2">
              <Smartphone className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold text-center">Smartphone-Sog</p>
          </div>
          <Tile icon={Building2} label="Gut fürs Unternehmen" tone="primary" />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
          Weniger Ablenkung = weniger Stress, mehr Fokus, weniger Fehler. Ein echtes Win-win.
        </p>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, label, tone }: { icon: any; label: string; tone: "primary" }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center mb-2 shadow-sm">
        <Icon className="h-7 w-7 text-primary-foreground" />
      </div>
      <p className="text-sm font-semibold leading-tight">{label}</p>
    </div>
  );
}
