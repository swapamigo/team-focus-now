import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

interface Team { id: string; name: string; emoji: string | null; color: string; }

export default function ManagerTeams() {
  const { companyId } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🚀");

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
    const { error } = await supabase.from("teams").insert({ company_id: companyId, name: name.trim(), emoji });
    if (error) return toast.error(error.message);
    toast.success("Team erstellt");
    setName(""); setEmoji("🚀"); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Team wirklich löschen?")) return;
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Gelöscht"); load();
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Teams</h1>

      <form onSubmit={create} className="surface-card p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="sm:w-20 h-11 rounded-xl text-center text-xl" maxLength={2} />
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team-Name (z. B. Adler)" className="h-11 rounded-xl" />
        <Button type="submit" className="h-11 rounded-xl">
          <Plus className="h-4 w-4 mr-1" /> Hinzufügen
        </Button>
      </form>

      <ul className="space-y-2">
        {teams.map(t => (
          <li key={t.id} className="surface-card p-4 flex items-center gap-4">
            <span className="text-2xl">{t.emoji ?? "🚀"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {counts[t.id] ?? 0} Mitglieder</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(t.id)} className="text-destructive">Löschen</Button>
          </li>
        ))}
        {teams.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Teams.</p>}
      </ul>
    </div>
  );
}
