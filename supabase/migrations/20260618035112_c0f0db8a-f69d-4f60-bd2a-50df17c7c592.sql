
-- Fix invite code reuse
CREATE OR REPLACE FUNCTION public.join_with_invite(_code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  inv RECORD;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  SELECT * INTO inv FROM public.invites WHERE code = upper(_code) LIMIT 1;
  IF inv IS NULL THEN RAISE EXCEPTION 'invite_not_found'; END IF;
  IF inv.expires_at < now() THEN RAISE EXCEPTION 'invite_expired'; END IF;
  IF inv.used_by IS NOT NULL THEN RAISE EXCEPTION 'invite_already_used'; END IF;

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
$function$;

-- Server-side pre-launch access gate
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS beta_access boolean NOT NULL DEFAULT false;

-- Grandfather existing users that already had access via the old client-side flag
UPDATE public.profiles SET beta_access = true
WHERE id IN (SELECT DISTINCT user_id FROM public.user_roles);
