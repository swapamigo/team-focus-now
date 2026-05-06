import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { profile, role } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    nav("/");
  };

  const simulate = async () => {
    toast.info("Simuliere neuen Tag…");
    const { error } = await supabase.functions.invoke("simulate-tick", {});
    if (error) return toast.error("Fehler bei Simulation");
    toast.success("Demo-Daten aktualisiert. Lade Dashboard neu.");
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Einstellungen</h1>
      </header>

      <section className="px-5 mb-5">
        <div className="surface-card p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center shadow-glow">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{profile?.display_name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Rolle: {role === "manager" ? "Manager" : "Mitarbeiter"}</p>
          </div>
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Datenschutz</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Team Focus erhebt nur aggregierte Zeitwerte. Keine Inhalte, keine Screenshots, keine Tastatureingaben.
                Du kannst deine Teilnahme jederzeit widerrufen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mb-5">
        <Button onClick={simulate} variant="outline" className="w-full h-12 rounded-2xl">
          <Sparkles className="h-4 w-4 mr-2" />
          Demo-Tag simulieren
        </Button>
      </section>

      <section className="px-5">
        <Button onClick={logout} variant="ghost" className="w-full h-12 rounded-2xl text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>
      </section>
    </div>
  );
}
