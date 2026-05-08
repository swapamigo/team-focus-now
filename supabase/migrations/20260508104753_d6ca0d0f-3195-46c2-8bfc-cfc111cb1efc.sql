
-- Per-user allowed apps
CREATE TABLE public.user_allowed_apps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  app_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, app_name)
);
ALTER TABLE public.user_allowed_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uaa_select_own" ON public.user_allowed_apps FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "uaa_manager_all"  ON public.user_allowed_apps FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Per-user work schedule (one row per weekday)
CREATE TABLE public.user_work_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, weekday)
);
ALTER TABLE public.user_work_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uws_select_own" ON public.user_work_schedules FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "uws_manager_all" ON public.user_work_schedules FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Per-user breaks
CREATE TABLE public.user_breaks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_breaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ub_select_own" ON public.user_breaks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "ub_manager_all" ON public.user_breaks FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Add an "active" temporary high-focus override on companies (quick-toggle)
ALTER TABLE public.high_focus_periods ADD COLUMN IF NOT EXISTS ad_hoc_until timestamptz;
