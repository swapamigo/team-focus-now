import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Download, Inbox, MessageSquare, Globe2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Lead {
  id: string;
  email: string;
  source: string | null;
  country: string | null;
  country_code: string | null;
  created_at: string;
}

interface Feedback {
  id: string;
  email: string | null;
  awareness_score: number | null;
  company_name?: string | null;
  business_area?: string | null;
  sector: string | null;
  employee_count: number | null;
  suggestion: string | null;
  source: string | null;
  country: string | null;
  country_code: string | null;
  created_at: string;
}

interface Combined {
  email: string;
  firstSeen: string;
  lastSeen: string;
  sources: string[];
  country: string | null;
  country_code: string | null;
  leadCount: number;
  responses: Feedback[];
}

const flag = (cc: string | null) => {
  if (!cc || cc.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(...cc.toUpperCase().split("").map((c) => A + c.charCodeAt(0) - 65));
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: l, error: leadsError }, { data: f, error: feedbackError }] = await Promise.all([
        supabase.from("demo_leads").select("*").order("created_at", { ascending: false }),
        supabase.from("feedback_responses").select("*").order("created_at", { ascending: false }),
      ]);
      if (leadsError || feedbackError) {
        setLoadError("Leads konnten nicht geladen werden. Bitte erneut als freigegebener Admin anmelden.");
      }
      setLeads((l ?? []) as any);
      setFeedback((f ?? []) as any);
      setLoading(false);
    })();
  }, []);

  const combined: Combined[] = useMemo(() => {
    const map = new Map<string, Combined>();
    for (const l of leads) {
      const key = l.email.toLowerCase();
      const cur = map.get(key) ?? {
        email: l.email, firstSeen: l.created_at, lastSeen: l.created_at,
        sources: [], country: null, country_code: null, leadCount: 0, responses: [],
      };
      cur.leadCount += 1;
      if (l.source && !cur.sources.includes(l.source)) cur.sources.push(l.source);
      if (l.created_at < cur.firstSeen) cur.firstSeen = l.created_at;
      if (l.created_at > cur.lastSeen) cur.lastSeen = l.created_at;
      if (!cur.country && l.country) { cur.country = l.country; cur.country_code = l.country_code; }
      map.set(key, cur);
    }
    for (const r of feedback) {
      const em = (r.email ?? "anonym").toLowerCase();
      const cur = map.get(em) ?? {
        email: r.email ?? "anonym", firstSeen: r.created_at, lastSeen: r.created_at,
        sources: [], country: null, country_code: null, leadCount: 0, responses: [],
      };
      cur.responses.push(r);
      if (r.source && !cur.sources.includes(r.source)) cur.sources.push(r.source);
      if (r.created_at < cur.firstSeen) cur.firstSeen = r.created_at;
      if (r.created_at > cur.lastSeen) cur.lastSeen = r.created_at;
      if (!cur.country && r.country) { cur.country = r.country; cur.country_code = r.country_code; }
      map.set(em, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  }, [leads, feedback]);

  const filtered = useMemo(() => {
    if (!q.trim()) return combined;
    const needle = q.toLowerCase();
    return combined.filter((c) =>
      c.email.toLowerCase().includes(needle) ||
      (c.country ?? "").toLowerCase().includes(needle) ||
      c.sources.join(" ").toLowerCase().includes(needle)
    );
  }, [combined, q]);

  const exportCsv = () => {
    const rows = [
      ["email", "country", "country_code", "sources", "lead_count", "responses", "first_seen", "last_seen"],
      ...combined.map((c) => [
        c.email, c.country ?? "", c.country_code ?? "",
        c.sources.join("|"), String(c.leadCount), String(c.responses.length),
        c.firstSeen, c.lastSeen,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalLeads = leads.length;
  const totalResponses = feedback.length;
  const uniqueEmails = combined.length;
  const countries = new Set(combined.map((c) => c.country_code).filter(Boolean)).size;

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-primary" /> Leads & Antworten
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Alle E-Mails aus Demo-Anmeldungen und Newsletter, zusammengeführt mit Umfrage-Antworten.
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline" size="sm" disabled={combined.length === 0}>
          <Download className="h-4 w-4 mr-1.5" /> CSV exportieren
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Unique E-Mails" value={uniqueEmails} icon={Mail} />
        <StatCard label="Lead-Einträge" value={totalLeads} icon={Inbox} />
        <StatCard label="Umfrage-Antworten" value={totalResponses} icon={MessageSquare} />
        <StatCard label="Länder" value={countries} icon={Globe2} />
      </div>

      <div className="surface-card p-4 md:p-5 mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suche E-Mail, Land oder Quelle…" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground p-6">Lädt…</p>
      ) : loadError ? (
        <div className="surface-card p-6 text-sm text-destructive">{loadError}</div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-6 text-sm text-muted-foreground">
          Noch keine gespeicherten Einträge. Ab jetzt werden Demo- und Wartelisten-E-Mails hier angezeigt.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.email} className="surface-card p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{flag(c.country_code)}</span>
                    <span className="font-medium break-all">{c.email}</span>
                    {c.country && (
                      <span className="text-xs text-muted-foreground">· {c.country}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {c.sources.map((s) => (
                      <span key={s} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  <div>Erste: {new Date(c.firstSeen).toLocaleString("de-DE")}</div>
                  <div>Letzte: {new Date(c.lastSeen).toLocaleString("de-DE")}</div>
                </div>
              </div>

              {c.responses.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Umfrage-Antworten ({c.responses.length})
                  </p>
                  {c.responses.map((r) => (
                    <div key={r.id} className="rounded-xl bg-secondary/40 p-3 text-sm">
                      <div className="grid sm:grid-cols-4 gap-2 text-xs">
                        <Field label="Bewusstsein" value={r.awareness_score != null ? `${r.awareness_score}/10` : "—"} />
                        <Field label="Firma" value={r.company_name ?? "—"} />
                        <Field label="Bereich" value={r.sector ?? r.business_area ?? "—"} />
                        <Field label="MA-Anzahl" value={r.employee_count != null ? String(r.employee_count) : "—"} />
                      </div>
                      {r.suggestion && (
                        <p className="text-xs text-muted-foreground mt-2 italic">„{r.suggestion}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
