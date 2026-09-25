import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DemoFocusTools from "./DemoFocusTools";
import { demoActions, useDemoState } from "./focusStore";

vi.mock("@/i18n", () => ({ useI18n: () => ({ lang: "en" }) }));
function Tools() { const state = useDemoState(); return <DemoFocusTools settings={state.focus} />; }
beforeEach(async () => { localStorage.clear(); await demoActions.reset(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("voluntary focus tools", () => {
  it("requires a choice, previews a pause and lets the employee stop immediately", async () => {
    render(<Tools />);
    expect(screen.getByRole("button", { name: "Start demo focus break" })).toBeDisabled();
    expect(screen.getByText(/Apps on your phone are not actually blocked/)).toBeVisible();
    fireEvent.click(screen.getByRole("switch", { name: "Select Instagram for your focus break" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Start demo focus break" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Start demo focus break" }));
    await screen.findByText("Your focus break is running.");
    fireEvent.click(screen.getByRole("button", { name: "Open Instagram · demo" }));
    expect(screen.getByRole("heading", { name: "Instagram is taking a break." })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "End focus break" }));
    await screen.findByRole("heading", { name: "Instagram is available." });
    expect(JSON.parse(localStorage.getItem("teamfokus-demo-v3")!).focus.until).toBeNull();
  });

  it("expires a session automatically using the saved end time, including on revisit", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-25T10:00:00Z"));
    await demoActions.selectFocusApp("TikTok", true);
    await demoActions.setFocusDuration(15);
    await demoActions.startFocus();
    const view = render(<Tools />);
    expect(screen.getByRole("timer")).toHaveTextContent("15:00");
    act(() => vi.advanceTimersByTime(15 * 60_000));
    expect(screen.getByText("All done. Your apps are available again.")).toBeVisible();
    view.unmount();
    render(<Tools />);
    expect(screen.getByRole("button", { name: "Start demo focus break" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Open TikTok · demo" }));
    expect(screen.getByRole("heading", { name: "TikTok is available." })).toBeVisible();
  });
});
