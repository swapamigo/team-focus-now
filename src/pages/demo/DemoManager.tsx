import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DemoBanner from "@/components/demo/DemoBanner";
import { demoTeams, demoStats, genYear } from "@/components/demo/demoData";
import { Users, Trophy, Activity, TrendingDown, Sparkles, CalendarRange, UserCog } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
              <Sparkles className="h-4 w-4 mr-1" /> Demo-Jahr neu generieren
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat icon={Users} label="Mitarbeitende" value={demoStats.memberCount.toString()} />
          <Stat icon={Trophy} label="Teams" value="4" />
          <Stat icon={Activity} label="Aktive Challenge" value="Läuft" small="Fokus-Woche" />
          <Stat icon={TrendingDown} label="Ø Ablenkung heute" value={`${Math.round(demoTeams.reduce((s, t) => s + t.avgMin, 0) / demoTeams.length)} min`} />
        </div>

        <section className="surface-card p-5 md:p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-semibold flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" /> Jahresüberblick</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Bildschirmzeit Ø pro Mitarbeitendem · klar fallend</p>
            </div>
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

        <section className="surface-card p-5 md:p-6">
          <h2 className="font-semibold mb-4">Team-Ranking heute</h2>
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
