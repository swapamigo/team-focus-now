import { describe, expect, it } from "vitest";
import { calculateEmployerRoi, ROI_EXAMPLE, ROI_WORKDAYS } from "./employerRoi";

describe("employer ROI scenarios", () => {
  it("explains the default 100-person scenario using current and target unlocks", () => {
    const result = calculateEmployerRoi(ROI_EXAMPLE)!;
    expect(ROI_WORKDAYS).toBe(21);
    expect(result.fewerUnlocks).toBe(10);
    expect(result.avoidedUnlocks).toBe(21000);
    expect(result.benefit).toBe(10500);
    expect(result.cost).toBe(5500);
    expect(result.net).toBe(5000);
    expect(result.roi).toBeCloseTo(90.90909);
    expect(Math.ceil(result.breakEvenUnlocks!)).toBe(6);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 45 })!.net).toBeLessThan(0);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 44 })!.net).toBeGreaterThan(0);
  });

  it("scales to 1,000 people without changing the return percentage", () => {
    const result = calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 1000 })!;
    expect(result.net).toBe(50000);
    expect(result.cost).toBe(55000);
    expect(result.roi).toBe(calculateEmployerRoi(ROI_EXAMPLE)!.roi);
  });

  it("accounts for discounted rewards and values as small as one cent", () => {
    const discounted = calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 40 })!;
    expect(discounted.cost).toBe(4500);
    expect(discounted.net).toBe(6000);
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, valuePerUnlock: 0.01 })!.benefit).toBe(210);
  });

  it("shows losses and undefined ratios without inventing a positive result", () => {
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 50 })!.roi).toBe(-100);
    const noValue = calculateEmployerRoi({ ...ROI_EXAMPLE, valuePerUnlock: 0 })!;
    expect(noValue.net).toBe(-5500);
    expect(noValue.breakEvenUnlocks).toBeNull();
    const free = calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 0, softwarePerPerson: 0 })!;
    expect(free.roi).toBeNull();
    expect(free.breakEvenUnlocks).toBe(0);
    const unattainable = calculateEmployerRoi({ ...ROI_EXAMPLE, currentUnlocks: 2, targetUnlocks: 0 })!;
    expect(unattainable.breakEvenUnlocks).toBeGreaterThan(2);
  });

  it("rejects impossible reductions and out-of-range inputs", () => {
    for (const [key, value] of Object.entries({ employees: 1001, currentUnlocks: -1, targetUnlocks: 51, valuePerUnlock: NaN, rewardsPerPerson: Infinity, softwarePerPerson: -5 })) {
      expect(calculateEmployerRoi({ ...ROI_EXAMPLE, [key]: value })).toBeNull();
    }
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 4 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 5.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, targetUnlocks: 1.5 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, currentUnlocks: 151 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, valuePerUnlock: 10.01 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, rewardsPerPerson: 50.01 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, softwarePerPerson: 1001 })).toBeNull();
    expect(calculateEmployerRoi({ ...ROI_EXAMPLE, employees: 5, currentUnlocks: 0, targetUnlocks: 0 })!.benefit).toBe(0);
  });
});
