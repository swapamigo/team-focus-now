import { useNavigate } from "react-router-dom";
import { Building2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function RoleSelect() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container py-6">
        <Logo withWordmark />
      </header>
      <div className="flex-1 grid place-items-center px-4 pb-12">
        <div className="w-full max-w-2xl text-center animate-fade-in">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">Wie möchtest du starten?</h1>
          <p className="text-muted-foreground mb-10">Du kannst einen neuen Workspace erstellen oder einer bestehenden Einladung folgen.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => nav("/onboarding/manager")}
              className="surface-card p-8 text-left hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center mb-4 shadow-glow">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Ich bin Manager</h3>
              <p className="text-sm text-muted-foreground">Workspace erstellen, Teams und Mitarbeitende einladen.</p>
            </button>

            <button
              onClick={() => nav("/onboarding/employee")}
              className="surface-card p-8 text-left hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="h-12 w-12 rounded-2xl bg-secondary grid place-items-center mb-4">
                <UserCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Ich bin Mitarbeiter</h3>
              <p className="text-sm text-muted-foreground">Mit Einladungs-Code beitreten.</p>
            </button>
          </div>

          <Button variant="ghost" className="mt-8" onClick={() => nav("/")}>Zurück</Button>
        </div>
      </div>
    </div>
  );
}
