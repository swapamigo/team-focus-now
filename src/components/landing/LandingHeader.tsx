import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useFocusText } from "@/i18n/focus";

export default function LandingHeader({ onDemo }: { onDemo: () => void; onBookCall?: () => void }) {
  const { t } = useFocusText();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const items = [{ href: "/#rewards", text: t("rewards") }, { href: "/datenschutz", text: t("privacy") }, { href: "/fuer-arbeitgeber", text: t("companies") }];
  const links = (mobile = false) => items.map((item) => item.href.includes("#")
    ? <a key={item.href} href={item.href} className="nav-link" onClick={() => mobile && setOpen(false)}>{item.text}</a>
    : <Link key={item.href} to={item.href} className="nav-link" aria-current={pathname === item.href ? "page" : undefined} onClick={() => mobile && setOpen(false)}>{item.text}</Link>);
  return <header className="floating-header" data-scrolled={scrolled}>
    <div className="nav-glass">
      <Link to="/" aria-label="TeamFokus" className="shrink-0"><Logo withWordmark /></Link>
      <nav className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground" aria-label={t("menu")}>{links()}</nav>
      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher compact /><Button size="sm" className="hidden sm:inline-flex rounded-full px-4" onClick={onDemo}>{t("demo")}</Button>
        <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button className="lg:hidden rounded-full" variant="ghost" size="icon" aria-label={t("menu")}><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent className="w-72"><SheetTitle>TeamFokus</SheetTitle><SheetDescription className="sr-only">{t("menu")}</SheetDescription><nav className="flex flex-col gap-3 mt-8" aria-label={t("menu")}>{links(true)}<Button className="mt-2" onClick={() => { setOpen(false); onDemo(); }}>{t("demo")}</Button></nav></SheetContent></Sheet>
      </div>
    </div>
  </header>;
}
