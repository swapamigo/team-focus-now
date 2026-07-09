import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Server, FileCheck, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";

const sections = [
  {
    icon: Shield,
    title: "Privacy-by-Design",
    body: "TeamFokus erfasst ausschließlich aggregierte Zeitdaten – keine Screenshots, keine Tastatureingaben, keine App-Inhalte. Auswertungen erfolgen pro Team, nicht pro Person.",
  },
  {
    icon: Lock,
    title: "Verschlüsselung",
    body: "Transport via TLS 1.3. Daten werden in der EU bei einem ISO-27001-zertifizierten Hoster gespeichert und ruhend verschlüsselt.",
  },
  {
    icon: Eye,
    title: "Zugriffskontrolle",
    body: "Mitarbeitende sehen nur ihre eigenen Daten und das anonymisierte Team-Ranking. Manager sehen Team-Aggregate, niemals Einzelpersonen-Detaildaten.",
  },
  {
    icon: Server,
    title: "Datenminimierung",
    body: "Wir speichern nur, was zur Funktion nötig ist. Sie können Ihren Account und alle zugehörigen Daten jederzeit aus den Einstellungen heraus löschen.",
  },
  {
    icon: FileCheck,
    title: "DSGVO &amp; Betriebsrat",
    body: "TeamFokus ist betriebsrats-tauglich, dokumentiert nach Art. 30 DSGVO und unterstützt Auftragsverarbeitungsverträge (AVV). Eine Vorlage stellen wir auf Anfrage zur Verfügung.",
  },
];

export default function Trust() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Trust &amp; Security – TeamFokus"
        description="Wie TeamFokus Daten schützt: Privacy-by-Design, EU-Hosting, Verschlüsselung, DSGVO-Konformität und Betriebsrats-Tauglichkeit."
        path="/trust"
      />
      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Trust &amp; Security</h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Wie TeamFokus Ihre Daten schützt – kurz und ehrlich. Diese Seite wird von uns gepflegt
            und ist keine externe Zertifizierung.
          </p>
        </div>

        <div className="grid gap-4">
          {sections.map((s) => (
            <div key={s.title} className="surface-card p-6 md:p-7 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold mb-1">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card p-6 md:p-7 mt-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            Sicherheitsproblem gefunden? Schreiben Sie uns an{" "}
            <a href="mailto:security@teamfokus.app" className="text-primary hover:underline">security@teamfokus.app</a>.
            Wir bestätigen den Eingang innerhalb von 48 Stunden.
          </p>
        </div>
      </main>
    </div>
  );
}
