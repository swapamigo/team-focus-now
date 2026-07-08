CREATE OR REPLACE FUNCTION private.privacy_self_test()
RETURNS TABLE(raw_events_older_than_24h bigint, team_aggregates_below_k bigint, min_team_k_default integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.usage_events ue
       WHERE ue.occurred_at < (now() - interval '24 hours')
         AND ue.company_id = private.get_user_company(auth.uid())),
    (SELECT count(*) FROM public.daily_team_summaries dts
       JOIN public.companies c ON c.id = dts.company_id
       WHERE dts.member_count < c.min_team_k
         AND dts.company_id = private.get_user_company(auth.uid())),
    COALESCE(
      (SELECT c.min_team_k FROM public.companies c WHERE c.id = private.get_user_company(auth.uid())),
      5
    );
$$;