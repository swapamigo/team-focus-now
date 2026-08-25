import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Trophy, Gift, ShieldCheck, EyeOff, Plus } from "lucide-react";
import PrivacySelfTest from "@/components/app/PrivacySelfTest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TeamRow {
  id: string;
  name: string;
  color: string;
}

interface UnlockedGoal {
  id: string;
  team_id: string;
  reward_title: string;
  reward_note: string | null;
  unlocked_at: string | null;
}

const NOT_VISIBLE = [
  "Namen einzelner Teilnehmender",
  "individuelle Fokuszeiten",
  "Nutzungsminuten",
  "Team-Durchschnittswerte",
  "Ranglisten",
  "verwendete Apps, Webseiten oder URLs",
  "Nachrichten, Inhalte, Screenshots, Tastatureingaben",
  "Standortdaten",
  "Teams, die ihr Ziel nicht erreicht haben",
];

export default function ManagerDashboard() {
  const { companyId, profile } = useAuth();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [unlocked, setUnlocked] = useState<UnlockedGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ team_id: "", reward_title: "", target: "300", period_end: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    const [{ data: company }, { data: teamsData }, { data: members }, { data: goals }] = await Promise.all([
      supabase.from("companies").select("name").eq("id", companyId).maybeSingle(),
      supabase.from("teams").select("id, name, color").eq("company_id", companyId),
      supabase.from("company_members").select("user_id").eq("company_id", companyId),
      supabase
        .from("team_goals")
        .select("id, team_id, reward_title, reward_note, unlocked_at")
        .eq("company_id", companyId)
        .eq("unlocked", true)
        .order("unlocked_at", { ascending: false }),
    ]);

    setCompanyName(company?.name ?? "");
    setMemberCount(members?.length ?? 0);
    setTeams(teamsData ?? []);
    setUnlocked(goals ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [companyId]);

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? "Team";
  const teamColor = (id: string) => teams.find((t) => t.id === id)?.color ?? "hsl(var(--primary))";

  const createGoal = async () => {
    if (!companyId || !form.team_id || !form.reward_title.trim()) {
      return toast.error("Team und Belohnung angeben.");
    }
    setSaving(true);
    const { error } = await supabase.from("team_goals").insert({
      company_id: companyId,
      team_id: form.team_id,
      reward_title: form.reward_title.trim(),
      target_focus_minutes: Number(form.target) || 0,
      period_end: form.period_end || undefined,
    });
    setSaving(false);
    if (error) return toast.error("Ziel konnte nicht gespeichert werden.");
    toast.success("Ziel und Belohnung festgelegt. Werte bleiben beim Team.");
    setShowForm(false);
    setForm({ team_id: "", reward_title: "", target: "300", period_end: "" });
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Hallo {profile?.display_name ?? "Manager"}</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">{companyName || "Workspace"}</h1>
      </header>

      <section className="surface-card p-5 mb-6 flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-secondary text-primary grid place-items-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">Diese eine Information erhältst du</p>
          <p className="text-sm text-muted-foreground mt-1">
            Sichtbar wird ausschließlich, welches Team eine vorher vereinbarte Belohnung freigeschaltet hat.
            Persönliche Nutzungsdaten, Fokuszeiten, Team-Durchschnitte und Ranglisten stehen dir nicht zur Verfügung.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <Stat icon={Users} label="Mitarbeitende" value={memberCount.toString()} />
        <Stat icon={Trophy} label="Teams" value={teams.length.toString()} />
      </div>

      <section className="surface-card p-6 mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Freigeschaltete Belohnungen</h2>
          <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-1.5" /> Ziel festlegen
          </Button>
        </div>

        {showForm && (
          <div className="rounded-xl border border-border/60 p-4 mb-5 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="goal-team">Team</Label>
                <select
                  id="goal-team"
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.team_id}
                  onChange={(e) => setForm({ ...form, team_id: e.target.value })}
                >
                  <option value="">Team wählen…</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="goal-reward">Vereinbarte Belohnung</Label>
                <Input id="goal-reward" className="mt-1" placeholder="z. B. zwei Stunden früherer Feierabend"
                  value={form.reward_title} onChange={(e) => setForm({ ...form, reward_title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="goal-target">Zielwert (Fokusminuten / Tag)</Label>
                <Input id="goal-target" className="mt-1" type="number" min={0}
                  value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="goal-end">Ende des Zeitraums</Label>
                <Input id="goal-end" className="mt-1" type="date"
                  value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Ziel und Belohnung werden vorab gemeinsam festgelegt. Den Fortschritt sieht ausschließlich das Team selbst.
            </p>
            <Button size="sm" onClick={createGoal} disabled={saving}>{saving ? "Speichert…" : "Ziel speichern"}</Button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Lädt…</p>
        ) : unlocked.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Noch keine Belohnung freigeschaltet. Sobald ein Team sein vereinbartes Ziel erreicht, erscheint es hier.
          </p>
        ) : (
          <ul className="space-y-3">
            {unlocked.map((g) => (
              <li key={g.id} className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg shrink-0" style={{ background: teamColor(g.team_id) }} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">Team {teamName(g.team_id)}</p>
                    <p className="text-sm text-success font-medium">Belohnung freigeschaltet</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Gewählter Benefit: {g.reward_title}
                  {g.reward_note ? ` · ${g.reward_note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-3"><EyeOff className="h-4 w-4 text-muted-foreground" /> Nicht sichtbar für dich</h2>
        <ul className="grid sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm text-muted-foreground">
          {NOT_VISIBLE.map((x) => <li key={x}>· {x}</li>)}
        </ul>
      </section>

      <section>
        <PrivacySelfTest />
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
