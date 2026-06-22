import { FormEvent, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Inbox, LogOut, Shield } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ADMIN_EMAILS = ["swapamigo@gmail.com", "joel.schoeppe@gmail.com"];
const isAllowedAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.trim().toLowerCase());

export default function AdminLayout() {
  const { isAdmin, loading, session, refresh } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const loginWithPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAllowedAdminEmail(email)) {
      toast.error("Zugang nur für die freigegebenen Admin-E-Mails.");
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setAuthLoading(false);
    if (error) {
      toast.error("Anmeldung fehlgeschlagen. Bitte E-Mail/Passwort prüfen oder Google nutzen.");
      return;
    }
    await refresh();
    toast.success("Admin bestätigt.");
  };

  const createAdminAccount = async () => {
    if (!isAllowedAdminEmail(email)) {
      toast.error("Zugang nur für die freigegebenen Admin-E-Mails.");
      return;
    }
    if (password.length < 6) {
      toast.error("Das Passwort braucht mindestens 6 Zeichen.");
      return;
    }
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/leads` },
    });
    setAuthLoading(false);
    if (error) {
      toast.error(error.message ?? "Konto konnte nicht erstellt werden.");
      return;
    }
    if (data.session) {
      await refresh();
      toast.success("Admin-Konto erstellt.");
    } else {
      toast.success("Konto erstellt. Bitte Bestätigungs-E-Mail öffnen und danach erneut anmelden.");
    }
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin/leads` });
    if (result.error) {
      toast.error("Google-Anmeldung fehlgeschlagen.");
      setAuthLoading(false);
      return;
    }
    if (result.redirected) return;
    await refresh();
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Lädt…
      </div>
    );
  }
  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="surface-card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="h-9 w-9 text-primary mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-2">Admin bestätigen</h1>
            <p className="text-sm text-muted-foreground">
              Melde dich mit einer freigegebenen Admin-E-Mail an, um Leads und eingetragene E-Mails zu sehen.
            </p>
          </div>
          <Button onClick={loginWithGoogle} disabled={authLoading} variant="outline" className="w-full h-12 rounded-2xl mb-4">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Schnell mit Google anmelden
          </Button>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">oder per Passwort</span></div>
          </div>
          <form onSubmit={loginWithPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin-E-Mail</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Swapamigo@gmail.com" required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Passwort</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={authLoading} className="w-full h-12 rounded-2xl shadow-glow">
              {authLoading ? "Prüfe…" : "Admin-Zugang öffnen"}
            </Button>
            <Button type="button" onClick={createAdminAccount} disabled={authLoading} variant="ghost" className="w-full h-11 rounded-2xl">
              Noch kein Passwort? Admin-Konto erstellen
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-5">
            Erlaubt: Swapamigo@gmail.com und joel.schoeppe@gmail.com
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="surface-card p-8 max-w-sm text-center">
          <Shield className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-semibold mb-2">Kein Zugriff</h1>
          <p className="text-sm text-muted-foreground mb-4">Dieser Bereich ist nur für Swapamigo@gmail.com und joel.schoeppe@gmail.com.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={() => nav("/")} variant="outline" size="sm">Zur Startseite</Button>
            <Button onClick={async () => { await supabase.auth.signOut(); nav("/admin/leads"); }} size="sm">Anderes Admin-Konto nutzen</Button>
          </div>
        </div>
      </div>
    );
  }

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const items = [
    { to: "/admin/leads", icon: Inbox, label: "Leads & Antworten" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex md:flex-col w-60 border-r border-border/60 bg-card/40 p-6 gap-6">
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <p className="text-sm font-semibold leading-tight">TeamFocus</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <Button onClick={logout} variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" /> Abmelden
          </Button>
        </div>
      </aside>

      <header className="md:hidden glass border-b border-border/40 px-4 py-3 sticky top-0 z-40 flex items-center justify-between w-full">
        <div className="flex items-center gap-2"><Logo /><span className="text-xs uppercase tracking-wider text-muted-foreground">Admin</span></div>
        <Button onClick={logout} variant="ghost" size="sm"><LogOut className="h-4 w-4" /></Button>
      </header>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
