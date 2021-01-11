import { AlertComponent, AlertProps } from "../Alert";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

function renderLogsComponent(props: Partial<AlertProps> = {}) {
  function changeMessage(message: string | undefined) {
    props.message = message;
  }
  const defaultProps: AlertProps = {
    message: "",
    setMessage: (message: string | undefined) => changeMessage(message),
  };
  return render(<AlertComponent {...defaultProps} {...props} />);
}

describe("<AlertComponent />", () => {
  test("should display none", async () => {
    const { queryAllByTestId } = renderLogsComponent();
    const toast = queryAllByTestId("toast");
    expect(toast).toHaveLength(0);
  });
  test("should display a message", async () => {
    const { queryAllByText } = renderLogsComponent({ message: "ALERT!!" });
    const toast = queryAllByText("ALERT!!");
    expect(toast).toHaveLength(1);
  });
});
