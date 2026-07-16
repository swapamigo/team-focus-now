import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarClock, ArrowRight, CheckCircle2 } from "lucide-react";

const CAL_URL = "https://cal.com/joelschoppe/teamfocus";

const schema = z.object({
  company: z.string().trim().min(1, "Bitte Unternehmensnamen angeben.").max(200),
  name: z.string().trim().min(1, "Bitte Ihren Namen angeben.").max(200),
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse eingeben.").max(255),
  employee_count: z.coerce.number().int().min(1, "Bitte Teamgröße angeben.").max(100000),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function BookCallDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"questions" | "book">("questions");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    const parsed = schema.safeParse({ company, name, email, employee_count: employeeCount });
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setSaving(true);
    try {
      const { getVisitorGeo } = await import("@/lib/geo");
      const geo = await getVisitorGeo();
      const { error: dbError } = await supabase.from("demo_leads").insert({
        email: parsed.data.email,
        employee_count: parsed.data.employee_count,
        company_name: parsed.data.company,
        contact_name: parsed.data.name,
        source: "landing_book_call",
        country: geo.country,
        country_code: geo.country_code,
      } as never);
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
      setStep("questions"); setCompany(""); setName(""); setEmail(""); setEmployeeCount(""); setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] flex flex-col p-0 gap-0">
        {step === "questions" ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" /> Kurz vorab
              </DialogTitle>
              <DialogDescription>
                Damit der Call direkt auf Ihr Team passt. Im nächsten Schritt buchen Sie einen Termin mit Joel.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-3 space-y-4 flex-1 overscroll-contain">
              <div className="space-y-1.5">
                <Label htmlFor="call-company">Unternehmensname</Label>
                <Input
                  id="call-company" autoFocus value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="z. B. Muster GmbH" maxLength={200}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="call-name">Ihr Name</Label>
                <Input
                  id="call-name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vor- und Nachname" maxLength={200}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="call-email">E-Mail</Label>
                <Input
                  id="call-email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@firma.de" maxLength={255}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="call-emp">Anzahl an Mitarbeitern</Label>
                <Input
                  id="call-emp" type="number" inputMode="numeric" min={1} value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="z. B. 25"
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Terminvereinbarung verarbeiten.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background shrink-0">
              <Button variant="outline" onClick={() => close(false)}>Abbrechen</Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Sende…" : "Weiter"} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" /> Danke! Jetzt Termin buchen
              </DialogTitle>
              <DialogDescription>
                Wählen Sie im nächsten Schritt einen Termin, der Ihnen passt. Der Call dauert ca. 20 Minuten.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-3 flex-1">
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Persönlicher Walkthrough für Ihr Team</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Antworten auf Datenschutz- & Betriebsrat-Fragen</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> Konkretes Setup-Angebot – unverbindlich</li>
              </ul>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t bg-background shrink-0">
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
