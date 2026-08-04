import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Clock, Globe2, MousePointerClick, Monitor, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Ev {
  id: string;
  event_type: string;
  link_id: string;
  label: string | null;
  href: string | null;
  page_path: string | null;
  session_id: string | null;
  country: string | null;
  country_code: string | null;
  device: string | null;
  referrer: string | null;
  duration_seconds: number | null;
  created_at: string;
}

const flag = (cc: string | null) => {
  if (!cc || cc.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(...cc.toUpperCase().split("").map((c) => A + c.charCodeAt(0) - 65));
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

const RANGES = [
  { label: "24 h", hours: 24 },
  { label: "7 Tage", hours: 24 * 7 },
  { label: "30 Tage", hours: 24 * 30 },
  { label: "Alles", hours: 0 },
];

export default function AdminAnalytics() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hours, setHours] = useState(24 * 7);
  const [q, setQ] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      let query = supabase
        .from("link_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3000);
      if (hours > 0) {
        query = query.gte("created_at", new Date(Date.now() - hours * 3600_000).toISOString());
      }
      const { data, error: err } = await query;
      if (!active) return;
      setLoading(false);
      if (err) return setError("Daten konnten nicht geladen werden.");
      setError(null);
      setEvents((data ?? []) as Ev[]);
    })();
    return () => { active = false; };
  }, [hours]);

  const clicks = useMemo(() => events.filter((e) => e.event_type === "click"), [events]);
  const dwells = useMemo(() => events.filter((e) => e.event_type === "dwell"), [events]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return clicks;
    return clicks.filter((e) =>
      [e.link_id, e.label, e.href, e.country, e.page_path]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle))
    );
  }, [clicks, q]);

  const byLink = useMemo(() => {
    const map = new Map<string, { clicks: number; sessions: Set<string>; label: string }>();
    for (const e of clicks) {
      const cur = map.get(e.link_id) ?? { clicks: 0, sessions: new Set<string>(), label: e.label ?? e.link_id };
      cur.clicks += 1;
      if (e.session_id) cur.sessions.add(e.session_id);
      map.set(e.link_id, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].clicks - a[1].clicks);
  }, [clicks]);

  const byCountry = useMemo(() => {
    const map = new Map<string, { n: number; cc: string | null }>();
    for (const e of events) {
      const key = e.country ?? "Unbekannt";
      const cur = map.get(key) ?? { n: 0, cc: e.country_code };
      cur.n += 1;
      map.set(key, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [events]);

  const byDevice = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.device ?? "unbekannt", (map.get(e.device ?? "unbekannt") ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const demoClicks = clicks.filter((e) => e.link_id.startsWith("cta:demo") || e.link_id.startsWith("demo:")).length;
  const callClicks = clicks.filter((e) => e.link_id.startsWith("cta:call")).length;
  const avgDwell = dwells.length
    ? Math.round(dwells.reduce((s, e) => s + (e.duration_seconds ?? 0), 0) / dwells.length)
    : 0;
  const sessions = new Set(events.map((e) => e.session_id)).size;

  const exportCsv = () => {
    const head = ["Zeitpunkt", "Typ", "Link-ID", "Label", "Ziel", "Seite", "Land", "Gerät", "Sekunden", "Sitzung"];
    const rows = events.map((e) => [
      fmt(e.created_at), e.event_type, e.link_id, e.label ?? "", e.href ?? "",
      e.page_path ?? "", e.country ?? "", e.device ?? "", e.duration_seconds ?? "", e.session_id ?? "",
    ]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamfokus-link-statistiken-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Link- & Klick-Statistiken
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Jeder Klick auf der Website – inkl. Land, Zeitpunkt, Gerät und Verweildauer.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!events.length}>CSV exportieren</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Button key={r.label} size="sm" variant={hours === r.hours ? "default" : "outline"} onClick={() => setHours(r.hours)}>
            {r.label}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Lädt…</p>}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Klicks gesamt", value: clicks.length, icon: MousePointerClick },
          { label: "Demo-Klicks", value: demoClicks, icon: MousePointerClick },
          { label: "Call-Klicks", value: callClicks, icon: MousePointerClick },
          { label: "Ø Verweildauer", value: `${avgDwell}s`, icon: Clock },
          { label: "Sitzungen", value: sessions, icon: Monitor },
        ].map((s) => (
          <div key={s.label} className="surface-card p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><s.icon className="h-3.5 w-3.5" />{s.label}</p>
            <p className="text-2xl font-semibold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="surface-card p-5">
          <h2 className="font-semibold mb-3">Top-Links</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto text-sm">
            {byLink.map(([id, v]) => (
              <div key={id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-1.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{v.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{v.clicks}</p>
                  <p className="text-[11px] text-muted-foreground">{v.sessions.size} Personen</p>
                </div>
              </div>
            ))}
            {!byLink.length && !loading && <p className="text-muted-foreground">Noch keine Klicks im Zeitraum.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface-card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" />Länder</h2>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-sm">
              {byCountry.map(([name, v]) => (
                <div key={name} className="flex justify-between">
                  <span>{flag(v.cc)} {name}</span>
                  <span className="font-medium">{v.n}</span>
                </div>
              ))}
              {!byCountry.length && !loading && <p className="text-muted-foreground">Keine Daten.</p>}
            </div>
          </div>
          <div className="surface-card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Monitor className="h-4 w-4 text-primary" />Geräte</h2>
            <div className="space-y-1.5 text-sm">
              {byDevice.map(([d, n]) => (
                <div key={d} className="flex justify-between"><span>{d}</span><span className="font-medium">{n}</span></div>
              ))}
              {!byDevice.length && !loading && <p className="text-muted-foreground">Keine Daten.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold">Einzelne Klicks</h2>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suchen…" className="pl-8 h-9 w-56" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-3">Zeitpunkt</th>
                <th className="py-2 pr-3">Link</th>
                <th className="py-2 pr-3">Seite</th>
                <th className="py-2 pr-3">Land</th>
                <th className="py-2 pr-3">Gerät</th>
                <th className="py-2 pr-3">Verweildauer Sitzung</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 300).map((e) => {
                const dwell = dwells.find((d) => d.session_id === e.session_id)?.duration_seconds;
                return (
                  <tr key={e.id} className="border-t border-border/40">
                    <td className="py-2 pr-3 whitespace-nowrap">{fmt(e.created_at)}</td>
                    <td className="py-2 pr-3 max-w-[220px] truncate">{e.label ?? e.link_id}</td>
                    <td className="py-2 pr-3 max-w-[160px] truncate text-muted-foreground">{e.page_path}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{flag(e.country_code)} {e.country ?? "–"}</td>
                    <td className="py-2 pr-3">{e.device ?? "–"}</td>
                    <td className="py-2 pr-3">{dwell != null ? `${dwell}s` : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && !loading && <p className="text-sm text-muted-foreground py-3">Keine Klicks gefunden.</p>}
        </div>
      </div>
    </div>
  );
}
