import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatMinutes, isoDate, lastNDates, formatWeekdayShort } from "@/lib/format";
import { Trophy, Flame, Smartphone, AlertTriangle, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface TeamRanking {
  team_id: string;
  team_name: string;
  team_emoji: string | null;
  team_color: string;
  avg_screen_minutes: number;
  is_own: boolean;
}

export default function EmployeeDashboard() {
  const { user, companyId, teamId, profile } = useAuth();
  const [todayMin, setTodayMin] = useState(0);
  const [todayPenalty, setTodayPenalty] = useState(0);
  const [yesterdayMin, setYesterdayMin] = useState(0);
  const [week, setWeek] = useState<{ date: string; mins: number; label: string }[]>([]);
  const [teams, setTeams] = useState<TeamRanking[]>([]);
  const [highFocusActive, setHighFocusActive] = useState<{ label: string; multiplier: number } | null>(null);

  useEffect(() => {
    if (!user || !companyId) return;
    (async () => {
      const dates = lastNDates(7);
      const today = isoDate(new Date());
      const yesterday = isoDate(new Date(Date.now() - 86400000));

      // Eigene 7-Tages-Statistik
      const { data: own } = await supabase
        .from("daily_user_summaries")
        .select("date, screen_minutes, penalty_minutes")
        .eq("user_id", user.id)
        .gte("date", isoDate(dates[0]))
        .order("date");

      const ownMap = new Map((own ?? []).map((r: any) => [r.date, r]));
      setWeek(dates.map((d) => {
        const key = isoDate(d);
        const r: any = ownMap.get(key);
        return { date: key, mins: Number(r?.screen_minutes ?? 0), label: formatWeekdayShort(d) };
      }));
      const t: any = ownMap.get(today);
      const y: any = ownMap.get(yesterday);
      setTodayMin(Number(t?.screen_minutes ?? 0));
      setTodayPenalty(Number(t?.penalty_minutes ?? 0));
      setYesterdayMin(Number(y?.screen_minutes ?? 0));

      // Team-Ranking (heute)
      const { data: teamSummaries } = await supabase
        .from("daily_team_summaries")
        .select("team_id, avg_screen_minutes, teams!inner(name, emoji, color)")
        .eq("company_id", companyId)
        .eq("date", today)
        .order("avg_screen_minutes", { ascending: true });

      setTeams((teamSummaries ?? []).map((r: any) => ({
        team_id: r.team_id,
        team_name: r.teams.name,
        team_emoji: r.teams.emoji,
        team_color: r.teams.color,
        avg_screen_minutes: Number(r.avg_screen_minutes),
        is_own: r.team_id === teamId,
      })));

      // High-Focus aktiv?
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
    })();
  }, [user, companyId, teamId]);

  const ownRank = teams.findIndex((t) => t.is_own) + 1;
  const ownTeam = teams.find((t) => t.is_own);
  const diffYesterday = todayMin - yesterdayMin;
  const maxWeek = Math.max(...week.map((w) => w.mins), 60);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 animate-fade-in">
        <p className="text-sm text-muted-foreground">Hallo {profile?.display_name?.split(" ")[0] ?? "👋"}</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Heute</h1>
      </header>

      {/* High Focus Banner */}
      {highFocusActive && (
        <div className="mx-5 mb-4 rounded-3xl gradient-focus p-5 text-focus-foreground shadow-glow animate-scale-in">
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

      {/* Hauptmetrik */}
      <section className="px-5 mb-4">
        <div className="surface-card p-6 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-10 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Bildschirmzeit heute</p>
            <p className="text-5xl font-semibold tracking-tight mt-2">{formatMinutes(todayMin)}</p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              {diffYesterday <= 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">{formatMinutes(Math.abs(diffYesterday))} weniger</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-warning" />
                  <span className="text-warning font-medium">{formatMinutes(diffYesterday)} mehr</span>
                </>
              )}
              <span className="text-muted-foreground">als gestern</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="px-5 mb-6 grid grid-cols-2 gap-3">
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1.5"><Smartphone className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Strafzeit</span></div>
          <p className="text-2xl font-semibold">{formatMinutes(todayPenalty)}</p>
        </div>
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Team-Platz</span></div>
          <p className="text-2xl font-semibold">{ownRank > 0 ? `${ownRank}. von ${teams.length}` : "–"}</p>
        </div>
      </section>

      {/* Wochenchart */}
      <section className="px-5 mb-6">
        <div className="surface-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Diese Woche</h2>
            <span className="text-xs text-muted-foreground">Bildschirmminuten</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", radius: 12 }}
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: any) => [formatMinutes(Number(v)), "Zeit"]}
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

      {/* Team-Ranking */}
      <section className="px-5 mb-6">
        <h2 className="font-semibold mb-3 px-1">Team-Ranking heute</h2>
        <div className="surface-card divide-y divide-border/60 animate-fade-in">
          {teams.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground text-center">Noch keine Daten – Demo-Tracking läuft.</div>
          )}
          {teams.map((t, i) => (
            <div key={t.team_id} className={cn("flex items-center gap-3 p-4", t.is_own && "bg-primary/5")}>
              <div className="w-7 text-center">
                {i === 0 ? <span className="text-lg">🥇</span> : i === 1 ? <span className="text-lg">🥈</span> : i === 2 ? <span className="text-lg">🥉</span> : <span className="text-sm font-medium text-muted-foreground">{i + 1}.</span>}
              </div>
              <div className="h-10 w-10 rounded-2xl grid place-items-center text-xl shrink-0" style={{ background: `${t.team_color}1f` }}>
                {t.team_emoji ?? "🚀"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{t.team_name} {t.is_own && <span className="text-xs text-primary ml-1">(Dein Team)</span>}</p>
                <p className="text-xs text-muted-foreground">Ø {formatMinutes(t.avg_screen_minutes)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Datenschutz-Hinweis */}
      <section className="px-5">
        <div className="rounded-3xl bg-secondary/60 p-4 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Du siehst nie individuelle Werte deiner Kolleg:innen. Nur dein eigener Wert und Team-Aggregate.
          </p>
        </div>
      </section>
    </div>
  );
}
