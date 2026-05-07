
-- Unique constraints benötigt für upserts
CREATE UNIQUE INDEX IF NOT EXISTS daily_user_summaries_user_date_idx ON public.daily_user_summaries(user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS daily_team_summaries_team_date_idx ON public.daily_team_summaries(team_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS whitelisted_apps_unique_idx ON public.whitelisted_apps(company_id, app_name);
CREATE UNIQUE INDEX IF NOT EXISTS whitelisted_websites_unique_idx ON public.whitelisted_websites(company_id, domain);
CREATE UNIQUE INDEX IF NOT EXISTS invites_code_unique_idx ON public.invites(code);

-- RPC: Workspace + Manager-Rolle atomar anlegen (SECURITY DEFINER um RLS auf user_roles zu umgehen)
CREATE OR REPLACE FUNCTION public.create_workspace(_name text, _industry text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  new_company_id uuid;
  slug_val text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF _name IS NULL OR length(trim(_name)) = 0 THEN RAISE EXCEPTION 'name required'; END IF;

  slug_val := lower(regexp_replace(_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);

  INSERT INTO public.companies(name, slug, industry, owner_id)
  VALUES (_name, slug_val, _industry, uid)
  RETURNING id INTO new_company_id;

  INSERT INTO public.user_roles(user_id, role, company_id) VALUES (uid, 'manager', new_company_id);
  INSERT INTO public.company_members(user_id, company_id) VALUES (uid, new_company_id);
  INSERT INTO public.subscriptions(company_id, status, seats) VALUES (new_company_id, 'trial', 1);
  UPDATE public.profiles SET consent_accepted_at = now(), onboarded = true WHERE id = uid;

  RETURN new_company_id;
END;
$$;

-- RPC: Mitarbeiter beitreten per Code
CREATE OR REPLACE FUNCTION public.join_with_invite(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  inv RECORD;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  SELECT * INTO inv FROM public.invites WHERE code = upper(_code) LIMIT 1;
  IF inv IS NULL THEN RAISE EXCEPTION 'invite_not_found'; END IF;
  IF inv.expires_at < now() THEN RAISE EXCEPTION 'invite_expired'; END IF;

  INSERT INTO public.company_members(user_id, company_id) VALUES (uid, inv.company_id)
    ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles(user_id, role, company_id) VALUES (uid, 'employee', inv.company_id)
    ON CONFLICT DO NOTHING;
  IF inv.team_id IS NOT NULL THEN
    INSERT INTO public.team_members(user_id, team_id) VALUES (uid, inv.team_id)
      ON CONFLICT DO NOTHING;
  END IF;
  UPDATE public.invites SET used_by = uid, used_at = now() WHERE id = inv.id AND used_by IS NULL;
  UPDATE public.profiles SET consent_accepted_at = now(), onboarded = true WHERE id = uid;

  RETURN inv.company_id;
END;
$$;

-- RPC: Einladungs-Code für Manager erstellen
CREATE OR REPLACE FUNCTION public.create_invite(_company_id uuid, _team_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  new_code text;
BEGIN
  IF NOT public.has_company_role(uid, _company_id, 'manager') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  new_code := upper(substr(md5(random()::text), 1, 8));
  INSERT INTO public.invites(company_id, code, team_id, created_by) VALUES (_company_id, new_code, _team_id, uid);
  RETURN new_code;
END;
$$;

-- RPC: Konto-Löschung (löscht aus auth.users, Cascade entfernt alle Daten)
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  DELETE FROM public.notifications WHERE user_id = uid;
  DELETE FROM public.usage_events WHERE user_id = uid;
  DELETE FROM public.daily_user_summaries WHERE user_id = uid;
  DELETE FROM public.team_members WHERE user_id = uid;
  DELETE FROM public.company_members WHERE user_id = uid;
  DELETE FROM public.user_roles WHERE user_id = uid;
  DELETE FROM public.companies WHERE owner_id = uid;
  DELETE FROM public.profiles WHERE id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

-- Unique constraint für invites code
ALTER TABLE public.invites DROP CONSTRAINT IF EXISTS invites_code_key;
ALTER TABLE public.invites ADD CONSTRAINT invites_code_key UNIQUE USING INDEX invites_code_unique_idx;

-- Unique constraints für team_members und company_members verhindern Duplikate
CREATE UNIQUE INDEX IF NOT EXISTS team_members_unique_idx ON public.team_members(team_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS company_members_unique_idx ON public.company_members(company_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_unique_idx ON public.user_roles(user_id, role, company_id);
