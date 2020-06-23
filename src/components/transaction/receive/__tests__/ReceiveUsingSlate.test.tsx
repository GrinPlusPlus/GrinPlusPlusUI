import {
  ReceiveUsingSlateComponent,
  ReceiveUsingSlateProps,
} from "../ReceiveUsingSlate";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

function renderReceiveSlateComponent(
  props: Partial<ReceiveUsingSlateProps> = {}
) {
  const defaultProps: ReceiveUsingSlateProps = {
    slate: "",
  };
  return render(<ReceiveUsingSlateComponent {...defaultProps} {...props} />);
}

describe("<ReceiveSlateComponent />", () => {
  test("should display a blank box", async () => {
    const { findByTestId } = renderReceiveSlateComponent();
    const box = await findByTestId("slate-box");
    expect(box.textContent).toContain("");
  });
  test("should update slate", async () => {
    const { findByTestId } = renderReceiveSlateComponent({
      slate: "THIS IS A TEST",
    });
    const box = await findByTestId("slate-box");
    expect(box.textContent).toContain("THIS IS A TEST");
  });
});
