import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Sparkles, Shield } from "lucide-react";

export default function EmployeeOnboarding() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("invite") ?? "");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!consent) return toast.error("Bitte den Datenschutzhinweis akzeptieren.");
    setLoading(true);
    try {
      const { data: invite, error } = await supabase
        .from("invites")
        .select("*")
        .eq("code", code.trim())
        .is("used_at", null)
        .maybeSingle();
      if (error || !invite) throw new Error("Einladungs-Code ungültig oder bereits verwendet.");

      await Promise.all([
        supabase.from("user_roles").insert({ user_id: user.id, role: "employee", company_id: invite.company_id }),
        supabase.from("company_members").insert({ user_id: user.id, company_id: invite.company_id }),
        invite.team_id
          ? supabase.from("team_members").insert({ user_id: user.id, team_id: invite.team_id })
          : Promise.resolve(),
        supabase.from("invites").update({ used_at: new Date().toISOString(), used_by: user.id }).eq("id", invite.id),
        supabase.from("profiles").update({ consent_accepted_at: new Date().toISOString(), onboarded: true }).eq("id", user.id),
      ]);

      toast.success("Willkommen im Team!");
      await refresh();
      nav("/app");
    } catch (err: any) {
      toast.error(err.message ?? "Fehler beim Beitreten");
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
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Team beitreten</h1>
            <p className="text-sm text-muted-foreground">Gib deinen Einladungs-Code ein, den du von deinem Manager erhalten hast.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">Einladungs-Code</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="z. B. TF-AB12CD" className="h-11 rounded-xl font-mono uppercase" />
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-secondary p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Es werden nur aggregierte Zeitdaten erhoben. Du siehst nie individuelle Werte deiner Kolleg:innen.
              Du kannst deine Teilnahme jederzeit beenden.
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
            <span className="text-sm">Ich nehme freiwillig teil und akzeptiere den Datenschutzhinweis.</span>
          </label>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl shadow-glow">
            {loading ? "Wird verbunden…" : "Beitreten"}
          </Button>
        </form>
      </div>
    </div>
  );
}
