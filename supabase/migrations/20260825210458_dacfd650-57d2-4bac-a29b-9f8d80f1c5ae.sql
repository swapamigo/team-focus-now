CREATE OR REPLACE FUNCTION public.run_evaluate_team_goals()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT private.evaluate_team_goals(); $$;

REVOKE ALL ON FUNCTION public.run_evaluate_team_goals() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_evaluate_team_goals() TO service_role;