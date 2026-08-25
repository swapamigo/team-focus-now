-- 1) Team-Ziele / Belohnungen
CREATE TABLE public.team_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES public.challenges(id) ON DELETE SET NULL,
  reward_title text NOT NULL,
  reward_note text,
  baseline_focus_minutes numeric NOT NULL DEFAULT 0,
  target_focus_minutes numeric NOT NULL DEFAULT 0,
  period_start date NOT NULL DEFAULT current_date,
  period_end date NOT NULL DEFAULT (current_date + 56),
  unlocked boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX team_goals_company_idx ON public.team_goals(company_id, unlocked);
CREATE INDEX team_goals_team_idx ON public.team_goals(team_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_goals TO authenticated;
GRANT ALL ON public.team_goals TO service_role;

ALTER TABLE public.team_goals ENABLE ROW LEVEL SECURITY;

-- Manager: darf Ziele/Belohnungen definieren, aber nur freigeschaltete Ziele lesen.
CREATE POLICY team_goals_manager_insert ON public.team_goals
  FOR INSERT TO authenticated
  WITH CHECK (private.has_company_role(auth.uid(), company_id, 'manager'::app_role));

CREATE POLICY team_goals_manager_update ON public.team_goals
  FOR UPDATE TO authenticated
  USING (private.has_company_role(auth.uid(), company_id, 'manager'::app_role) AND unlocked = false)
  WITH CHECK (private.has_company_role(auth.uid(), company_id, 'manager'::app_role));

CREATE POLICY team_goals_manager_delete ON public.team_goals
  FOR DELETE TO authenticated
  USING (private.has_company_role(auth.uid(), company_id, 'manager'::app_role) AND unlocked = false);

CREATE POLICY team_goals_select_scoped ON public.team_goals
  FOR SELECT TO authenticated
  USING (
    (unlocked = true AND private.is_company_member(auth.uid(), company_id))
    OR team_id = private.get_user_team(auth.uid())
  );

CREATE TRIGGER team_goals_updated_at BEFORE UPDATE ON public.team_goals
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

-- 2) Manager/Admin verlieren jeden Zugriff auf Team-Aggregate
DROP POLICY IF EXISTS daily_team_summaries_select_scoped ON public.daily_team_summaries;
DROP POLICY IF EXISTS daily_team_summaries_manager_insert ON public.daily_team_summaries;
DROP POLICY IF EXISTS daily_team_summaries_manager_update ON public.daily_team_summaries;
DROP POLICY IF EXISTS daily_team_summaries_manager_delete ON public.daily_team_summaries;

CREATE POLICY daily_team_summaries_select_own_team ON public.daily_team_summaries
  FOR SELECT TO authenticated
  USING (
    team_id = private.get_user_team(auth.uid())
    AND member_count >= COALESCE((SELECT c.min_team_k FROM public.companies c WHERE c.id = daily_team_summaries.company_id), 5)
  );

-- 3) Zielprüfung ausschließlich serverseitig; gibt keine Nutzungswerte zurück.
CREATE OR REPLACE FUNCTION private.evaluate_team_goals()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_unlocked bigint := 0;
BEGIN
  WITH progress AS (
    SELECT g.id,
           AVG(GREATEST(0, 480 - COALESCE(dus.screen_minutes,0) - COALESCE(dus.penalty_minutes,0))) AS avg_focus,
           COUNT(DISTINCT dus.user_id) AS members
    FROM public.team_goals g
    JOIN public.daily_user_summaries dus
      ON dus.team_id = g.team_id
     AND dus.date BETWEEN g.period_start AND g.period_end
    WHERE g.unlocked = false
    GROUP BY g.id
  ), upd AS (
    UPDATE public.team_goals g
       SET unlocked = true, unlocked_at = now(), updated_at = now()
      FROM progress p
     WHERE p.id = g.id
       AND p.members >= COALESCE((SELECT c.min_team_k FROM public.companies c WHERE c.id = g.company_id), 5)
       AND p.avg_focus >= g.target_focus_minutes
    RETURNING 1
  )
  SELECT count(*) INTO v_unlocked FROM upd;

  RETURN jsonb_build_object('ran_at', now(), 'goals_unlocked', v_unlocked);
END;
$$;

REVOKE ALL ON FUNCTION private.evaluate_team_goals() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.evaluate_team_goals() TO service_role;