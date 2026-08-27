import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, Calendar, EyeOff } from "lucide-react";
import { formatMinutes, focusMinutes } from "@/lib/format";
import { useT, useI18n } from "@/i18n";

interface Goal {
  reward_title: string;
  reward_note: string | null;
  target_focus_minutes: number;
  period_end: string;
  unlocked: boolean;
}

export default function TeamsPage() {
  const t = useT();
  const { lang } = useI18n();
  const { companyId, teamId } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [team, setTeam] = useState<{ name: string; color: string; emoji: string | null } | null>(null);
  const [avgFocus, setAvgFocus] = useState<number | null>(null);
  const [members, setMembers] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: ch } = await supabase
        .from("challenges").select("*").eq("company_id", companyId).eq("status", "active").maybeSingle();
      setChallenge(ch);

      if (!teamId) return;
      const [{ data: t }, { data: summary }, { data: g }] = await Promise.all([
        supabase.from("teams").select("name, color, emoji").eq("id", teamId).maybeSingle(),
        supabase.from("daily_team_summaries").select("avg_screen_minutes, member_count").eq("team_id", teamId).eq("date", today).maybeSingle(),
        supabase.from("team_goals").select("reward_title, reward_note, target_focus_minutes, period_end, unlocked")
          .eq("team_id", teamId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setTeam(t ?? null);
      setAvgFocus(summary ? focusMinutes(Number(summary.avg_screen_minutes)) : null);
      setMembers(summary?.member_count ?? null);
      setGoal(g ? { ...g, target_focus_minutes: Number(g.target_focus_minutes) } : null);
    })();
  }, [companyId, teamId]);

  const progress = goal && goal.target_focus_minutes > 0 && avgFocus !== null
    ? Math.min(100, Math.round((avgFocus / goal.target_focus_minutes) * 100))
    : null;

  const localeForDate = lang === "de" ? "de-DE" : lang === "es" ? "es-ES" : "en-US";

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">{t("employee.teams.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("employee.teams.subtitle")}</p>
      </header>

      {challenge && (
        <section className="px-5 mb-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1.5">
              <Trophy className="h-4 w-4" /> {t("employee.teams.active_challenge")}
            </div>
            <h2 className="font-semibold text-lg">{challenge.title}</h2>
            {challenge.description && <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
              <Calendar className="h-3.5 w-3.5" />
              {t("employee.teams.until")} {new Date(challenge.end_date).toLocaleDateString(localeForDate)}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          {!teamId ? (
            <p className="text-sm text-muted-foreground">{t("employee.teams.no_team")}</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-lg grid place-items-center text-xs font-semibold text-white shrink-0"
                  style={{ background: team?.color ?? "hsl(var(--primary))" }} aria-hidden="true">
                  {(team?.name ?? "TM").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-medium">{team?.name ?? t("employee.teams.your_team")}</p>
                  {members !== null && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{members} {t("employee.teams.members")}</p>
                  )}
                </div>
              </div>

              {goal ? (
                <div className="mt-5">
                  <p className="font-medium">{goal.reward_title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("employee.teams.goal_label")}: Ø {formatMinutes(goal.target_focus_minutes)} {t("employee.teams.focus_time_per_day")} · {t("employee.teams.until")} {new Date(goal.period_end).toLocaleDateString(localeForDate)}
                  </p>
                  <div className="mt-4 h-2.5 rounded-full bg-secondary overflow-hidden" role="progressbar"
                    aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label={t("employee.teams.progress_aria")}>
                    <div className={goal.unlocked ? "h-full rounded-full bg-success" : "h-full rounded-full bg-primary"}
                      style={{ width: `${progress ?? 0}%` }} />
                  </div>
                  <p className="text-sm mt-2">
                    {goal.unlocked ? t("employee.teams.reward_unlocked") : `${progress ?? 0} % ${t("employee.teams.reached")}`}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-5">
                  {t("employee.teams.no_goal")}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section className="px-5">
        <div className="surface-card p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-2"><EyeOff className="h-4 w-4 text-muted-foreground" /> {t("employee.teams.employer_sees_title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("employee.teams.employer_sees_desc")}
          </p>
        </div>
      </section>
    </div>
  );
}
