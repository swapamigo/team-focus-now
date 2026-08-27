import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useT } from "@/i18n";

export function useFaqItems() {
  const t = useT();
  return [
    { q: t("landing.faq.q1.q"), a: t("landing.faq.q1.a") },
    { q: t("landing.faq.q2.q"), a: t("landing.faq.q2.a") },
    { q: t("landing.faq.q3.q"), a: t("landing.faq.q3.a") },
    { q: t("landing.faq.q4.q"), a: t("landing.faq.q4.a") },
    { q: t("landing.faq.q5.q"), a: t("landing.faq.q5.a") },
    { q: t("landing.faq.q6.q"), a: t("landing.faq.q6.a") },
    { q: t("landing.faq.q7.q"), a: t("landing.faq.q7.a") },
    { q: t("landing.faq.q8.q"), a: t("landing.faq.q8.a") },
    { q: t("landing.faq.q9.q"), a: t("landing.faq.q9.a") },
    { q: t("landing.faq.q10.q"), a: t("landing.faq.q10.a") },
    { q: t("landing.faq.q11.q"), a: t("landing.faq.q11.a") },
  ];
}

export default function Faq() {
  const t = useT();
  const faqItems = useFaqItems();
  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="faq">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.faq.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.faq.title")}</h2>
      </div>

      <div className="max-w-3xl mx-auto surface-card p-3 md:p-5">
        <Accordion type="single" collapsible>
          {faqItems.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium px-3">{it.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-3">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
