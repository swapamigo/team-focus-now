# Änderungen am Bachelor-Archiv (Vercel)

Stand: 28.09.2026

Die Seite https://team-focus-now.vercel.app zeigt den Abgabestand der Bachelorarbeit
(Commit dfc11c3765f82dbf470d440a9b771bfd46785f9a, Repository-Stand 15.08.2026).
Gegenüber diesem Stand wurden im Archiv `site.tar.gz` ausschließlich folgende Änderungen vorgenommen:

1. Impressum entfernt: Der Link im Seitenfuß ist entfernt, `/impressum` leitet auf die Startseite um,
   die Platzhalterangaben (Firmenname, Anschrift, Telefon, Registernummer, USt-IdNr.) sind geleert.
2. Zugriffsstatistik entfernt: Apollo-Tracker aus `index.html` entfernt, die Klick- und
   Seitenaufruf-Erfassung (Geolokalisierung über ipapi.co, Tabelle `link_events`) ist deaktiviert.
3. Manager-Demo: Beispielnamen durch "Anonym 1" bis "Anonym 8" ersetzt, Teamzuordnung der
   Personen wird nicht mehr angezeigt, Teamauswahl im Einladungsdialog entfernt.
4. Bezeichnung "Blockierte Websites" in "Erfasste Websites (keine Sperre)" geändert,
   zugehörige Hinweistexte angepasst (es wird nichts gesperrt, nur die Verweildauer gezählt).

`version.txt` ist unverändert (`dfc11c3765f82dbf470d440a9b771bfd46785f9a bachelor-submission`).
`build-info.json` enthält einen Vermerk zu diesen Änderungen.
SHA-256 des neuen Archivs: 35e5816ce47ab87c02b6e590dac5112ed3c42802a9ee9ececd0973cb9c9864fc
