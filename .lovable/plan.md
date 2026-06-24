
# Plan: "Kaufen" → "Jetzt Call vereinbaren" mit Cal.com-Link

## Was sich ändert
Alle "Kaufen"-Buttons (die aktuell auf `/waitlist` zeigen) werden zu **"Jetzt Call vereinbaren"**. Beim Klick öffnet sich ein Dialog mit den gleichen Fragen wie heute (E-Mail-Erfassung, wie im bestehenden Demo-Dialog). Nach Absenden wird der Lead in der Datenbank gespeichert und der Manager direkt auf `https://cal.com/joelschoppe/teamfocus` weitergeleitet (neuer Tab), wo er den Termin mit dir bucht.

"Demo ansehen" bleibt unverändert.

## Konkrete Änderungen

### 1. Neue Komponente `src/components/landing/BookCallDialog.tsx`
- Basiert 1:1 auf `DemoLeadDialog.tsx` (gleiche Felder, gleiche Validierung, gleiche DSGVO-Zeile).
- Titel: "Jetzt Call vereinbaren" / Beschreibung: "E-Mail eingeben – im nächsten Schritt buchen Sie direkt einen Termin mit Joel."
- Speichert in `demo_leads` mit `source: "landing_book_call"`.
- Nach erfolgreichem Insert: `window.open("https://cal.com/joelschoppe/teamfocus", "_blank", "noopener,noreferrer")` und Dialog schließen.
- Zweiter Schritt (Manager/Mitarbeiter-Auswahl) entfällt – nach E-Mail direkt zu Cal.com.

### 2. `src/pages/Landing.tsx`
- State `bookCallOpen` ergänzen.
- "Kaufen"-Buttons ersetzen (Setup-Sektion Zeile 262, Final-CTA Zeile 293) durch:
  ```
  <Button onClick={() => setBookCallOpen(true)}>Jetzt Call vereinbaren</Button>
  ```
- `<BookCallDialog open={bookCallOpen} onOpenChange={setBookCallOpen} />` am Ende einbinden.

### 3. `src/components/landing/PricingSection.tsx`
- Beide "Auswählen"-Buttons (Monats- & Jahres-Tarif) ebenfalls auf "Jetzt Call vereinbaren" umstellen, da der Manager im Call den passenden Tarif bespricht. Statt `Link to="/waitlist"` ein `onClick`, das den Dialog öffnet – via neuer Prop `onBookCall` von Landing durchgereicht.

### 4. Keine Änderungen an
- `DemoLeadDialog` (bleibt für "Demo ansehen").
- `/waitlist`, `/akzeptanz`, `/vorteile` Routen.
- Backend (`demo_leads`-Tabelle existiert und passt – nur neuer `source`-Wert).

## Technische Details
- Cal.com-Link ist hardcoded in `BookCallDialog.tsx` als Konstante `CAL_URL`.
- Fallback: Wenn der Insert in `demo_leads` fehlschlägt (z. B. RLS), trotzdem auf Cal.com weiterleiten – Termin-Buchung darf nicht an einem DB-Fehler scheitern. Toast zeigt nur eine dezente Warnung.
- `target="_blank"` öffnet Cal.com in neuem Tab; Manager bleibt auf der Landingpage.
- Accessibility: Button mit `aria-label="Jetzt Call mit Gründer vereinbaren"`.

## Offene Frage
Soll der **Header-CTA** (`LandingHeader.tsx`, sofern dort ein "Kaufen"-/"Starten"-Button ist) ebenfalls auf "Call vereinbaren" umgestellt werden, oder bleibt der wie er ist? Wenn du nichts dazu sagst, lasse ich den Header unverändert.
