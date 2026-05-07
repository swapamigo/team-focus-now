import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Trophy, Activity, TrendingDown, Sparkles } from "lucide-react";
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

export default function ManagerDashboard() {
  const { companyId, profile } = useAuth();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: company }, { data: teamsData }, { data: members }, { data: challenge }, { data: summaries }] = await Promise.all([
      supabase.from("companies").select("name").eq("id", companyId).maybeSingle(),
      supabase.from("teams").select("id, name, emoji, color").eq("company_id", companyId),
      supabase.from("company_members").select("id").eq("company_id", companyId),
      supabase.from("challenges").select("title").eq("company_id", companyId).eq("status", "active").maybeSingle(),
      supabase.from("daily_team_summaries").select("team_id, avg_screen_minutes, member_count").eq("company_id", companyId).eq("date", today),
    ]);
    setCompanyName(company?.name ?? "");
    setMemberCount(members?.length ?? 0);
    setActiveChallenge(challenge?.title ?? null);
    const sumByTeam = new Map((summaries ?? []).map(s => [s.team_id, s]));
    setTeams(
      (teamsData ?? []).map(t => {
        const s = sumByTeam.get(t.id);
        return { id: t.id, name: t.name, emoji: t.emoji, color: t.color, avgMin: Number(s?.avg_screen_minutes ?? 0), members: s?.member_count ?? 0 };
      }).sort((a, b) => a.avgMin - b.avgMin)
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, [companyId]);

  const simulate = async () => {
    toast.info("Simuliere neuen Tag…");
    const { error } = await supabase.functions.invoke("simulate-tick", {});
    if (error) return toast.error("Fehler bei Simulation");
    toast.success("Daten aktualisiert.");
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Hallo {profile?.display_name ?? "Manager"} 👋</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{companyName || "Workspace"}</h1>
        </div>
        <Button onClick={simulate} variant="outline" className="rounded-2xl hidden sm:inline-flex">
          <Sparkles className="h-4 w-4 mr-2" /> Tag simulieren
        </Button>
      </header>

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
              <li key={t.id} className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/60">
                <span className="w-6 text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                <span className="text-2xl">{t.emoji ?? "🚀"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.members} Mitglieder</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{Math.round(t.avgMin)} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button onClick={simulate} variant="outline" className="rounded-2xl w-full mt-6 sm:hidden">
        <Sparkles className="h-4 w-4 mr-2" /> Demo-Tag simulieren
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
