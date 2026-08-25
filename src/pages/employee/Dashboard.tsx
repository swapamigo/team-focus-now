import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatMinutes, isoDate, lastNDates, formatWeekdayShort, MONTHS_DE, focusMinutes } from "@/lib/format";
import { Trophy, Flame, Smartphone, TrendingUp, TrendingDown, Lock, CalendarRange } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";

interface TeamGoal {
  reward_title: string;
  target_focus_minutes: number;
  unlocked: boolean;
}

export default function EmployeeDashboard() {
  const { user, companyId, teamId, profile } = useAuth();
  const [todayMin, setTodayMin] = useState(0);
  const [todayPenalty, setTodayPenalty] = useState(0);
  const [yesterdayMin, setYesterdayMin] = useState(0);
  const [week, setWeek] = useState<{ date: string; mins: number; label: string }[]>([]);
  const [teamGoal, setTeamGoal] = useState<TeamGoal | null>(null);
  const [ownTeamAvg, setOwnTeamAvg] = useState<number | null>(null);
  const [highFocusActive, setHighFocusActive] = useState<{ label: string; multiplier: number } | null>(null);
  const [twoWeek, setTwoWeek] = useState<{ label: string; mins: number }[]>([]);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [yearData, setYearData] = useState<{ label: string; avgMinutes: number }[]>([]);


  useEffect(() => {
    if (!user || !companyId) return;
    (async () => {
      const dates = lastNDates(7);
      const dates14 = lastNDates(14);
      const today = isoDate(new Date());
      const yesterday = isoDate(new Date(Date.now() - 86400000));

      const { data: own } = await supabase
        .from("daily_user_summaries")
        .select("date, screen_minutes, penalty_minutes")
        .eq("user_id", user.id)
        .gte("date", isoDate(dates14[0]))
        .order("date");

      const ownMap = new Map((own ?? []).map((r: any) => [r.date, r]));
      setWeek(dates.map((d) => {
        const key = isoDate(d);
        const r: any = ownMap.get(key);
        return { date: key, mins: focusMinutes(Number(r?.screen_minutes ?? 0), Number(r?.penalty_minutes ?? 0)), label: formatWeekdayShort(d) };
      }));
      setTwoWeek(dates14.map((d) => {
        const r: any = ownMap.get(isoDate(d));
        return { label: formatWeekdayShort(d), mins: focusMinutes(Number(r?.screen_minutes ?? 0), Number(r?.penalty_minutes ?? 0)) };
      }));
      const t: any = ownMap.get(today);
      const y: any = ownMap.get(yesterday);
      setTodayMin(focusMinutes(Number(t?.screen_minutes ?? 0), Number(t?.penalty_minutes ?? 0)));
      setTodayPenalty(Number(t?.penalty_minutes ?? 0));
      setYesterdayMin(focusMinutes(Number(y?.screen_minutes ?? 0), Number(y?.penalty_minutes ?? 0)));

      // Nur das eigene Team – keine teamübergreifende Rangliste.
      if (teamId) {
        const [{ data: ownTeam }, { data: goal }] = await Promise.all([
          supabase
            .from("daily_team_summaries")
            .select("avg_screen_minutes")
            .eq("team_id", teamId)
            .eq("date", today)
            .maybeSingle(),
          supabase
            .from("team_goals")
            .select("reward_title, target_focus_minutes, unlocked")
            .eq("team_id", teamId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
        setOwnTeamAvg(ownTeam ? focusMinutes(Number(ownTeam.avg_screen_minutes)) : null);
        setTeamGoal(goal ? { reward_title: goal.reward_title, target_focus_minutes: Number(goal.target_focus_minutes), unlocked: goal.unlocked } : null);
      }


      const { data: hf } = await supabase
        .from("high_focus_periods")
        .select("label, multiplier, start_time, end_time, weekdays, active")
        .eq("company_id", companyId)
        .eq("active", true);
      const now = new Date();
      const wd = now.getDay();
      const hhmm = now.toTimeString().slice(0, 5);
      const active = (hf ?? []).find((p: any) =>
        (p.weekdays ?? []).includes(wd) && p.start_time <= hhmm && p.end_time >= hhmm
      );
      setHighFocusActive(active ? { label: active.label, multiplier: Number(active.multiplier) } : null);

      // Heatmap 7d × 12 Slots
      const { data: ev } = await supabase
        .from("usage_events")
        .select("occurred_at, duration_seconds")
        .eq("user_id", user.id)
        .gte("occurred_at", dates[0].toISOString());
      const grid: number[][] = Array.from({ length: 7 }, () => Array(12).fill(0));
      (ev ?? []).forEach((e: any) => {
        const d = new Date(e.occurred_at);
        const dayIdx = Math.floor((d.getTime() - dates[0].getTime()) / 86400000);
        if (dayIdx < 0 || dayIdx > 6) return;
        const slot = Math.floor(d.getHours() / 2);
        grid[dayIdx][slot] += Number(e.duration_seconds) / 60;
      });
      setHeatmap(grid);

      // Jahresverlauf
      const yearAgo = new Date(); yearAgo.setDate(yearAgo.getDate() - 365);
      const { data: yearRows } = await supabase
        .from("daily_user_summaries")
        .select("date, screen_minutes")
        .eq("user_id", user.id)
        .gte("date", yearAgo.toISOString().slice(0, 10))
        .order("date", { ascending: true })
        .limit(10000);
      const buckets = new Map<string, { sum: number; n: number; year: number; month: number }>();
      (yearRows ?? []).forEach((r: any) => {
        // r.date is "YYYY-MM-DD" — parse string directly to avoid timezone shifts
        const year = Number(r.date.slice(0, 4));
        const month = Number(r.date.slice(5, 7)) - 1;
        const key = `${year}-${month}`;
        const cur = buckets.get(key) ?? { sum: 0, n: 0, year, month };
        cur.sum += Number(r.screen_minutes ?? 0);
        cur.n += 1;
        buckets.set(key, cur);
      });
      setYearData(
        Array.from(buckets.values())
          .sort((a, b) => a.year - b.year || a.month - b.month)
          .map((b) => ({
            label: `${MONTHS_DE[b.month]} ${String(b.year).slice(2)}`,
            avgMinutes: focusMinutes(Math.round(b.sum / Math.max(1, b.n))),
          }))
      );
    })();
  }, [user, companyId, teamId]);

  const goalProgress = teamGoal && teamGoal.target_focus_minutes > 0 && ownTeamAvg !== null
    ? Math.min(100, Math.round((ownTeamAvg / teamGoal.target_focus_minutes) * 100))
    : null;

  const diffYesterday = yesterdayMin - todayMin; // > 0 = heute weniger Fokus
  const heatMax = Math.max(1, ...heatmap.flat());

  const yearInsight = useMemo(() => {
    if (yearData.length < 2) return null;
    const first = yearData[0]; const last = yearData[yearData.length - 1];
    const diffMin = last.avgMinutes - first.avgMinutes;
    const hoursPerMonth = Math.round(((diffMin * 22) / 60) * 10) / 10;
    const pct = first.avgMinutes > 0 ? Math.round((diffMin / first.avgMinutes) * 100) : 0;
    return { diffMin: Math.round(diffMin), hoursPerMonth, pct };
  }, [yearData]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4 animate-fade-in">
        <p className="text-sm text-muted-foreground">Hallo {profile?.display_name?.split(" ")[0] ?? "👋"}</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Heute</h1>
      </header>

      {highFocusActive && (
        <div className="mx-5 mb-4 rounded-2xl gradient-focus p-5 text-focus-foreground shadow-md animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 grid place-items-center">
              <Flame className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">High-Focus-Zeit aktiv</p>
              <p className="text-xs opacity-90">{highFocusActive.label} · Private Nutzung zählt {highFocusActive.multiplier}×</p>
            </div>
          </div>
        </div>
      )}

      <section className="px-5 mb-4">
        <div className="surface-card p-6 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-10 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Fokuszeit heute</p>
            <p className="text-5xl font-semibold tracking-tight mt-2">{formatMinutes(todayMin)}</p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              {diffYesterday <= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">{formatMinutes(Math.abs(diffYesterday))} mehr</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <span className="text-warning font-medium">{formatMinutes(diffYesterday)} weniger</span>
                </>
              )}
              <span className="text-muted-foreground">als gestern</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6 grid grid-cols-2 gap-3">
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1.5"><Smartphone className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Abgezogene Zeit</span></div>
          <p className="text-2xl font-semibold">{formatMinutes(todayPenalty)}</p>
        </div>
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Team-Platz</span></div>
          <p className="text-2xl font-semibold">{ownRank > 0 ? `${ownRank}. von ${teams.length}` : "–"}</p>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="surface-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Diese Woche</h2>
            <span className="text-xs text-muted-foreground">Fokusminuten</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", radius: 12 }}
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: any) => [formatMinutes(Number(v)), "Fokuszeit"]}
                  labelFormatter={() => ""}
                />
                <Bar dataKey="mins" radius={[8, 8, 8, 8]}>
                  {week.map((_, i) => (
                    <Cell key={i} fill={i === week.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <h2 className="font-semibold mb-3 px-1">Team-Ranking heute · meiste Fokuszeit</h2>
        <div className="surface-card divide-y divide-border/60 animate-fade-in">
          {teams.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground text-center">Noch keine Daten – Demo-Tracking läuft.</div>
          )}
          {teams.map((t, i) => (
            <div key={t.team_id} className={cn("flex items-center gap-3 p-4", t.is_own && "bg-primary/5")}>
              <div className="w-7 text-center">
                {i === 0 ? <span className="text-lg">🥇</span> : i === 1 ? <span className="text-lg">🥈</span> : i === 2 ? <span className="text-lg">🥉</span> : <span className="text-sm font-medium text-muted-foreground">{i + 1}.</span>}
              </div>
              <div className="h-10 w-10 rounded-lg grid place-items-center text-xs font-semibold text-white shrink-0" style={{ background: t.team_color }}>
                {t.team_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{t.team_name} {t.is_own && <span className="text-xs text-primary ml-1">(Dein Team)</span>}</p>
                <p className="text-xs text-muted-foreground">Ø {formatMinutes(t.avg_focus_minutes)} Fokus</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 14-Tage Verlauf */}
      <section className="px-5 mb-6">
        <div className="surface-card p-5">
          <h2 className="font-semibold mb-4">Verlauf · 14 Tage</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={twoWeek}>
                <defs>
                  <linearGradient id="empG14" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [formatMinutes(Number(v)), "Fokuszeit"]} />
                <Area type="monotone" dataKey="mins" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#empG14)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Heatmap */}
      <section className="px-5 mb-6">
        <div className="surface-card p-5">
          <h2 className="font-semibold mb-1">Ablenkungs-Heatmap</h2>
          <p className="text-xs text-muted-foreground mb-4">Letzte 7 Tage · je dunkler, desto mehr unterbrochene Fokuszeit</p>
          <div className="space-y-1.5">
            {heatmap.map((row, di) => (
              <div key={di} className="flex items-center gap-1.5">
                <div className="w-8 text-[10px] text-muted-foreground">{formatWeekdayShort(new Date(Date.now() - (6 - di) * 86400000))}</div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {row.map((v, hi) => (
                    <div key={hi} className="h-5 rounded-md transition-all"
                      style={{ background: `hsl(var(--primary) / ${Math.min(0.85, v / heatMax * 0.85 + 0.05)})` }}
                      title={`${hi * 2}:00 – ${formatMinutes(v)}`} />
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

      {/* Jahres-Übersicht */}
      {yearData.length >= 2 && (
        <section className="px-5 mb-6">
          <div className="surface-card p-5">
            <h2 className="font-semibold flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" /> Jahresüberblick</h2>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Ø Fokuszeit pro Monat</p>
            {yearInsight && yearInsight.diffMin > 0 && (
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Dein Fortschritt</p>
                <p className="text-2xl font-semibold tracking-tight">+{yearInsight.hoursPerMonth} Std Fokus / Monat</p>
                <p className="text-xs text-muted-foreground mt-1.5">{yearInsight.diffMin} Min/Tag mehr Fokuszeit ({yearInsight.pct}%).</p>
              </div>
            )}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearData}>
                  <defs>
                    <linearGradient id="empGY" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`${v} min`, "Ø Fokuszeit"]} />
                  <Area type="monotone" dataKey="avgMinutes" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#empGY)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      <section className="px-5">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Deine Privatsphäre ist geschützt 🔒</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Nur du</strong> siehst deine persönlichen Daten.
              Dein Manager erhält ausschließlich <strong className="text-foreground">anonyme Team-Aggregate</strong> – nie individuelle Werte.
              Erfasst wird nur während deiner Arbeitszeit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
