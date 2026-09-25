# Fokus-Tools, Codes und ROI (September 2026)

## Freiwillige Tools

`/demo/employee/tools` simuliert Pausen für Instagram, TikTok und YouTube.
Alle Schalter starten ausgeschaltet. Beschäftigte wählen die Apps und 15, 25
oder 50 Minuten und können jederzeit abbrechen. Die Vorschau zeigt eine
pausierte bzw. freigegebene App; sie blockiert keine installierten Apps.
Auswahl und Endzeit bleiben ausschließlich im lokalen Demo-Speicher. Weder
Managerdaten noch Punktestand werden durch die Tools verändert. Die native
Umsetzung mit freiwilliger Geräteberechtigung ist noch anzubinden.

## Direkte Gutscheincodes

Neue Demo-Einlösungen der Kategorien Gutschein und Wohlbefinden liefern
sofort einen kopierbaren, ausdrücklich ungültigen `DEMO-NOT-VALID-…`-Code.
Er bleibt in „Deine Einlösungen“ gespeichert. Wiederholte Anfragen mit
derselben Request-ID geben denselben Code zurück und buchen nicht erneut ab.
Alte Belege bleiben erhalten. Merch und Freizeit nutzen weiter Abholbelege.

Die echte Gutscheinbeschaffung und -ausgabe ist **nicht angebunden**. Es werden
weder Gutscheine gekauft noch Codes an einen Händler gesendet. Für den
Produktivbetrieb fehlt ein Anbieter oder ein Bestand vorab beschaffter Codes
sowie deren atomare, autorisierte Zuordnung im Backend. Echte Codes dürfen
nicht im Frontend generiert oder in öffentlich lesbare Produktdaten gelegt
werden. Die Anzeige kann serverseitige `Receipt.voucher`-Daten entgegennehmen;
die bestehenden Supabase-RPCs liefern diese derzeit noch nicht. Demo-Codes
werden in der authentifizierten Ansicht nicht als echte Codes angezeigt.

## ROI-Annahmen

- 100 Teilnehmende voreingestellt, 5 bis 1.000 einstellbar.
- Nutzen pro vermiedener Entsperrung: 0,50 bis 10 €; Software: zunächst 4 €.
- Persönliche Prämien folgen der Spielkurve bei täglich gleichem gewähltem
  Ziel: vier volle Wochen, 100 Punkte = 1 €, maximal 40 € pro Person.
- Vorsichtige Bonusobergrenze: maximal zehn Personen erhalten jeweils den
  vollen Erstplatzbonus, höchstens 100 € für das gesamte Team in vier Wochen.
- Die Nutzenrechnung verwendet 21 Arbeitstage, die Prämienplanung vier volle
  Wochen. Beides steht in den Annahmen; es ist keine genaue Monatsabrechnung.
- Kostendeckung wird für jeden möglichen ganzzahligen Rückgang mit den
  dazugehörigen variablen Prämienkosten neu geprüft.
- Tatsächliche Auszahlungen hängen von Einlösung und Einkaufspreisen ab.
  Ein Teamdurchschnitt reicht wegen der nichtlinearen Kurve nicht zur
  Berechnung tatsächlich verdienter Punkte.

Die 2,5 Stunden stammen aus einer Screen-Education-/InnovateMR-Befragung von
369 US-Führungskräften (2021), nicht aus objektiver Nutzungszeitmessung. Die
Befragten nahmen private Handynutzung in ihren Teams bereits wahr. Die Seite
verlinkt den Originalbericht und nennt die Einschränkung. 75 € pro Tag sind
ein Zeitwert bei angenommenen 30 €/Stunde, kein nachgewiesener Gewinnverlust.
