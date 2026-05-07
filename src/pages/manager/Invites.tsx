import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Invite { id: string; code: string; team_id: string | null; expires_at: string; used_at: string | null; }
interface Team { id: string; name: string; }

export default function ManagerInvites() {
  const { companyId } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState<string>("none");
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    if (!companyId) return;
    const [{ data: inv }, { data: t }] = await Promise.all([
      supabase.from("invites").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("teams").select("id, name").eq("company_id", companyId),
    ]);
    setInvites(inv ?? []); setTeams(t ?? []);
  };
  useEffect(() => { load(); }, [companyId]);

  const create = async () => {
    if (!companyId) return;
    const { data, error } = await supabase.rpc("create_invite", {
      _company_id: companyId,
      _team_id: teamId === "none" ? null : teamId,
    });
    if (error) return toast.error(error.message);
    toast.success(`Code erstellt: ${data}`);
    load();
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Code kopiert");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Einladungen</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Erstelle einen Code und gib ihn deinen Mitarbeitenden – sie geben ihn beim ersten Login ein.
      </p>

      <div className="surface-card p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <Select value={teamId} onValueChange={setTeamId}>
          <SelectTrigger className="h-11 rounded-xl flex-1"><SelectValue placeholder="Team wählen" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Ohne Team</SelectItem>
            {teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={create} className="h-11 rounded-xl">
          <Plus className="h-4 w-4 mr-1" /> Code erstellen
        </Button>
      </div>

      <ul className="space-y-2">
        {invites.map(i => {
          const team = teams.find(t => t.id === i.team_id);
          const used = !!i.used_at;
          const expired = new Date(i.expires_at) < new Date();
          return (
            <li key={i.id} className="surface-card p-4 flex items-center gap-3">
              <code className="font-mono font-semibold text-base tracking-wider flex-1">{i.code}</code>
              <span className="text-xs text-muted-foreground hidden sm:inline">{team?.name ?? "Ohne Team"}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${used ? "bg-success/10 text-success" : expired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                {used ? "Verwendet" : expired ? "Abgelaufen" : "Aktiv"}
              </span>
              <Button size="icon" variant="ghost" onClick={() => copy(i.code)}>
                {copied === i.code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </li>
          );
        })}
        {invites.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Einladungen.</p>}
      </ul>
    </div>
  );
}
