import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManagerSettings() {
  const t = useT();
  const { profile } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const deleteAccount = async () => {
    toast.loading(t("manager.settings.deleting_account"), { id: "del" });
    const { error } = await supabase.functions.invoke("delete-account", {});
    if (error) {
      toast.error(t("manager.settings.error_prefix") + error.message, { id: "del" });
      return;
    }
    await supabase.auth.signOut();
    toast.success(t("manager.settings.account_deleted"), { id: "del" });
    window.location.replace("/");
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">{t("manager.settings.title")}</h1>

      <div className="surface-card p-5 mb-4 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center"><User className="h-6 w-6 text-primary-foreground" /></div>
        <div>
          <p className="font-semibold">{profile?.display_name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{t("manager.settings.role_manager")}</p>
        </div>
      </div>

      <div className="surface-card p-5 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("manager.settings.privacy_note")}
          </p>
        </div>
      </div>

      <Button onClick={logout} variant="outline" className="w-full h-12 rounded-2xl mb-3">
        <LogOut className="h-4 w-4 mr-2" /> {t("manager.settings.logout")}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full h-12 rounded-2xl text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> {t("manager.settings.delete_account")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("manager.settings.delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("manager.settings.delete_confirm_desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("manager.settings.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("manager.settings.delete_final")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
