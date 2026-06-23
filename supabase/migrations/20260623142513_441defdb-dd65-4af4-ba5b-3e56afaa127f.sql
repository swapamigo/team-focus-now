
-- 1) Konfigurierbare Mindest-Teamgröße k (Default 5)
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS min_team_k integer NOT NULL DEFAULT 5
    CHECK (min_team_k BETWEEN 5 AND 10);

-- 2) Team-Aggregate: Sichtbarkeit nur ab k
DROP POLICY IF EXISTS daily_team_summaries_select_scoped ON public.daily_team_summaries;

CREATE POLICY daily_team_summaries_select_scoped
ON public.daily_team_summaries
FOR SELECT
TO authenticated
USING (
  -- Manager/Admin: nur sehen, wenn k erreicht ist
  (
    (private.has_company_role(auth.uid(), company_id, 'manager'::app_role)
      OR private.has_role(auth.uid(), 'admin'::app_role))
    AND member_count >= COALESCE(
      (SELECT c.min_team_k FROM public.companies c WHERE c.id = company_id), 5
    )
  )
  -- Mitarbeitende: eigenes Team, ebenfalls nur ab k
  OR (
    team_id = private.get_user_team(auth.uid())
    AND member_count >= COALESCE(
      (SELECT c.min_team_k FROM public.companies c WHERE c.id = company_id), 5
    )
  )
);

-- 3) Privacy Self-Test (für Manager/Admin-Bereich)
CREATE OR REPLACE FUNCTION public.privacy_self_test()
RETURNS TABLE (
  raw_events_older_than_24h bigint,
  team_aggregates_below_k bigint,
  min_team_k_default integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.usage_events WHERE occurred_at < (now() - interval '24 hours')),
    (SELECT count(*) FROM public.daily_team_summaries dts
       JOIN public.companies c ON c.id = dts.company_id
       WHERE dts.member_count < c.min_team_k),
    5;
$$;

REVOKE ALL ON FUNCTION public.privacy_self_test() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.privacy_self_test() TO authenticated, service_role;

-- 4) Aggregations- und Purge-Funktion (Edge-Function-only)
CREATE OR REPLACE FUNCTION public.run_aggregate_and_purge()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purged_events bigint := 0;
  v_user_rows bigint := 0;
  v_team_rows bigint := 0;
  v_cutoff timestamptz := now() - interval '24 hours';
BEGIN
  -- (a) Pro Person Tageswerte aggregieren und in daily_user_summaries upserten.
  --     Die persönliche Tageshistorie bleibt der Person erhalten (RLS: nur self).
  WITH agg AS (
    SELECT
      user_id,
      company_id,
      (occurred_at AT TIME ZONE 'UTC')::date AS d,
      SUM(duration_seconds) / 60.0 AS screen_minutes,
      SUM(penalty_minutes) AS penalty_minutes,
      COUNT(*) FILTER (WHERE event_type = 'unlock') AS unlocks,
      COUNT(*) FILTER (WHERE NOT is_whitelisted AND is_high_focus) AS focus_violations
    FROM public.usage_events
    WHERE occurred_at < v_cutoff
    GROUP BY user_id, company_id, (occurred_at AT TIME ZONE 'UTC')::date
  ), ins AS (
    INSERT INTO public.daily_user_summaries
      (user_id, company_id, team_id, date, screen_minutes, penalty_minutes, unlocks, focus_violations)
    SELECT
      a.user_id, a.company_id,
      (SELECT tm.team_id FROM public.team_members tm WHERE tm.user_id = a.user_id LIMIT 1),
      a.d, a.screen_minutes, a.penalty_minutes, a.unlocks, a.focus_violations
    FROM agg a
    ON CONFLICT (user_id, date) DO UPDATE
      SET screen_minutes = EXCLUDED.screen_minutes,
          penalty_minutes = EXCLUDED.penalty_minutes,
          unlocks = EXCLUDED.unlocks,
          focus_violations = EXCLUDED.focus_violations,
          updated_at = now()
    RETURNING 1
  )
  SELECT count(*) INTO v_user_rows FROM ins;

  -- (b) Team-Aggregate – erst ab k schreiben.
  WITH team_agg AS (
    SELECT
      dus.team_id, dus.company_id, dus.date,
      AVG(dus.screen_minutes) AS avg_screen,
      SUM(dus.screen_minutes) AS total_screen,
      AVG(dus.penalty_minutes) AS avg_penalty,
      COUNT(*) AS members
    FROM public.daily_user_summaries dus
    WHERE dus.team_id IS NOT NULL
      AND dus.date >= (v_cutoff::date - 1)
    GROUP BY dus.team_id, dus.company_id, dus.date
  ), ok AS (
    SELECT t.*, c.min_team_k
    FROM team_agg t
    JOIN public.companies c ON c.id = t.company_id
    WHERE t.members >= c.min_team_k
  ), ins_t AS (
    INSERT INTO public.daily_team_summaries
      (team_id, company_id, date, avg_screen_minutes, total_screen_minutes, avg_penalty_minutes, member_count)
    SELECT team_id, company_id, date, avg_screen, total_screen, avg_penalty, members
    FROM ok
    ON CONFLICT (team_id, date) DO UPDATE
      SET avg_screen_minutes = EXCLUDED.avg_screen_minutes,
          total_screen_minutes = EXCLUDED.total_screen_minutes,
          avg_penalty_minutes = EXCLUDED.avg_penalty_minutes,
          member_count = EXCLUDED.member_count,
          updated_at = now()
    RETURNING 1
  )
  SELECT count(*) INTO v_team_rows FROM ins_t;

  -- (c) Roh-Events des Tages hart löschen (kein Soft-Delete).
  WITH del AS (
    DELETE FROM public.usage_events WHERE occurred_at < v_cutoff RETURNING 1
  )
  SELECT count(*) INTO v_purged_events FROM del;

  RETURN jsonb_build_object(
    'ran_at', now(),
    'purged_events', v_purged_events,
    'user_summaries_upserted', v_user_rows,
    'team_summaries_upserted', v_team_rows
  );
END;
$$;

REVOKE ALL ON FUNCTION public.run_aggregate_and_purge() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_aggregate_and_purge() TO service_role;

-- Eindeutigkeit für ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS daily_user_summaries_user_date_uniq
  ON public.daily_user_summaries (user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS daily_team_summaries_team_date_uniq
  ON public.daily_team_summaries (team_id, date);
