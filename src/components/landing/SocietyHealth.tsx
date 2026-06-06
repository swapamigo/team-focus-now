import { Heart, Building2, Smartphone } from "lucide-react";

export default function SocietyHealth() {
  return (
    <section className="container py-16 md:py-20 border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Handysucht ist ein gesellschaftliches Problem.</h2>
        <p className="mt-3 text-muted-foreground">
          Helfen Sie Ihren Mitarbeitenden, die Handynutzung wieder in den Griff zu bekommen.
        </p>
      </div>

      <div className="max-w-3xl mx-auto surface-card p-8 md:p-10">
        <div className="grid grid-cols-3 items-center gap-4">
          <Tile icon={Heart} label="Gut für Mitarbeitende" />
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 grid place-items-center mb-2">
              <Smartphone className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold text-center">Das Problem</p>
          </div>
          <Tile icon={Building2} label="Gut fürs Unternehmen" />
        </div>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-2xl gradient-primary grid place-items-center mb-2 shadow-sm">
        <Icon className="h-8 w-8 text-primary-foreground" />
      </div>
      <p className="text-sm font-semibold leading-tight">{label}</p>
    </div>
  );
}
