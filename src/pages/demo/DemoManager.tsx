import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoBanner from "@/components/demo/DemoBanner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { demoTeams, demoTeamNameKey, demoStats, genYear, MONTH_KEYS } from "@/components/demo/demoData";
import { toast } from "sonner";
import {
  Users, Trophy, Activity, TrendingUp, Sparkles, CalendarRange, UserCog,
  Plus, Settings as Cog, Bell, Shield, Trash2, Mail, CheckCircle2, Smartphone, Globe, FileSpreadsheet,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

const initialMembers = [
  { name: "Anna Berger", email: "anna.berger@beispiel.de", team: "Team Alpha", roleKey: "demo.manager.role.f" },
  { name: "Lukas Schmidt", email: "lukas.schmidt@beispiel.de", team: "Team Alpha", roleKey: "demo.manager.role.m" },
  { name: "Sophie Wagner", email: "sophie.wagner@beispiel.de", team: "Team Beta", roleKey: "demo.manager.role.f" },
  { name: "Jonas Klein", email: "jonas.klein@beispiel.de", team: "Team Beta", roleKey: "demo.manager.role.m" },
  { name: "Mia Hoffmann", email: "mia.hoffmann@beispiel.de", team: "Team Gamma", roleKey: "demo.manager.role.f" },
  { name: "Felix Braun", email: "felix.braun@beispiel.de", team: "Team Gamma", roleKey: "demo.manager.role.m" },
  { name: "Lara Krüger", email: "lara.krueger@beispiel.de", team: "Team Delta", roleKey: "demo.manager.role.f" },
  { name: "Tim Werner", email: "tim.werner@beispiel.de", team: "Team Delta", roleKey: "demo.manager.role.m" },
];

const initialChallenges = [
  { key: "focusWeek", statusKey: "active", rewardKey: "fuelVoucher", progress: 68, daysKey: "daysLeft5" },
  { key: "phoneDiet", statusKey: "planned", rewardKey: "teamLunch", progress: 0, daysKey: "startIn12" },
  { key: "quarterMarathon", statusKey: "finished", rewardKey: "mealVoucher", progress: 100, daysKey: "winnerAlpha" },
];

const demoWhitelist = {
  apps: ["Microsoft Teams", "Slack", "Outlook", "Notion", "Figma"],
  blockedWebsites: ["instagram.com", "tiktok.com", "youtube.com", "x.com", "reddit.com"],
};

export default function DemoManager() {
  const t = useT();
  const [seed, setSeed] = useState(0);
  const monthLabels = useMemo(() => MONTH_KEYS.map((k) => t(k)), [t]);
  const yearData = useMemo(() => genYear(seed, monthLabels), [seed, monthLabels]);

  const statusLabel = (k: string) => t(`demo.manager.challenges.status.${k}`);
  const challengeName = (k: string) => t(`demo.manager.challenges.name.${k}`);
  const challengeReward = (k: string) => t(`demo.manager.challenges.reward.${k}`);
  const challengeDays = (k: string) => t(`demo.manager.challenges.days.${k}`);
  const roleLabel = (k: string) => t(k);

  // Interactive demo state
  const [members, setMembers] = useState(initialMembers);
  const [teamsList, setTeamsList] = useState(demoTeams.map((tm) => ({ id: tm.id, name: tm.name, color: tm.color, members: tm.members, avgMin: tm.avgMin, isOwn: tm.isOwn })));
  const [challenges, setChallenges] = useState(initialChallenges);

  // dialog states
  const [openChallenge, setOpenChallenge] = useState(false);
  const [chName, setChName] = useState("");
  const [chReward, setChReward] = useState("");
  const [chDays, setChDays] = useState("7");

  const [openTeam, setOpenTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("#6366f1");

  const [openInvite, setOpenInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteTeam, setInviteTeam] = useState("Team Alpha");

  const createChallenge = () => {
    if (!chName.trim()) return toast.error(t("demo.manager.toast.nameMissing"));
    setChallenges([{ key: `custom-${Date.now()}`, name: chName, statusKey: "planned", reward: chReward || t("demo.manager.dialog.teamRewardDefault"), progress: 0, days: t("demo.manager.dialog.startInDays", { days: chDays }) } as any, ...challenges]);
    setOpenChallenge(false); setChName(""); setChReward(""); setChDays("7");
    toast.success(t("demo.manager.toast.challengeCreated"));
  };

  const createTeam = () => {
    if (!teamName.trim()) return toast.error(t("demo.manager.toast.nameMissing"));
    setTeamsList([...teamsList, { id: `t-${Date.now()}`, name: teamName, color: teamColor, members: 0, avgMin: 0, isOwn: false }]);
    setOpenTeam(false); setTeamName(""); setTeamColor("#6366f1");
    toast.success(t("demo.manager.toast.teamCreated"));
  };

  const invite = () => {
    if (!inviteName.trim()) return toast.error(t("demo.manager.toast.nameMissing"));
    const slug = inviteName.trim().toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "");
    setMembers([{ name: inviteName, email: `${slug}@beispiel.de`, team: inviteTeam, roleKey: "demo.manager.role.neutral" } as any, ...members]);
    setOpenInvite(false); setInviteName("");
    toast.success(t("demo.manager.toast.invitationSent"));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugify = (s: string) =>
    s.toLowerCase().trim()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/\s+/g, ".").replace(/[^a-z0-9.@_-]/g, "");

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });
      if (!rows.length) return toast.error(t("demo.manager.toast.noRows"));

      const domain = (rows.find((r) => Object.values(r).some((v) => String(v).includes("@")))
        ? (Object.values(rows[0]).map(String).find((v) => v.includes("@")) ?? "").split("@")[1]
        : "") || "firma.de";

      const teamNames = teamsList.map((tm) => tm.name);
      const added = rows.map((r, i) => {
        const vals = Object.entries(r);
        const nameKey = vals.find(([k]) => /name/i.test(k))?.[1] ?? vals[0]?.[1] ?? "";
        const emailKey = vals.find(([k, v]) => /mail/i.test(k) || String(v).includes("@"))?.[1] ?? "";
        const name = String(nameKey).trim();
        if (!name) return null;
        const email = String(emailKey).trim() || `${slugify(name)}@${domain}`;
        const team = teamNames[Math.floor(Math.random() * teamNames.length)] ?? "Team Alpha";
        return { name, email, team, roleKey: "demo.manager.role.neutral" };
      }).filter(Boolean) as { name: string; email: string; team: string; roleKey: string }[];

      if (!added.length) return toast.error(t("demo.manager.toast.noValidNames"));

      setMembers([...added, ...members]);
      setTeamsList(teamsList.map((tm) => ({
        ...tm,
        members: tm.members + added.filter((a) => a.team === tm.name).length,
      })));
      toast.success(t("demo.manager.toast.importSuccess", { count: added.length, teams: teamNames.length }));
    } catch (err) {
      console.error(err);
      toast.error(t("demo.manager.toast.importFailed"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("demo.manager.seo.title")}
        description={t("demo.manager.seo.description")}
        path="/demo/manager"
      />
      <DemoBanner />
      <div className="container py-6 md:py-8 max-w-5xl">
        <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><UserCog className="h-4 w-4" /> {t("demo.manager.header.eyebrow")}</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{t("demo.manager.header.title")}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <LanguageSwitcher compact />
            <Button asChild variant="outline" size="sm"><Link to="/demo/employee">{t("demo.manager.header.employeeView")}</Link></Button>
            <Button onClick={() => setSeed((s) => s + 1)} size="sm">
              <Sparkles className="h-4 w-4 mr-1" /> {t("demo.manager.header.newData")}
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 flex w-full overflow-x-auto">
            <TabsTrigger value="overview"><CalendarRange className="h-4 w-4 mr-1.5" />{t("demo.manager.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="teams"><Users className="h-4 w-4 mr-1.5" />{t("demo.manager.tabs.teams")}</TabsTrigger>
            <TabsTrigger value="challenges"><Trophy className="h-4 w-4 mr-1.5" />{t("demo.manager.tabs.challenges")}</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="h-4 w-4 mr-1.5" />{t("demo.manager.tabs.settings")}</TabsTrigger>
          </TabsList>

          {/* ÜBERSICHT */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Users} label={t("demo.manager.overview.members")} value={demoStats.memberCount.toString()} />
              <Stat icon={Trophy} label={t("demo.manager.overview.teams")} value={String(teamsList.length)} />
            </div>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-1"><Shield className="h-4 w-4 text-primary" /> {t("demo.manager.overview.oneInfoTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t("demo.manager.overview.oneInfoBody")}
              </p>
              <ul className="space-y-3">
                {[
                  { name: t("demo.manager.overview.rewardTeamBlue"), benefit: t("demo.manager.overview.rewardBenefitEarlyLeave") },
                  { name: t("demo.manager.overview.rewardTeamAlpha"), benefit: t("demo.manager.overview.rewardBenefitTeamEvent") },
                ].map((r) => (
                  <li key={r.name} className="rounded-xl border border-success/30 bg-success/5 p-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-success font-medium">{t("demo.manager.overview.rewardUnlocked")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("demo.manager.overview.chosenBenefit", { benefit: r.benefit })}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold mb-3">{t("demo.manager.overview.notVisibleTitle")}</h2>
              <ul className="grid sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm text-muted-foreground">
                {[
                  t("demo.manager.overview.notVisible.names"),
                  t("demo.manager.overview.notVisible.focusTimes"),
                  t("demo.manager.overview.notVisible.usageMinutes"),
                  t("demo.manager.overview.notVisible.teamAverages"),
                  t("demo.manager.overview.notVisible.rankings"),
                  t("demo.manager.overview.notVisible.appsWebsites"),
                  t("demo.manager.overview.notVisible.messages"),
                  t("demo.manager.overview.notVisible.location"),
                  t("demo.manager.overview.notVisible.missedGoal"),
                ].map((x) => <li key={x}>· {x}</li>)}
              </ul>
            </section>
          </TabsContent>


          {/* TEAMS */}
          <TabsContent value="teams" className="space-y-6">
            <section className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t("demo.manager.teams.title")}</h2>
                <Dialog open={openTeam} onOpenChange={setOpenTeam}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />{t("demo.manager.teams.team")}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>{t("demo.manager.teams.newTeam")}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>{t("demo.manager.teams.name")}</Label><Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder={t("demo.manager.teams.namePlaceholder")} /></div>
                      <div><Label>{t("demo.manager.teams.color")}</Label><Input type="color" value={teamColor} onChange={(e) => setTeamColor(e.target.value)} className="h-10 w-20 p-1" /></div>
                    </div>
                    <DialogFooter><Button onClick={createTeam}>{t("demo.manager.teams.create")}</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <ul className="space-y-2">
                {teamsList.map((tm) => (
                  <li key={tm.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
                    <span className="h-8 w-8 rounded-lg grid place-items-center text-xs font-semibold text-white" style={{ background: tm.color }}>{tm.name.slice(0, 2).toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{t(demoTeamNameKey(tm.id))}</p>
                      <p className="text-xs text-muted-foreground">{t("demo.manager.teams.memberCount", { count: tm.members })}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                {t("demo.manager.teams.averagesHidden")}
              </p>

            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                <h2 className="font-semibold">{t("demo.manager.members.title")}</h2>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelImport}
                    className="hidden"
                  />
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileSpreadsheet className="h-4 w-4 mr-1" />{t("demo.manager.members.importExcel")}
                  </Button>
                  <Dialog open={openInvite} onOpenChange={setOpenInvite}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />{t("demo.manager.members.invite")}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{t("demo.manager.members.inviteTitle")}</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <div><Label>{t("demo.manager.teams.name")}</Label><Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder={t("demo.manager.members.inviteNamePlaceholder")} /></div>
                        <div>
                          <Label>{t("demo.manager.members.team")}</Label>
                          <select value={inviteTeam} onChange={(e) => setInviteTeam(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                            {teamsList.map((tm) => <option key={tm.id} value={tm.name}>{tm.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <DialogFooter><Button onClick={invite}>{t("demo.manager.members.invite")}</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="mb-3 rounded-lg bg-primary/5 border border-primary/15 p-3 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t("demo.manager.members.importLabel")}</strong> {t("demo.manager.members.importHint")}
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-primary" /> {t("demo.manager.members.privacyHint")}
              </p>
              <ul className="divide-y divide-border/60">
                {members.map((m, idx) => (
                  <li key={`${m.email}-${idx}`} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold shrink-0">
                      {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.email} · {m.team}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>

          {/* CHALLENGES */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openChallenge} onOpenChange={setOpenChallenge}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("demo.manager.challenges.new")}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{t("demo.manager.challenges.newTitle")}</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>{t("demo.manager.teams.name")}</Label><Input value={chName} onChange={(e) => setChName(e.target.value)} placeholder={t("demo.manager.challenges.namePlaceholder")} /></div>
                    <div><Label>{t("demo.manager.challenges.reward")}</Label><Input value={chReward} onChange={(e) => setChReward(e.target.value)} placeholder={t("demo.manager.challenges.rewardPlaceholder")} /></div>
                    <div><Label>{t("demo.manager.challenges.startInDays")}</Label><Input type="number" min="0" value={chDays} onChange={(e) => setChDays(e.target.value)} /></div>
                  </div>
                  <DialogFooter><Button onClick={createChallenge}>{t("demo.manager.challenges.createBtn")}</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {challenges.map((c: any) => (
              <div key={c.key ?? c.name} className="surface-card p-5">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />{c.key ? challengeName(c.key) : c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.daysKey ? challengeDays(c.daysKey) : c.days}</p>
                  </div>
                  <span className={"text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold " +
                    (c.statusKey === "active" ? "bg-success/15 text-success" : c.statusKey === "planned" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                    {statusLabel(c.statusKey)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3"><span className="text-foreground font-medium">{t("demo.manager.challenges.rewardLabel")}</span> {c.rewardKey ? challengeReward(c.rewardKey) : c.reward}</p>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full gradient-primary transition-all" style={{ width: c.progress + "%" }} />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* EINSTELLUNGEN */}
          <TabsContent value="settings" className="space-y-6">
            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-primary" />{t("demo.manager.settings.workspace")}</h2>
              <Field label={t("demo.manager.settings.companyName")} value="Beispiel GmbH" />
              <Field label={t("demo.manager.settings.industry")} value={t("demo.manager.settings.industryValue")} />
              <Field label={t("demo.manager.settings.plan")} value={t("demo.manager.settings.planValue")} />
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Smartphone className="h-4 w-4 text-primary" />{t("demo.manager.settings.allowedApps")}</h2>
              <div className="flex flex-wrap gap-2">
                {demoWhitelist.apps.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-destructive" />{t("demo.manager.settings.blockedSites")}</h2>
              <div className="flex flex-wrap gap-2">
                {demoWhitelist.blockedWebsites.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    {w}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" />{t("demo.manager.settings.notifications")}</h2>
              <ToggleRow label={t("demo.manager.settings.weeklyReport")} on />
              <ToggleRow label={t("demo.manager.settings.challengeUpdates")} on />
              <ToggleRow label={t("demo.manager.settings.notableTrends")} />
            </section>

            <section className="surface-card p-5 md:p-6 border-destructive/30">
              <h2 className="font-semibold flex items-center gap-2 mb-2 text-destructive"><Trash2 className="h-4 w-4" />{t("demo.manager.settings.dangerZone")}</h2>
              <p className="text-xs text-muted-foreground mb-3">{t("demo.manager.settings.dangerZoneDesc")}</p>
              <Button variant="outline" size="sm" className="border-destructive/40 text-destructive">{t("demo.manager.settings.deleteWorkspace")}</Button>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, small }: any) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Icon className="h-4 w-4" /> {label}</div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      {small && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{small}</p>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function ToggleRow({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="text-sm">{label}</span>
      <span className={"relative inline-flex h-5 w-9 rounded-full transition-colors " + (on ? "bg-primary" : "bg-secondary")}>
        <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all " + (on ? "left-[18px]" : "left-0.5")} />
      </span>
    </div>
  );
}
