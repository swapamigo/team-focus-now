GRANT SELECT ON public.demo_leads TO authenticated;
GRANT INSERT ON public.demo_leads TO anon, authenticated;
GRANT ALL ON public.demo_leads TO service_role;

GRANT SELECT ON public.feedback_responses TO authenticated;
GRANT INSERT ON public.feedback_responses TO anon, authenticated;
GRANT ALL ON public.feedback_responses TO service_role;