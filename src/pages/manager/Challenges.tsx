import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Plus, Sparkles, Euro, Award, Fuel, Ticket, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useT } from "@/i18n";

interface Challenge { id: string; title: string; description: string | null; status: string; start_date: string; end_date: string; duration: string }

export default function ManagerChallenges() {
  const t = useT();
  const { companyId } = useAuth();
  const [items, setItems] = useState<Challenge[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"1_week" | "2_weeks" | "3_weeks" | "1_month">("1_week");
  const [reward, setReward] = useState("");
  const [saving, setSaving] = useState(false);

  const DURATIONS: { value: "1_week" | "2_weeks" | "3_weeks" | "1_month"; label: string; days: number }[] = [
    { value: "1_week", label: t("manager.challenges.duration_weekly"), days: 7 },
    { value: "2_weeks", label: t("manager.challenges.duration_2weeks"), days: 14 },
    { value: "3_weeks", label: t("manager.challenges.duration_3weeks"), days: 21 },
    { value: "1_month", label: t("manager.challenges.duration_monthly"), days: 30 },
  ];

  const REWARD_SUGGESTIONS: { category: string; icon: any; tone: string; items: string[] }[] = [
    {
      category: t("manager.challenges.category_vouchers"),
      icon: Ticket,
      tone: "bg-primary/10 text-primary",
      items: [
        t("manager.challenges.reward_fuel"),
        t("manager.challenges.reward_restaurant"),
        t("manager.challenges.reward_cinema"),
        t("manager.challenges.reward_streaming"),
      ],
    },
    {
      category: t("manager.challenges.category_monetary"),
      icon: Euro,
      tone: "bg-success/10 text-success",
      items: [
        t("manager.challenges.reward_lunch"),
        t("manager.challenges.reward_bonus"),
        t("manager.challenges.reward_team_activity"),
      ],
    },
    {
      category: t("manager.challenges.category_symbolic"),
      icon: Award,
      tone: "bg-warning/10 text-warning",
      items: [
        t("manager.challenges.reward_badge"),
        t("manager.challenges.reward_choose_event"),
        t("manager.challenges.reward_parking"),
      ],
    },
  ];

  const load = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("challenges").select("*").eq("company_id", companyId).order("start_date", { ascending: false });
    setItems((data ?? []) as Challenge[]);
  };

  useEffect(() => { load(); }, [companyId]);

  const create = async () => {
    if (!companyId) return;
    if (!title.trim()) return toast.error(t("manager.challenges.title_required"));
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
    toast.success(t("manager.challenges.created_toast"));
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <header className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("manager.challenges.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("manager.challenges.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t("manager.challenges.new_challenge")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> {t("manager.challenges.create_challenge")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="t">{t("manager.challenges.field_title")}</Label>
                <Input id="t" value={title} onChange={e => setTitle(e.target.value)} placeholder={t("manager.challenges.field_title_placeholder")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d">{t("manager.challenges.field_description")}</Label>
                <Textarea id="d" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder={t("manager.challenges.field_description_placeholder")} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("manager.challenges.field_cycle")}</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">{t("manager.challenges.field_cycle_hint")}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r">{t("manager.challenges.field_reward")}</Label>
                <Input id="r" value={reward} onChange={e => setReward(e.target.value)} placeholder={t("manager.challenges.field_reward_placeholder")} />
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{t("manager.challenges.suggestions_label")}</p>
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
              <Button variant="outline" onClick={() => setOpen(false)}>{t("manager.challenges.cancel")}</Button>
              <Button onClick={create} disabled={saving}>{saving ? t("manager.challenges.saving") : t("manager.challenges.start")}</Button>
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
            {t("manager.challenges.empty")}
          </li>
        )}
      </ul>
    </div>
  );
}
