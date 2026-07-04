import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoBanner from "@/components/demo/DemoBanner";
import { demoTeams, demoStats, genYear } from "@/components/demo/demoData";
import { toast } from "sonner";
import {
  Users, Trophy, Activity, TrendingDown, Sparkles, CalendarRange, UserCog,
  Plus, Settings as Cog, Bell, Shield, Trash2, Mail, CheckCircle2, Smartphone, Globe, FileSpreadsheet,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";

const initialMembers = [
  { name: "Anna Berger", email: "anna.berger@beispiel.de", team: "Team Alpha", role: "Mitarbeiterin" },
  { name: "Lukas Schmidt", email: "lukas.schmidt@beispiel.de", team: "Team Alpha", role: "Mitarbeiter" },
  { name: "Sophie Wagner", email: "sophie.wagner@beispiel.de", team: "Team Beta", role: "Mitarbeiterin" },
  { name: "Jonas Klein", email: "jonas.klein@beispiel.de", team: "Team Beta", role: "Mitarbeiter" },
  { name: "Mia Hoffmann", email: "mia.hoffmann@beispiel.de", team: "Team Gamma", role: "Mitarbeiterin" },
  { name: "Felix Braun", email: "felix.braun@beispiel.de", team: "Team Gamma", role: "Mitarbeiter" },
  { name: "Lara Krüger", email: "lara.krueger@beispiel.de", team: "Team Delta", role: "Mitarbeiterin" },
  { name: "Tim Werner", email: "tim.werner@beispiel.de", team: "Team Delta", role: "Mitarbeiter" },
];

const initialChallenges = [
  { name: "Fokus-Woche", status: "Aktiv", reward: "1 Std. früher Feierabend Freitag", progress: 68, days: "5 Tage übrig" },
  { name: "Handy-Diät", status: "Geplant", reward: "Bezahltes Team-Mittagessen", progress: 0, days: "Start in 12 Tagen" },
  { name: "Quartals-Marathon", status: "Beendet", reward: "Essensgutschein 50 €", progress: 100, days: "Gewinner: Team Alpha" },
];

const demoWhitelist = {
  apps: ["Microsoft Teams", "Slack", "Outlook", "Notion", "Figma"],
  blockedWebsites: ["instagram.com", "tiktok.com", "youtube.com", "x.com", "reddit.com"],
};

export default function DemoManager() {
  const [seed, setSeed] = useState(0);
  const yearData = useMemo(() => genYear(seed), [seed]);
  const first = yearData[0].avgMinutes;
  const last = yearData[yearData.length - 1].avgMinutes;
  const diffMin = first - last;
  const hoursPerMonth = Math.round(((diffMin * 22) / 60) * 10) / 10;
  const pct = Math.round((diffMin / first) * 100);

  // Interactive demo state
  const [members, setMembers] = useState(initialMembers);
  const [teamsList, setTeamsList] = useState(demoTeams.map((t) => ({ id: t.id, name: t.name, color: t.color, members: t.members, avgMin: t.avgMin, isOwn: t.isOwn })));
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
    if (!chName.trim()) return toast.error("Name fehlt");
    setChallenges([{ name: chName, status: "Geplant", reward: chReward || "Team-Belohnung", progress: 0, days: `Start in ${chDays} Tagen` }, ...challenges]);
    setOpenChallenge(false); setChName(""); setChReward(""); setChDays("7");
    toast.success("Challenge erstellt");
  };

  const createTeam = () => {
    if (!teamName.trim()) return toast.error("Name fehlt");
    setTeamsList([...teamsList, { id: `t-${Date.now()}`, name: teamName, color: teamColor, members: 0, avgMin: 0, isOwn: false }]);
    setOpenTeam(false); setTeamName(""); setTeamColor("#6366f1");
    toast.success("Team angelegt");
  };

  const invite = () => {
    if (!inviteName.trim()) return toast.error("Name fehlt");
    const slug = inviteName.trim().toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "");
    setMembers([{ name: inviteName, email: `${slug}@beispiel.de`, team: inviteTeam, role: "Mitarbeiter:in" }, ...members]);
    setOpenInvite(false); setInviteName("");
    toast.success("Einladung verschickt");
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
      if (!rows.length) return toast.error("Datei enthält keine Zeilen");

      const domain = (rows.find((r) => Object.values(r).some((v) => String(v).includes("@")))
        ? (Object.values(rows[0]).map(String).find((v) => v.includes("@")) ?? "").split("@")[1]
        : "") || "firma.de";

      const teamNames = teamsList.map((t) => t.name);
      const added = rows.map((r, i) => {
        const vals = Object.entries(r);
        const nameKey = vals.find(([k]) => /name/i.test(k))?.[1] ?? vals[0]?.[1] ?? "";
        const emailKey = vals.find(([k, v]) => /mail/i.test(k) || String(v).includes("@"))?.[1] ?? "";
        const name = String(nameKey).trim();
        if (!name) return null;
        const email = String(emailKey).trim() || `${slugify(name)}@${domain}`;
        const team = teamNames[Math.floor(Math.random() * teamNames.length)] ?? "Team Alpha";
        return { name, email, team, role: "Mitarbeiter:in" };
      }).filter(Boolean) as { name: string; email: string; team: string; role: string }[];

      if (!added.length) return toast.error("Keine gültigen Namen gefunden");

      setMembers([...added, ...members]);
      setTeamsList(teamsList.map((t) => ({
        ...t,
        members: t.members + added.filter((a) => a.team === t.name).length,
      })));
      toast.success(`${added.length} Mitarbeitende importiert & zufällig auf ${teamNames.length} Teams verteilt`);
    } catch (err) {
      console.error(err);
      toast.error("Datei konnte nicht gelesen werden");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Manager-Demo – Team Focus Dashboard ausprobieren"
        description="Interaktive Demo des Team Focus Manager-Dashboards: Team-Aggregate, Challenges und Workspace-Einstellungen ohne Anmeldung erleben."
        path="/demo/manager"
      />
      <DemoBanner />
      <div className="container py-6 md:py-8 max-w-5xl">
        <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><UserCog className="h-4 w-4" /> Manager-Demo</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Manager Dashboard Demo</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/demo/employee">Mitarbeiter-Sicht</Link></Button>
            <Button onClick={() => setSeed((s) => s + 1)} size="sm">
              <Sparkles className="h-4 w-4 mr-1" /> Neue Demo-Daten
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 flex w-full overflow-x-auto">
            <TabsTrigger value="overview"><CalendarRange className="h-4 w-4 mr-1.5" />Übersicht</TabsTrigger>
            <TabsTrigger value="teams"><Users className="h-4 w-4 mr-1.5" />Teams</TabsTrigger>
            <TabsTrigger value="challenges"><Trophy className="h-4 w-4 mr-1.5" />Challenges</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="h-4 w-4 mr-1.5" />Einstellungen</TabsTrigger>
          </TabsList>

          {/* ÜBERSICHT */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={Users} label="Mitarbeitende" value={demoStats.memberCount.toString()} />
              <Stat icon={Trophy} label="Teams" value={String(teamsList.length)} />
              <Stat icon={Activity} label="Aktive Challenge" value="Läuft" small={challenges.find(c => c.status === "Aktiv")?.name ?? "—"} />
              <Stat icon={TrendingDown} label="Ø Ablenkung heute" value={`${Math.round(teamsList.reduce((s, t) => s + t.avgMin, 0) / Math.max(1, teamsList.length))} min`} />
            </div>

            <section className="surface-card p-5 md:p-6">
              <div className="mb-4">
                <h2 className="font-semibold flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" /> Jahresüberblick</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Bildschirmzeit Ø pro Mitarbeitendem · klar fallend</p>
              </div>
              <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20 p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Seit Einführung von TeamFocus</p>
                <p className="text-3xl md:text-4xl font-semibold tracking-tight">−{hoursPerMonth} Std / Monat</p>
                <p className="text-sm text-muted-foreground mt-2">{pct}% weniger Bildschirmzeit ({first} → {last} Min/Tag).</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearData}>
                    <defs>
                      <linearGradient id="dmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`${v} min`, "Ø Bildschirmzeit"]} />
                    <Area type="monotone" dataKey="avgMinutes" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#dmGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </TabsContent>

          {/* TEAMS */}
          <TabsContent value="teams" className="space-y-6">
            <section className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Team-Ranking heute</h2>
                <Dialog open={openTeam} onOpenChange={setOpenTeam}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />Team</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Neues Team</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Name</Label><Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="z. B. Vertrieb" /></div>
                      <div><Label>Farbe</Label><Input type="color" value={teamColor} onChange={(e) => setTeamColor(e.target.value)} className="h-10 w-20 p-1" /></div>
                    </div>
                    <DialogFooter><Button onClick={createTeam}>Anlegen</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <ul className="space-y-2">
                {[...teamsList].sort((a, b) => a.avgMin - b.avgMin).map((t, i) => (
                  <li key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
                    <span className="w-6 text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                    <span className="h-8 w-8 rounded-lg grid place-items-center text-xs font-semibold text-white" style={{ background: t.color }}>{t.name.slice(0, 2).toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.members} Mitglieder</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">Ø {t.avgMin} min</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Mitarbeitende</h2>
                <Dialog open={openInvite} onOpenChange={setOpenInvite}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />Einladen</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Person einladen</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Name</Label><Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Vor- und Nachname" /></div>
                      <div>
                        <Label>Team</Label>
                        <select value={inviteTeam} onChange={(e) => setInviteTeam(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                          {teamsList.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <DialogFooter><Button onClick={invite}>Einladen</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-primary" /> Individuelle Bildschirmzeiten sind <strong>nie</strong> sichtbar – nur Team-Aggregate.
              </p>
              <ul className="divide-y divide-border/60">
                {members.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
                      {m.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.team} · {m.role}</p>
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
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />Neue Challenge</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Neue Challenge</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Name</Label><Input value={chName} onChange={(e) => setChName(e.target.value)} placeholder="z. B. Fokus-Sprint" /></div>
                    <div><Label>Belohnung</Label><Input value={chReward} onChange={(e) => setChReward(e.target.value)} placeholder="z. B. Team-Frühstück" /></div>
                    <div><Label>Start in (Tagen)</Label><Input type="number" min="0" value={chDays} onChange={(e) => setChDays(e.target.value)} /></div>
                  </div>
                  <DialogFooter><Button onClick={createChallenge}>Erstellen</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {challenges.map((c) => (
              <div key={c.name} className="surface-card p-5">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />{c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.days}</p>
                  </div>
                  <span className={"text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold " +
                    (c.status === "Aktiv" ? "bg-success/15 text-success" : c.status === "Geplant" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3"><span className="text-foreground font-medium">Belohnung:</span> {c.reward}</p>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full gradient-primary transition-all" style={{ width: c.progress + "%" }} />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* EINSTELLUNGEN */}
          <TabsContent value="settings" className="space-y-6">
            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-primary" />Workspace</h2>
              <Field label="Firmenname" value="Beispiel GmbH" />
              <Field label="Branche" value="Logistik" />
              <Field label="Plan" value="Jährlich · 35 Sitze" />
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Smartphone className="h-4 w-4 text-primary" />Erlaubte Apps</h2>
              <div className="flex flex-wrap gap-2">
                {demoWhitelist.apps.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-destructive" />Blockierte Websites</h2>
              <div className="flex flex-wrap gap-2">
                {demoWhitelist.blockedWebsites.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    {w}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" />Benachrichtigungen</h2>
              <ToggleRow label="Wöchentlicher Report per E-Mail" on />
              <ToggleRow label="Challenge-Updates" on />
              <ToggleRow label="Auffällige Trends" />
            </section>

            <section className="surface-card p-5 md:p-6 border-destructive/30">
              <h2 className="font-semibold flex items-center gap-2 mb-2 text-destructive"><Trash2 className="h-4 w-4" />Gefahrenzone</h2>
              <p className="text-xs text-muted-foreground mb-3">Workspace und alle Daten unwiderruflich löschen.</p>
              <Button variant="outline" size="sm" className="border-destructive/40 text-destructive">Workspace löschen</Button>
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
