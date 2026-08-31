import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, UserCog } from "lucide-react";
import { trackClick } from "@/lib/track";
import { useT } from "@/i18n";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function DemoLeadDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const t = useT();

  const choose = (path: "/demo/employee" | "/demo/manager") => {
    trackClick(`demo:${path.replace("/demo/", "")}`, `Demo ${path.replace("/demo/", "")}`, path);
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("landing.demo_dialog.title")}</DialogTitle>
          <DialogDescription>{t("landing.demo_dialog.desc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
          <button onClick={() => choose("/demo/manager")} className="glow-card p-5 text-left hover:border-primary/40 transition-colors">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center mb-3">
              <UserCog className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="font-semibold mb-1">{t("landing.demo_dialog.manager")}</p>
            <p className="text-xs text-muted-foreground">{t("landing.demo_dialog.manager_desc")}</p>
          </button>
          <button onClick={() => choose("/demo/employee")} className="glow-card p-5 text-left hover:border-primary/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center mb-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="font-semibold mb-1">{t("landing.demo_dialog.employee")}</p>
            <p className="text-xs text-muted-foreground">{t("landing.demo_dialog.employee_desc")}</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
