import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Timer, Smartphone, Sparkles, Wifi, MoonStar, AlarmClockOff, ScanLine } from "lucide-react";

interface Feature {
  key: string;
  icon: any;
  title: string;
  desc: string;
  tag?: string;
}

const features: Feature[] = [
  {
    key: "open_delay",
    icon: Timer,
    title: "30-Sekunden Öffnungs-Timer",
    desc: "Vor dem Öffnen von Social-Apps läuft ein kurzer Timer. Das durchbricht den Reflex und gibt dir Zeit, bewusst zu entscheiden.",
    tag: "Beliebt",
  },
  {
    key: "brick_nfc",
    icon: ScanLine,
    title: "Physische Sperre per NFC (Brick)",
    desc: "Verbinde einen physischen NFC-Chip wie Brick. Instagram & Co. öffnen sich nur, wenn du den Chip aktiv mit dem Handy berührst – die Hürde, die süchtig macht, verschwindet.",
    tag: "Brick kompatibel",
  },
  {
    key: "grayscale",
    icon: MoonStar,
    title: "Graustufen während der Arbeit",
    desc: "Während der Arbeitszeit schaltet dein Handy automatisch in Graustufen. Bunte Reize verlieren ihre Anziehungskraft.",
  },
  {
    key: "scroll_break",
    icon: AlarmClockOff,
    title: "Scroll-Stopper nach 2 Minuten",
    desc: "Wenn du länger als 2 Minuten in einer Social-App bist, kommt eine sanfte Erinnerung. Du entscheidest, ob du bleibst.",
  },
  {
    key: "focus_wifi",
    icon: Wifi,
    title: "Auto-Fokus bei Arbeits-WLAN",
    desc: "Sobald du dich im Büro-WLAN befindest, aktivieren sich deine Fokus-Regeln automatisch.",
  },
];

export default function FeaturesPage() {
  const [state, setState] = useState<Record<string, boolean>>({});
  const [delay, setDelay] = useState(30);

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
        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> Anti-Sucht Werkzeuge</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Features</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Optionale Hilfen, die dir helfen, weniger abhängig vom Handy zu werden. Aktiviere nur das, was zu dir passt – alles ist freiwillig.
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
                        <span className="text-muted-foreground">Verzögerung</span>
                        <span className="font-medium tabular-nums">{delay}s</span>
                      </div>
                      <Slider min={5} max={120} step={5} value={[delay]} onValueChange={(v) => { setDelay(v[0]); try { localStorage.setItem("tf_open_delay", String(v[0])); } catch {} }} />
                    </div>
                  )}
                  {on && f.key === "brick_nfc" && (
                    <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      Halte deinen Brick an die Rückseite des Handys, um die Apps freizuschalten.
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
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Privatsphäre</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Deine individuelle Fokuszeit sieht <strong className="text-foreground">niemand außer dir</strong>. Manager und Teamkolleg*innen sehen nur den Durchschnitt deines Teams.
          </p>
        </div>
      </section>
    </div>
  );
}
