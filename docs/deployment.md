# Veröffentlichung über GitHub

Repository: `swapamigo/team-focus-now`.

## Hauptdomain auf Hostinger

`https://teamfokus.app` wird über den bestehenden Workflow
`.github/workflows/deploy-hostinger.yml` veröffentlicht. `www.teamfokus.app`
leitet auf die Hauptdomain weiter. Vercel bleibt davon unabhängig.

1. Geprüfte Änderungen auf `main` veröffentlichen.
2. In GitHub unter **Actions → Deploy to Hostinger → Run workflow** starten.
3. Als `ref` den geprüften Commit angeben, um genau diese Fassung zu bauen.
   Der Standardwert `main` baut den zum Start aktuellen Stand dieses Branches.
4. Nach erfolgreichem Upload `https://teamfokus.app/version.txt` mit dem
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

## Separate Vercel-Veröffentlichung

Ein Commit auf `main` löst zusätzlich einen Vercel-Build aus. Die unabhängige
Adresse ist `https://team-focus-now.vercel.app`. `vercel.json` konfiguriert
dort die Weiterleitung für Unterseiten; Hostinger nutzt die separate
`.htaccess`. Die Hauptdomain bleibt bei Hostinger.

Der bestehende Supabase-Dienst und die Authentifizierungsverbindungen werden
bei einer Frontend-Veröffentlichung nicht migriert oder abgeschaltet.
