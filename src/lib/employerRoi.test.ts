import { describe, expect, it } from "vitest";
import { calculateEmployerRoi, ROI_EXAMPLE, ROI_WORKDAYS } from "./employerRoi";

describe("employer ROI scenarios", () => {
  it("uses the points curve, €4 software and a capped team pool for 100 people", () => {
    const result = calculateEmployerRoi(ROI_EXAMPLE)!;
    expect(ROI_WORKDAYS).toBe(21);
    expect(result.fewerUnlocks).toBe(10);
    expect(result.avoidedUnlocks).toBe(21000);
    expect(result.benefit).toBe(10500);
    expect(result.personalPerPerson).toBe(2.5);
    expect(result.bonusPool).toBe(100);
    expect(result.rewardsPerPerson).toBe(3.5);
    expect(result.cost).toBe(750);
    expect(result.net).toBe(9750);
    expect(result.roi).toBe(1300);
  });

  it("increases rewards at every lower target above eight, with a €40 personal cap", () => {
    let previous = calculateEmployerRoi(ROI_EXAMPLE)!.rewardCost;
    for (let targetUnlocks = 39; targetUnlocks >= 8; targetUnlocks--) {
      const next = calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks })!;
      expect(next.rewardCost).toBeGreaterThan(previous);
      previous = next.rewardCost;
    }
    const maximum = calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 8 })!;
    expect(maximum.personalPerPerson).toBe(40);
    expect(maximum.rewardCost).toBe(4100);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 0 })!.rewardCost).toBe(maximum.rewardCost);
  });

  it("never gives a full team bonus to more than ten participants", () => {
    const large = calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 1000 })!;
    expect(large.bonusPool).toBe(100);
    expect(large.cost).toBe(6600);
    expect(large.net).toBe(98400);
    const small = calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 5, targetUnlocks: 8 })!;
    expect(small.bonusPool).toBe(50);
    expect(small.rewardsPerPerson).toBe(50);
  });

  it("recomputes variable costs to find the first attainable break-even target", () => {
    for (const currentUnlocks of [3, 8, 16, 50, 150]) {
      const input = { ...ROI_EXAMPLE, currentUnlocks, targetUnlocks: 0 };
      const result = calculateEmployerRoi(input)!;
      const outcomes = Array.from({ length: currentUnlocks + 1 }, (_, reduction) =>
        calculateEmployerRoi({ ...input, targetUnlocks: currentUnlocks - reduction })!.net);
      const first = outcomes.findIndex((net) => net >= 0);
      expect(result.breakEvenUnlocks).toBe(first < 0 ? null : first);
    }
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 50 })!.roi).toBe(-100);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, currentUnlocks: 2, targetUnlocks: 0 })!.breakEvenUnlocks).toBeNull();
  });

  it("rejects values below 50 cents, invalid counts and impossible targets", () => {
    for (const [key, value] of Object.entries({ employees: 1001, currentUnlocks: -1, targetUnlocks: 51, valuePerUnlock: NaN, softwarePerPerson: Infinity })) {
      expect(calculateEmployerRoi({ ...ROI_EXAMPLE, [key]: value })).toBeNull();
    }
    for (const valuePerUnlock of [0, 0.49, 10.01]) expect(calculateEmployerRoi({ ...ROI_EXAMPLE, valuePerUnlock })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 4 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 5.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 1.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, currentUnlocks: 151 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, softwarePerPerson: 1001 })).toBeNull();
  });
});
