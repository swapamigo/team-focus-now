import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, Shield, User } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManagerSettings() {
  const { profile } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const deleteAccount = async () => {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) return toast.error("Fehler: " + error.message);
    await supabase.auth.signOut();
    toast.success("Konto gelöscht.");
    nav("/");
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Einstellungen</h1>

      <div className="surface-card p-5 mb-4 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center"><User className="h-6 w-6 text-primary-foreground" /></div>
        <div>
          <p className="font-semibold">{profile?.display_name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">Manager</p>
        </div>
      </div>

      <div className="surface-card p-5 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mitarbeitende sehen niemals individuelle Werte ihrer Kolleg:innen. Manager sehen nur Team-Aggregate.
          </p>
        </div>
      </div>

      <Button onClick={logout} variant="outline" className="w-full h-12 rounded-2xl mb-3">
        <LogOut className="h-4 w-4 mr-2" /> Abmelden
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full h-12 rounded-2xl text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Konto löschen
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konto endgültig löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dein Konto und alle zugehörigen Daten (inkl. Workspace, falls du Eigentümer bist) werden unwiderruflich entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Endgültig löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
