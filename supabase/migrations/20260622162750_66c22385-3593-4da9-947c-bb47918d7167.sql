
-- 1. Move SECURITY DEFINER functions out of the exposed `public` schema
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Drop public wrappers we'll recreate (defensive)
-- (none exist yet)

-- Move helpers used in RLS policies
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.has_company_role(uuid, uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_company_member(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.get_user_company(uuid) SET SCHEMA private;
ALTER FUNCTION public.get_user_team(uuid) SET SCHEMA private;

-- Move trigger-only functions
ALTER FUNCTION public.handle_new_user() SET SCHEMA private;
ALTER FUNCTION public.grant_admin_for_whitelisted_email() SET SCHEMA private;
ALTER FUNCTION public.set_updated_at() SET SCHEMA private;

-- Move user-callable RPCs
ALTER FUNCTION public.join_with_invite(text) SET SCHEMA private;
ALTER FUNCTION public.delete_my_account() SET SCHEMA private;
ALTER FUNCTION public.create_workspace(text, text) SET SCHEMA private;
ALTER FUNCTION public.create_invite(uuid, uuid) SET SCHEMA private;

-- Grants: helpers used inside RLS policies must be executable by authenticated
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.has_company_role(uuid, uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_company_role(uuid, uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.is_company_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_company_member(uuid, uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.get_user_company(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.get_user_company(uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.get_user_team(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.get_user_team(uuid) TO authenticated, service_role;

-- Trigger-only: only the table owner / postgres needs execute
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.grant_admin_for_whitelisted_email() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC;

-- RPCs invoked from public wrappers (SECURITY INVOKER), authenticated must be able to call the inner
REVOKE ALL ON FUNCTION private.join_with_invite(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.join_with_invite(text) TO authenticated;
REVOKE ALL ON FUNCTION private.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.delete_my_account() TO authenticated;
REVOKE ALL ON FUNCTION private.create_workspace(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.create_workspace(text, text) TO authenticated;
REVOKE ALL ON FUNCTION private.create_invite(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.create_invite(uuid, uuid) TO authenticated;

-- Public SECURITY INVOKER wrappers so clients can still call these RPCs via PostgREST
CREATE OR REPLACE FUNCTION public.join_with_invite(_code text)
RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT private.join_with_invite(_code); $$;
REVOKE ALL ON FUNCTION public.join_with_invite(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_with_invite(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT private.delete_my_account(); $$;
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

CREATE OR REPLACE FUNCTION public.create_workspace(_name text, _industry text DEFAULT NULL)
RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT private.create_workspace(_name, _industry); $$;
REVOKE ALL ON FUNCTION public.create_workspace(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_invite(_company_id uuid, _team_id uuid DEFAULT NULL)
RETURNS text LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT private.create_invite(_company_id, _team_id); $$;
REVOKE ALL ON FUNCTION public.create_invite(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_invite(uuid, uuid) TO authenticated;

-- 2. profiles: prevent users from flipping beta_access on themselves
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND beta_access IS NOT DISTINCT FROM (SELECT p.beta_access FROM public.profiles p WHERE p.id = auth.uid())
);

-- 3. user_roles: managers may only assign non-admin roles within their own company
DROP POLICY IF EXISTS user_roles_admin_insert ON public.user_roles;
CREATE POLICY user_roles_admin_insert ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    company_id IS NOT NULL
    AND role <> 'admin'::public.app_role
    AND private.has_company_role(auth.uid(), company_id, 'manager'::public.app_role)
  )
);

DROP POLICY IF EXISTS user_roles_admin_update ON public.user_roles;
CREATE POLICY user_roles_admin_update ON public.user_roles
FOR UPDATE TO authenticated
USING (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    company_id IS NOT NULL
    AND role <> 'admin'::public.app_role
    AND private.has_company_role(auth.uid(), company_id, 'manager'::public.app_role)
  )
)
WITH CHECK (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    company_id IS NOT NULL
    AND role <> 'admin'::public.app_role
    AND private.has_company_role(auth.uid(), company_id, 'manager'::public.app_role)
  )
);

-- 4. invites: let an invited user read their own (already-used) invite row
CREATE POLICY invites_select_used_by_self ON public.invites
FOR SELECT TO authenticated
USING (used_by = auth.uid());
