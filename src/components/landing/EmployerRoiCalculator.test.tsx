import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmployerRoiCalculator from "./EmployerRoiCalculator";

vi.mock("@/i18n", () => ({ useI18n: () => ({ lang: "en" }) }));
vi.mock("@/hooks/useScrollDepth", () => ({ useScrollDepth: () => {} }));
afterEach(cleanup);

describe("ROI calculator interactions", () => {
  it("supports a 1,000-person team and visibly explains the calculation", () => {
    render(<EmployerRoiCalculator />);
    expect(screen.getByRole("spinbutton", { name: "Participating employees" })).toHaveValue(100);
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€5,000");
    fireEvent.change(screen.getByRole("slider", { name: "Participating employees" }), { target: { value: "1000" } });
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€50,000");
    expect(screen.getByTestId("roi-calculation")).toHaveTextContent("1,000 people × 10 fewer × 21 days × €0.50 = €105,000");
  });

  it("withholds estimates for blank fields and impossible targets, then resets cleanly", () => {
    render(<EmployerRoiCalculator />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Reward budget (€)" }), { target: { value: "" } });
    expect(screen.getByTestId("roi-net")).toHaveTextContent("—");
    expect(screen.getByRole("alert")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Your target with TeamFokus" }), { target: { value: "51" } });
    expect(screen.getByRole("alert")).toHaveTextContent("The target cannot exceed");
    expect(screen.getByTestId("roi-net")).toHaveTextContent("—");
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("roi-net")).toHaveTextContent("+€5,000");
  });

  it("makes a loss and unattainable break-even explicit at a cent-level estimate", () => {
    render(<EmployerRoiCalculator />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "What does one phone distraction cost you?" }), { target: { value: "0.01" } });
    expect(screen.getByTestId("roi-net")).toHaveTextContent("-€5,290");
    expect(screen.getByTestId("roi-break-even")).toHaveTextContent("even avoiding all the unlocks");
  });
});
