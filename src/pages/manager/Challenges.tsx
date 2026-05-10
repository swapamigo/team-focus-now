import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Challenge { id: string; title: string; description: string | null; status: string; start_date: string; end_date: string; duration: string }

const DURATIONS: { value: "1_week" | "2_weeks" | "3_weeks" | "1_month"; label: string; days: number }[] = [
  { value: "1_week", label: "1 Woche", days: 7 },
  { value: "2_weeks", label: "2 Wochen", days: 14 },
  { value: "3_weeks", label: "3 Wochen", days: 21 },
  { value: "1_month", label: "1 Monat", days: 30 },
];

export default function ManagerChallenges() {
  const { companyId } = useAuth();
  const [items, setItems] = useState<Challenge[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<typeof DURATIONS[number]["value"]>("1_week");
  const [reward, setReward] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("challenges").select("*").eq("company_id", companyId).order("start_date", { ascending: false });
    setItems((data ?? []) as Challenge[]);
  };

  useEffect(() => { load(); }, [companyId]);

  const create = async () => {
    if (!companyId) return;
    if (!title.trim()) return toast.error("Bitte Titel angeben");
    setSaving(true);
    const days = DURATIONS.find(d => d.value === duration)!.days;
    const start = new Date();
    const end = new Date(); end.setDate(start.getDate() + days);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: c, error } = await supabase.from("challenges").insert({
      company_id: companyId,
      created_by: user!.id,
      title: title.trim(),
      description: description.trim() || null,
      duration,
      status: "active",
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
    }).select("id").single();
    if (error) { setSaving(false); return toast.error(error.message); }
    if (reward.trim() && c) {
      await supabase.from("rewards").insert({ challenge_id: c.id, title: reward.trim() });
    }
    setSaving(false); setOpen(false);
    setTitle(""); setDescription(""); setReward(""); setDuration("1_week");
    toast.success("Challenge erstellt");
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <header className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Challenges</h1>
          <p className="text-sm text-muted-foreground mt-1">Motiviere Teams mit Wettbewerben um weniger Bildschirmzeit.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Neue Challenge</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Challenge erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="t">Titel</Label>
                <Input id="t" value={title} onChange={e => setTitle(e.target.value)} placeholder="z. B. Fokus-Sprint Mai" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d">Beschreibung (optional)</Label>
                <Textarea id="d" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Worum geht's?" />
              </div>
              <div className="space-y-1.5">
                <Label>Dauer</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r">Belohnung (optional)</Label>
                <Input id="r" value={reward} onChange={e => setReward(e.target.value)} placeholder="z. B. Team-Mittagessen" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
              <Button onClick={create} disabled={saving}>{saving ? "Speichere…" : "Starten"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <ul className="space-y-3">
        {items.map(c => (
          <li key={c.id} className="surface-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl gradient-primary grid place-items-center"><Trophy className="h-5 w-5 text-primary-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.start_date} → {c.end_date} · {DURATIONS.find(d => d.value === c.duration)?.label ?? c.duration}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>{c.status}</span>
            </div>
            {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
          </li>
        ))}
        {items.length === 0 && (
          <li className="surface-card p-8 text-center text-sm text-muted-foreground">
            Noch keine Challenges. Starte deine erste oben rechts.
          </li>
        )}
      </ul>
    </div>
  );
}
