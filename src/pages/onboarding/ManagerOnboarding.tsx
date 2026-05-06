import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Sparkles, Shield } from "lucide-react";

export default function ManagerOnboarding() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) return toast.error("Bitte einen Workspace-Namen angeben.");
    if (!consent) return toast.error("Bitte den Datenschutzhinweis akzeptieren.");
    setLoading(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6);
      const { data: company, error: cErr } = await supabase
        .from("companies").insert({ name, slug, industry, owner_id: user.id }).select().single();
      if (cErr) throw cErr;

      await Promise.all([
        supabase.from("user_roles").insert({ user_id: user.id, role: "manager", company_id: company.id }),
        supabase.from("company_members").insert({ user_id: user.id, company_id: company.id }),
        supabase.from("subscriptions").insert({ company_id: company.id, status: "trial", seats: 1 }),
        supabase.from("profiles").update({ consent_accepted_at: new Date().toISOString(), onboarded: true }).eq("id", user.id),
      ]);

      // Seed Demo via Edge Function
      toast.success("Workspace erstellt – Demo-Daten werden geladen…");
      const { error: seedErr } = await supabase.functions.invoke("seed-demo", { body: { company_id: company.id } });
      if (seedErr) console.warn("Seed:", seedErr);

      await refresh();
      nav("/app");
    } catch (err: any) {
      toast.error(err.message ?? "Fehler beim Erstellen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container py-6 flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl gradient-primary grid place-items-center">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">Team Focus</span>
      </header>
      <div className="flex-1 grid place-items-center px-4 pb-12">
        <form onSubmit={submit} className="w-full max-w-md surface-card p-8 animate-scale-in space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Workspace erstellen</h1>
            <p className="text-sm text-muted-foreground">Wir richten alles ein und erzeugen Demo-Daten.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Unternehmen / Workspace</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Mustermann GmbH" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Branche (optional)</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Beratung, Tech, Handel…" className="h-11 rounded-xl" />
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-secondary p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Team Focus erhebt nur aggregierte Zeitdaten. Keine Inhalte, keine Screenshots, keine Tastatureingaben.
              Mitarbeitende stimmen separat zu und können jederzeit widerrufen (DSGVO).
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
            <span className="text-sm">Ich habe den Datenschutzhinweis gelesen und akzeptiere ihn.</span>
          </label>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl shadow-glow">
            {loading ? "Wird erstellt…" : "Workspace erstellen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
