import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import SpatialPanel from "@/components/landing/SpatialPanel";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFocusText } from "@/i18n/focus";

export default function CompanySuggestion() {
  const { t } = useFocusText();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy || !name.trim()) return;
    setBusy(true);
    try {
      const url = new URL(website);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("invalid_url");
      // Existing lead inbox; no outbound mail, auto-enrolment or made-up contact data.
      const { error } = await supabase.from("feedback_responses").insert({ company_name: name.trim(), email: email.trim() || null, suggestion: `Unternehmensvorschlag: ${url.href}`, source: "company_suggestion" });
      if (error) throw error;
      setSent(true);
    } catch { toast.error(t("error")); } finally { setBusy(false); }
  };
  return <div className="marketing-site min-h-screen flex flex-col"><Seo title={`TeamFokus · ${t("suggestCompany")}`} description={t("companyBody")} path="/unternehmen-vorschlagen" /><LandingHeader onDemo={() => navigate("/demo/employee")} /><main className="container max-w-xl py-14 flex-1"><SpatialPanel variant="intro" icon={Building2} className="spatial-compact mb-8"><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t("companyTitle")}</h1><p className="text-muted-foreground leading-relaxed mt-4">{t("companyBody")}</p></SpatialPanel>{sent ? <div className="surface-card p-7 flex gap-3 items-center" role="status"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><p>{t("sent")}</p></div> : <form onSubmit={submit} className="surface-card p-6 space-y-5">
    <div className="space-y-2"><Label htmlFor="suggest-company">{t("companyName")}</Label><Input id="suggest-company" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} /></div>
    <div className="space-y-2"><Label htmlFor="suggest-website">{t("companyWebsite")}</Label><Input id="suggest-website" type="url" required maxLength={500} placeholder="https://" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
    <div className="space-y-2"><Label htmlFor="suggest-email">{t("emailOptional")}</Label><Input id="suggest-email" type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
    <p className="text-xs text-muted-foreground leading-relaxed">{t("suggestionNote")}</p><Button className="w-full" type="submit" disabled={busy}>{t(busy ? "saving" : "send")}</Button>
  </form>}</main><Footer /></div>;
}
