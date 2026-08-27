import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import Logo from "@/components/Logo";
import { useT } from "@/i18n";

export default function ManagerOnboarding() {
  const t = useT();
  const { user, profile, role } = useAuth();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Wenn bereits onboarded, sofort weiterleiten – verhindert das Zurückwerfen.
  if (profile?.onboarded) {
    return <Navigate to={role === "employee" ? "/app" : "/manager"} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) return toast.error(t("onboarding.manager.name_required"));
    if (!consent) return toast.error(t("onboarding.manager.consent_required"));
    setLoading(true);
    try {
      const { data: companyId, error } = await supabase.rpc("create_workspace", {
        _name: name.trim(),
        _industry: industry || null,
      });
      if (error) throw error;

      toast.success(t("onboarding.manager.workspace_created_toast"));
      const { error: seedErr } = await supabase.functions.invoke("seed-demo", {
        body: { company_id: companyId },
      });
      if (seedErr) console.warn("Seed:", seedErr);

      // Hard-Reload, damit Auth-Context und Routen sauber neu initialisieren.
      window.location.replace("/manager");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? t("onboarding.manager.create_error"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container py-6">
        <Logo withWordmark />
      </header>
      <div className="flex-1 grid place-items-center px-4 pb-12">
        <form onSubmit={submit} className="w-full max-w-md surface-card p-8 animate-scale-in space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">{t("onboarding.manager.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("onboarding.manager.subtitle")}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">{t("onboarding.manager.company_label")}</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("onboarding.manager.company_placeholder")} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">{t("onboarding.manager.industry_label")}</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={t("onboarding.manager.industry_placeholder")} className="h-11" />
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              {t("onboarding.manager.privacy_note")}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
            <span className="text-sm">{t("onboarding.manager.consent_label")}</span>
          </label>

          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? t("onboarding.manager.creating") : t("onboarding.manager.create_button")}
          </Button>
        </form>
      </div>
    </div>
  );
}
