# TeamFokus: aktueller Umsetzungsstand

Stand: 15. September 2026. Aktuelle Vorgaben aus dem Gespräch ersetzen ältere Produktregeln.

## Website und Prototyp

Kurze Startseite auf Deutsch, Englisch und Spanisch; Hero „Bis zu 50 € extra. Nur durch weniger Handy?“. Direkt daneben wird erläutert: vier volle Arbeitswochen, abhängig vom Prämienangebot. Kein festes Kalendermonatslimit. Die alten vier Schrittbilder sind aus der Startseite entfernt.

Ein interaktiver Regler zeigt die persönlichen Wochenpunkte bei einer frei gewählten Zahl aktiver Entsperrungen pro Arbeitstag. Die Demo bietet Heute, eigenen Fortschritt, Ranking und Shop; im Managerbereich Übersicht, Prämien und Belegprüfung. Beispielprodukte und neue Belege werden lokalisiert; eigene Produkttexte werden nicht automatisch übersetzt.

Die Beispielwoche kann verändert und einmalig abgeschlossen werden. Persönliche Punkte und der Rangbonus erhöhen das Demo-Guthaben. Gleichzeitige oder wiederholte Abschlussversuche schreiben keine weiteren Punkte gut. Danach bleibt die Beispielwoche unverändert; ein ausdrücklicher Demo-Reset startet erneut. Einlösen, Guthaben und Belege bleiben beim Neuladen erhalten. Demo-Daten gelangen nicht in echte Konten.

## Punkte und Datenschutz

- Einziger Nutzungswert: aktive Entsperrungen während Mo–Fr, 09–17 Uhr, Europe/Berlin. Keine Bildschirmzeit, Inhalte oder App-Listen.
- Tagespunkte: `200 * 2 ** (-max(0, unlocks - 8) / 8)`. Jede Entsperrung oberhalb von acht verändert den ungerundeten Wert. Wochenabrechnung auf zwei Dezimalstellen, maximal 1.000 persönliche Punkte.
- Höchstens zehn Personen erhalten einen Duellbonus. Gleiche Zählwerte ergeben gleiche Ränge und den vollen Bonus: zwei Erste erhalten je 250 Punkte.
- Vorläufige weitere Regeln: dichte Ränge (1, 1, 2), Bonus `round(250 * 0.8 ** (rank - 1), 2)`, einmaliger gespeicherter Losentscheid bei Gleichstand an der Zehn-Personen-Grenze. Diese Parameter sind ein anpassbarer Entwurf, kein studienbewiesenes Optimum.
- 1.000 Punkte für einen 10-€-Gutschein sind eine verständliche Referenz; Manager bestimmen die tatsächlichen Prämienpreise. Guthaben verfällt nicht, Einlösen ist jederzeit bei ausreichendem Stand möglich.
- Fehlende Daten zählen niemals als null Entsperrungen. Nur vollständige Tageswerte verdienen Punkte; für Duell und Teamtrend sind vollständige Fünftagewochen nötig.
- Manager sehen die registrierte Gesamtzahl und gespeicherte Gesamttrends ab fünf gültigen Beiträgen. Keine Personenliste, individuellen Zählwerte oder Guthaben. Belege enthalten nur Pseudonym, Produkt, Code, Datum und Ausgabestatus.
- Marketing-Tracking ist auf öffentliche Informationsseiten beschränkt. App, Demo, Einladungen und Belege werden nicht erfasst. Die Sprache wird ohne Standortabfrage gewählt.

## Echtbetrieb ist noch nicht eingerichtet

Die Migration `supabase/migrations/20260914120000_focus_unlock_rewards.sql` enthält Datenrechte, serverseitige Punkteabrechnung, atomare Einlösungen und einmalige Belegausgabe. Sie wurde mit PostgreSQL/PGlite getestet, aber nicht auf der Produktionsdatenbank angewendet.

Vor echtem Einsatz muss die Migration in der vorgesehenen Supabase-Umgebung angewendet und dort geprüft werden. Solange die RPCs fehlen, zeigt die App einen Einrichtungsstatus mit Demo-Link. Es werden keine fingierten Messwerte oder Beispielguthaben in echte Konten geladen. Die bestehende Beta-Zugangssperre bleibt erhalten.

Die native Mitarbeiter-App und ihr vertrauenswürdiger Übertragungsdienst sind weiterhin eine gesonderte Anbindung. Diese Website misst selbst keine Handy-Entsperrungen. Der Dienst muss vollständige Erfassungsfenster prüfen, bevor Tageswerte als vollständig markiert werden. Abgerechnete Wochen werden gegen spätere Änderungen gesperrt. Urlaub, Feiertage, Ausfälle und verspätete Synchronisierung benötigen vor produktivem Einsatz eine abgestimmte Regel.

Mit vorhandenem pg_cron richtet die Migration einen täglichen Abschlusslauf um 06:05 UTC ein; andernfalls muss ein vertrauenswürdiger Dienst `focus_settle_due_weeks()` ausführen. Der tatsächliche Produktionsjob wurde noch nicht geprüft.

Joel Schöppe und die bestehende Kontaktadresse sind eingetragen. Die echte Anbieteranschrift muss noch ergänzt werden.

## Prüfung

- `npm test`: 13 Tests inklusive Kurvenabstufungen, Gleichständen, Personenlimit, einmaligem Demo-Wochenabschluss und lokalisierten Belegen.
- `npm run test:db`: 11 Datenbankprüfungen für Rollen, fremde Unternehmen, fehlende Daten, wiederholte Abrechnung, Käufe, Belege und Kontolöschung. Kleines Basisschema mit der echten neuen Migration; kein Produktions- oder Lasttest.
- TypeScript-Prüfung und Vite-Produktionsbuild bestanden. Das zuvor veraltete Lockfile wurde abgeglichen. Es bleibt eine Warnung zur Größe des Haupt-Chunks.
- Browserprüfung: Prämie anlegen, kaufen, Guthaben nach Neuladen, Beleg prüfen und einmalig ausgeben; mobile Ansichten in drei Sprachen. Das echte Kontaktformular wird dabei nicht abgesendet.

GitHub-Veröffentlichung und die Veröffentlichung beim bestehenden Hoster sind getrennt von Datenbankmigration und nativer Messanbindung.
