REVOKE ALL PRIVILEGES ON TABLE public.demo_leads FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.feedback_responses FROM anon, authenticated;

GRANT INSERT ON TABLE public.demo_leads TO anon;
GRANT SELECT, INSERT ON TABLE public.demo_leads TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.demo_leads TO service_role;

GRANT INSERT ON TABLE public.feedback_responses TO anon;
GRANT SELECT, INSERT ON TABLE public.feedback_responses TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.feedback_responses TO service_role;