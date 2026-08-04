// Lightweight, DSGVO-freundliches Link-Tracking (keine Cookies, keine Namen, keine IP-Speicherung).
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "tf_track_session";

export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? String(Math.random()).slice(2)) as string;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

function deviceType(): string {
  const w = typeof window !== "undefined" ? window.innerWidth : 0;
  if (w && w < 640) return "mobile";
  if (w && w < 1024) return "tablet";
  return "desktop";
}

interface TrackInput {
  event_type?: "click" | "dwell" | "pageview";
  link_id: string;
  label?: string | null;
  href?: string | null;
  duration_seconds?: number | null;
}

const cut = (v: string | null | undefined, max: number) =>
  v ? v.slice(0, max) : null;

export async function trackEvent(input: TrackInput): Promise<void> {
  try {
    const { getVisitorGeo } = await import("@/lib/geo");
    const geo = await getVisitorGeo();
    await supabase.from("link_events").insert({
      event_type: input.event_type ?? "click",
      link_id: cut(input.link_id, 200) ?? "unknown",
      label: cut(input.label ?? null, 300),
      href: cut(input.href ?? null, 1000),
      page_path: cut(window.location.pathname + window.location.hash, 500),
      session_id: cut(getSessionId(), 100),
      country: geo.country,
      country_code: geo.country_code,
      device: deviceType(),
      referrer: cut(document.referrer || null, 1000),
      duration_seconds: input.duration_seconds ?? null,
    } as never);
  } catch {
    // Tracking darf die Seite nie blockieren.
  }
}

/** Klick auf einen benannten CTA erfassen. */
export function trackClick(linkId: string, label?: string, href?: string) {
  void trackEvent({ event_type: "click", link_id: linkId, label, href });
}

function slug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_/#.:]/g, "")
    .slice(0, 60);
}

/**
 * Erfasst automatisch jeden Klick auf Links/Buttons sowie die Verweildauer der Seite.
 * Rückgabe: Cleanup-Funktion.
 */
export function initAutoTracking(): () => void {
  const start = Date.now();
  let sent = false;

  void trackEvent({ event_type: "pageview", link_id: "pageview", label: document.title });

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.("a,button,[data-track]") as HTMLElement | null;
    if (!el) return;
    const explicit = el.getAttribute("data-track");
    const label =
      el.getAttribute("aria-label") ||
      (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120) ||
      "unbenannt";
    const href = el.getAttribute("href");
    const linkId = explicit || (href ? `link:${slug(href)}` : `btn:${slug(label)}`);
    void trackEvent({ event_type: "click", link_id: linkId, label, href });
  };

  const sendDwell = () => {
    if (sent) return;
    sent = true;
    const seconds = Math.min(86400, Math.round((Date.now() - start) / 1000));
    void trackEvent({
      event_type: "dwell",
      link_id: `dwell:${window.location.pathname}`,
      label: document.title,
      duration_seconds: seconds,
    });
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") sendDwell();
  };

  document.addEventListener("click", onClick, true);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", sendDwell);

  return () => {
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", sendDwell);
  };
}

export const CAL_URL = "https://cal.com/joelschoppe/teamfocus";

/** Direkt zum Call-Termin – ohne Formular, Klick wird gemessen. */
export function openCallBooking(source = "hero") {
  trackClick(`cta:call:${source}`, "Call vereinbaren", CAL_URL);
  window.open(CAL_URL, "_blank", "noopener,noreferrer");
}
