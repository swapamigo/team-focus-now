import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/track";
import { useT } from "@/i18n";

export default function ContactSection() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t("landing.contact.error_required"));
      return;
    }
    setSending(true);
    try {
      const payload = { name: name.trim(), email: email.trim(), company: company.trim(), message: message.trim() };
      const key = crypto.randomUUID();

      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          recipientEmail: "joel@teamfokus.app",
          idempotencyKey: `contact-notify-${key}`,
          purpose: "transactional",
          templateData: payload,
        },
      });
      if (error) throw error;

      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-confirmation",
          recipientEmail: payload.email,
          idempotencyKey: `contact-confirm-${key}`,
          purpose: "transactional",
          templateData: { name: payload.name, message: payload.message },
        },
      });

      trackClick("contact:submit", "Kontaktformular gesendet");
      setSent(true);
      setName(""); setEmail(""); setCompany(""); setMessage("");
    } catch (err) {
      console.error("contact form failed:", err);
      toast.error(t("landing.contact.error_send"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" className="container py-16 md:py-24 scroll-mt-24">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex h-12 w-12 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-4">
          <Mail className="h-6 w-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t("landing.contact.title")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("landing.contact.desc_prefix")}{" "}
          <a href="mailto:joel@teamfokus.app" className="text-primary hover:underline">joel@teamfokus.app</a>.{" "}
          {t("landing.contact.desc_suffix")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto surface-card p-6 md:p-8">
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="font-semibold mb-1">{t("landing.contact.sent_title")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.contact.sent_desc")}</p>
            <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>{t("landing.contact.sent_again")}</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder={t("landing.contact.name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <Input type="email" placeholder={t("landing.contact.email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <Input placeholder={t("landing.contact.company")} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
            <Textarea
              placeholder={t("landing.contact.message")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
            <Button type="submit" size="lg" className="h-12 shadow-glow" disabled={sending}>
              <Send className="mr-1.5 h-4 w-4" />
              {sending ? t("landing.contact.sending") : t("landing.contact.submit")}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t("landing.contact.privacy_note")}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
