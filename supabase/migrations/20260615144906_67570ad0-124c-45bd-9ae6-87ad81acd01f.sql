
-- 1. company_members: block direct self-insert; only SECURITY DEFINER functions (create_workspace, join_with_invite) may insert
DROP POLICY IF EXISTS company_members_insert_self ON public.company_members;

-- 2. invites: drop wide-open SELECT; managers already covered by invites_manager_all (FOR ALL)
DROP POLICY IF EXISTS invites_select_by_code ON public.invites;

-- 3. demo_leads & feedback_responses: drop manager cross-tenant SELECT policies
DROP POLICY IF EXISTS "managers can read demo leads" ON public.demo_leads;
DROP POLICY IF EXISTS "managers can read feedback" ON public.feedback_responses;

-- 4. Lock down internal SECURITY DEFINER helpers from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_company_role(uuid, uuid, app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_company(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_team(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;

-- 5. Fix mutable search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
