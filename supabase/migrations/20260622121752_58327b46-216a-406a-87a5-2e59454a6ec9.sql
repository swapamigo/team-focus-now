DO $$
BEGIN
  EXECUTE 'GRANT SELECT ON TABLE public.demo_leads TO authenticated';
  EXECUTE 'GRANT INSERT ON TABLE public.demo_leads TO anon';
  EXECUTE 'GRANT INSERT ON TABLE public.demo_leads TO authenticated';
  EXECUTE 'GRANT ALL PRIVILEGES ON TABLE public.demo_leads TO service_role';

  EXECUTE 'GRANT SELECT ON TABLE public.feedback_responses TO authenticated';
  EXECUTE 'GRANT INSERT ON TABLE public.feedback_responses TO anon';
  EXECUTE 'GRANT INSERT ON TABLE public.feedback_responses TO authenticated';
  EXECUTE 'GRANT ALL PRIVILEGES ON TABLE public.feedback_responses TO service_role';
END $$;