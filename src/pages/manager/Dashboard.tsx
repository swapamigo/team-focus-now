import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Trophy, Activity, TrendingDown, Sparkles, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export default function ManagerDashboard() {
  const { companyId, profile } = useAuth();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adHoc, setAdHoc] = useState<AdHocFocus | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: company }, { data: teamsData }, { data: members }, { data: challenge }, { data: summaries }, { data: focus }] = await Promise.all([
      supabase.from("companies").select("name").eq("id", companyId).maybeSingle(),
      supabase.from("teams").select("id, name, emoji, color").eq("company_id", companyId),
      supabase.from("company_members").select("user_id").eq("company_id", companyId),
      supabase.from("challenges").select("title").eq("company_id", companyId).eq("status", "active").maybeSingle(),
      supabase.from("daily_team_summaries").select("team_id, avg_screen_minutes").eq("company_id", companyId).eq("date", today),
      supabase.from("high_focus_periods").select("id, ad_hoc_until, multiplier").eq("company_id", companyId).not("ad_hoc_until", "is", null).order("ad_hoc_until", { ascending: false }).limit(1),
    ]);

    setCompanyName(company?.name ?? "");
    setMemberCount(members?.length ?? 0);
    setActiveChallenge(challenge?.title ?? null);

    // Tatsächliche Mitgliederzahl pro Team aus team_members holen (konsistent mit Teams-Seite)
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
            avgMin: Number(s?.avg_screen_minutes ?? 0),
            members: counts[t.id] ?? 0,
          };
        })
        .sort((a, b) => a.avgMin - b.avgMin)
    );

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
    toast.success(`High-Focus für ${minutes} min aktiv – Ablenkung zählt doppelt.`);
    load();
  };

  const stopAdHoc = async () => {
    if (!adHoc) return;
    await supabase.from("high_focus_periods").update({ ad_hoc_until: new Date().toISOString() }).eq("id", adHoc.id);
    toast.info("High-Focus beendet.");
    load();
  };

  const simulate = async () => {
    toast.info("Simuliere Demo-Monat…");
    const { error } = await supabase.functions.invoke("simulate-month", {});
    if (error) return toast.error("Fehler bei Simulation");
    toast.success("30 Tage Demo-Daten aktualisiert.");
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Hallo {profile?.display_name ?? "Manager"}</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{companyName || "Workspace"}</h1>
        </div>
        <Button onClick={simulate} variant="outline" className="hidden sm:inline-flex">
          <Sparkles className="h-4 w-4 mr-2" /> Demo-Monat simulieren
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
                ? <>Endet um {adHoc.end.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · Penalty ×{adHoc.multiplier}</>
                : "Aktiviere eine fokussierte Phase. Ablenkungszeit zählt doppelt."}
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
        <Stat icon={TrendingDown} label="Ø Ablenkung heute" value={teams.length ? `${Math.round(teams.reduce((s, t) => s + t.avgMin, 0) / teams.length)} min` : "—"} />
      </div>

      <section className="surface-card p-6">
        <h2 className="font-semibold mb-4">Team-Ranking heute</h2>
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
                <span className="text-sm font-semibold tabular-nums">{Math.round(t.avgMin)} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button onClick={simulate} variant="outline" className="w-full mt-6 sm:hidden">
        <Sparkles className="h-4 w-4 mr-2" /> Demo-Monat simulieren
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
