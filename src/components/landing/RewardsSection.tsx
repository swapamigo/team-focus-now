import { Utensils, Car, Coffee, Gift, Fuel, Ticket } from "lucide-react";
import bgAsset from "@/assets/team-throwing-phones.png.asset.json";

const rewards = [
  { icon: Utensils, title: "Essensgutschein", highlight: true },
  { icon: Fuel, title: "Tankgutschein" },
  { icon: Ticket, title: "Event-Tickets" },
  { icon: Coffee, title: "Bezahlter Team-Lunch" },
  { icon: Car, title: "Bevorzugter Parkplatz" },
];

export default function RewardsSection() {
  return (
    <section
      id="rewards"
      className="relative py-16 md:py-20 border-t border-border/40"
      style={{
        backgroundImage: `url(${bgAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
            <Gift className="h-3.5 w-3.5" /> Belohnungen
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">Was das Gewinner-Team bekommt.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
          {rewards.map((r) => (
            <div
              key={r.title}
              className={
                "glow-card p-5 flex flex-col items-center text-center " +
                (r.highlight ? "border-primary/40 ring-1 ring-primary/30 bg-primary/[0.03]" : "")
              }
            >
              <div className={"h-14 w-14 rounded-2xl grid place-items-center mb-3 " + (r.highlight ? "gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-primary")}>
                <r.icon className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold leading-tight">{r.title}</p>
              {r.highlight && (
                <span className="mt-2 text-[10px] uppercase tracking-wider font-bold text-primary px-2 py-0.5 rounded-full bg-primary/15">
                  Top-Tipp
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 text-white/60">
          Zyklus frei wählbar: <span className="text-white font-medium">wöchentlich bis monatlich</span>.
        </p>
      </div>
    </section>
  );
}
