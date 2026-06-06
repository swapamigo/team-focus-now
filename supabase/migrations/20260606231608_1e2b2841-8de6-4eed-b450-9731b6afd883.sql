
ALTER TABLE public.feedback_responses
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS business_area text;

ALTER TABLE public.demo_leads
  ADD COLUMN IF NOT EXISTS employee_count integer,
  ADD COLUMN IF NOT EXISTS plan text;
