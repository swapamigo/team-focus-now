import { Clock, Trophy, Moon } from "lucide-react";
import { useT } from "@/i18n";

export default function EmployeeAppPreview() {
  const t = useT();

  const ranking = [
    { name: "Blaufuchs", pts: 412 },
    { name: "Nordlicht", pts: 388 },
    { name: t("landing.app_preview.you"), pts: 364, me: true },
    { name: "Kolibri", pts: 341 },
  ];

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="surface-card-elevated rounded-[2rem] p-4 border border-border/60 shadow-glow">
        <div className="rounded-[1.5rem] bg-secondary/40 p-4 space-y-4">
          {/* Fokus-Uhr */}
          <div className="rounded-2xl bg-card p-4 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {t("landing.app_preview.clock_label")}
            </div>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-gradient">03:42:18</p>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[68%] gradient-primary rounded-full" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{t("landing.app_preview.clock_note")}</p>
          </div>

          {/* Punktestand */}
          <div className="rounded-2xl bg-card p-4 border border-border/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("landing.app_preview.points_label")}</p>
              <p className="text-2xl font-semibold tabular-nums">364</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("landing.app_preview.rank_label")}</p>
              <p className="text-2xl font-semibold">3.</p>
            </div>
          </div>

          {/* Ranking */}
          <div className="rounded-2xl bg-card p-4 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              {t("landing.app_preview.ranking_label")}
            </div>
            <ul className="space-y-2">
              {ranking.map((r, i) => (
                <li
                  key={r.name}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                    r.me ? "bg-primary/10 border border-primary/30 font-semibold" : "bg-secondary/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
                    {r.name}
                  </span>
                  <span className="tabular-nums">{r.pts}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pausiert-Hinweis */}
          <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3">
            <Moon className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">{t("landing.app_preview.paused_note")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
