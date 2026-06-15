import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Inbox, LogOut, Shield } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const { isAdmin, loading, session } = useAuth();
  const nav = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Lädt…
      </div>
    );
  }
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="surface-card p-8 max-w-sm text-center">
          <Shield className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-semibold mb-2">Kein Zugriff</h1>
          <p className="text-sm text-muted-foreground mb-4">Dieser Bereich ist nur für Admins.</p>
          <Button onClick={() => nav("/")} variant="outline" size="sm">Zur Startseite</Button>
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
