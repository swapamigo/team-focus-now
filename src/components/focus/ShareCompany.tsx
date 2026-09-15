import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFocusText } from "@/i18n/focus";

export default function ShareCompany() {
  const { t } = useFocusText();
  const [open, setOpen] = useState(false);
  const url = "https://teamfokus.app";
  const copy = async () => { try { await navigator.clipboard.writeText(url); toast.success(t("copied")); } catch { setOpen(true); } };
  const share = async () => {
    if (!navigator.share) return setOpen(true);
    try { await navigator.share({ title: "TeamFokus", text: t("heroBody"), url }); }
    catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setOpen(true); }
  };
  return <>
    <div className="flex flex-col sm:flex-row gap-3">
      <Button size="lg" className="h-12 px-6" onClick={share}><Share2 className="h-4 w-4 mr-2" />{t("showManager")}</Button>
      <Button asChild size="lg" variant="outline" className="h-12 px-6"><Link to="/unternehmen-vorschlagen"><Building2 className="h-4 w-4 mr-2" />{t("suggestCompany")}</Link></Button>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{t("showManager")}</DialogTitle><DialogDescription>{t("heroBody")}</DialogDescription></DialogHeader><Input aria-label="TeamFokus Link" readOnly value={url} onFocus={(e) => e.target.select()} /><Button onClick={copy}><Copy className="h-4 w-4 mr-2" />{t("copy")}</Button></DialogContent></Dialog>
  </>;
}
