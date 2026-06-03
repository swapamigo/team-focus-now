import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Plus, Sparkles, Clock, Euro, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Challenge { id: string; title: string; description: string | null; status: string; start_date: string; end_date: string; duration: string }

const DURATIONS: { value: "1_week" | "2_weeks" | "3_weeks" | "1_month"; label: string; days: number }[] = [
  { value: "1_week", label: "Wöchentlich (1 Woche)", days: 7 },
  { value: "2_weeks", label: "Alle 2 Wochen", days: 14 },
  { value: "3_weeks", label: "Alle 3 Wochen", days: 21 },
  { value: "1_month", label: "Monatlich (1 Monat)", days: 30 },
];

const REWARD_SUGGESTIONS: { category: string; icon: any; tone: string; items: string[] }[] = [
  {
    category: "Zeitliche Begünstigungen",
    icon: Clock,
    tone: "bg-primary/10 text-primary",
    items: [
      "1–2 Stunden späterer Arbeitsbeginn am Montag (nur Gewinnerteam)",
      "1–2 Stunden früherer Feierabend (Mo–Do, nur Gewinnerteam)",
      "Zusätzlicher (halber) freier Tag",
    ],
  },
  {
    category: "Monetäre Belohnungen",
    icon: Euro,
    tone: "bg-success/10 text-success",
    items: [
      "Gutscheine (Restaurant, Buchhandlung, lokaler Anbieter)",
      "Bezahlter Team-Lunch oder Kaffee-/Eis-Runde",
      "Geld- oder Sachbonus (z. B. Noise-Cancelling-Kopfhörer)",
    ],
  },
  {
    category: "Symbolische Belohnungen",
    icon: Award,
    tone: "bg-warning/10 text-warning",
    items: [
      "\u201EFokus-Champion\u201C-Badge & Anerkennung im Team-Meeting",
      "Team darf nächstes Team-Event / Lunch auswählen",
      "Bevorzugter Parkplatz oder Lieblings-Arbeitsplatz für 1 Monat",
    ],
  },
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
          <p className="text-sm text-muted-foreground mt-1">Motivieren Sie Teams mit Wettbewerben um weniger Ablenkungszeit.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Neue Challenge</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                <Label>Belohnungs-Zyklus</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">Am Ende jedes Zyklus gewinnt das Team mit der geringsten Ablenkungszeit.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r">Belohnung für das Gewinnerteam</Label>
                <Input id="r" value={reward} onChange={e => setReward(e.target.value)} placeholder="z. B. Team-Mittagessen" />
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Vorschläge – klicken zum Übernehmen</p>
                  {REWARD_SUGGESTIONS.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`h-6 w-6 rounded-md grid place-items-center ${cat.tone}`}>
                          <cat.icon className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-xs font-semibold">{cat.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReward(s)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/70 border border-border/60 hover:bg-secondary text-left leading-snug"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
            Noch keine Challenges. Starten Sie Ihre erste oben rechts.
          </li>
        )}
      </ul>
    </div>
  );
}
