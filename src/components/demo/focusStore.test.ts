import { beforeEach, describe, expect, it } from "vitest";
import { demoActions, demoEmployee, demoManager } from "./focusStore";
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
    expect(receipt.voucher?.code).toMatch(/^DEMO-NOT-VALID-/);
    expect(receipt.voucher?.demo).toBe(true);
    expect(receipt.fulfilled_at).toBe(receipt.created_at);
    const retried = await demoActions.redeem(reward.id, reward.points, "test-request");
    expect(retried.voucher).toEqual(receipt.voucher);
    expect(demoEmployee(state()).receipts[0].voucher).toEqual(receipt.voucher);
    expect(state().balance).toBe(600);
  });
  it("keeps physical rewards on the collection flow and cannot overspend", async () => {
    const receipt = await demoActions.redeem("merch-hoodie", 1500, "hoodie");
    expect(receipt.voucher).toBeUndefined();
    expect(receipt.fulfilled_at).toBeNull();
    await expect(demoActions.redeem("amazon", 1000, "no-funds")).rejects.toThrow("insufficient_points");
    expect(state().receipts).toHaveLength(1);
    expect(state().balance).toBe(100);
  });
  it("starts tools switched off, keeps them private, and does not award points", async () => {
    const before = state();
    expect(before.focus.apps).toEqual([]);
    await demoActions.startFocus();
    expect(state().focus.until).toBeNull();
    await demoActions.selectFocusApp("Instagram", true);
    await demoActions.setFocusDuration(15);
    await demoActions.startFocus();
    const end = state().focus.until;
    expect(end).toBeGreaterThan(Date.now());
    await demoActions.startFocus();
    expect(state().focus.until).toBe(end);
    expect(demoManager(state())).toEqual(demoManager(before));
    expect(demoEmployee(state())).toEqual(demoEmployee(before));
    await demoActions.stopFocus();
    expect(state().focus.until).toBeNull();
    expect(state().balance).toBe(before.balance);
  });
  it("migrates previous demo storage without losing rewards, balance or receipts", async () => {
    const receipt = await demoActions.redeem("amazon", 1000, "old-purchase");
    const old = state();
    delete old.focus;
    delete old.receipts[0].voucher;
    localStorage.setItem("teamfokus-demo-v3", JSON.stringify(old));
    await demoActions.selectFocusApp("YouTube", true);
    expect(state().balance).toBe(600);
    expect(state().receipts[0].code).toBe(receipt.code);
    expect(state().focus.apps).toEqual(["YouTube"]);
    expect(state().focus.until).toBeNull();
  });
  it("translates rewards immediately, without waiting for the document language effect", () => {
    expect(document.documentElement.lang).toBe("de");
    expect(demoEmployee(state(), "en").rewards[0].title).toBe("Amazon voucher · €10");
    expect(demoManager(state(), "es").rewards[0].title).toBe("Vale de Amazon · 10 €");
  });
});
