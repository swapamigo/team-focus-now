
-- Lock down SECURITY DEFINER functions: revoke broad EXECUTE, grant only what's needed

-- Trigger-only functions: no API callers
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_admin_for_whitelisted_email() FROM PUBLIC, anon, authenticated;

-- RLS helper functions: callable by authenticated (used inside policies); revoke from anon/public
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_company_role(uuid, uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_company_role(uuid, uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_company_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_company_member(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_user_company(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_company(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_user_team(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_team(uuid) TO authenticated, service_role;

-- User-callable RPCs: authenticated only
REVOKE ALL ON FUNCTION public.join_with_invite(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_with_invite(text) TO authenticated;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

REVOKE ALL ON FUNCTION public.create_workspace(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.create_invite(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_invite(uuid, uuid) TO authenticated;
