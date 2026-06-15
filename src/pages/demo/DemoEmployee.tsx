import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoBanner from "@/components/demo/DemoBanner";
import { demoTeams, genWeek } from "@/components/demo/demoData";
import {
  Trophy, Smartphone, TrendingDown, Lock, Sparkles, Users, Home,
  BarChart3, Settings as Cog, Bell, CheckCircle2, Globe, Shield, Clock,
  Timer, ScanLine, MoonStar,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell, Area, AreaChart } from "recharts";

const monthSeries = Array.from({ length: 30 }).map((_, i) => ({
  d: i + 1, mins: Math.round(110 + Math.sin(i * 0.45) * 20 - i * 0.6),
}));

const allowedApps = ["Microsoft Teams", "Slack", "Outlook", "Notion"];
const allowedSites = ["github.com", "linear.app", "company-wiki.de"];

export default function DemoEmployee() {
  const [seed, setSeed] = useState(0);
  const week = useMemo(() => genWeek(seed), [seed]);
  const ownRank = demoTeams.findIndex((t) => t.isOwn) + 1 || 3;

  return (
    <div className="min-h-screen bg-background pb-12">
      <DemoBanner />
      <div className="px-4 sm:px-5 max-w-3xl mx-auto">
        <header className="pt-6 pb-3 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> Mitarbeiter-Demo</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Hallo Alex</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/demo/manager">Manager-Sicht</Link></Button>
            <Button size="sm" onClick={() => setSeed((s) => s + 1)}>
              <Sparkles className="h-4 w-4 mr-1" /> Neue Demo-Daten
            </Button>
          </div>
        </header>

        <Tabs defaultValue="home" className="w-full mt-2">
          <TabsList className="mb-5 flex w-full overflow-x-auto">
            <TabsTrigger value="home"><Home className="h-4 w-4 mr-1.5" />Heute</TabsTrigger>
            <TabsTrigger value="stats"><BarChart3 className="h-4 w-4 mr-1.5" />Statistik</TabsTrigger>
            <TabsTrigger value="teams"><Trophy className="h-4 w-4 mr-1.5" />Teams</TabsTrigger>
            <TabsTrigger value="features"><Sparkles className="h-4 w-4 mr-1.5" />Features</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="h-4 w-4 mr-1.5" />Einstellungen</TabsTrigger>
          </TabsList>

          {/* HEUTE */}
          <TabsContent value="home" className="space-y-4">
            <div className="surface-card p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-10 blur-2xl" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Bildschirmzeit heute</p>
              <p className="text-5xl font-semibold tracking-tight mt-2">1 Std 36 Min</p>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-success font-medium">22 Min weniger</span>
                <span className="text-muted-foreground">als gestern</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Smartphone className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Strafzeit</span></div>
                <p className="text-2xl font-semibold">14 Min</p>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Team-Platz</span></div>
                <p className="text-2xl font-semibold">{ownRank}. von {demoTeams.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold">Deine Privatsphäre ist geschützt 🔒</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Nur du</strong> siehst deine persönlichen Daten.
                  Dein Manager erhält ausschließlich <strong className="text-foreground">anonyme Team-Aggregate</strong>.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* STATISTIK */}
          <TabsContent value="stats" className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Diese Woche</h2>
                <span className="text-xs text-muted-foreground">Bildschirmminuten</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", radius: 12 }} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`${v} min`, "Zeit"]} labelFormatter={() => ""} />
                    <Bar dataKey="mins" radius={[8, 8, 8, 8]}>
                      {week.map((_, i) => <Cell key={i} fill={i === week.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Letzte 30 Tage</h2>
                <span className="text-xs text-success font-medium flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Trend fallend</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthSeries}>
                    <defs>
                      <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="mins" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#empGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Mini icon={Clock} label="Fokus-Zeit Ø" value="5,2 h" />
              <Mini icon={Smartphone} label="Unlocks Ø" value="42" />
              <Mini icon={Trophy} label="Streak" value="7 Tage" />
            </div>
          </TabsContent>

          {/* TEAMS */}
          <TabsContent value="teams" className="space-y-4">
            <h2 className="font-semibold px-1">Team-Ranking heute</h2>
            <div className="surface-card divide-y divide-border/60">
              {[...demoTeams].sort((a, b) => a.avgMin - b.avgMin).map((t, i) => (
                <div key={t.id} className={"flex items-center gap-3 p-4 " + (t.isOwn ? "bg-primary/5" : "")}>
                  <div className="w-7 text-center">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-sm text-muted-foreground">{i + 1}.</span>}
                  </div>
                  <div className="h-10 w-10 rounded-lg grid place-items-center text-xs font-semibold text-white shrink-0" style={{ background: t.color }}>
                    {t.name.slice(5, 7).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{t.name} {t.isOwn && <span className="text-xs text-primary ml-1">(Dein Team)</span>}</p>
                    <p className="text-xs text-muted-foreground">Ø {t.avgMin} Min · {t.members} Mitglieder</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-card p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-3"><Trophy className="h-4 w-4 text-primary" />Aktive Challenge</h3>
              <p className="text-sm font-medium">Fokus-Woche</p>
              <p className="text-xs text-muted-foreground mb-3">Belohnung: 1 Std. früher Feierabend Freitag · 5 Tage übrig</p>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full gradient-primary" style={{ width: "68%" }} />
              </div>
            </div>
          </TabsContent>

          {/* FEATURES */}
          <TabsContent value="features" className="space-y-3">
            <div className="surface-card p-5">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Anti-Sucht Werkzeuge</p>
              <h2 className="text-xl font-semibold tracking-tight">Werde weniger abhängig vom Handy.</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Optionale Features – aktiviere nur, was zu dir passt. Alles freiwillig.
              </p>
            </div>
            <FeatureCard icon={Timer} title="30-Sek Öffnungs-Timer" desc="Bevor sich Instagram, TikTok & Co. öffnen, läuft ein kurzer Timer. So gewinnst du Zeit zur bewussten Entscheidung." on tag="Beliebt" />
            <FeatureCard icon={ScanLine} title="Physische NFC-Sperre (Brick)" desc="Social-Apps öffnen sich nur, wenn du deinen Brick (NFC-Chip) aktiv mit dem Handy berührst." on tag="Brick kompatibel" />
            <FeatureCard icon={MoonStar} title="Graustufen während der Arbeit" desc="Dein Handy wird automatisch grau – bunte Reize verlieren ihre Anziehungskraft." />
            <FeatureCard icon={Clock} title="Scroll-Stopper nach 2 Minuten" desc="Sanfte Erinnerung, sobald du länger als 2 Minuten in einer Social-App bist." />
          </TabsContent>

          {/* EINSTELLUNGEN */}
          <TabsContent value="settings" className="space-y-4">
            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-primary" />Profil</h2>
              <Field label="Name" value="Alex Beispiel" />
              <Field label="E-Mail" value="alex@beispiel-gmbh.de" />
              <Field label="Team" value="Team Gamma" />
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Smartphone className="h-4 w-4 text-primary" />Erlaubte Apps</h2>
              <div className="flex flex-wrap gap-2">
                {allowedApps.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-primary" />Erlaubte Websites</h2>
              <div className="flex flex-wrap gap-2">
                {allowedSites.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">{w}</span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" />Benachrichtigungen</h2>
              <ToggleRow label="Tägliche Zusammenfassung" on />
              <ToggleRow label="Challenge-Erinnerungen" on />
              <ToggleRow label="Team-Ranking" />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: any) {
  return (
    <div className="surface-card p-3 text-center">
      <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
      <p className="text-base font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
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

function FeatureCard({ icon: Icon, title, desc, on, tag }: { icon: any; title: string; desc: string; on?: boolean; tag?: string }) {
  return (
    <div className={`surface-card p-4 ${on ? "border-primary/40 bg-primary/[0.03]" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-xl grid place-items-center ${on ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">{title}</h3>
            {tag && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{tag}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <ToggleRow label="" on={on} />
      </div>
    </div>
  );
}
