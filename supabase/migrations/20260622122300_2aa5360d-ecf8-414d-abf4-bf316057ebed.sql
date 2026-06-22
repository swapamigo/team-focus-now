
-- 1. Backfill admin role for hardcoded emails, then remove hardcoded fallback in has_role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE lower(email) IN ('swapamigo@gmail.com', 'joel.schoeppe@gmail.com')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$function$;

-- Auto-grant admin role to whitelisted emails on signup (still based on user_roles table going forward)
CREATE OR REPLACE FUNCTION public.grant_admin_for_whitelisted_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF lower(coalesce(NEW.email, '')) IN ('swapamigo@gmail.com', 'joel.schoeppe@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_admin_whitelisted ON auth.users;
CREATE TRIGGER grant_admin_whitelisted
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_whitelisted_email();

-- 2. user_roles: explicit INSERT/DELETE restricted to admins / company managers
CREATE POLICY user_roles_admin_insert ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR (company_id IS NOT NULL AND public.has_company_role(auth.uid(), company_id, 'manager'))
);

CREATE POLICY user_roles_admin_delete ON public.user_roles
FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR (company_id IS NOT NULL AND public.has_company_role(auth.uid(), company_id, 'manager'))
);

CREATE POLICY user_roles_admin_update ON public.user_roles
FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR (company_id IS NOT NULL AND public.has_company_role(auth.uid(), company_id, 'manager'))
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR (company_id IS NOT NULL AND public.has_company_role(auth.uid(), company_id, 'manager'))
);

-- 3. daily_team_summaries: employees see only their own team; managers see all in company
DROP POLICY IF EXISTS daily_team_summaries_select_company ON public.daily_team_summaries;
CREATE POLICY daily_team_summaries_select_scoped ON public.daily_team_summaries
FOR SELECT TO authenticated
USING (
  public.has_company_role(auth.uid(), company_id, 'manager')
  OR public.has_role(auth.uid(), 'admin')
  OR team_id = public.get_user_team(auth.uid())
);

-- 4. daily_user_summaries: remove self INSERT/UPDATE (service role only)
DROP POLICY IF EXISTS daily_user_summaries_insert_own ON public.daily_user_summaries;
DROP POLICY IF EXISTS daily_user_summaries_update_own ON public.daily_user_summaries;

-- 5. usage_events: remove self INSERT (service role only)
DROP POLICY IF EXISTS usage_events_insert_own ON public.usage_events;
