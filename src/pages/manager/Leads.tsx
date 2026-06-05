import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Download, Inbox, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

interface Feedback {
  id: string;
  email: string | null;
  awareness_score: number | null;
  sector: string | null;
  employee_count: number | null;
  suggestion: string | null;
  source: string | null;
  created_at: string;
}

export default function ManagerLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: f }] = await Promise.all([
        supabase.from("demo_leads").select("*").order("created_at", { ascending: false }),
        supabase.from("feedback_responses").select("*").order("created_at", { ascending: false }),
      ]);
      setLeads((l ?? []) as any);
      setFeedback((f ?? []) as any);
      setLoading(false);
    })();
  }, []);

  const exportCsv = () => {
    const rows = [["email", "source", "created_at"], ...leads.map((l) => [l.email, l.source ?? "", l.created_at])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `demo_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-primary" /> Demo-Leads & Feedback
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Alle E-Mails aus Demo, Waitlist und Checkout-Umfrage.</p>
        </div>
        <Button onClick={exportCsv} variant="outline" size="sm" disabled={leads.length === 0}>
          <Download className="h-4 w-4 mr-1.5" /> CSV exportieren
        </Button>
      </header>

      <section className="surface-card p-5 md:p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" /> E-Mails ({leads.length})
        </h2>
        {loading ? <p className="text-sm text-muted-foreground">Lädt…</p> : leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Leads.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">E-Mail</th><th className="text-left py-2">Quelle</th><th className="text-left py-2">Datum</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 font-medium">{l.email}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{l.source ?? "—"}</td>
                    <td className="py-2.5 text-muted-foreground text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString("de-DE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="surface-card p-5 md:p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" /> Umfrage-Antworten ({feedback.length})
        </h2>
        {feedback.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Antworten.</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => (
              <div key={f.id} className="rounded-xl bg-secondary/50 p-4 text-sm">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="font-medium">{f.email ?? "anonym"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString("de-DE")}</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Bewusstsein:</span> <strong>{f.awareness_score ?? "—"}/10</strong></div>
                  <div><span className="text-muted-foreground">Bereich:</span> <strong>{f.sector ?? "—"}</strong></div>
                  <div><span className="text-muted-foreground">MA-Anzahl:</span> <strong>{f.employee_count ?? "—"}</strong></div>
                </div>
                {f.suggestion && (
                  <p className="text-xs text-muted-foreground mt-2 italic">„{f.suggestion}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
