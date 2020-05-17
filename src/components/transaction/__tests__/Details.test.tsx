import React from "react";
import { render } from "@testing-library/react";
import { TansactionDetailsComponent, TansactionDetailsProps } from "../Details";

function renderTxDetailsComponent(props: Partial<TansactionDetailsProps> = {}) {
  const defaultProps: TansactionDetailsProps = {
    id: 1,
    address: "OnionV3Address",
    slate: "S14tE",
    type: "Sent",
    mType: "sent",
    message: "This is a Test",
    fee: "0.008000",
    date: "2020-01-01 00:00",
    onCancelTransactionButtonClickedCb: (transactionId: number) => {},
    onRepostTransactionButtonClickedCb: (transactionId: number) => {}
  };
  return render(<TansactionDetailsComponent {...defaultProps} {...props} />);
}

describe("<TansactionDetailsComponent />", () => {
  test("Init state", async () => {
    const { findByTestId } = renderTxDetailsComponent();
    const id = await findByTestId("id");
    const address = await findByTestId("address");
    const slate = await findByTestId("slate");
    const type = await findByTestId("type");
    const message = await findByTestId("message");
    const fee = await findByTestId("fee");
    const date = await findByTestId("date");
    expect(id.textContent).toBe("1");
    expect(address.textContent).toBe("OnionV3Address");
    expect(slate.textContent).toBe("S14tE");
    expect(type.textContent).toBe("Sent");
    expect(message.textContent).toBe("This is a Test");
    expect(fee.textContent).toBe("0.008000");
    expect(date.textContent).toBe("2020-01-01 00:00");
  });
});
