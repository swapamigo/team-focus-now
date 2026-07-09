import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, ShieldCheck, Users, Clock, AlertTriangle, Server } from "lucide-react";

const captured = [
  "Bildschirmzeit gesamt (pro Tag)",
  "Ablenkungs- / Strafminuten (pro Tag)",
  "Kategorie eines Aufrufs: erlaubt / ablenkend",
  "Anonyme Team-Zugehörigkeit",
];

const notCaptured = [
  "App-Namen oder Website-Namen (URLs)",
  "Inhalte, Texte, Nachrichten",
  "Screenshots oder Bildschirm-Aufzeichnungen",
  "Tastatur- oder Mauseingaben",
  "Standortdaten",
  "Einzelne Zeitstempel oder Entsperr-Ereignisse",
];

export default function PrivacyInfo() {
  return (
    <div className="pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link to="/app/settings" className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted/50">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Datenschutz</p>
          <h1 className="text-lg font-semibold leading-tight">Was wir speichern – und was nicht.</h1>
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Nur Teamdurchschnitte verlassen dein Gerät dauerhaft.</strong> Manager:innen sehen
            ausschließlich Team-Werte ab 5 Personen. Deine Einzeldaten sieht niemand außer dir.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              <Check className="h-3.5 w-3.5" /> Erfasst
            </div>
            <ul className="space-y-2">
              {captured.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-4">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-destructive mb-3">
              <X className="h-3.5 w-3.5" /> Nicht erfasst
            </div>
            <ul className="space-y-2">
              {notCaptured.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span className="leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Was am Ende des Tages bleibt</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Nach Mitternacht löscht TeamFokus automatisch alle Roh-Ereignisse des Tages. Dauerhaft bleiben nur
            zwei aggregierte Werte – damit du deinen eigenen Verlauf sehen kannst und das Team einen Schnitt hat.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-[11px] text-muted-foreground">Bildschirmzeit</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <p className="text-[11px] text-muted-foreground">Ablenkungszeit</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> k-Anonymität (k = 5)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Team-Auswertungen werden erst angezeigt, wenn mindestens 5 Personen mitmachen. Dein Anteil
            verschwindet im Durchschnitt – Rückschlüsse auf einzelne sind ausgeschlossen.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
          <h2 className="font-semibold mb-2">Freiwillig – ohne Nachteil</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Du kannst jederzeit aus TeamFokus aussteigen. Dein Team-Score wird nur über mitmachende Personen
            gemittelt – wer nicht teilnimmt, benachteiligt das Team nicht.
          </p>
          <Link
            to="/app/settings"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Zu den Einstellungen
          </Link>
        </div>
      </div>
    </div>
  );
}
