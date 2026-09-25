import { dailyPoints, MAX_BONUS, roundPoints, TOP_LIMIT } from "./focusGame";

/** Planning inputs, not measured outcomes. Rewards follow the game's points curve. */
export type RoiAssumptions = {
  employees: number;
  currentUnlocks: number;
  targetUnlocks: number;
  valuePerUnlock: number;
  softwarePerPerson: number;
};

// Rounded calendar workdays/month (about 250/year), before leave and absences.
// A fixed planning assumption, not an employee attendance measurement.
export const ROI_WORKDAYS = 21;
// The public €50 reward illustration covers four complete five-day rounds.
const REWARD_WEEKS = 4;
const POINTS_PER_EURO = 100;

// Illustrative inputs only: these are neither measured outcomes nor a price offer.
export const ROI_EXAMPLE: RoiAssumptions = {
  employees: 100,
  currentUnlocks: 50,
  targetUnlocks: 40,
  valuePerUnlock: 0.5,
  softwarePerPerson: 4,
};

function scenarioCosts(input: RoiAssumptions, target: number) {
  // Each participant reaches the selected daily target on every workday.
  // Round weekly credits as in the game. This is not an actual invoice derived
  // from a measured team average: the points curve is nonlinear.
  const personalPerPerson = roundPoints(dailyPoints(target) * 5) * REWARD_WEEKS / POINTS_PER_EURO;
  // Conservative pool: all selected players tie for first, with the full bonus.
  // At most TEN people, even for 100 or 1,000 participants.
  const bonusPool = Math.min(input.employees, TOP_LIMIT) * MAX_BONUS * REWARD_WEEKS / POINTS_PER_EURO;
  const rewardCost = roundPoints(input.employees * personalPerPerson + bonusPool);
  const softwareCost = roundPoints(input.employees * input.softwarePerPerson);
  return { personalPerPerson, bonusPool, rewardCost, softwareCost,
    rewardsPerPerson: rewardCost / input.employees, cost: roundPoints(rewardCost + softwareCost) };
}

export function calculateEmployerRoi(input: RoiAssumptions) {
  if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0)) return null;
  if (![input.employees, input.currentUnlocks, input.targetUnlocks].every(Number.isInteger)) return null;
  if (input.employees < 5 || input.employees > 1000 || input.currentUnlocks > 150 || input.targetUnlocks > 150) return null;
  if (input.targetUnlocks > input.currentUnlocks || input.valuePerUnlock < 0.5 || input.valuePerUnlock > 10 || input.softwarePerPerson > 1000) return null;

  const fewerUnlocks = input.currentUnlocks - input.targetUnlocks;
  const avoidedUnlocks = input.employees * fewerUnlocks * ROI_WORKDAYS;
  const benefit = roundPoints(avoidedUnlocks * input.valuePerUnlock);
  const costs = scenarioCosts(input, input.targetUnlocks);
  const net = roundPoints(benefit - costs.cost);
  // Recompute rewards at each candidate target; they are not a fixed budget.
  let breakEvenUnlocks: number | null = null;
  for (let reduction = 0; reduction <= input.currentUnlocks; reduction++) {
    const candidateBenefit = roundPoints(input.employees * reduction * ROI_WORKDAYS * input.valuePerUnlock);
    if (candidateBenefit >= scenarioCosts(input, input.currentUnlocks - reduction).cost) {
      breakEvenUnlocks = reduction;
      break;
    }
  }
  return { fewerUnlocks, avoidedUnlocks, benefit, ...costs, net,
    roi: costs.cost > 0 ? net / costs.cost * 100 : null, breakEvenUnlocks };
}
