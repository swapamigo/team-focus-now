import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Users, UserCog, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse eingeben.").max(255),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function DemoLeadDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "choose">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submitEmail = async () => {
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    setSaving(true);
    const { getVisitorGeo } = await import("@/lib/geo");
    const geo = await getVisitorGeo();
    const { error: dbError } = await supabase
      .from("demo_leads")
      .insert({ email: parsed.data.email, source: "landing_demo_button", country: geo.country, country_code: geo.country_code });
    setSaving(false);
    if (dbError) return toast.error("Speichern fehlgeschlagen. Bitte erneut versuchen.");
    setStep("choose");
  };

  const choose = (path: "/demo/employee" | "/demo/manager") => {
    try { localStorage.setItem("demo_email", email); } catch {}
    onOpenChange(false);
    setTimeout(() => { setStep("email"); setEmail(""); }, 300);
    navigate(path);
  };

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) setTimeout(() => { setStep("email"); setEmail(""); setError(null); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        {step === "email" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" /> Demo freischalten
              </DialogTitle>
              <DialogDescription>
                E-Mail eingeben – im nächsten Schritt wählen Sie die Sicht und sehen sofort die Demo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="demo-email">E-Mail-Adresse</Label>
                <Input id="demo-email" type="email" autoFocus value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitEmail(); } }}
                  placeholder="name@firma.de" maxLength={255} />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Mit dem Absenden willigen Sie ein, dass wir Ihre E-Mail zur Demo-Freischaltung verarbeiten.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => close(false)}>Abbrechen</Button>
              <Button onClick={submitEmail} disabled={saving}>
                {saving ? "Sende…" : "Weiter"} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Welche Sicht möchten Sie sehen?</DialogTitle>
              <DialogDescription>Sie können später jederzeit zur anderen wechseln.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
              <button onClick={() => choose("/demo/manager")} className="glow-card p-5 text-left hover:border-primary/40 transition-colors group">
                <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center mb-3">
                  <UserCog className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="font-semibold mb-1">Manager-Sicht</p>
                <p className="text-xs text-muted-foreground">Dashboard, Teams, Challenges, Jahresüberblick.</p>
              </button>
              <button onClick={() => choose("/demo/employee")} className="glow-card p-5 text-left hover:border-primary/40 transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold mb-1">Mitarbeiter-Sicht</p>
                <p className="text-xs text-muted-foreground">Eigene Statistiken, Team-Ranking, Privatsphäre.</p>
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
