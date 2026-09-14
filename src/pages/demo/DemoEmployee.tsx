import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DemoBanner from "@/components/demo/DemoBanner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { DAY_KEYS } from "@/components/demo/demoData";
import {
  genUnlockWeek, demoWeeklyRanking, loadShopItems, redemptionCode,
  rankingBonusEur, PERSONAL_MAX_EUR, PERSONAL_MAX_POINTS, POINTS_PER_EUR, RANKING_POOL_EUR,
  type ShopItem,
} from "@/components/demo/demoGame";
import {
  Trophy, Smartphone, TrendingDown, Lock, Sparkles, Users, Home,
  BarChart3, Settings as Cog, Bell, CheckCircle2, Globe, Shield, Clock,
  Timer, ScanLine, MoonStar, Gift, BellRing, Pencil, Store, Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import Seo from "@/components/Seo";
import { useT } from "@/i18n";

const allowedApps = ["Microsoft Teams", "Slack", "Outlook", "Notion"];
const blockedSites = ["instagram.com", "tiktok.com", "youtube.com", "x.com"];

export default function DemoEmployee() {
  const t = useT();
  const [seed, setSeed] = useState(0);
  const dayLabels = useMemo(() => DAY_KEYS.map((k) => t(k)), [t]);
  const week = useMemo(() => genUnlockWeek(seed, dayLabels), [seed, dayLabels]);
  const today = week[week.length - 1];
  const yesterday = week[week.length - 2];

  const weekPoints = useMemo(() => week.reduce((s, d) => s + d.points, 0), [week]);
  const monthPoints = 2860 + weekPoints;
  const personalPct = Math.min(100, Math.round((monthPoints / PERSONAL_MAX_POINTS) * 100));
  const personalEur = Math.min(PERSONAL_MAX_EUR, Math.floor(monthPoints / POINTS_PER_EUR));

  const myPlace = demoWeeklyRanking.findIndex((r) => r.isMe) + 1 || 3;
  const bonus = rankingBonusEur(myPlace);

  const [alias, setAlias] = useState("Blaufuchs");
  const [aliasDraft, setAliasDraft] = useState("Blaufuchs");

  const [shop] = useState<ShopItem[]>(() => loadShopItems());
  const [balance, setBalance] = useState(monthPoints);
  const [receipt, setReceipt] = useState<{ item: ShopItem; code: string; date: string } | null>(null);

  const redeem = (item: ShopItem) => {
    if (balance < item.points) {
      toast.error(t("demo.employee.shop.notEnough"));
      return;
    }
    setBalance(balance - item.points);
    setReceipt({ item, code: redemptionCode(item.id), date: new Date().toLocaleDateString() });
  };

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
            <TabsTrigger value="ranking"><Trophy className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.ranking")}</TabsTrigger>
            <TabsTrigger value="shop"><Store className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.shop")}</TabsTrigger>
            <TabsTrigger value="features"><Sparkles className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.features")}</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="h-4 w-4 mr-1.5" />{t("demo.employee.tabs.settings")}</TabsTrigger>
          </TabsList>

          {/* HEUTE */}
          <TabsContent value="home" className="space-y-4">
            <div className="surface-card p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-10 blur-2xl" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t("demo.employee.home.unlocksToday")}</p>
              <p className="text-5xl font-semibold tracking-tight mt-2 tabular-nums">{today.unlocks}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("demo.employee.home.perWorkHour", { rate: today.rate })}</p>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-success font-medium">{today.unlocks - yesterday.unlocks >= 0 ? "+" : ""}{today.unlocks - yesterday.unlocks}</span>
                <span className="text-muted-foreground">{t("demo.employee.home.thanYesterday")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Sparkles className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{t("demo.employee.home.pointsToday")}</span></div>
                <p className="text-2xl font-semibold tabular-nums">{today.points}</p>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{t("demo.employee.home.pointsWeek")}</span></div>
                <p className="text-2xl font-semibold tabular-nums">{weekPoints}</p>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-semibold">{t("demo.employee.self.title")}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("demo.employee.self.subtitle", { max: PERSONAL_MAX_EUR })}</p>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden" role="progressbar"
                aria-valuenow={personalPct} aria-valuemin={0} aria-valuemax={100} aria-label={t("demo.employee.self.aria")}>
                <div className="h-full rounded-full bg-primary" style={{ width: `${personalPct}%` }} />
              </div>
              <p className="text-sm mt-2">{t("demo.employee.self.progress", { points: monthPoints, max: PERSONAL_MAX_POINTS, eur: personalEur })}</p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold">{t("demo.employee.home.privacyTitle")}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("demo.employee.home.privacyBody")}</p>
              </div>
            </div>
          </TabsContent>

          {/* STATISTIK */}
          <TabsContent value="stats" className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t("demo.employee.stats.thisWeek")}</h2>
                <span className="text-xs text-muted-foreground">{t("demo.employee.stats.unlocksLabel")}</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", radius: 12 }} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [v, t("demo.employee.stats.unlocksLabel")]} labelFormatter={() => ""} />
                    <Bar dataKey="unlocks" radius={[8, 8, 8, 8]}>
                      {week.map((_, i) => <Cell key={i} fill={i === week.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-semibold mb-3">{t("demo.employee.stats.dayTable")}</h2>
              <ul className="divide-y divide-border/40 text-sm">
                {week.map((d, i) => (
                  <li key={i} className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground w-10">{d.label}</span>
                    <span className="tabular-nums">{t("demo.employee.stats.rowUnlocks", { unlocks: d.unlocks, rate: d.rate })}</span>
                    <span className="font-semibold tabular-nums">{d.points} P</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Mini icon={Smartphone} label={t("demo.employee.stats.avgRate")} value={String(Math.round((week.reduce((s, d) => s + d.rate, 0) / week.length) * 10) / 10)} />
              <Mini icon={Clock} label={t("demo.employee.stats.bestHour")} value="0" />
              <Mini icon={Trophy} label={t("demo.employee.stats.streak")} value={t("demo.employee.stats.streakValue")} />
            </div>
          </TabsContent>

          {/* RANKING */}
          <TabsContent value="ranking" className="space-y-4">
            <div className="surface-card p-5">
              <h2 className="font-semibold">{t("demo.employee.self.title")}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("demo.employee.self.explain", { max: PERSONAL_MAX_EUR, pool: RANKING_POOL_EUR })}</p>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${personalPct}%` }} />
              </div>
              <p className="text-sm mt-2">{t("demo.employee.self.progress", { points: monthPoints, max: PERSONAL_MAX_POINTS, eur: personalEur })}</p>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-semibold">{t("demo.employee.ranking.title", { pool: RANKING_POOL_EUR })}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("demo.employee.ranking.subtitle")}</p>
              <ul className="divide-y divide-border/40">
                {demoWeeklyRanking.map((r, i) => {
                  const mine = !!r.isMe;
                  return (
                    <li key={r.alias} className={"flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg " + (mine ? "bg-primary/10" : "")}>
                      <span className="text-sm font-medium truncate">
                        {i + 1}. {mine ? alias : r.alias}
                        {mine && <span className="ml-2 text-[10px] uppercase tracking-wider text-primary font-semibold">{t("demo.employee.teams.you")}</span>}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">{r.points} P</span>
                      <span className="text-sm font-semibold tabular-nums">{rankingBonusEur(i + 1)} €</span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{t("demo.employee.ranking.note")}</p>
            </div>

            <div className="rounded-2xl border border-success/30 bg-success/5 p-4 flex items-start gap-3">
              <BellRing className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{t("demo.employee.notify.title")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("demo.employee.notify.bodyNew", { eur: personalEur, place: myPlace, bonus })}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* SHOP */}
          <TabsContent value="shop" className="space-y-4">
            <div className="surface-card p-5 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t("demo.employee.shop.balance")}</p>
                <p className="text-3xl font-semibold tabular-nums mt-1">{balance} P</p>
                <p className="text-xs text-muted-foreground mt-1">{t("demo.employee.shop.rate")}</p>
              </div>
              <Gift className="h-8 w-8 text-primary" />
            </div>

            <div className="surface-card p-5">
              <h2 className="font-semibold">{t("demo.employee.shop.title")}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("demo.employee.shop.subtitle")}</p>
              <ul className="divide-y divide-border/40">
                {shop.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{item.points} P</p>
                    </div>
                    <Button size="sm" variant={balance >= item.points ? "default" : "outline"} onClick={() => redeem(item)}>
                      {t("demo.employee.shop.redeem")}
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{t("demo.employee.shop.note")}</p>
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
              <div className="py-2.5 border-b border-border/40">
                <Label className="text-sm text-muted-foreground">{t("demo.employee.settings.anonName")}</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={aliasDraft} onChange={(e) => setAliasDraft(e.target.value)} className="h-9" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setAlias(aliasDraft.trim() || alias); toast.success(t("demo.employee.toast.nameSaved")); }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />{t("demo.employee.settings.saveName")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{t("demo.employee.settings.anonNameHint")}</p>
              </div>
              <Field label={t("demo.employee.settings.email")} value="alex@beispiel-gmbh.de" />
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

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("demo.employee.receipt.title")}</DialogTitle></DialogHeader>
          {receipt && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
                <p className="text-sm font-semibold">{receipt.item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{receipt.item.points} P · {receipt.date}</p>
                <p className="text-lg font-semibold tracking-wider mt-3 tabular-nums">{receipt.code}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("demo.employee.receipt.body")}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${t("demo.employee.receipt.title")}: ${receipt.item.name} · ${receipt.item.points} P · ${receipt.code}`
                    );
                    toast.success(t("demo.employee.receipt.copied"));
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />{t("demo.employee.receipt.copy")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={`mailto:?subject=${encodeURIComponent(t("demo.employee.receipt.title"))}&body=${encodeURIComponent(`${receipt.item.name} · ${receipt.item.points} P · ${receipt.code}`)}`}>
                    {t("demo.employee.receipt.send")}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
