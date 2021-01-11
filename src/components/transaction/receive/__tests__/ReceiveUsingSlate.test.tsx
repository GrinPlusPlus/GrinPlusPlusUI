import {
  ReceiveUsingSlateComponent,
  ReceiveUsingSlateProps,
} from "../ReceiveUsingSlate";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

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
    const box = await findByTestId("slatepack-box");
    expect(box.textContent).toContain("");
  });
  test("should update slate", async () => {
    const { findByTestId } = renderReceiveSlateComponent({
      slate: "THIS IS A TEST",
    });
    const box = await findByTestId("slatepack-box");
    expect(box.textContent).toContain("THIS IS A TEST");
  });
});
