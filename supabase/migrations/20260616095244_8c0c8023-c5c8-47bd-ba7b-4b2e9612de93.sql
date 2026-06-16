
-- Restrict company_members manager policy: no direct INSERT, keep SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "company_members_manager_manage" ON public.company_members;
CREATE POLICY "company_members_manager_select" ON public.company_members FOR SELECT TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'));
CREATE POLICY "company_members_manager_update" ON public.company_members FOR UPDATE TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));
CREATE POLICY "company_members_manager_delete" ON public.company_members FOR DELETE TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Notifications must be inserted only by trusted server-side code (SECURITY DEFINER / service_role)
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
