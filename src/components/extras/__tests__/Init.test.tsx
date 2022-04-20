import { InitComponent, InitComponentProps } from "../Init";
import { findByTestId, fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

function renderInitComponent(props: Partial<InitComponentProps> = {}) {
  const defaultProps: InitComponentProps = {
    error: false,
    message: "",
  };
  return render(<InitComponent {...defaultProps} {...props} />);
}

describe("<InitComponent />", () => {
  test("should display loading", async () => {
    const { findByTestId } = renderInitComponent();
    const spinner = findByTestId("init-spinner");
    expect(spinner).toBeDefined();
    const success = findByTestId("init-success-icon");
    expect(success).toBeDefined();
  });
  test("should display error when can not init", async () => {
    const { findByTestId } = renderInitComponent({ error: true });
    const icon = await findByTestId("init-error-icon");
    expect(icon).toBeDefined();
  });
});
