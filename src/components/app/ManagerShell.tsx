import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Trophy, Settings as Cog } from "lucide-react";
import Logo from "@/components/Logo";
import OnboardingTour from "@/components/app/OnboardingTour";
import { cn } from "@/lib/utils";

const items = [
  { to: "/manager", icon: LayoutDashboard, label: "Übersicht", end: true },
  { to: "/manager/teams", icon: Users, label: "Teams" },
  { to: "/manager/challenges", icon: Trophy, label: "Challenges" },
  { to: "/manager/settings", icon: Cog, label: "Einstellungen" },
];

export default function ManagerShell() {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar (md+) */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-border/60 bg-card/40 p-6 gap-6">
        <Logo withWordmark />
        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
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
      </aside>

      {/* Mobile header */}
      <header className="md:hidden glass border-b border-border/40 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <Logo withWordmark />
      </header>

      <main className="flex-1 min-w-0 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border/40 safe-bottom">
        <ul className="flex justify-around px-2 pt-2 pb-3">
          {items.map((it) => {
            const active = it.end ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.end}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <it.icon className={cn("h-5 w-5", active && "scale-110 transition-transform")} />
                  <span className="text-[10px] font-medium">{it.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <OnboardingTour />
    </div>
  );
}
