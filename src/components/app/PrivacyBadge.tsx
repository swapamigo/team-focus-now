import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/i18n";

/**
 * Permanenter Datenschutz-Badge in der Mitarbeiter-App.
 * Erklärt in einem Satz, was nicht passiert – verlinkt zur Detailseite.
 */
export default function PrivacyBadge() {
  const t = useT();
  return (
    <Link
      to="/app/privacy"
      className="flex items-start gap-2.5 mx-4 mt-3 mb-1 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 text-[11px] leading-snug text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/[0.1] transition-colors"
      aria-label={t("app.privacybadge.aria_label")}
    >
      <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
      <span>
        <strong className="font-semibold">{t("app.privacybadge.bold")}</strong> {t("app.privacybadge.rest")}
      </span>
    </Link>
  );
}
