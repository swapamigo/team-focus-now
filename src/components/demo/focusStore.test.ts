import { beforeEach, describe, expect, it } from "vitest";
import { demoActions, demoEmployee } from "./focusStore";
import { roundPoints, weekPoints } from "@/lib/focusGame";
const state = () => JSON.parse(localStorage.getItem("teamfokus-demo-v3")!);
beforeEach(async () => { localStorage.clear(); document.documentElement.lang = "de"; await demoActions.reset(); });
describe("interactive sample week", () => {
  it("changes the score and credits the week only once, even on repeated clicks", async () => {
    const original = demoEmployee(state());
    await demoActions.setUnlocks(40);
    const changed = demoEmployee(state());
    expect(weekPoints(changed.days)).toBeLessThan(weekPoints(original.days));
    const expected = roundPoints(changed.balance + weekPoints(changed.days) + changed.ownRank!.bonus);
    await Promise.all([demoActions.settleWeek(), demoActions.settleWeek()]);
    expect(state().balance).toBe(expected);
    await demoActions.setUnlocks(0);
    expect(state().unlocks).toBe(40);
    expect(state().balance).toBe(expected);
  });
  it("shows default rewards and issues their receipts in the chosen language", async () => {
    document.documentElement.lang = "es";
    const reward = demoEmployee(state()).rewards[0];
    expect(reward.title).toBe("Vale de Amazon · 10 €");
    const receipt = await demoActions.redeem(reward.id, reward.points, "test-request");
    expect(receipt.title).toBe(reward.title);
    await demoActions.redeem(reward.id, reward.points, "test-request");
    expect(state().balance).toBe(600);
  });
});
