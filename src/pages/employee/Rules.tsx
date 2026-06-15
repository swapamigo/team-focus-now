import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppWindow, Globe, Clock, Coffee, Smartphone, ShieldCheck, Ban } from "lucide-react";

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export default function EmployeeRules() {
  const { user, companyId } = useAuth();
  const [allowedApps, setAllowedApps] = useState<string[]>([]);
  const [companyApps, setCompanyApps] = useState<string[]>([]);
  const [websites, setWebsites] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<number, { start: string; end: string }>>({});
  const [breaks, setBreaks] = useState<{ id: string; label: string; start_time: string; end_time: string }[]>([]);
  const [phoneTimes, setPhoneTimes] = useState<{ id: string; label: string; start_time: string; end_time: string }[]>([]);

  useEffect(() => {
    if (!user || !companyId) return;
    (async () => {
      const [
        { data: ua }, { data: ca }, { data: ww },
        { data: ws }, { data: br }, { data: pt },
      ] = await Promise.all([
        supabase.from("user_allowed_apps").select("app_name").eq("user_id", user.id).order("app_name"),
        supabase.from("whitelisted_apps").select("app_name").eq("company_id", companyId).order("app_name"),
        supabase.from("blocked_websites").select("domain").eq("company_id", companyId).order("domain"),
        supabase.from("user_work_schedules").select("weekday, start_time, end_time").eq("user_id", user.id),
        supabase.from("user_breaks").select("id, label, start_time, end_time").eq("user_id", user.id).order("start_time"),
        supabase.from("free_phone_times").select("id, label, start_time, end_time").eq("company_id", companyId).order("start_time"),
      ]);
      setAllowedApps((ua ?? []).map((r: any) => r.app_name));
      setCompanyApps((ca ?? []).map((r: any) => r.app_name));
      setWebsites((ww ?? []).map((r: any) => r.domain));
      const map: Record<number, any> = {};
      (ws ?? []).forEach((r: any) => { map[r.weekday] = { start: r.start_time?.slice(0,5), end: r.end_time?.slice(0,5) }; });
      setSchedule(map);
      setBreaks(br ?? []);
      setPhoneTimes(pt ?? []);
    })();
  }, [user, companyId]);

  const allApps = Array.from(new Set([...companyApps, ...allowedApps])).sort();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Regeln</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Was zählt, was nicht — dein persönlicher Rahmen.</p>
      </header>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3"><AppWindow className="h-4 w-4 text-primary" /><h2 className="font-semibold">Erlaubte Apps</h2></div>
          {allApps.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Apps freigegeben.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {allApps.map((a) => (
                <li key={a} className="bg-secondary rounded-lg px-3 py-1.5 text-sm">{a}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3"><Ban className="h-4 w-4 text-destructive" /><h2 className="font-semibold">Blockierte Websites</h2></div>
          {websites.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Domains blockiert.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {websites.map((w) => (
                <li key={w} className="bg-destructive/10 text-destructive rounded-lg px-3 py-1.5 text-sm font-mono">{w}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-primary" /><h2 className="font-semibold">Arbeitszeiten</h2></div>
          {Object.keys(schedule).length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Arbeitszeit hinterlegt.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {[1,2,3,4,5,6,0].map((wd) => {
                const s = schedule[wd];
                if (!s) return null;
                return (
                  <li key={wd} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-medium">{WEEKDAYS[wd]}</span>
                    <span className="text-muted-foreground tabular-nums">{s.start} – {s.end}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3"><Coffee className="h-4 w-4 text-primary" /><h2 className="font-semibold">Pausen</h2></div>
          {breaks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Pausen konfiguriert.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {breaks.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground tabular-nums">{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3"><Smartphone className="h-4 w-4 text-primary" /><h2 className="font-semibold">Freie Handy-Zeiten</h2></div>
          {phoneTimes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine freien Zeiten definiert.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {phoneTimes.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{p.label}</span>
                  <span className="text-muted-foreground tabular-nums">{p.start_time?.slice(0,5)} – {p.end_time?.slice(0,5)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5">
        <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Außerhalb deiner Arbeitszeit, während Pausen und in freien Zeiten wird keine Nutzung erfasst.
          </p>
        </div>
      </section>
    </div>
  );
}
