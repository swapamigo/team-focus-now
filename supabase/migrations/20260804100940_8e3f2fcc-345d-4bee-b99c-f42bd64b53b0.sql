CREATE TABLE public.link_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL DEFAULT 'click',
  link_id text NOT NULL,
  label text,
  href text,
  page_path text,
  session_id text,
  country text,
  country_code text,
  device text,
  referrer text,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX link_events_created_at_idx ON public.link_events (created_at DESC);
CREATE INDEX link_events_link_id_idx ON public.link_events (link_id);

GRANT INSERT ON public.link_events TO anon, authenticated;
GRANT SELECT ON public.link_events TO authenticated;
GRANT ALL ON public.link_events TO service_role;

ALTER TABLE public.link_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record link events"
ON public.link_events FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(link_id) <= 200
  AND char_length(coalesce(label, '')) <= 300
  AND char_length(coalesce(href, '')) <= 1000
  AND char_length(coalesce(page_path, '')) <= 500
  AND char_length(coalesce(session_id, '')) <= 100
  AND char_length(coalesce(referrer, '')) <= 1000
  AND event_type IN ('click', 'dwell', 'pageview')
  AND (duration_seconds IS NULL OR (duration_seconds >= 0 AND duration_seconds <= 86400))
);

CREATE POLICY "Admins can read link events"
ON public.link_events FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));