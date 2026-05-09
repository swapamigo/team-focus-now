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

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    toast.success(label + " kopiert");
    setTimeout(() => setCopied(null), 1500);
  };

  const linkFor = (code: string) => `${window.location.origin}/join/${code}`;

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Einladungen</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Teile einen Link oder Code mit deinen Mitarbeitenden – der Link führt direkt in den Workspace, der Code funktioniert beim ersten Login.
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
          <Plus className="h-4 w-4 mr-1" /> Einladung erstellen
        </Button>
      </div>

      <ul className="space-y-3">
        {invites.map(i => {
          const team = teams.find(t => t.id === i.team_id);
          const used = !!i.used_at;
          const expired = new Date(i.expires_at) < new Date();
          const link = linkFor(i.code);
          return (
            <li key={i.id} className="surface-card p-4 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <code className="font-mono font-semibold text-base tracking-wider">{i.code}</code>
                <span className="text-xs text-muted-foreground">{team?.name ?? "Ohne Team"}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ml-auto ${used ? "bg-success/10 text-success" : expired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {used ? "Verwendet" : expired ? "Abgelaufen" : "Aktiv"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-secondary/60 text-xs font-mono truncate">{link}</div>
                <Button size="sm" variant="outline" onClick={() => copy(link, "Link")} className="rounded-xl">
                  {copied === link ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Link
                </Button>
                <Button size="sm" variant="ghost" onClick={() => copy(i.code, "Code")} className="rounded-xl">
                  {copied === i.code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </li>
          );
        })}
        {invites.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Einladungen.</p>}
      </ul>
    </div>
  );
}
