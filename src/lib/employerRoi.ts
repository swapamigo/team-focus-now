/** An editable business scenario, independent of measured unlocks and reward points. */
export type RoiAssumptions = {
  employees: number;
  currentUnlocks: number;
  targetUnlocks: number;
  valuePerUnlock: number;
  rewardsPerPerson: number;
  softwarePerPerson: number;
};

// Rounded calendar workdays/month (about 250/year), before leave and absences.
// A fixed planning assumption, not an employee attendance measurement.
export const ROI_WORKDAYS = 21;

// Illustrative inputs only: these are neither measured outcomes nor a price offer.
export const ROI_EXAMPLE: RoiAssumptions = {
  employees: 100,
  currentUnlocks: 50,
  targetUnlocks: 40,
  valuePerUnlock: 0.5,
  rewardsPerPerson: 50,
  softwarePerPerson: 5,
};

export function calculateEmployerRoi(input: RoiAssumptions) {
  if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0)) return null;
  if (![input.employees, input.currentUnlocks, input.targetUnlocks].every(Number.isInteger)) return null;
  if (input.employees < 5 || input.employees > 1000 || input.currentUnlocks > 150 || input.targetUnlocks > 150) return null;
  if (input.targetUnlocks > input.currentUnlocks || input.valuePerUnlock > 10 || input.rewardsPerPerson > 50 || input.softwarePerPerson > 1000) return null;

  const fewerUnlocks = input.currentUnlocks - input.targetUnlocks;
  const avoidedUnlocks = input.employees * fewerUnlocks * ROI_WORKDAYS;
  const benefit = avoidedUnlocks * input.valuePerUnlock;
  const cost = input.employees * (input.rewardsPerPerson + input.softwarePerPerson);
  const net = benefit - cost;
  const valuePerDailyUnlock = input.employees * ROI_WORKDAYS * input.valuePerUnlock;

  return {
    fewerUnlocks,
    avoidedUnlocks,
    benefit,
    cost,
    net,
    roi: cost > 0 ? net / cost * 100 : null,
    breakEvenUnlocks: cost === 0 ? 0 : valuePerDailyUnlock > 0 ? cost / valuePerDailyUnlock : null,
  };
}
