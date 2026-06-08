import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoBanner from "@/components/demo/DemoBanner";
import { demoTeams, demoStats, genYear } from "@/components/demo/demoData";
import {
  Users, Trophy, Activity, TrendingDown, Sparkles, CalendarRange, UserCog,
  Plus, Settings as Cog, Bell, Shield, Trash2, Mail, CheckCircle2, Smartphone, Globe,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Realistische Mock-Mitarbeitende
const demoMembers = [
  { name: "Anna Berger", team: "Team Alpha", min: 78, role: "Mitarbeiterin" },
  { name: "Lukas Schmidt", team: "Team Alpha", min: 92, role: "Mitarbeiter" },
  { name: "Sophie Wagner", team: "Team Beta", min: 104, role: "Mitarbeiterin" },
  { name: "Jonas Klein", team: "Team Beta", min: 99, role: "Mitarbeiter" },
  { name: "Mia Hoffmann", team: "Team Gamma", min: 112, role: "Mitarbeiterin" },
  { name: "Felix Braun", team: "Team Gamma", min: 121, role: "Mitarbeiter" },
  { name: "Lara Krüger", team: "Team Delta", min: 138, role: "Mitarbeiterin" },
  { name: "Tim Werner", team: "Team Delta", min: 129, role: "Mitarbeiter" },
];

const demoChallenges = [
  { name: "Fokus-Woche", status: "Aktiv", reward: "1 Std. früher Feierabend Freitag", progress: 68, days: "5 Tage übrig" },
  { name: "Handy-Diät", status: "Geplant", reward: "Bezahltes Team-Mittagessen", progress: 0, days: "Start in 12 Tagen" },
  { name: "Quartals-Marathon", status: "Beendet", reward: "Essensgutschein 50 €", progress: 100, days: "Gewinner: Team Alpha" },
];

const demoWhitelist = {
  apps: ["Microsoft Teams", "Slack", "Outlook", "Notion", "Figma"],
  websites: ["github.com", "linear.app", "company-wiki.de"],
};

export default function DemoManager() {
  const [seed, setSeed] = useState(0);
  const yearData = useMemo(() => genYear(seed), [seed]);
  const first = yearData[0].avgMinutes;
  const last = yearData[yearData.length - 1].avgMinutes;
  const diffMin = first - last;
  const hoursPerMonth = Math.round(((diffMin * 22) / 60) * 10) / 10;
  const pct = Math.round((diffMin / first) * 100);

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <div className="container py-6 md:py-8 max-w-5xl">
        <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><UserCog className="h-4 w-4" /> Manager-Demo</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Workspace „Beispiel GmbH"</h1>
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
              <Stat icon={Trophy} label="Teams" value="4" />
              <Stat icon={Activity} label="Aktive Challenge" value="Läuft" small="Fokus-Woche" />
              <Stat icon={TrendingDown} label="Ø Ablenkung heute" value={`${Math.round(demoTeams.reduce((s, t) => s + t.avgMin, 0) / demoTeams.length)} min`} />
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
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />Team</Button>
              </div>
              <ul className="space-y-2">
                {[...demoTeams].sort((a, b) => a.avgMin - b.avgMin).map((t, i) => (
                  <li key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
                    <span className="w-6 text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                    <span className="h-8 w-8 rounded-lg grid place-items-center text-xs font-semibold text-white" style={{ background: t.color }}>{t.name.slice(5, 7).toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.members} Mitglieder</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{t.avgMin} min</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Mitarbeitende</h2>
                <Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />Einladen</Button>
              </div>
              <ul className="divide-y divide-border/60">
                {demoMembers.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
                      {m.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.team} · {m.role}</p>
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">Ø {m.min} min</span>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>

          {/* CHALLENGES */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Neue Challenge</Button>
            </div>
            {demoChallenges.map((c) => (
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
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-primary" />Erlaubte Websites</h2>
              <div className="flex flex-wrap gap-2">
                {demoWhitelist.websites.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
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
