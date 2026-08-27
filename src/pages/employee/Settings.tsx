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
import { useT } from "@/i18n";

export default function SettingsPage() {
  const t = useT();
  const { profile, role } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success(t("employee.settings.logged_out"));
    nav("/");
  };

  const deleteAccount = async () => {
    toast.loading(t("employee.settings.deleting_account"), { id: "del" });
    const { error } = await supabase.functions.invoke("delete-account", {});
    if (error) {
      toast.error(t("employee.settings.error_prefix") + error.message, { id: "del" });
      return;
    }
    await supabase.auth.signOut();
    toast.success(t("employee.settings.account_deleted"), { id: "del" });
    window.location.replace("/");
  };

  const simulate = async () => {
    toast.info(t("employee.settings.simulating"));
    const { error } = await supabase.functions.invoke("simulate-month", {});
    if (error) return toast.error(t("employee.settings.simulate_error"));
    toast.success(t("employee.settings.simulate_done"));
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">{t("employee.settings.title")}</h1>
      </header>

      <section className="px-5 mb-5">
        <div className="surface-card p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center shadow-glow">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{profile?.display_name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{t("employee.settings.role_label")}: {role === "manager" ? t("employee.settings.role_manager") : t("employee.settings.role_employee")}</p>
          </div>
        </div>
      </section>

      <section className="px-5 mb-5">
        <div className="surface-card p-5 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shrink-0">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t("employee.settings.privacy_title")}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t("employee.settings.privacy_intro")}
              </p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t("employee.settings.privacy_point1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t("employee.settings.privacy_point2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t("employee.settings.privacy_point3")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t("employee.settings.privacy_point4")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t("employee.settings.privacy_point5")}</span>
            </li>
          </ul>
        </div>
      </section>

      {role === "manager" && (
        <section className="px-5 mb-5">
          <Button onClick={simulate} variant="outline" className="w-full h-12 rounded-2xl">
            <Sparkles className="h-4 w-4 mr-2" />
            {t("employee.settings.simulate_button")}
          </Button>
        </section>
      )}

      <section className="px-5 space-y-2">
        <Button onClick={logout} variant="ghost" className="w-full h-12 rounded-2xl">
          <LogOut className="h-4 w-4 mr-2" />
          {t("employee.settings.logout")}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full h-12 rounded-2xl text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t("employee.settings.delete_account")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("employee.settings.delete_confirm_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("employee.settings.delete_confirm_desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("employee.settings.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t("employee.settings.delete_final")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
