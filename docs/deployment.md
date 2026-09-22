# Veröffentlichung über GitHub

Das Repository `swapamigo/team-focus-now` ist bereits mit Vercel verbunden.
Ein Commit auf `main` löst einen neuen Build aus. Nach erfolgreichem Deployment
ist die Version unter https://team-focus-now.vercel.app erreichbar.
Ein Update in Lovable ist dafür nicht erforderlich.

## Eigene Domain

Stand der Prüfung vom 21. September 2026: `teamfokus.app` liefert noch die
separate Lovable-Veröffentlichung aus. Die Nameserver gehören zu Name.com.
Die Domain wurde bisher nicht auf Vercel umgestellt.

Für die einmalige Verbindung:

1. Im bestehenden Vercel-Projekt unter **Settings → Domains** `teamfokus.app`
   und `www.teamfokus.app` hinzufügen. Die Hauptdomain festlegen.
2. Bei Name.com die zugehörigen Web-DNS-Einträge auf die **exakt von Vercel
   angezeigten Werte** ändern. Bestehende Mail- und Verifizierungseinträge
   (insbesondere MX und TXT) beibehalten.
3. Nach erfolgreicher Domain- und HTTPS-Prüfung die Startseite, eine Unterseite
   wie `/datenschutz` und den Prototyp über die eigene Domain öffnen.
   Bei aktivierter Anmeldung auch die erlaubten Weiterleitungsadressen
   der bestehenden Auth-Konfiguration prüfen.

Erst dann zeigt die eigene Domain automatisch die GitHub-Veröffentlichungen.
Der bestehende Supabase-Dienst und die GitHub-Verbindung zu Lovable müssen
dafür nicht entfernt werden.

Referenzen: [Vercel Git-Deployments](https://vercel.com/docs/git),
[Vercel Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain),
[Lovable GitHub-Synchronisierung](https://docs.lovable.dev/integrations/github).
