import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, User, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { profile, role } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    nav("/");
  };

  const deleteAccount = async () => {
    toast.loading("Konto wird gelöscht…", { id: "del" });
    const { error } = await supabase.functions.invoke("delete-account", {});
    if (error) {
      toast.error("Fehler: " + error.message, { id: "del" });
      return;
    }
    await supabase.auth.signOut();
    toast.success("Konto gelöscht.", { id: "del" });
    window.location.replace("/");
  };

  const simulate = async () => {
    toast.info("Simuliere Demo-Monat…");
    const { error } = await supabase.functions.invoke("simulate-month", {});
    if (error) return toast.error("Fehler bei Simulation");
    toast.success("30 Tage Demo-Daten aktualisiert.");
    setTimeout(() => window.location.reload(), 600);
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

      <section className="px-5 space-y-2">
        <Button onClick={logout} variant="ghost" className="w-full h-12 rounded-2xl">
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full h-12 rounded-2xl text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Konto löschen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konto endgültig löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Dein Konto und alle deine Daten (Statistiken, Mitgliedschaften) werden unwiderruflich entfernt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Endgültig löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
