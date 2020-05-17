import React from "react";
import { WalletBalanceComponent, WalletBalanceProps } from "../WalletBalance";
import { fireEvent, render, waitForElement } from "@testing-library/react";

function renderWalletBalanceComponent(props: Partial<WalletBalanceProps> = {}) {
  const defaultProps: WalletBalanceProps = {
    total: 0,
    spendable: 0,
    immature: 0,
    unconfirmed: 0,
    locked: 0
  };
  return render(<WalletBalanceComponent {...defaultProps} {...props} />);
}

describe("<WalletBalanceComponent />", () => {
  test("should display 0.000000", async () => {
    const { findByTestId } = renderWalletBalanceComponent();
    const spendable = await findByTestId("spendable");
    expect(spendable.textContent).toContain("0.000000");
  });
  test("should display 1.000000 for all values", async () => {
    const { findByTestId } = renderWalletBalanceComponent({
      total: 1,
      spendable: 1,
      immature: 1,
      unconfirmed: 1,
      locked: 1
    });
    const spendable = await findByTestId("spendable");
    expect(spendable.textContent).toContain("1.000000");
  });
});
