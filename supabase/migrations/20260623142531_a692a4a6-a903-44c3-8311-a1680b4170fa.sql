
-- Move privacy_self_test into private schema and expose a guarded public wrapper.
DROP FUNCTION IF EXISTS public.privacy_self_test();

CREATE OR REPLACE FUNCTION private.privacy_self_test()
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

REVOKE ALL ON FUNCTION private.privacy_self_test() FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.privacy_self_test()
RETURNS TABLE (
  raw_events_older_than_24h bigint,
  team_aggregates_below_k bigint,
  min_team_k_default integer
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    private.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'manager'::app_role
    )
  ) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY SELECT * FROM private.privacy_self_test();
END;
$$;

REVOKE ALL ON FUNCTION public.privacy_self_test() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.privacy_self_test() TO authenticated, service_role;
