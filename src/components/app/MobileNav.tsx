import { NavLink, useLocation } from "react-router-dom";
import { Home, Trophy, Sparkles, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", icon: Home, label: "Heute" },
  { to: "/app/teams", icon: Trophy, label: "Teams" },
  { to: "/app/features", icon: Sparkles, label: "Features" },
  { to: "/app/rules", icon: ShieldCheck, label: "Regeln" },
  { to: "/app/settings", icon: Settings, label: "Mehr" },
];

export default function MobileNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/40 safe-bottom">
      <ul className="flex justify-around max-w-md mx-auto px-2 pt-2 pb-3">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          return (
            <li key={it.to}>
              <NavLink
                to={it.to}
                end
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <it.icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="text-[10px] font-medium">{it.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
