import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useFocusText } from "@/i18n/focus";

export default function Footer() {
  const { t } = useFocusText();
  return <footer className="border-t border-border/50 bg-card"><div className="container max-w-6xl py-9 flex flex-col sm:flex-row justify-between gap-7 text-sm"><div><Link to="/"><Logo withWordmark /></Link><p className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} Joel Schöppe</p></div><nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground"><Link to="/fuer-arbeitgeber">{t("companies")}</Link><Link to="/datenschutz">{t("privacy")}</Link><Link to="/impressum">Impressum</Link><a href="mailto:joel@teamfokus.app">joel@teamfokus.app</a></nav></div></footer>;
}
