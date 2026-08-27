import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoBanner from "@/components/demo/DemoBanner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { demoTeams, demoTeamNameKey, genWeek, DAY_KEYS } from "@/components/demo/demoData";
import {
  Trophy, Smartphone, TrendingDown, TrendingUp, Lock, Sparkles, Users, Home,
  BarChart3, Settings as Cog, Bell, CheckCircle2, Globe, Shield, Clock,
  Timer, ScanLine, MoonStar,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell, Area, AreaChart } from "recharts";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

const monthSeries = Array.from({ length: 30 }).map((_, i) => ({
  d: i + 1, mins: Math.round(300 + Math.sin(i * 0.45) * 18 + i * 1.6),
}));

const allowedApps = ["Microsoft Teams", "Slack", "Outlook", "Notion"];
const blockedSites = ["instagram.com", "tiktok.com", "youtube.com", "x.com"];

export default function DemoEmployee() {
  const t = useT();
  const [seed, setSeed] = useState(0);
  const dayLabels = useMemo(() => DAY_KEYS.map((k) => t(k)), [t]);
  const week = useMemo(() => genWeek(seed, dayLabels), [seed, dayLabels]);
  const ownRank = demoTeams.findIndex((tm) => tm.isOwn) + 1 || 3;

  return (
    <div className="min-h-screen bg-background pb-12">
      <Seo
        title={t("demo.employee.seo.title")}
        description={t("demo.employee.seo.description")}
        path="/demo/employee"
      />
      <DemoBanner />
      <div className="px-4 sm:px-5 max-w-3xl mx-auto">
        <header className="pt-6 pb-3 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> {t("demo.employee.header.eyebrow")}</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{t("demo.employee.header.title")}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <LanguageSwitcher compact />
            <Button asChild variant="outline" size="sm"><Link to="/demo/manager">{t("demo.employee.header.managerView")}</Link></Button>
            <Button size="sm" onClick={() => setSeed((s) => s + 1)}>
              <Sparkles className="h-4 w-4 mr-1" /> {t("demo.employee.header.newData")}
            </Button>
          </div>
        </header>

        <Tabs defaultValue="home" className="w-full mt-2">
          <TabsList className="mb-5 flex w-full overflow-x-auto">
            <TabsTrigger value="home"><Home className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.today")}</TabsTrigger>
            <TabsTrigger value="stats"><BarChart3 className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.stats")}</TabsTrigger>
            <TabsTrigger value="teams"><Trophy className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.teams")}</TabsTrigger>
            <TabsTrigger value="features"><Sparkles className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.features")}</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.settings")}</TabsTrigger>
          </TabsList>

          {/* HEUTE */}
          <TabsContent value="home" className="space-y-4">
            <div className="surface-card p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-10 blur-2xl" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t("demo.employee.home.focusTimeToday")}</p>
              <p className="text-5xl font-semibold tracking-tight mt-2">{t("demo.employee.home.focusTimeValue")}</p>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success font-medium">{t("demo.employee.home.moreMinutes")}</span>
                <span className="text-muted-foreground">{t("demo.employee.home.thanYesterday")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Smartphone className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{t("demo.employee.home.deductedTime")}</span></div>
                <p className="text-2xl font-semibold">{t("demo.employee.home.deductedValue")}</p>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{t("demo.employee.home.teamRank")}</span></div>
                <p className="text-2xl font-semibold">{t("demo.employee.home.teamRankValue", { rank: ownRank, total: demoTeams.length })}</p>
              </div>
            </div>


            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold">{t("demo.employee.home.privacyTitle")}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{t("demo.employee.home.privacyOnlyYou")}</strong> {t("demo.employee.home.privacySeesData")}
                  {" "}{t("demo.employee.home.privacyManagerGets")} <strong className="text-foreground">{t("demo.employee.home.privacyAnonymData")}</strong>
                </p>
              </div>
            </div>
          </TabsContent>

          {/* STATISTIK */}
          <TabsContent value="stats" className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t("demo.employee.stats.thisWeek")}</h2>
                <span className="text-xs text-muted-foreground">{t("demo.employee.stats.focusMinutes")}</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", radius: 12 }} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`${v} ${t("demo.employee.stats.tooltipUnit")}`, t("demo.employee.stats.tooltipLabel")]} labelFormatter={() => ""} />
                    <Bar dataKey="mins" radius={[8, 8, 8, 8]}>
                      {week.map((_, i) => <Cell key={i} fill={i === week.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t("demo.employee.stats.last30days")}</h2>
                <span className="text-xs text-success font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {t("demo.employee.stats.trendUp")}</span>
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
              <Mini icon={Clock} label={t("demo.employee.stats.avgFocusTime")} value={t("demo.employee.stats.avgFocusValue")} />
              <Mini icon={Smartphone} label={t("demo.employee.stats.avgUnlocks")} value="42" />
              <Mini icon={Trophy} label={t("demo.employee.stats.streak")} value={t("demo.employee.stats.streakValue")} />
            </div>
          </TabsContent>

          {/* TEAMS */}
          <TabsContent value="teams" className="space-y-4">
            <h2 className="font-semibold px-1">{t("demo.employee.teams.title")}</h2>
            <div className="surface-card p-5">
              <p className="text-sm font-medium">{t("demo.employee.teams.goalLine")}</p>
              <p className="text-xs text-muted-foreground mb-3">{t("demo.employee.teams.rewardChosen")}</p>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden" role="progressbar"
                aria-valuenow={68} aria-valuemin={0} aria-valuemax={100} aria-label={t("demo.employee.teams.progressAria")}>
                <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
              </div>
              <p className="text-sm mt-2">{t("demo.employee.teams.progressText")}</p>
            </div>

            <div className="surface-card p-5">
              <h3 className="font-semibold mb-2">{t("demo.employee.teams.whatEmployerSees")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("demo.employee.teams.employerSeesBody")}
              </p>
            </div>
          </TabsContent>


          {/* FEATURES */}
          <TabsContent value="features" className="space-y-3">
            <div className="surface-card p-5">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{t("demo.employee.features.eyebrow")}</p>
              <h2 className="text-xl font-semibold tracking-tight">{t("demo.employee.features.title")}</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t("demo.employee.features.subtitle")}
              </p>
            </div>
            <FeatureCard icon={Timer} title={t("demo.employee.features.timer.title")} desc={t("demo.employee.features.timer.desc")} on tag={t("demo.employee.features.timer.tag")} />
            <FeatureCard icon={ScanLine} title={t("demo.employee.features.brick.title")} desc={t("demo.employee.features.brick.desc")} on tag={t("demo.employee.features.brick.tag")} />
            <FeatureCard icon={MoonStar} title={t("demo.employee.features.grayscale.title")} desc={t("demo.employee.features.grayscale.desc")} />
            <FeatureCard icon={Clock} title={t("demo.employee.features.scrollStopper.title")} desc={t("demo.employee.features.scrollStopper.desc")} />
          </TabsContent>

          {/* EINSTELLUNGEN */}
          <TabsContent value="settings" className="space-y-4">
            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-primary" />{t("demo.employee.settings.profile")}</h2>
              <Field label={t("demo.employee.settings.name")} value="Alex Beispiel" />
              <Field label={t("demo.employee.settings.email")} value="alex@beispiel-gmbh.de" />
              <Field label={t("demo.employee.settings.team")} value="Team Gamma" />
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Smartphone className="h-4 w-4 text-primary" />{t("demo.employee.settings.allowedApps")}</h2>
              <div className="flex flex-wrap gap-2">
                {allowedApps.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-destructive" />{t("demo.employee.settings.blockedSites")}</h2>
              <div className="flex flex-wrap gap-2">
                {blockedSites.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">{w}</span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" />{t("demo.employee.settings.notifications")}</h2>
              <ToggleRow label={t("demo.employee.settings.dailySummary")} on />
              <ToggleRow label={t("demo.employee.settings.challengeReminders")} on />
              <ToggleRow label={t("demo.employee.settings.teamRanking")} />
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
