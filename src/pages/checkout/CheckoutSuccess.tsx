import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Construction, Mail, Check, Send } from "lucide-react";

// Alle Felder optional – kein Pflichtfeld.
const schema = z.object({
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  awareness: z.number().min(1).max(10),
  companyName: z.string().trim().max(200).optional(),
  businessArea: z.string().trim().max(200).optional(),
  sector: z.string().trim().max(200).optional(),
  employeeCount: z.number().min(1).max(10000).optional(),
  suggestion: z.string().trim().max(2000).optional(),
});

export default function CheckoutSuccess() {
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [awareness, setAwareness] = useState(5);
  const [companyName, setCompanyName] = useState("");
  const [businessArea, setBusinessArea] = useState("");
  const [sector, setSector] = useState("");
  const [employeeCount, setEmployeeCount] = useState(20);
  const [suggestion, setSuggestion] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const parsed = schema.safeParse({ email, awareness, companyName, businessArea, sector, employeeCount, suggestion });
    if (!parsed.success) {
      toast.error("Bitte Eingaben prüfen.");
      return;
    }
    setSaving(true);
    const finalEmail =
      email ||
      session?.user.email ||
      (typeof window !== "undefined" ? localStorage.getItem("demo_email") : null) ||
      null;
    const { error } = await supabase.from("feedback_responses").insert({
      email: finalEmail,
      awareness_score: awareness,
      company_name: companyName || null,
      business_area: businessArea || null,
      sector: sector || null,
      employee_count: employeeCount,
      suggestion: suggestion || null,
      source: "checkout_truth",
    });
    setSaving(false);
    if (error) return toast.error("Speichern fehlgeschlagen.");
    setSent(true);
    toast.success("Vielen Dank für Ihr Feedback!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-16 max-w-2xl">
        <div className="surface-card-elevated p-8 md:p-10 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Construction className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Vielen Dank für Ihr Interesse!</h1>
            <p className="text-muted-foreground leading-relaxed">
              Ganz ehrlich: TeamFocus befindet sich aktuell im finalen Entwicklungsstadium und geht
              <strong className="text-foreground"> im nächsten Monat öffentlich live</strong>.
              Tragen Sie sich gerne in unsere Liste ein – wir geben Ihnen sofort Bescheid, sobald Sie
              das Produkt nutzen können.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="surface-card p-8 text-center">
            <div className="inline-flex h-12 w-12 rounded-full bg-success/15 text-success items-center justify-center mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Eingetragen!</h2>
            <p className="text-sm text-muted-foreground mb-6">Wir melden uns, sobald TeamFocus live ist.</p>
            <Button asChild variant="outline"><Link to="/">Zurück zur Startseite</Link></Button>
          </div>
        ) : (
          <div className="surface-card p-6 md:p-8 space-y-6">
            <p className="text-xs text-muted-foreground -mb-2">Alle Felder sind freiwillig.</p>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> E-Mail (für Benachrichtigung)</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={session?.user.email ?? "name@firma.de"} maxLength={255} />
            </div>

            <div className="space-y-3 pt-2 border-t border-border/60">
              <h3 className="text-sm font-semibold">Eine kurze Umfrage</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">War Ihnen bewusst, wie groß das Smartphone-Problem ist?</Label>
                  <span className="text-2xl font-semibold tabular-nums">{awareness}/10</span>
                </div>
                <Slider value={[awareness]} min={1} max={10} step={1} onValueChange={(v) => setAwareness(v[0])} />
                <div className="flex justify-between text-[11px] text-muted-foreground"><span>Gar nicht</span><span>Vollkommen</span></div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Muster GmbH" maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessArea">Branche der Firma</Label>
                  <Input id="businessArea" value={businessArea} onChange={(e) => setBusinessArea(e.target.value)} placeholder="z. B. Logistik, Kanzlei …" maxLength={200} />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Label htmlFor="sector">Für welche Mitarbeitenden / welchen Bereich?</Label>
                <Input id="sector" value={sector} onChange={(e) => setSector(e.target.value)} placeholder="z. B. Vertrieb, Lager, Buchhaltung …" maxLength={200} />
              </div>

              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <Label>Wie viele Mitarbeitende insgesamt?</Label>
                  <span className="text-2xl font-semibold tabular-nums">{employeeCount}</span>
                </div>
                <Slider value={[employeeCount]} min={1} max={1000} step={1} onValueChange={(v) => setEmployeeCount(v[0])} />
              </div>

              <div className="space-y-2 pt-3">
                <Label htmlFor="suggestion">Vorschläge zur Verbesserung?</Label>
                <Textarea id="suggestion" rows={3} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} maxLength={2000} placeholder="Was würde Ihnen den Einstieg leichter machen?" />
              </div>
            </div>

            <Button onClick={submit} disabled={saving} className="w-full h-12 shadow-glow">
              <Send className="h-4 w-4 mr-2" /> {saving ? "Sende…" : "Absenden"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
