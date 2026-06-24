import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarClock, ArrowRight } from "lucide-react";

const CAL_URL = "https://cal.com/joelschoppe/teamfocus";

const schema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse eingeben.").max(255),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function BookCallDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    setSaving(true);
    try {
      const { getVisitorGeo } = await import("@/lib/geo");
      const geo = await getVisitorGeo();
      const { error: dbError } = await supabase
        .from("demo_leads")
        .insert({
          email: parsed.data.email,
          source: "landing_book_call",
          country: geo.country,
          country_code: geo.country_code,
        });
      if (dbError) {
        // Don't block the booking – just log a soft warning.
        console.error("demo_leads insert failed", dbError);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
    toast.success("Weiterleitung zur Terminbuchung …");
    window.open(CAL_URL, "_blank", "noopener,noreferrer");
    close(false);
  };

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) setTimeout(() => { setEmail(""); setError(null); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" /> Jetzt Call vereinbaren
          </DialogTitle>
          <DialogDescription>
            E-Mail eingeben – im nächsten Schritt buchen Sie direkt einen Termin mit Joel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="call-email">E-Mail-Adresse</Label>
            <Input
              id="call-email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
              placeholder="name@firma.de"
              maxLength={255}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Mit dem Absenden willigen Sie ein, dass wir Ihre E-Mail zur Terminvereinbarung verarbeiten.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => close(false)}>Abbrechen</Button>
          <Button onClick={submit} disabled={saving} aria-label="Jetzt Call mit Gründer vereinbaren">
            {saving ? "Sende…" : "Weiter zur Terminbuchung"} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
