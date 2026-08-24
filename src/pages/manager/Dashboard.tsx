import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Trophy, Activity, TrendingUp, Sparkles, Zap, Clock, CalendarRange } from "lucide-react";
import PrivacySelfTest from "@/components/app/PrivacySelfTest";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MONTHS_DE, focusMinutes } from "@/lib/format";

interface TeamRow {
  id: string;
  name: string;
  emoji: string | null;
  color: string;
  avgMin: number;
  members: number;
}

interface AdHocFocus {
  id: string;
  end: Date;
  multiplier: number;
}

interface MonthPoint {
  label: string;
  avgMinutes: number;
}


export default function ManagerDashboard() {
  const { companyId, profile } = useAuth();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adHoc, setAdHoc] = useState<AdHocFocus | null>(null);
  const [now, setNow] = useState(Date.now());
  const [yearData, setYearData] = useState<MonthPoint[]>([]);
  const [simulating, setSimulating] = useState(false);

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const yearAgo = new Date(); yearAgo.setDate(yearAgo.getDate() - 365);

    const [{ data: company }, { data: teamsData }, { data: members }, { data: challenge }, { data: summaries }, { data: focus }, { data: yearRows }] = await Promise.all([
      supabase.from("companies").select("name").eq("id", companyId).maybeSingle(),
      supabase.from("teams").select("id, name, emoji, color").eq("company_id", companyId),
      supabase.from("company_members").select("user_id").eq("company_id", companyId),
      supabase.from("challenges").select("title").eq("company_id", companyId).eq("status", "active").maybeSingle(),
      supabase.from("daily_team_summaries").select("team_id, avg_screen_minutes").eq("company_id", companyId).eq("date", today),
      supabase.from("high_focus_periods").select("id, ad_hoc_until, multiplier").eq("company_id", companyId).not("ad_hoc_until", "is", null).order("ad_hoc_until", { ascending: false }).limit(1),
      supabase.from("daily_team_summaries").select("date, avg_screen_minutes").eq("company_id", companyId).gte("date", yearAgo.toISOString().slice(0, 10)).order("date", { ascending: true }).limit(10000),
    ]);

    setCompanyName(company?.name ?? "");
    setMemberCount(members?.length ?? 0);
    setActiveChallenge(challenge?.title ?? null);

    const teamIds = (teamsData ?? []).map((t) => t.id);
    const { data: tm } = teamIds.length
      ? await supabase.from("team_members").select("team_id").in("team_id", teamIds)
      : { data: [] as { team_id: string }[] };
    const counts: Record<string, number> = {};
    (tm ?? []).forEach((r: any) => { counts[r.team_id] = (counts[r.team_id] ?? 0) + 1; });

    const sumByTeam = new Map((summaries ?? []).map((s) => [s.team_id, s]));
    setTeams(
      (teamsData ?? [])
        .map((t) => {
          const s = sumByTeam.get(t.id);
          return {
            id: t.id, name: t.name, emoji: t.emoji, color: t.color,
            avgMin: focusMinutes(Number(s?.avg_screen_minutes ?? 0)),
            members: counts[t.id] ?? 0,
          };
        })
        .sort((a, b) => b.avgMin - a.avgMin)
    );

    // Aggregiere Jahresdaten in Monate (Datums-String direkt parsen, keine TZ-Verschiebung)
    const buckets = new Map<string, { sum: number; n: number; year: number; month: number }>();
    (yearRows ?? []).forEach((r: any) => {
      const year = Number(r.date.slice(0, 4));
      const month = Number(r.date.slice(5, 7)) - 1;
      const key = `${year}-${month}`;
      const cur = buckets.get(key) ?? { sum: 0, n: 0, year, month };
      cur.sum += Number(r.avg_screen_minutes ?? 0);
      cur.n += 1;
      buckets.set(key, cur);
    });
    const points: MonthPoint[] = Array.from(buckets.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((b) => ({
        label: `${MONTHS_DE[b.month]} ${String(b.year).slice(2)}`,
        avgMinutes: focusMinutes(Math.round(b.sum / Math.max(1, b.n))),
      }));
    setYearData(points);

    const f = focus?.[0];
    if (f && f.ad_hoc_until && new Date(f.ad_hoc_until).getTime() > Date.now()) {
      setAdHoc({ id: f.id, end: new Date(f.ad_hoc_until), multiplier: Number(f.multiplier) });
    } else {
      setAdHoc(null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [companyId]);
  useEffect(() => {
    if (!adHoc) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [adHoc]);

  const remaining = useMemo(() => {
    if (!adHoc) return null;
    const ms = adHoc.end.getTime() - now;
    if (ms <= 0) return "00:00";
    const m = Math.floor(ms / 60000); const s = Math.floor((ms % 60000) / 1000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [adHoc, now]);

  // Jahres-Insights: Vergleich erster vs. letzter Monat
  const yearInsight = useMemo(() => {
    if (yearData.length < 2) return null;
    const first = yearData[0];
    const last = yearData[yearData.length - 1];
    const diffMin = last.avgMinutes - first.avgMinutes;
    // Zusätzliche Fokus-Stunden pro Mitarbeiter pro Monat (≈22 Arbeitstage)
    const hoursPerMonth = (diffMin * 22) / 60;
    const pct = first.avgMinutes > 0 ? Math.round((diffMin / first.avgMinutes) * 100) : 0;
    return {
      diffMin: Math.round(diffMin),
      hoursPerMonth: Math.round(hoursPerMonth * 10) / 10,
      pct,
      firstLabel: first.label,
      lastLabel: last.label,
      firstAvg: first.avgMinutes,
      lastAvg: last.avgMinutes,
    };
  }, [yearData]);

  const startAdHoc = async (minutes: number) => {
    if (!companyId) return;
    const end = new Date(Date.now() + minutes * 60_000);
    const { error } = await supabase.from("high_focus_periods").insert({
      company_id: companyId,
      label: `Ad-hoc Fokus ${minutes} min`,
      start_time: new Date().toTimeString().slice(0, 8),
      end_time: end.toTimeString().slice(0, 8),
      multiplier: 2.0,
      ad_hoc_until: end.toISOString(),
      weekdays: [new Date().getDay()],
    });
    if (error) return toast.error(error.message);
    toast.success(`High-Focus für ${minutes} min aktiv – Fokuszeit zählt doppelt.`);
    load();
  };

  const stopAdHoc = async () => {
    if (!adHoc) return;
    await supabase.from("high_focus_periods").update({ ad_hoc_until: new Date().toISOString() }).eq("id", adHoc.id);
    toast.info("High-Focus beendet.");
    load();
  };

  const simulateYear = async () => {
    setSimulating(true);
    toast.info("Simuliere Demo-Jahr… kann einen Moment dauern.");
    const { error } = await supabase.functions.invoke("simulate-year", {});
    setSimulating(false);
    if (error) return toast.error("Fehler bei Simulation");
    toast.success("365 Tage Demo-Daten aktualisiert.");
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Hallo {profile?.display_name ?? "Manager"}</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{companyName || "Workspace"}</h1>
        </div>
        <Button onClick={simulateYear} disabled={simulating} variant="outline" className="hidden sm:inline-flex">
          <Sparkles className="h-4 w-4 mr-2" /> {simulating ? "Simuliere…" : "Demo-Jahr simulieren"}
        </Button>
      </header>

      {/* High-Focus Quick-Toggle */}
      <section className={adHoc ? "surface-card p-5 mb-6 border-primary/40 bg-primary/5" : "surface-card p-5 mb-6"}>
        <div className="flex items-center gap-4">
          <div className={"h-12 w-12 rounded-xl grid place-items-center " + (adHoc ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary")}>
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold flex items-center gap-2">
              High-Focus
              {adHoc && <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />Aktiv</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {adHoc
                ? <>Endet um {adHoc.end.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · Fokus ×{adHoc.multiplier}</>
                : "Aktiviere eine fokussierte Phase. Gesammelte Fokuszeit zählt doppelt."}
            </p>
          </div>
          {adHoc ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-semibold tabular-nums flex items-center gap-1.5"><Clock className="h-4 w-4 text-muted-foreground" />{remaining}</div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">verbleibend</p>
              </div>
              <Button size="sm" variant="outline" onClick={stopAdHoc}>Beenden</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startAdHoc(30)}>30 min</Button>
              <Button size="sm" onClick={() => startAdHoc(60)}>60 min</Button>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat icon={Users} label="Mitarbeitende" value={memberCount.toString()} />
        <Stat icon={Trophy} label="Teams" value={teams.length.toString()} />
        <Stat icon={Activity} label="Aktive Challenge" value={activeChallenge ? "Läuft" : "—"} small={activeChallenge ?? undefined} />
        <Stat icon={TrendingUp} label="Ø Fokuszeit heute" value={teams.length ? `${Math.round(teams.reduce((s, t) => s + t.avgMin, 0) / teams.length)} min` : "—"} />
      </div>

      {/* Jahresüberblick */}
      <section className="surface-card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" /> Jahresüberblick</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fokuszeit Ø pro Mitarbeitendem · Monatsverlauf</p>
          </div>
        </div>

        {yearData.length < 2 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            Noch keine Jahresdaten. Klicke auf <span className="font-medium">„Demo-Jahr simulieren"</span>, um den Trend zu sehen.
          </div>
        ) : (
          <>
            {yearInsight && yearInsight.diffMin > 0 && (
              <div
                className="mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20 p-5"
                title={`Seit Einführung: Ø Fokuszeit von ${yearInsight.firstAvg} auf ${yearInsight.lastAvg} min/Tag (${yearInsight.firstLabel} → ${yearInsight.lastLabel}).`}
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Seit Einführung von TeamFokus</p>
                <p className="text-3xl md:text-4xl font-semibold tracking-tight">
                  +{yearInsight.hoursPerMonth} Std Fokus / Monat
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {yearInsight.pct}% mehr Fokuszeit ({yearInsight.firstAvg} → {yearInsight.lastAvg} Min/Tag).
                </p>
              </div>
            )}

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearData}>
                  <defs>
                    <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: any) => [`${v} min`, "Ø Fokuszeit"]}
                  />
                  <Area type="monotone" dataKey="avgMinutes" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#yearGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="font-semibold mb-4">Team-Ranking heute · meiste Fokuszeit</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Lädt…</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Teams. Lege welche an.</p>
        ) : (
          <ul className="space-y-2">
            {teams.map((t, i) => (
              <li key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/60">
                <span className="w-6 text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                <span className="h-8 w-8 rounded-lg grid place-items-center text-xs font-semibold text-white" style={{ background: t.color }}>{t.name.slice(0, 2).toUpperCase()}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.members} {t.members === 1 ? "Mitglied" : "Mitglieder"}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{Math.round(t.avgMin)} min Fokus</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <PrivacySelfTest />
      </section>

      <Button onClick={simulateYear} disabled={simulating} variant="outline" className="w-full mt-6 sm:hidden">
        <Sparkles className="h-4 w-4 mr-2" /> {simulating ? "Simuliere…" : "Demo-Jahr simulieren"}
      </Button>
    </div>
  );
}

function Stat({ icon: Icon, label, value, small }: { icon: any; label: string; value: string; small?: string }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      {small && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{small}</p>}
    </div>
  );
}
