const companies = [
  { name: "Nordlicht Logistik", initials: "NL" },
  { name: "Brunner & Reuter", initials: "BR" },
  { name: "Steinmann Industrie", initials: "SI" },
  { name: "Kanzlei Holzmann", initials: "KH" },
  { name: "ferrum.io", initials: "FE" },
];

export default function SocialProofStrip() {
  return (
    <section className="border-b border-border/40 bg-secondary/20">
      <div className="container py-6 md:py-7">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-4">
          Vertraut von diesen Unternehmen
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {companies.map((c) => (
            <div key={c.name} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <div className="h-7 w-7 rounded-md gradient-primary grid place-items-center text-[10px] font-bold text-primary-foreground">
                {c.initials}
              </div>
              <span className="text-xs md:text-sm font-semibold text-foreground/70 whitespace-nowrap tracking-tight">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
