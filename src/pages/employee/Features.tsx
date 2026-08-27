import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Timer, Smartphone, Sparkles, Wifi, MoonStar, AlarmClockOff, ScanLine } from "lucide-react";
import { useT } from "@/i18n";

interface Feature {
  key: string;
  icon: any;
  title: string;
  desc: string;
  tag?: string;
}

export default function FeaturesPage() {
  const t = useT();
  const [state, setState] = useState<Record<string, boolean>>({});
  const [delay, setDelay] = useState(30);

  const features: Feature[] = [
    {
      key: "open_delay",
      icon: Timer,
      title: t("employee.features.open_delay_title"),
      desc: t("employee.features.open_delay_desc"),
      tag: t("employee.features.popular_tag"),
    },
    {
      key: "brick_nfc",
      icon: ScanLine,
      title: t("employee.features.brick_title"),
      desc: t("employee.features.brick_desc"),
      tag: t("employee.features.brick_tag"),
    },
    {
      key: "grayscale",
      icon: MoonStar,
      title: t("employee.features.grayscale_title"),
      desc: t("employee.features.grayscale_desc"),
    },
    {
      key: "scroll_break",
      icon: AlarmClockOff,
      title: t("employee.features.scroll_break_title"),
      desc: t("employee.features.scroll_break_desc"),
    },
    {
      key: "focus_wifi",
      icon: Wifi,
      title: t("employee.features.focus_wifi_title"),
      desc: t("employee.features.focus_wifi_desc"),
    },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tf_features");
      if (raw) setState(JSON.parse(raw));
      const d = localStorage.getItem("tf_open_delay");
      if (d) setDelay(Number(d));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    try { localStorage.setItem("tf_features", JSON.stringify(next)); } catch {}
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> {t("employee.features.eyebrow")}</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">{t("employee.features.title")}</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {t("employee.features.intro")}
        </p>
      </header>

      <section className="px-5 space-y-3">
        {features.map((f) => {
          const on = !!state[f.key];
          return (
            <div key={f.key} className={`surface-card p-4 transition-colors ${on ? "border-primary/40 bg-primary/[0.03]" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 shrink-0 rounded-xl grid place-items-center ${on ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    {f.tag && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{f.tag}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>

                  {on && f.key === "open_delay" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{t("employee.features.delay_label")}</span>
                        <span className="font-medium tabular-nums">{delay}s</span>
                      </div>
                      <Slider min={5} max={120} step={5} value={[delay]} onValueChange={(v) => { setDelay(v[0]); try { localStorage.setItem("tf_open_delay", String(v[0])); } catch {} }} />
                    </div>
                  )}
                  {on && f.key === "brick_nfc" && (
                    <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      {t("employee.features.brick_hint")}
                    </div>
                  )}
                </div>
                <Switch checked={on} onCheckedChange={() => toggle(f.key)} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="px-5 mt-6">
        <div className="surface-card p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{t("employee.features.privacy_label")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("employee.features.privacy_note")}
          </p>
        </div>
      </section>
    </div>
  );
}
