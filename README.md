# TeamFocus

Prototyp einer gamifizierten Web-App zur Reduktion von Smartphone-Ablenkung 
am Arbeitsplatz unter Wahrung der Privatsphäre.

Bachelorarbeit Joel Schöppe, FH Technikum Wien, 2026.
Studiengang Mechatronik und Robotik.
Betreuer: Hr. Aburaia.

## Tech-Stack
- Vite, React 18, TypeScript, Tailwind, shadcn/ui
- Supabase (PostgreSQL, Auth, Edge Functions in Deno)
- Row-Level-Security auf Datenbankebene

## Installation
- `npm install`
- `.env` aus `.env.example` kopieren und Supabase-Credentials eintragen
- `npm run dev`

## Demo
Website und Prototyp: https://team-focus-now.vercel.app

Änderungen auf dem GitHub-Branch `main` werden automatisch über Vercel
veröffentlicht. Dafür ist kein Publish-Schritt in Lovable notwendig.
Die Verbindung der eigenen Domain ist in [docs/deployment.md](docs/deployment.md) beschrieben.

## Abgabestand
Tag `v1.0-abgabe` markiert den Stand der Bachelorarbeit.
