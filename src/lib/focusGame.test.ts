import { describe, expect, it } from "vitest";
import { bonusForRank, dailyPoints, rankPlayers, weekPoints } from "./focusGame";

describe("active-unlock rewards", () => {
  it("scores every individual unlock, with a cap at eight", () => {
    for (let count = 8; count < 120; count++) expect(dailyPoints(count)).toBeGreaterThan(dailyPoints(count + 1));
    expect(dailyPoints(9)).toBeCloseTo(183.40080864);
    expect(dailyPoints(8)).toBe(200);
    expect(dailyPoints(0)).toBe(200);
    for (const invalid of [null, -1, NaN, Infinity, 1.5]) expect(dailyPoints(invalid)).toBe(0);
  });
  it("does not treat missing coverage as a zero-unlock success", () => {
    const days = Array.from({ length: 5 }, (_, i) => ({ date: `2026-09-${7 + i}`, unlocks: 8, complete: true }));
    expect(weekPoints(days)).toBe(1000);
    expect(weekPoints([...days.slice(0, 4), { ...days[4], unlocks: 0, complete: false }])).toBe(800);
  });
  it("gives both first-place finishers 250, with dense ranks", () => {
    const ranked = rankPlayers([4, 4, 8].map((unlocks, i) => ({ id: `${i}`, alias: `Alias ${i}`, unlocks, ticket: `${i}` })));
    expect(ranked.map((p) => [p.rank, p.bonus])).toEqual([[1, 250], [1, 250], [2, 200]]);
  });
  it("limits qualification to ten people even if everybody ties", () => {
    const players = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, alias: `Alias ${i}`, unlocks: 20, ticket: `${29 - i}`.padStart(2, "0") }));
    const ranked = rankPlayers(players);
    expect(ranked.filter((p) => p.selected)).toHaveLength(10);
    expect(ranked.every((p) => p.rank === 1)).toBe(true);
    expect(ranked.slice(0, 10).every((p) => p.bonus === 250)).toBe(true);
    expect(ranked.slice(10).every((p) => p.bonus === 0)).toBe(true);
    expect(rankPlayers([...players].reverse())).toEqual(ranked);
    expect(bonusForRank(11)).toBe(0);
  });
  it("keeps duplicate inputs from occupying two slots", () => {
    const person = { id: "one", alias: "Alias", unlocks: 4, ticket: "a" };
    expect(rankPlayers([person, person])).toHaveLength(1);
  });
});
