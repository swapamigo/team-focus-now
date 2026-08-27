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
import { Construction, Mail, Check, Send, ArrowLeft, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

const callLink = "mailto:joel@teamfokus.app?subject=Interesse%20an%20einem%20TeamFokus%20Call";

export default function Waitlist() {
  const t = useT();
  const schema = z.object({
    email: z.string().trim().email(t("pages.waitlist.validation.email")).max(255),
    awareness: z.number().min(1).max(10),
    companyName: z.string().trim().max(200).optional(),
    businessArea: z.string().trim().max(200).optional(),
    sector: z.string().trim().max(200).optional(),
    employeeCount: z.number().min(1).max(10000).optional(),
    suggestion: z.string().trim().max(2000).optional(),
  });
  const { session } = useAuth();
  const [email, setEmail] = useState(session?.user.email ?? "");
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
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { getVisitorGeo } = await import("@/lib/geo");
    const geo = await getVisitorGeo();
    const { error } = await supabase.from("feedback_responses").insert({
      email,
      awareness_score: awareness,
      company_name: companyName || null,
      business_area: businessArea || null,
      sector: sector || null,
      employee_count: employeeCount,
      suggestion: suggestion || null,
      source: "waitlist",
      country: geo.country,
      country_code: geo.country_code,
    });
    // Zusätzlich als Lead speichern, falls Spalte vorhanden.
    await supabase.from("demo_leads").insert({ email, source: "waitlist", country: geo.country, country_code: geo.country_code });
    setSaving(false);
    if (error) return toast.error(t("pages.waitlist.saveError"));
    setSent(true);
    toast.success(t("pages.waitlist.successToast"));
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pages.waitlist.seo.title")}
        description={t("pages.waitlist.seo.description")}
        path="/waitlist"
      />
      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> {t("pages.waitlist.back")}
          </Link>
        </div>
      </header>

      <div className="container py-10 md:py-14 max-w-2xl">
        <div className="surface-card-elevated p-8 md:p-10 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
              <Construction className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              {t("pages.waitlist.hero.title")}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t("pages.waitlist.hero.desc").split(/\{\{strong_start\}\}|\{\{strong_end\}\}/).map((part, i) =>
                i === 1 ? <strong key={i} className="text-foreground">{part}</strong> : <span key={i}>{part}</span>
              )}
            </p>
            <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-left">
              <p className="text-sm font-semibold text-foreground mb-1">
                {t("pages.waitlist.hero.testUserTitle")}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {t("pages.waitlist.hero.testUserDesc")}
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto bg-card/70">
                <a href={callLink}><Phone className="h-4 w-4 mr-2" />{t("pages.waitlist.hero.callCta")}</a>
              </Button>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="surface-card p-8 text-center">
            <div className="inline-flex h-12 w-12 rounded-full bg-success/15 text-success items-center justify-center mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("pages.waitlist.sent.title")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t("pages.waitlist.sent.desc")}</p>
            <Button asChild variant="outline"><Link to="/">{t("pages.waitlist.sent.back")}</Link></Button>
          </div>
        ) : (
          <div className="surface-card p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {t("pages.waitlist.form.email")}
              </Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("pages.waitlist.form.emailPlaceholder")} maxLength={255} className="h-12" />
              <p className="text-[11px] text-muted-foreground">{t("pages.waitlist.form.emailNote")}</p>
            </div>

            <div className="space-y-4 pt-2 border-t border-border/60">
              <h3 className="text-sm font-semibold">{t("pages.waitlist.form.questionsTitle")}</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t("pages.waitlist.form.awarenessLabel")}</Label>
                  <span className="text-2xl font-semibold tabular-nums">{awareness}/10</span>
                </div>
                <Slider value={[awareness]} min={1} max={10} step={1} onValueChange={(v) => setAwareness(v[0])} />
                <div className="flex justify-between text-[11px] text-muted-foreground"><span>{t("pages.waitlist.form.awarenessLow")}</span><span>{t("pages.waitlist.form.awarenessHigh")}</span></div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("pages.waitlist.form.companyName")}</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t("pages.waitlist.form.companyNamePlaceholder")} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessArea">{t("pages.waitlist.form.businessArea")}</Label>
                  <Input id="businessArea" value={businessArea} onChange={(e) => setBusinessArea(e.target.value)} placeholder={t("pages.waitlist.form.businessAreaPlaceholder")} maxLength={200} />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Label htmlFor="sector">{t("pages.waitlist.form.sector")}</Label>
                <Input id="sector" value={sector} onChange={(e) => setSector(e.target.value)} placeholder={t("pages.waitlist.form.sectorPlaceholder")} maxLength={200} />
              </div>

              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <Label>{t("pages.waitlist.form.employeeCountLabel")}</Label>
                  <span className="text-2xl font-semibold tabular-nums">{employeeCount}</span>
                </div>
                <Slider value={[employeeCount]} min={1} max={1000} step={1} onValueChange={(v) => setEmployeeCount(v[0])} />
              </div>

              <div className="space-y-2 pt-3">
                <Label htmlFor="suggestion">{t("pages.waitlist.form.suggestion")}</Label>
                <Textarea id="suggestion" rows={3} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} maxLength={2000} placeholder={t("pages.waitlist.form.suggestionPlaceholder")} />
              </div>
            </div>

            <Button onClick={submit} disabled={saving} className="w-full h-12 shadow-glow">
              <Send className="h-4 w-4 mr-2" /> {saving ? t("pages.waitlist.form.submitSending") : t("pages.waitlist.form.submit")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
