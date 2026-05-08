import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, Calendar } from "lucide-react";
import { formatMinutes } from "@/lib/format";

export default function TeamsPage() {
  const { companyId, teamId } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: ts }, { data: ch }] = await Promise.all([
        supabase.from("daily_team_summaries")
          .select("team_id, avg_screen_minutes, member_count, teams!inner(name, emoji, color)")
          .eq("company_id", companyId).eq("date", today)
          .order("avg_screen_minutes"),
        supabase.from("challenges").select("*").eq("company_id", companyId).eq("status", "active").maybeSingle(),
      ]);
      setTeams(ts ?? []);
      setChallenge(ch);
    })();
  }, [companyId]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Wer hat heute am wenigsten abgelenkt?</p>
      </header>

      {challenge && (
        <section className="px-5 mb-5">
          <div className="surface-card p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full gradient-primary opacity-10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1.5">
                <Trophy className="h-4 w-4" />
                Aktive Challenge
              </div>
              <h2 className="font-semibold text-lg">{challenge.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                <Calendar className="h-3.5 w-3.5" />
                bis {new Date(challenge.end_date).toLocaleDateString("de-DE")}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-5">
        <div className="surface-card divide-y divide-border/60">
          {teams.map((t, i) => {
            const isOwn = t.team_id === teamId;
            return (
              <div key={t.team_id} className={`flex items-center gap-3 p-4 ${isOwn ? "bg-primary/5" : ""}`}>
                <div className="w-8 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-sm font-medium text-muted-foreground">{i + 1}.</span>}
                </div>
                <div className="h-11 w-11 rounded-lg grid place-items-center text-xs font-semibold text-white shrink-0" style={{ background: t.teams.color }}>
                  {t.teams.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{t.teams.name} {isOwn && <span className="text-xs text-primary ml-1">(Du)</span>}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>Ø {formatMinutes(Number(t.avg_screen_minutes))}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.member_count}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {teams.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">Noch keine Teamdaten verfügbar.</div>
          )}
        </div>
      </section>
    </div>
  );
}
