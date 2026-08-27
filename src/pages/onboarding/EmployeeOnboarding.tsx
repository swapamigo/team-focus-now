import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
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

export default function EmployeeOnboarding() {
  const t = useT();
  const { user, profile, role } = useAuth();
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("invite") ?? "");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (profile?.onboarded) {
    return <Navigate to={role === "manager" ? "/manager" : "/app"} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!consent) return toast.error(t("onboarding.employee.consent_required"));
    setLoading(true);
    try {
      const { error } = await supabase.rpc("join_with_invite", { _code: code.trim() });
      if (error) throw error;
      toast.success(t("onboarding.employee.welcome_toast"));
      window.location.replace("/app");
    } catch (err: any) {
      const msg = err.message?.includes("invite_not_found")
        ? t("onboarding.employee.invite_invalid")
        : err.message?.includes("invite_expired")
        ? t("onboarding.employee.invite_expired")
        : err.message ?? t("onboarding.employee.join_error");
      toast.error(msg);
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
            <h1 className="text-2xl font-semibold tracking-tight mb-1">{t("onboarding.employee.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("onboarding.employee.subtitle")}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">{t("onboarding.employee.code_label")}</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("onboarding.employee.code_placeholder")} className="h-11 font-mono uppercase" />
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              {t("onboarding.employee.privacy_note")}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
            <span className="text-sm">{t("onboarding.employee.consent_label")}</span>
          </label>

          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? t("onboarding.employee.connecting") : t("onboarding.employee.join_button")}
          </Button>
        </form>
      </div>
    </div>
  );
}
