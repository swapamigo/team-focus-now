import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? filesIn(p) : p.endsWith(".tsx") || p.endsWith(".ts") ? [p] : [];
  });
}

const MANAGER_SURFACES = ["src/pages/manager", "src/components/app/ManagerShell.tsx"];

// Tabellen mit individuellen bzw. aggregierten Nutzungsdaten.
const FORBIDDEN_TABLES = ["daily_team_summaries", "daily_user_summaries", "usage_events"];

describe("Manager-Oberfläche greift nicht auf Nutzungsdaten zu", () => {
  const files = MANAGER_SURFACES.flatMap((p) => (statSync(p).isDirectory() ? filesIn(p) : [p]));

  it("findet Manager-Dateien", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const table of FORBIDDEN_TABLES) {
    it(`referenziert "${table}" nirgends`, () => {
      const offenders = files.filter((f) => readFileSync(f, "utf8").includes(table));
      expect(offenders).toEqual([]);
    });
  }

  it("zeigt keine Rangliste oder Durchschnittsminuten", () => {
    const offenders = files.filter((f) => {
      const src = readFileSync(f, "utf8");
      return /avg_screen_minutes|Team-Ranking|avgMin\b/.test(src);
    });
    expect(offenders).toEqual([]);
  });
});
