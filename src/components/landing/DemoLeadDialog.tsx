import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse eingeben.").max(255),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function DemoLeadDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setSaving(true);
    const { error: dbError } = await supabase
      .from("demo_leads")
      .insert({ email: parsed.data.email, source: "landing_demo_button" });
    setSaving(false);
    if (dbError) {
      toast.error("Speichern fehlgeschlagen. Bitte erneut versuchen.");
      return;
    }
    toast.success("Demo wird freigeschaltet …");
    onOpenChange(false);
    setEmail("");
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" /> Demo freischalten
          </DialogTitle>
          <DialogDescription>
            Geben Sie Ihre E-Mail ein – wir schalten Ihnen die Demo direkt frei.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="demo-email">E-Mail-Adresse</Label>
            <Input
              id="demo-email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="name@firma.de"
              maxLength={255}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Mit dem Absenden willigen Sie ein, dass wir Ihre E-Mail zur Demo-Freischaltung verarbeiten.
            Details in unserer{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">Datenschutzerklärung</a>.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Sende…" : "Demo freischalten"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
