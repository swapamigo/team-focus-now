import { useT } from "@/i18n";

const ROWS: Array<{ upto?: number; points: number }> = [
  { upto: 1, points: 200 },
  { upto: 2, points: 160 },
  { upto: 3, points: 120 },
  { upto: 4, points: 90 },
  { upto: 5, points: 60 },
  { upto: 7, points: 35 },
  { upto: 10, points: 15 },
  { upto: 15, points: 5 },
  { points: 0 },
];

export default function PointsTable() {
  const t = useT();

  return (
    <section className="container py-14 md:py-20 border-t border-border/40" id="punkte">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.points.title")}</h2>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed">{t("landing.points.subtitle")}</p>
      </div>

      <div className="max-w-2xl mx-auto surface-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          <span>{t("landing.points.col_grips")}</span>
          <span>{t("landing.points.col_points")}</span>
        </div>
        <ul>
          {ROWS.map((r, i) => (
            <li
              key={i}
              className={`flex items-center justify-between px-5 py-3 text-sm border-b border-border/40 last:border-0 ${
                r.points >= 120 ? "bg-primary/5" : ""
              }`}
            >
              <span>{r.upto ? t("landing.points.row_upto").replace("{{n}}", String(r.upto)) : t("landing.points.row_more")}</span>
              <span className="tabular-nums font-semibold">
                {r.points} <span className="font-normal text-muted-foreground">{t("landing.points.unit")}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-2xl mx-auto mt-6 text-sm text-muted-foreground leading-relaxed text-center">
        {t("landing.points.note")}
      </p>
    </section>
  );
}
