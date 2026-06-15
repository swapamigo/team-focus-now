
-- Grant admin role to dev users (if accounts exist)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email IN ('swapamigo@gmail.com', 'joel.schoeppe@gmail.com')
ON CONFLICT DO NOTHING;

-- Admin SELECT policies on demo_leads and feedback_responses
CREATE POLICY "Admins can view demo leads"
  ON public.demo_leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view feedback"
  ON public.feedback_responses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Blocked websites table
CREATE TABLE public.blocked_websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  domain text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, domain)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_websites TO authenticated;
GRANT ALL ON public.blocked_websites TO service_role;

ALTER TABLE public.blocked_websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view blocked websites"
  ON public.blocked_websites FOR SELECT
  TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));

CREATE POLICY "Managers can manage blocked websites"
  ON public.blocked_websites FOR ALL
  TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE TRIGGER set_blocked_websites_updated_at
  BEFORE UPDATE ON public.blocked_websites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
