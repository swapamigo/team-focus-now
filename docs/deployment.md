# Veröffentlichung über GitHub

Repository: `swapamigo/team-focus-now`.

## Hauptdomain auf Hostinger

`https://teamfokus.app` wird über den bestehenden Workflow
`.github/workflows/deploy-hostinger.yml` veröffentlicht. `www.teamfokus.app`
leitet auf die Hauptdomain weiter. Vercel bleibt davon unabhängig.

1. Geprüfte Änderungen auf `main` veröffentlichen. Jeder Push startet automatisch
   **Deploy to Hostinger**, mit genau dem Commit dieses Pushs.
2. Für eine gezielte erneute Veröffentlichung oder Wiederherstellung in GitHub
   **Actions → Deploy to Hostinger → Run workflow** starten. Als `ref` den
   geprüften vollständigen Commit angeben. Der Standardwert `main` baut den zum
   Start aktuellen Stand dieses Branches.
3. Nach erfolgreichem Upload `https://teamfokus.app/version.txt` mit dem
   gewünschten Commit vergleichen und die geänderte Unterseite prüfen.

Der Workflow baut mit `npm ci` und `npm run build`, ergänzt die
Hostinger-Konfiguration aus `deploy/hostinger/.htaccess` und lädt `dist/`
über FTPS hoch. Die Zugangsdaten sind bereits als GitHub-Secrets hinterlegt;
sie gehören nicht in Quellcode oder Protokolle. Eine neue DNS-Umstellung oder
eine Veröffentlichung in Lovable ist für Inhaltsupdates nicht erforderlich.

Wichtig beim erneuten Ausführen eines älteren Jobs: Wurde er mit `ref: main`
gestartet, lädt `actions/checkout` wieder den aktuellen Stand von `main`.
Ein erneuter Lauf ist dann keine Wiederherstellung des alten Website-Stands.
Für eine gezielte Wiederherstellung einen neuen manuellen Lauf mit dem
gewünschten vollständigen Commit-SHA starten.

## Vercel: feste Bachelor-Abgabeversion

`https://team-focus-now.vercel.app` zeigt ausschließlich den dokumentierten
Repository-Bezugsstand der Bachelorarbeit zum 15.08.2026:
`dfc11c3765f82dbf470d440a9b771bfd46785f9a` vom 10.08.2026.
Dieser Stand ist in `deploy/bachelor/snapshot.json` festgelegt. Der ältere Tag
`v1.0-abgabe` und der spätere Branch `verteidigung` bezeichnen andere Stände.

Ein Commit auf `main` kann weiterhin einen Vercel-Build auslösen. Die
Vercel-Konfiguration ruft jedoch ausschließlich `scripts/build-bachelor.mjs`
auf. Das Skript lädt bei Bedarf genau den festgelegten Commit nach und entpackt
ihn in ein getrenntes Build-Verzeichnis. Es verändert weder `main` noch den
Hostinger-Build. Bei einem Fehler bricht es ab, statt aktuelle Produktdateien
als Abgabestand zu veröffentlichen. Spätere Produktänderungen auf `main`
ändern die Vercel-Abgabeversion daher nicht.

Der damalige npm-Lock war nicht mit der damaligen `package.json` synchron.
`deploy/bachelor/package-lock.json` enthält einen separat geprüften,
reproduzierbaren Kompatibilitäts-Lock. Der Anwendungscode und die
`package.json` stammen unverändert aus dem Abgabe-Commit. Vite wird direkt
aufgerufen; die damalige Sitemap bleibt erhalten, ohne den alten unfixierten
`bunx`-Aufruf. Der Build migriert keine Datenbank.

Prüfung:

- `https://team-focus-now.vercel.app/version.txt` muss den vollständigen
  Abgabe-Commit und `bachelor-submission` ausgeben.
- `https://team-focus-now.vercel.app/build-info.json` dokumentiert den Stand.
- Mitarbeiter- und Managerdemo liegen unter `/demo/employee` und `/demo/manager`.
- `https://teamfokus.app/version.txt` zeigt unabhängig davon den aktuellen
  Hostinger-Commit.

`vercel.json` enthält weiterhin den Fallback für direkte Aufrufe der
React-Unterseiten. Hostinger verwendet ausschließlich die separate `.htaccess`.
Die Abgabeversion nur auf ausdrücklichen Wunsch ändern; für normale
Produktupdates bleiben `deploy/bachelor/` und `scripts/build-bachelor.mjs`
unverändert.

### Offene externe Dateien des historischen Stands

Einige damalige Bilder und Downloads liegen nur als `.asset.json`-Verweise auf
Lovables `/__l5e/assets-v1/` vor, nicht als Dateien im Repository. Diese Pfade
funktionieren außerhalb von Lovable ohne einen Export der Originaldateien
nicht. Der Zugriff auf die damalige Lovable-Adresse wurde bei der Einrichtung
am 25.09.2026 durch Cloudflare blockiert; es wurden keine Bilder ersetzt oder
Zugriffssperren umgangen. Für eine vollständige optische Archivierung müssen
die Originaldateien aus einem autorisierten Lovable-Export ergänzt werden.

Der bestehende Supabase-Dienst und die Authentifizierungsverbindungen werden
bei einer Frontend-Veröffentlichung nicht migriert oder abgeschaltet.
