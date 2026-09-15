import { describe, expect, it } from "vitest";
import { calculateEmployerRoi, ROI_EXAMPLE } from "./employerRoi";

describe("employer ROI scenarios", () => {
  it("accounts for software and rewards before calculating ROI", () => {
    // 25 × 10 × 20 = 5,000 avoided unlocks, valued by the user at €0.50 each.
    const result = calculateEmployerRoi(ROI_EXAMPLE)!;
    expect(result.avoidedUnlocks).toBe(5000);
    expect(result.benefit).toBe(2500);
    expect(result.cost).toBe(1375);
    expect(result.net).toBe(1125);
    expect(result.roi).toBeCloseTo(81.8181818);
    expect(result.breakEvenUnlocks).toBe(5.5);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, fewerUnlocks: 5 })!.net).toBeLessThan(0);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, fewerUnlocks: 6 })!.net).toBeGreaterThan(0);
  });

  it("uses the company's purchase cost, and counts shared overhead only once", () => {
    const discounted = calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 40 })!;
    expect(discounted.cost).toBe(1125);
    expect(discounted.net).toBe(1375);
    const withOverhead = calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 40, otherCosts: 300 })!;
    expect(withOverhead.net).toBe(1075);
  });

  it("shows losses and undefined ratios without inventing a positive result", () => {
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, fewerUnlocks: 0 })!.roi).toBe(-100);
    const noValue = calculateEmployerRoi({ ...ROI_EXAMPLE, valuePerUnlock: 0 })!;
    expect(noValue.net).toBe(-1375);
    expect(noValue.breakEvenUnlocks).toBeNull();
    const free = calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 0, softwarePerPerson: 0 })!;
    expect(free.roi).toBeNull();
    expect(free.breakEvenUnlocks).toBe(0);
  });

  it("does not issue estimates from invalid inputs", () => {
    for (const [key, value] of Object.entries({ employees: 0, fewerUnlocks: -1, valuePerUnlock: NaN, workdays: 32, rewardsPerPerson: Infinity, softwarePerPerson: -5, otherCosts: -1 })) {
      expect(calculateEmployerRoi({ ...ROI_EXAMPLE, [key]: value })).toBeNull();
    }
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, workdays: 20.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 5.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, fewerUnlocks: 1.5 })).toBeNull();
  });
});
