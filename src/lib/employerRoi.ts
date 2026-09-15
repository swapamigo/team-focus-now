/** An editable business scenario, independent of measured unlocks and reward points. */
export type RoiAssumptions = {
  employees: number;
  fewerUnlocks: number;
  valuePerUnlock: number;
  workdays: number;
  rewardsPerPerson: number;
  softwarePerPerson: number;
  otherCosts: number;
};

// Illustrative inputs only: these are neither measured outcomes nor a price offer.
export const ROI_EXAMPLE: RoiAssumptions = {
  employees: 25,
  fewerUnlocks: 10,
  valuePerUnlock: 0.5,
  workdays: 20,
  rewardsPerPerson: 50,
  softwarePerPerson: 5,
  otherCosts: 0,
};

export function calculateEmployerRoi(input: RoiAssumptions) {
  if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0)) return null;
  if (!Number.isInteger(input.employees) || !Number.isInteger(input.workdays) || !Number.isInteger(input.fewerUnlocks)) return null;
  if (input.employees < 1 || input.workdays < 1 || input.workdays > 31) return null;

  const avoidedUnlocks = input.employees * input.fewerUnlocks * input.workdays;
  const benefit = avoidedUnlocks * input.valuePerUnlock;
  const cost = input.employees * (input.rewardsPerPerson + input.softwarePerPerson) + input.otherCosts;
  const net = benefit - cost;
  const valuePerDailyUnlock = input.employees * input.workdays * input.valuePerUnlock;

  return {
    avoidedUnlocks,
    benefit,
    cost,
    net,
    roi: cost > 0 ? net / cost * 100 : null,
    breakEvenUnlocks: cost === 0 ? 0 : valuePerDailyUnlock > 0 ? cost / valuePerDailyUnlock : null,
  };
}
