import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronRight, Plus, Trash2, Clock, Coffee, AppWindow, ArrowLeft } from "lucide-react";

interface Member {
  id: string;
  display_name: string | null;
  team_name: string | null;
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export default function ManagerMembers() {
  const { companyId } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [active, setActive] = useState<Member | null>(null);

  useEffect(() => { loadMembers(); }, [companyId]);
  const loadMembers = async () => {
    if (!companyId) return;
    const { data: cm } = await supabase
      .from("company_members")
      .select("user_id")
      .eq("company_id", companyId);
    const ids = (cm ?? []).map((r) => r.user_id);
    if (!ids.length) { setMembers([]); return; }
    const [{ data: profs }, { data: tm }, { data: teams }] = await Promise.all([
      supabase.from("profiles").select("id, display_name").in("id", ids),
      supabase.from("team_members").select("user_id, team_id").in("user_id", ids),
      supabase.from("teams").select("id, name").eq("company_id", companyId),
    ]);
    const teamById = new Map((teams ?? []).map((t) => [t.id, t.name]));
    const teamByUser = new Map((tm ?? []).map((r) => [r.user_id, teamById.get(r.team_id) ?? null]));
    setMembers((profs ?? []).map((p) => ({ id: p.id, display_name: p.display_name, team_name: teamByUser.get(p.id) ?? null })));
  };

  if (active) return <MemberDetail member={active} onBack={() => setActive(null)} companyId={companyId!} />;

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Mitarbeitende</h1>
      <p className="text-sm text-muted-foreground mb-6">Konfiguriere pro Person erlaubte Apps, Arbeitszeiten und Pausen.</p>
      <ul className="space-y-2">
        {members.map((m) => (
          <li key={m.id}>
            <button onClick={() => setActive(m)} className="w-full surface-card p-4 flex items-center gap-3 text-left hover:border-primary/40 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-secondary grid place-items-center text-xs font-semibold">{(m.display_name ?? "?").slice(0, 2).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{m.display_name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{m.team_name ?? "Kein Team"}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
        {members.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Mitarbeitenden im Workspace.</p>}
      </ul>
    </div>
  );
}

function MemberDetail({ member, onBack, companyId }: { member: Member; onBack: () => void; companyId: string }) {
  const [apps, setApps] = useState<{ id: string; app_name: string }[]>([]);
  const [newApp, setNewApp] = useState("");
  const [schedules, setSchedules] = useState<Record<number, { id?: string; start: string; end: string }>>({});
  const [breaks, setBreaks] = useState<{ id: string; label: string; start_time: string; end_time: string }[]>([]);
  const [breakLabel, setBreakLabel] = useState("Mittagspause");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("12:30");

  const load = async () => {
    const [{ data: a }, { data: s }, { data: b }] = await Promise.all([
      supabase.from("user_allowed_apps").select("id, app_name").eq("user_id", member.id).order("app_name"),
      supabase.from("user_work_schedules").select("id, weekday, start_time, end_time").eq("user_id", member.id),
      supabase.from("user_breaks").select("id, label, start_time, end_time").eq("user_id", member.id).order("start_time"),
    ]);
    setApps(a ?? []);
    const map: Record<number, any> = {};
    (s ?? []).forEach((r: any) => { map[r.weekday] = { id: r.id, start: r.start_time?.slice(0, 5) ?? "09:00", end: r.end_time?.slice(0, 5) ?? "17:00" }; });
    setSchedules(map);
    setBreaks(b ?? []);
  };
  useEffect(() => { load(); }, [member.id]);

  const addApp = async () => {
    if (!newApp.trim()) return;
    const { error } = await supabase.from("user_allowed_apps").insert({ company_id: companyId, user_id: member.id, app_name: newApp.trim() });
    if (error) return toast.error(error.message);
    setNewApp(""); load();
  };
  const removeApp = async (id: string) => {
    await supabase.from("user_allowed_apps").delete().eq("id", id);
    load();
  };

  const saveDay = async (weekday: number, start: string, end: string) => {
    const existing = schedules[weekday];
    if (existing?.id) {
      await supabase.from("user_work_schedules").update({ start_time: start, end_time: end }).eq("id", existing.id);
    } else {
      await supabase.from("user_work_schedules").insert({ company_id: companyId, user_id: member.id, weekday, start_time: start, end_time: end });
    }
    toast.success("Arbeitszeit gespeichert"); load();
  };
  const removeDay = async (weekday: number) => {
    const existing = schedules[weekday];
    if (existing?.id) {
      await supabase.from("user_work_schedules").delete().eq("id", existing.id);
      load();
    }
  };

  const addBreak = async () => {
    const { error } = await supabase.from("user_breaks").insert({ company_id: companyId, user_id: member.id, label: breakLabel, start_time: breakStart, end_time: breakEnd });
    if (error) return toast.error(error.message);
    load();
  };
  const removeBreak = async (id: string) => {
    await supabase.from("user_breaks").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Zurück</button>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">{member.display_name ?? "—"}</h1>
      <p className="text-sm text-muted-foreground mb-6">{member.team_name ?? "Kein Team"}</p>

      {/* Allowed Apps */}
      <section className="surface-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3"><AppWindow className="h-4 w-4 text-primary" /><h2 className="font-semibold">Erlaubte Apps</h2></div>
        <p className="text-xs text-muted-foreground mb-3">Standardmäßig ist die Liste leer. Nur freigegebene Apps sind nutzbar.</p>
        <div className="flex gap-2 mb-3">
          <Input value={newApp} onChange={(e) => setNewApp(e.target.value)} placeholder="z. B. Slack, Outlook, Kamera" className="h-10" />
          <Button type="button" onClick={addApp} className="h-10"><Plus className="h-4 w-4" /></Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {apps.map((a) => (
            <li key={a.id} className="inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-sm">
              {a.app_name}
              <button onClick={() => removeApp(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
          {apps.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Apps freigegeben.</p>}
        </ul>
      </section>

      {/* Work Schedule */}
      <section className="surface-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-primary" /><h2 className="font-semibold">Arbeitszeiten</h2></div>
        <p className="text-xs text-muted-foreground mb-3">Außerhalb dieser Zeitfenster wird keine Zeit erfasst.</p>
        <div className="space-y-2">
          {WEEKDAYS.map((d, idx) => {
            const s = schedules[idx];
            return <DayRow key={idx} label={d} start={s?.start ?? ""} end={s?.end ?? ""} active={!!s} onSave={(st, en) => saveDay(idx, st, en)} onRemove={() => removeDay(idx)} />;
          })}
        </div>
      </section>

      {/* Breaks */}
      <section className="surface-card p-5">
        <div className="flex items-center gap-2 mb-3"><Coffee className="h-4 w-4 text-primary" /><h2 className="font-semibold">Pausen</h2></div>
        <p className="text-xs text-muted-foreground mb-3">Während der Pausen wird keine Zeit erfasst.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <Input value={breakLabel} onChange={(e) => setBreakLabel(e.target.value)} placeholder="Bezeichnung" className="h-10 col-span-2 sm:col-span-2" />
          <Input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} className="h-10" />
          <Input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} className="h-10" />
        </div>
        <Button type="button" onClick={addBreak} variant="outline" className="w-full"><Plus className="h-4 w-4 mr-1" /> Pause hinzufügen</Button>
        <ul className="mt-4 space-y-2">
          {breaks.map((b) => (
            <li key={b.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/60">
              <span className="flex-1 text-sm">{b.label}</span>
              <span className="text-sm text-muted-foreground tabular-nums">{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</span>
              <button onClick={() => removeBreak(b.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
          {breaks.length === 0 && <p className="text-sm text-muted-foreground">Keine Pausen konfiguriert.</p>}
        </ul>
      </section>
    </div>
  );
}

function DayRow({ label, start, end, active, onSave, onRemove }: { label: string; start: string; end: string; active: boolean; onSave: (s: string, e: string) => void; onRemove: () => void }) {
  const [s, setS] = useState(start || "09:00");
  const [e, setE] = useState(end || "17:00");
  useEffect(() => { setS(start || "09:00"); setE(end || "17:00"); }, [start, end]);
  return (
    <div className="flex items-center gap-2">
      <Label className="w-8 text-sm">{label}</Label>
      <Input type="time" value={s} onChange={(ev) => setS(ev.target.value)} className="h-9 flex-1" />
      <Input type="time" value={e} onChange={(ev) => setE(ev.target.value)} className="h-9 flex-1" />
      <Button size="sm" variant={active ? "secondary" : "default"} onClick={() => onSave(s, e)} className="h-9">{active ? "Update" : "Setzen"}</Button>
      {active && <Button size="sm" variant="ghost" onClick={onRemove} className="h-9 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
    </div>
  );
}
