import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DemoBanner from "@/components/demo/DemoBanner";
import { demoTeams, demoStats, genWeek } from "@/components/demo/demoData";
import { Trophy, Smartphone, TrendingDown, Lock, Sparkles, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";

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

        <section className="mb-4">
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
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="surface-card p-4">
            <div className="flex items-center gap-2 mb-1.5"><Smartphone className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Strafzeit</span></div>
            <p className="text-2xl font-semibold">14 Min</p>
          </div>
          <div className="surface-card p-4">
            <div className="flex items-center gap-2 mb-1.5"><Trophy className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Team-Platz</span></div>
            <p className="text-2xl font-semibold">{ownRank}. von {demoTeams.length}</p>
          </div>
        </section>

        <section className="mb-6">
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
        </section>

        <section className="mb-6">
          <h2 className="font-semibold mb-3 px-1">Team-Ranking heute</h2>
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
                  <p className="text-xs text-muted-foreground">Ø {t.avgMin} Min</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold">Deine Privatsphäre ist geschützt 🔒</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Nur du</strong> siehst deine persönlichen Daten.
                Dein Manager erhält ausschließlich <strong className="text-foreground">anonyme Team-Aggregate</strong> – nie individuelle Werte.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
