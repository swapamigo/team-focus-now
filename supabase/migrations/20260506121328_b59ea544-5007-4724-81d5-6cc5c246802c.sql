
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('manager', 'employee');
CREATE TYPE public.event_type AS ENUM ('unlock', 'app_usage', 'website_usage', 'focus_violation', 'desktop_usage');
CREATE TYPE public.device_type AS ENUM ('phone', 'tablet', 'laptop', 'desktop', 'browser_extension');
CREATE TYPE public.challenge_duration AS ENUM ('1_week', '2_weeks', '3_weeks', '1_month', 'custom');
CREATE TYPE public.challenge_status AS ENUM ('draft', 'active', 'finished', 'cancelled');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled');

-- =========================================
-- UTIL: updated_at trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  locale text NOT NULL DEFAULT 'de',
  consent_accepted_at timestamptz,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- USER ROLES (separate table - security)
-- =========================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  company_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, company_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.has_company_role(_user_id uuid, _company_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role AND company_id = _company_id
  );
$$;

-- =========================================
-- COMPANIES
-- =========================================
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  industry text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- COMPANY MEMBERS
-- =========================================
CREATE TABLE public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Helper: company membership check (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_company_member(_user_id uuid, _company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE user_id = _user_id AND company_id = _company_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_company(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.company_members WHERE user_id = _user_id LIMIT 1;
$$;

-- =========================================
-- INVITES
-- =========================================
CREATE TABLE public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  email text,
  team_id uuid,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  used_at timestamptz,
  used_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TEAMS
-- =========================================
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  emoji text DEFAULT '🚀',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_team(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT team_id FROM public.team_members WHERE user_id = _user_id LIMIT 1;
$$;

-- =========================================
-- TRACKING
-- =========================================
CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  device_type device_type NOT NULL DEFAULT 'phone',
  app_name text,
  website_url text,
  duration_seconds integer NOT NULL DEFAULT 0,
  is_whitelisted boolean NOT NULL DEFAULT false,
  is_high_focus boolean NOT NULL DEFAULT false,
  penalty_minutes numeric(6,2) NOT NULL DEFAULT 0,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_usage_events_user_time ON public.usage_events(user_id, occurred_at DESC);
CREATE INDEX idx_usage_events_company_time ON public.usage_events(company_id, occurred_at DESC);

CREATE TABLE public.daily_user_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  date date NOT NULL,
  screen_minutes numeric(8,2) NOT NULL DEFAULT 0,
  penalty_minutes numeric(8,2) NOT NULL DEFAULT 0,
  unlocks integer NOT NULL DEFAULT 0,
  focus_violations integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);
ALTER TABLE public.daily_user_summaries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER daily_user_summaries_updated_at BEFORE UPDATE ON public.daily_user_summaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.daily_team_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  date date NOT NULL,
  avg_screen_minutes numeric(8,2) NOT NULL DEFAULT 0,
  total_screen_minutes numeric(10,2) NOT NULL DEFAULT 0,
  avg_penalty_minutes numeric(8,2) NOT NULL DEFAULT 0,
  member_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, date)
);
ALTER TABLE public.daily_team_summaries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER daily_team_summaries_updated_at BEFORE UPDATE ON public.daily_team_summaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- WHITELISTS & SCHEDULES
-- =========================================
CREATE TABLE public.whitelisted_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  app_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, app_name)
);
ALTER TABLE public.whitelisted_apps ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.whitelisted_websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  domain text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, domain)
);
ALTER TABLE public.whitelisted_websites ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.work_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.work_schedules ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.breaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.breaks ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.free_phone_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.free_phone_times ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.high_focus_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  weekdays smallint[] NOT NULL DEFAULT ARRAY[1,2,3,4,5],
  multiplier numeric(3,1) NOT NULL DEFAULT 2.0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.high_focus_periods ENABLE ROW LEVEL SECURITY;

-- =========================================
-- CHALLENGES & REWARDS
-- =========================================
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration challenge_duration NOT NULL DEFAULT '1_week',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status challenge_status NOT NULL DEFAULT 'draft',
  winner_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER challenges_updated_at BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SUBSCRIPTIONS & NOTIFICATIONS
