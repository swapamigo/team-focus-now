
DROP POLICY IF EXISTS daily_team_summaries_manager_manage ON public.daily_team_summaries;

CREATE POLICY daily_team_summaries_manager_insert ON public.daily_team_summaries
  FOR INSERT TO authenticated
  WITH CHECK (private.has_company_role(auth.uid(), company_id, 'manager'::app_role));

CREATE POLICY daily_team_summaries_manager_update ON public.daily_team_summaries
  FOR UPDATE TO authenticated
  USING (private.has_company_role(auth.uid(), company_id, 'manager'::app_role))
  WITH CHECK (private.has_company_role(auth.uid(), company_id, 'manager'::app_role));

CREATE POLICY daily_team_summaries_manager_delete ON public.daily_team_summaries
  FOR DELETE TO authenticated
  USING (private.has_company_role(auth.uid(), company_id, 'manager'::app_role));
