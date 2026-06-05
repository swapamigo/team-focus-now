
CREATE TABLE IF NOT EXISTS public.feedback_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  awareness_score int CHECK (awareness_score BETWEEN 1 AND 10),
  sector text,
  employee_count int,
  suggestion text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback_responses TO anon, authenticated;
GRANT ALL ON public.feedback_responses TO service_role;
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert feedback" ON public.feedback_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "managers can read feedback" ON public.feedback_responses FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'manager'));

-- Allow managers to read all demo leads
DROP POLICY IF EXISTS "managers can read demo leads" ON public.demo_leads;
CREATE POLICY "managers can read demo leads" ON public.demo_leads FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'manager'));
GRANT SELECT ON public.demo_leads TO authenticated;
