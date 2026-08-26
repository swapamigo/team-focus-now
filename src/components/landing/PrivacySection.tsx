import { Shield, Clock, Lock, Server, Trash2, Users, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const dsgvoPoints = [
  {
    icon: Shield,
    title: "Datenminimierung",
    article: "Art. 5 Abs. 1 lit. c DSGVO",
    desc: "Wir erfassen ausschließlich Zeitdaten. Keine Inhalte, keine Screenshots, keine Tastatur- oder Mauseingaben, keine URLs.",
  },
  {
    icon: FileCheck,
    title: "Zweckbindung",
    article: "Art. 5 Abs. 1 lit. b DSGVO",
    desc: "Daten dienen ausschließlich dem aggregierten Team-Score – nicht der Leistungskontrolle einzelner Personen.",
  },
  {
    icon: Users,
    title: "k-Anonymität (k = 5)",
    article: "Privacy by Design – Art. 25 DSGVO",
    desc: "Team-Auswertungen erscheinen erst ab 5 teilnehmenden Personen. So lässt sich niemand zurückverfolgen.",
  },
  {
    icon: Server,
    title: "EU-Hosting",
    article: "Kein Drittlandtransfer · Art. 44 ff. DSGVO",
    desc: "Alle Daten liegen auf EU-Servern in Frankfurt. Verbindung TLS-verschlüsselt.",
  },
  {
    icon: Trash2,
    title: "Löschrecht",
    article: "Art. 17 DSGVO",
    desc: "Mitarbeitende können jederzeit alle Daten löschen lassen – mit einem Klick in der App.",
  },
  {
    icon: Lock,
    title: "Freiwilligkeit",
    article: "Art. 7 Abs. 3 DSGVO",
    desc: "Teilnahme ist freiwillig und jederzeit ohne Nachteil widerrufbar.",
  },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="container py-16 md:py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Datenschutz & Mitbestimmung</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
          Strukturell datensparsam – nicht nur versprochen.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          TeamFokus ist nach dem Prinzip <strong className="text-foreground">Privacy by Design</strong> gebaut.
          Was nicht gespeichert wird, kann auch nicht missbraucht werden.
        </p>
      </div>

      {/* Hervorgehobene Box */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="surface-card-elevated rounded-3xl p-8 md:p-10 relative overflow-hidden ring-1 ring-primary/30">
          <div className="absolute -top-12 -right-12 h-40 w-40 gradient-primary opacity-20 blur-3xl rounded-full pointer-events-none" />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest font-semibold text-primary mb-5">
            <Server className="h-3.5 w-3.5" /> Am Ende des Tages auf unseren Servern
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">Genau 1 Wert. Pro Person. Pro Tag.</h3>

          <div className="max-w-md mx-auto mb-2">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-center">
              <Clock className="h-7 w-7 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Gesammelte Fokuszeit</p>
              <p className="text-3xl font-semibold tracking-tight">z.&nbsp;B. 124 Min.</p>
              <p className="mt-2 text-sm text-success font-medium">= 24&nbsp;Min. weniger als letzte Woche</p>
            </div>
          </div>
        </div>
      </div>


      {/* DSGVO Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-10">
        {dsgvoPoints.map((p) => (
          <div key={p.title} className="surface-card p-6 rounded-2xl">
            <div className="inline-flex h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mb-3">
              <p.icon className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">{p.title}</h4>
            <p className="text-[11px] uppercase tracking-wider text-primary/80 font-semibold mb-2">{p.article}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Mitbestimmung */}
      <div className="max-w-4xl mx-auto surface-card rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Mitbestimmung</p>
        <h3 className="text-xl md:text-2xl font-semibold mb-3">Betriebsrat & Beschäftigtendatenschutz</h3>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
          TeamFokus berücksichtigt von Anfang an die Mitbestimmungsrechte:{" "}
          <strong className="text-foreground">Österreich §&nbsp;96 / §&nbsp;96a ArbVG</strong> und{" "}
          <strong className="text-foreground">Deutschland §&nbsp;87 BetrVG</strong>, ergänzt durch{" "}
          §&nbsp;26 BDSG und Art.&nbsp;88 DSGVO.
        </p>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
          Wir liefern <strong className="text-foreground">Muster-Betriebsvereinbarung</strong>, Bausteine für die
          <strong className="text-foreground"> Datenschutz-Folgenabschätzung</strong>, einen
          <strong className="text-foreground"> Auftragsverarbeitungsvertrag</strong> sowie ein
          <strong className="text-foreground"> Mitarbeiter-Infoblatt</strong> mit – fertig zur Vorlage beim Betriebsrat.
        </p>
        <Link
          to="/fuer-betriebsrat"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <FileCheck className="h-4 w-4" />
          Rechtliche Compliance im DACH-Raum &amp; Betriebsrat-Akzeptanz
        </Link>
      </div>
    </section>
  );
}
