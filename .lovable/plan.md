## Ziel
Landing-Page emotionaler, bildlicher und mobil-optimiert. Echter Demo-Mode ohne Login. Realistischer (aber fake) Bezahlflow. Lead-Capture an mehreren Stellen + Admin-Übersicht für eingehende Emails.

## 1 — Header (sticky, mobil-tauglich)
- Neue Navigation: **ROI · So funktioniert's · Datenschutz · Preise · FAQ**
- CTA rechts: „Demo starten" (öffnet DemoLeadDialog), Sekundär „Anmelden"
- Mobile: Hamburger-Drawer
- Anchor-IDs an allen Sektionen ergänzen

## 2 — Hero / Reihenfolge
- Hero-Bild (Software auf Handy+Laptop) **entfernen**
- Direkt nach Hero: **SocialProofStrip** (kompakt) – „Vertraut von" + 6 fiktive Firmen-Logos/Namen + Button „Bewertungen ansehen" → öffnet Dialog mit den Testimonials
- Danach: **ROI-Rechner** (bereits vorhanden)
- Sektion „Was Sie wirklich gewinnen" **löschen**

## 3 — Belohnungen
- Neue Sektion **„Empfohlene Belohnungen"** mit:
  - 1 h später am Montag / 1 h früher am Freitag (als Best-Practice hervorgehoben)
  - Essensgutschein
  - Besserer Firmenwagen (rotierend)
  - Team-Lunch, Fokus-Champion-Badge
- FAQ ergänzen mit dieser Info + Zyklus-Hinweis

## 4 — Preise (realistisch wirkender Flow)
- Preis auf **4,99 €/Mitarbeiter/Monat**
- Jahresabo: **3,99 €/Mitarbeiter/Monat**
- Neuer **/checkout** Flow:
  1. Plan wählen (monatlich / jährlich)
  2. Slider Mitarbeiteranzahl (1–500) → Live-Summe
  3. Bezahlmethoden-Auswahl (Karte, SEPA, PayPal, Rechnung) — nur visuell
  4. Button „Jetzt kaufen"
- Nach Klick → **/checkout/success** Seite mit Wahrheit („noch in Entwicklung, im nächsten Monat live") + E-Mail-Capture (in `demo_leads`, source=`waitlist`)

## 5 — Demo-Mode (ohne Login)
- DemoLeadDialog: Email eingeben → in `demo_leads` speichern → Auswahl **Mitarbeiter-Sicht / Manager-Sicht**
- Neue Route `/demo/employee` und `/demo/manager` – nutzen Mock-Daten via React Context (kein Auth nötig)
- Auto-Simulation: beim Mount sofort 365-Tage-Mock im Frontend generieren (kein Backend-Call)
- Button „Demo-Jahr neu generieren" bleibt
- Persistenter Banner oben: „Demo-Modus aktiv — **Zum Kauf**" → /checkout
- Mock-Daten zeigen klaren Verbesserungstrend

## 6 — Admin Email-Übersicht
- Neue Route `/manager/leads` (nur sichtbar für eigene super-admin oder einfach geschützt via existierender Manager-Rolle, beschränkt auf Owner-Email)
- Listet alle `demo_leads` (email, source, created_at)
- Verlinkt im Manager-Sidebar als „Demo-Leads"

## 7 — Umfrage (im Checkout-Success)
- Auf Erfolgs-/Wahrheits-Seite kleine Umfrage:
  - Slider 1–10: „War Ihnen das Smartphone-Problem so bewusst?"
  - Text: Branche/Bereich der Mitarbeiter
  - Slider 1–1000: Mitarbeiteranzahl
  - Textarea: Verbesserungsvorschläge
- Speicherung in neuer Tabelle `feedback_responses`

## 8 — Mobile & Visual Polish
- Hero, Sektionen, Cards: bessere Mobile-Spacings, größere Icons, mehr Bildhaftigkeit
- Bestehende Bilder (`employee-focused`, `employee-stressed`) prominenter einsetzen
- Sektion HowItWorks: ein neues generiertes Bild (Team-Duell)
- Cycle-Hinweis: „Wöchentlich bis monatlich – frei wählbar"

## 9 — DB-Migrationen
- `demo_leads`: bereits vorhanden, ggf. `source` erweitern
- Neu: `feedback_responses` (email nullable, awareness_score int, sector text, employee_count int, suggestion text)
- Beide mit RLS: insert für anon (Lead-Capture), select nur für service_role + spezifische Owner-Email

## 10 — Konsistenz
- Alle CTAs einheitlich auf neuen DemoDialog gerichtet
- Preise (4,99 / 3,99) überall identisch
- Zyklus-Text „Wöchentlich bis monatlich" überall

## Technische Notizen
- DemoContext (React Context) liefert Mock-Daten an bestehende Dashboard-Komponenten — bestehende Pages werden NICHT dupliziert, sondern via Wrapper unter `/demo/*` mit Mock-Datenquelle gerendert
- Falls Dashboard-Pages direkt `supabase` aufrufen, kapseln wir das mit einem `useDataSource()` Hook der zwischen real/mock unterscheidet — Minimal-invasiv: nur Top-Level Dashboard-Komponenten anpassen, nicht alle Subviews
