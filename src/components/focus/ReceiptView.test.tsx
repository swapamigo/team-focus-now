import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReceiptView } from "./Shared";
import type { Receipt } from "@/lib/focusGame";

vi.mock("@/i18n", () => ({ useI18n: () => ({ lang: "en" }) }));
afterEach(cleanup);
const receipt: Receipt = { code: "TF-DEMO-RECEIPT", alias: "Falcon", title: "Amazon voucher · €10", description: "", created_at: "2026-09-25T10:00:00Z", fulfilled_at: "2026-09-25T10:00:00Z", voucher: { code: "DEMO-NOT-VALID-12345678", demo: true } };

describe("direct voucher delivery", () => {
  it("shows an explicitly invalid demo code and copies just that code", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<ReceiptView receipt={receipt} demo />);
    expect(screen.getByTestId("voucher-code")).toHaveTextContent(receipt.voucher!.code);
    expect(screen.getByText(/sample code is not valid/, { selector: "p" })).toBeVisible();
    expect(screen.queryByText(/Share this receipt with your manager/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(receipt.voucher!.code));
  });
  it("never presents a demo code as a live voucher", () => {
    render(<ReceiptView receipt={receipt} demo={false} />);
    expect(screen.queryByTestId("voucher-code")).not.toBeInTheDocument();
    expect(screen.getByText(/Share this receipt with your manager/)).toBeVisible();
  });
  it("keeps collection receipts working for rewards without a digital code", () => {
    render(<ReceiptView receipt={{ ...receipt, voucher: undefined, fulfilled_at: null }} demo />);
    expect(screen.getByText(/Share this receipt with your manager/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Save receipt" })).toBeVisible();
  });
});
