import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, AppWindow, Globe, Smartphone, ShieldCheck, Ban } from "lucide-react";
import { useT } from "@/i18n";

interface Row { id: string; }
interface AppRow extends Row { app_name: string; }
interface WebRow extends Row { domain: string; }
interface PhoneTime extends Row { label: string; start_time: string; end_time: string; }

export default function ManagerRules() {
  const t = useT();
  const { companyId } = useAuth();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [websites, setWebsites] = useState<WebRow[]>([]);
  const [phoneTimes, setPhoneTimes] = useState<PhoneTime[]>([]);

  const [newApp, setNewApp] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [ptLabel, setPtLabel] = useState(t("manager.rules.default_break_label"));
  const [ptStart, setPtStart] = useState("12:00");
  const [ptEnd, setPtEnd] = useState("12:30");

  const load = async () => {
    if (!companyId) return;
    const [{ data: a }, { data: w }, { data: pt }] = await Promise.all([
      supabase.from("whitelisted_apps").select("id, app_name").eq("company_id", companyId).order("app_name"),
      supabase.from("blocked_websites").select("id, domain").eq("company_id", companyId).order("domain"),
      supabase.from("free_phone_times").select("id, label, start_time, end_time").eq("company_id", companyId).order("start_time"),
    ]);
    setApps(a ?? []); setWebsites(w ?? []); setPhoneTimes(pt ?? []);
  };
  useEffect(() => { load(); }, [companyId]);

  const addApp = async () => {
    if (!newApp.trim() || !companyId) return;
    const { error } = await supabase.from("whitelisted_apps").insert({ company_id: companyId, app_name: newApp.trim() });
    if (error) return toast.error(error.message);
    setNewApp(""); toast.success(t("manager.rules.app_approved")); load();
  };
  const removeApp = async (id: string) => { await supabase.from("whitelisted_apps").delete().eq("id", id); load(); };

  const addWebsite = async () => {
    if (!newDomain.trim() || !companyId) return;
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const { error } = await supabase.from("blocked_websites").insert({ company_id: companyId, domain: clean });
    if (error) return toast.error(error.message);
    setNewDomain(""); toast.success(t("manager.rules.website_blocked")); load();
  };
  const removeWebsite = async (id: string) => { await supabase.from("blocked_websites").delete().eq("id", id); load(); };

  const addPhoneTime = async () => {
    if (!companyId) return;
    const { error } = await supabase.from("free_phone_times").insert({ company_id: companyId, label: ptLabel, start_time: ptStart, end_time: ptEnd });
    if (error) return toast.error(error.message);
    toast.success(t("manager.rules.phone_time_added")); load();
  };
  const removePhoneTime = async (id: string) => { await supabase.from("free_phone_times").delete().eq("id", id); load(); };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{t("manager.rules.title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("manager.rules.subtitle")}</p>

      <section className="surface-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-1"><AppWindow className="h-4 w-4 text-primary" /><h2 className="font-semibold">{t("manager.rules.apps_title")}</h2></div>
        <p className="text-xs text-muted-foreground mb-3">{t("manager.rules.apps_desc")}</p>
        <div className="flex gap-2 mb-3">
          <Input value={newApp} onChange={(e) => setNewApp(e.target.value)} placeholder={t("manager.rules.apps_placeholder")} className="h-10" />
          <Button onClick={addApp} className="h-10"><Plus className="h-4 w-4" /></Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {apps.map((a) => (
            <li key={a.id} className="inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-sm">
              {a.app_name}
              <button onClick={() => removeApp(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
          {apps.length === 0 && <p className="text-sm text-muted-foreground">{t("manager.rules.apps_empty")}</p>}
        </ul>
      </section>

      <section className="surface-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-1"><Ban className="h-4 w-4 text-destructive" /><h2 className="font-semibold">{t("manager.rules.websites_title")}</h2></div>
        <p className="text-xs text-muted-foreground mb-3">{t("manager.rules.websites_desc")}</p>
        <div className="flex gap-2 mb-3">
          <Input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder={t("manager.rules.websites_placeholder")} className="h-10" />
          <Button onClick={addWebsite} className="h-10"><Plus className="h-4 w-4" /></Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {websites.map((w) => (
            <li key={w.id} className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3 py-1.5 text-sm font-mono">
              {w.domain}
              <button onClick={() => removeWebsite(w.id)} className="text-destructive/70 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
          {websites.length === 0 && <p className="text-sm text-muted-foreground">{t("manager.rules.websites_empty")}</p>}
        </ul>
      </section>

      <section className="surface-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-1"><Smartphone className="h-4 w-4 text-primary" /><h2 className="font-semibold">{t("manager.rules.phone_times_title")}</h2></div>
        <p className="text-xs text-muted-foreground mb-3">{t("manager.rules.phone_times_desc")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <Input value={ptLabel} onChange={(e) => setPtLabel(e.target.value)} placeholder={t("manager.rules.phone_times_label_placeholder")} className="h-10 col-span-2" />
          <Input type="time" value={ptStart} onChange={(e) => setPtStart(e.target.value)} className="h-10" />
          <Input type="time" value={ptEnd} onChange={(e) => setPtEnd(e.target.value)} className="h-10" />
        </div>
        <Button onClick={addPhoneTime} variant="outline" className="w-full"><Plus className="h-4 w-4 mr-1" /> {t("manager.rules.phone_times_add")}</Button>
        <ul className="mt-4 space-y-2">
          {phoneTimes.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/60">
              <span className="flex-1 text-sm">{p.label}</span>
              <span className="text-sm text-muted-foreground tabular-nums">{p.start_time?.slice(0,5)} – {p.end_time?.slice(0,5)}</span>
              <button onClick={() => removePhoneTime(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
          {phoneTimes.length === 0 && <p className="text-sm text-muted-foreground">{t("manager.rules.phone_times_empty")}</p>}
        </ul>
      </section>

      <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("manager.rules.footer_note_pre")} <strong>{t("manager.rules.footer_note_strong")}</strong> {t("manager.rules.footer_note_post")}
        </p>
      </div>
    </div>
  );
}
