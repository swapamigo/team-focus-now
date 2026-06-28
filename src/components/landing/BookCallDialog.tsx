import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarClock, ArrowRight, CheckCircle2 } from "lucide-react";

const CAL_URL = "https://cal.com/joelschoppe/teamfocus";

const schema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse eingeben.").max(255),
  employee_count: z.coerce.number().int().min(1, "Bitte Teamgröße angeben.").max(100000),
  plan: z.string().min(1, "Bitte eine Option wählen."),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function BookCallDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"questions" | "book">("questions");
  const [email, setEmail] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    const parsed = schema.safeParse({ email, employee_count: employeeCount, plan });
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    setSaving(true);
    try {
      const { getVisitorGeo } = await import("@/lib/geo");
      const geo = await getVisitorGeo();
      const { error: dbError } = await supabase.from("demo_leads").insert({
        email: parsed.data.email,
        employee_count: parsed.data.employee_count,
        plan: parsed.data.plan,
        source: "landing_book_call",
        country: geo.country,
        country_code: geo.country_code,
      });
      if (dbError) console.error("demo_leads insert failed", dbError);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
    setStep("book");
  };

  const goToCal = () => {
    toast.success("Weiterleitung zur Terminbuchung …");
    window.open(CAL_URL, "_blank", "noopener,noreferrer");
    close(false);
  };

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) setTimeout(() => {
      setStep("questions"); setEmail(""); setEmployeeCount(""); setPlan(""); setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        {step === "questions" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" /> Kurz vorab – 3 Fragen
              </DialogTitle>
              <DialogDescription>
                Damit der Call direkt auf Ihr Team passt. Im nächsten Schritt buchen Sie einen Termin mit Joel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="call-email">Geschäftliche E-Mail</Label>
                <Input
                  id="call-email" type="email" autoFocus value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@firma.de" maxLength={255}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="call-emp">Wie viele Mitarbeitende hat Ihr Team / Unternehmen?</Label>
                <Input
                  id="call-emp" type="number" inputMode="numeric" min={1} value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="z. B. 25"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="call-plan">Was passt am ehesten?</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger id="call-plan"><SelectValue placeholder="Bitte wählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evaluating">Wir prüfen TeamFocus für unser Team</SelectItem>
                    <SelectItem value="ready">Wir wollen TeamFocus einführen</SelectItem>
                    <SelectItem value="info">Erstmal nur Infos sammeln</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Terminvereinbarung verarbeiten.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => close(false)}>Abbrechen</Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Sende…" : "Weiter"} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" /> Danke! Jetzt Termin buchen
              </DialogTitle>
              <DialogDescription>
                Wählen Sie im nächsten Schritt einen Termin, der Ihnen passt. Der Call dauert ca. 20 Minuten.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Persönliche Walkthrough für Ihr Team</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Antworten auf Datenschutz- & Betriebsrat-Fragen</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Konkretes Setup-Angebot – unverbindlich</li>
              </ul>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => close(false)}>Später</Button>
              <Button onClick={goToCal} className="shadow-glow" aria-label="Jetzt Call mit Gründer vereinbaren">
                <CalendarClock className="h-4 w-4 mr-1.5" /> Jetzt Call vereinbaren
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
