import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useFocusText } from "@/i18n/focus";

export default function LandingHeader({ onDemo }: { onDemo: () => void; onBookCall?: () => void }) {
  const { t } = useFocusText();
  const [open, setOpen] = useState(false);
  const items = [{ href: "/#rewards", text: t("rewards") }, { href: "/datenschutz", text: t("privacy") }, { href: "/fuer-arbeitgeber", text: t("companies") }];
  return <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40"><div className="container h-16 flex items-center justify-between gap-3"><Link to="/" aria-label="TeamFokus"><Logo withWordmark /></Link><nav className="hidden md:flex gap-7 text-sm text-muted-foreground">{items.map((item) => <a key={item.href} href={item.href} className="hover:text-primary">{item.text}</a>)}</nav><div className="flex items-center gap-2"><LanguageSwitcher compact /><Button size="sm" className="hidden sm:inline-flex" onClick={onDemo}>{t("demo")}</Button><Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button className="md:hidden" variant="ghost" size="icon" aria-label="Menu"><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent className="w-72"><SheetTitle>TeamFokus</SheetTitle><nav className="flex flex-col gap-5 mt-8">{items.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.text}</a>)}<Button onClick={() => { setOpen(false); onDemo(); }}>{t("demo")}</Button></nav></SheetContent></Sheet></div></div></header>;
}
