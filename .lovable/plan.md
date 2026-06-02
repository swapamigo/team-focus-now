## Ziel
Premium-Refresh der Landing Page, klarerer Mitarbeiter-Schutz, schlankere App-Navigation, Onboarding-Tour, und ein ROI-Calculator auf der Landing Page. Google-Login bleibt unverändert (funktioniert bereits).

## 1. Landing Page Überarbeitung (`src/pages/Landing.tsx`)

**Neue Positionierung:** "Die mitarbeiterfreundlichste Bossware. Motivation statt Kontrolle."

Sektionen (in dieser Reihenfolge):
1. **Hero** – Headline: „Mehr Fokus. Weniger Stress. Höherer Umsatz." Sub: motivationsbasiert statt überwachend. Zwei CTAs (Demo testen / Workspace erstellen).
2. **„Anders als jede Bossware"** – 3-Spalten-Vergleich: Klassische Bossware (Screenshots, Keylogger, Stress) vs. Team Focus (Belohnungen, Privatsphäre, Motivation).
3. **So einfach geht's** – 3 Steps: Workspace anlegen (1 Min) → Mitarbeiter per Link einladen → fertig. Betont „keine IT nötig, in 5 Minuten live".
4. **Features** – Belohnungssystem, Team-Challenges, anonyme Aggregat-Statistiken, Fokus-Zeiten, Whitelist.
5. **ROI-Calculator** (neue Komponente, siehe Punkt 2).
6. **Privatsphäre-Block** – „Keine Screenshots, keine Tastatureingaben, nur während Arbeitszeit, aggregierte Daten."
7. **Pricing** – 7 €/Mitarbeiter/Monat.
8. **Footer** mit Impressum/Datenschutz-Platzhaltern.

## 2. ROI-Calculator (neue Komponente `src/components/landing/RoiCalculator.tsx`)

Inputs:
- Anzahl Mitarbeiter (Slider/Input, default 25)
- Stundensatz pro Mitarbeiter (€, default 35)

Berechnungen:
- Verschwendete Stunden/Jahr = `mitarbeiter × 720`
- Verlust/Jahr = `verschwendeteStunden × stundensatz`
- Ersparnis bei -30% Bildschirmzeit = `verlust × 0.30`
- Hinweise (kursiv): „tatsächlicher Verlust höher durch Fehler/geringeren Fokus"; „Ersparnis in der Praxis höher".

Visualisierung: zwei große Zahlenkarten (Verlust rot/muted, Ersparnis grün/primary), animierter Count-up.

## 3. Onboarding-Tour nach Login (neue Komponente `src/components/app/OnboardingTour.tsx`)

Modal-Overlay mit 4 Slides nach erstem App-Aufruf (Flag in `localStorage` pro user_id):
- Slide 1: „Willkommen bei Team Focus"
- Slide 2: „Dein Dashboard – sieh deinen Fokus-Fortschritt"
- Slide 3: „Privatsphäre – nur du siehst deine Daten"
- Slide 4: „Belohnungen & Challenges – motiviert besser arbeiten"

Wird in `AppShell` und `ManagerShell` eingebunden.

## 4. Mitarbeiter-Privatsphäre verstärken

- `src/pages/employee/Dashboard.tsx`: Banner oben „🔒 Privatsphäre garantiert – nur du siehst diese Daten. Dein Manager erhält ausschließlich anonyme Team-Statistiken."
- `src/pages/employee/Stats.tsx`: gleicher Hinweis kompakt.
- `src/pages/employee/Settings.tsx`: ausführlicher Privatsphäre-Abschnitt.

## 5. Manager: keine E-Mails anzeigen

- `src/pages/manager/Members.tsx`: E-Mail-Spalte entfernen, nur Display-Name + Team.
- `src/pages/manager/Invites.tsx`: optionale E-Mail-Eingabe entfernen (nur Code-basierte Einladung).

## 6. Notifications entfernen

- Route `/app/notifications` entfernen aus `App.tsx`.
- `MobileNav.tsx`: Notification-Tab raus.
- `src/pages/employee/Notifications.tsx`: Datei wird obsolet (kann bleiben, nicht mehr verlinkt – sauber: löschen).
- Glocken-Icons aus Headern entfernen.

## 7. Arbeitszeit-Hinweis

- Sichtbarer Hinweis im Employee Dashboard und in Settings: „Messung erfolgt ausschließlich während deiner hinterlegten Arbeitszeit."
- Backend-Logik (Simulator) bereits konform; nur UI-Text.

## 8. Design Polish

- Keine Dark-Mode-Toggle (entfernen falls vorhanden).
- Karten: weichere Schatten, mehr Whitespace, konsistente `rounded-2xl`.
- Mobile-Bottom-Nav: Active-Pill, größere Touch-Targets.

## 9. Dateien-Übersicht

**Neu:**
- `src/components/landing/RoiCalculator.tsx`
- `src/components/app/OnboardingTour.tsx`
- `src/components/landing/Footer.tsx`

**Geändert:**
- `src/pages/Landing.tsx` (Hero + Vergleich + Calculator + Footer)
- `src/App.tsx` (Notifications-Route raus)
- `src/components/app/MobileNav.tsx` (Notifications-Tab raus)
- `src/components/app/AppShell.tsx` (+ OnboardingTour)
- `src/components/app/ManagerShell.tsx` (+ OnboardingTour, evtl. Glocke raus)
- `src/pages/employee/Dashboard.tsx` (Privatsphäre-Banner)
- `src/pages/employee/Stats.tsx` (Privatsphäre-Hinweis)
- `src/pages/employee/Settings.tsx` (Privatsphäre-Abschnitt)
- `src/pages/manager/Members.tsx` (E-Mail raus)
- `src/pages/manager/Invites.tsx` (E-Mail-Feld raus)

**Gelöscht:**
- `src/pages/employee/Notifications.tsx`

## Nicht im Scope
- Google Auth (funktioniert bereits)
- Datenbank-Schema-Änderungen
- Edge Functions / Simulator-Logik (Arbeitszeit-Filterung bereits in Daten korrekt)