-- =========================================
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status subscription_status NOT NULL DEFAULT 'trial',
  price_per_seat_eur numeric(6,2) NOT NULL DEFAULT 7.00,
  seats integer NOT NULL DEFAULT 0,
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'info',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notifications_user_time ON public.notifications(user_id, created_at DESC);

-- =========================================
-- RLS POLICIES
-- =========================================

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_select_same_company" ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.company_members cm1
    JOIN public.company_members cm2 ON cm1.company_id = cm2.company_id
    WHERE cm1.user_id = auth.uid() AND cm2.user_id = profiles.id
  ));

-- User roles - read own, never insert/update self
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_managers_select_company" ON public.user_roles FOR SELECT TO authenticated
  USING (company_id IS NOT NULL AND public.has_company_role(auth.uid(), company_id, 'manager'));

-- Companies
CREATE POLICY "companies_owner_all" ON public.companies FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "companies_members_select" ON public.companies FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), id));
CREATE POLICY "companies_insert_authenticated" ON public.companies FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Company members
CREATE POLICY "company_members_select_self" ON public.company_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "company_members_select_same_company" ON public.company_members FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "company_members_insert_self" ON public.company_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "company_members_manager_manage" ON public.company_members FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Invites
CREATE POLICY "invites_manager_all" ON public.invites FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));
CREATE POLICY "invites_select_by_code" ON public.invites FOR SELECT TO authenticated USING (true);

-- Teams
CREATE POLICY "teams_select_company_members" ON public.teams FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "teams_manager_manage" ON public.teams FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Team members
CREATE POLICY "team_members_select_company" ON public.team_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.is_company_member(auth.uid(), t.company_id)));
CREATE POLICY "team_members_manager_manage" ON public.team_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.has_company_role(auth.uid(), t.company_id, 'manager')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.has_company_role(auth.uid(), t.company_id, 'manager')));

-- Usage events: user sees own, manager sees company
CREATE POLICY "usage_events_select_own" ON public.usage_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "usage_events_select_manager" ON public.usage_events FOR SELECT TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'));
CREATE POLICY "usage_events_insert_own" ON public.usage_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Daily user summaries: own only (employees do NOT see others' individual stats)
CREATE POLICY "daily_user_summaries_select_own" ON public.daily_user_summaries FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "daily_user_summaries_select_manager" ON public.daily_user_summaries FOR SELECT TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'));
CREATE POLICY "daily_user_summaries_insert_own" ON public.daily_user_summaries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "daily_user_summaries_update_own" ON public.daily_user_summaries FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Daily team summaries: visible to all company members (aggregated only)
CREATE POLICY "daily_team_summaries_select_company" ON public.daily_team_summaries FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "daily_team_summaries_manager_manage" ON public.daily_team_summaries FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Whitelists, schedules, breaks, free phone, high focus
CREATE POLICY "whitelisted_apps_select_company" ON public.whitelisted_apps FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "whitelisted_apps_manager_manage" ON public.whitelisted_apps FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "whitelisted_websites_select_company" ON public.whitelisted_websites FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "whitelisted_websites_manager_manage" ON public.whitelisted_websites FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "work_schedules_select_company" ON public.work_schedules FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "work_schedules_manager_manage" ON public.work_schedules FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "breaks_select_company" ON public.breaks FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "breaks_manager_manage" ON public.breaks FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "free_phone_times_select_company" ON public.free_phone_times FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "free_phone_times_manager_manage" ON public.free_phone_times FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "high_focus_periods_select_company" ON public.high_focus_periods FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "high_focus_periods_manager_manage" ON public.high_focus_periods FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Challenges
CREATE POLICY "challenges_select_company" ON public.challenges FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "challenges_manager_manage" ON public.challenges FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

CREATE POLICY "rewards_select_company" ON public.rewards FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND public.is_company_member(auth.uid(), c.company_id)));
CREATE POLICY "rewards_manager_manage" ON public.rewards FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND public.has_company_role(auth.uid(), c.company_id, 'manager')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND public.has_company_role(auth.uid(), c.company_id, 'manager')));

-- Subscriptions
CREATE POLICY "subscriptions_select_company" ON public.subscriptions FOR SELECT TO authenticated
  USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "subscriptions_manager_manage" ON public.subscriptions FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'manager'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'manager'));

-- Notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
