import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n";

interface Team { id: string; name: string; emoji: string | null; color: string; }

export default function ManagerTeams() {
  const t = useT();
  const { companyId } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");

  const load = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("teams").select("*").eq("company_id", companyId).order("created_at");
    setTeams(data ?? []);
    const { data: tm } = await supabase.from("team_members").select("team_id").in("team_id", (data ?? []).map(t => t.id));
    const c: Record<string, number> = {};
    (tm ?? []).forEach(r => { c[r.team_id] = (c[r.team_id] ?? 0) + 1; });
    setCounts(c);
  };
  useEffect(() => { load(); }, [companyId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !name.trim()) return;
    const { error } = await supabase.from("teams").insert({ company_id: companyId, name: name.trim(), color, emoji: null });
    if (error) return toast.error(error.message);
    toast.success(t("manager.teams.created"));
    setName(""); setColor("#6366f1"); load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("manager.teams.confirm_delete"))) return;
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t("manager.teams.deleted")); load();
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">{t("manager.teams.title")}</h1>

      <form onSubmit={create} className="surface-card p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="sm:w-16 h-11 p-1 cursor-pointer" />
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("manager.teams.name_placeholder")} className="h-11" />
        <Button type="submit" className="h-11">
          <Plus className="h-4 w-4 mr-1" /> {t("manager.teams.add")}
        </Button>
      </form>

      <ul className="space-y-2">
        {teams.map(tm => (
          <li key={tm.id} className="surface-card p-4 flex items-center gap-4">
            <span className="h-9 w-9 rounded-lg grid place-items-center text-xs font-semibold text-white" style={{ background: tm.color }}>{tm.name.slice(0, 2).toUpperCase()}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{tm.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {counts[tm.id] ?? 0} {(counts[tm.id] ?? 0) === 1 ? t("manager.teams.member_singular") : t("manager.teams.member_plural")}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(tm.id)} className="text-destructive">{t("manager.teams.delete_button")}</Button>
          </li>
        ))}
        {teams.length === 0 && <p className="text-sm text-muted-foreground">{t("manager.teams.empty")}</p>}
      </ul>
    </div>
  );
}
