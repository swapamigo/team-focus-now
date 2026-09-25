import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmployerRoiCalculator from "./EmployerRoiCalculator";

vi.mock("@/i18n", () => ({ useI18n: () => ({ lang: "en" }) }));
vi.mock("@/hooks/useScrollDepth", () => ({ useScrollDepth: () => {} }));
afterEach(cleanup);

describe("ROI calculator interactions", () => {
  it("scales to 1,000 people while keeping the team bonus capped", () => {
    render(<EmployerRoiCalculator />);
    expect(screen.getByRole("spinbutton", { name: "Participating employees" })).toHaveValue(100);
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€9,750");
    expect(screen.getByRole("spinbutton", { name: "Software cost (€)" })).toHaveValue(4);
    fireEvent.change(screen.getByRole("slider", { name: "Participating employees" }), { target: { value: "1000" } });
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€98,400");
    expect(screen.getByTestId("roi-calculation")).toHaveTextContent("1,000 people × 10 fewer × 21 days × €0.50 = €105,000");
    expect(screen.getByTestId("roi-reward-pool")).toHaveTextContent("€100 extra");
  });

  it("updates rewards automatically when the target changes", () => {
    render(<EmployerRoiCalculator />);
    expect(screen.getByTestId("roi-rewards")).toHaveTextContent("€3.50");
    fireEvent.change(screen.getByRole("slider", { name: "Your target with TeamFokus" }), { target: { value: "8" } });
    expect(screen.getByTestId("roi-rewards")).toHaveTextContent("€41");
    expect(screen.getByTestId("roi-cost")).toHaveTextContent("€4,500");
    expect(screen.queryByRole("spinbutton", { name: /Rewards/ })).not.toBeInTheDocument();
  });

  it("withholds estimates for incomplete or invalid edits and resets cleanly", () => {
    render(<EmployerRoiCalculator />);
    const value = screen.getByRole("spinbutton", { name: "What does one phone distraction cost you?" });
    expect(value).toHaveAttribute("min", "0.5");
    for (const draft of ["", "0.49"]) {
      fireEvent.change(value, { target: { value: draft } });
      expect(screen.getByTestId("roi-net")).toHaveTextContent("—");
      expect(screen.getByTestId("roi-rewards")).toHaveTextContent("—");
      expect(screen.getByRole("alert")).toBeVisible();
    }
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Your target with TeamFokus" }), { target: { value: "51" } });
    expect(screen.getByRole("alert")).toHaveTextContent("The target cannot exceed");
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€9,750");
  });

  it("still shows a loss and unattainable break-even for an already low baseline", () => {
    render(<EmployerRoiCalculator />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Today · your estimate" }), { target: { value: "2" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Your target with TeamFokus" }), { target: { value: "0" } });
    expect(screen.getByTestId("roi-net")).toHaveTextContent("-€2,400");
    expect(screen.getByTestId("roi-break-even")).toHaveTextContent("even avoiding all the unlocks");
  });
});
