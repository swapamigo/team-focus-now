import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatMinutes, isoDate, lastNDates, formatWeekdayShort } from "@/lib/format";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { CalendarRange, Lock } from "lucide-react";

const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export default function StatsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ label: string; mins: number; penalty: number }[]>([]);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [yearData, setYearData] = useState<{ label: string; avgMinutes: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const dates = lastNDates(14);
      const { data: rows } = await supabase
        .from("daily_user_summaries")
        .select("date, screen_minutes, penalty_minutes")
        .eq("user_id", user.id)
        .gte("date", isoDate(dates[0]));
      const map = new Map((rows ?? []).map((r: any) => [r.date, r]));
      setData(dates.map((d) => {
        const r: any = map.get(isoDate(d));
        return { label: formatWeekdayShort(d), mins: Number(r?.screen_minutes ?? 0), penalty: Number(r?.penalty_minutes ?? 0) };
      }));

      // Heatmap: 7 Tage × 12 Slots (2-Stunden-Blöcke)
      const { data: ev } = await supabase
        .from("usage_events")
        .select("occurred_at, duration_seconds")
        .eq("user_id", user.id)
        .gte("occurred_at", dates[7].toISOString());
      const grid: number[][] = Array.from({ length: 7 }, () => Array(12).fill(0));
      (ev ?? []).forEach((e: any) => {
        const d = new Date(e.occurred_at);
        const dayIdx = Math.floor((d.getTime() - dates[7].getTime()) / 86400000);
        if (dayIdx < 0 || dayIdx > 6) return;
        const slot = Math.floor(d.getHours() / 2);
        grid[dayIdx][slot] += Number(e.duration_seconds) / 60;
      });
      setHeatmap(grid);

      // Jahresverlauf (12 Monate)
      const yearAgo = new Date(); yearAgo.setDate(yearAgo.getDate() - 365);
      const { data: yearRows } = await supabase
        .from("daily_user_summaries")
        .select("date, screen_minutes")
        .eq("user_id", user.id)
        .gte("date", yearAgo.toISOString().slice(0, 10))
        .order("date", { ascending: true })
        .limit(10000);
      const buckets = new Map<string, { sum: number; n: number; date: Date }>();
      (yearRows ?? []).forEach((r: any) => {
        const d = new Date(r.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const cur = buckets.get(key) ?? { sum: 0, n: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) };
        cur.sum += Number(r.screen_minutes ?? 0);
        cur.n += 1;
        buckets.set(key, cur);
      });
      setYearData(
        Array.from(buckets.values())
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((b) => ({
            label: `${MONTHS_DE[b.date.getMonth()]} ${String(b.date.getFullYear()).slice(2)}`,
            avgMinutes: Math.round(b.sum / Math.max(1, b.n)),
          }))
      );
    })();
  }, [user]);

  const max = Math.max(1, ...heatmap.flat());

  const yearInsight = useMemo(() => {
    if (yearData.length < 2) return null;
    const first = yearData[0]; const last = yearData[yearData.length - 1];
    const diffMin = first.avgMinutes - last.avgMinutes;
    const hoursPerMonth = Math.round(((diffMin * 22) / 60) * 10) / 10;
    const pct = first.avgMinutes > 0 ? Math.round((diffMin / first.avgMinutes) * 100) : 0;
    return { diffMin: Math.round(diffMin), hoursPerMonth, pct, first, last };
  }, [yearData]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Statistik</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Dein Verlauf der letzten 14 Tage</p>
      </header>

      <section className="px-5 mb-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-2.5">
          <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Diese Daten sieht <strong className="text-foreground">nur du</strong>. Erfassung ausschließlich während der Arbeitszeit.
          </p>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="surface-card p-5">
          <h2 className="font-semibold mb-4">Bildschirmzeit-Verlauf</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: any) => [formatMinutes(Number(v)), "Bildschirmzeit"]}
                />
                <Area type="monotone" dataKey="mins" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {yearData.length >= 2 && (
        <section className="px-5 mb-6">
          <div className="surface-card p-5">
            <h2 className="font-semibold flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" /> Jahresüberblick</h2>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Ø Bildschirmzeit pro Monat – seit du TeamFocus nutzt</p>
            {yearInsight && yearInsight.diffMin > 0 && (
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Dein Fortschritt</p>
                <p className="text-2xl font-semibold tracking-tight">−{yearInsight.hoursPerMonth} Std / Monat</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Du bist heute <span className="font-medium text-foreground">{yearInsight.diffMin} Min/Tag</span> weniger am Handy als zu Beginn ({yearInsight.pct}% weniger).
                </p>
              </div>
            )}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearData}>
                  <defs>
                    <linearGradient id="yearG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: any) => [`${v} min`, "Ø Bildschirmzeit"]}
                  />
                  <Area type="monotone" dataKey="avgMinutes" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#yearG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 mb-6">
        <div className="surface-card p-5">
          <h2 className="font-semibold mb-1">Fokus-Heatmap</h2>
          <p className="text-xs text-muted-foreground mb-4">Letzte 7 Tage · je dunkler, desto mehr Nutzung</p>
          <div className="space-y-1.5">
            {heatmap.map((row, di) => (
              <div key={di} className="flex items-center gap-1.5">
                <div className="w-8 text-[10px] text-muted-foreground">{formatWeekdayShort(new Date(Date.now() - (6 - di) * 86400000))}</div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {row.map((v, hi) => (
                    <div
                      key={hi}
                      className="h-5 rounded-md transition-all"
                      style={{ background: `hsl(var(--primary) / ${Math.min(0.85, v / max * 0.85 + 0.05)})` }}
                      title={`${hi * 2}:00 – ${formatMinutes(v)}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 pl-9">
            <span>00:00</span><span>12:00</span><span>22:00</span>
          </div>
        </div>
      </section>
    </div>
  );
}
