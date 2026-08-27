import { useState } from "react";
import { ChevronDown, Check, AlertCircle, Building2, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import avvAsset from "@/assets/compliance/avv.pdf.asset.json";
import infoblattAsset from "@/assets/compliance/infoblatt.pdf.asset.json";
import vvtAsset from "@/assets/compliance/vvt.pdf.asset.json";
import dsfaAsset from "@/assets/compliance/dsfa.pdf.asset.json";
import starterKitAsset from "@/assets/compliance/starter-kit.zip.asset.json";

type Item = { title: string; ref?: string; template?: { url: string; label: string } };
type Category = {
  id: string;
  label: string;
  tone: "green" | "amber" | "grey";
  icon: typeof Check;
  intro: string;
  items: Item[];
};

const toneStyles: Record<Category["tone"], { wrap: string; dot: string; chip: string; icon: string }> = {
  green: {
    wrap: "border-emerald-500/30 bg-emerald-500/[0.04]",
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    wrap: "border-amber-500/30 bg-amber-500/[0.04]",
    dot: "bg-amber-500",
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
  },
  grey: {
    wrap: "border-border/60 bg-muted/30",
    dot: "bg-muted-foreground/60",
    chip: "bg-muted/60 text-muted-foreground",
    icon: "text-muted-foreground",
  },
};

export default function LegalBasis() {
  const t = useT();
  const [open, setOpen] = useState<string | null>("green");

  const categories: Category[] = [
    {
      id: "green",
      label: t("landing.legal_basis.green.label"),
      tone: "green",
      icon: Check,
      intro: t("landing.legal_basis.green.intro"),
      items: [
        { title: t("landing.legal_basis.green.item1.title"), ref: t("landing.legal_basis.green.item1.ref") },
        { title: t("landing.legal_basis.green.item2.title"), ref: t("landing.legal_basis.green.item2.ref") },
        { title: t("landing.legal_basis.green.item3.title"), ref: t("landing.legal_basis.green.item3.ref") },
        { title: t("landing.legal_basis.green.item4.title"), ref: t("landing.legal_basis.green.item4.ref") },
        { title: t("landing.legal_basis.green.item5.title"), ref: t("landing.legal_basis.green.item5.ref") },
        { title: t("landing.legal_basis.green.item6.title"), ref: t("landing.legal_basis.green.item6.ref") },
        { title: t("landing.legal_basis.green.item7.title"), ref: t("landing.legal_basis.green.item7.ref") },
        { title: t("landing.legal_basis.green.item8.title"), ref: t("landing.legal_basis.green.item8.ref") },
      ],
    },
    {
      id: "amber",
      label: t("landing.legal_basis.amber.label"),
      tone: "amber",
      icon: AlertCircle,
      intro: t("landing.legal_basis.amber.intro"),
      items: [
        { title: t("landing.legal_basis.amber.item1.title") },
        { title: t("landing.legal_basis.amber.item2.title"), ref: t("landing.legal_basis.amber.item2.ref") },
        { title: t("landing.legal_basis.amber.item3.title"), ref: t("landing.legal_basis.amber.item3.ref") },
      ],
    },
    {
      id: "grey",
      label: t("landing.legal_basis.grey.label"),
      tone: "grey",
      icon: Building2,
      intro: t("landing.legal_basis.grey.intro"),
      items: [
        { title: t("landing.legal_basis.grey.item1.title"), ref: t("landing.legal_basis.grey.item1.ref"), template: { url: vvtAsset.url, label: t("landing.legal_basis.grey.item1.template") } },
        { title: t("landing.legal_basis.grey.item2.title"), ref: t("landing.legal_basis.grey.item2.ref"), template: { url: dsfaAsset.url, label: t("landing.legal_basis.grey.item2.template") } },
        { title: t("landing.legal_basis.grey.item3.title"), ref: t("landing.legal_basis.grey.item3.ref"), template: { url: avvAsset.url, label: t("landing.legal_basis.grey.item3.template") } },
        { title: t("landing.legal_basis.grey.item4.title"), ref: t("landing.legal_basis.grey.item4.ref"), template: { url: infoblattAsset.url, label: t("landing.legal_basis.grey.item4.template") } },
      ],
    },
  ];

  return (
    <section className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.legal_basis.eyebrow")}</p>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">
            {t("landing.legal_basis.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("landing.legal_basis.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const s = toneStyles[cat.tone];
            const isOpen = open === cat.id;
            const Icon = cat.icon;
            return (
              <div key={cat.id} className={cn("rounded-2xl border transition-all", s.wrap)}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", s.chip)}>
                    <Icon className={cn("h-5 w-5", s.icon)} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-base md:text-lg">{cat.label}</span>
                    <span className="block text-xs md:text-sm text-muted-foreground mt-0.5">{cat.intro}</span>
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-border/40 pt-4 space-y-4">
                    {cat.id === "grey" && (
                      <a
                        href={starterKitAsset.url}
                        download
                        aria-label={t("landing.legal_basis.starter_kit.aria")}
                        className="group flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/15 px-4 py-3 transition-colors"
                      >
                        <span className="h-10 w-10 rounded-lg bg-primary/20 grid place-items-center shrink-0">
                          <Download className="h-5 w-5 text-primary" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm md:text-base font-semibold text-foreground">
                            {t("landing.legal_basis.starter_kit.title")}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {t("landing.legal_basis.starter_kit.desc")}
                          </span>
                        </span>
                        <span className="text-[11px] uppercase tracking-wider text-primary font-semibold shrink-0">ZIP</span>
                      </a>
                    )}
                    <ul className="space-y-2.5">
                      {cat.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className={cn("mt-2 h-1.5 w-1.5 rounded-full shrink-0", s.dot)} />
                          <span className="leading-relaxed flex-1">
                            <span className="text-foreground">{it.title}</span>
                            {it.ref && <span className="block text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{it.ref}</span>}
                            {it.template && (
                              <a
                                href={it.template.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("landing.legal_basis.template_aria", { label: it.template.label })}
                                title={t("landing.legal_basis.template_title")}
                                className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="underline-offset-2 hover:underline">{it.template.label} ↓</span>
                              </a>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
